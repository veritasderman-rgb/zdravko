import { ORG_2038, ORG_TODAY, type OrgLayer } from "@/content/figures/diagrams";
import { Badge, DiagramFrame, NODE_CLASS, NodeContent, SourceNote, SwatchBox, nodeText, vi } from "./shared";

/** Organigramy „kdo plánuje, platí a řídí“: dnes (6 vrstev, 6 děr) a kolem roku 2038 (4 nové prvky), ř. 1280–1290. */

const SPAN: Record<number, string> = {
  3: "@min-[640px]:col-span-3",
  4: "@min-[640px]:col-span-4",
  6: "@min-[640px]:col-span-6",
  8: "@min-[640px]:col-span-8",
  12: "@min-[640px]:col-span-12",
};

function Layers({ layers, tone }: { layers: OrgLayer[]; tone: "hole" | "fix" }) {
  return (
    <div className="flex flex-col gap-2.5">
      {layers.map((layer, li) => (
        <div key={layer.label} data-anim style={vi(li)} className="grid gap-x-3 gap-y-1.5 border-t border-line pt-2.5 first:border-t-0 first:pt-0 @min-[640px]:grid-cols-[104px_1fr]">
          <p className="text-[13px] font-bold uppercase leading-tight tracking-[0.04em] text-muted @min-[640px]:pt-2">{layer.label}</p>
          <div className="grid grid-cols-12 gap-2">
            {layer.nodes.map((n, k) => {
              const kind = n.kind ?? "base";
              return (
                <div key={n.id} data-anim style={vi(li + k)} className={`relative col-span-12 rounded-[10px] px-2.5 py-2 ${SPAN[n.span ?? 4]} ${NODE_CLASS[kind]}`}>
                  {n.badge != null && (
                    <span className="absolute -right-2 -top-2">
                      <Badge n={n.badge} tone={tone} />
                    </span>
                  )}
                  {kind === "new" && <span className="mb-1 inline-block rounded-full bg-forest px-2 py-0.5 text-[13px] font-bold leading-none text-on-dark">nový</span>}
                  <NodeContent node={n} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrgTodayFigure() {
  const D = ORG_TODAY;
  return (
    <DiagramFrame
      title={D.title}
      subtitle={D.subtitle}
      legend={[
        { swatch: <SwatchBox kind="base" />, label: "instituce" },
        { swatch: <Badge n={1} tone="hole" />, label: "díra: chybějící vazba nebo odpovědnost" },
      ]}
      textVersion={
        <>
          {D.layers.map((l) => (
            <p key={l.label}>
              <strong>{l.label}:</strong> {l.nodes.map((n) => `${nodeText(n)}${n.badge ? ` (díra ${n.badge})` : ""}`).join(" · ")}
            </p>
          ))}
          <SourceNote lines={D.source.lines} />
        </>
      }
    >
      <Layers layers={D.layers} tone="hole" />
      <div className="mt-5 rounded-[12px] bg-verify-bg/60 p-3" data-anim style={vi(6)}>
        <p className="mb-2 text-[15px] font-bold text-ink">Kde systém selhává</p>
        <ol className="flex flex-col gap-1.5">
          {D.holes.map((h, k) => (
            <li key={k} className="flex items-start gap-2.5 text-[15px] leading-snug text-ink">
              <Badge n={k + 1} tone="hole" />
              <span className="pt-0.5">{h}</span>
            </li>
          ))}
        </ol>
      </div>
    </DiagramFrame>
  );
}

export function Org2038Figure() {
  const D = ORG_2038;
  return (
    <DiagramFrame
      title={D.title}
      subtitle={D.subtitle}
      legend={[
        { swatch: <SwatchBox kind="new" />, label: "nový prvek" },
        { swatch: <SwatchBox kind="changed" />, label: "mění se úloha" },
        { swatch: <SwatchBox kind="same" />, label: "beze změny" },
        { swatch: <Badge n={1} tone="fix" />, label: "díra z dnešního stavu, kterou prvek zavírá" },
      ]}
      textVersion={
        <>
          <p>Nové prvky: {D.newElements.join(", ")}.</p>
          {D.layers.map((l) => (
            <p key={l.label}>
              <strong>{l.label}:</strong>{" "}
              {l.nodes
                .map((n) => `${nodeText(n)} (${n.kind === "new" ? "nový prvek" : n.kind === "same" ? "beze změny" : "mění se úloha"}${n.badge ? `, zavírá díru ${n.badge}` : ""})`)
                .join(" · ")}
            </p>
          ))}
          <SourceNote lines={D.source.lines} />
        </>
      }
    >
      <Layers layers={D.layers} tone="fix" />
    </DiagramFrame>
  );
}
