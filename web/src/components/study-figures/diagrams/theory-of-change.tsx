import { THEORY_OF_CHANGE as D } from "@/content/figures/diagrams";
import { Canvas, DiagramFrame, DownArrow, FlowColumn, Narrow, NodeCard, SourceNote, SwatchBox, SwatchLine, nodeText, type CanvasLabel, type Path, type Placed } from "./shared";

/** Teorie změny: vstupy → činnosti → výstupy → výsledky → dopady, pod tím čtyři předpoklady (ř. 386–404). */

const W = 640;
const CW = 116;
const GAP = 15;
const TOP = 30;
const ROW_H = 116;
const ROW_GAP = 10;
const ROWS_END = TOP + 5 * ROW_H + 4 * ROW_GAP; // 650
const BAND_Y = 670;
const H = 826;
const cx = (i: number) => i * (CW + GAP);
const rowY = (r: number) => TOP + r * (ROW_H + ROW_GAP);
const SIDE_H = (ROWS_END - TOP - 2 * ROW_GAP) / 3;

export function TheoryOfChangeFigure() {
  const placed: Placed[] = [];
  const paths: Path[] = [];
  D.inputs.forEach((n, k) => placed.push({ node: n, x: cx(0), y: TOP + k * (SIDE_H + ROW_GAP), w: CW, h: SIDE_H, i: k }));
  D.impacts.forEach((n, k) => placed.push({ node: { ...n, kind: "result" }, x: cx(4), y: TOP + k * (SIDE_H + ROW_GAP), w: CW, h: SIDE_H, i: 10 + k }));
  D.chains.forEach((c, r) => {
    const y = rowY(r);
    placed.push({ node: { ...c.activity, kind: "core" }, codes: c.activity.codes, x: cx(1), y, w: CW, h: ROW_H, i: 2 + r });
    placed.push({ node: c.output, x: cx(2), y, w: CW, h: ROW_H, i: 4 + r });
    placed.push({ node: c.outcome, x: cx(3), y, w: CW, h: ROW_H, i: 6 + r });
    for (let k = 0; k < 4; k++) paths.push({ d: `M${cx(k) + CW} ${y + ROW_H / 2}H${cx(k + 1)}`, i: 2 + k * 2 + r });
  });
  D.assumptions.forEach((a, k) => {
    const w = (W - 32 - 3 * 12) / 4;
    placed.push({ node: { ...a, kind: "warn", lines: [...a.lines, a.otherwise] }, x: 16 + k * (w + 12), y: BAND_Y + 40, w, h: 104, i: 12 + k });
  });
  paths.push({ d: `M${W / 2} ${BAND_Y}V${ROWS_END + 2}`, kind: "dashed", i: 12 });

  const labels: CanvasLabel[] = [
    ...D.columns.map((c, k) => ({ x: cx(k) + CW / 2, y: 12, text: c, align: "center" as const, strong: true, i: k })),
    { x: 16, y: BAND_Y + 20, text: "Předpoklady, bez kterých řetěz neplatí", strong: true, tone: "ink", i: 12 },
  ];

  return (
    <DiagramFrame
      title={D.title}
      subtitle={D.subtitle}
      legend={[
        { swatch: <SwatchBox kind="core" />, label: "činnost s opatřeními jádra (J)" },
        { swatch: <SwatchBox kind="base" />, label: "vstup, výstup, výsledek" },
        { swatch: <SwatchBox kind="result" />, label: "dopad na populaci" },
        { swatch: <SwatchBox kind="warn" />, label: "předpoklad" },
        { swatch: <SwatchLine kind="normal" />, label: "vede k" },
      ]}
      textVersion={
        <>
          <p>Vstupy: {D.inputs.map(nodeText).join(" · ")}.</p>
          <div>
            <p className="font-semibold text-ink">Pět řetězců (činnost → výstup → výsledek; síla evidence)</p>
            <ol className="list-decimal pl-5">
              {D.chains.map((c) => (
                <li key={c.name}>
                  {c.name}: {c.activity.codes.join(", ")} {nodeText(c.activity)} → {nodeText(c.output)} → {nodeText(c.outcome)}. Evidence: {c.evidence}.
                </li>
              ))}
            </ol>
          </div>
          <p>Dopady: {D.impacts.map(nodeText).join(" · ")}.</p>
          <div>
            <p className="font-semibold text-ink">Čtyři předpoklady</p>
            <ul className="list-disc pl-5">
              {D.assumptions.map((a) => (
                <li key={a.id}>
                  {a.title}: {a.lines.join("; ")}; {a.otherwise}.
                </li>
              ))}
            </ul>
          </div>
          <SourceNote lines={D.source.lines} />
        </>
      }
    >
      <Canvas id="dg-tz" W={W} H={H} placed={placed} paths={paths} labels={labels} shapes={[{ kind: "rect", x: 0, y: BAND_Y, w: W, h: H - BAND_Y - 2, fill: "#F6E9C8", stroke: "#CFC5B3", i: 12 }]} ariaLabel="Teorie změny: pět řetězců od vstupů k dopadům a čtyři předpoklady" />
      <Narrow className="flex flex-col gap-5">
        <section aria-label="Vstupy">
          <p className="mb-2 text-[15px] font-bold text-ink">Vstupy</p>
          <div className="flex flex-col gap-2">
            {D.inputs.map((n, k) => (
              <NodeCard key={n.id} node={n} i={k} />
            ))}
          </div>
        </section>
        {D.chains.map((c, r) => (
          <section key={c.name} aria-label={`Řetězec ${c.name}`}>
            <p className="mb-2 text-[15px] font-bold text-ink">
              {r + 1}. {c.name}
            </p>
            <FlowColumn start={r} nodes={[{ ...c.activity, code: c.activity.codes.join(", "), kind: "core" }, c.output, c.outcome]} />
            <p className="mt-1 text-[13px] text-muted">Síla evidence: {c.evidence}</p>
          </section>
        ))}
        <DownArrow label="dopady" />
        <div className="flex flex-col gap-2">
          {D.impacts.map((n, k) => (
            <NodeCard key={n.id} node={{ ...n, kind: "result" }} i={k} />
          ))}
        </div>
        <section aria-label="Předpoklady">
          <p className="mb-2 text-[15px] font-bold text-ink">Předpoklady, bez kterých řetěz neplatí</p>
          <div className="flex flex-col gap-2">
            {D.assumptions.map((a, k) => (
              <NodeCard key={a.id} node={{ ...a, kind: "warn", lines: [...a.lines, a.otherwise] }} i={k} />
            ))}
          </div>
        </section>
      </Narrow>
    </DiagramFrame>
  );
}
