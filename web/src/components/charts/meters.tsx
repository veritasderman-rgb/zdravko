import { BAR, INK, SERIES, csNumber } from "./theme";

/** Měřidla obložnosti s prahem (85 %). Popisek nad pruhem, hodnota u konce, práh popsaný přímo. */
export function OccupancyMeters({ rows, threshold }: { rows: { label: string; value: number }[]; threshold: number }) {
  return (
    <div className="font-sans">
      <ul className="relative flex flex-col gap-5 pr-16">
        {rows.map((r) => (
          <li key={r.label} className="flex flex-col gap-1">
            <span className="text-[16px] leading-snug text-ink md:text-[17px]">{r.label}</span>
            <span className="relative block" style={{ height: BAR.size + 2 }}>
              <span className="absolute inset-0 rounded-[4px]" style={{ background: INK.grid }} />
              <span className="absolute inset-y-0 left-0" style={{ width: `${r.value}%`, background: SERIES[0], borderRadius: `0 ${BAR.radius}px ${BAR.radius}px 0` }} />
              <span className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-2 text-[15px] font-semibold tabular-nums text-ink" style={{ left: "100%" }}>
                {csNumber(r.value, 0)} %
              </span>
              <span aria-hidden className="absolute -inset-y-1.5 w-0.5" style={{ left: `${threshold}%`, background: INK.primary }} />
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[15px] text-muted">
        <span aria-hidden className="mr-2 inline-block h-3.5 w-0.5 align-middle" style={{ background: INK.primary }} />
        Svislá čára: obložnost {threshold} %, nad kterou se přeměna lůžek v kraji zastaví.
      </p>
    </div>
  );
}

/** Jeden skládaný pruh: kdo platí. Barvy podle skupiny (pevné pořadí slotů), legenda s hodnotami pod pruhem. */
export function StackedBar({ rows, groups, total, unit = "mld. Kč" }: { rows: { label: string; value: number; group: string }[]; groups: string[]; total: number; unit?: string }) {
  return (
    <div className="font-sans">
      <div className="flex h-6 w-full gap-[2px]" role="img" aria-label={rows.map((r) => `${r.label}: ${csNumber(r.value)} ${unit}`).join("; ")}>
        {rows.map((r, i) => (
          <div
            key={r.label}
            title={`${r.label}: ${csNumber(r.value)} ${unit}`}
            className="h-full"
            style={{ width: `${(r.value / total) * 100}%`, background: SERIES[groups.indexOf(r.group)], borderRadius: i === rows.length - 1 ? `0 ${BAR.radius}px ${BAR.radius}px 0` : undefined }}
          />
        ))}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[15px] text-ink-2" aria-label="Legenda">
        {groups.map((g, i) => (
          <li key={g} className="flex items-center gap-2">
            <span aria-hidden className="inline-block h-3.5 w-3.5 rounded-[3px]" style={{ background: SERIES[i] }} />
            {g}
          </li>
        ))}
      </ul>
      <ul className="mt-4 flex flex-col text-[16px] md:text-[17px]">
        {rows.map((r) => (
          <li key={r.label} className="flex items-baseline gap-3 border-t border-line py-2">
            <span aria-hidden className="inline-block h-3 w-3 shrink-0 rounded-[3px]" style={{ background: SERIES[groups.indexOf(r.group)] }} />
            <span className="flex-1 text-ink">{r.label}</span>
            <span className="font-semibold tabular-nums text-ink">{csNumber(r.value)} {unit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
