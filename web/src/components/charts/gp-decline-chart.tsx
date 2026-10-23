"use client";

import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, useCartesianScale } from "recharts";
import { FONT_SANS, FONT_SERIF, INK, SERIES, TICK, csNumber } from "./theme";

type Point = { year: number; low: number; high: number };

/** Text umístěný v souřadnicích dat (anotace místo legendy). */
function Note({ x, y, children, anchor = "start", dy = 0, italic = false, bold = false }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end"; dy?: number; italic?: boolean; bold?: boolean }) {
  const p = useCartesianScale({ x, y });
  if (!p) return null;
  return (
    <text
      x={p.x}
      y={p.y + dy}
      textAnchor={anchor}
      fontSize={14}
      fill={italic ? INK.secondary : INK.primary}
      fontWeight={bold ? 700 : 400}
      fontStyle={italic ? "italic" : undefined}
      style={{ fontFamily: italic ? FONT_SERIF : FONT_SANS }}
    >
      {children}
    </text>
  );
}

const round100 = (v: number) => Math.round(v / 100) * 100;

/** Pás odhadu počtu praktiků pro dospělé; okraje pásu jsou dolní a horní odhad. */
export function GpDeclineChart({ points }: { points: Point[] }) {
  const data = points.map((p) => ({ ...p, band: [p.low, p.high] as [number, number] }));
  const first = points[0];
  const last = points[points.length - 1];
  const midYear = points[Math.floor(points.length * 0.55)];

  return (
    <div className="h-[260px] w-full font-sans md:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 28, right: 12, bottom: 4, left: 0 }}>
          <CartesianGrid vertical={false} stroke={INK.grid} strokeWidth={1} />
          <XAxis dataKey="year" type="number" domain={[first.year, last.year]} ticks={[first.year, 2029, 2032, last.year]} tick={TICK} axisLine={{ stroke: INK.axis }} tickLine={false} />
          <YAxis domain={[3500, 5600]} ticks={[4000, 4500, 5000, 5500]} tick={TICK} axisLine={false} tickLine={false} width={52} tickFormatter={(v: number) => csNumber(v, 0)} />
          <Tooltip
            cursor={{ stroke: INK.axis, strokeWidth: 1 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0].payload as Point;
              return (
                <div className="rounded-lg border border-line bg-paper px-3 py-2 text-[15px] text-ink">
                  <div className="font-semibold">Rok {String(label)}</div>
                  <div className="tabular-nums">{csNumber(p.low, 0)} až {csNumber(p.high, 0)} praktiků</div>
                </div>
              );
            }}
          />
          <Area type="linear" dataKey="band" stroke="none" fill={SERIES[0]} fillOpacity={0.22} isAnimationActive={false} activeDot={false} />
          <Line type="linear" dataKey="high" stroke={SERIES[0]} strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: INK.surface }} isAnimationActive={false} />
          <Line type="linear" dataKey="low" stroke={SERIES[0]} strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: INK.surface }} isAnimationActive={false} />
          <Note x={first.year} y={first.high} dy={-12} bold>{`dnes ${csNumber(first.high, 0)}`}</Note>
          <Note x={last.year} y={last.high} dy={-12} anchor="end" bold>{csNumber(round100(last.high), 0)}</Note>
          <Note x={last.year} y={last.low} dy={22} anchor="end" bold>{csNumber(round100(last.low), 0)}</Note>
          <Note x={midYear.year} y={(midYear.low + midYear.high) / 2} dy={5} anchor="middle" italic>ročně ubude 110 až 180 lékařů</Note>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
