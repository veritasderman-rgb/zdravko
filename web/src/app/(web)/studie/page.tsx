import Link from "next/link";
import { META } from "@/content/reforma";
import { Button, Callout, Container, Eyebrow, NextStep, PageHero, TextLink } from "@/components/web/ui";
import { PublicCommentForm } from "@/components/web/public-comment-form";
import { SearchForm } from "@/components/web/search-form";
import { JsonLd } from "@/components/json-ld";
import { chapterDescription, readingMinutes, type Chapter } from "@/lib/study";
import { loadStudy } from "@/lib/study-data";
import { AUTHOR, PUBLISHER, absUrl, pageMeta } from "@/lib/seo";
import { LegacyStudyLinks } from "./legacy-links";
import { STRANKY } from "@/content/stranky";

// Úvod studie a přehled kapitol. Text kapitol je na /studie/[kapitola]; stránka se drží
// v mezipaměti a obnovuje se nejvýš jednou za pět minut.
export const revalidate = 300;

export const metadata = pageMeta("/studie");

/** Datum verze ke konzultaci (META.subtitle končí datem). */
const VERSION_DATE = META.subtitle.split(" · ").pop() ?? "";

function Unavailable() {
  return (
    <>
      <PageHero eyebrow="Odborná studie" title="Studie se teď nedá načíst" lead="Plné znění studie čteme z databáze a ta teď neodpovídá. Zkuste to prosím za chvíli znovu." />
      <Container className="pb-16">
        <div className="max-w-[44em]">
          <Callout title="Mezitím si můžete přečíst shrnutí">
            Hlavní čísla a změny najdete na webu: <TextLink href="/co-chceme">pět změn</TextLink>, <TextLink href="/penize">peníze</TextLink> a <TextLink href="/otazky">časté otázky</TextLink>. Celá studie je také{" "}
            <TextLink href="/studie.pdf">v PDF</TextLink>.
          </Callout>
        </div>
      </Container>
    </>
  );
}

const GROUPS: { title: string; test: (c: Chapter) => boolean }[] = [
  { title: "Úvod", test: (c) => !c.slug.startsWith("cast-") && !c.slug.startsWith("priloha-") },
  { title: "Části studie", test: (c) => c.slug.startsWith("cast-") },
  { title: "Přílohy", test: (c) => c.slug.startsWith("priloha-") },
];

