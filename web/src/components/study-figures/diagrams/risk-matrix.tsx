import { RISK_MATRIX as D, type Risk } from "@/content/figures/diagrams";
import { DiagramFrame, SourceNote, vi } from "./shared";

/** Matice rizik: pravděpodobnost × dopad, 19 rizik ve čtyřech polích (Část X, ř. 2078–2112). */

const CELLS: { prob: Risk["prob"]; impact: Risk["impact"]; hot?: boolean; cls: string }[] = [
  { prob: "střední", impact: "vysoký", cls: "@min-[560px]:col-start-2 @min-[560px]:row-start-1" },
  { prob: "vysoká", impact: "vysoký", hot: true, cls: "@min-[560px]:col-start-3 @min-[560px]:row-start-1 order-first @min-[560px]:order-none" },
  { prob: "střední", impact: "střední", cls: "@min-[560px]:col-start-2 @min-[560px]:row-start-2" },
  { prob: "vysoká", impact: "střední", cls: "@min-[560px]:col-start-3 @min-[560px]:row-start-2" },
];

function RiskItem({ r }: { r: Risk }) {
  return (
    <li className={`flex items-baseline gap-2 text-[14px] leading-snug ${r.top ? "font-semibold text-ink" : "text-ink-2"}`}>
      <span className="inline-block min-w-[2.6rem] shrink-0 rounded-[6px] bg-stone px-1.5 py-0.5 text-center font-mono text-[13px] font-normal text-ink">{r.code}</span>
      <span>{r.name}</span>
    </li>
  );
}

export function RiskMatrixFigure() {
  return (
    <DiagramFrame
      title={D.title}
      subtitle={D.subtitle}
      legend={[
        { swatch: <span aria-hidden className="inline-block h-3.5 w-5 rounded-[3px] border-2 border-forest bg-sage-soft" />, label: "pole „řešit hned“" },
        { swatch: <span aria-hidden className="font-bold text-ink">Aa</span>, label: "tučně: tři největší rizika (sestry, náklady, legislativní kapacita)" },
      ]}
      textVersion={
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-line-strong text-left">
                  <th className="py-1 pr-2 font-semibold">Riziko</th>
                  <th className="py-1 pr-2 font-semibold">Kategorie</th>
                  <th className="py-1 pr-2 font-semibold">Pravděpodobnost</th>
                  <th className="py-1 pr-2 font-semibold">Dopad</th>
                  <th className="py-1 font-semibold">Brána</th>
                </tr>
              </thead>
              <tbody>
                {D.risks.map((r) => (
                  <tr key={r.code} className="border-b border-line align-top">
                    <td className="py-1 pr-2">
                      {r.code} {r.name}
                    </td>
                    <td className="py-1 pr-2">{r.category}</td>
                    <td className="py-1 pr-2">{r.prob}</td>
                    <td className="py-1 pr-2">{r.impact}</td>
                    <td className="py-1">{r.gate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SourceNote lines={D.source.lines} />
        </>
      }
    >
      <div className="grid grid-cols-1 gap-2 @min-[560px]:grid-cols-[72px_1fr_1fr] @min-[560px]:grid-rows-[auto_auto_auto]">
        <p className="hidden self-center text-[13px] leading-tight text-muted @min-[560px]:col-start-1 @min-[560px]:row-start-1 @min-[560px]:block">
          Dopad
          <br />
          <strong className="text-ink-2">vysoký</strong>
        </p>
        <p className="hidden self-center text-[13px] leading-tight text-muted @min-[560px]:col-start-1 @min-[560px]:row-start-2 @min-[560px]:block">
          Dopad
          <br />
          <strong className="text-ink-2">střední</strong>
        </p>
        {CELLS.map((c, k) => {
          const items = D.risks.filter((r) => r.prob === c.prob && r.impact === c.impact);
          return (
            <section
              key={k}
              data-anim
              style={vi(k)}
              aria-label={`${D.quadrants[`${c.prob}|${c.impact}`]}: pravděpodobnost ${c.prob}, dopad ${c.impact}`}
              className={`rounded-[12px] p-3 ${c.hot ? "border-2 border-forest bg-sage-soft" : "border border-line-strong bg-paper"} ${c.cls}`}
            >
              <p className="text-[15px] font-bold text-ink">
                {D.quadrants[`${c.prob}|${c.impact}`]} <span className="font-normal text-muted">· {items.length}</span>
              </p>
              <p className="mb-2 text-[13px] text-muted @min-[560px]:hidden">
                pravděpodobnost {c.prob}, dopad {c.impact}
              </p>
              <ul className="mt-1.5 flex flex-col gap-1.5">
                {items.map((r) => (
                  <RiskItem key={r.code} r={r} />
                ))}
              </ul>
            </section>
          );
        })}
        <p className="hidden text-center text-[13px] text-muted @min-[560px]:col-start-2 @min-[560px]:row-start-3 @min-[560px]:block">
          Pravděpodobnost: <strong className="text-ink-2">střední</strong>
        </p>
        <p className="hidden text-center text-[13px] text-muted @min-[560px]:col-start-3 @min-[560px]:row-start-3 @min-[560px]:block">
          Pravděpodobnost: <strong className="text-ink-2">vysoká</strong>
        </p>
      </div>
      <p className="sr-only">Celkem {D.risks.length} rizik.</p>
    </DiagramFrame>
  );
}
