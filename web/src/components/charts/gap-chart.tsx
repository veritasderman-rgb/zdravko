"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BAR, INK, LABEL, MUTED_MARK, SERIES, TICK, csNumber } from "./theme";

const SERIES_DEF = [
  { key: "gap", name: "Chybějící peníze při dnešních pravidlech", color: SERIES[0] },
  { key: "reform", name: "Čistý náklad reformy", color: MUTED_MARK },
] as const;

/** Mezera ve zdravotním pojištění (zvýrazněná) vedle čistého nákladu reformy, mld. Kč ročně. */
export function GapChart({ rows }: { rows: { year: string; gap: number; reform: number }[] }) {
  return (
    <div className="font-sans">
      <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[15px] text-ink-2" aria-label="Legenda">
        {SERIES_DEF.map((s) => (
          <li key={s.key} className="flex items-center gap-2">
            <span aria-hidden className="inline-block h-3.5 w-3.5 rounded-[3px]" style={{ background: s.color }} />
            {s.name}
          </li>
        ))}
      </ul>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 24, right: 8, bottom: 0, left: 0 }} barGap={2} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke={INK.grid} strokeWidth={1} />
            <XAxis dataKey="year" tick={TICK} axisLine={{ stroke: INK.axis }} tickLine={false} />
            <YAxis tick={TICK} axisLine={false} tickLine={false} width={40} />
            <Tooltip
              cursor={{ fill: "rgba(28,35,33,0.05)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border border-line bg-paper px-3 py-2 text-[15px] text-ink">
                    <div className="font-semibold">Rok {String(label)}</div>
                    {payload.map((p) => (
                      <div key={String(p.dataKey)} className="tabular-nums">
                        {p.name}: {csNumber(Number(p.value))} mld. Kč
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            {SERIES_DEF.map((s) => (
              <Bar key={s.key} name={s.name} dataKey={s.key} fill={s.color} barSize={BAR.size} radius={[BAR.radius, BAR.radius, 0, 0]} isAnimationActive={false}>
                <LabelList dataKey={s.key} position="top" formatter={(v: unknown) => csNumber(Number(v), s.key === "gap" ? 0 : 1)} {...LABEL} />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
