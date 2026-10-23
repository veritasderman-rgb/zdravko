"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BAR, INK, MUTED_MARK, SERIES, csNumber } from "./theme";

export interface HBarRow {
  label: string;
  value: number;
  highlight?: boolean;
  group?: string;
}

/**
 * Vodorovné pruhy. Jedna řada = jedna barva; `highlight` ztlumí ostatní;
 * `groups` obarví pruhy podle skupiny (pevné pořadí slotů) a vykreslí legendu.
 */
export function HBarChart({ rows, unit = "", digits = 1, groups, height }: { rows: HBarRow[]; unit?: string; digits?: number; groups?: string[]; height?: number }) {
  const anyHighlight = rows.some((r) => r.highlight);
  const colorFor = (r: HBarRow) => {
    if (groups && r.group) return SERIES[Math.min(groups.indexOf(r.group), SERIES.length - 1)];
    if (anyHighlight) return r.highlight ? SERIES[0] : MUTED_MARK;
    return SERIES[0];
  };
  const h = height ?? rows.length * 34 + 16;
  const labelWidth = Math.min(260, Math.max(...rows.map((r) => r.label.length)) * 6.2 + 12);
  return (
    <div>
      <div style={{ height: h }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 56, bottom: 0, left: 0 }} barCategoryGap={6}>
            <CartesianGrid horizontal={false} stroke={INK.grid} strokeWidth={1} />
            <XAxis type="number" hide domain={[0, (max: number) => max * 1.08]} />
            <YAxis type="category" dataKey="label" width={labelWidth} tick={{ fontSize: 12, fill: INK.secondary }} axisLine={{ stroke: INK.axis }} tickLine={false} interval={0} />
            <Tooltip
              cursor={{ fill: "rgba(11,11,11,0.04)" }}
              formatter={(v) => [`${csNumber(Number(v), digits)} ${unit}`.trim(), ""]}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${INK.grid}` }}
              separator=""
            />
            <Bar dataKey="value" barSize={BAR.size} radius={[0, BAR.radius, BAR.radius, 0]} isAnimationActive={false}>
              {rows.map((r, i) => (
                <Cell key={i} fill={colorFor(r)} />
              ))}
              <LabelList dataKey="value" position="right" formatter={(v: unknown) => `${csNumber(Number(v), digits)}${unit ? ` ${unit}` : ""}`} style={{ fontSize: 12, fill: INK.primary }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {groups && (
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {groups.map((g, i) => (
            <li key={g} className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: SERIES[i] }} />
              {g}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
