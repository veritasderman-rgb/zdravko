import type { CSSProperties, ReactNode } from "react";
import { Chip, CodeRef } from "@/components/web/ui";
import { INK } from "@/components/charts/theme";
import type { DEdge, DNode, EdgeKind, NodeKind } from "@/content/figures/diagrams";
import { Reveal } from "../reveal";

/**
 * Společné stavební kameny diagramů studie.
 *
 * Široké zobrazení (obsah rámu aspoň 640 px, container query `@min-[640px]`) je „plátno“:
 * uzly jsou HTML boxy umístěné v procentech souřadnicového systému W × H, spojnice kreslí
 * SVG se stejným viewBoxem a stejným poměrem stran, takže se škáluje rovnoměrně a jednotka
 * je vždy aspoň 1 px. Text tak zůstává textem (min. 13 px). Na úzkém zobrazení se plátno
 * skryje a ukáže se seznam uzlů pod sebou se šipkami ↓.
 */

export const CANVAS_MIN = 640;

export const vi = (i: number) => ({ "--i": i }) as CSSProperties;

const FOREST = "#1f4a3d";
const VERIFY_FG = "#6b4a00";

export const NODE_CLASS: Record<NodeKind, string> = {
  base: "border border-line-strong bg-paper",
  core: "border-2 border-forest bg-sage-soft",
  cond: "border-2 border-dashed border-forest bg-paper",
  gate: "border-2 border-dashed border-ink bg-paper",
  result: "border-2 border-ink bg-stone",
  main: "border-2 border-forest bg-sage-soft",
  new: "border-2 border-forest bg-sage-soft",
  changed: "border-[1.5px] border-forest bg-paper",
  same: "border border-line-strong bg-paper",
  warn: "border-2 border-dashed border-verify-fg/50 bg-verify-bg",
  decision: "",
};

const EDGE_STYLE: Record<EdgeKind, { stroke: string; width: number; dash?: string; arrow: boolean }> = {
  normal: { stroke: INK.muted, width: 1.5, arrow: true },
  critical: { stroke: INK.primary, width: 2.5, arrow: true },
  dashed: { stroke: FOREST, width: 1.5, dash: "5 4", arrow: true },
  new: { stroke: FOREST, width: 2.5, arrow: true },
  stop: { stroke: VERIFY_FG, width: 1.5, dash: "4 3", arrow: true },
  line: { stroke: INK.muted, width: 1.25, arrow: false },
};

// ---------------------------------------------------------------------------
// Rám
// ---------------------------------------------------------------------------

export type LegendItem = { swatch: ReactNode; label: string };

export function DiagramFrame({
  title,
  subtitle,
  verify,
  legend,
  textVersion,
  children,
}: {
  title: string;
  subtitle?: string;
  verify?: string;
  legend?: LegendItem[];
  textVersion: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="@container flex min-w-0 flex-col gap-4 rounded-card border border-line bg-paper p-4 font-sans text-ink md:p-5">
      <div className="flex flex-col gap-1.5">
        <p className="text-balance font-serif text-[20px] font-semibold leading-snug text-ink md:text-[22px]">{title}</p>
        {subtitle && <p className="text-[15px] leading-snug text-muted">{subtitle}</p>}
        {verify && (
          <div className="mt-1">
            <Chip variant="verify">{verify}</Chip>
          </div>
        )}
      </div>
      <Reveal>{children}</Reveal>
      {legend && legend.length > 0 && <Legend items={legend} />}
      <details className="group rounded-[10px] border border-line bg-sand px-4 py-2.5 text-[15px] leading-relaxed text-ink-2">
        <summary className="min-h-11 cursor-pointer content-center font-semibold text-ink">Textová verze</summary>
        <div className="mt-2 flex flex-col gap-3 pb-2">{textVersion}</div>
      </details>
    </div>
  );
}

export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] leading-snug text-ink-2" aria-label="Legenda">
      {items.map((it) => (
        <li key={it.label} className="inline-flex items-center gap-2">
          {it.swatch}
          {it.label}
        </li>
      ))}
    </ul>
  );
}

/** Vzorek uzlu pro legendu. */
export function SwatchBox({ kind }: { kind: NodeKind }) {
  return <span aria-hidden className={`inline-block h-3.5 w-5 shrink-0 rounded-[3px] ${NODE_CLASS[kind]}`} />;
}

/** Vzorek čáry pro legendu. */
export function SwatchLine({ kind }: { kind: EdgeKind }) {
  const s = EDGE_STYLE[kind];
  return (
    <svg aria-hidden width="28" height="10" viewBox="0 0 28 10" className="shrink-0">
      <line x1="1" x2={s.arrow ? 22 : 27} y1="5" y2="5" stroke={s.stroke} strokeWidth={s.width} strokeDasharray={s.dash} />
      {s.arrow && <path d="M21 1.5L27 5L21 8.5z" fill={s.stroke} />}
    </svg>
  );
}

