"use client";

import { useMemo, useState } from "react";
import { INK } from "@/components/charts/theme";
import { COLUMNS, LANES, MAP_EDGES, MAP_NODES, OPPOSITION_COLS, type MapEdge, type MapKind, type MapNode } from "@/content/figures/vazby";
import { DiagramFrame, SwatchBox, type LegendItem } from "./shared";

/**
 * Mapa vazeb: opatření jádra, podmínky, brány a klíčové kroky na časové ose po pásech.
 * Klik (nebo Enter) na uzel ukáže, co musí přijít dřív a co opatření umožní; vysvětlení
 * každé vazby je v panelu pod mapou. Široké plátno má pevnou šířku a na úzkém displeji
 * se posouvá do stran; v tisku se zmenší na šířku stránky (print.css).
 */

const LABEL_W = 100;
const COL_W = 164;
const NODE_W = 144;
const NODE_H = 74;
const GAP_Y = 10;
const LANE_PAD = 10;
const HEAD_H = 56;
const W = LABEL_W + COLUMNS.length * COL_W;

const FOREST = "#1f4a3d";

const KIND_CLASS: Record<MapKind, string> = {
  core: "border-2 border-forest bg-sage-soft",
  cond: "border-2 border-dashed border-forest bg-paper",
  gate: "border-2 border-dashed border-ink bg-paper",
  step: "border border-line-strong bg-paper",
  result: "border-2 border-ink bg-stone",
  extra: "border border-forest/60 bg-paper",
};

type Box = MapNode & { x: number; y: number };

function layout() {
  const laneTop: Record<string, number> = {};
  const laneH: Record<string, number> = {};
  let y = HEAD_H;
  for (const l of LANES) {
    const rows = Math.max(1, ...COLUMNS.map((_, c) => MAP_NODES.filter((n) => n.lane === l.id && n.col === c).length));
    laneTop[l.id] = y;
    laneH[l.id] = LANE_PAD * 2 + rows * NODE_H + (rows - 1) * GAP_Y;
    y += laneH[l.id];
  }
  const boxes: Box[] = MAP_NODES.map((n) => ({
    ...n,
    x: LABEL_W + n.col * COL_W + (COL_W - NODE_W) / 2,
    y: laneTop[n.lane] + LANE_PAD + n.row * (NODE_H + GAP_Y),
  }));
  return { boxes, laneTop, laneH, H: y + 8 };
}

function edgePath(a: Box, b: Box) {
  const ay = a.y + NODE_H / 2;
  const by = b.y + NODE_H / 2;
  if (b.col > a.col) {
    const sx = a.x + NODE_W;
    const ex = b.x - 2;
    const dx = Math.max(28, (ex - sx) / 2);
    return `M${sx} ${ay}C${sx + dx} ${ay} ${ex - dx} ${by} ${ex} ${by}`;
  }
  if (b.col < a.col) {
    const sx = a.x;
    const ex = b.x + NODE_W + 2;
    const dx = Math.max(28, (sx - ex) / 2);
    return `M${sx} ${ay}C${sx - dx} ${ay} ${ex + dx} ${by} ${ex} ${by}`;
  }
  // Stejný sloupec: oblouk mezerou vpravo od uzlů, aby čára nešla přes jiné uzly.
  const sx = a.x + NODE_W;
  const ex = b.x + NODE_W + 2;
  const bulge = 14 + Math.min(10, Math.abs(by - ay) / 40);
  return `M${sx} ${ay}C${sx + bulge} ${ay} ${ex + bulge} ${by} ${ex} ${by}`;
}

/** Všechny uzly, které musí přijít dřív (po vazbách „needs“), a které na uzlu stojí. */
function closure(id: string) {
  const up = new Set<string>();
  const down = new Set<string>();
  const walk = (start: string, dir: "up" | "down", set: Set<string>) => {
    const stack = [start];
    while (stack.length) {
      const cur = stack.pop()!;
      for (const e of MAP_EDGES) {
        if (e.kind !== "needs") continue;
        const next = dir === "up" ? (e.to === cur ? e.from : null) : e.from === cur ? e.to : null;
        if (next && !set.has(next) && next !== id) {
          set.add(next);
          stack.push(next);
        }
      }
    }
  };
  walk(id, "up", up);
  walk(id, "down", down);
  return { up, down };
}

