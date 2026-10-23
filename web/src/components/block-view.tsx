import Link from "next/link";
import type { schema } from "@/db";
import { renderInline, stripBlockMarker } from "@/lib/md";

type Block = typeof schema.blocks.$inferSelect;

function hrefFor(slug: string, key: string, query: { kod: string | null; s: string | null }) {
  const p = new URLSearchParams();
  p.set("b", key);
  if (query.kod) p.set("kod", query.kod);
  if (query.s) p.set("s", query.s);
  return `/d/${slug}?${p.toString()}#${encodeURIComponent(key)}`;
}

export function BlockView({ block, slug, count, selected, query }: { block: Block; slug: string; count?: { n: number; open: number }; selected: boolean; query: { kod: string | null; s: string | null } }) {
  const href = hrefFor(slug, block.blockKey, query);
  const body = stripBlockMarker(block.md, block.kind);

  let content: React.ReactNode;
  switch (block.kind) {
    case "heading": {
      const lvl = block.level ?? 1;
      const cls = lvl === 1 ? "mt-10 text-2xl font-semibold tracking-tight" : lvl === 2 ? "mt-8 text-xl font-semibold tracking-tight" : lvl === 3 ? "mt-6 text-base font-semibold" : "mt-4 text-sm font-semibold";
      content = <div className={cls}>{renderInline(body)}</div>;
      break;
    }
    case "table": {
      const meta = block.meta as { header: string[]; rows: string[][] } | null;
      content = meta ? (
        <div className="overflow-x-auto">
          <table className="doc-table">
            <thead>
              <tr>{meta.header.map((h, i) => <th key={i}>{renderInline(h)}</th>)}</tr>
            </thead>
            <tbody>
              {meta.rows.map((r, i) => (
                <tr key={i}>{r.map((c, j) => <td key={j}>{renderInline(c)}</td>)}</tr>
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
      content = <div className="flex gap-2 pl-2"><span className="text-muted">•</span><p>{renderInline(body)}</p></div>;
      break;
    case "quote":
      content = <blockquote className="border-l-2 border-line pl-3 text-sm text-muted">{renderInline(body)}</blockquote>;
      break;
    case "code":
      content = <pre className="overflow-x-auto rounded bg-stone-100 p-2 text-xs">{block.text}</pre>;
      break;
    default:
      content = <p>{renderInline(body)}</p>;
  }

  return (
    <div id={block.blockKey} data-selected={selected} className="block-row group relative -mx-2 scroll-mt-16 rounded px-2 py-1.5 hover:bg-stone-50">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">{content}</div>
        <Link
          href={href}
          scroll={false}
          className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[11px] tabular-nums ${count?.n ? "bg-accent-soft text-accent" : "text-transparent group-hover:text-muted group-hover:bg-stone-100"}`}
          title="Připomínky k tomuto bloku"
        >
          {count?.n ? `💬 ${count.n}` : "💬"}
        </Link>
      </div>
      {(block.hasVerify || block.codes.length > 0) && (
        <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-muted opacity-70 group-hover:opacity-100">
          {block.hasVerify && <span className="chip border-amber-300 bg-amber-50 text-amber-900">Ověřit</span>}
        </div>
      )}
    </div>
  );
}
