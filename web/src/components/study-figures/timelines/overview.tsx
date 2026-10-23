import { Chip } from "@/components/web/ui";
import { GATES, MILESTONES, PHASES } from "@/content/reforma";
import { EFFECT_LABELS, FIXED_POINTS, IDLE_2029, MILESTONE_EXTRAS } from "@/content/figures/timelines";
import { FigureShell, GridOverlay, Legend, PHASE_DARK, PHASE_FILL, TextVersion, YEARS, gateLines, pctOf, stagger, type Axis } from "./gantt-core";

/**
 * Obrázek ř. 158: harmonogram 2026–2038 se 5 fázemi, 4 bránami a klíčovými účinnostmi.
 * Fáze, brány a milníky jsou z reforma.ts; sem přibyl jen souběh 1. 1. 2029 a doplňky k účinnostem
 * (ve stejný den začínají platit i daně J8 a J9). Desktop vodorovně, úzký sloupec svisle.
 */

const AXIS: Axis = { x0: 2026.5, x1: 2039 };
const YEAR_TICKS = YEARS(2027, 2038);

type Mk = { at: number; label: string; detail: string; extra?: string; shape: "step" | "eff" | "idle"; fixed: boolean };

const MARKS: Mk[] = [
  ...MILESTONES.map<Mk>((m) => ({
    at: m.at,
    label: m.label,
    detail: m.detail,
    extra: MILESTONE_EXTRAS[m.label],
    shape: EFFECT_LABELS.has(m.label) ? "eff" : "step",
    fixed: FIXED_POINTS.has(m.label),
  })),
  { at: IDLE_2029.at, label: IDLE_2029.label, detail: IDLE_2029.detail, extra: IDLE_2029.text, shape: "idle", fixed: false } satisfies Mk,
].sort((a, b) => a.at - b.at);

/** Blízké značky se na ose rozestoupí do řad, aby se nepřekrývaly. */
const ROWS = MARKS.reduce<number[]>((acc, m, i) => {
  let row = 0;
  while (MARKS.slice(0, i).some((o, j) => acc[j] === row && Math.abs(pctOf(AXIS, o.at) - pctOf(AXIS, m.at)) < 5.5)) row++;
  return [...acc, row];
}, []);
const ROW_COUNT = Math.max(...ROWS) + 1;

function Badge({ n, m }: { n: number; m: Mk }) {
  const ring = m.fixed ? "outline outline-2 outline-offset-2 outline-ink" : "";
  const base = `flex size-6 shrink-0 items-center justify-center text-[13px] font-bold tabular-nums ${ring}`;
  if (m.shape === "eff")
    return (
      <span aria-hidden className={`${base} rotate-45 rounded-[3px] bg-forest-deep text-on-dark`}>
        <span className="-rotate-45">{n}</span>
      </span>
    );
  if (m.shape === "idle")
    return (
      <span aria-hidden className={`${base} rounded-full border-2 border-dashed border-ink-2 bg-sand text-ink`}>
        {n}
      </span>
    );
  return (
    <span aria-hidden className={`${base} rounded-full bg-ink-2 text-on-dark`}>
      {n}
    </span>
  );
}

const phaseYears = (p: (typeof PHASES)[number]) => {
  const a = Math.floor(p.from);
  const b = Math.floor(p.to - 0.01);
  return a === b ? `${a}` : `${a}–${b}`;
};

