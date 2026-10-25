import { DEPS_CARE, DEPS_MONEY } from "@/content/figures/diagrams";
import type { DEdge, DNode } from "@/content/figures/diagrams";
import { INK } from "@/components/charts/theme";
import { Canvas, DiagramFrame, Narrow, NodeCard, SourceNote, SwatchBox, SwatchLine, TextEdges, TextNodes, type CanvasLabel, type LegendItem, type Path, type Placed } from "./shared";

/** Grafy závislostí z Části IV (ř. 1188–1240): uzly = opatření a kroky, hrany = „bez A nejde B“. */

const W = 640;
const X = [0, 222, 444];
const BW = 188;
const BH = 76;

const LEGEND: LegendItem[] = [
  { swatch: <SwatchBox kind="core" />, label: "jádro (J1–J10)" },
  { swatch: <SwatchBox kind="cond" />, label: "podmínka (P1–P5)" },
  { swatch: <SwatchBox kind="base" />, label: "zákon, krok nebo souhrn" },
  { swatch: <SwatchBox kind="result" />, label: "výsledek" },
  { swatch: <SwatchBox kind="gate" />, label: "brána" },
  { swatch: <SwatchLine kind="critical" />, label: "kritická cesta" },
  { swatch: <SwatchLine kind="normal" />, label: "závislost" },
];

function place(nodes: DNode[], pos: Record<string, [number, number, number?, number?, number?]>): Placed[] {
  // [sloupec, střed y, šířka, výška, pořadí animace]
  return nodes.map((n) => {
    const [col, cy, w = BW, h = BH, i = col * 2] = pos[n.id];
    return { node: n, x: X[col], y: cy - h / 2, w, h, i };
  });
}

