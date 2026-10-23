import { getBlocks, getDocumentBySlug } from "@/lib/queries";
import { META } from "@/content/reforma";
import { Outline } from "@/components/outline";
import { BlockView } from "@/components/block-view";
import { Button, Callout, Container, Eyebrow, NextStep, PageHero, TextLink } from "@/components/web/ui";
import { StudyReader } from "./study-reader";
import { PublicComments } from "@/components/web/public-comments";
import { PublicCommentForm } from "@/components/web/public-comment-form";

// Veřejná čtečka odborné studie s připomínkami bez přihlášení (jméno a e-mail). Text se načítá z databáze
// při každém požadavku, takže build nepotřebuje DATABASE_URL a nová verze studie se
// objeví bez nového buildu.
export const dynamic = "force-dynamic";
export const metadata = { title: "Odborná studie", description: "Plné znění konzultační verze 3.1 studie Zdraví blíž lidem ke čtení." };

/** Datum verze ke konzultaci (META.subtitle končí datem). */
const VERSION_DATE = META.subtitle.split(" · ").pop() ?? "";

function Unavailable() {
  return (
    <>
      <PageHero eyebrow="Odborná studie" title="Studie se teď nedá načíst" lead="Plné znění studie čteme z databáze a ta teď neodpovídá. Zkuste to prosím za chvíli znovu." />
      <Container className="pb-16">
        <div className="max-w-[44em]">
          <Callout title="Mezitím si můžete přečíst shrnutí">
            Hlavní čísla a změny najdete na webu: <TextLink href="/co-chceme">pět změn</TextLink>, <TextLink href="/penize">peníze</TextLink> a <TextLink href="/otazky">časté otázky</TextLink>.
          </Callout>
        </div>
      </Container>
    </>
  );
}

export default async function StudiePage() {
  let found: Awaited<ReturnType<typeof getDocumentBySlug>> = null;
  let blocks: Awaited<ReturnType<typeof getBlocks>> = [];
  try {
    found = await getDocumentBySlug("studie");
    if (found) blocks = await getBlocks(found.version.id);
  } catch (e) {
    console.error("Studie: databáze není dostupná", e);
    found = null;
  }
  if (!found) return <Unavailable />;

  const { doc, version } = found;
  const headings = blocks.filter((b) => b.kind === "heading" && (b.level ?? 1) <= 3);
  const empty = new Map<string, { n: number; open: number }>();

  return (
    <>
      <PageHero
        eyebrow="Odborná studie"
        title={doc.title}
        lead="Plné znění odborné studie ke čtení. Místa označená „Ověřujeme“ jsou údaje, které autoři zatím neověřili v primárním zdroji. Komentovat může každý: u odstavce klikněte na „Připomínka“, obecnou připomínku napište dole. Stačí jakékoli jméno a e-mail, nic z toho nezveřejňujeme."
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
              <dd className="text-ink">{blocks.length} odstavců, tabulek a odrážek</dd>
            </dl>
            <div className="study-actions flex flex-wrap gap-3">
              <Button href="#pripominka" variant="secondary">
                Napsat připomínku
              </Button>
              <Button href="/studie.pdf" variant="secondary" icon="download">
                Stáhnout PDF
              </Button>
            </div>
          </div>
        }
      />

      <StudyReader outline={<Outline headings={headings} slug="studie" counts={empty} current={null} basePath="" />} headingKeys={headings.map((h) => h.blockKey)}>
        <PublicComments documentId={doc.id} versionId={version.id}>
          <article className="prose-block study-text max-w-[70ch] text-[19px] leading-[1.6] text-ink">
            {blocks.map((b) => (
              <BlockView key={b.blockKey} block={b} slug="studie" selected={false} query={{ kod: null, s: null }} readOnly commentable />
            ))}
          </article>
        </PublicComments>
      </StudyReader>

      <section id="pripominka" aria-labelledby="pripominka-nadpis" className="scroll-mt-20 border-t border-line bg-paper py-12 md:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-14">
            <div className="flex flex-col gap-3">
              <Eyebrow>Komentovat studii</Eyebrow>
              <h2 id="pripominka-nadpis" className="text-balance font-serif text-[28px] font-semibold leading-[1.15] text-ink sm:text-[34px]">
                Obecná připomínka ke studii
              </h2>
              <p className="text-[17px] text-muted sm:text-lg">
                K jednotlivým odstavcům pište přes tlačítko „Připomínka“ v textu. Sem patří to, co se týká studie jako celku: co chybí, co je špatně postavené, co byste udělali jinak.
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
