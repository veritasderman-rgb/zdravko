import { PATIENT_PATH as D } from "@/content/figures/diagrams";
import { Canvas, DiagramFrame, DownArrow, Narrow, NodeCard, SourceNote, SwatchBox, SwatchLine, TextEdges, TextNodes, type CanvasLabel, type Path, type Placed } from "./shared";

/** Cesta pacienta: hlavní páteř, dvě rozhodnutí, tři vstupy mimo tým (ř. 488–518). */

const W = 640;
const H = 752;
const SX = 170; // páteř
const SW = 220;
const SC = SX + SW / 2; // 280
const RX = 420; // boční sloupec
const RW = 196;
const N = Object.fromEntries(D.nodes.map((n) => [n.id, n]));

const SPINE: Record<string, [number, number]> = {
  priznak: [0, 56],
  tym: [80, 76],
  ezadanka: [262, 100],
  specialista: [388, 84],
  nemocnice: [582, 60],
  nasledna: [666, 80],
};
const SIDE: Record<string, [number, number]> = { triaz: [262, 100], primy: [388, 84], lhuta: [500, 84] };
const D1 = 200;
const D2 = 518;

export function PatientPathFigure() {
  const order = ["priznak", "tym", "d1", "ezadanka", "specialista", "d2", "nemocnice", "nasledna"];
  const placed: Placed[] = [
    ...Object.entries(SPINE).map(([id, [y, h]]) => ({ node: N[id], x: SX, y, w: SW, h, i: order.indexOf(id) })),
    ...Object.entries(SIDE).map(([id, [y, h]], k) => ({ node: N[id], x: RX, y, w: RW, h, i: 9 + k })),
    { node: N.d1, x: SC - 72, y: D1 - 26, w: 144, h: 52, i: 2 },
    { node: N.d2, x: SC - 72, y: D2 - 26, w: 144, h: 52, i: 5 },
  ];
  const paths: Path[] = [
    { d: `M${SC} 56V80`, i: 1 },
    { d: `M${SC} 156V162`, i: 2 },
    { d: `M${SC} 238V262`, i: 3 },
    { d: `M${SC} 362V388`, i: 4 },
    { d: `M${SC} 472V480`, i: 5 },
    { d: `M${SC} 556V582`, i: 6 },
    { d: `M${SC} 642V666`, i: 7 },
    { d: `M${SC - 95} ${D1}H150`, kind: "line", i: 3 },
    { d: `M${SC - 95} ${D2}H150`, kind: "line", i: 6 },
    { d: `M${SX} 706H150V118H${SX}`, i: 8 },
    { d: `M${SX + SW} 28H632V430H${RX + RW}`, kind: "dashed", i: 9 },
    { d: `M632 312H${RX + RW}`, kind: "dashed", i: 9 },
    { d: `M${RX} 312H${SX + SW}`, kind: "dashed", i: 10 },
    { d: `M${RX} 430H${SX + SW}`, kind: "dashed", i: 10 },
    { d: `M${RX} 542H405V450H${SX + SW}`, kind: "dashed", i: 11 },
  ];
  const labels: CanvasLabel[] = [
    { x: SC + 8, y: 250, text: "ano", tone: "ink", i: 3 },
    { x: SC + 8, y: 569, text: "ano", tone: "ink", i: 6 },
    { x: 142, y: D1, text: "ne: péče v týmu", align: "right", i: 3 },
    { x: 142, y: D2, text: "ne: zpětná zpráva", align: "right", i: 6 },
    { x: 142, y: 706, text: "propuštění", align: "right", i: 8 },
    { x: 142, y: 118, text: "návrat k jmenovitému lékaři", align: "right", w: 120, i: 8 },
    { x: RX + 4, y: 56, text: "bez praktika, s varovnými příznaky nebo přímo", w: 200, i: 9 },
  ];

  return (
    <DiagramFrame
      title={D.title}
      subtitle={D.subtitle}
      legend={[
        { swatch: <SwatchBox kind="base" />, label: "krok" },
        { swatch: <SwatchBox kind="main" />, label: "eŽádanka s triáží" },
        { swatch: <span aria-hidden className="inline-block h-3 w-3 rotate-45 border-2 border-ink bg-paper" />, label: "rozhodnutí" },
        { swatch: <SwatchLine kind="normal" />, label: "cesta v týmu" },
        { swatch: <SwatchLine kind="dashed" />, label: "vstup mimo tým" },
      ]}
      textVersion={
        <>
          <TextNodes heading="Kroky a rozhodnutí" nodes={D.nodes} />
          <TextEdges nodes={D.nodes} edges={D.edges} />
          <p>{D.directNote}</p>
          <SourceNote lines={D.source.lines} />
        </>
      }
    >
      <Canvas id="dg-cp" W={W} H={H} placed={placed} paths={paths} labels={labels} shapes={[{ kind: "diamond", cx: SC, cy: D1, w: 190, h: 76, i: 2 }, { kind: "diamond", cx: SC, cy: D2, w: 190, h: 76, i: 5 }]} ariaLabel="Cesta pacienta od příznaku přes tým, eŽádanku a specialistu zpět ke svému lékaři" />
      <Narrow className="flex flex-col gap-5">
        <div className="flex flex-col">
          <NodeCard node={N.priznak} i={0} />
          <DownArrow i={0} />
          <NodeCard node={N.tym} i={1} />
          <DownArrow i={1} />
          <NodeCard node={{ ...N.d1, lines: ["ne: péče zůstává v týmu", "ano: eŽádanka"] }} i={2} />
          <DownArrow label="ano" i={2} />
          <NodeCard node={N.ezadanka} i={3} />
          <DownArrow i={3} />
          <NodeCard node={N.specialista} i={4} />
          <DownArrow i={4} />
          <NodeCard node={{ ...N.d2, lines: ["ne: zpětná zpráva týmu", "ano: nemocnice"] }} i={5} />
          <DownArrow label="ano" i={5} />
          <NodeCard node={N.nemocnice} i={6} />
          <DownArrow i={6} />
          <NodeCard node={N.nasledna} i={7} />
          <DownArrow label="propuštění, návrat k jmenovitému lékaři v týmu" i={7} />
        </div>
        <section aria-label="Vstupy mimo tým">
          <p className="mb-2 text-[15px] font-bold text-ink">Vstupy mimo tým</p>
          <div className="flex flex-col gap-2">
            <NodeCard node={{ ...N.triaz, lines: [...(N.triaz.lines ?? []), "→ eŽádanka"] }} i={8} />
            <NodeCard node={{ ...N.primy, lines: [...(N.primy.lines ?? []), "→ ambulantní specialista"] }} i={9} />
            <NodeCard node={{ ...N.lhuta, lines: [...(N.lhuta.lines ?? []), "→ jiný specialista"] }} i={10} />
          </div>
        </section>
      </Narrow>
      <p className="mt-3 text-[13px] leading-snug text-muted">{D.directNote}</p>
    </DiagramFrame>
  );
}
