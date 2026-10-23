import { Fragment, type CSSProperties, type ReactNode } from "react";
import { Chip } from "@/components/web/ui";
import { DataTable } from "@/components/charts/data-table";
import { GATES, PHASES } from "@/content/reforma";
import type { AxisLine, BarKind, MarkKind, TrackItem } from "@/content/figures/timelines";
import { Reveal } from "../reveal";

/**
 * Společné stavební kameny časových os studie: osa let jako sloupce, pruhy (HTML/CSS),
 * značky, svislé čáry bran, legenda a textová verze. Žádný JS timer; pruhy se rozběhnou
 * přes data-anim="grow" uvnitř Reveal.
 */

export type Axis = { x0: number; x1: number };

export const pctOf = (a: Axis, x: number) => ((Math.min(Math.max(x, a.x0), a.x1) - a.x0) / (a.x1 - a.x0)) * 100;

/** Fáze jako pásy od šalvěje k lesní zelené (stejně jako Timeline v charts/timeline.tsx). */
export const PHASE_FILL = ["#DCE8E0", "#A9C4B5", "#4A7262", "#2E4F46", "#1F4A3D"];
export const PHASE_DARK = [false, false, true, true, true];

/** Čáry bran z GATES (reforma.ts) a volby; volitelně další. */
export const gateLines = (): AxisLine[] => GATES.map((g) => ({ at: g.at, kind: "gate", label: `${g.id} ${g.name}, ${g.when}` }));

const BAR_CLS: Record<BarKind, string> = {
  prep: "border border-[#6A8F7C] bg-sage-soft",
  law: "border border-[#6A8F7C] bg-sage",
  ramp: "bg-[#4A7262]",
  gov: "bg-[#BDB8AE]",
};

/** Barva textu uvnitř pruhu. */
const BAR_TEXT: Record<BarKind, string> = {
  prep: "text-ink",
  law: "text-ink",
  ramp: "text-on-dark",
  gov: "text-ink",
};

export const stagger = (n: number): CSSProperties => ({ "--i": Math.min(n, 12) }) as CSSProperties;

function Bar({ axis, it, i }: { axis: Axis; it: Extract<TrackItem, { t: "bar" }>; i: number }) {
  const l = pctOf(axis, it.from);
  const r = pctOf(axis, it.to);
  if (r - l <= 0) return null;
  const geo: CSSProperties = it.sub ? { top: "calc(50% + 4px)", height: 6 } : { top: "calc(50% - 8px)", height: 16 };
  return (
    <>
      <span
        data-anim="grow"
        title={it.title ?? it.label}
        className={`absolute block rounded-r-[4px] ${BAR_CLS[it.kind]} ${it.dashed ? "border-dashed border-muted!" : ""}`}
        style={{ left: `${l}%`, width: `${r - l}%`, ...geo, ...stagger(i) }}
      />
      {it.label && <BarLabel axis={axis} it={it} i={i} l={l} r={r} />}
    </>
  );
}

const LABEL_BASE = "absolute whitespace-nowrap text-[13px] leading-4";
/** Delší popisek se zalomí na zadanou šířku (kotví se dolním nebo horním okrajem, takže roste od čáry). */
const WRAP = (w: number): CSSProperties => ({ width: w, whiteSpace: "normal" });

function BarLabel({ it, i, l, r }: { axis: Axis; it: Extract<TrackItem, { t: "bar" }>; i: number; l: number; r: number }) {
  const pos = it.pos ?? "r";
  const st = stagger(i + 1);
  if (pos === "in") {
    return (
      <span data-anim className={`${LABEL_BASE} overflow-hidden text-ellipsis pl-3 pr-1.5 ${BAR_TEXT[it.kind]}`} style={{ left: `${l}%`, width: `${r - l}%`, top: "calc(50% - 8px)", ...st }}>
        {it.label}
      </span>
    );
  }
  const style: CSSProperties =
    pos === "r" ? { left: `calc(${r}% + 8px)`, top: "calc(50% - 8px)" }
    : pos === "l" ? { right: `calc(${100 - l}% + 8px)`, top: "calc(50% - 8px)", textAlign: "right" }
    : pos === "a" ? { left: `${l}%`, bottom: "calc(50% + 10px)" }
    : { left: `${l}%`, top: "calc(50% + 10px)" };
  return (
    <span data-anim className={`${LABEL_BASE} text-ink`} style={{ ...style, ...(it.w ? WRAP(it.w) : {}), ...st }}>
      {it.label}
    </span>
  );
}

