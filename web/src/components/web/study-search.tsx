"use client";

import { useEffect, useId, useRef, useState } from "react";

type Hit = { key: string; heading: string; snippet: string };

const MAX_LIST = 12;

/**
 * Hledání ve veřejné čtečce studie. Prohledává text odstavců přímo v dokumentu
 * (`.block-row` s id = klíč bloku), ukáže počet míst a seznam prvních nálezů
 * s nejbližším nadpisem; klik na nález odscrolluje a místo zvýrazní. Čtenář tak
 * najde část, které se chce věnovat, a u ní použije tlačítko „Připomínka“.
 * Parametr `?q=` v adrese předvyplní dotaz (odkaz z úvodní stránky).
 */
export function StudySearch({ scope }: { scope: string }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [total, setTotal] = useState(0);
  const [cursor, setCursor] = useState(-1);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  // ?q= z adresy
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
    if (!initial) return;
    const t = window.setTimeout(() => {
      setQ(initial);
      setOpen(true);
      inputRef.current?.scrollIntoView({ block: "center" });
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  // Hledání s malým zpožděním, aby se nehledalo při každém znaku.
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(scope);
    if (!root) return;
    const needle = q.trim().toLowerCase();
    const rows = Array.from(root.querySelectorAll<HTMLElement>(".block-row[id]"));
    const t = window.setTimeout(() => {
      if (needle.length < 2) {
        rows.forEach((r) => r.removeAttribute("data-search-hit"));
        setHits([]);
        setTotal(0);
        setCursor(-1);
        return;
      }
      const found: Hit[] = [];
      let heading = "";
      let n = 0;
      for (const row of rows) {
        const h = row.querySelector("h1, h2, h3, h4");
        if (h) heading = h.textContent?.trim() ?? heading;
        // innerText zachová mezery mezi buňkami tabulky a odrážkami; textContent je slepí.
        const text = (row.innerText || row.textContent || "").replace(/\s+/g, " ");
        const i = text.toLowerCase().indexOf(needle);
        if (i < 0) {
          row.removeAttribute("data-search-hit");
          continue;
        }
        n++;
        row.setAttribute("data-search-hit", "true");
        if (found.length < MAX_LIST) {
          const start = Math.max(0, i - 60);
          const end = Math.min(text.length, i + needle.length + 90);
          found.push({ key: row.id, heading, snippet: `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}` });
        }
      }
      setHits(found);
      setTotal(n);
      setCursor(-1);
    }, needle.length < 2 ? 0 : 180);
    return () => window.clearTimeout(t);
  }, [q, scope]);

  const jump = (key: string, idx: number) => {
    const el = document.getElementById(key);
    if (!el) return;
    document.querySelectorAll<HTMLElement>(`${scope} .block-row[data-selected="true"]`).forEach((r) => r.setAttribute("data-selected", "false"));
    el.setAttribute("data-selected", "true");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setCursor(idx);
    setOpen(false);
  };

  const step = (dir: 1 | -1) => {
    if (hits.length === 0) return;
    const next = (cursor + dir + hits.length) % hits.length;
    jump(hits[next].key, next);
  };

  return (
    <div className="study-search mb-6 rounded-panel border border-line bg-paper p-4 sm:p-5">
      <form
        role="search"
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          if (hits.length > 0) step(1);
        }}
      >
        <div className="min-w-0 flex-1">
          <label htmlFor={`${listId}-q`} className="mb-1 block text-[15px] font-semibold text-ink">
            Hledat ve studii
          </label>
          <input
            ref={inputRef}
            id={`${listId}-q`}
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="slovo, číslo nebo kód opatření, např. porodní asistentka, 24 000, J1"
            autoComplete="off"
            aria-controls={`${listId}-list`}
            aria-describedby={`${listId}-count`}
            className="w-full rounded-[10px] border border-line-strong bg-sand px-3.5 py-2.5 text-[17px] text-ink"
            data-ui
          />
        </div>
        <div className="flex items-center gap-2">
          <button type="submit" className="inline-flex min-h-[46px] items-center justify-center rounded-full border-2 border-forest px-5 text-[16px] font-bold text-forest hover:bg-sage-soft">
            Hledat
          </button>
          {total > 0 && (
            <>
              <button type="button" onClick={() => step(-1)} aria-label="Předchozí nález" className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-full border border-line-strong text-ink hover:bg-sage-soft">
                ↑
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Další nález" className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-full border border-line-strong text-ink hover:bg-sage-soft">
                ↓
              </button>
            </>
          )}
        </div>
      </form>
      <p id={`${listId}-count`} aria-live="polite" className="mt-2 text-[15px] text-muted">
        {q.trim().length < 2
          ? "Najděte část, ke které chcete něco říct, a u odstavce použijte tlačítko „Připomínka“."
          : total === 0
            ? "Nic jsme nenašli. Zkuste jiné slovo nebo kratší tvar."
            : `${total} ${total === 1 ? "místo" : total < 5 ? "místa" : "míst"}${cursor >= 0 ? ` · ${cursor + 1}. z ${Math.min(total, MAX_LIST)} v seznamu` : ""}${total > MAX_LIST ? ` · v seznamu prvních ${MAX_LIST}` : ""}`}
      </p>
      {open && hits.length > 0 && (
        <ol id={`${listId}-list`} className="mt-3 divide-y divide-line border-t border-line">
          {hits.map((h, i) => (
            <li key={h.key}>
              <button type="button" onClick={() => jump(h.key, i)} className="block w-full py-2.5 text-left hover:bg-sage-soft focus-visible:bg-sage-soft">
                {h.heading && <span className="block text-[13px] font-semibold uppercase tracking-wide text-forest">{h.heading}</span>}
                <span className="block text-[16px] leading-snug text-ink">{h.snippet}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
