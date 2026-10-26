"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  useCartesianScale,
} from "recharts";
import { ChartFrame } from "@/components/charts/chart-frame";
import { DataTable } from "@/components/charts/data-table";
import { FONT_SANS, FONT_SERIF, INK, MUTED_MARK, SERIES, TICK, csNumber } from "@/components/charts/theme";
import { ACUTE_BEDS, GP_P2, RAMP } from "@/content/figures/charts";
import { MODEL_NOTE } from "@/content/cisla";
import { Reveal } from "../reveal";
import { Legend, Note, anim } from "./primitives";

/* Spojnicové a plošné grafy studie (Recharts, klientské). */

/** Text v souřadnicích dat (anotace místo legendy). */
function DataNote({ x, y, children, anchor = "start", dy = 0, italic = false, bold = false }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end"; dy?: number; italic?: boolean; bold?: boolean }) {
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

function TipBox({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-lg border border-line bg-paper px-3 py-2 text-[15px] text-ink">
      <div className="font-semibold">{title}</div>
      {lines.map((l) => (
        <div key={l} className="tabular-nums">
          {l}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. Akutní lůžka 2024–2038 (ř. 850)
// ---------------------------------------------------------------------------
type BedRow = { year: number; actual?: number; plan?: number };

export function AcuteBedsFigure() {
  const d = ACUTE_BEDS;
  const rows: BedRow[] = [...d.actual.map((a) => ({ year: a.year, actual: a.beds })), ...d.plan.map((p) => ({ year: p.year, plan: p.beds }))];
  const last = d.plan[d.plan.length - 1];
  const base = d.plan[0].beds;
  return (
    <ChartFrame
      title="Do roku 2038 změní účel asi 8 000 akutních lůžek, většina až s krajskými plány od roku 2033"
      subtitle={`Akutní lůžka v Česku: skutečnost 2024 a 2025 (předběžně) a plánovací trajektorie studie 2031–2038; ze ${csNumber(d.per1000From)} na ${csNumber(d.per1000To)} lůžka na 1 000 obyvatel`}
      source="NRHZS, datový souhrn OIS-11-28 (zpracováno 30. 6. 2026; rok 2025 předběžně); plánovací trajektorie studie v3"
      table={
        <DataTable
          header={["Rok", "Akutní lůžka", "Druh údaje"]}
          rows={[
            ...d.actual.map((a) => [String(a.year), csNumber(a.beds, 0), a.year === 2025 ? "skutečnost, předběžně" : "skutečnost"]),
            ["2031–2032", csNumber(base, 0), "plán: jen dobrovolné přeměny a minimální objemy"],
            ["2033–2038", `ubývá asi ${csNumber(d.perYear, 0)} ročně`, "plán: přeměna podle krajských plánů"],
            [String(last.year), `asi ${csNumber(last.beds, 0)}`, "plán"],
          ]}
        />
      }
    >
      <Reveal>
        <div data-anim style={anim(0)} className="font-sans">
          <Legend
            items={[
              { label: "skutečnost (NZIP/ÚZIS)", color: SERIES[0], line: true },
              { label: "plánovací trajektorie studie", color: SERIES[1], line: true, dashed: true },
            ]}
          />
          <div className="h-[280px] w-full md:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows} margin={{ top: 28, right: 16, bottom: 4, left: 4 }}>
                <CartesianGrid vertical={false} stroke={INK.grid} strokeWidth={1} />
                <ReferenceLine x={2033} stroke={MUTED_MARK} strokeWidth={1} />
                <XAxis dataKey="year" type="number" domain={[2024, 2038]} ticks={[2024, 2028, 2033, 2038]} tick={TICK} axisLine={{ stroke: INK.axis }} tickLine={false} />
                <YAxis domain={[38000, 50000]} ticks={[38000, 42000, 46000, 50000]} tick={TICK} axisLine={false} tickLine={false} width={64} tickFormatter={(v: number) => csNumber(v, 0)} />
                <Tooltip
                  cursor={{ stroke: INK.axis, strokeWidth: 1 }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const r = payload[0].payload as BedRow;
                    return <TipBox title={`Rok ${String(label)}`} lines={[r.actual != null ? `skutečnost: ${csNumber(r.actual, 0)}` : `plán: ${csNumber(r.plan ?? 0, 0)}`]} />;
                  }}
                />
                <Line type="linear" dataKey="actual" stroke={SERIES[0]} strokeWidth={2.5} dot={{ r: 4, fill: SERIES[0], stroke: INK.surface, strokeWidth: 2 }} activeDot={{ r: 6 }} isAnimationActive={false} connectNulls={false} />
                <Line type="linear" dataKey="plan" stroke={SERIES[1]} strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 4, fill: SERIES[1], stroke: INK.surface, strokeWidth: 2 }} activeDot={{ r: 6 }} isAnimationActive={false} connectNulls={false} />
                <DataNote x={2024} y={d.actual[0].beds} dy={-12} bold>{csNumber(d.actual[0].beds, 0)}</DataNote>
                <DataNote x={2025} y={d.actual[1].beds} dy={22} anchor="start">{`${csNumber(d.actual[1].beds, 0)} (2025, předb.)`}</DataNote>
                <DataNote x={2038} y={last.beds} dy={-12} anchor="end" bold>{`asi ${csNumber(last.beds, 0)}`}</DataNote>
                <DataNote x={2038} y={49200} anchor="end" italic>krajské plány</DataNote>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <Note>
            Trajektorie je plánovací, ne prognóza: tempo v každém kraji určí krajský plán a pojistky (stop při obložnosti nad 85 %). Plán počítá od základu {csNumber(base, 0)} lůžek z roku 2024; předběžný pokles v roce 2025 by jen zmenšil počet lůžek, které zbývá přeměnit. V letech 2010 až 2013 ubylo {csNumber(d.lesson.acuteLost, 0)} akutních lůžek, ale lůžek následné a dlouhodobé péče přibylo jen {d.lesson.followUpAdded}. To se nesmí opakovat.
          </Note>
        </div>
      </Reveal>
    </ChartFrame>
  );
}

// ---------------------------------------------------------------------------
// 10. Náběh 2028–2038 (ř. 1406)
// ---------------------------------------------------------------------------
export function RampFigure() {
  const total = RAMP.reduce((a, r) => a + r.net, 0);
  const notes = RAMP.filter((r) => [2031, 2035, 2038].includes(r.year));
  return (
    <ChartFrame
      title="Náklad nabíhá jedenáct let a většina peněz se utratí až po bráně B3 v prosinci 2031"
      subtitle="Čistý náklad reformy po letech, mld. Kč ročně; varianta A, scénář „Vláda 2030“, ceny 2026"
      source={`${MODEL_NOTE} Kumulativně 2028–2038 asi ${csNumber(Math.round(total), 0)} mld. Kč. Počty týmů: studie, Části I a V.`}
      table={
        <DataTable
          header={["Rok", "Čistý náklad (mld. Kč)", "Týmů"]}
          rows={RAMP.map((r) => [String(r.year), csNumber(r.net), r.teams != null ? csNumber(r.teams, 0) : "—"])}
        />
      }
    >
      <Reveal>
        <div data-anim style={anim(0)} className="font-sans">
          <div className="h-[260px] w-full md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RAMP} margin={{ top: 28, right: 16, bottom: 4, left: 0 }}>
                <CartesianGrid vertical={false} stroke={INK.grid} strokeWidth={1} />
                <ReferenceArea x1={2028} x2={2029} fill={INK.grid} fillOpacity={0.7} ifOverflow="hidden" />
                <XAxis dataKey="year" type="number" domain={[2028, 2038]} ticks={[2028, 2030, 2032, 2034, 2036, 2038]} tick={TICK} axisLine={{ stroke: INK.axis }} tickLine={false} />
                <YAxis domain={[0, 25]} ticks={[0, 5, 10, 15, 20, 25]} tick={TICK} axisLine={false} tickLine={false} width={36} />
                <Tooltip
                  cursor={{ stroke: INK.axis, strokeWidth: 1 }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const r = payload[0].payload as (typeof RAMP)[number];
                    return <TipBox title={`Rok ${String(label)}`} lines={[`čistý náklad ${csNumber(r.net)} mld. Kč`, ...(r.teams != null ? [`${r.teams} týmů`] : [])]} />;
                  }}
                />
                <ReferenceLine x={2031.95} stroke={INK.primary} strokeWidth={1.5} strokeDasharray="4 4" />
                <Area type="linear" dataKey="net" stroke={SERIES[0]} strokeWidth={2.5} fill={SERIES[0]} fillOpacity={0.18} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: INK.surface }} isAnimationActive={false} />
                <DataNote x={2028.5} y={2.2} anchor="middle" italic>pilot</DataNote>
                <DataNote x={2031.95} y={24} dy={-6} anchor="end" italic>brána B3 ▸</DataNote>
                {notes.map((n) => (
                  <DataNote key={n.year} x={n.year} y={n.net} dy={-12} anchor={n.year === 2038 ? "end" : "middle"} bold>
                    {csNumber(n.net)}
                  </DataNote>
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-[15px] text-ink-2">
            Týmy sdružené péče:{" "}
            {RAMP.filter((r) => r.teams != null)
              .map((r) => `${r.teams} (${r.year})`)
              .join(" · ")}
          </p>
          <Note>Šedě pilot ve třech ORP 2028–2029. Smluvní model běží od roku 2030, zákon o primární péči je účinný od 1. 1. 2032. Nový tým obsadí v prvním roce polovinu míst sester; neobsazené místo se neplatí.</Note>
        </div>
      </Reveal>
    </ChartFrame>
  );
}

// ---------------------------------------------------------------------------
// 13. Praktici pro dospělé bez P2 a s P2 (ř. 1493)
// ---------------------------------------------------------------------------
type GpRow = { year: number; low: number; high: number; band: [number, number]; p2Low: number | null; p2High: number | null };

function gpRows(): GpRow[] {
  const g = GP_P2;
  const out: GpRow[] = [];
  for (let y = g.startYear; y <= g.endYear; y++) {
    const n = y - g.startYear;
    const low = g.start - n * g.lossHigh;
    const high = g.start - n * g.lossLow;
    const p2 = y >= g.p2From ? (y - g.p2From + 1) * g.p2PerYear : 0;
    const showP2 = y >= g.p2From - 1;
    out.push({ year: y, low, high, band: [low, high], p2Low: showP2 ? low + p2 : null, p2High: showP2 ? high + p2 : null });
  }
  return out;
}

export function GpP2Figure() {
  const rows = gpRows();
  const g = GP_P2;
  const last = rows[rows.length - 1];
  const gain = (g.endYear - g.p2From + 1) * g.p2PerYear;
  return (
    <ChartFrame
      title={`Úbytek praktiků rezidenční místa nezastaví: P2 přidá do roku ${g.endYear} asi ${csNumber(gain, 0)} lékařů`}
      subtitle={`Praktici pro dospělé, počet; rozpětí podle úbytku ${g.lossLow} až ${g.lossHigh} ročně. P2 = +${g.p2PerYear} atestací ročně od roku ${g.p2From} (předpoklad modelu)`}
      source={`${MODEL_NOTE} ${csNumber(g.start, 0)} praktiků pro dospělé v roce ${g.startYear} (ÚZIS). Roky po 2035 jsou aritmetika téhož pravidla do konce náběhu reformy.`}
      table={
        <DataTable
          header={["Rok", "Bez P2", "S P2"]}
          rows={rows.map((r) => [
            String(r.year),
            `${csNumber(r.low, 0)} až ${csNumber(r.high, 0)}`,
            r.p2Low != null && r.year >= g.p2From ? `${csNumber(r.p2Low, 0)} až ${csNumber(r.p2High!, 0)}` : "—",
          ])}
        />
      }
    >
      <Reveal>
        <div data-anim style={anim(0)} className="font-sans">
          <Legend
            items={[
              { label: "bez P2 (rozpětí)", color: SERIES[0] },
              { label: `s P2: +${g.p2PerYear} atestací ročně od ${g.p2From}`, color: SERIES[1], line: true },
            ]}
          />
          <div className="h-[280px] w-full md:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={rows} margin={{ top: 28, right: 16, bottom: 4, left: 0 }}>
                <CartesianGrid vertical={false} stroke={INK.grid} strokeWidth={1} />
                <XAxis dataKey="year" type="number" domain={[g.startYear, g.endYear]} ticks={[2026, 2029, 2032, 2035, 2038]} tick={TICK} axisLine={{ stroke: INK.axis }} tickLine={false} />
                <YAxis domain={[3000, 5600]} ticks={[3000, 3500, 4000, 4500, 5000, 5500]} tick={TICK} axisLine={false} tickLine={false} width={52} tickFormatter={(v: number) => csNumber(v, 0)} />
                <Tooltip
                  cursor={{ stroke: INK.axis, strokeWidth: 1 }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const r = payload[0].payload as GpRow;
                    return (
                      <TipBox
                        title={`Rok ${String(label)}`}
                        lines={[`bez P2: ${csNumber(r.low, 0)} až ${csNumber(r.high, 0)}`, ...(r.p2Low != null && r.year >= g.p2From ? [`s P2: ${csNumber(r.p2Low, 0)} až ${csNumber(r.p2High!, 0)}`] : [])]}
                      />
                    );
                  }}
                />
                <ReferenceLine x={g.p2From} stroke={MUTED_MARK} strokeWidth={1} />
                <Area type="linear" dataKey="band" stroke="none" fill={SERIES[0]} fillOpacity={0.2} isAnimationActive={false} activeDot={false} />
                <Line type="linear" dataKey="high" stroke={SERIES[0]} strokeWidth={2} dot={false} activeDot={false} isAnimationActive={false} />
                <Line type="linear" dataKey="low" stroke={SERIES[0]} strokeWidth={2} dot={false} activeDot={false} isAnimationActive={false} />
                <Line type="linear" dataKey="p2High" stroke={SERIES[1]} strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: INK.surface }} isAnimationActive={false} connectNulls={false} />
                <Line type="linear" dataKey="p2Low" stroke={SERIES[1]} strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: INK.surface }} isAnimationActive={false} connectNulls={false} />
                <DataNote x={g.startYear} y={g.start} dy={-12} bold>{`${g.startYear}: ${csNumber(g.start, 0)}`}</DataNote>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-[16px] text-ink">
            V roce {g.endYear}: bez P2 <span className="font-semibold tabular-nums">{csNumber(last.low, 0)} až {csNumber(last.high, 0)}</span>, s P2{" "}
            <span className="font-semibold tabular-nums">
              {csNumber(last.p2Low ?? 0, 0)} až {csNumber(last.p2High ?? 0, 0)}
            </span>{" "}
            praktiků. V roce 2035 bez P2 {csNumber(rows.find((r) => r.year === 2035)!.low, 0)} až {csNumber(rows.find((r) => r.year === 2035)!.high, 0)}.
          </p>
          <Note>Úbytek nahrazují hlavně sestry v týmech, nové výkony praktiků a sdílené zastupování. Rezidenční místa P2 musí potvrdit ministerstvo a odborné společnosti. Asi třetina praktiků je starší 60 let (ÚZIS k 31. 12. 2024), odchody se tedy mohou zrychlit a dolní mez klesnout.</Note>
        </div>
      </Reveal>
    </ChartFrame>
  );
}
