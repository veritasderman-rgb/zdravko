"use client";

import { Area, CartesianGrid, ComposedChart, Line, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { INK, SERIES, csNumber } from "./theme";

export function GpDeclineChart({ points }: { points: { year: number; low: number; high: number }[] }) {
  const data = points.map((p) => ({ ...p, band: [p.low, p.high] as [number, number], mid: Math.round((p.low + p.high) / 2) }));
  return (
    <div style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 12, right: 96, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke={INK.grid} strokeWidth={1} />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: INK.muted }} axisLine={{ stroke: INK.axis }} tickLine={false} />
          <YAxis domain={[3500, 5600]} tick={{ fontSize: 12, fill: INK.muted }} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => csNumber(v, 0)} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${INK.grid}` }}
            formatter={(v, name) => (name === "band" ? [`${csNumber((v as number[])[0], 0)} až ${csNumber((v as number[])[1], 0)}`, "rozpětí"] : [csNumber(Number(v), 0), "střed"])}
            labelFormatter={(l) => `Rok ${l}`}
          />
          <Area type="monotone" dataKey="band" stroke="none" fill={SERIES[0]} fillOpacity={0.12} isAnimationActive={false} />
          <Line type="monotone" dataKey="mid" stroke={SERIES[0]} strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: INK.surface }} isAnimationActive={false} />
          {/* přímý popisek konce řady */}
          <ReferenceDot x={2035} y={data[data.length - 1].mid} r={4} fill={SERIES[0]} stroke={INK.surface} strokeWidth={2} label={{ value: "3 900 až 4 500", position: "right", fontSize: 12, fill: INK.primary }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
