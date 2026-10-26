import type { ReactNode } from "react";
import registr from "@/content/registr.json";
import { LAYERS as D } from "@/content/figures/diagrams";
import { CodeRef } from "@/components/web/ui";
import { DiagramFrame, SourceNote, SwatchBox, vi } from "./shared";

/** Tři vrstvy opatření: jádro J1–J10, podmínky P1–P5, doprovod v deseti oblastech Manifestu (ř. 406–431). */

type Entry = { code: string; label: string; layer: string; area: string };
const REG = registr as Entry[];
const CORE = REG.filter((r) => r.layer === "Jádro");
const COND = REG.filter((r) => r.layer === "Podmínka");
const AREAS = D.areas.map((name, k) => {
  const items = REG.filter((r) => r.layer === "Doprovod" && r.area === `Oblast ${k + 1}`);
  return { n: k + 1, name, items };
});
const ACC_TOTAL = AREAS.reduce((a, x) => a + x.items.length, 0);

const GRID = "grid grid-cols-1 gap-2 @min-[420px]:grid-cols-2 @min-[560px]:grid-cols-3 @min-[640px]:grid-cols-5";

function Card({ code, text, sub, kind, i }: { code: string; text: string; sub?: string; kind: "core" | "cond" | "acc"; i: number }) {
  const cls = kind === "core" ? "border-forest bg-paper" : kind === "cond" ? "border-dashed border-forest bg-paper" : "border-line-strong bg-paper";
  return (
    <div data-anim style={vi(i)} className={`flex flex-col gap-1 rounded-[10px] border-[1.5px] px-2.5 py-2 ${cls}`}>
      <span>{kind === "acc" ? <span className="font-mono text-sm text-ink">{code}</span> : <CodeRef code={code} link={false} />}</span>
      <span className="text-[13px] leading-snug text-ink">{text}</span>
      {sub && <span className="text-[13px] leading-snug text-muted">{sub}</span>}
    </div>
  );
}

function Band({ title, note, cls, children }: { title: string; note: string; cls: string; children: ReactNode }) {
  return (
    <section className={`rounded-[14px] p-3 ${cls}`} aria-label={title}>
      <p className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <span className="text-[15px] font-bold text-ink">{title}</span>
        <span className="text-[13px] text-muted">{note}</span>
      </p>
      <div className={GRID}>{children}</div>
    </section>
  );
}

function Connector({ text, dashed = false }: { text: string; dashed?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1 text-[13px] text-muted" data-anim>
      <svg aria-hidden width="12" height="26" viewBox="0 0 12 26">
        <path d="M6 24V4" stroke="#6E695F" strokeWidth="1.5" strokeDasharray={dashed ? "3 3" : undefined} fill="none" />
        {!dashed && <path d="M1 8L6 2L11 8" stroke="#6E695F" strokeWidth="1.5" fill="none" />}
      </svg>
      {text}
    </div>
  );
}

export function LayersFigure() {
  return (
    <DiagramFrame
      title={D.title}
      subtitle={D.subtitle}
      legend={[
        { swatch: <SwatchBox kind="core" />, label: `jádro: ${CORE.length} opatření` },
        { swatch: <SwatchBox kind="cond" />, label: `podmínky: ${COND.length}` },
        { swatch: <SwatchBox kind="same" />, label: `doprovod: ${AREAS.length} oblastí, ${ACC_TOTAL} opatření` },
      ]}
      textVersion={
        <>
          <div>
            <p className="font-semibold text-ink">Jádro: bez čeho reforma není</p>
            <ul className="list-disc pl-5">
              {CORE.map((r) => (
                <li key={r.code}>
                  {r.code} {r.label} ({r.area})
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-ink">Podmínky: bez čeho jádro nefunguje (umožňují jádro)</p>
            <ul className="list-disc pl-5">
              {COND.map((r) => (
                <li key={r.code}>
                  {r.code} {r.label}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-ink">Doprovod: deset oblastí Manifestu jako stručné podklady (souběžně, nezávisle na jádru)</p>
            <ol className="list-decimal pl-5">
              {AREAS.map((a) => (
                <li key={a.n}>
                  {a.name}: {a.items.length} opatření ({a.items.map((x) => x.code).join(", ")})
                </li>
              ))}
            </ol>
          </div>
          <SourceNote lines={D.source.lines} />
        </>
      }
    >
      <div className="flex flex-col">
        <Band title="Jádro: bez čeho reforma není" note="splňuje tři podmínky zároveň" cls="border-2 border-forest bg-sage-soft">
          {CORE.map((r, k) => (
            <Card key={r.code} code={r.code} text={D.short[r.code] ?? r.label} sub={r.area} kind="core" i={k} />
          ))}
        </Band>
        <Connector text="podmínky umožňují jádro" />
        <Band title="Podmínky: bez čeho jádro nefunguje" note="plnění sledují brány B1–B4" cls="border-2 border-dashed border-forest bg-paper">
          {COND.map((r, k) => (
            <Card key={r.code} code={r.code} text={D.short[r.code] ?? r.label} kind="cond" i={10 + k} />
          ))}
        </Band>
        <Connector text="souběžně, nezávisle na jádru" dashed />
        <Band title="Doprovod: deset oblastí Manifestu" note={`stručné podklady, ${ACC_TOTAL} opatření (Část XI)`} cls="border border-line-strong bg-sand">
          {AREAS.map((a, k) => (
            <Card key={a.n} code={`Oblast ${a.n}`} text={a.name} sub={`${a.items.length} opatření`} kind="acc" i={15 + k} />
          ))}
        </Band>
      </div>
    </DiagramFrame>
  );
}
