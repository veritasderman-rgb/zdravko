import type { ReactNode } from "react";
import { ChartFrame } from "@/components/charts/chart-frame";
import { DataTable } from "@/components/charts/data-table";
import { BAR, INK, MUTED_MARK, SERIES, csNumber } from "@/components/charts/theme";
import { MoneyFlow } from "@/components/web/visuals";
import { MODEL_NOTE } from "@/content/cisla";
import { COST_2038, COST_GROUPS, FUNDING, FUND_GROUPS, TAXES, VARIANTS } from "@/content/reforma";
import { HEALTH_TAX_SPLIT, SENSITIVITY, VARIANT_EXTRA } from "@/content/figures/charts";
import { Reveal } from "../reveal";
import { AxisLabels, GridLines, Legend, Note, PanelTitle, Swatch, anim } from "./primitives";

/* Obrázky Části III a V studie: daně za zdraví, citlivost, varianty, tok peněz. */

const pos = (v: number, lo: number, hi: number) => ((v - lo) / (hi - lo)) * 100;

/** Jeden vodorovný pruh složený ze segmentů na společné ose 0…hi. */
function StackRow({ parts, hi, i, text, label }: { parts: { value: number; color: string; title: string }[]; hi: number; i: number; text: string; label: ReactNode }) {
  const total = parts.reduce((a, p) => a + p.value, 0);
  return (
    <li className="flex flex-col gap-1">
      <span className="text-[16px] font-semibold leading-snug text-ink md:text-[17px]">{label}</span>
      <span className="relative block" style={{ height: BAR.size }}>
        <span data-anim="grow" className="absolute inset-y-0 left-0 flex gap-[2px]" style={{ ...anim(i), width: `${pos(total, 0, hi)}%` }}>
          {parts.map((p, j) => (
            <span key={j} title={p.title} className="block h-full" style={{ flex: `${p.value} 1 0`, background: p.color, borderRadius: j === parts.length - 1 ? `0 ${BAR.radius}px ${BAR.radius}px 0` : undefined }} />
          ))}
        </span>
        <span className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-2 text-[15px] font-semibold tabular-nums text-ink" style={{ left: `${pos(total, 0, hi)}%` }}>
          {text}
        </span>
      </span>
    </li>
  );
}

// ---------------------------------------------------------------------------
// 7. Pravidlo rozdělení daní za zdraví (ř. 1066)
// ---------------------------------------------------------------------------
export function HealthTaxSplitFigure() {
  const d = HEALTH_TAX_SPLIT;
  const hi = Math.max(...d.scenarios.map((s) => s.total));
  const ticks = Array.from({ length: hi + 1 }, (_, i) => i);
  /** 100 Kč měsíčně na státního pojištěnce = 7,2 mld. Kč ročně (6,0 mil. státních pojištěnců). */
  const perMonth = (bnKc: number) => Math.round((bnKc * 1e9) / (TAXES.statePayees * 1e6 * 12) / 10) * 10;
  const rows = d.scenarios.map((s) => {
    const fund = Math.round(Math.max(d.fund, s.total * d.peerShare) * 10) / 10;
    const rest = Math.round((s.total - fund) * 10) / 10;
    return { ...s, fund, rest, share: Math.round((fund / s.total) * 100), kc: perMonth(rest) };
  });
  const colors = { fund: SERIES[0], rest: SERIES[1] };
  return (
    <ChartFrame
      title="Prevence dostane nejméně 40 % výnosu daní za zdraví, vždy aspoň 2 mld. Kč; zbytek zvýší platbu státu do pojištění"
      subtitle="Rozdělení ročního výnosu daní za zdraví v plném náběhu, mld. Kč: plánovací výnos 5 mld. Kč, horní hranice rozpětí 7 mld. Kč a dolní mez cíle PEER 10 mld. Kč"
      source="Studie v3.1, Část III (pilíř 4 a P4) a Hospodářská strategie PEER, kap. 1.4; 100 Kč měsíčně na státního pojištěnce odpovídá 7,2 mld. Kč ročně (6,0 mil. státních pojištěnců)"
      table={
        <DataTable
          header={["Scénář", "Výnos (mld. Kč)", "Fond prevence", "Platba státu do pojištění", "Navíc na státního pojištěnce"]}
          rows={rows.map((r) => [r.label, csNumber(r.total), `${csNumber(r.fund)} (${r.share} %)`, csNumber(r.rest), `asi ${r.kc} Kč měsíčně`])}
        />
      }
    >
      <Reveal>
        <div className="font-sans">
          <p data-anim style={anim(0)} className="mb-5 rounded-card bg-sand px-4 py-3 text-[16px] leading-relaxed text-ink">
            <span className="font-semibold">Pravidlo v zákoně o fondu (podle Hospodářské strategie PEER):</span> Fond prevence zdravotních pojišťoven dostane nejméně 40 % výnosu, vždy aspoň {csNumber(d.fund)} mld. Kč ročně (valorizovaně); zbytek zvyšuje platbu státu za státní pojištěnce. Odvody z práce se nesnižují.
          </p>
          <Legend
            items={[
              { label: "Fond prevence", color: colors.fund },
              { label: "platba státu do zdravotního pojištění", color: colors.rest },
            ]}
          />
          <div className="relative pr-[5.5rem]">
            <GridLines ticks={ticks} lo={0} hi={hi} />
            <ul className="relative flex flex-col gap-5">
              {rows.map((r, i) => (
                <StackRow
                  key={r.key}
                  i={i + 1}
                  hi={hi}
                  label={`${r.label}: ${csNumber(r.total)} mld. Kč`}
                  text={csNumber(r.total)}
                  parts={[
                    { value: r.fund, color: colors.fund, title: `Fond prevence: ${csNumber(r.fund)} mld. Kč (${r.share} %)` },
                    { value: r.rest, color: colors.rest, title: `Platba státu do pojištění: ${csNumber(r.rest)} mld. Kč` },
                  ]}
                />
              ))}
            </ul>
            <AxisLabels ticks={ticks} lo={0} hi={hi} fmt={(t) => csNumber(t, 0)} />
          </div>
          <ul className="mt-4 flex flex-col text-[16px]">
            {rows.map((r, i) => (
              <li key={r.key} data-anim style={anim(3 + i)} className="border-t border-line py-2 text-ink-2">
                <span className="font-semibold text-ink">{csNumber(r.total)} mld. Kč:</span> fond {csNumber(r.fund)} ({r.share} % výnosu), pojištění {csNumber(r.rest)}, tedy asi {r.kc} Kč měsíčně navíc za každého státního pojištěnce
              </li>
            ))}
          </ul>
          <Note>
            Při plánovací hodnotě kryjí 2 mld. Kč prevenci, se kterou počítá model (1,3 mld. Kč), a komunitní programy (0,7 mld. Kč). Částku nad 2 mld. Kč při vyšším výnosu přidělí rada fondu programům s doloženým účinkem; rozpočet reformy s ní zatím nepočítá.
          </Note>
        </div>
      </Reveal>
    </ChartFrame>
  );
}

