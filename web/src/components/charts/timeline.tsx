"use client";

import { useState } from "react";
import { GATES, MILESTONES, PHASES } from "@/content/reforma";

const X0 = 2026.7;
const X1 = 2039;
const pct = (year: number) => ((year - X0) / (X1 - X0)) * 100;
const YEARS = Array.from({ length: 12 }, (_, i) => 2027 + i);

/** Fáze jako pásy od šalvěje k lesní zelené; na tmavých pásech světlý text (kontrast ≥ 4,5 : 1). */
const PHASE_FILL = ["#DCE8E0", "#A9C4B5", "#4A7262", "#2E4F46", "#1F4A3D"];
const PHASE_DARK = [false, false, true, true, true];

/** Řádek značky milníku: blízké milníky se na ose rozestoupí pod sebe, aby se nepřekrývaly. */
const MS_ROW = MILESTONES.reduce<{ at: number; row: number }[]>((acc, m) => {
  let row = 0;
  while (acc.some((a) => a.row === row && Math.abs(pct(a.at) - pct(m.at)) < 3.2)) row++;
  return [...acc, { at: m.at, row }];
}, []).map((x) => x.row);

const phaseYears = (p: (typeof PHASES)[number]) => {
  const a = Math.floor(p.from);
  const b = Math.floor(p.to - 0.01);
  return a === b ? `${a}` : `${a}–${b}`;
};

type Gate = (typeof GATES)[number];

function GatePanel({ gate, id }: { gate: Gate; id: string }) {
  return (
    <div id={id} className="grid gap-5 rounded-card border border-line bg-sand p-5 md:grid-cols-2 md:p-6">
      <div className="md:col-span-2">
        <span className="inline-flex items-center rounded-full bg-ink px-3 py-1 text-[15px] font-bold text-on-dark">
          {gate.id} · {gate.name} · {gate.when}
        </span>
      </div>
      <div>
        <h4 className="text-[15px] font-bold uppercase tracking-[0.06em] text-forest">Co musí platit</h4>
        <p className="mt-1.5 text-[17px] leading-relaxed text-ink">{gate.must}</p>
      </div>
      <div>
        <h4 className="text-[15px] font-bold uppercase tracking-[0.06em] text-muted">Co když ne</h4>
        <p className="mt-1.5 text-[17px] leading-relaxed text-ink-2">{gate.ifNot}</p>
      </div>
    </div>
  );
}

/**
 * Harmonogram 2026–2038: fáze, kontrolní body (brány) a milníky.
 * Desktop vodorovně, mobil svisle. Brána je tlačítko; klik otevře panel „Co musí platit / Co když ne“.
 */
