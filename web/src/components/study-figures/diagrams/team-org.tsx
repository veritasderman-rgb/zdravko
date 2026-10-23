import { TEAM_ORG as D } from "@/content/figures/diagrams";
import { Canvas, DiagramFrame, Narrow, NodeCard, SourceNote, SwatchBox, TextNodes, type CanvasLabel, type Path, type Placed } from "./shared";

/** Organigram týmu sdružené péče: jmenovitá dvojice uprostřed, šest dalších částí týmu, šest partnerů (ř. 538–586). */

const W = 640;
const H = 572;
const PX = [0, 222, 444];
const PW = 196;
const N = Object.fromEntries(D.team.map((n) => [n.id, n]));

export function TeamOrgFigure() {
  const placed: Placed[] = [
    ...D.partnersTop.map((n, k) => ({ node: n, x: PX[k], y: 0, w: PW, h: 80, i: k })),
    { node: D.center, x: 206, y: 148, w: 228, h: 192, i: 3, center: true },
    { node: N.dospeli, x: 14, y: 148, w: 176, h: 84, i: 4 },
    { node: N.deti, x: 14, y: 244, w: 176, h: 96, i: 5 },
    { node: N.sestry, x: 450, y: 148, w: 176, h: 84, i: 4 },
    { node: N.profese, x: 450, y: 244, w: 176, h: 96, i: 5 },
    { node: N.navstevy, x: 14, y: 356, w: 298, h: 80, i: 6 },
    { node: N.recepce, x: 328, y: 356, w: 298, h: 80, i: 6 },
    ...D.partnersBottom.map((n, k) => ({ node: n, x: PX[k], y: 480, w: PW, h: 92, i: 7 + k })),
  ];
  const paths: Path[] = [
    ...PX.map((x, k) => ({ d: `M${x + PW / 2} 80V108`, kind: "line" as const, i: k })),
    ...PX.map((x, k) => ({ d: `M${x + PW / 2} 452V480`, kind: "line" as const, i: 7 + k })),
    { d: "M190 190H206", kind: "line", i: 4 },
    { d: "M434 190H450", kind: "line", i: 4 },
    { d: "M190 292H206", kind: "line", i: 5 },
    { d: "M434 292H450", kind: "line", i: 5 },
    { d: "M280 340V356", kind: "line", i: 6 },
    { d: "M360 340V356", kind: "line", i: 6 },
  ];
  const labels: CanvasLabel[] = [{ x: 14, y: 126, text: D.subtitle, strong: true, tone: "ink", i: 2 }];

  return (
    <DiagramFrame
      title={D.title}
      subtitle="Organigram týmu sdružené péče a jeho napojení na okolí"
      legend={[
        { swatch: <SwatchBox kind="main" />, label: "jmenovitá dvojice: střed týmu" },
        { swatch: <SwatchBox kind="base" />, label: "další části týmu a partneři" },
        { swatch: <span aria-hidden className="inline-block h-3.5 w-5 rounded-[3px] border border-line-strong bg-sand" />, label: "tým sdružené péče" },
      ]}
      textVersion={
        <>
          <TextNodes heading="Tým: sedm částí" nodes={[D.center, ...D.team]} />
          <TextNodes heading="Šest partnerů týmu" nodes={[...D.partnersTop, ...D.partnersBottom]} />
          <p>Středem týmu je jmenovitá dvojice lékaře a sestry; ostatní profese a partneři kolem ní pracují, ale pacienta jí nepřebírají.</p>
          <SourceNote lines={D.source.lines} />
        </>
      }
    >
      <Canvas id="dg-tym" W={W} H={H} placed={placed} paths={paths} labels={labels} shapes={[{ kind: "rect", x: 0, y: 108, w: W, h: 344, fill: "#F3EEE4", stroke: "#CFC5B3", i: 2 }]} ariaLabel="Organigram týmu sdružené péče: jmenovitá dvojice, šest dalších částí týmu a šest partnerů" />
      <Narrow className="flex flex-col gap-4">
        <section aria-label="Tým sdružené péče" className="flex flex-col gap-2 rounded-[14px] border border-line-strong bg-sand p-3">
          <p className="text-[15px] font-bold text-ink">{D.subtitle}</p>
          <NodeCard node={D.center} i={0} />
          {D.team.map((n, k) => (
            <NodeCard key={n.id} node={n} i={1 + k} />
          ))}
        </section>
        <section aria-label="Partneři">
          <p className="mb-2 text-[15px] font-bold text-ink">Partneři týmu</p>
          <div className="flex flex-col gap-2">
            {[...D.partnersTop, ...D.partnersBottom].map((n, k) => (
              <NodeCard key={n.id} node={n} i={k} />
            ))}
          </div>
        </section>
      </Narrow>
    </DiagramFrame>
  );
}
