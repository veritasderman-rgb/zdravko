import Link from "next/link";
import type { schema } from "@/db";
import { renderInline, stripBlockMarker } from "@/lib/md";
import { Chip } from "@/components/web/ui";

type Block = typeof schema.blocks.$inferSelect;

function hrefFor(slug: string, key: string, query: { kod: string | null; s: string | null }) {
  const p = new URLSearchParams();
  p.set("b", key);
  if (query.kod) p.set("kod", query.kod);
  if (query.s) p.set("s", query.s);
  return `/d/${slug}?${p.toString()}#${encodeURIComponent(key)}`;
}

/**
 * `readOnly` = veřejná čtečka bez připomínek: žádné ikony komentářů ani odkazy do interní části.
 * Veřejná čtečka má větší čtecí typografii (serifové nadpisy, text 19 px); interní čtečka
 * zachovává dnešní hustotu a jen přebírá tokeny. Chování (id bloků, data-selected, odkazy) je stejné.
 */
export function BlockView({ block, slug, count, selected, query, readOnly = false }: { block: Block; slug: string; count?: { n: number; open: number }; selected: boolean; query: { kod: string | null; s: string | null }; readOnly?: boolean }) {
  const href = hrefFor(slug, block.blockKey, query);
  const body = stripBlockMarker(block.md, block.kind);
  const inline = (t: string) => renderInline(t, readOnly ? { codeHref: () => null } : {});

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
      content = (
        <div className={cls} role="heading" aria-level={Math.min(lvl + 1, 6)}>
          {inline(body)}
        </div>
      );
      break;
    }
    case "table": {
      const meta = block.meta as { header: string[]; rows: string[][] } | null;
      content = meta ? (
        <div
          className={readOnly ? "doc-table-box my-2 overflow-x-auto rounded-card border border-line bg-paper text-[16px]" : "overflow-x-auto"}
          {...(readOnly ? { role: "region", "aria-label": "Tabulka", tabIndex: 0 } : {})}
        >
          <table className="doc-table">
            <thead>
              <tr>{meta.header.map((h, i) => <th key={i}>{inline(h)}</th>)}</tr>
            </thead>
            <tbody>
              {meta.rows.map((r, i) => (
                <tr key={i}>{r.map((c, j) => <td key={j}>{inline(c)}</td>)}</tr>
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
    default:
      content = <p>{inline(body)}</p>;
  }

  return (
    <div id={block.blockKey} data-selected={selected} className={`block-row group relative -mx-2 scroll-mt-16 rounded px-2 py-1.5 ${readOnly ? "" : "hover:bg-paper"}`}>
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
    </div>
  );
}
