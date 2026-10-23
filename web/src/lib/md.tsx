import type { ReactNode } from "react";
import Link from "next/link";
import { CODE_RE } from "./codes";

/**
 * Minimalistické vykreslení inline markdownu (tučné, kurzíva, kód, odkazy)
 * a zvýraznění kódů opatření (J1, H5…) jako odkazů do registru.
 */
export function renderInline(src: string, opts: { linkCodes?: boolean } = {}): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  const pushText = (t: string) => {
    if (!t) return;
    if (opts.linkCodes === false) {
      out.push(t);
      return;
    }
    let l = 0;
    for (const c of t.matchAll(CODE_RE)) {
      const i = c.index ?? 0;
      if (i > l) out.push(t.slice(l, i));
      out.push(
        <Link key={`c${k++}`} href={`/kody/${c[1]}`} className="code-ref">
          {c[1]}
        </Link>,
      );
      l = i + c[0].length;
    }
    if (l < t.length) out.push(t.slice(l));
  };
  while ((m = re.exec(src))) {
    pushText(src.slice(last, m.index));
    if (m[1]) out.push(<strong key={k++}>{renderInline(m[2], opts)}</strong>);
    else if (m[3]) out.push(<em key={k++}>{renderInline(m[4], opts)}</em>);
    else if (m[5]) out.push(<code key={k++}>{m[6]}</code>);
    else if (m[7])
      out.push(
        <a key={k++} href={m[9]} target="_blank" rel="noreferrer" className="underline">
          {m[8]}
        </a>,
      );
    last = m.index + m[0].length;
  }
  pushText(src.slice(last));
  return out;
}

/** Zbaví odrážku/citaci značek na začátku řádku, aby šel vykreslit jen obsah. */
export function stripBlockMarker(md: string, kind: string): string {
  let s = md.trim();
  if (kind === "list_item") s = s.replace(/^(\s*(?:[-*+]|\d+\.)\s+)/, "").replace(/^\[[ x]\]\s+/, "☐ ");
  if (kind === "quote") s = s.replace(/^>\s?/gm, "");
  if (kind === "heading") s = s.replace(/^#+\s+/, "");
  return s.replace(/\\\*/g, "*").replace(/\\_/g, "_");
}
