import { CHAINS, COST_2038, COST_GROUPS, FUNDING, FUND_GROUPS, GATES } from "@/content/reforma";
import { INK, MUTED_MARK, SERIES, csNumber } from "@/components/charts/theme";
import { Waffle } from "@/components/web/blocks";

/* Vizuály bez knihovny: čisté HTML a SVG, vykreslené na serveru, v tokenech směru B. */

export function TeamOrganigram() {
  const roles = ["2 sestry na lékaře", "Nutriční terapeut", "Fyzioterapeut", "Psycholog", "Recepce a zapisovatel", "Návštěvy doma, senior taxi"];
  return (
    <figure className="flex flex-col items-center gap-5" aria-label="Schéma týmu sdružené péče: lékař a sestra uprostřed, kolem další profese">
      <div className="flex min-h-[132px] w-[220px] flex-col items-center justify-center rounded-full bg-forest px-6 text-center text-on-dark">
        <span className="font-serif text-[22px] font-semibold leading-tight">Váš lékař</span>
        <span className="font-serif text-[22px] font-semibold leading-tight">a vaše sestra</span>
      </div>
      <span aria-hidden className="h-6 w-0.5 bg-line-strong" />
      <ul className="flex flex-wrap justify-center gap-2.5">
        {roles.map((r) => (
          <li key={r} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-paper px-4 text-[16px] font-semibold text-ink">
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-sage" />
            {r}
          </li>
        ))}
      </ul>
      <figcaption className="text-center text-[16px] text-muted">Jeden tým pro 10 až 25 tisíc lidí · smlouva s pojišťovnou na 5 let</figcaption>
    </figure>
  );
}

/** Tři kategorie naléhavosti v elektronické žádance. */
export function TriageLanes() {
  const lanes = [
    { l: "Urgentní", t: "termín do 2 týdnů", w: 0.18, c: SERIES[1] },
    { l: "Do 6 týdnů", t: "termín do 6 týdnů", w: 0.5, c: SERIES[0] },
    { l: "Plánované", t: "termín podle kapacity, čekání se měří", w: 0.92, c: MUTED_MARK },
  ];
  return (
    <div className="flex flex-col gap-4 font-sans">
      {lanes.map((x) => (
        <div key={x.l}>
          <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 text-[17px]">
            <span className="font-bold text-ink">{x.l}</span>
            <span className="text-[16px] text-muted">{x.t}</span>
          </div>
          <div className="h-[22px] w-full rounded-[4px]" style={{ background: INK.grid }}>
            <div className="h-full" style={{ width: `${x.w * 100}%`, background: x.c, borderRadius: "0 4px 4px 0" }} />
          </div>
        </div>
      ))}
      <p className="text-[16px] leading-relaxed text-muted">Naléhavost určí lékař, ne úřad ani pojišťovna. Bez žádanky lze jít dál. Kdo lhůtu nedodrží, je poskytovatel, pacient nikdy.</p>
    </div>
  );
}

/** 100 čtverečků = 48 036 akutních lůžek; 17 z nich změní účel (8 000). */
export function BedWaffle() {
  const change = Math.round((8000 / 48036) * 100);
  return (
    <div className="flex flex-col gap-4">
      <Waffle
        label={`Sto čtverečků představuje 48 036 akutních lůžek. ${change} z nich změní do roku 2038 účel, to je 8 000 lůžek.`}
        groups={[
          { value: 100 - change, color: SERIES[0], label: "zůstávají akutní: asi 40 000 lůžek" },
          { value: change, color: SERIES[1], label: "změní účel do roku 2038: 8 000 lůžek" },
        ]}
        cell={26}
      />
      <p className="text-[16px] leading-relaxed text-muted">Jeden čtvereček je asi 480 lůžek. Ze 4,4 lůžka na 1 000 obyvatel na 3,7. Lůžko se nezmění dřív, než kraj doloží náhradu a dojezd záchranky.</p>
    </div>
  );
}

