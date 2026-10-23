import { CHAINS, COST_2038, COST_GROUPS, FUNDING, FUND_GROUPS, GATES, KEY_SUBJECTS, PHASES } from "@/content/reforma";
import { INK, SERIES, csNumber } from "@/components/charts/theme";

/* Vizuály bez knihovny: čisté SVG a HTML, vykreslené na serveru. */

/** Dvě plochy úměrné podílu na úhradách: 29,7 % akutní lůžka vs 4,3 % praktici pro dospělé. */
export function HeroSplit() {
  const a = 29.7, b = 4.3;
  const W = 360, H = 200;
  const wa = Math.sqrt(a / 30) * 170, wb = Math.sqrt(b / 30) * 170;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[420px]" role="img" aria-label="Podíl výdajů pojištění: akutní lůžka 29,7 %, praktici pro dospělé 4,3 %">
      <rect x={10} y={H - 20 - wa} width={wa} height={wa} rx={8} fill={SERIES[0]} />
      <text x={10 + wa / 2} y={H - 20 - wa / 2 - 6} textAnchor="middle" fontSize={34} fontWeight={700} fill="#fff" className="font-display">29,7 %</text>
      <text x={10 + wa / 2} y={H - 20 - wa / 2 + 18} textAnchor="middle" fontSize={12} fill="#fff">akutní lůžka</text>
      <rect x={10 + wa + 28} y={H - 20 - wb} width={wb} height={wb} rx={6} fill={SERIES[1]} />
      <text x={10 + wa + 28 + wb / 2} y={H - 20 - wb - 10} textAnchor="middle" fontSize={22} fontWeight={700} fill={INK.primary} className="font-display">4,3 %</text>
      <text x={10 + wa + 28 + wb / 2} y={H - 4} textAnchor="middle" fontSize={11} fill={INK.secondary}>praktici pro dospělé</text>
      <line x1={10} x2={W - 10} y1={H - 20} y2={H - 20} stroke={INK.axis} />
    </svg>
  );
}

/** Tým sdružené péče: jmenovitá dvojice uprostřed, profese a partneři kolem. */
export function TeamOrganigram() {
  const nodes = [
    { l: "2 sestry na lékaře", a: -90 },
    { l: "Nutriční terapeut", a: -30 },
    { l: "Fyzioterapeut", a: 30 },
    { l: "Psycholog", a: 90 },
    { l: "Recepce a zapisovatel", a: 150 },
    { l: "Návštěvy doma, senior taxi", a: 210 },
  ];
  const cx = 230, cy = 150, R = 110;
  return (
    <svg viewBox="0 0 460 300" className="w-full" role="img" aria-label="Schéma týmu sdružené péče: lékař a sestra uprostřed, kolem další profese">
      {nodes.map((n) => {
        const x = cx + R * Math.cos((n.a * Math.PI) / 180), y = cy + R * Math.sin((n.a * Math.PI) / 180);
        return (
          <g key={n.l}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={INK.grid} strokeWidth={2} />
            <circle cx={x} cy={y} r={8} fill={SERIES[2]} stroke={INK.surface} strokeWidth={2} />
            <text x={x} y={y + (Math.sin((n.a * Math.PI) / 180) >= 0 ? 24 : -14)} textAnchor="middle" fontSize={11} fill={INK.primary}>{n.l}</text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={46} fill={SERIES[0]} />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={12} fontWeight={600} fill="#fff">váš lékař</text>
      <text x={cx} y={cy + 13} textAnchor="middle" fontSize={12} fontWeight={600} fill="#fff">a vaše sestra</text>
      <text x={cx} y={290} textAnchor="middle" fontSize={11} fill={INK.secondary}>jeden tým pro 10 až 25 tisíc lidí · smlouva s pojišťovnou na 5 let</text>
    </svg>
  );
}

/** Tři kategorie naléhavosti v elektronické žádance. */
export function TriageLanes() {
  const lanes = [
    { l: "Urgentní", t: "termín do 2 týdnů", w: 0.18, c: SERIES[1] },
    { l: "Do 6 týdnů", t: "termín do 6 týdnů", w: 0.5, c: SERIES[0] },
    { l: "Plánované", t: "termín podle kapacity, čekání se měří", w: 0.92, c: MUTED },
  ];
  return (
    <div className="space-y-3">
      {lanes.map((x) => (
        <div key={x.l}>
          <div className="mb-1 flex items-baseline justify-between text-sm"><span className="font-semibold">{x.l}</span><span className="text-muted">{x.t}</span></div>
          <div className="h-[22px] w-full rounded bg-stone-100">
            <div className="h-full rounded-r-[4px]" style={{ width: `${x.w * 100}%`, background: x.c }} />
          </div>
        </div>
      ))}
      <p className="text-xs text-muted">Naléhavost určí lékař, ne úřad ani pojišťovna. Bez žádanky lze jít dál. Kdo lhůtu nedodrží, je poskytovatel, pacient nikdy.</p>
    </div>
  );
}
const MUTED = "#c3c2b7";

/** 100 čtverečků = 48 036 akutních lůžek; 17 z nich změní účel (8 000). */
export function BedWaffle() {
  const change = Math.round((8000 / 48036) * 100);
  return (
    <div>
      <div className="grid grid-cols-20 gap-[3px]" style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }}>
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i} className="aspect-square rounded-[3px]" style={{ background: i >= 100 - change ? SERIES[1] : SERIES[0], opacity: i >= 100 - change ? 1 : 0.85 }} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ background: SERIES[0] }} /> zůstávají akutní: asi 40 000 lůžek</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ background: SERIES[1] }} /> změní účel do roku 2038: 8 000 lůžek</span>
      </div>
      <p className="mt-2 text-xs text-muted">Jeden čtvereček je asi 480 lůžek. Ze 4,4 lůžka na 1 000 obyvatel na 3,7. Lůžko se nezmění dřív, než kraj doloží náhradu a dojezd záchranky.</p>
    </div>
  );
}

