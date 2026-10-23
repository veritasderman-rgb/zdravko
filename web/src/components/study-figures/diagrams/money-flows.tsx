import { FUNDING, NET_COST } from "@/content/reforma";
import { MONEY_FLOWS as D } from "@/content/figures/diagrams";
import type { DEdge, DNode } from "@/content/figures/diagrams";
import { csNumber } from "@/components/charts/theme";
import { Canvas, DiagramFrame, Narrow, NodeCard, SourceNote, SwatchBox, SwatchLine, TextEdges, TextNodes, type CanvasLabel, type Path, type Placed } from "./shared";

/** Toky peněz dnes a po reformě (ř. 1292–1300, Část V). Částky 2038 z FUNDING a NET_COST. */

const W = 640;
const H = 400;
const X = [0, 222, 444];
const BW = 196;
const ROW = [44, 148, 252, 356];

function grid(pos: Record<string, [number, number]>, nodes: DNode[], base = 0): Placed[] {
  return nodes.map((n) => {
    const [c, r] = pos[n.id];
    return { node: n, x: X[c], y: ROW[r] - 46, w: BW, h: 92, i: base + c * 2 + (r > 1 ? 1 : 0) };
  });
}

function NarrowFlows({ nodes, edges }: { nodes: DNode[]; edges: DEdge[] }) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <Narrow className="flex flex-col gap-2">
      {nodes.map((n, k) => {
        const out = edges.filter((e) => e.from === n.id);
        return (
          <div key={n.id}>
            <NodeCard node={n} i={k} />
            {out.length > 0 && (
              <p className="mt-1 pl-3 text-[13px] leading-snug text-muted">
                <span aria-hidden className="text-forest">
                  →{" "}
                </span>
                {out.map((e) => `${byId[e.to].title}${e.kind === "new" ? " (nový tok)" : ""}`).join(", ")}
              </p>
            )}
          </div>
        );
      })}
    </Narrow>
  );
}

export function MoneyFlowsFigure() {
  const today = grid({ poj: [0, 0], sr: [0, 1], sd: [0, 2], mpsv: [0, 3], zp: [1, 0], prakt: [2, 0], nem: [2, 1], prev: [2, 2], soc: [2, 3] }, D.today.nodes);
  const after = grid(
    { poj: [0, 0], sr: [0, 1], dane: [0, 2], mpsv: [0, 3], zp: [1, 0], fond: [1, 1], nfp: [1, 2], su: [1, 3], tymy: [2, 0], nem: [2, 1], prev: [2, 2], sz: [2, 3] },
    D.after.nodes,
  );
  const todayPaths: Path[] = [
    { d: "M196 44H222", i: 1 },
    { d: "M196 148H209V64H222", i: 1 },
    { d: "M98 206V194", i: 1 },
    { d: "M418 44H444", i: 3 },
    { d: "M418 64H431V148H444", i: 3 },
    { d: "M431 148V252H444", i: 3 },
    { d: "M196 356H444", i: 3 },
  ];
  const todayLabels: CanvasLabel[] = [{ x: 320, y: 340, text: "dva oddělené rozpočty", align: "center", i: 3 }];
  const afterPaths: Path[] = [
    { d: "M196 44H222", i: 1 },
    { d: "M196 138H209V64H222", i: 1 },
    { d: "M418 64H431V118H444", i: 3 },
    { d: "M98 206V194", kind: "new", i: 1 },
    { d: "M196 252H222", kind: "new", i: 1 },
    { d: "M196 158H222", kind: "new", i: 1 },
    { d: "M196 356H222", kind: "new", i: 1 },
    { d: "M418 44H444", kind: "new", i: 3 },
    { d: "M418 158H444", kind: "new", i: 3 },
    { d: "M418 252H444", kind: "new", i: 3 },
    { d: "M418 356H444", kind: "new", i: 3 },
  ];
  const net = NET_COST.rows.find((r) => r.year === "2038")!;

  return (
    <DiagramFrame
      title={D.title}
      subtitle={D.subtitle}
      legend={[
        { swatch: <SwatchBox kind="new" />, label: "nový prvek" },
        { swatch: <SwatchBox kind="changed" />, label: "mění se" },
        { swatch: <SwatchBox kind="same" />, label: "beze změny" },
        { swatch: <SwatchLine kind="new" />, label: "nový tok" },
        { swatch: <SwatchLine kind="normal" />, label: "dnešní tok" },
      ]}
      textVersion={
        <>
          <TextNodes heading="Dnes: zdroje, prostředníci a příjemci" nodes={D.today.nodes} />
          <TextEdges heading="Dnešní toky" nodes={D.today.nodes} edges={D.today.edges} />
          <TextNodes heading="Po reformě, plný náběh kolem roku 2038" nodes={D.after.nodes} />
          <TextEdges heading="Toky po reformě" nodes={D.after.nodes} edges={D.after.edges} />
          <SourceNote lines={D.source.lines} />
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <section aria-label="Toky peněz dnes">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.06em] text-muted">Dnes</p>
          <Canvas id="dg-tp1" W={W} H={H} placed={today} paths={todayPaths} labels={todayLabels} ariaLabel="Toky peněz dnes: pojistné a platba státu přes pojišťovny k poskytovatelům, sociální služby zvlášť" />
          <NarrowFlows nodes={D.today.nodes} edges={D.today.edges} />
        </section>
        <section aria-label="Toky peněz po reformě" className="border-t border-line pt-5">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.06em] text-muted">Po reformě, plný náběh kolem roku 2038</p>
          <Canvas id="dg-tp2" W={W} H={H} placed={after} paths={afterPaths} ariaLabel="Toky peněz po reformě: daně za zdraví, fond přeměny, Národní fond prevence a sociální účet jako nové prvky" />
          <NarrowFlows nodes={D.after.nodes} edges={D.after.edges} />
        </section>
        <section aria-label="Kdo zaplatí reformu" data-anim className="rounded-[12px] bg-sand p-3">
          <p className="mb-2 text-[15px] font-bold text-ink">
            Kdo zaplatí {csNumber(net.net)} mld. Kč ročně (2038) = provoz {csNumber(net.provoz)} − úspory {csNumber(net.uspory)}
          </p>
          <table className="w-full border-collapse text-[14px]">
            <tbody>
              {FUNDING.rows.map((r) => (
                <tr key={r.label} className="border-b border-line last:border-b-0">
                  <td className="py-1 pr-3 text-ink-2">{r.label}</td>
                  <td className="py-1 text-right font-semibold tabular-nums text-ink">{csNumber(r.value)} mld. Kč</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[13px] text-muted">{FUNDING.source}</p>
        </section>
      </div>
    </DiagramFrame>
  );
}