const MARK_CLS: Record<MarkKind, string> = {
  eff: "bg-forest-deep",
  gov: "bg-[#6E695F]",
  step: "border-2 border-forest bg-sand",
};

function Mark({ axis, it, i }: { axis: Axis; it: Extract<TrackItem, { t: "mark" }>; i: number }) {
  const p = pctOf(axis, it.at);
  const hollowGov = it.kind === "gov" && it.ask;
  const cls = hollowGov ? "border-2 border-dashed border-[#6E695F] bg-sand" : `${MARK_CLS[it.kind]} ${it.ask ? "border-dashed" : ""}`;
  const pos = it.pos ?? "r";
  const st = stagger(i + 1);
  let style: CSSProperties;
  if (pos === "r") style = { left: `calc(${p}% + 11px)`, top: "calc(50% - 8px)" };
  else if (pos === "l") style = { right: `calc(${100 - p}% + 11px)`, top: "calc(50% - 8px)", textAlign: "right" };
  else if (pos === "a") style = it.end ? { right: `calc(${100 - p}% - 6px)`, bottom: "calc(50% + 10px)", textAlign: "right" } : { left: `calc(${p}% - 6px)`, bottom: "calc(50% + 10px)" };
  else style = it.end ? { right: `calc(${100 - p}% - 6px)`, top: "calc(50% + 10px)", textAlign: "right" } : { left: `calc(${p}% - 6px)`, top: "calc(50% + 10px)" };
  return (
    <>
      <span aria-hidden className="absolute" style={{ left: `${p}%`, top: "50%" }}>
        <span data-anim title={it.title ?? it.label} className={`absolute -left-1.5 -top-1.5 block size-3 rotate-45 ${cls}`} style={stagger(i)} />
      </span>
      {it.label && (
        <span data-anim className={`${LABEL_BASE} text-ink`} style={{ ...style, ...(it.w ? WRAP(it.w) : {}), ...st }}>
          {it.label}
        </span>
      )}
    </>
  );
}

/** Jedna dráha: pruhy a značky na společné časové ose. */
export function Track({ axis, items, h, base = 0 }: { axis: Axis; items: TrackItem[]; h?: number; base?: number }) {
  return (
    <div className={h == null ? "absolute inset-0" : "relative"} style={h == null ? undefined : { height: h }}>
      {items.map((it, i) => (
        <Fragment key={i}>{it.t === "bar" ? <Bar axis={axis} it={it} i={base + i} /> : <Mark axis={axis} it={it} i={base + i} />}</Fragment>
      ))}
    </div>
  );
}