const nodeName = (n: MapNode) => (n.code ? `${n.code} ${n.title}` : n.title);
const byId = new Map(MAP_NODES.map((n) => [n.id, n]));

const LEGEND: LegendItem[] = [
  { swatch: <SwatchBox kind="core" />, label: "jádro (J1–J10)" },
  { swatch: <SwatchBox kind="cond" />, label: "podmínka (P1–P5)" },
  { swatch: <span aria-hidden className={`inline-block h-3.5 w-5 shrink-0 rounded-[3px] ${KIND_CLASS.extra}`} />, label: "doplňkové opatření" },
  { swatch: <SwatchBox kind="base" />, label: "zákon nebo krok" },
  { swatch: <SwatchBox kind="gate" />, label: "brána" },
  { swatch: <SwatchBox kind="result" />, label: "výsledek" },
  { swatch: <Line kind="critical" />, label: "bez A nejde B, kritická cesta" },
  { swatch: <Line kind="needs" />, label: "bez A nejde B" },
  { swatch: <Line kind="boost" />, label: "A posiluje B" },
];

function Line({ kind }: { kind: "critical" | "needs" | "boost" }) {
  const s = kind === "critical" ? { c: INK.primary, w: 2.5 } : kind === "needs" ? { c: INK.muted, w: 1.5 } : { c: FOREST, w: 1.5, d: "5 4" };
  return (
    <svg aria-hidden width="28" height="10" viewBox="0 0 28 10" className="shrink-0">
      <line x1="1" x2="22" y1="5" y2="5" stroke={s.c} strokeWidth={s.w} strokeDasharray={"d" in s ? s.d : undefined} />
      <path d="M21 1.5L27 5L21 8.5z" fill={s.c} />
    </svg>
  );
}

function edgeStyle(e: MapEdge) {
  if (e.kind === "boost") return { stroke: FOREST, width: 1.5, dash: "5 4", marker: "boost" };
  if (e.critical) return { stroke: INK.primary, width: 2.4, marker: "critical" };
  return { stroke: INK.muted, width: 1.4, marker: "needs" };
}

const START = ["premena", "tymy", "p4", "b3"];
const LAYOUT = layout();
const BOX_BY_ID = new Map(LAYOUT.boxes.map((b) => [b.id, b]));

