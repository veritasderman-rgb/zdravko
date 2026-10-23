"use client";

import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BAR, INK, SERIES, csNumber } from "./theme";

export function GapChart({ rows }: { rows: { year: string; gap: number; reform: number }[] }) {
  return (
    <div style={{ height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 16, right: 8, bottom: 0, left: 0 }} barGap={2} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke={INK.grid} strokeWidth={1} />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: INK.muted }} axisLine={{ stroke: INK.axis }} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: INK.muted }} axisLine={false} tickLine={false} width={36} />
          <Tooltip cursor={{ fill: "rgba(11,11,11,0.04)" }} contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${INK.grid}` }} formatter={(v) => [`${csNumber(Number(v))} mld. Kč`, ""]} separator="" />
          <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12, color: INK.secondary }} />
          <Bar name="Mezera pojištění při dnešních pravidlech" dataKey="gap" fill={SERIES[0]} barSize={BAR.size} radius={[BAR.radius, BAR.radius, 0, 0]} isAnimationActive={false}>
            <LabelList dataKey="gap" position="top" formatter={(v: unknown) => csNumber(Number(v), 0)} style={{ fontSize: 12, fill: INK.primary }} />
          </Bar>
          <Bar name="Čistý náklad reformy" dataKey="reform" fill={SERIES[1]} barSize={BAR.size} radius={[BAR.radius, BAR.radius, 0, 0]} isAnimationActive={false}>
            <LabelList dataKey="reform" position="top" formatter={(v: unknown) => csNumber(Number(v))} style={{ fontSize: 12, fill: INK.primary }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
