import { BAR, INK, MUTED_MARK, SERIES, csNumber } from "./theme";

export interface HBarRow {
  label: string;
  value: number;
  highlight?: boolean;
  group?: string;
}

/** Hezké maximum osy a krok mřížky (1, 2, 2,5, 5 × 10^n). */
function niceScale(max: number, ticks = 4) {
  const raw = max / ticks;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? raw;
  return { step, max: step * Math.ceil(max / step) };
}

/**
 * Vodorovné pruhy v čistém HTML (vykreslené na serveru). Popisek kategorie stojí nad pruhem,
 * hodnota u konce pruhu, zaoblený je jen datový konec. Jedna řada = jedna barva;
 * `highlight` ztlumí ostatní pruhy; `groups` obarví pruhy podle skupiny (pevné pořadí slotů)
 * a vykreslí legendu.
 */
export function HBarChart({ rows, unit = "", digits = 1, groups }: { rows: HBarRow[]; unit?: string; digits?: number; groups?: string[]; height?: number }) {
  const anyHighlight = rows.some((r) => r.highlight);
  const colorFor = (r: HBarRow) => {
    if (groups && r.group) return SERIES[Math.min(Math.max(groups.indexOf(r.group), 0), SERIES.length - 1)];
    if (anyHighlight) return r.highlight ? SERIES[0] : MUTED_MARK;
    return SERIES[0];
  };
  const { step, max } = niceScale(Math.max(...rows.map((r) => r.value)));
  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step);
  const fmt = (v: number) => `${csNumber(v, digits)}${unit ? (unit === "%" ? " %" : ` ${unit}`) : ""}`;

  return (
    <div className="font-sans">
      {groups && (
        <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[15px] text-ink-2" aria-label="Legenda">
          {groups.map((g, i) => (
            <li key={g} className="flex items-center gap-2">
              <span aria-hidden className="inline-block h-3.5 w-3.5 rounded-[3px]" style={{ background: SERIES[i] }} />
              {g}
            </li>
          ))}
        </ul>
      )}
      <div className="relative pr-[5.5rem]">
        {/* mřížka: tenké plné svislé linky */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 right-[5.5rem]">
          {ticks.map((t) => (
            <span key={t} className="absolute inset-y-0 w-px" style={{ left: `${(t / max) * 100}%`, background: t === 0 ? INK.axis : INK.grid }} />
          ))}
        </div>
        <ul className="relative flex flex-col gap-3.5">
          {rows.map((r) => (
            <li key={r.label} className="flex flex-col gap-1">
              <span className={`text-[16px] leading-snug md:text-[17px] ${r.highlight ? "font-semibold text-ink" : "text-ink-2"}`}>{r.label}</span>
              <span className="relative block" style={{ height: BAR.size }}>
                <span
                  className="absolute inset-y-0 left-0 block"
                  style={{ width: `${(r.value / max) * 100}%`, background: colorFor(r), borderRadius: `0 ${BAR.radius}px ${BAR.radius}px 0` }}
                  title={`${r.label}: ${fmt(r.value)}`}
                />
                <span className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-2 text-[15px] font-semibold tabular-nums text-ink" style={{ left: `${(r.value / max) * 100}%` }}>
                  {fmt(r.value)}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <div aria-hidden className="relative mt-2 h-5 text-[13px] tabular-nums text-muted">
          {ticks.map((t, i) => (
            <span key={t} className={`absolute top-0 ${i === 0 ? "" : i === ticks.length - 1 ? "-translate-x-full" : "-translate-x-1/2"}`} style={{ left: `${(t / max) * 100}%` }}>
              {csNumber(t, digits)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
