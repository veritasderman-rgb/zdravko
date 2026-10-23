import type { ReactNode } from "react";

/** Rámeček grafu: titulek jako věta, zdroj, tabulková varianta pro čtečky a tisk. */
export function ChartFrame({ title, source, children, table }: { title: string; source?: string; children: ReactNode; table?: { header: string[]; rows: (string | number)[][] } }) {
  return (
    <figure className="rounded-xl border border-line bg-[#fcfcfb] p-5">
      <figcaption className="mb-3">
        <div className="text-base font-semibold leading-snug">{title}</div>
        {source && <div className="mt-0.5 text-xs text-muted">{source}</div>}
      </figcaption>
      {children}
      {table && (
        <details className="mt-3 text-xs text-muted">
          <summary className="cursor-pointer select-none hover:text-foreground">Zobrazit jako tabulku</summary>
          <table className="doc-table mt-2 text-foreground">
            <thead>
              <tr>{table.header.map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {table.rows.map((r, i) => (
                <tr key={i}>{r.map((c, j) => <td key={j} className={j > 0 ? "tabular-nums" : ""}>{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </figure>
  );
}
