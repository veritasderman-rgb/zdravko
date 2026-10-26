"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { SearchEntry } from "@/lib/search-index";

type Data = { study: boolean; entries: SearchEntry[] };

const KIND_LABEL: Record<SearchEntry["k"], string> = {
  stranka: "Stránka",
  otazka: "Častá otázka",
  pojem: "Slovníček",
  cislo: "Číslo se zdrojem",
  oblast: "Oblast Manifestu",
  studie: "Studie",
};
const KIND_WEIGHT: Record<SearchEntry["k"], number> = { stranka: 3, otazka: 3, pojem: 3, oblast: 2, cislo: 1, studie: 0 };
const PAGE = { web: 12, studie: 30 };

/** Malá písmena bez diakritiky; délka textu zůstává stejná (české znaky jsou předsložené). */
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().normalize("NFC");

type Hit = { e: SearchEntry; score: number; at: number };

function search(entries: SearchEntry[], tokens: string[]): Hit[] {
  const whole = tokens.join(" ");
  const hits: Hit[] = [];
  for (const e of entries) {
    const title = fold(e.title);
    const text = fold(e.text);
    const hay = `${title} ${text}`;
    if (!tokens.every((t) => hay.includes(t))) continue;
    let score = KIND_WEIGHT[e.k];
    if (title.includes(whole)) score += 6;
    for (const t of tokens) if (title.includes(t)) score += 2;
    if (text.includes(whole)) score += 2;
    hits.push({ e, score, at: text.indexOf(tokens[0]) });
  }
  return hits.sort((a, b) => b.score - a.score);
}

/** Výřez textu kolem prvního nálezu se zvýrazněnými slovy. */
function Snippet({ text, tokens }: { text: string; tokens: string[] }) {
  if (!text) return null;
  const f = fold(text);
  const first = Math.min(...tokens.map((t) => f.indexOf(t)).filter((i) => i >= 0), text.length);
  const start = text.length > 260 && first > 80 ? text.lastIndexOf(" ", first - 60) + 1 : 0;
  const end = Math.min(text.length, start + 260);
  const part = text.slice(start, end);
  const fp = f.slice(start, end);
  // Úseky ke zvýraznění v rámci výřezu.
  const marks: [number, number][] = [];
  for (const t of tokens) for (let i = fp.indexOf(t); i >= 0; i = fp.indexOf(t, i + t.length)) marks.push([i, i + t.length]);
  marks.sort((a, b) => a[0] - b[0]);
  const out: ReactNode[] = [];
  let pos = 0;
  marks.forEach(([a, b], n) => {
    if (a < pos) return;
    out.push(part.slice(pos, a), <mark key={n} className="rounded-sm bg-accent-soft text-ink">{part.slice(a, b)}</mark>);
    pos = b;
  });
  out.push(part.slice(pos));
  return (
    <p className="mt-1.5 text-[16px] leading-relaxed text-ink-2">
      {start > 0 && "…"}
      {out}
      {end < text.length && "…"}
    </p>
  );
}

function Results({ title, hits, tokens, limit, onMore }: { title: string; hits: Hit[]; tokens: string[]; limit: number; onMore: () => void }) {
  if (hits.length === 0) return null;
  return (
    <section aria-label={title} className="flex flex-col gap-3">
      <h2 className="text-[15px] font-bold uppercase tracking-[0.06em] text-forest">
        {title} ({hits.length})
      </h2>
      <ol className="flex flex-col gap-3">
        {hits.slice(0, limit).map(({ e }) => (
          <li key={e.url + e.title}>
            <a href={e.url} className="block rounded-card border border-line bg-paper p-4 hover:border-forest hover:bg-sage-soft">
              <span className="text-[14px] font-semibold text-muted">{e.where ?? KIND_LABEL[e.k]}</span>
              <span className="mt-0.5 block font-serif text-[20px] font-semibold leading-snug text-ink">{e.title}</span>
              <Snippet text={e.text} tokens={tokens} />
            </a>
          </li>
        ))}
      </ol>
      {hits.length > limit && (
        <button type="button" onClick={onMore} className="inline-flex min-h-11 items-center self-start rounded-full border-2 border-forest px-5 text-[17px] font-bold text-forest hover:bg-sage-soft">
          Zobrazit další ({hits.length - limit})
        </button>
      )}
    </section>
  );
}