/** Mřížka let a svislé čáry (brány, volby) přes celé tělo grafu; leží pod popisky. */
export function GridOverlay({ axis, lw, years, lines }: { axis: Axis; lw: number; years: number[]; lines: AxisLine[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0" style={{ left: lw }}>
      {years.map((y) => (
        <span key={y} className="absolute inset-y-0 w-px bg-line" style={{ left: `${pctOf(axis, y)}%` }} />
      ))}
      {lines.map((ln) => (
        <span
          key={ln.label}
          className={`absolute inset-y-0 ${ln.kind === "gate" ? "-ml-px w-[2px] bg-ink/70" : ln.kind === "election" ? "border-l-2 border-dashed border-ink-2" : "border-l border-dashed border-muted"}`}
          style={{ left: `${pctOf(axis, ln.at)}%` }}
        />
      ))}
    </div>
  );
}

/** Záhlaví: čipy bran, pás fází a roky. */
export function GanttHeader({ axis, lw, years, phases = true, gates = true }: { axis: Axis; lw: number; years: number[]; phases?: boolean; gates?: boolean }) {
  return (
    <div>
      {gates && (
        <div className="relative h-9" style={{ marginLeft: lw }}>
          {GATES.filter((g) => g.at <= axis.x1).map((g) => (
            <span key={g.id} className="absolute top-0 -translate-x-1/2" style={{ left: `${pctOf(axis, g.at)}%` }} title={`${g.id} ${g.name}, ${g.when}`}>
              <Chip variant="gate" className="px-2.5! py-1!">{g.id}</Chip>
            </span>
          ))}
        </div>
      )}
      {phases && (
        <div className="relative h-7" style={{ marginLeft: lw }}>
          {PHASES.map((p, i) => {
            const l = pctOf(axis, p.from);
            const r = pctOf(axis, p.to);
            if (r - l <= 0) return null;
            return (
              <span
                key={p.id}
                title={`${p.id} ${p.name}`}
                className={`absolute inset-y-0 flex items-center overflow-hidden whitespace-nowrap px-1.5 text-[13px] font-semibold ${PHASE_DARK[i] ? "text-on-dark" : "text-ink"}`}
                style={{ left: `calc(${l}% + 1px)`, width: `calc(${r - l}% - 2px)`, background: PHASE_FILL[i], borderRadius: 4 }}
              >
                {p.id}
                {r - l > 30 ? ` ${p.name}` : ""}
              </span>
            );
          })}
        </div>
      )}
      <div className="relative h-7 border-b border-line-strong" style={{ marginLeft: lw }}>
        {years.map((y) => (
          <span key={y} className="absolute inset-y-0 border-l border-line-strong pl-1 text-[13px] tabular-nums leading-7 text-muted" style={{ left: `${pctOf(axis, y)}%` }}>
            {y}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Legenda jako řádek swatchů s popisky (min. 13 px). */
export function Legend({ items }: { items: { swatch: ReactNode; text: string }[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px] leading-snug text-ink-2" aria-label="Legenda">
      {items.map((it) => (
        <li key={it.text} className="flex items-center gap-2">
          <span aria-hidden className="flex w-7 shrink-0 items-center justify-center">{it.swatch}</span>
          {it.text}
        </li>
      ))}
    </ul>
  );
}

export const SW = {
  bar: (kind: BarKind, dashed = false) => <span className={`block h-3.5 w-7 rounded-r-[4px] ${BAR_CLS[kind]} ${dashed ? "border-dashed border-muted!" : ""}`} />,
  sub: (kind: BarKind) => <span className={`block h-1.5 w-7 ${BAR_CLS[kind]}`} />,
  diamond: (kind: MarkKind, ask = false) => (
    <span className={`block size-3 rotate-45 ${kind === "eff" ? "bg-forest-deep" : kind === "gov" ? (ask ? "border-2 border-dashed border-[#6E695F] bg-sand" : "bg-[#6E695F]") : `border-2 border-forest bg-sand ${ask ? "border-dashed" : ""}`}`} />
  ),
  gate: <span className="block h-4 w-[2px] bg-ink/70" />,
  election: <span className="block h-4 border-l-2 border-dashed border-ink-2" />,
  soft: <span className="block h-4 border-l border-dashed border-muted" />,
};

/** Rámec obrázku: titulek-tvrzení, container query pro přepnutí na seznam, Reveal. */
export function FigureShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="@container font-sans">
      <p className="mb-4 font-serif text-[21px] font-semibold leading-[1.25] text-ink">{title}</p>
      <Reveal>{children}</Reveal>
    </div>
  );
}

/** Textová verze pod diagramem: <details> s tabulkou. */
export function TextVersion({ header, rows, caption }: { header: string[]; rows: ReactNode[][]; caption: string }) {
  return (
    <details className="mt-5 rounded-card border border-line bg-paper px-4 py-3">
      <summary className="min-h-11 cursor-pointer text-[16px] font-semibold leading-[2.75rem] text-forest">Textová verze</summary>
      <div className="mt-2 pb-2">
        <DataTable header={header} rows={rows} caption={caption} numeric={false} />
      </div>
    </details>
  );
}

export const YEARS = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