// ---------------------------------------------------------------------------
// 8. Citlivost čistého nákladu 2038 (ř. 1379)
// ---------------------------------------------------------------------------
export function SensitivityFigure() {
  const d = SENSITIVITY;
  const lo = 12;
  const hi = 32;
  const ticks = [12, 16, 20, 24, 28, 32];
  const c = pos(d.central, lo, hi);
  const lower = SERIES[0];
  const higher = SERIES[1];
  let n = 0;
  return (
    <ChartFrame
      title="Čistý náklad v roce 2038 drží mezi 15 a 25 mld. Kč; víc ho posune souběh několika změn než jeden předpoklad"
      subtitle={`Čistý náklad reformy v roce 2038, mld. Kč ročně; svislá čára je základní odhad ${csNumber(d.central)} mld. Kč`}
      source={`${MODEL_NOTE} Monte Carlo 20 000 běhů s trojúhelníkovými rozděleními. Rozpětí jednotlivých předpokladů: podklad pro PEER, 20. 10. 2026.`}
      table={
        <DataTable
          header={["Rozpětí nebo scénář", "Čistý náklad 2038 (mld. Kč)"]}
          rows={[
            ["Základní odhad", csNumber(d.central)],
            ...d.ranges.map((r) => [r.label, `${csNumber(r.lo)} až ${csNumber(r.hi)}${r.midLabel ? ` (${r.midLabel})` : ""}`]),
            ...d.scenarios.map((s) => [`Scénář: ${s.label}`, csNumber(s.value)]),
          ]}
        />
      }
    >
      <Reveal>
        <div className="font-sans">
          <Legend
            items={[
              { label: "rozpětí", color: MUTED_MARK },
              { label: "scénář levnější než základ", color: lower },
              { label: "scénář dražší než základ", color: higher },
            ]}
          />
          <div className="relative">
            <GridLines ticks={ticks} lo={lo} hi={hi} right="0" />
            <span aria-hidden className="absolute inset-y-0 w-0" style={{ left: `${c}%`, borderLeft: `2px dashed ${INK.primary}` }} />
            <p className="relative mb-3 text-[14px] font-semibold text-ink" style={{ paddingLeft: `calc(${c}% + 6px)` }}>
              základ {csNumber(d.central)}
            </p>
            <PanelTitle>Rozpětí</PanelTitle>
            <ul className="relative flex flex-col gap-3.5">
              {d.ranges.map((r) => {
                const a = pos(r.lo, lo, hi);
                const b = pos(r.hi, lo, hi);
                const i = n++;
                const strong = r.key === "study";
                return (
                  <li key={r.key} className="flex flex-col gap-1">
                    <span className={`text-[16px] leading-snug md:text-[17px] ${strong ? "font-semibold text-ink" : "text-ink-2"}`}>
                      <span className="relative bg-paper box-decoration-clone">
                        {r.label}: <span className="font-semibold tabular-nums text-ink">{csNumber(r.lo)}–{csNumber(r.hi)}</span>
                        {r.midLabel && <span className="text-muted"> ({r.midLabel})</span>}
                      </span>
                    </span>
                    <span className="relative block" style={{ height: r.key === "extreme" ? 10 : BAR.size }}>
                      <span data-anim style={{ ...anim(i), left: `${a}%`, width: `${b - a}%`, background: r.key === "extreme" ? "transparent" : MUTED_MARK, borderRadius: BAR.radius }} className="absolute inset-y-0 block" title={`${r.label}: ${csNumber(r.lo)} až ${csNumber(r.hi)} mld. Kč`}>
                        {r.key === "extreme" && <span className="absolute inset-x-0 top-1/2 block h-0.5 -translate-y-1/2" style={{ background: INK.secondary }} />}
                        {r.key === "extreme" && <span className="absolute inset-y-0 left-0 block w-0.5" style={{ background: INK.secondary }} />}
                        {r.key === "extreme" && <span className="absolute inset-y-0 right-0 block w-0.5" style={{ background: INK.secondary }} />}
                      </span>
                      {r.mid != null && <span aria-hidden className="absolute -inset-y-1 w-0.5" style={{ left: `${pos(r.mid, lo, hi)}%`, background: INK.primary }} />}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6">
              <PanelTitle>Scénáře</PanelTitle>
            </div>
            <ul className="relative flex flex-col gap-3.5">
              {d.scenarios.map((s) => {
                const v = pos(s.value, lo, hi);
                const isLow = s.value < d.central;
                const a = Math.min(v, c);
                const b = Math.max(v, c);
                const i = n++;
                return (
                  <li key={s.label} className="flex flex-col gap-1">
                    <span className="text-[16px] leading-snug text-ink-2 md:text-[17px]">
                      <span className="relative bg-paper box-decoration-clone">{s.label}</span>
                    </span>
                    <span className="relative block" style={{ height: BAR.size }}>
                      <span
                        data-anim
                        className="absolute inset-y-0 block"
                        style={{ ...anim(i), left: `${a}%`, width: `${b - a}%`, background: isLow ? lower : higher, borderRadius: isLow ? `${BAR.radius}px 0 0 ${BAR.radius}px` : `0 ${BAR.radius}px ${BAR.radius}px 0` }}
                        title={`${s.label}: ${csNumber(s.value)} mld. Kč`}
                      />
                      <span className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[15px] font-semibold tabular-nums text-ink" style={isLow ? { right: `${100 - a}%`, paddingRight: 8 } : { left: `${b}%`, paddingLeft: 8 }}>
                        {csNumber(s.value)}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <AxisLabels ticks={ticks} lo={lo} hi={hi} fmt={(t) => csNumber(t, 0)} />
          </div>
          <Note>
            Svislá značka v pruhu Monte Carlo je medián. V simulaci vyšlo nad 25 mld. Kč méně než 0,1 % běhů. Nejvíc rozhoduje cena a počet personálu: každých 1 000 sester navíc nebo méně změní náklad asi o {csNumber(d.perThousandNurses)} mld. Kč ročně. Rozpis deseti předpokladů jednotlivě (tornádo) ve zveřejněném textu není; ukazujeme jejich souhrnné rozpětí.
          </Note>
        </div>
      </Reveal>
    </ChartFrame>
  );
}

// ---------------------------------------------------------------------------
// 9. Varianty A, B, C v roce 2038 (ř. 1387)
// ---------------------------------------------------------------------------
export function VariantsFigure() {
  const base = VARIANT_EXTRA.commonBase;
  const hi = 25;
  const ticks = [0, 5, 10, 15, 20, 25];
  return (
    <ChartFrame
      title="Plná varianta A stojí 21,5 mld. Kč ročně, varianta B bez center 17,8 a minimální C 11,3"
      subtitle={`Čistý náklad v roce 2038, mld. Kč ročně; všechny tři varianty mají stejný společný základ ${csNumber(base)} mld. Kč`}
      source={MODEL_NOTE}
      table={
        <DataTable
          numeric={false}
          header={["Varianta", "Čistý náklad (mld. Kč)", "Z toho společný základ", "Sester navíc 2038", "Investice (mld. Kč)", "Doba do plného účinku"]}
          rows={VARIANTS.rows.map((v) => [v.name, csNumber(v.cost), csNumber(base), v.nurses ? `asi ${csNumber(v.nurses, 0)}` : "0", v.invest, VARIANT_EXTRA.fullEffect[v.key] ?? "—"])}
        />
      }
    >
      <Reveal>
        <div className="font-sans">
          <Legend
            items={[
              { label: `společný základ ${csNumber(base)} (prevence, paliativa, konzultace, fond přeměny a další)`, color: MUTED_MARK },
              { label: "nad společný základ, čistě po úsporách", color: SERIES[0] },
            ]}
          />
          <div className="relative pr-[5.5rem]">
            <GridLines ticks={ticks} lo={0} hi={hi} />
            <ul className="relative flex flex-col gap-4">
              {VARIANTS.rows.map((v, i) => (
                <StackRow
                  key={v.key}
                  i={i}
                  hi={hi}
                  label={
                    <>
                      {v.name} <span className="font-normal text-muted">· {v.when}</span>
                    </>
                  }
                  text={csNumber(v.cost)}
                  parts={[
                    { value: base, color: MUTED_MARK, title: `Společný základ: ${csNumber(base)} mld. Kč` },
                    { value: Math.round((v.cost - base) * 10) / 10, color: SERIES[0], title: `Nad společný základ: ${csNumber(v.cost - base)} mld. Kč` },
                  ]}
                />
              ))}
            </ul>
            <AxisLabels ticks={ticks} lo={0} hi={hi} fmt={(t) => csNumber(t, 0)} />
          </div>
          <ul className="mt-5 flex flex-col text-[16px]">
            {VARIANT_EXTRA.diffs.map((d, i) => (
              <li key={d.from} data-anim style={anim(3 + i)} className="border-t border-line py-2 text-ink-2">
                <span className="font-semibold text-ink">
                  {d.from} proti {d.to}: asi {csNumber(d.value)} mld. Kč ročně
                </span>{" "}
                kupuje {d.buys}.
              </li>
            ))}
          </ul>
          <Note>{VARIANTS.note} Varianta B je záložní plán: když brána B3 v prosinci 2031 nebude splněna, reforma pokračuje jako B, ne od nuly.</Note>
        </div>
      </Reveal>
    </ChartFrame>
  );
}

// ---------------------------------------------------------------------------
// 11. Tok peněz na reformu 2038 (ř. 1444)
// ---------------------------------------------------------------------------
const sum = (rows: { value: number }[]) => rows.reduce((a, r) => a + r.value, 0);

export function MoneyFlowFigure() {
  const sources = FUND_GROUPS.map((g) => [`Odkud: ${g}`, csNumber(sum(FUNDING.rows.filter((r) => r.group === g)))]);
  const uses = COST_GROUPS.map((g) => [`Na co: ${g}`, csNumber(sum(COST_2038.rows.filter((r) => r.group === g)))]);
  return (
    <ChartFrame
      title="Většinu z 21,5 mld. Kč ročně zaplatí stát, daně za zdraví přinesou 5 mld. Kč"
      subtitle="Tok peněz v roce 2038, mld. Kč ročně: vlevo zdroje čistého nákladu, vpravo provoz včetně rezervy (22,8 mld. Kč před odečtením úspor 1,2)"
      source={`${FUNDING.source} ${COST_2038.source}.`}
      table={<DataTable header={["Skupina", "mld. Kč ročně"]} rows={[...sources, ...uses, ...FUNDING.rows.map((r) => [`Zdroj: ${r.label}`, csNumber(r.value)])]} />}
    >
      <Reveal>
        <div data-anim style={anim(0)}>
          <MoneyFlow />
        </div>
        <ul className="mt-6 flex flex-col font-sans text-[16px]">
          {FUNDING.rows.map((r, i) => (
            <li key={r.label} data-anim style={anim(1 + i)} className="flex items-baseline gap-3 border-t border-line py-2">
              <Swatch color={SERIES[FUND_GROUPS.indexOf(r.group)]} />
              <span className="flex-1 text-ink-2">{r.label}</span>
              <span className="font-semibold tabular-nums text-ink">{csNumber(r.value)}</span>
            </li>
          ))}
        </ul>
        <Note>Přes vyšší platbu za státní pojištěnce jde 13 mld. Kč, tedy asi 180 Kč měsíčně na osobu. Není to nový zdroj, ale přesun ze státního rozpočtu.</Note>
      </Reveal>
    </ChartFrame>
  );
}
