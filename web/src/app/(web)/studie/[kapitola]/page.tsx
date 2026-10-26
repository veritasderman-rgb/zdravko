import Link from "next/link";
import { notFound } from "next/navigation";
import { META } from "@/content/reforma";
import { BlockView } from "@/components/block-view";
import { JsonLd } from "@/components/json-ld";
import { PublicComments } from "@/components/web/public-comments";
import { SearchForm } from "@/components/web/search-form";
import { StudyToc } from "@/components/web/study-toc";
import { chapterDescription, readingMinutes } from "@/lib/study";
import { loadStudy } from "@/lib/study-data";
import { AUTHOR, PUBLISHER, absUrl, breadcrumbs, metaFor } from "@/lib/seo";
import { StudyReader } from "../study-reader";

// Kapitola studie jako samostatná stránka. Vykreslí se při první návštěvě a pak se drží
// v mezipaměti; nová verze studie se projeví nejpozději do pěti minut po importu. Když databáze
// při obnově neodpoví, zůstává v mezipaměti poslední dobrá verze stránky.
export const revalidate = 300;

export async function generateStaticParams() {
  return [];
}

async function findChapter(slug: string) {
  const study = await loadStudy();
  if (!study) return null;
  const i = study.chapters.findIndex((c) => c.slug === slug);
  return i < 0 ? null : { study, i, chapter: study.chapters[i] };
}

export async function generateMetadata({ params }: PageProps<"/studie/[kapitola]">) {
  const found = await findChapter((await params).kapitola);
  if (!found) return { title: "Kapitola nenalezena", robots: { index: false } };
  const { chapter } = found;
  return metaFor(`/studie/${chapter.slug}`, chapter.title, chapterDescription(chapter));
}

/** Datum verze ke konzultaci (META.subtitle končí datem). */
const VERSION_DATE = META.subtitle.split(" · ").pop() ?? "";

export default async function ChapterPage({ params }: PageProps<"/studie/[kapitola]">) {
  const found = await findChapter((await params).kapitola);
  if (!found) notFound();
  const { study, i, chapter } = found;
  const prev = study.chapters[i - 1];
  const next = study.chapters[i + 1];
  // Oddíly kapitoly do obsahu: dvě úrovně pod nadpisem kapitoly.
  const sections = chapter.blocks
    .filter((b) => b.kind === "heading" && (b.level ?? 1) <= chapter.level + 2)
    .map((b) => ({ key: b.blockKey, text: b.text, depth: (b.level ?? 1) - chapter.level - 1 }));
  const url = absUrl(`/studie/${chapter.slug}`);

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: chapter.title,
      description: chapterDescription(chapter),
      url,
      inLanguage: "cs",
      author: AUTHOR,
      publisher: { "@id": PUBLISHER["@id"] },
      version: study.version.label,
      isPartOf: { "@type": "Report", name: study.doc.title, url: absUrl("/studie") },
    },
    breadcrumbs([
      { name: "Studie", path: "/studie" },
      { name: chapter.title, path: `/studie/${chapter.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={ld} />
      <StudyReader outline={<StudyToc chapters={study.chapters} current={chapter.slug} sections={sections} />} headingKeys={sections.map((s) => s.key)}>
        <header className="max-w-[70ch] pb-6">
          <nav aria-label="Drobečková navigace" className="text-[16px] text-muted">
            <ol className="flex flex-wrap items-center gap-x-2">
              <li>
                <Link href="/studie" className="underline hover:text-forest">
                  Studie
                </Link>
              </li>
              <li aria-hidden>›</li>
              <li aria-current="page" className="text-ink">
                Kapitola {i + 1} z {study.chapters.length}
              </li>
            </ol>
          </nav>
          <h1 className="mt-3 text-balance font-serif text-[32px] font-semibold leading-[1.1] tracking-[-0.01em] text-ink sm:text-[42px]">{chapter.title}</h1>
          <p className="mt-3 text-[17px] text-muted">
            {study.version.label.split(" (")[0]} ke konzultaci, {VERSION_DATE} · čtení asi {readingMinutes(chapter)} min ·{" "}
            <a href="/studie.pdf" className="underline hover:text-forest">
              celá studie v PDF
            </a>
          </p>
          <p className="mt-3 text-[17px] text-muted">U každého odstavce můžete napsat připomínku nebo zkopírovat odkaz na něj.</p>
        </header>

        <PublicComments documentId={study.doc.id} versionId={study.version.id}>
          <article id="studie-text" className="prose-block study-text max-w-[70ch] text-[19px] leading-[1.6] text-ink [&_a]:[overflow-wrap:anywhere]">
            {chapter.blocks.map((b) => (
              <BlockView key={b.blockKey} block={b} slug="studie" selected={false} query={{ kod: null, s: null }} readOnly commentable lazyFigures headingBase={chapter.level} />
            ))}
          </article>
        </PublicComments>

        <nav aria-label="Další kapitoly" className="mt-14 grid max-w-[70ch] gap-3 border-t border-line pt-8 sm:grid-cols-2">
          {prev ? (
            <Link href={`/studie/${prev.slug}`} className="flex min-h-11 flex-col rounded-card border border-line bg-paper p-4 hover:border-forest hover:bg-sage-soft">
              <span className="text-[15px] font-semibold text-muted">← Předchozí kapitola</span>
              <span className="mt-1 font-serif text-[19px] font-semibold leading-snug text-ink">{prev.title}</span>
            </Link>
          ) : (
            <Link href="/studie" className="flex min-h-11 flex-col rounded-card border border-line bg-paper p-4 hover:border-forest hover:bg-sage-soft">
              <span className="text-[15px] font-semibold text-muted">← Zpět</span>
              <span className="mt-1 font-serif text-[19px] font-semibold leading-snug text-ink">Úvod a přehled kapitol</span>
            </Link>
          )}
          {next && (
            <Link href={`/studie/${next.slug}`} className="flex min-h-11 flex-col rounded-card border border-line bg-paper p-4 text-right hover:border-forest hover:bg-sage-soft sm:col-start-2">
              <span className="text-[15px] font-semibold text-muted">Další kapitola →</span>
              <span className="mt-1 font-serif text-[19px] font-semibold leading-snug text-ink">{next.title}</span>
            </Link>
          )}
        </nav>

        <div className="mt-12 max-w-[70ch] rounded-panel border border-line bg-paper p-5 sm:p-7">
          <SearchForm onlyStudy id="hledat-ve-studii" label="Hledat v celé studii" placeholder="například triáž, porodnice, J4" />
          <p className="mt-4 text-[17px] text-muted">
            Připomínku ke studii jako celku napíšete{" "}
            <Link href="/studie#pripominka" className="underline hover:text-forest">
              na úvodní stránce studie
            </Link>
            .
          </p>
        </div>
      </StudyReader>
    </>
  );
}
