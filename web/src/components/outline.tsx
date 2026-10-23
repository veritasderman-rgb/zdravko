import Link from "next/link";
import type { schema } from "@/db";

type Block = typeof schema.blocks.$inferSelect;

export function Outline({ headings, slug, counts, current }: { headings: Block[]; slug: string; counts: Map<string, { n: number; open: number }>; current: string | null }) {
  // počet připomínek v sekci = součet bloků se stejným prefixem sekce
  const sectionCounts = new Map<string, number>();
  for (const [key, c] of counts) {
    const section = key.split("#")[0];
    for (const h of headings) {
      if (section === h.sectionKey || section.startsWith(h.sectionKey + "/")) sectionCounts.set(h.sectionKey, (sectionCounts.get(h.sectionKey) ?? 0) + c.n);
    }
  }
  return (
    <nav className="text-[13px] leading-5">
      <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted">Osnova</div>
      <ul>
        {headings.map((h) => {
          const n = sectionCounts.get(h.sectionKey) ?? 0;
          const active = current === h.sectionKey || (current?.startsWith(h.sectionKey + "/") ?? false);
          return (
            <li key={h.blockKey} style={{ paddingLeft: `${((h.level ?? 1) - 1) * 10}px` }}>
              <Link
                href={`/d/${slug}#${encodeURIComponent(h.blockKey)}`}
                className={`flex items-start gap-1 rounded px-2 py-0.5 hover:bg-accent-soft ${active ? "bg-accent-soft text-accent" : ""} ${(h.level ?? 1) <= 2 ? "font-medium" : "text-muted"}`}
              >
                <span className="min-w-0 flex-1 truncate">{h.text}</span>
                {n > 0 && <span className="text-[11px] tabular-nums text-accent">{n}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