export function Timeline() {
  const [open, setOpen] = useState<string | null>(GATES[0].id);
  const toggle = (id: string) => setOpen((g) => (g === id ? null : id));
  const active = GATES.find((g) => g.id === open) ?? null;

  return (
    <div className="font-sans">
      {/* Desktop: vodorovně */}
      <div className="hidden lg:block">
        <div className="relative h-[64px]">
          {GATES.map((g) => {
            const isOpen = g.id === open;
            return (
              <div key={g.id} className="absolute top-0 flex h-full -translate-x-1/2 flex-col items-center" style={{ left: `${pct(g.at)}%` }}>
                <button
                  type="button"
                  onClick={() => toggle(g.id)}
                  aria-expanded={isOpen}
                  aria-controls="brana-detail"
                  aria-label={`Kontrolní bod ${g.id} ${g.name}, ${g.when}`}
                  className={`min-h-11 min-w-11 rounded-full bg-ink px-3 text-[15px] font-bold text-on-dark ${isOpen ? "ring-4 ring-sage" : "hover:bg-forest"}`}
                >
                  {g.id}
                </button>
                <span aria-hidden className="w-0.5 flex-1 bg-ink" />
              </div>
            );
          })}
        </div>
        <div className="relative h-12">
          {PHASES.map((p, i) => (
            <div
              key={p.id}
              title={p.text}
              className={`absolute inset-y-0 flex items-center justify-center overflow-hidden px-1.5 text-center text-[14px] font-semibold leading-tight ${PHASE_DARK[i] ? "text-on-dark" : "text-ink"}`}
              style={{ left: `calc(${pct(p.from)}% + 1px)`, width: `calc(${pct(p.to) - pct(p.from)}% - 2px)`, background: PHASE_FILL[i], borderRadius: 4 }}
            >
              <span className="line-clamp-2">
                {p.id} {p.name}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-3 h-[84px]">
          <span aria-hidden className="absolute inset-x-0 top-2 h-px bg-line-strong" />
          {YEARS.map((y) => (
            <span key={y} aria-hidden className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${pct(y)}%` }}>
              <span className="h-4 w-px bg-line-strong" />
              <span className="mt-[50px] text-[13px] tabular-nums text-muted">{y}</span>
            </span>
          ))}
          {MILESTONES.map((m, i) => (
            <span
              key={m.label}
              className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-paper bg-ink-2 text-[13px] font-bold text-on-dark"
              style={{ left: `${pct(m.at)}%`, top: 8 + MS_ROW[i] * 26 }}
              title={`${m.label} · ${m.detail}`}
              aria-hidden
            >
              {i + 1}
            </span>
          ))}
        </div>
        <ol className="mt-2 grid grid-cols-3 gap-x-6 gap-y-1.5 text-[15px] text-muted">
          {MILESTONES.map((m, i) => (
            <li key={m.label} className="flex gap-2">
              <span className="w-5 shrink-0 text-right font-bold tabular-nums text-ink">{i + 1}</span>
              <span>
                <span className="text-ink">{m.label}</span> · {m.detail}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-6" aria-live="polite">
          {active ? (
            <GatePanel gate={active} id="brana-detail" />
          ) : (
            <p id="brana-detail" className="text-[16px] text-muted">
              Klikněte na kontrolní bod a uvidíte, co v něm musí platit.
            </p>
          )}
        </div>
      </div>

      {/* Mobil a tablet: svisle */}
      <ol className="flex flex-col lg:hidden">
        {PHASES.map((p, i) => {
          const events = [
            ...MILESTONES.map((m, mi) => ({ kind: "m" as const, at: m.at, m, n: mi + 1 })),
            ...GATES.map((g) => ({ kind: "g" as const, at: g.at, g })),
          ]
            .filter((e) => e.at >= p.from && (e.at < p.to || (i === PHASES.length - 1 && e.at <= p.to)))
            .sort((a, b) => a.at - b.at);
          return (
            <li key={p.id} className="relative pb-6 pl-7 last:pb-0">
              <span aria-hidden className="absolute bottom-0 left-0 top-0 w-1.5 rounded-full" style={{ background: PHASE_FILL[i] }} />
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="font-serif text-[22px] font-semibold text-forest">{phaseYears(p)}</span>
                <span className="text-[18px] font-bold text-ink">
                  {p.id} · {p.name}
                </span>
              </div>
              <p className="mt-1 text-[17px] leading-relaxed text-ink-2">{p.text}</p>
              {events.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2.5">
                  {events.map((e) =>
                    e.kind === "m" ? (
                      <li key={e.m.label} className="flex gap-3 text-[16px]">
                        <span aria-hidden className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-2 text-[13px] font-bold text-on-dark">{e.n}</span>
                        <span>
                          <span className="text-ink">{e.m.label}</span> <span className="text-muted">· {e.m.detail}</span>
                        </span>
                      </li>
                    ) : (
                      <li key={e.g.id} className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => toggle(e.g.id)}
                          aria-expanded={open === e.g.id}
                          aria-controls={`brana-detail-m-${e.g.id}`}
                          className={`inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-ink px-4 text-left text-[15px] font-bold text-on-dark ${open === e.g.id ? "ring-4 ring-sage" : ""}`}
                        >
                          {e.g.id} · {e.g.name} · {e.g.when}
                          <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={open === e.g.id ? "rotate-180" : ""}>
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </button>
                        {open === e.g.id && <GatePanel gate={e.g} id={`brana-detail-m-${e.g.id}`} />}
                      </li>
                    ),
                  )}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
