"use client";

import { useState } from "react";
import { GATES, MILESTONES, PHASES } from "@/content/reforma";
import { INK, SERIES } from "./theme";

const X0 = 2026.7;
const X1 = 2039;
const W = 1000;
const x = (year: number) => ((year - X0) / (X1 - X0)) * W;

/** Harmonogram 2026–2038: fáze, brány a milníky. Klik na bránu ukáže, co musí platit. */
export function Timeline() {
  const [gate, setGate] = useState<string>(GATES[0].id);
  const g = GATES.find((v) => v.id === gate)!;
  const years = Array.from({ length: 13 }, (_, i) => 2027 + i);

  return (
    <div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} 150`} className="min-w-[720px] w-full" role="img" aria-label="Harmonogram reformy 2026 až 2038 s pěti fázemi a čtyřmi branami">
          {/* fáze */}
          {PHASES.map((p, i) => (
            <g key={p.id}>
              <rect x={x(p.from) + 1} y={58} width={x(p.to) - x(p.from) - 2} height={28} rx={4} fill={SERIES[0]} fillOpacity={0.1 + i * 0.09} />
              <text x={(x(p.from) + x(p.to)) / 2} y={76} textAnchor="middle" fontSize={12} fill={INK.primary}>{p.id} {p.name}</text>
            </g>
          ))}
          {/* osa let */}
          <line x1={0} x2={W} y1={100} y2={100} stroke={INK.axis} />
          {years.map((y) => (
            <g key={y}>
              <line x1={x(y)} x2={x(y)} y1={96} y2={104} stroke={INK.axis} />
              <text x={x(y)} y={120} textAnchor="middle" fontSize={11} fill={INK.muted}>{y}</text>
            </g>
          ))}
          {/* milníky: body na ose, popisky v seznamu pod grafem */}
          {MILESTONES.map((m, i) => (
            <g key={m.label}>
              <circle cx={x(m.at)} cy={100} r={4} fill={INK.secondary} stroke={INK.surface} strokeWidth={2} aria-label={`${m.label} · ${m.detail}`} />
              <text x={x(m.at)} y={138} textAnchor="middle" fontSize={10} fill={INK.secondary}>{i + 1}</text>
            </g>
          ))}
          {/* brány */}
          {GATES.map((b) => {
            const active = b.id === gate;
            return (
              <g key={b.id} onClick={() => setGate(b.id)} className="cursor-pointer" role="button" aria-label={`Brána ${b.id} ${b.name}`}>
                <polygon points={`${x(b.at)},30 ${x(b.at) + 11},42 ${x(b.at)},54 ${x(b.at) - 11},42`} fill={active ? SERIES[1] : INK.surface} stroke={SERIES[1]} strokeWidth={2} />
                <text x={x(b.at)} y={22} textAnchor="middle" fontSize={12} fontWeight={600} fill={INK.primary}>{b.id}</text>
                <line x1={x(b.at)} x2={x(b.at)} y1={54} y2={96} stroke={SERIES[1]} strokeWidth={1} />
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {GATES.map((b) => (
          <button key={b.id} type="button" onClick={() => setGate(b.id)} className={`chip cursor-pointer ${b.id === gate ? "border-[#eb6834] bg-[#fdebe3]" : "hover:border-foreground"}`}>
            {b.id} {b.name} · {b.when}
          </button>
        ))}
      </div>
      <ol className="mt-3 grid gap-x-6 gap-y-1 text-xs text-muted sm:grid-cols-2 lg:grid-cols-3">
        {MILESTONES.map((m, i) => (
          <li key={m.label} className="flex gap-2">
            <span className="w-4 shrink-0 text-right tabular-nums text-foreground">{i + 1}</span>
            <span><span className="text-foreground">{m.label}</span> · {m.detail}</span>
          </li>
        ))}
      </ol>
      <div className="mt-3 grid gap-3 rounded-lg border border-line bg-paper p-4 text-sm md:grid-cols-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">Brána {g.id} · {g.name} · co musí platit</div>
          <p className="mt-1">{g.must}</p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">Když neplatí</div>
          <p className="mt-1">{g.ifNot}</p>
        </div>
      </div>
    </div>
  );
}