/** Kulatý odznak s číslem (díra = verify, oprava = sage). */
export function Badge({ n, tone }: { n: number; tone: "hole" | "fix" }) {
  return (
    <span
      className={`inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full px-1 text-[13px] font-bold leading-none ${
        tone === "hole" ? "bg-verify-bg text-verify-fg ring-1 ring-verify-fg/40" : "bg-sage-soft text-forest ring-1 ring-forest/50"
      }`}
    >
      {n}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Obsah uzlu
// ---------------------------------------------------------------------------

export function NodeContent({ node, center = false, codes }: { node: DNode; center?: boolean; codes?: string[] }) {
  const allCodes = [...(node.code ? [node.code] : []), ...(codes ?? [])];
  return (
    <>
      <span className={`flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] font-semibold leading-tight text-ink ${center ? "justify-center text-center" : ""}`}>
        {allCodes.map((c) => (
          <CodeRef key={c} code={c} link={false} />
        ))}
        <span>{node.title}</span>
      </span>
      {node.lines?.map((l) => (
        <span key={l} className={`mt-1 block text-[13px] leading-snug text-ink-2 ${center ? "text-center" : ""}`}>
          {l}
        </span>
      ))}
    </>
  );
}

/** Uzel jako samostatná karta (úzké zobrazení, seznamy). */
export function NodeCard({ node, i = 0, codes, badge, className = "" }: { node: DNode; i?: number; codes?: string[]; badge?: ReactNode; className?: string }) {
  const kind = node.kind ?? "base";
  const cls = kind === "decision" ? "border-2 border-ink bg-paper" : NODE_CLASS[kind];
  return (
    <div data-anim style={vi(i)} className={`relative rounded-[10px] px-3 py-2.5 ${cls} ${className}`}>
      {kind === "decision" && <span className="mb-1 block text-[13px] font-semibold uppercase tracking-[0.04em] text-muted">Rozhodnutí</span>}
      {badge && <span className="absolute -right-2 -top-2">{badge}</span>}
      <NodeContent node={node} codes={codes} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Plátno
// ---------------------------------------------------------------------------

export type Placed = { node: DNode; x: number; y: number; w: number; h: number; i?: number; codes?: string[]; center?: boolean; badge?: ReactNode };
export type Path = { d: string; kind?: EdgeKind; i?: number };
export type CanvasLabel = { x: number; y: number; text: string; align?: "left" | "right" | "center"; w?: number; strong?: boolean; i?: number; tone?: "muted" | "ink" };
export type Shape = { kind: "diamond"; cx: number; cy: number; w: number; h: number; i?: number } | { kind: "rect"; x: number; y: number; w: number; h: number; className?: string; fill?: string; stroke?: string; dash?: string; i?: number };

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/** Absolutní umístění HTML prvku v souřadnicích plátna W × H. */
export function at(x: number, y: number, W: number, H: number, w?: number, h?: number): CSSProperties {
  return { left: pct(x, W), top: pct(y, H), width: w != null ? pct(w, W) : undefined, height: h != null ? pct(h, H) : undefined };
}

export function Canvas({
  id,
  W,
  H,
  placed,
  paths = [],
  labels = [],
  shapes = [],
  under,
  overlay,
  ariaLabel,
}: {
  id: string;
  W: number;
  H: number;
  placed: Placed[];
  paths?: Path[];
  labels?: CanvasLabel[];
  shapes?: Shape[];
  /** Další SVG prvky pod spojnicemi (vodítka, osy). */
  under?: ReactNode;
  /** Další HTML prvky nad plátnem (popisky bran apod.); umisťují se přes `at()`. */
  overlay?: ReactNode;
  ariaLabel: string;
}) {
  const kinds = Array.from(new Set(paths.map((p) => p.kind ?? "normal"))).filter((k) => EDGE_STYLE[k].arrow);
  return (
    <div className="hidden @min-[640px]:block">
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }} role="group" aria-label={ariaLabel}>
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${W} ${H}`} aria-hidden focusable="false">
          <defs>
            {kinds.map((k) => (
              <marker key={k} id={`${id}-m-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth={k === "critical" || k === "new" ? 4.2 : 6} markerHeight={k === "critical" || k === "new" ? 4.2 : 6} orient="auto-start-reverse">
                <path d="M0 0L10 5L0 10z" fill={EDGE_STYLE[k].stroke} />
              </marker>
            ))}
          </defs>
          {under}
          {shapes.map((s, n) =>
            s.kind === "diamond" ? (
              <polygon
                key={n}
                data-anim
                style={vi(s.i ?? 0)}
                points={`${s.cx - s.w / 2},${s.cy} ${s.cx},${s.cy - s.h / 2} ${s.cx + s.w / 2},${s.cy} ${s.cx},${s.cy + s.h / 2}`}
                fill="#FBF8F2"
                stroke={INK.primary}
                strokeWidth={1.75}
                strokeLinejoin="round"
              />
            ) : (
              <rect key={n} data-anim style={vi(s.i ?? 0)} x={s.x} y={s.y} width={s.w} height={s.h} rx={12} fill={s.fill ?? "none"} stroke={s.stroke ?? INK.axis} strokeWidth={1.25} strokeDasharray={s.dash} />
            ),
          )}
          {paths.map((p, n) => {
            const k = p.kind ?? "normal";
            const st = EDGE_STYLE[k];
            const i = p.i ?? 0;
            return (
              <g key={n} data-anim style={vi(i)}>
                <path
                  d={p.d}
                  {...(st.dash ? {} : { "data-anim": "draw", pathLength: 1000, style: vi(i) })}
                  fill="none"
                  stroke={st.stroke}
                  strokeWidth={st.width}
                  strokeDasharray={st.dash}
                  strokeLinejoin="round"
                  markerEnd={st.arrow ? `url(#${id}-m-${k})` : undefined}
                />
              </g>
            );
          })}
        </svg>
        {placed.map((p) => {
          const kind = p.node.kind ?? "base";
          return (
            <div
              key={p.node.id}
              data-anim
              className={`absolute flex flex-col overflow-visible rounded-[10px] px-2.5 py-1.5 ${kind === "decision" ? "items-center justify-center px-8 text-center" : NODE_CLASS[kind]} ${p.center ? "items-center justify-center text-center" : ""}`}
              style={{ ...vi(p.i ?? 0), left: pct(p.x, W), top: pct(p.y, H), width: pct(p.w, W), height: pct(p.h, H) }}
            >
              {p.badge && <span className="absolute -right-2.5 -top-2.5">{p.badge}</span>}
              <NodeContent node={p.node} codes={p.codes} center={p.center || kind === "decision"} />
            </div>
          );
        })}
        {labels.map((l, n) => {
          const tx = l.align === "right" ? "-100%" : l.align === "center" ? "-50%" : "0";
          return (
            <span
              key={n}
              data-anim
              className={`absolute block text-[13px] leading-tight ${l.tone === "ink" ? "text-ink" : "text-muted"} ${l.strong ? "font-semibold" : ""} ${l.w ? "" : "whitespace-nowrap"} ${l.align === "right" ? "text-right" : l.align === "center" ? "text-center" : ""}`}
              style={{ ...vi(l.i ?? 0), left: pct(l.x, W), top: pct(l.y, H), width: l.w ? pct(l.w, W) : undefined, translate: `${tx} -50%` }}
            >
              {l.text}
            </span>
          );
        })}
        {overlay}
      </div>
    </div>
  );
}