export function OverviewTimeline() {
  return (
    <FigureShell title="Reforma má pět fází a čtyři brány; první zákony začnou platit 1. 1. 2031 a 1. 1. 2032">
      {/* Desktop: vodorovně */}
      <div role="img" aria-label="Harmonogram 2026 až 2038: pět fází F0 až F4, čtyři brány B1 až B4 a klíčové účinnosti. Totéž je v textové verzi pod obrázkem." className="hidden @min-[640px]:block">
        <div className="relative h-9">
          {GATES.map((g) => (
            <span key={g.id} className="absolute top-0 -translate-x-1/2" style={{ left: `${pctOf(AXIS, g.at)}%` }} title={`${g.id} ${g.name}, ${g.when}`}>
              <Chip variant="gate" className="px-2.5! py-1!">{g.id}</Chip>
            </span>
          ))}
        </div>
        <div className="relative">
          <div className="relative h-[60px]">
            {PHASES.map((p, i) => (
              <div
                key={p.id}
                data-anim="grow"
                title={p.text}
                className={`absolute inset-y-0 overflow-hidden px-2 py-1 text-[13px] leading-tight ${PHASE_DARK[i] ? "text-on-dark" : "text-ink"}`}
                style={{ left: `calc(${pctOf(AXIS, p.from)}% + 2px)`, width: `calc(${pctOf(AXIS, p.to) - pctOf(AXIS, p.from)}% - 4px)`, background: PHASE_FILL[i], borderRadius: 4, ...stagger(i) }}
              >
                <span className="block font-bold">{p.id}</span>
                <span className="line-clamp-2 font-semibold">{p.name}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-2 h-7 border-b border-line-strong">
            {YEAR_TICKS.map((y) => (
              <span key={y} className="absolute inset-y-0 border-l border-line-strong pl-1 text-[13px] tabular-nums leading-7 text-muted" style={{ left: `${pctOf(AXIS, y)}%` }}>
                {y}
              </span>
            ))}
          </div>
          <div className="relative mt-2" style={{ height: ROW_COUNT * 34 }}>
            {MARKS.map((m, i) => (
              <span
                key={m.label}
                data-anim
                className="absolute z-10 -translate-x-1/2"
                style={{ left: `${pctOf(AXIS, m.at)}%`, top: ROWS[i] * 34 + 4, ...stagger(i + 5) }}
                title={`${m.label} · ${m.detail}`}
              >
                <Badge n={i + 1} m={m} />
              </span>
            ))}
          </div>
          <GridOverlay axis={AXIS} lw={0} years={[]} lines={gateLines()} />
        </div>
        <ol className="mt-4 @min-[760px]:columns-2 @min-[760px]:gap-x-8">
          {MARKS.map((m, i) => (
            <li key={m.label} className="mb-2 flex break-inside-avoid gap-2 text-[15px] leading-snug">
              <span className="flex size-8 shrink-0 items-center justify-center"><Badge n={i + 1} m={m} /></span>
              <span>
                <span className="font-semibold text-ink">{m.detail}</span> <span className="text-ink">{m.label}</span>
                {m.extra && <span className="text-muted"> {m.extra}</span>}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Úzký sloupec: svisle po fázích */}
      <ol className="flex flex-col @min-[640px]:hidden">
        {PHASES.map((p, i) => {
          const inside = (at: number, isGate: boolean) => (isGate ? at > p.from && at <= p.to : at >= p.from && (at < p.to || (i === PHASES.length - 1 && at <= p.to)));
          const events = [
            ...MARKS.map((m, mi) => ({ kind: "m" as const, at: m.at, m, n: mi + 1 })),
            ...GATES.map((g) => ({ kind: "g" as const, at: g.at, g })),
          ]
            .filter((e) => inside(e.at, e.kind === "g"))
            .sort((a, b) => a.at - b.at);
          return (
            <li key={p.id} className="relative pb-6 pl-6 last:pb-0">
              <span aria-hidden className="absolute bottom-0 left-0 top-0 w-1.5 rounded-full" style={{ background: PHASE_FILL[i] }} />
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="font-serif text-[22px] font-semibold text-forest">{phaseYears(p)}</span>
                <span className="text-[17px] font-bold text-ink">{p.id} · {p.name}</span>
              </div>
              <p className="mt-1 text-[16px] leading-snug text-ink-2">{p.text}</p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {events.map((e) =>
                  e.kind === "m" ? (
                    <li key={e.m.label} className="flex gap-2 text-[15px] leading-snug">
                      <span className="flex size-8 shrink-0 items-center justify-center"><Badge n={e.n} m={e.m} /></span>
                      <span>
                        <span className="font-semibold text-ink">{e.m.detail}</span> {e.m.label}
                        {e.m.extra && <span className="text-muted"> {e.m.extra}</span>}
                      </span>
                    </li>
                  ) : (
                    <li key={e.g.id}>
                      <Chip variant="gate">{e.g.id} · {e.g.name} · {e.g.when}</Chip>
                    </li>
                  ),
                )}
              </ul>
            </li>
          );
        })}
      </ol>

      <Legend
        items={[
          { swatch: <span className="flex size-5 items-center justify-center rounded-full bg-ink-2 text-[11px] font-bold text-on-dark">1</span>, text: "krok nebo cíl" },
          { swatch: <span className="block size-4 rotate-45 rounded-[3px] bg-forest-deep" />, text: "účinnost zákona nebo pravidla" },
          { swatch: <span className="block size-5 rounded-full outline outline-2 outline-offset-2 outline-ink" />, text: "pevný bod (30. 6. 2027, volby, 1. 1. 2032)" },
          { swatch: <span className="block size-5 rounded-full border-2 border-dashed border-ink-2" />, text: "den, na který reforma nic neklade" },
          { swatch: <Chip variant="gate" className="px-2! py-0!">B</Chip>, text: "brána: pokračovat, upravit, nebo zmenšit" },
        ]}
      />

      <TextVersion
        caption="Harmonogram 2026 až 2038: fáze, brány a klíčové účinnosti"
        header={["Co", "Kdy", "Poznámka"]}
        rows={[
          ...PHASES.map((p) => [`${p.id} ${p.name}`, phaseYears(p), p.text]),
          ...GATES.map((g) => [`Brána ${g.id} ${g.name}`, g.when, g.must]),
          ...MARKS.map((m) => [m.label, m.detail, m.extra ?? ""]),
        ]}
      />
    </FigureShell>
  );
}
