import type { ReactNode } from "react";

/**
 * Tabulková verze grafu (pro přepínač v ChartFrame, čtečky a tisk). První sloupec je záhlaví řádku;
 * ostatní sloupce jsou při `numeric` zarovnané vpravo (čísla), jinak vlevo (text).
 */
export function DataTable({ header, rows, caption, numeric = true }: { header: string[]; rows: ReactNode[][]; caption?: string; numeric?: boolean }) {
  return (
    <div className="overflow-x-auto" role="region" aria-label={caption ?? "Tabulka"} tabIndex={0}>
      <table className="w-full border-collapse text-left text-[16px] leading-snug md:text-[17px]">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {header.map((h, i) => (
              <th key={i} scope="col" className={`border-b-2 border-line-strong px-3 py-2 align-bottom text-[15px] font-bold text-ink ${i > 0 && numeric ? "text-right" : ""}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line">
              {r.map((c, j) =>
                j === 0 ? (
                  <th key={j} scope="row" className="px-3 py-2 align-top font-normal text-ink">{c}</th>
                ) : (
                  <td key={j} className={`px-3 py-2 align-top text-ink ${numeric ? "text-right tabular-nums" : ""}`}>{typeof c === "number" ? c.toLocaleString("cs-CZ") : c}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
