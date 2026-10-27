import Link from "next/link";
import type { Chapter } from "@/lib/study";

/**
 * Obsah studie po straně stránky kapitoly: všechny kapitoly jako odkazy na jejich stránky,
 * u otevřené kapitoly i její oddíly (odkazy #klíč, které zvýrazňuje StudyReader).
 */
export function StudyToc({ chapters, current, sections }: { chapters: Chapter[]; current: string; sections: { key: string; text: string; depth: number }[] }) {
  return (
    <nav aria-label="Obsah studie">
      <div className="mb-2 px-2 text-xs font-bold uppercase tracking-[0.06em] text-forest">Obsah studie</div>
      <ol>
        <li>
          <Link href="/studie" className="block rounded px-2 py-1.5 text-muted hover:bg-sage-soft">
            Úvod a přehled kapitol
          </Link>
        </li>
        {chapters.map((c) => {
          const open = c.slug === current;
          return (
            <li key={c.slug}>
              <Link
                href={`/studie/${c.slug}`}
                aria-current={open ? "page" : undefined}
                className={`block rounded px-2 py-1.5 hover:bg-sage-soft ${open ? "bg-sage-soft font-semibold text-forest" : "font-medium text-ink"}`}
              >
                {c.title}
              </Link>
              {open && sections.length > 0 && (
                <ul className="mb-2 mt-1 border-l border-line pl-2">
                  {sections.map((s) => (
                    <li key={s.key} style={{ paddingLeft: `${s.depth * 10}px` }}>
                      <a
                        href={`#${encodeURIComponent(s.key)}`}
                        className="block rounded px-2 py-1.5 text-[15px] text-muted hover:bg-sage-soft aria-[current=location]:bg-sage-soft aria-[current=location]:font-semibold aria-[current=location]:text-forest"
                      >
                        {s.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
        <li className="mt-2 border-t border-line pt-2">
          <Link href="/studie/navrhnout-opatreni" className="block rounded px-2 py-1.5 font-semibold text-forest hover:bg-sage-soft">
            Navrhnout nové opatření
          </Link>
        </li>
      </ol>
    </nav>
  );
}