/**
 * Hledání na webu v prohlížeči: data se stáhnou jednou z /hledat/data (v mezipaměti), dotaz se
 * drží v adrese (?q=…&jen=studie), takže se dá poslat odkaz na výsledky. Hledá všechna slova
 * dotazu bez ohledu na diakritiku a velikost písmen.
 */
export function SearchClient() {
  const [q, setQ] = useState("");
  const [onlyStudy, setOnlyStudy] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);
  const [limits, setLimits] = useState(PAGE);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const initial = p.get("q") ?? "";
    const jen = p.get("jen") === "studie";
    const t = window.setTimeout(() => {
      setQ(initial);
      setOnlyStudy(jen);
      if (!initial) inputRef.current?.focus();
    }, 0);
    fetch("/hledat/data")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: Data) => setData(d))
      .catch(() => setFailed(true));
    return () => window.clearTimeout(t);
  }, []);

  // Dotaz do adresy, aby šel sdílet a fungovalo tlačítko Zpět.
  useEffect(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (onlyStudy) p.set("jen", "studie");
    const s = p.toString();
    history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
  }, [q, onlyStudy]);

  const tokens = useMemo(() => fold(q).split(/\s+/).filter((t) => t.length >= 2), [q]);
  const hits = useMemo(() => (data && tokens.length ? search(data.entries, tokens) : []), [data, tokens]);
  const web = onlyStudy ? [] : hits.filter((h) => h.e.k !== "studie");
  const study = hits.filter((h) => h.e.k === "studie");
  const total = web.length + study.length;

  return (
    <div className="mt-8 flex flex-col gap-8">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="flex max-w-[44em] flex-col gap-3">
        <label htmlFor="hledat-pole" className="text-[17px] font-semibold text-ink">
          Co hledáte
        </label>
        <input
          ref={inputRef}
          id="hledat-pole"
          data-ui
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setLimits(PAGE);
          }}
          placeholder="například porodnice, sestry, triáž, 21,5"
          autoComplete="off"
          enterKeyHint="search"
          className="min-h-14 rounded-full border-2 border-line-strong bg-paper px-6 text-[19px] text-ink placeholder:text-muted focus:border-forest"
        />
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Kde hledat</legend>
          {[
            { v: false, l: "Celý web a studie" },
            { v: true, l: "Jen studie" },
          ].map((o) => (
            <label
              key={o.l}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-paper px-4 text-[16px] font-semibold text-ink has-checked:border-forest has-checked:bg-sage-soft has-checked:text-forest"
            >
              <input data-ui type="radio" name="jen" checked={onlyStudy === o.v} onChange={() => setOnlyStudy(o.v)} className="accent-forest" />
              {o.l}
            </label>
          ))}
        </fieldset>
      </form>

      <p role="status" aria-live="polite" className="text-[17px] text-muted">
        {failed
          ? "Hledání se teď nepodařilo načíst. Zkuste to prosím za chvíli znovu."
          : !data
            ? tokens.length
              ? "Načítám…"
              : ""
            : tokens.length === 0
              ? "Napište aspoň dvě písmena."
              : total === 0
                ? "Nic jsme nenašli. Zkuste jiné nebo kratší slovo."
                : `Nalezeno ${total} ${total === 1 ? "místo" : total < 5 ? "místa" : "míst"}.`}
        {data && !data.study && " Text studie teď v hledání chybí, hledáme jen na webu."}
      </p>

      {tokens.length > 0 && data && (
        <div className="grid gap-10 lg:grid-cols-2">
          <Results title="Na webu" hits={web} tokens={tokens} limit={limits.web} onMore={() => setLimits((l) => ({ ...l, web: l.web + PAGE.web }))} />
          <Results title="Ve studii" hits={study} tokens={tokens} limit={limits.studie} onMore={() => setLimits((l) => ({ ...l, studie: l.studie + PAGE.studie }))} />
        </div>
      )}
    </div>
  );
}
