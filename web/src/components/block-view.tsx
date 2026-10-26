import Link from "next/link";
import type { schema } from "@/db";
import { renderInline, stripBlockMarker } from "@/lib/md";
import { Chip } from "@/components/web/ui";
import { StudyFigureSlot } from "@/components/study-figures/slot";
import { PLACEHOLDER_RE, findFigure } from "@/components/study-figures/registry";
import { STUDY_FIGURES } from "@/components/study-figures";
import { HspaEvidence } from "@/components/hspa-evidence";
import { forBlock } from "@/content/overeni-hspa";

type Block = typeof schema.blocks.$inferSelect;

/** Tlačítka u odstavce: viditelně 36 px, plocha pro prst 44 px (pseudoprvek přesahuje nahoru i dolů). */
const ACTION =
  "relative inline-flex h-9 items-center rounded-full border border-line text-[14px] font-semibold text-muted transition-colors before:absolute before:-inset-y-1 before:inset-x-0 before:content-[''] hover:border-line-strong hover:bg-sage-soft hover:text-forest group-hover:border-line-strong";

function hrefFor(slug: string, key: string, query: { kod: string | null; s: string | null }) {
  const p = new URLSearchParams();
  p.set("b", key);
  if (query.kod) p.set("kod", query.kod);
  if (query.s) p.set("s", query.s);
  return `/d/${slug}?${p.toString()}#${encodeURIComponent(key)}`;
}

/**
 * `readOnly` = veřejná čtečka: žádné odkazy do interní části. S `commentable` má každý odstavec
 * tlačítko „Připomínka“ (`data-comment-for`), které obsluhuje klientský obal PublicComments.
 * Veřejná čtečka má větší čtecí typografii (serifové nadpisy, text 19 px); interní čtečka
 * zachovává dnešní hustotu a jen přebírá tokeny. Chování (id bloků, data-selected, odkazy) je stejné.
 */