/** Tři řetězce, které na sebe navazují, a kontrolní body mezi nimi. */
export function ChainsDiagram() {
  return (
    <div className="space-y-4">
      {CHAINS.map((ch) => (
        <div key={ch.id} className="grid gap-2 md:grid-cols-[120px_1fr]">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: SERIES[ch.color] }} />
            {ch.name}
          </div>
          <ol className="flex flex-wrap items-stretch gap-2">
            {ch.steps.map((s, i) => (
              <li key={s.label} className="flex items-stretch gap-2">
                <div className="min-w-[150px] flex-1 rounded-lg border border-line bg-paper px-3 py-2" style={{ borderTopColor: SERIES[ch.color], borderTopWidth: 3 }}>
                  <div className="text-sm leading-snug">{s.label}</div>
                  <div className="text-xs text-muted">{s.when}</div>
                </div>
                {i < ch.steps.length - 1 && <div className="self-center text-muted" aria-hidden>→</div>}
              </li>
            ))}
          </ol>
        </div>
      ))}
      <div className="rounded-lg bg-stone-50 px-4 py-3 text-sm text-muted">
        Každá šipka znamená „bez A nejde B“: peníze od roku 2031 platí týmy, týmy od roku 2032 snižují zbytečné hospitalizace, a teprve pak se od roku 2033 mění lůžka. Mezi kroky stojí čtyři kontrolní body {GATES.map((g) => g.id).join(", ")}.
      </div>
    </div>
  );
}

function FlowColumn({ title, items, total, note }: { title: string; items: { g: string; v: number; c: string }[]; total: number; note: string }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{title}</div>
      <div className="flex h-[300px] flex-col gap-[2px]">
        {items.map((it) => (
          <div key={it.g} className="flex items-center justify-between rounded px-3 text-xs" style={{ flex: it.v, background: it.c, color: "#fff", minHeight: 22 }} title={`${it.g}: ${csNumber(it.v)} mld. Kč`}>
            <span className="truncate">{it.g}</span>
            <span className="ml-2 shrink-0 tabular-nums">{csNumber(it.v)}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm"><b>{csNumber(total)} mld. Kč</b> <span className="text-muted">{note}</span></div>
    </div>
  );
}

/** Odkud peníze přicházejí a kam jdou (2038). */
export function MoneyFlow() {
  const sources = FUND_GROUPS.map((g, i) => ({ g, v: FUNDING.rows.filter((r) => r.group === g).reduce((a, r) => a + r.value, 0), c: SERIES[i] }));
  const uses = COST_GROUPS.map((g, i) => ({ g, v: COST_2038.rows.filter((r) => r.group === g).reduce((a, r) => a + r.value, 0), c: SERIES[i] }));
  const sTotal = sources.reduce((a, s) => a + s.v, 0);
  const uTotal = uses.reduce((a, s) => a + s.v, 0);
  return (
    <div className="grid items-start gap-4 md:grid-cols-[1fr_auto_1fr]">
      <FlowColumn title="Odkud peníze přijdou" items={sources} total={sTotal} note="ročně" />
      <div className="hidden flex-col items-center justify-center self-center text-center md:flex">
        <div className="text-3xl text-muted">→</div>
        <div className="mt-1 text-xs text-muted">21,5 mld. Kč čistě<br />= provoz 22,8 − úspory 1,2</div>
      </div>
      <FlowColumn title="Na co půjdou" items={uses} total={uTotal} note="provoz včetně rezervy" />
    </div>
  );
}

/** Deset klíčových organizací; podporu potřebujeme od šesti. */
export function SupportMeter() {
  return (
    <div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {KEY_SUBJECTS.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-1 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold" style={{ background: i < 6 ? SERIES[2] : "#e7e5df", color: i < 6 ? "#fff" : INK.secondary }}>{i + 1}</div>
            <div className="text-[10px] leading-tight text-muted">{s}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">Do června 2028 potřebujeme písemnou podporu jádra plánu od aspoň <b className="text-foreground">6 z těchto 10</b> organizací. Bez nich se plán neprosadí ani s vládní většinou.</p>
    </div>
  );
}

/** Zkrácený pruh fází pro úvodní stránku. */
export function PhasesStrip() {
  const X0 = 2026.7, X1 = 2039;
  const pct = (y: number) => ((y - X0) / (X1 - X0)) * 100;
  return (
    <div>
      <div className="relative h-9 w-full overflow-hidden rounded-lg bg-stone-100">
        {PHASES.map((p, i) => (
          <div key={p.id} className="absolute top-0 flex h-full items-center justify-center text-[11px] font-semibold text-stone-800" style={{ left: `${pct(p.from)}%`, width: `${pct(p.to) - pct(p.from)}%`, background: `rgba(42,120,214,${0.12 + i * 0.1})` }} title={p.text}>
            <span className="truncate px-1">{p.id} {p.name}</span>
          </div>
        ))}
        {GATES.map((g) => (
          <div key={g.id} className="absolute top-0 h-full w-[3px]" style={{ left: `${pct(g.at)}%`, background: SERIES[1] }} title={`${g.id} ${g.name}`} />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-muted"><span>2027</span><span>2029 volby</span><span>2031 peníze</span><span>2032 zákon</span><span>2038</span></div>
    </div>
  );
}
