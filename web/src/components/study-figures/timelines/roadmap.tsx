"use client";

import { useState } from "react";
import { Chip } from "@/components/web/ui";
import { GATES, PHASES } from "@/content/reforma";
import { GATE_KIND, GATE_OUTCOMES, PHASE_DETAIL } from "@/content/figures/timelines";
import { FigureShell, PHASE_DARK, PHASE_FILL, TextVersion, pctOf, stagger, type Axis } from "./gantt-core";

/**
 * Obrázek ř. 1798: roadmapa reformy, 5 fází a 4 brány, základní scénář Vláda 2030.
 * Fáze a brány z reforma.ts, obsah fází z tabulky „Fáze a brány“ (ř. 1804–1808).
 * Brána na konci každé fáze je tlačítko; klik otevře „Co musí platit“ a „Co když ne“ přímo pod ní.
 * Přehled fází a bran na vodorovné ose nad seznamem je jen orientační (v úzkém sloupci chybí).
 */

const AXIS: Axis = { x0: 2026.8, x1: 2039 };
type Gate = (typeof GATES)[number];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={open ? "rotate-180" : ""}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function GateButton({ gate, open, onToggle, panelId }: { gate: Gate; open: boolean; onToggle: () => void; panelId: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={panelId}
      aria-label={`Brána ${gate.id} ${gate.name}, ${gate.when}: ${open ? "skrýt" : "ukázat"} podmínky`}
      className="flex min-h-11 items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
    >
      <Chip variant="gate" className={open ? "ring-4 ring-sage" : "hover:bg-forest"}>
        {gate.id} · {gate.name} · {gate.when}
        <Chevron open={open} />
      </Chip>
    </button>
  );
}

function GatePanel({ gate, index, id }: { gate: Gate; index: number; id: string }) {
  return (
    <div id={id} className="grid gap-5 rounded-card border border-line bg-paper p-5 @min-[640px]:grid-cols-2">
      <p className="text-[14px] font-semibold text-muted @min-[640px]:col-span-2">
        {gate.id} · {GATE_KIND[index]} brána
      </p>
      <div>
        <h5 className="text-[14px] font-bold uppercase tracking-[0.06em] text-forest">Co musí platit</h5>
        <p className="mt-1.5 text-[16px] leading-relaxed text-ink">{gate.must}</p>
      </div>
      <div>
        <h5 className="text-[14px] font-bold uppercase tracking-[0.06em] text-muted">Co když ne</h5>
        <p className="mt-1.5 text-[16px] leading-relaxed text-ink-2">{gate.ifNot}</p>
      </div>
      <p className="border-t border-line pt-3 text-[14px] leading-snug text-ink-2 @min-[640px]:col-span-2">
        Výsledek brány: {GATE_OUTCOMES}.
      </p>
    </div>
  );
}

export function RoadmapTimeline() {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => setOpen((o) => (o === id ? null : id));

  return (
    <FigureShell title="Každá fáze končí bránou, kterou projdeme jen s daty v ruce">
      {/* Přehled v čase: fáze a brány na ose (bez interakce; brány se otevírají u fází níže) */}
      <div aria-hidden className="hidden @min-[640px]:block">
        <div className="relative h-9">
          {GATES.map((g) => (
            <span key={g.id} className="absolute top-0 -translate-x-1/2" style={{ left: `${pctOf(AXIS, g.at)}%` }} title={`${g.id} ${g.name}, ${g.when}`}>
              <Chip variant="gate" className="px-2.5! py-1!">{g.id}</Chip>
            </span>
          ))}
        </div>
        <div className="relative h-[58px]">
          {PHASES.map((p, i) => (
            <div
              key={p.id}
              data-anim="grow"
              title={`${PHASE_DETAIL[i].id} ${PHASE_DETAIL[i].name}, ${PHASE_DETAIL[i].period}`}
              className={`absolute inset-y-0 overflow-hidden px-2 py-1 text-[13px] leading-tight ${PHASE_DARK[i] ? "text-on-dark" : "text-ink"}`}
              style={{ left: `calc(${pctOf(AXIS, p.from)}% + 1px)`, width: `calc(${pctOf(AXIS, p.to) - pctOf(AXIS, p.from)}% - 2px)`, background: PHASE_FILL[i], borderRadius: 4, ...stagger(i) }}
            >
              <span className="block font-bold">{p.id}</span>
              <span className="line-clamp-2 font-semibold">{p.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[13px] tabular-nums text-muted">
          <span>2026</span>
          <span>2038</span>
        </div>
      </div>
      <p className="mt-4 text-[15px] text-muted">Klikněte na bránu a uvidíte, co v ní musí platit a co se stane, když ne.</p>

      {/* Fáze s obsahem a branou na konci */}
      <ol className="mt-3 flex flex-col">
        {PHASE_DETAIL.map((p, i) => {
          const gate = GATES[i] as Gate | undefined;
          return (
            <li key={p.id} className="relative">
              <div
                data-anim
                className="grid gap-x-6 gap-y-2 border-l-[6px] py-4 pl-5 @min-[600px]:grid-cols-[190px_1fr]"
                style={{ borderColor: PHASE_FILL[i], ...stagger(i) }}
              >
                <div>
                  <p className="font-serif text-[22px] font-semibold leading-tight text-forest">{p.period}</p>
                  <p className="mt-0.5 text-[16px] font-bold leading-snug text-ink">
                    {p.id} · {p.name}
                  </p>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {p.items.map((t) => (
                    <li key={t} className="flex gap-2.5 text-[16px] leading-snug text-ink">
                      <span aria-hidden className="mt-[7px] block size-2 shrink-0 bg-forest" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              {gate && (
                <div className="pb-2 pl-5">
                  <GateButton gate={gate} open={open === gate.id} onToggle={() => toggle(gate.id)} panelId={`rm-${gate.id}`} />
                  {open === gate.id && (
                    <div className="mt-1">
                      <GatePanel gate={gate} index={i} id={`rm-${gate.id}`} />
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <TextVersion
        caption="Fáze reformy, jejich obsah a brány"
        header={["Fáze a období", "Co se v ní stane", "Brána na konci fáze"]}
        rows={PHASE_DETAIL.map((p, i) => {
          const g = GATES[i] as Gate | undefined;
          return [
            `${p.id} ${p.name}, ${p.period}`,
            p.items.join("; "),
            g ? `${g.id} ${g.name}, ${g.when}. Musí platit: ${g.must} Když ne: ${g.ifNot}` : "–",
          ];
        })}
      />
    </FigureShell>
  );
}
