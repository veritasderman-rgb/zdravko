import { INK, SERIES, csNumber } from "./theme";

/** Měřidla obložnosti s prahem 85 %. Jednoduché HTML, bez knihovny. */
export function OccupancyMeters({ rows, threshold }: { rows: { label: string; value: number }[]; threshold: number }) {
  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-foreground">{r.label}</span>
            <span className="tabular-nums text-foreground">{csNumber(r.value, 0)} %</span>
          </div>
          <div className="relative h-[22px] w-full rounded bg-[#cde2fb]">
            <div className="h-full rounded-l rounded-r-[4px]" style={{ width: `${r.value}%`, background: r.value >= threshold ? SERIES[1] : SERIES[0] }} />
            <div className="absolute top-[-4px] bottom-[-4px] w-px" style={{ left: `${threshold}%`, background: INK.primary }} title={`Práh ${threshold} %`} />
          </div>
        </div>
      ))}
      <div className="text-xs text-muted">Svislá čára: obložnost {threshold} %, nad kterou se přeměna lůžek v kraji zastaví.</div>
    </div>
  );
}

/** Jeden skládaný pruh: kdo platí. */
export function StackedBar({ rows, groups, total, unit = "mld. Kč" }: { rows: { label: string; value: number; group: string }[]; groups: string[]; total: number; unit?: string }) {
  return (
    <div>
      <div className="flex h-[26px] w-full gap-[2px] overflow-hidden rounded">
        {rows.map((r) => (
          <div key={r.label} title={`${r.label}: ${csNumber(r.value)} ${unit}`} className="h-full first:rounded-l last:rounded-r" style={{ width: `${(r.value / total) * 100}%`, background: SERIES[groups.indexOf(r.group)] }} />
        ))}
      </div>
      <ul className="mt-3 space-y-1 text-sm">
        {rows.map((r) => (
          <li key={r.label} className="flex items-baseline gap-2">
            <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: SERIES[groups.indexOf(r.group)] }} />
            <span className="flex-1 text-foreground">{r.label}</span>
            <span className="tabular-nums">{csNumber(r.value)} {unit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