/** Úzké zobrazení: uzly ve sloupcích podle pořadí, u každého „závisí na“. */
function NarrowGraph({ groups, nodes, edges }: { groups: { title: string; ids: string[] }[]; nodes: DNode[]; edges: DEdge[] }) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const name = (id: string) => [byId[id].code, byId[id].title].filter(Boolean).join(" ");
  return (
    <Narrow className="flex flex-col gap-5">
      {groups.map((g) => (
        <section key={g.title} aria-label={g.title}>
          <p className="mb-2 text-[15px] font-bold uppercase tracking-[0.04em] text-muted">{g.title}</p>
          <div className="flex flex-col gap-2">
            {g.ids.map((id, k) => {
              const deps = edges.filter((e) => e.to === id);
              return (
                <div key={id}>
                  <NodeCard node={byId[id]} i={k} />
                  {deps.length > 0 && (
                    <p className="mt-1 pl-3 text-[13px] leading-snug text-muted">
                      <span aria-hidden className="text-forest">
                        ↑{" "}
                      </span>
                      závisí na: {deps.map((d) => `${name(d.from)}${d.kind === "critical" ? " (kritická cesta)" : ""}`).join(", ")}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </Narrow>
  );
}

function laneUnder(sepY: number, lanes: [string, number][]) {
  return (
    <g>
      <line x1={0} x2={W} y1={sepY} y2={sepY} stroke={INK.grid} strokeWidth={1.5} />
      {lanes.map(([t, y]) => (
        <text key={t} x={0} y={y} fontSize={13} fontWeight={700} letterSpacing="0.06em" fill={INK.secondary} style={{ fontFamily: "var(--font-sans)" }}>
          {t}
        </text>
      ))}
    </g>
  );
}

export function DepsMoneyFigure() {
  const D = DEPS_MONEY;
  const H = 584;
  const placed = place(D.nodes, {
    j8: [0, 62, BW, BH, 0],
    j9: [0, 152, BW, BH, 0],
    dane: [1, 107, BW, BH, 2],
    p4: [2, 62, BW, BH, 4],
    j10: [1, 224, BW, BH, 4],
    penize: [2, 224, BW, BH, 6],
    p1: [0, 352, BW, BH, 1],
    j2: [1, 352, BW, BH, 3],
    p2: [0, 442, BW, BH, 1],
    j3: [1, 442, BW, BH, 3],
    b3: [2, 397, BW, 64, 5],
    tymy: [1, 546, 410, 72, 8],
  });
  const paths: Path[] = [
    { d: "M188 62H205V92H222", kind: "critical", i: 1 },
    { d: "M188 152H205V122H222", i: 1 },
    { d: "M410 92H427V62H444", i: 3 },
    { d: "M316 145V186", kind: "critical", i: 3 },
    { d: "M410 224H444", kind: "critical", i: 5 },
    { d: "M632 224H637V546H632", kind: "critical", i: 7 },
    { d: "M188 352H222", kind: "critical", i: 2 },
    { d: "M410 352H427V387H444", kind: "critical", i: 4 },
    { d: "M470 429V510", kind: "critical", i: 6 },
    { d: "M316 480V510", i: 6 },
    { d: "M94 480V546H222", i: 6 },
  ];
  const labels: CanvasLabel[] = [
    { x: 324, y: 165, text: "zbytek 3–4,2 mld. Kč", i: 3 },
    { x: 480, y: 470, text: "ano → s centry", tone: "ink", i: 6 },
    { x: 480, y: 489, text: "ne → varianta B", tone: "ink", i: 6 },
  ];
  return (
    <DiagramFrame
      title={D.title}
      subtitle={D.subtitle}
      legend={LEGEND}
      textVersion={
        <>
          <TextNodes heading="Uzly" nodes={D.nodes} />
          <TextEdges heading="Vazby (bez A nejde B)" nodes={D.nodes} edges={D.edges} />
          <SourceNote lines={D.source.lines} />
        </>
      }
    >
      <Canvas id="dg-z1" W={W} H={H} placed={placed} paths={paths} labels={labels} under={laneUnder(290, [["PENÍZE", 10], ["LIDÉ", 306]])} ariaLabel="Graf závislostí 1/2: peníze a lidé před náběhem týmů v roce 2032" />
      <NarrowGraph
        nodes={D.nodes}
        edges={D.edges}
        groups={[
          { title: "Peníze", ids: ["j8", "j9", "dane", "p4", "j10", "penize"] },
          { title: "Lidé", ids: ["p1", "p2", "j2", "j3", "b3"] },
          { title: "Výsledek", ids: ["tymy"] },
        ]}
      />
    </DiagramFrame>
  );
}

export function DepsCareFigure() {
  const D = DEPS_CARE;
  const H = 600;
  const placed = place(D.nodes, {
    dohoda: [0, 62, BW, BH, 0],
    j1: [0, 152, BW, BH, 0],
    j5: [0, 242, BW, BH, 0],
    pilot: [1, 62, BW, BH, 2],
    j4: [1, 152, BW, BH, 2],
    data: [1, 242, BW, BH, 2],
    zpp: [2, 62, BW, BH, 4],
    tymy: [2, 152, BW, BH, 6],
    brany: [2, 242, BW, BH, 4],
    zsit: [0, 372, BW, BH, 1],
    p3: [0, 462, BW, BH, 1],
    zzs: [0, 552, BW, BH, 1],
    j6: [1, 372, BW, BH, 3],
    j7: [1, 462, BW, BH, 3],
    premena: [2, 462, BW, 104, 7],
  });
  const paths: Path[] = [
    { d: "M188 62H222", kind: "critical", i: 1 },
    { d: "M188 152H205V82H222", kind: "critical", i: 1 },
    { d: "M410 62H444", kind: "critical", i: 3 },
    { d: "M538 100V114", kind: "critical", i: 5 },
    { d: "M410 152H444", i: 3 },
    { d: "M188 242H222", kind: "critical", i: 1 },
    { d: "M410 242H444", kind: "critical", i: 3 },
    { d: "M538 204V190", kind: "critical", i: 5 },
    { d: "M188 372H222", kind: "critical", i: 2 },
    { d: "M410 372H427V442H444", kind: "critical", i: 4 },
    { d: "M410 462H444", kind: "critical", i: 4 },
    { d: "M188 462H222", i: 2 },
    { d: "M188 552H427V482H444", kind: "critical", i: 4 },
  ];
  return (
    <DiagramFrame
      title={D.title}
      subtitle={D.subtitle}
      legend={LEGEND}
      textVersion={
        <>
          <TextNodes heading="Uzly" nodes={D.nodes} />
          <TextEdges heading="Vazby (bez A nejde B)" nodes={D.nodes} edges={D.edges} />
          <SourceNote lines={D.source.lines} />
        </>
      }
    >
      <Canvas id="dg-z2" W={W} H={H} placed={placed} paths={paths} under={laneUnder(306, [["PRIMÁRNÍ PÉČE", 10], ["SÍŤ LŮŽKOVÉ PÉČE", 322]])} ariaLabel="Graf závislostí 2/2: pilot před zákonem o primární péči, dlouhodobá péče před přeměnou lůžek" />
      <NarrowGraph
        nodes={D.nodes}
        edges={D.edges}
        groups={[
          { title: "Primární péče", ids: ["dohoda", "j1", "j5", "pilot", "j4", "data", "zpp", "brany", "tymy"] },
          { title: "Síť lůžkové péče", ids: ["zsit", "p3", "zzs", "j6", "j7", "premena"] },
        ]}
      />
    </DiagramFrame>
  );
}
