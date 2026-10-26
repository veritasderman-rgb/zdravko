import Link from "next/link";
import { getBlocks, getDocumentBySlug } from "@/lib/queries";
import { NextStep, PageHero, Section } from "@/components/web/ui";
import { STUDY_FIGURES } from "@/components/study-figures";
import { PLACEHOLDER_RE, captionOf, findFigure } from "@/components/study-figures/registry";
import { DEPENDENCY_FIGURES } from "@/content/figures/zavislosti";
import { renderInline, stripBlockMarker } from "@/lib/md";
import { pageMeta } from "@/lib/seo";

// Místo obrázku ve studii, nadpis a okolní odstavce se berou z aktuální verze v databázi,
// takže odkazy sedí i po importu nové verze.
export const dynamic = "force-dynamic";
export const metadata = pageMeta("/studie/zavislosti");

type Block = Awaited<ReturnType<typeof getBlocks>>[number];
type Place = { anchor: string; heading: string; caption: string; before: Block | null; after: Block | null };

const codeHref = (code: string) => `/hledat?jen=studie&q=${encodeURIComponent(code)}`;
// Kotva vede přes /studie/kotva do kapitoly, ve které odstavec je.
const studyHref = (anchor: string) => `/studie/kotva?k=${encodeURIComponent(anchor)}`;

const BY_ID = new Map(DEPENDENCY_FIGURES.map((f) => [f.id, f]));

/** Najde ve studii zástupné odstavce grafů závislostí a odstavce, které k nim patří. */
function findPlaces(blocks: Block[]): Map<string, Place> {
  const bodies = blocks.map((b) => stripBlockMarker(b.md, b.kind));
  const figureAt = (i: number) => {
    const ph = blocks[i].kind === "paragraph" ? bodies[i].match(PLACEHOLDER_RE) : null;
    return ph ? { fig: findFigure(STUDY_FIGURES, ph[1]), desc: ph[1] } : null;
  };
  const isText = (i: number) => i >= 0 && i < blocks.length && blocks[i].kind === "paragraph" && !figureAt(i);
  const out = new Map<string, Place>();
  blocks.forEach((b, i) => {
    const f = figureAt(i);
    const dep = f?.fig ? BY_ID.get(f.fig.id) : undefined;
    if (!f || !dep || out.has(dep.id)) return;
    // Text ze stejné části studie; přes nadpis se nesahá.
    const before = dep.context.before && isText(i - 1) && blocks[i - 1].headingPath === b.headingPath ? blocks[i - 1] : null;
    const after = dep.context.after && isText(i + 1) && blocks[i + 1].headingPath === b.headingPath ? blocks[i + 1] : null;
    // Nadpis bez názvu dokumentu na začátku cesty.
    const heading = b.headingPath.split(" › ").slice(1).join(" › ") || b.headingPath;
    out.set(dep.id, { anchor: b.anchorId ?? b.blockKey, heading, caption: captionOf(f.desc), before, after });
  });
  return out;
}

function StudyText({ block, label }: { block: Block; label: string }) {
  return (
    <div className="border-l-2 border-line-strong pl-4">
      <p className="text-[14px] font-bold uppercase tracking-[0.04em] text-muted">{label}</p>
      <p className="mt-1 text-[17px] leading-relaxed text-ink-2">{renderInline(stripBlockMarker(block.md, block.kind), { codeHref })}</p>
      <Link href={studyHref(block.anchorId ?? block.blockKey)} className="mt-1 inline-block text-[15px] font-semibold text-forest underline">
        Tento odstavec ve studii
      </Link>
    </div>
  );
}

export default async function ZavislostiPage() {
  let places = new Map<string, Place>();
  try {
    const found = await getDocumentBySlug("studie");
    if (found) places = findPlaces(await getBlocks(found.version.id));
  } catch (e) {
    // Grafy jsou v kódu; bez databáze jen chybí odkazy na přesné místo ve studii.
    console.error("Grafy závislostí: databáze není dostupná", e);
  }
  const figures = DEPENDENCY_FIGURES.map((d) => ({ ...d, fig: STUDY_FIGURES.find((f) => f.id === d.id)!, place: places.get(d.id) ?? null }));

  return (
    <>
      <PageHero
        eyebrow="Odborná studie · grafy závislostí"
        title="Co na čem stojí, na jedné stránce"
        lead="Šest grafů ze studie, které ukazují pořadí a závislosti opatření. U každého je text, kterým ho studie uvádí a vysvětluje, a odkaz na jeho místo ve studii. Kód opatření (třeba J2) vede na hledání ve studii."
        aside={
          <nav aria-label="Grafy na této stránce" className="rounded-card border border-line bg-paper p-5">
            <p className="text-[15px] font-bold uppercase tracking-[0.04em] text-muted">Na této stránce</p>
            <ol className="mt-3 flex flex-col gap-2 text-[17px]">
              {figures.map((f, i) => (
                <li key={f.id}>
                  <a href={`#${f.id}`} className="font-semibold text-forest underline">
                    {i + 1}. {f.short}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[15px] text-muted">
              Celé znění: <Link href="/studie" className="underline">studie ke čtení</Link>
            </p>
          </nav>
        }
      />

      {figures.map((f, i) => {
        const Cmp = f.fig.Component;
        const p = f.place;
        return (
          <Section key={f.id} id={f.id} tone={i % 2 ? undefined : "paper"} eyebrow={`Graf ${i + 1} z ${figures.length}`} title={f.short} lead={f.what}>
            <div className="flex flex-col gap-6">
              {p && (
                <p className="text-[16px] text-muted">
                  Ve studii:{" "}
                  <Link href={studyHref(p.anchor)} className="font-semibold text-forest underline">
                    {p.heading}
                  </Link>
                </p>
              )}
              {p?.before && <StudyText block={p.before} label="Text studie před grafem" />}
              <figure data-figure={f.id} className="scroll-mt-20">
                <Cmp />
                {p && <figcaption className="mt-2 text-[15px] text-muted">{p.caption}</figcaption>}
              </figure>
              {p?.after && <StudyText block={p.after} label="Text studie za grafem" />}
              {f.codes.length > 0 && (
                <div>
                  <p className="text-[14px] font-bold uppercase tracking-[0.04em] text-muted">Opatření v grafu: najít ve studii</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {f.codes.map((c) => (
                      <li key={c}>
                        <Link href={codeHref(c)} className="code-ref">
                          {c}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="flex flex-wrap gap-x-5 gap-y-1 text-[16px]">
                {p ? (
                  <Link href={studyHref(p.anchor)} className="font-semibold text-forest underline">
                    Otevřít graf ve studii
                  </Link>
                ) : (
                  <Link href={`/hledat?jen=studie&q=${encodeURIComponent(f.short)}`} className="font-semibold text-forest underline">
                    Hledat ve studii
                  </Link>
                )}
                <a href="#obsah" className="text-muted underline">
                  Nahoru
                </a>
              </p>
            </div>
          </Section>
        );
      })}

      <NextStep title="Celé znění studie" text="Plný text s hledáním, osnovou a možností napsat připomínku k libovolnému odstavci." href="/studie" label="Číst studii" />
    </>
  );
}