/** Obsah jen pro úzké zobrazení (kde je plátno skryté). */
export function Narrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`@min-[640px]:hidden ${className}`}>{children}</div>;
}

/** Šipka mezi kartami v úzkém zobrazení. */
export function DownArrow({ label, i = 0 }: { label?: string; i?: number }) {
  return (
    <div data-anim style={vi(i)} className="flex items-center gap-2 py-1 pl-4 text-[13px] text-muted" aria-hidden={label ? undefined : true}>
      <span aria-hidden className="text-[18px] leading-none text-forest">
        ↓
      </span>
      {label && <span>{label}</span>}
    </div>
  );
}

/** Svislý tok karet pro úzké zobrazení: mezi kartami ↓ s volitelným popiskem. */
export function FlowColumn({ nodes, arrows, start = 0 }: { nodes: DNode[]; arrows?: (string | undefined)[]; start?: number }) {
  return (
    <div className="flex flex-col">
      {nodes.map((n, k) => (
        <div key={n.id}>
          <NodeCard node={n} i={start + k} />
          {k < nodes.length - 1 && <DownArrow label={arrows?.[k]} i={start + k} />}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Textová verze
// ---------------------------------------------------------------------------

export function nodeText(n: DNode) {
  const head = [n.code, n.title].filter(Boolean).join(" ");
  return n.lines?.length ? `${head}: ${n.lines.join("; ")}` : head;
}

export function TextNodes({ heading, nodes }: { heading?: string; nodes: DNode[] }) {
  return (
    <div>
      {heading && <p className="font-semibold text-ink">{heading}</p>}
      <ul className="list-disc pl-5">
        {nodes.map((n) => (
          <li key={n.id}>{nodeText(n)}</li>
        ))}
      </ul>
    </div>
  );
}

const EDGE_WORD: Partial<Record<EdgeKind, string>> = { critical: " (kritická cesta)", new: " (nový tok)", stop: " (pojistka)" };

export function TextEdges({ heading = "Vazby", nodes, edges, verb = "→" }: { heading?: string; nodes: DNode[]; edges: DEdge[]; verb?: string }) {
  const name = (id: string) => {
    const n = nodes.find((x) => x.id === id);
    return n ? [n.code, n.title].filter(Boolean).join(" ") : id;
  };
  return (
    <div>
      <p className="font-semibold text-ink">{heading}</p>
      <ul className="list-disc pl-5">
        {edges.map((e, k) => (
          <li key={k}>
            {name(e.from)} {verb} {name(e.to)}
            {e.label ? ` (${e.label})` : ""}
            {EDGE_WORD[e.kind ?? "normal"] ?? ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SourceNote({ lines }: { lines: string }) {
  return <p className="text-[13px] text-muted">Podklad: studie v3, {lines}.</p>;
}
