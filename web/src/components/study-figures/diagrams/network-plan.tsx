import { NETWORK_PLAN as D } from "@/content/figures/diagrams";
import { Canvas, DiagramFrame, DownArrow, Narrow, NodeCard, SourceNote, SwatchBox, SwatchLine, TextEdges, TextNodes, type CanvasLabel, type Path, type Placed } from "./shared";

/** Proces krajského plánu sítě: sedm kroků, kontrolní bod MZ, spor a pojistka (ř. 882–898). */

const W = 640;
const H = 512;
const C1 = 0;
const C2 = 222;
const C3 = 440;
const BW = 196;
const BW3 = 192;
const DC = { x: C2 + BW / 2, y: 180, w: 220, h: 96 }; // kosočtverec kroku 4
const N = Object.fromEntries(D.nodes.map((n) => [n.id, n]));

export function NetworkPlanFigure() {
  const placed: Placed[] = [
    { node: N.k1, x: C1, y: 20, w: BW, h: 80, i: 0 },
    { node: N.k2, x: C2, y: 20, w: BW, h: 80, i: 1 },
    { node: N.k3, x: C3, y: 20, w: BW3, h: 80, i: 2 },
    { node: N.k4, x: DC.x - 80, y: DC.y - 30, w: 160, h: 60, i: 3 },
    { node: N.nesplneno, x: C1, y: 152, w: 176, h: 60, i: 4 },
    { node: N.k5, x: C2, y: 260, w: BW, h: 84, i: 5 },
    { node: N.spor, x: C3, y: 260, w: BW3, h: 84, i: 4 },
    { node: N.body, x: C1, y: 232, w: BW, h: 186, i: 4 },
    { node: N.k6, x: C2, y: 376, w: BW, h: 84, i: 6 },
    { node: N.k7, x: C3, y: 376, w: BW3, h: 84, i: 7 },
    { node: N.stop, x: C1, y: 434, w: BW, h: 76, i: 8 },
  ];
  const paths: Path[] = [
    { d: `M${BW} 60H${C2}`, i: 1 },
    { d: `M${C2 + BW} 60H${C3}`, i: 2 },
    { d: `M${C3 + BW3 / 2} 100V116H${DC.x}V${DC.y - DC.h / 2}`, i: 3 },
    { d: `M${DC.x - DC.w / 2} ${DC.y}H176`, i: 4 },
    { d: `M88 152V126H292V100`, i: 4 },
    { d: `M${DC.x} ${DC.y + DC.h / 2}V260`, i: 5 },
    { d: `M${DC.x + DC.w / 2} ${DC.y}H${C3 + BW3 / 2}V260`, i: 4 },
    { d: `M${C3} 302H${C2 + BW}`, i: 5 },
    { d: `M${DC.x} 344V376`, i: 6 },
    { d: `M${C2 + BW} 418H${C3}`, i: 7 },
    { d: `M${C3 + BW3} 418H637V6H${DC.x}V20`, i: 8 },
    { d: `M${C2} 444H208V472H${BW}`, kind: "stop", i: 8 },
    { d: `M${BW} 250L${DC.x - 62} 207`, kind: "line", i: 4 },
  ];
  const labels: CanvasLabel[] = [
    { x: 193, y: 170, text: "ne", align: "center", tone: "ink", i: 4 },
    { x: 96, y: 140, text: "přepracovat", i: 4 },
    { x: DC.x + 8, y: 244, text: "ano", tone: "ink", i: 5 },
    { x: 486, y: 168, text: "spor", align: "center", tone: "ink", i: 4 },
    { x: 212, y: 490, text: "pojistka", i: 8 },
    { x: 480, y: 6, text: "další plán", align: "center", i: 8 },
  ];

  return (
    <DiagramFrame
      title={D.title}
      subtitle={D.subtitle}
      legend={[
        { swatch: <SwatchBox kind="base" />, label: "krok" },
        { swatch: <SwatchBox kind="main" />, label: "schválený plán" },
        { swatch: <span aria-hidden className="inline-block h-3 w-3 rotate-45 border-2 border-ink bg-paper" />, label: "kontrolní bod" },
        { swatch: <SwatchBox kind="warn" />, label: "pojistka" },
        { swatch: <SwatchLine kind="stop" />, label: "zastavení přeměny" },
      ]}
      textVersion={
        <>
          <TextNodes heading="Kroky, kontrolní bod a pojistka" nodes={D.nodes} />
          <TextEdges nodes={D.nodes} edges={D.edges} />
          <SourceNote lines={D.source.lines} />
        </>
      }
    >
      <Canvas id="dg-kp" W={W} H={H} placed={placed} paths={paths} labels={labels} shapes={[{ kind: "diamond", cx: DC.x, cy: DC.y, w: DC.w, h: DC.h, i: 3 }]} ariaLabel="Proces krajského plánu sítě: kraj navrhuje, MZ kontroluje a schvaluje, spor rozhodne vláda" />
      <Narrow className="flex flex-col gap-5">
        <div className="flex flex-col">
          <NodeCard node={N.k1} i={0} />
          <DownArrow i={0} />
          <NodeCard node={N.k2} i={1} />
          <DownArrow i={1} />
          <NodeCard node={N.k3} i={2} />
          <DownArrow i={2} />
          <NodeCard node={{ ...N.k4, lines: ["ne: plán se vrací kraji k přepracování", "spor: rozhoduje vláda", "ano: schválení"] }} i={3} />
          <DownArrow label="ano" i={3} />
          <NodeCard node={N.k5} i={4} />
          <DownArrow i={4} />
          <NodeCard node={N.k6} i={5} />
          <DownArrow i={5} />
          <NodeCard node={N.k7} i={6} />
          <DownArrow label="další plán, zpět ke kroku 2" i={6} />
        </div>
        <div className="flex flex-col gap-2">
          <NodeCard node={N.body} i={7} />
          <NodeCard node={N.spor} i={8} />
          <NodeCard node={N.stop} i={9} />
        </div>
      </Narrow>
    </DiagramFrame>
  );
}
