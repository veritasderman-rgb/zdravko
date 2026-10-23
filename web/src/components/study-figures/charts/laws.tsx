import { ChartFrame } from "@/components/charts/chart-frame";
import { DataTable } from "@/components/charts/data-table";
import { INK, SERIES } from "@/components/charts/theme";
import { BILLS, BILL_SIZES, BILL_YEARS, type BillSize } from "@/content/figures/charts";
import { Reveal } from "../reveal";
import { Legend, Note, anim } from "./primitives";

// ---------------------------------------------------------------------------
// 14. Legislativní zátěž podle let (ř. 1721): skládané sloupce, jeden dílek = jedna předloha
// ---------------------------------------------------------------------------
const SIZE_COLOR: Record<BillSize, string> = { S: SERIES[0], M: SERIES[1], L: SERIES[2] };
const UNIT = 26; // výška jednoho dílku v px

export function LawsByYearFigure() {
  const byYear = BILL_YEARS.map((y) => {
    const bills = BILLS.filter((b) => b.year === y);
    const order: BillSize[] = ["L", "M", "S"];
    return { year: y, bills: [...bills].sort((a, b) => order.indexOf(a.size) - order.indexOf(b.size)) };
  });
  const max = Math.max(...byYear.map((y) => y.bills.length));
  const count = (s: BillSize) => BILLS.filter((b) => b.size === s).length;
  const ticks = Array.from({ length: Math.floor(max / 2) + 1 }, (_, i) => i * 2);
  return (
    <ChartFrame
      title="Legislativní zátěž vrcholí v letech 2030 a 2032: osm a sedm předloh"
      subtitle={`Počet předloh podle roku předložení a rozsahu; ${BILLS.length} předloh vln 0–4: ${count("S")} malé, ${count("M")} středních, ${count("L")} velké`}
      source="Studie v3, Část VII, součet tabulek vln 0–4; stav předpisů k 20. 10. 2026. Jedna předloha může novelizovat více zákonů."
      table={
        <DataTable
          numeric={false}
          header={["Rok předložení", "Malé", "Střední", "Velké", "Předlohy"]}
          rows={byYear.map((y) => [
            y.year,
            String(y.bills.filter((b) => b.size === "S").length),
            String(y.bills.filter((b) => b.size === "M").length),
            String(y.bills.filter((b) => b.size === "L").length),
            y.bills.length ? y.bills.map((b) => `${b.name} (${b.size}, vlna ${b.wave})`).join("; ") : "—",
          ])}
        />
      }
    >
      <Reveal>
        <div className="font-sans">
          <Legend items={BILL_SIZES.map((s) => ({ label: `${s.label}: ${count(s.key)}`, color: SIZE_COLOR[s.key] }))} />
          <div className="relative pl-7">
            {/* mřížka a osa y */}
            <div aria-hidden className="pointer-events-none absolute left-7 right-0 top-6" style={{ height: max * UNIT }}>
              {ticks.map((t) => (
                <span key={t} className="absolute inset-x-0 h-px" style={{ bottom: t * UNIT, background: t === 0 ? INK.axis : INK.grid }}>
                  <span className="absolute -left-7 w-5 -translate-y-1/2 text-right text-[13px] tabular-nums text-muted" style={{ top: 0 }}>
                    {t}
                  </span>
                </span>
              ))}
            </div>
            <ul className="relative ml-2 flex items-end gap-2 sm:gap-4" style={{ height: max * UNIT + 24 }}>
              {byYear.map((y, i) => (
                <li key={y.year} data-anim style={anim(i)} className="flex h-full min-w-0 flex-1 flex-col justify-end">
                  <span className="mb-1 text-center text-[15px] font-semibold tabular-nums text-ink">{y.bills.length || ""}</span>
                  <span className="mx-auto flex w-full max-w-[56px] flex-col gap-[2px]" role="img" aria-label={`${y.year}: ${y.bills.length} předloh`}>
                    {y.bills.map((b, j) => (
                      <span
                        key={b.name}
                        title={`${b.name} (${BILL_SIZES.find((s) => s.key === b.size)!.label}, vlna ${b.wave})`}
                        className="block w-full"
                        style={{ height: UNIT - 2, background: SIZE_COLOR[b.size], borderRadius: j === 0 ? `${4}px ${4}px 0 0` : undefined }}
                      />
                    ))}
                  </span>
                </li>
              ))}
            </ul>
            <ul aria-hidden className="ml-2 mt-2 flex gap-2 sm:gap-4">
              {byYear.map((y) => (
                <li key={y.year} className="min-w-0 flex-1 text-center text-[13px] leading-tight text-ink-2 sm:text-[14px]">
                  {y.year}
                </li>
              ))}
            </ul>
          </div>
          <Note>
            V roce 2030 se předkládají finanční a daňové zákony spolu se zákonem o primární péči, v roce 2032 balíček vlny 4. V roce 2031 je jen zákon o síti, ale Sněmovna tehdy projednává obě velké předlohy současně. Vlna 0 jde z opozice přes ministerstvo, pojišťovny a pozměňovací návrhy; jako samostatnou předlohu z ní počítáme jednu malou, souhrnně za roky 2027–2028.
          </Note>
        </div>
      </Reveal>
    </ChartFrame>
  );
}
