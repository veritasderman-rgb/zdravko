import { GOVERNANCE as D } from "@/content/figures/diagrams";
import type { DNode } from "@/content/figures/diagrams";
import { Canvas, DiagramFrame, Narrow, NodeCard, SourceNote, SwatchBox, SwatchLine, TextEdges, TextNodes, type Path, type Placed } from "./shared";

/** Řízení reformy: v opozici (F0–F1) a ve vládě (F2–F4), ř. 1946–1958. */

const W = 640;

function byId(nodes: DNode[]) {
  return Object.fromEntries(nodes.map((n) => [n.id, n]));
}

export function GovernanceFigure() {
  const O = byId(D.opposition.nodes);
  const G = byId(D.government.nodes);
  const oppH = 316;
  const opp: Placed[] = [
    { node: O.pred, x: 210, y: 0, w: 220, h: 72, i: 0 },
    { node: O.klub, x: 0, y: 104, w: 180, h: 92, i: 2 },
    { node: O.rt, x: 210, y: 104, w: 220, h: 92, i: 1 },
    { node: O.pi, x: 460, y: 104, w: 180, h: 92, i: 2 },
    { node: O.partneri, x: 0, y: 228, w: 305, h: 88, i: 3 },
    { node: O.pilot, x: 335, y: 228, w: 305, h: 88, i: 3 },
  ];
  const oppPaths: Path[] = [
    { d: "M320 72V104", kind: "line", i: 1 },
    { d: "M180 150H210", kind: "line", i: 2 },
    { d: "M430 150H460", kind: "line", i: 2 },
    { d: "M320 196V212H152V228", kind: "line", i: 3 },
    { d: "M320 212H487V228", kind: "line", i: 3 },
  ];
  const govH = 388;
  const ex = ["mz", "mpsv", "mf", "kraje", "poj"];
  const EW = (W - 4 * 10) / 5;
  const gov: Placed[] = [
    { node: G.vlada, x: 0, y: 0, w: 150, h: 104, i: 1 },
    { node: G.vybor, x: 180, y: 0, w: 280, h: 112, i: 0 },
    { node: G.hodnotitel, x: 490, y: 0, w: 150, h: 104, i: 1 },
    { node: G.kancelar, x: 180, y: 144, w: 280, h: 96, i: 2 },
    ...ex.map((id, k) => ({ node: G[id], x: k * (EW + 10), y: 284, w: EW, h: 104, i: 3 + k })),
  ];
  const govPaths: Path[] = [
    { d: "M180 52H150", i: 1 },
    { d: "M490 52H460", i: 1 },
    { d: "M320 112V144", kind: "line", i: 2 },
    { d: `M320 240V262H${EW / 2}V284`, kind: "line", i: 3 },
    { d: `M320 262H${4 * (EW + 10) + EW / 2}V284`, kind: "line", i: 3 },
    { d: `M${EW + 10 + EW / 2} 262V284`, kind: "line", i: 3 },
    { d: "M320 262V284", kind: "line", i: 3 },
    { d: `M${3 * (EW + 10) + EW / 2} 262V284`, kind: "line", i: 3 },
  ];

  return (
    <DiagramFrame
      title={D.title}
      subtitle={D.subtitle}
      legend={[
        { swatch: <SwatchBox kind="main" />, label: "kdo řídí" },
        { swatch: <SwatchBox kind="base" />, label: "orgán nebo partner" },
        { swatch: <SwatchLine kind="normal" />, label: "doporučení, zpráva" },
        { swatch: <SwatchLine kind="line" />, label: "organizační vazba" },
      ]}
      textVersion={
        <>
          <TextNodes heading={D.opposition.heading} nodes={D.opposition.nodes} />
          <TextEdges heading="Vazby v opozici" nodes={D.opposition.nodes} edges={D.opposition.edges} verb="—" />
          <TextNodes heading={D.government.heading} nodes={D.government.nodes} />
          <TextEdges heading="Vazby ve vládě" nodes={D.government.nodes} edges={D.government.edges} />
          <SourceNote lines={D.source.lines} />
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <section aria-label={D.opposition.heading}>
          <p className="mb-3 text-[15px] font-bold text-ink">{D.opposition.heading}</p>
          <Canvas id="dg-ro1" W={W} H={oppH} placed={opp} paths={oppPaths} ariaLabel="Řízení v opozici: resortní tým s poslaneckým klubem a Institutem Pi" />
          <Narrow className="flex flex-col gap-2">
            {[O.rt, O.pred, O.klub, O.pi, O.partneri, O.pilot].map((n, k) => (
              <NodeCard key={n.id} node={n} i={k} />
            ))}
          </Narrow>
        </section>
        <section aria-label={D.government.heading} className="border-t border-line pt-5">
          <p className="mb-3 text-[15px] font-bold text-ink">{D.government.heading}</p>
          <Canvas id="dg-ro2" W={W} H={govH} placed={gov} paths={govPaths} ariaLabel="Řízení ve vládě: řídicí výbor doporučuje vládě, hodnotitel podává zprávu, projektová kancelář koordinuje vykonavatele" />
          <Narrow className="flex flex-col gap-2">
            <NodeCard node={G.vybor} i={0} />
            <p className="pl-3 text-[13px] text-muted">→ doporučuje vládě; ← zpráva nezávislého hodnotitele</p>
            <NodeCard node={G.vlada} i={1} />
            <NodeCard node={G.hodnotitel} i={2} />
            <NodeCard node={G.kancelar} i={3} />
            <p className="pl-3 text-[13px] text-muted">koordinuje vykonavatele:</p>
            {ex.map((id, k) => (
              <NodeCard key={id} node={G[id]} i={4 + k} />
            ))}
          </Narrow>
        </section>
      </div>
    </DiagramFrame>
  );
}