export default async function StudiePage() {
  let study: Awaited<ReturnType<typeof loadStudy>> = null;
  try {
    study = await loadStudy();
  } catch (e) {
    console.error("Studie: databáze není dostupná", e);
  }
  if (!study) return <Unavailable />;

  const { doc, version, chapters, blocks } = study;
  const minutes = chapters.reduce((n, c) => n + readingMinutes(c), 0);
  const grouped = GROUPS.map((g) => ({ title: g.title, items: chapters.filter(g.test) })).filter((g) => g.items.length > 0);
  // Mimo skupiny (nečekaný nový nadpis) nic nezmizí: přidá se do úvodu.
  const shown = new Set(grouped.flatMap((g) => g.items.map((c) => c.slug)));
  const rest = chapters.filter((c) => !shown.has(c.slug));
  if (rest.length) grouped[0]?.items.push(...rest);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: doc.title,
    description: STRANKY["/studie"].description,
    url: absUrl("/studie"),
    inLanguage: "cs",
    author: AUTHOR,
    publisher: { "@id": PUBLISHER["@id"] },
    version: version.label,
    encoding: { "@type": "MediaObject", contentUrl: absUrl("/studie.pdf"), encodingFormat: "application/pdf" },
    hasPart: chapters.map((c, i) => ({ "@type": "Article", position: i + 1, headline: c.title, url: absUrl(`/studie/${c.slug}`) })),
  };

  return (
    <>
      <JsonLd data={ld} />
      <LegacyStudyLinks />
      <PageHero
        eyebrow="Odborná studie"
        title={doc.title}
        lead="Plné znění odborné studie po kapitolách. Místa označená „Ověřujeme“ jsou údaje, které autoři zatím neověřili v primárním zdroji. Komentovat může každý: u odstavce klikněte na „Připomínka“, obecnou připomínku napište dole. Stačí jakékoli jméno a e-mail, nic z toho nezveřejňujeme."
        aside={
          <div className="flex flex-col gap-5">
            <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-[17px]">
              <dt className="font-semibold text-muted">Verze</dt>
              <dd className="text-ink">{version.label}</dd>
              <dt className="font-semibold text-muted">Datum</dt>
              <dd className="text-ink">{VERSION_DATE}</dd>
              <dt className="font-semibold text-muted">Autor</dt>
              <dd className="text-ink">{META.author}</dd>
              <dt className="font-semibold text-muted">Rozsah</dt>
              <dd className="text-ink">
                {chapters.length} kapitol, {blocks.length} odstavců, tabulek a odrážek; čtení asi {Math.round(minutes / 60)} hodin
              </dd>
            </dl>
            <div className="study-actions flex flex-wrap gap-3">
              <Button href="#kapitoly" variant="secondary">
                Obsah studie
              </Button>
              <Button href="#pripominka" variant="secondary">
                Napsat připomínku
              </Button>
              <Button href="/studie/zavislosti" variant="secondary">
                Grafy závislostí
              </Button>
              <Button href="/studie.pdf" variant="secondary" icon="download">
                Stáhnout PDF
              </Button>
            </div>
          </div>
        }
      />

      <section id="kapitoly" aria-labelledby="kapitoly-nadpis" className="scroll-mt-6 border-t border-line bg-paper py-12 md:py-16">
        <Container>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <Eyebrow>Obsah</Eyebrow>
              <h2 id="kapitoly-nadpis" className="text-balance font-serif text-[28px] font-semibold leading-[1.15] text-ink sm:text-[34px]">
                Kapitoly studie
              </h2>
            </div>
            <SearchForm onlyStudy id="hledat-ve-studii" label="Hledat ve studii" placeholder="například triáž, porodnice, sestry, J4" />
            {grouped.map((g) => (
              <div key={g.title} className="flex flex-col gap-3">
                <h3 className="text-[15px] font-bold uppercase tracking-[0.06em] text-forest">{g.title}</h3>
                <ol className="grid gap-3 md:grid-cols-2">
                  {g.items.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/studie/${c.slug}`} className="flex h-full flex-col gap-2 rounded-card border border-line bg-sand p-5 hover:border-forest hover:bg-sage-soft">
                        <span className="font-serif text-[21px] font-semibold leading-snug text-ink">{c.title}</span>
                        <span className="text-[16px] leading-relaxed text-ink-2">{chapterDescription(c, 180)}</span>
                        <span className="mt-auto text-[15px] text-muted">čtení asi {readingMinutes(c)} min</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="pripominka" aria-labelledby="pripominka-nadpis" className="scroll-mt-20 border-t border-line py-12 md:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-14">
            <div className="flex flex-col gap-3">
              <Eyebrow>Komentovat studii</Eyebrow>
              <h2 id="pripominka-nadpis" className="text-balance font-serif text-[28px] font-semibold leading-[1.15] text-ink sm:text-[34px]">
                Obecná připomínka ke studii
              </h2>
              <p className="text-[17px] text-muted sm:text-lg">
                K jednotlivým odstavcům pište přes tlačítko „Připomínka“ v textu kapitoly. Sem patří to, co se týká studie jako celku: co chybí, co je špatně postavené, co byste udělali jinak.
              </p>
              <p className="text-[17px] text-muted sm:text-lg">
                Stačí jakékoli jméno a e-mail. Nic z toho nezveřejňujeme; ve vypořádání uvádíme jen názvy organizací. Připomínky odborných organizací vyřizujeme přednostně, veřejné po nich.
              </p>
            </div>
            <div className="rounded-panel border border-line bg-sand p-5 sm:p-7">
              <PublicCommentForm documentId={doc.id} versionId={version.id} blockKey="obecne" />
            </div>
          </div>
        </Container>
      </section>

      <NextStep title="Co se změní pro vás" text="Pět změn a devět situací, dnes a po reformě. Čtení na pět minut." href="/co-chceme" label="Co se změní pro mě" />
    </>
  );
}