/** Tři řetězce, které na sebe navazují, a kontrolní body mezi nimi. */
export function ChainsDiagram() {
  return (
    <div className="flex flex-col gap-6">
      {CHAINS.map((ch) => (
        <div key={ch.id} className="grid gap-3 md:grid-cols-[160px_1fr] md:items-center">
          <div className="flex items-center gap-2.5 text-[18px] font-bold text-ink">
            <span aria-hidden className="inline-block h-3.5 w-3.5 rounded-[3px]" style={{ background: SERIES[ch.color] }} />
            {ch.name}
          </div>
          <ol className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
            {ch.steps.map((s, i) => (
              <li key={s.label} className="flex items-stretch gap-2">
                <div className="min-w-[160px] flex-1 rounded-card border border-line bg-paper px-4 py-3" style={{ borderTopColor: SERIES[ch.color], borderTopWidth: 4 }}>
                  <div className="text-[17px] leading-snug text-ink">{s.label}</div>
                  <div className="mt-0.5 text-[15px] text-muted">{s.when}</div>
                </div>
                {i < ch.steps.length - 1 && (
                  <span aria-hidden className="hidden self-center text-[22px] text-muted sm:block">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      ))}
      <p className="rounded-card bg-sand px-5 py-4 text-[17px] leading-relaxed text-ink-2">
        Každá šipka znamená „bez A nejde B“: peníze od roku 2031 platí týmy, týmy od roku 2032 snižují zbytečné hospitalizace, a teprve pak se od roku 2033 mění lůžka. Mezi kroky stojí čtyři kontrolní body {GATES.map((g) => g.id).join(", ")}.
      </p>
    </div>
  );
}

function FlowColumn({ title, items, total, note }: { title: string; items: { g: string; v: number; c: string }[]; total: number; note: string }) {
  return (
    <div className="flex flex-col">
      <h3 className="mb-3 text-[15px] font-bold uppercase tracking-[0.06em] text-forest">{title}</h3>
      <ul className="flex flex-col gap-[2px]">
        {items.map((it, i) => (
          <li key={it.g} className="flex items-stretch gap-3" style={{ minHeight: Math.max(44, it.v * 14) }}>
            <span aria-hidden className="w-6 shrink-0" style={{ background: it.c, borderRadius: i === 0 ? "4px 4px 0 0" : i === items.length - 1 ? "0 0 4px 4px" : undefined }} />
            <span className="flex flex-1 items-center justify-between gap-3 border-b border-line py-1.5 text-[17px]">
              <span className="text-ink">{it.g}</span>
              <span className="shrink-0 font-semibold tabular-nums text-ink">{csNumber(it.v)} mld. Kč</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-[17px]">
        <span className="font-serif text-[24px] font-semibold text-ink">{csNumber(total)} mld. Kč</span> <span className="text-muted">{note}</span>
      </div>
    </div>
  );
}

/** Odkud peníze přicházejí a kam jdou (2038). Barvy jen ve vzorcích, text v inkoustu. */
export function MoneyFlow() {
  const sources = FUND_GROUPS.map((g, i) => ({ g, v: FUNDING.rows.filter((r) => r.group === g).reduce((a, r) => a + r.value, 0), c: SERIES[i] }));
  const uses = COST_GROUPS.map((g, i) => ({ g, v: COST_2038.rows.filter((r) => r.group === g).reduce((a, r) => a + r.value, 0), c: SERIES[i] }));
  const sTotal = sources.reduce((a, s) => a + s.v, 0);
  const uTotal = uses.reduce((a, s) => a + s.v, 0);
  return (
    <div className="grid items-start gap-8 font-sans md:grid-cols-[1fr_auto_1fr]">
      <FlowColumn title="Odkud peníze přijdou" items={sources} total={sTotal} note="ročně" />
      <div className="flex flex-row items-center gap-3 self-center text-center md:flex-col">
        <span aria-hidden className="text-[32px] leading-none text-forest">
          <span className="md:hidden">↓</span>
          <span className="hidden md:inline">→</span>
        </span>
        <span className="text-[15px] leading-snug text-muted">
          21,5 mld. Kč čistě
          <br />= provoz 22,8 − úspory 1,2
        </span>
      </div>
      <FlowColumn title="Na co půjdou" items={uses} total={uTotal} note="provoz včetně rezervy" />
    </div>
  );
}

