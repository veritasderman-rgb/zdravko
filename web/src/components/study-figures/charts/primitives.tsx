import type { CSSProperties, ReactNode } from "react";
import { BAR, INK, csNumber } from "@/components/charts/theme";

/* Společné stavební prvky datových grafů studie: HTML pruhy (text zůstává textem),
   tenká mřížka, legenda. Animace přes `data-anim` uvnitř <Reveal>. */

export const anim = (i: number) => ({ "--i": i }) as CSSProperties;

/** Hezký krok mřížky (1, 2, 2,5, 5 × 10^n). */
export function niceTicks(min: number, max: number, count = 4) {
  const raw = (max - min) / count;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? raw;
  const lo = step * Math.floor(min / step);
  const hi = step * Math.ceil(max / step);
  const ticks: number[] = [];
  for (let t = lo; t <= hi + step / 1000; t += step) ticks.push(Math.round(t * 1000) / 1000);
  return { lo, hi, ticks };
}

export function Swatch({ color, line = false, dashed = false }: { color: string; line?: boolean; dashed?: boolean }) {
  if (line)
    return (
      <span aria-hidden className="inline-block w-5 shrink-0" style={{ borderTop: `3px ${dashed ? "dashed" : "solid"} ${color}` }} />
    );
  return <span aria-hidden className="inline-block h-3.5 w-3.5 shrink-0 rounded-[3px]" style={{ background: color }} />;
}

export function Legend({ items }: { items: { label: string; color: string; line?: boolean; dashed?: boolean }[] }) {
  return (
    <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[15px] text-ink-2" aria-label="Legenda">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-2">
          <Swatch color={it.color} line={it.line} dashed={it.dashed} />
          {it.label}
        </li>
      ))}
    </ul>
  );
}

/** Svislé linky mřížky přes celou výšku nadřazeného `relative` bloku. */
export function GridLines({ ticks, lo, hi, right = "5.5rem" }: { ticks: number[]; lo: number; hi: number; right?: string }) {
  const pos = (t: number) => `${((t - lo) / (hi - lo)) * 100}%`;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0" style={{ right }}>
      {ticks.map((t) => (
        <span key={t} className="absolute inset-y-0 w-px" style={{ left: pos(t), background: t === 0 ? INK.axis : INK.grid }} />
      ))}
    </div>
  );
}

export function AxisLabels({ ticks, lo, hi, fmt = (t: number) => csNumber(t, 1) }: { ticks: number[]; lo: number; hi: number; fmt?: (t: number) => string }) {
  const pos = (t: number) => `${((t - lo) / (hi - lo)) * 100}%`;
  return (
    <div aria-hidden className="relative mt-2 h-5 text-[13px] tabular-nums text-muted">
      {ticks.map((t, i) => (
        <span key={t} className={`absolute top-0 whitespace-nowrap ${i === 0 ? "" : i === ticks.length - 1 ? "-translate-x-full" : "-translate-x-1/2"}`} style={{ left: pos(t) }}>
          {fmt(t)}
        </span>
      ))}
    </div>
  );
}

export type BarRow = {
  label: ReactNode;
  /** Pruh od `lo` (výchozí začátek osy) do `value`. */
  value: number;
  lo?: number;
  color: string;
  /** Text u konce pruhu. */
  text: string;
  /** Popis pro tooltip (title). */
  title: string;
  strong?: boolean;
  /** Svislá značka uvnitř pruhu (např. medián, vrchol). */
  marker?: { at: number; label?: string };
  /** Rozpětí za koncem pruhu (tenká čára s koncovou značkou) až do této hodnoty. */
  whisker?: number;
};

/**
 * Vodorovné pruhy: popisek nad pruhem, hodnota u konce, zaoblený jen datový konec, tenká mřížka.
 * Pruhy rostou zleva (`data-anim="grow"`).
 */
export function HBars({
  rows,
  lo,
  hi,
  ticks,
  fmt,
  start = 0,
}: {
  rows: BarRow[];
  lo: number;
  hi: number;
  ticks: number[];
  fmt?: (t: number) => string;
  start?: number;
}) {
  const pos = (v: number) => ((v - lo) / (hi - lo)) * 100;
  return (
    <div className="relative pr-[5.5rem]">
      <GridLines ticks={ticks} lo={lo} hi={hi} />
      <ul className="relative flex flex-col gap-3.5">
        {rows.map((r, i) => {
          const from = pos(r.lo ?? lo);
          const to = pos(r.value);
          const end = r.whisker != null ? pos(r.whisker) : to;
          return (
            <li key={i} className="flex flex-col gap-1">
              <span className={`text-[16px] leading-snug md:text-[17px] ${r.strong ? "font-semibold text-ink" : "text-ink-2"}`}>{r.label}</span>
              <span className="relative block" style={{ height: BAR.size }}>
                <span
                  data-anim="grow"
                  className="absolute inset-y-0 block"
                  style={{ ...anim(start + i), left: `${from}%`, width: `${to - from}%`, background: r.color, borderRadius: `${r.lo != null && r.lo !== lo ? BAR.radius : 0}px ${BAR.radius}px ${BAR.radius}px ${r.lo != null && r.lo !== lo ? BAR.radius : 0}px` }}
                  title={r.title}
                />
                {r.whisker != null && (
                  <span data-anim style={{ ...anim(start + i), left: `${to}%`, width: `${end - to}%` }} aria-hidden className="absolute top-1/2 block h-[10px] -translate-y-1/2" title={r.title}>
                    <span className="absolute inset-x-0 top-1/2 block h-0.5 -translate-y-1/2" style={{ background: r.color }} />
                    <span className="absolute -right-0.5 inset-y-0 block w-0.5" style={{ background: r.color }} />
                  </span>
                )}
                {r.marker && (
                  <span aria-hidden className="absolute -inset-y-1 w-0.5" style={{ left: `${pos(r.marker.at)}%`, background: INK.primary }} title={r.marker.label} />
                )}
                <span className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-2 text-[15px] font-semibold tabular-nums text-ink" style={{ left: `${end}%` }}>
                  {r.text}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <AxisLabels ticks={ticks} lo={lo} hi={hi} fmt={fmt} />
    </div>
  );
}

/** Malý nadpis panelu uvnitř grafu. */
export function PanelTitle({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-[15px] font-bold uppercase tracking-[0.06em] text-forest">{children}</p>;
}

/** Poznámka pod grafem (vysvětlení, ne zdroj). */
export function Note({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{children}</p>;
}

export const pct = (v: number, digits = 1) => `${csNumber(v, digits)} %`;
export const bn = (v: number, digits = 1) => `${csNumber(v, digits)} mld. Kč`;