export function VazbyMapFigure() {
  const { boxes, laneTop, laneH, H } = LAYOUT;
  const boxById = BOX_BY_ID;
  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const focus = hover ?? selected;
  const rel = useMemo(() => (focus ? closure(focus) : null), [focus]);

  const state = (id: string) => {
    if (!focus || !rel) return "normal";
    if (id === focus) return "focus";
    if (rel.up.has(id)) return "up";
    if (rel.down.has(id)) return "down";
    const direct = MAP_EDGES.some((e) => e.kind === "boost" && ((e.from === focus && e.to === id) || (e.to === focus && e.from === id)));
    return direct ? "boost" : "dim";
  };
  const edgeOn = (e: MapEdge) => {
    if (!focus || !rel) return true;
    if (e.kind === "boost") return e.from === focus || e.to === focus;
    const upSet = new Set([...rel.up, focus]);
    const downSet = new Set([...rel.down, focus]);
    return (upSet.has(e.from) && upSet.has(e.to)) || (downSet.has(e.from) && downSet.has(e.to));
  };

  const sel = selected ? byId.get(selected) : null;
  const textVersion = (
    <>
      <p>Mapa ukazuje {MAP_NODES.length} opatření a kroků a {MAP_EDGES.length} vazeb mezi nimi. Vazba „bez A nejde B“ nikdy nemíří proti času.</p>
      {LANES.map((l) => (
        <div key={l.id}>
          <p className="font-semibold text-ink">{l.title}</p>
          <ul className="list-disc pl-5">
            {MAP_NODES.filter((n) => n.lane === l.id)
              .sort((a, b) => a.col - b.col || a.row - b.row)
              .map((n) => {
                const needs = MAP_EDGES.filter((e) => e.to === n.id && e.kind === "needs").map((e) => nodeName(byId.get(e.from)!));
                return (
                  <li key={n.id}>
                    {nodeName(n)} ({n.when}){needs.length > 0 ? `; bez toho nejde: ${needs.join(", ")}` : ""}
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </>
  );

  return (
    <DiagramFrame
      title="Co na co navazuje: každá šipka vede od toho, co musí přijít dřív"
      subtitle="Mapa vazeb opatření v čase · základní scénář Vláda 2030 · klikněte na opatření a uvidíte, na čem stojí a co umožní"
      legend={LEGEND}
      textVersion={textVersion}
    >
      <div className="vazby-scroll -mx-1 overflow-x-auto px-1 pb-2" tabIndex={0} role="region" aria-label="Mapa vazeb, posouvá se do stran">
        <div className="vazby-canvas relative" style={{ width: W, height: H }} role="figure" aria-label="Mapa vazeb mezi opatřeními">
          {/* Mřížka: pásy, sloupce, opozice a vláda */}
          <svg className="absolute inset-0" width={W} height={H} aria-hidden focusable="false">
            <rect x={LABEL_W} y={0} width={OPPOSITION_COLS * COL_W} height={H} fill="#F3EEE4" />
            {COLUMNS.map((_, c) => (
              <line key={c} x1={LABEL_W + c * COL_W} x2={LABEL_W + c * COL_W} y1={22} y2={H} stroke={INK.grid} strokeWidth={1} />
            ))}
            {LANES.map((l) => (
              <line key={l.id} x1={0} x2={W} y1={laneTop[l.id]} y2={laneTop[l.id]} stroke={INK.axis} strokeWidth={1} />
            ))}
            <line x1={0} x2={W} y1={H - 8} y2={H - 8} stroke={INK.axis} strokeWidth={1} />
          </svg>
          <div className="absolute text-[13px] font-bold uppercase tracking-[0.06em] text-muted" style={{ left: LABEL_W + 8, top: 2 }}>
            V opozici
          </div>
          <div className="absolute text-[13px] font-bold uppercase tracking-[0.06em] text-forest" style={{ left: LABEL_W + OPPOSITION_COLS * COL_W + 8, top: 2 }}>
            Ve vládě (od přelomu 2029/2030)
          </div>
          {COLUMNS.map((c, k) => (
            <div key={c} className="absolute text-center text-[14px] font-semibold text-ink" style={{ left: LABEL_W + k * COL_W, top: 26, width: COL_W }}>
              {c}
            </div>
          ))}
          {LANES.map((l) => (
            <div key={l.id} className="absolute flex items-center pr-3 text-[14px] font-semibold leading-tight text-ink-2" style={{ left: 0, top: laneTop[l.id], width: LABEL_W, height: laneH[l.id] }}>
              {l.title}
            </div>
          ))}

          {/* Vazby */}
          <svg className="pointer-events-none absolute inset-0 overflow-visible" width={W} height={H} aria-hidden focusable="false">
            <defs>
              {[
                ["critical", INK.primary, 4.2],
                ["needs", INK.muted, 6],
                ["boost", FOREST, 6],
              ].map(([id, c, s]) => (
                <marker key={id as string} id={`vz-m-${id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth={s as number} markerHeight={s as number} orient="auto-start-reverse">
                  <path d="M0 0L10 5L0 10z" fill={c as string} />
                </marker>
              ))}
            </defs>
            {MAP_EDGES.map((e) => {
              const a = boxById.get(e.from)!;
              const b = boxById.get(e.to)!;
              const st = edgeStyle(e);
              const on = edgeOn(e);
              return (
                <path
                  key={`${e.from}-${e.to}-${e.kind}`}
                  d={edgePath(a, b)}
                  fill="none"
                  stroke={st.stroke}
                  strokeWidth={focus && on ? st.width + 0.6 : st.width}
                  strokeDasharray={st.dash}
                  markerEnd={`url(#vz-m-${st.marker})`}
                  opacity={on ? (focus ? 1 : 0.55) : 0.08}
                />
              );
            })}
          </svg>

          {/* Uzly */}
          {boxes.map((b) => {
            const s = state(b.id);
            const ring =
              s === "focus"
                ? "ring-[3px] ring-action ring-offset-1"
                : s === "up"
                  ? "ring-2 ring-ink"
                  : s === "down"
                    ? "ring-2 ring-forest"
                    : s === "boost"
                      ? "ring-2 ring-forest/50"
                      : "";
            return (
              <button
                key={b.id}
                type="button"
                data-ui
                aria-pressed={selected === b.id}
                onClick={() => setSelected(selected === b.id ? null : b.id)}
                onMouseEnter={() => setHover(b.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(b.id)}
                onBlur={() => setHover(null)}
                className={`absolute flex flex-col items-start overflow-hidden rounded-[10px] px-2 py-1.5 text-left transition-opacity ${KIND_CLASS[b.kind]} ${ring} ${s === "dim" ? "opacity-30" : "opacity-100"} cursor-pointer hover:shadow-md focus-visible:outline-none`}
                style={{ left: b.x, top: b.y, width: NODE_W, height: NODE_H }}
              >
                <span className="line-clamp-2 text-[13px] font-semibold leading-[1.2] text-ink">
                  {b.code && <span className="mr-1 rounded-[4px] bg-stone px-1 font-mono text-[12px] font-normal">{b.code}</span>}
                  {b.title}
                </span>
                <span className="mt-auto line-clamp-2 text-[12px] leading-[1.2] text-ink-2">{b.when}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Panel selected={sel ?? null} onPick={setSelected} />
    </DiagramFrame>
  );
}

function Panel({ selected, onPick }: { selected: MapNode | null; onPick: (id: string | null) => void }) {
  if (!selected) {
    return (
      <div className="vazby-panel mt-3 rounded-[12px] border border-line bg-sand p-4 text-[15px] leading-snug text-ink-2">
        <p className="font-semibold text-ink">Klikněte na kterékoli opatření.</p>
        <p className="mt-1">
          Černě orámované musí přijít dřív, zeleně orámované na něm stojí. Šedé šipky znamenají „bez A nejde B“, silné leží na kritické cestě a zelené čárkované znamenají „A posiluje B“. Pro začátek:
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {START.map((id) => (
            <button key={id} type="button" data-ui onClick={() => onPick(id)} className="min-h-11 rounded-full border border-forest px-4 text-[15px] font-semibold text-forest hover:bg-sage-soft">
              {nodeName(byId.get(id)!)}
            </button>
          ))}
        </div>
      </div>
    );
  }
  const into = MAP_EDGES.filter((e) => e.to === selected.id);
  const out = MAP_EDGES.filter((e) => e.from === selected.id);
  const groups: { title: string; edges: MapEdge[]; other: (e: MapEdge) => string }[] = [
    { title: "Musí přijít dřív", edges: into.filter((e) => e.kind === "needs"), other: (e) => e.from },
    { title: "Bez něj nepůjde", edges: out.filter((e) => e.kind === "needs"), other: (e) => e.to },
    { title: "Posiluje", edges: out.filter((e) => e.kind === "boost"), other: (e) => e.to },
    { title: "Posilují ho", edges: into.filter((e) => e.kind === "boost"), other: (e) => e.from },
  ];
  const { up, down } = closure(selected.id);
  return (
    <div className="vazby-panel mt-3 rounded-[12px] border border-line bg-paper p-4 text-[15px] leading-snug text-ink-2" aria-live="polite">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-serif text-[19px] font-semibold text-ink">{nodeName(selected)}</p>
        <button type="button" data-ui onClick={() => onPick(null)} className="min-h-11 text-[15px] font-semibold text-forest underline">
          Zrušit výběr
        </button>
      </div>
      <p className="mt-0.5 text-muted">
        {selected.when}. Předchozích kroků v řetězci: {up.size}. Navazujících kroků: {down.size}.
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {groups
          .filter((g) => g.edges.length > 0)
          .map((g) => (
            <div key={g.title}>
              <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-muted">{g.title}</p>
              <ul className="mt-1 flex flex-col gap-2">
                {g.edges.map((e) => {
                  const o = byId.get(g.other(e))!;
                  return (
                    <li key={`${e.from}-${e.to}-${e.kind}`}>
                      <button type="button" data-ui onClick={() => onPick(o.id)} className="text-left font-semibold text-ink underline decoration-line-strong underline-offset-2 hover:decoration-forest">
                        {nodeName(o)}
                      </button>
                      <span className="block text-[14px] text-ink-2">{e.why}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
      </div>
      {selected.code && !/^B\d$/.test(selected.code) && (
        <p className="mt-3 text-[15px]">
          <a href={`/studie?q=${encodeURIComponent(selected.code)}`} className="font-semibold text-forest underline">
            Najít {selected.code} ve studii
          </a>
        </p>
      )}
    </div>
  );
}
