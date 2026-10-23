import { GATES } from "@/content/reforma";
import { CRITICAL_PATH as D } from "@/content/figures/diagrams";
import { INK } from "@/components/charts/theme";
import { Canvas, DiagramFrame, FlowColumn, Narrow, SourceNote, SwatchBox, SwatchLine, at, nodeText, vi, type CanvasLabel, type Path, type Placed } from "./shared";

/** Kritická cesta reformy: tři řetězce v pěti obdobích, čtyři brány mezi nimi (ř. 71–123). */

const W = 640;
const H = 576;
const CW = 116;
const GAP = 15;
const BOX_H = 120;
const LANE_Y = [124, 282, 440];
const LABEL_Y = [110, 268, 426];
const cx = (i: number) => i * (CW + GAP);
const mid = (i: number) => cx(i) + CW / 2;
const gx = (i: number) => cx(i) - GAP / 2;

const GATE_NAME = Object.fromEntries(GATES.map((g) => [g.id, g.name]));

export function CriticalPathFigure() {
  const placed: Placed[] = [];
  const paths: Path[] = [];
  D.lanes.forEach((lane, li) => {
    lane.steps.forEach((s, si) => {
      placed.push({ node: { ...s, kind: si === 4 ? "result" : "base" }, x: cx(si), y: LANE_Y[li], w: CW, h: BOX_H, i: li + si * 2 });
      if (si < 4) paths.push({ d: `M${cx(si) + CW} ${LANE_Y[li] + BOX_H / 2}H${cx(si + 1)}`, i: li + si * 2 + 1 });
    });
  });
  // Závislosti napříč řetězci: peníze (vlna 1) → zákon o primární péči; týmy → přeměna lůžek.
  paths.push({ d: `M${mid(2)} ${LANE_Y[0] + BOX_H}V256H${mid(3)}V${LANE_Y[1]}`, kind: "dashed", i: 10 });
  paths.push({ d: `M${mid(3)} ${LANE_Y[1] + BOX_H}V414H${mid(4)}V${LANE_Y[2]}`, kind: "dashed", i: 11 });

  const labels: CanvasLabel[] = [
    ...D.periods.map((p, i) => ({ x: mid(i), y: 92, text: p, align: "center" as const, i })),
    ...D.lanes.map((l, i) => ({ x: 0, y: LABEL_Y[i], text: l.name, strong: true, tone: "ink" as const, i: i * 3 })),
    { x: mid(3) + 9, y: 256, text: D.cross[0].label!, i: 10 },
    { x: mid(3) - 9, y: 414, text: D.cross[1].label!, align: "right", i: 11 },
  ];

  const gates = ["B1", "B2", "B3", "B4"];
  const under = (
    <g>
      <line x1={0} x2={W} y1={66} y2={66} stroke={INK.axis} strokeWidth={1.25} />
      {gates.map((_, k) => (
        <line key={k} x1={gx(k + 1)} x2={gx(k + 1)} y1={76} y2={H} stroke={INK.grid} strokeWidth={1.25} strokeDasharray="3 4" />
      ))}
      {gates.map((g, k) => (
        <path key={g} data-anim style={vi(k * 2)} d={`M${gx(k + 1)} 57l9 9l-9 9l-9 -9z`} fill="#1f4a3d" />
      ))}
    </g>
  );
  const overlay = gates.map((g, k) => (
    <div key={g} data-anim className="absolute flex flex-col items-center text-center leading-tight" style={{ ...vi(k * 2), ...at(gx(k + 1) - 64, 0, W, H, 128), translate: "0 0" }}>
      <span className="text-[13px] font-semibold text-ink">
        {g} {GATE_NAME[g]}
      </span>
      <span className="text-[13px] text-muted">{D.gateDates[g]}</span>
    </div>
  ));

  return (
    <DiagramFrame
      title={D.title}
      subtitle={D.subtitle}
      legend={[
        { swatch: <SwatchBox kind="base" />, label: "krok v pořadí" },
        { swatch: <SwatchBox kind="result" />, label: "cílový stav řetězce" },
        { swatch: <span aria-hidden className="inline-block h-2.5 w-2.5 rotate-45 bg-forest" />, label: "brána mezi obdobími" },
        { swatch: <SwatchLine kind="normal" />, label: "bez A nejde B" },
        { swatch: <SwatchLine kind="dashed" />, label: "podmínka napříč řetězci" },
      ]}
      textVersion={
        <>
          {D.lanes.map((l) => (
            <div key={l.id}>
              <p className="font-semibold text-ink">Řetězec {l.name}</p>
              <ol className="list-decimal pl-5">
                {l.steps.map((s, i) => (
                  <li key={s.id}>
                    {D.periods[i]}: {nodeText(s)}
                  </li>
                ))}
              </ol>
            </div>
          ))}
          <div>
            <p className="font-semibold text-ink">Brány</p>
            <ul className="list-disc pl-5">
              {GATES.map((g) => (
                <li key={g.id}>
                  {g.id} {g.name} ({D.gateDates[g.id]}): {g.must}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-ink">Závislosti napříč řetězci</p>
            <ul className="list-disc pl-5">
              <li>Vlna 1 účinná (peníze) → zákon o primární péči účinný: {D.cross[0].label}.</li>
              <li>Zákon účinný a náběh týmů → přeměna lůžek: {D.cross[1].label}.</li>
            </ul>
          </div>
          <SourceNote lines={D.source.lines} />
        </>
      }
    >
      <Canvas id="dg-kc" W={W} H={H} placed={placed} paths={paths} labels={labels} under={under} overlay={overlay} ariaLabel="Kritická cesta reformy: tři řetězce v pěti obdobích a čtyři brány" />
      <Narrow className="flex flex-col gap-5">
        {D.lanes.map((l, li) => (
          <section key={l.id} aria-label={`Řetězec ${l.name}`}>
            <p className="mb-2 text-[15px] font-bold text-ink">{l.name}</p>
            <FlowColumn start={li * 5} nodes={l.steps.map((s, i) => ({ ...s, title: `${s.title} · ${D.periods[i]}`, kind: i === 4 ? "result" : "base" }))} />
          </section>
        ))}
        <section aria-label="Brány">
          <p className="mb-2 text-[15px] font-bold text-ink">Brány</p>
          <ul className="flex flex-col gap-1.5 text-[15px]">
            {GATES.map((g) => (
              <li key={g.id} className="flex items-baseline gap-2">
                <span aria-hidden className="inline-block h-2.5 w-2.5 shrink-0 rotate-45 bg-forest" />
                <span>
                  <strong>
                    {g.id} {g.name}
                  </strong>{" "}
                  · {D.gateDates[g.id]}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[15px] text-ink-2">Napříč řetězci: {D.cross[0].label}; {D.cross[1].label}.</p>
        </section>
      </Narrow>
    </DiagramFrame>
  );
}