export function BlockView({
  block,
  slug,
  count,
  selected,
  query,
  readOnly = false,
  commentable = false,
  lazyFigures = false,
  headingBase,
}: {
  block: Block;
  slug: string;
  count?: { n: number; open: number };
  selected: boolean;
  query: { kod: string | null; s: string | null };
  readOnly?: boolean;
  commentable?: boolean;
  /** Grafy vykreslit až u zorného pole (veřejná čtečka; ne tisk, ne čtečka týmu). */
  lazyFigures?: boolean;
  /**
   * Úroveň nadpisu kapitoly na veřejné stránce kapitoly (nadpis kapitoly je h1 stránky). Nadpisy
   * uvnitř kapitoly se pak vykreslí jako skutečné h2–h6; bez ní zůstávají role="heading".
   */
  headingBase?: number;
}) {
  const href = hrefFor(slug, block.blockKey, query);
  const body = stripBlockMarker(block.md, block.kind);
  const inline = (t: string) => renderInline(t, readOnly ? { codeHref: () => null } : {});
  // Doložení v HSPA Monitoru: záznamy registru ověření, které sedí na tento blok (cesta nadpisů + úryvek).
  const evidence = block.kind === "heading" ? [] : forBlock(block.headingPath, block.text);

  let content: React.ReactNode;
  switch (block.kind) {
    case "heading": {
      const lvl = block.level ?? 1;
      const cls = readOnly
        ? lvl === 1
          ? "mt-14 font-serif text-[30px] font-semibold leading-tight tracking-[-0.01em] text-ink md:text-[36px]"
          : lvl === 2
            ? "mt-10 font-serif text-[24px] font-semibold leading-snug text-ink md:text-[28px]"
            : lvl === 3
              ? "mt-8 font-serif text-[21px] font-semibold leading-snug text-ink"
              : "mt-6 text-[19px] font-bold text-ink"
        : lvl === 1
          ? "mt-10 font-serif text-2xl font-semibold tracking-tight"
          : lvl === 2
            ? "mt-8 font-serif text-xl font-semibold tracking-tight"
            : lvl === 3
              ? "mt-6 font-serif text-base font-semibold"
              : "mt-4 text-sm font-semibold";
      if (headingBase !== undefined) {
        const Tag = `h${Math.min(Math.max(lvl - headingBase + 1, 2), 6)}` as "h2";
        content = <Tag className={cls}>{inline(body)}</Tag>;
      } else {
        content = (
          <div className={cls} role="heading" aria-level={Math.min(lvl + 1, 6)}>
            {inline(body)}
          </div>
        );
      }
      break;
    }
    case "table": {
      const meta = block.meta as { header: string[]; rows: string[][] } | null;
      // Prázdný levý horní roh (srovnání variant): první sloupec jsou nadpisy řádků.
      const rowHeads = !!meta && !meta.header[0]?.trim();
      content = meta ? (
        <div
          className={readOnly ? "doc-table-box my-2 overflow-x-auto rounded-card border border-line bg-paper text-[16px]" : "overflow-x-auto"}
          {...(readOnly ? { role: "region", "aria-label": "Tabulka", tabIndex: 0 } : {})}
        >
          <table className="doc-table">
            <thead>
              <tr>{meta.header.map((h, i) => (i === 0 && rowHeads ? <td key={i} /> : <th key={i} scope="col">{inline(h)}</th>))}</tr>
            </thead>
            <tbody>
              {meta.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) =>
                    j === 0 && rowHeads ? (
                      <th key={j} scope="row" className="doc-row-head">
                        {inline(c)}
                      </th>
                    ) : (
                      <td key={j}>{inline(c)}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <pre className="text-xs">{block.md}</pre>
      );
      break;
    }
    case "list_item":
      content = <div className="flex gap-2 pl-2"><span className="text-muted">•</span><p>{inline(body)}</p></div>;
      break;
    case "quote":
      content = <blockquote className={`border-l-2 border-line-strong pl-3 text-muted ${readOnly ? "font-serif italic" : "text-sm"}`}>{inline(body)}</blockquote>;
      break;
    case "code":
      content = <pre className={`overflow-x-auto rounded bg-stone p-2 ${readOnly ? "text-[15px]" : "text-xs"}`}>{block.text}</pre>;
      break;
    default: {
      const ph = body.match(PLACEHOLDER_RE);
      if (ph && findFigure(STUDY_FIGURES, ph[1])) {
        content = <StudyFigureSlot desc={ph[1]} compact={!readOnly} lazy={lazyFigures} />;
      } else {
        content = <p>{inline(body)}</p>;
      }
    }
  }

  return (
    <div id={block.blockKey} data-selected={selected} className={`block-row group relative -mx-2 scroll-mt-16 rounded px-2 py-1.5 ${readOnly ? "" : "hover:bg-paper"}`}>
      {/* Trvalá kotva: odkaz #kotva vede na tentýž text i v dalších verzích (polohový klíč se může posunout). */}
      {block.anchorId && <span id={block.anchorId} aria-hidden className="pointer-events-none absolute -top-16 left-0 block h-0 w-0" />}
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">{content}</div>
        {!readOnly && <Link
          href={href}
          scroll={false}
          className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[11px] tabular-nums ${count?.n ? "bg-accent-soft text-accent" : "text-transparent group-hover:text-muted group-hover:bg-stone"}`}
          title="Připomínky k tomuto bloku"
        >
          {count?.n ? `💬 ${count.n}` : "💬"}
        </Link>}
        {readOnly && commentable && block.kind !== "heading" && (
          <div className="mt-0.5 flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-start">
            <button
              type="button"
              data-copy-link={block.anchorId ?? block.blockKey}
              aria-label="Zkopírovat odkaz na toto místo"
              title="Zkopírovat odkaz na toto místo"
              className={`${ACTION} w-9 justify-center px-0 opacity-70 group-hover:opacity-100 focus-visible:opacity-100`}
            >
              <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
                <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
              </svg>
            </button>
            <button
              type="button"
              data-comment-for={block.blockKey}
              data-comment-quote={block.text.slice(0, 300)}
              aria-label="Připomínka k tomuto místu"
              className={`${ACTION} w-9 justify-center sm:w-auto sm:px-3`}
            >
              {/* Na mobilu jen ikona, aby tlačítka neubírala šířku textu. */}
              <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden">
                <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
              </svg>
              <span className="hidden sm:inline">Připomínka</span>
            </button>
          </div>
        )}
      </div>
      {(block.hasVerify || block.codes.length > 0) && (
        readOnly ? (
          block.hasVerify && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              <Chip variant="verify" />
            </div>
          )
        ) : (
          <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-muted opacity-70 group-hover:opacity-100">
            {block.hasVerify && <span className="inline-flex items-center whitespace-nowrap rounded-full bg-verify-bg px-2 leading-5 font-semibold text-verify-fg">Ověřit</span>}
          </div>
        )
      )}
      {evidence.length > 0 && <HspaEvidence records={evidence} dense={!readOnly} />}
    </div>
  );
}
