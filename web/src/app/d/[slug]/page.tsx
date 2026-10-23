import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getBlocks, getCommentCountsByBlock, getCommentsForBlock, getDocumentBySlug, getCodesMap } from "@/lib/queries";
import { Outline } from "@/components/outline";
import { BlockView } from "@/components/block-view";
import { CommentPanel } from "@/components/comment-panel";
import { isCode } from "@/lib/codes";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/d/[slug]">) {
  const { slug } = await params;
  const d = await getDocumentBySlug(slug);
  return { title: d?.doc.title ?? "Dokument" };
}

export default async function DocumentPage({ params, searchParams }: PageProps<"/d/[slug]">) {
  const session = await requireSession();
  const { slug } = await params;
  const sp = await searchParams;
  const selected = typeof sp.b === "string" ? sp.b : null;
  const codeFilter = isCode(sp.kod) ? sp.kod : null;
  const sectionFilter = typeof sp.s === "string" ? sp.s : null;

  const found = await getDocumentBySlug(slug);
  if (!found) notFound();
  const { doc, version } = found;

  const [blocks, counts, selectedComments] = await Promise.all([
    getBlocks(version.id),
    getCommentCountsByBlock(doc.id),
    selected ? getCommentsForBlock(doc.id, selected) : Promise.resolve([]),
  ]);

  const selectedBlock = selected ? blocks.find((b) => b.blockKey === selected) ?? null : null;
  // Kódy pro předvyplnění: z bloku, jinak z nadpisu jeho sekce (např. „J2 · Sesterská složka…“)
  const sectionHeading = selectedBlock ? blocks.find((b) => b.kind === "heading" && b.sectionKey === selectedBlock.sectionKey) : null;
  const defaultCodes = selectedBlock?.codes.length ? selectedBlock.codes : sectionHeading?.codes ?? [];
  const codeLabels = await getCodesMap([...new Set([...(selectedBlock?.codes ?? []), ...defaultCodes])]);

  const headings = blocks.filter((b) => b.kind === "heading" && (b.level ?? 1) <= 3);
  const visible = blocks.filter((b) => {
    if (codeFilter && !b.codes.includes(codeFilter) && b.kind !== "heading") return false;
    if (sectionFilter && !b.sectionKey.startsWith(sectionFilter) && b.kind !== "heading") return false;
    return true;
  });
  // Při filtru skrýt nadpisy, pod kterými nic nezůstalo
  const shown = codeFilter || sectionFilter
    ? visible.filter((b, i) => {
        if (b.kind !== "heading") return true;
        const next = visible.slice(i + 1).find((x) => x.kind !== "heading" || (x.level ?? 1) <= (b.level ?? 1));
        return next && next.kind !== "heading";
      })
    : visible;

  return (
    <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-0 px-2 lg:grid-cols-[260px_minmax(0,1fr)_380px]">
      <aside className="hidden max-h-[calc(100vh-45px)] overflow-y-auto border-r border-line py-4 pr-3 lg:sticky lg:top-[45px] lg:block">
        <Outline headings={headings} slug={slug} counts={counts} current={selectedBlock?.sectionKey ?? null} />
      </aside>

      <main className="min-w-0 px-2 py-4 lg:px-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span>{version.label}</span>
          <span>·</span>
          <span>{blocks.length} bloků</span>
          {codeFilter && (
            <>
              <span>·</span>
              <span>
                filtr <span className="code-ref">{codeFilter}</span> ({shown.filter((b) => b.kind !== "heading").length} bloků){" "}
                <Link href={`/d/${slug}`} className="underline">zrušit</Link>
              </span>
            </>
          )}
          {sectionFilter && (
            <>
              <span>·</span>
              <span>
                jen část <Link href={`/d/${slug}`} className="underline">zobrazit celý dokument</Link>
              </span>
            </>
          )}
        </div>
        <article className="prose-block">
          {shown.map((b) => (
            <BlockView key={b.blockKey} block={b} slug={slug} count={counts.get(b.blockKey)} selected={b.blockKey === selected} query={{ kod: codeFilter, s: sectionFilter }} />
          ))}
        </article>
      </main>

      <aside className="border-l border-line bg-paper px-4 py-4 lg:sticky lg:top-[45px] lg:max-h-[calc(100vh-45px)] lg:overflow-y-auto">
        <CommentPanel doc={doc} version={version} block={selectedBlock} comments={selectedComments} session={session} codeLabels={codeLabels} slug={slug} defaultCodes={defaultCodes} />
      </aside>
    </div>
  );
}
