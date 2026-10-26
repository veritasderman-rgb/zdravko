import { ChartFrame } from "@/components/charts/chart-frame";
import { DataTable } from "@/components/charts/data-table";
import { BAR, INK, MUTED_MARK, SERIES, csNumber } from "@/components/charts/theme";
import { SPENDING_SHARE } from "@/content/reforma";
import { AVOIDABLE_GAP, GP_AGE, INSURANCE_BALANCE, LTC_BEDS, SPENDING_SEGMENTS } from "@/content/figures/charts";
import { Reveal } from "../reveal";
import { HBars, Legend, Note, PanelTitle, Swatch, anim, niceTicks, pct } from "./primitives";

/* Obrázky Části I studie (Proč reforma): výdaje, praktici, odvratitelné hospitalizace,
   dlouhodobá péče, hospodaření pojištění. Čisté HTML, vykreslené na serveru. */

// ---------------------------------------------------------------------------
// 1. Úhrady podle segmentů 2024 (ř. 227)
// ---------------------------------------------------------------------------
const segColor = (r: (typeof SPENDING_SEGMENTS.rows)[number]) => ("emphasis" in r ? SERIES[r.emphasis] : MUTED_MARK);

export function SpendingSegmentsFigure() {
  const rows = SPENDING_SEGMENTS.rows;
  const acute = rows[0].value;
  const gp = rows.find((r) => r.key === "gp")!.value;
  return (
    <ChartFrame
      title={SPENDING_SHARE.title}
      subtitle={`Podíl na úhradách zdravotních pojišťoven v roce 2024, v %. Celý lůžkový segment včetně nemocničních ambulancí a centrových léčiv čerpá ${pct(SPENDING_SEGMENTS.inpatientTotal)}.`}
      source="ÚZIS, NRHZS OIS-11-24 (verze 2026-01), úhrady 7 pojišťoven za rok 2024 z pololetní dodávky; praktici: ÚZIS 2024. „Ostatní“ a „zbytek“ jsou dopočet do celku."
      table={
        <DataTable
          header={["Segment", "Podíl na úhradách 2024 (%)", "V lůžkovém segmentu"]}
          rows={[
            ...rows.map((r) => [r.label, csNumber(r.value), r.inpatient ? "ano" : "ne"]),
            ["Lůžkový segment celkem", csNumber(SPENDING_SEGMENTS.inpatientTotal), "—"],
          ]}
        />
      }
    >
      <Reveal>
        <div className="font-sans">
          {/* závorka nad lůžkovým segmentem */}
          <div className="mb-1 text-[14px] font-semibold text-ink" style={{ width: `${SPENDING_SEGMENTS.inpatientTotal}%`, ...anim(0) }} data-anim>
            <span className="block text-center">Lůžkový segment {pct(SPENDING_SEGMENTS.inpatientTotal)}</span>
            <span aria-hidden className="mt-1 block h-2 border-x-2 border-t-2" style={{ borderColor: INK.secondary }} />
          </div>
          <div
            data-anim="grow"
            className="flex w-full gap-[2px]"
            style={{ ...anim(1), height: BAR.size + 6 }}
            role="img"
            aria-label={rows.map((r) => `${r.label}: ${pct(r.value)}`).join("; ")}
          >
            {rows.map((r, i) => (
              <span
                key={r.key}
                title={`${r.label}: ${pct(r.value)}`}
                className="block h-full"
                style={{ flex: `${r.value} 1 0`, background: segColor(r), borderRadius: i === rows.length - 1 ? `0 ${BAR.radius}px ${BAR.radius}px 0` : undefined }}
              />
            ))}
          </div>
          <ul className="mt-5 flex flex-col text-[16px] md:text-[17px]">
            {rows.map((r, i) => (
              <li key={r.key} data-anim style={anim(2 + i)} className="flex items-baseline gap-3 border-t border-line py-2">
                <Swatch color={segColor(r)} />
                <span className={`flex-1 ${"emphasis" in r ? "font-semibold text-ink" : "text-ink-2"}`}>{r.label}</span>
                <span className="font-semibold tabular-nums text-ink">{pct(r.value)}</span>
              </li>
            ))}
          </ul>
          <Note>
            Akutní lůžková péče ({pct(acute)}, asi {SPENDING_SEGMENTS.acuteBn} mld. Kč) dostává {csNumber(acute / gp, 1)}krát víc než praktici pro dospělé ({pct(gp)}). Cílem studie je podíl akutní lůžkové péče 26 % kolem roku 2038; sledujeme ho spolu s podílem nemocničních ambulancí, aby nešel splnit přeúčtováním.
          </Note>
        </div>
      </Reveal>
    </ChartFrame>
  );
}

// ---------------------------------------------------------------------------
// 2. Věk praktiků (ř. 241)
// ---------------------------------------------------------------------------
export function GpAgeFigure() {
  const over = GP_AGE.over60;
  const under = Math.round((100 - over) * 10) / 10;
  const overN = Math.round((GP_AGE.doctors * over) / 100 / 10) * 10;
  const parts = [
    { label: "Mladší 60 let", value: under, color: MUTED_MARK },
    { label: "60 let a starší", value: over, color: SERIES[0] },
  ];
  return (
    <ChartFrame
      title="Téměř polovina praktiků pro dospělé je starší 60 let"
      subtitle={`Aktivní lékaři oboru všeobecné praktické lékařství v ambulantní péči (${csNumber(GP_AGE.doctors, 0)}), podíl podle věku v %`}
      source="ÚZIS, NRZP a NRHZS, stav k 31. 3. 2023 (M. Matějková, Praktické lékařství v České republice, FaF UK 2024)"
      table={
        <DataTable
          header={["Věk", "Podíl (%)", "Lékařů (dopočet)"]}
          rows={[
            ["Mladší 60 let", csNumber(under), `asi ${csNumber(GP_AGE.doctors - overN, 0)}`],
            ["60 let a starší", csNumber(over), `asi ${csNumber(overN, 0)}`],
            ["Celkem", "100", csNumber(GP_AGE.doctors, 0)],
          ]}
        />
      }
    >
      <Reveal>
        <div className="font-sans">
          <div data-anim className="mb-4 flex flex-wrap items-baseline gap-x-3" style={anim(0)}>
            <span className="font-serif text-[40px] font-semibold leading-none text-ink">{pct(over)}</span>
            <span className="text-[17px] text-ink-2">tedy asi {csNumber(overN, 0)} z {csNumber(GP_AGE.doctors, 0)} lékařů oboru</span>
          </div>
          <div data-anim="grow" className="flex w-full gap-[2px]" style={{ ...anim(1), height: BAR.size + 6 }} role="img" aria-label={parts.map((p) => `${p.label}: ${pct(p.value)}`).join("; ")}>
            {parts.map((p, i) => (
              <span key={p.label} title={`${p.label}: ${pct(p.value)}`} className="block h-full" style={{ flex: `${p.value} 1 0`, background: p.color, borderRadius: i === parts.length - 1 ? `0 ${BAR.radius}px ${BAR.radius}px 0` : undefined }} />
            ))}
          </div>
          <div className="mt-2 flex text-[15px] text-ink-2">
            {parts.map((p) => (
              <span key={p.label} className="flex items-center gap-2" style={{ flex: `${p.value} 1 0` }}>
                <Swatch color={p.color} />
                <span>
                  {p.label} <span className="font-semibold tabular-nums text-ink">{pct(p.value)}</span>
                </span>
              </span>
            ))}
          </div>
          <Note>
            Ročně atestuje {GP_AGE.attestLow} až {GP_AGE.attestHigh} nových praktiků, odchází jich víc. Graf zahrnuje všechny aktivní lékaře oboru, i ty, kteří nejsou registrujícími praktiky; registrujících praktiků pro dospělé je asi 5 500. Podíly užších pásem 60–64, 65–69 a 70+ text studie neuvádí, proto ukazujeme skupinu 60+ jako celek.
          </Note>
        </div>
      </Reveal>
    </ChartFrame>
  );
}

// ---------------------------------------------------------------------------
// 3. Odvratitelné hospitalizace a úmrtnost (ř. 259)
// ---------------------------------------------------------------------------
export function AvoidableGapFigure() {
  const rows = AVOIDABLE_GAP.map((r) => ({ ...r, ex: r.excess ?? Math.round(((r.cz! / r.ref!) - 1) * 100) })).sort((a, b) => b.ex - a.ex);
  const { lo, hi, ticks } = niceTicks(0, Math.max(...rows.map((r) => r.ex)));
  return (
    <ChartFrame
      title="Nejvíc zaostáváme u nemocí, o kterých rozhoduje péče o chroniky: úmrtnost na diabetes je dvojnásobná"
      subtitle="O kolik procent je Česko nad průměrem EU (úmrtnost, standardizovaná) nebo OECD (odvratitelné hospitalizace)"
      source="Eurostat hlth_cd_asdr2 a hlth_cd_apr (2023, standardizace ESP 2013); odvratitelné hospitalizace (ACSC): OECD Health at a Glance 2025, období 2021/2022, standardizace na populaci OECD 15+"
      table={
        <DataTable
          header={["Ukazatel", "Česko", "Srovnání", "Rozdíl", "Zdroj"]}
          rows={rows.map((r) => [
            r.label,
            r.cz != null ? csNumber(r.cz) : "neuvedeno",
            r.ref != null ? `${r.refLabel} ${csNumber(r.ref)}` : r.refLabel,
            `+${csNumber(r.ex, 0)} %`,
            r.source,
          ])}
        />
      }
    >
      <Reveal>
        <div className="font-sans">
          <Legend
            items={[
              { label: "nemoci, o jejichž průběhu rozhoduje soustavná péče o chroniky", color: SERIES[0] },
              { label: "souhrnné ukazatele", color: MUTED_MARK },
            ]}
          />
          <HBars
            lo={lo}
            hi={hi}
            ticks={ticks}
            fmt={(t) => (t === 0 ? "0" : `+${csNumber(t, 0)} %`)}
            rows={rows.map((r) => ({
              label: (
                <>
                  {r.label}
                  {r.cz != null && r.ref != null && (
                    <span className="text-[15px] text-muted">
                      {" "}
                      · {csNumber(r.cz)} proti {csNumber(r.ref)} ({r.refLabel}) {r.unit}
                    </span>
                  )}
                </>
              ),
              value: r.ex,
              color: r.chronic ? SERIES[0] : MUTED_MARK,
              text: `+${csNumber(r.ex, 0)} %`,
              title: `${r.label}: o ${csNumber(r.ex, 0)} % víc než ${r.refLabel}`,
              strong: r.chronic,
            }))}
          />
          <Note>U kardiovaskulárních nemocí uvádí studie jen rozdíl (+48 %) bez absolutních hodnot. Česká akutní kardiologie přitom nezaostává; odstup vzniká v soustavné péči.</Note>
        </div>
      </Reveal>
    </ChartFrame>
  );
}

// ---------------------------------------------------------------------------
// 4. Lůžka dlouhodobé péče (ř. 293)
// ---------------------------------------------------------------------------
export function LtcBedsFigure() {
  const d = LTC_BEDS;
  const short = Math.round((1 - d.czPer1000 / d.europePer1000) * 100);
  const a = niceTicks(0, d.europePer1000);
  const b = niceTicks(0, d.needPerYear);
  return (
    <ChartFrame
      title={`Lůžek dlouhodobé péče máme o ${short} % méně než srovnatelné evropské země a přibývají pomaleji, než je potřeba`}
      subtitle="Vlevo lůžka v zařízeních na 1 000 lidí nad 65 let; vpravo nová lůžka dlouhodobé a následné péče za rok"
      source="OECD Health Statistics, DF_HEALTH_LTCR_BED (2024); srovnání: Eurostat hlth_rs_bdsns (HP.2), 2019/2020; potřeba: Přecechtěl a Hlávka, Studie efektivního zdravotnictví, 2025. Řada zahrnuje sociální pobytové služby i lůžka následné a dlouhodobé zdravotní péče."
      table={
        <DataTable
          header={["Ukazatel", "Hodnota"]}
          rows={[
            ["Lůžka na 1 000 lidí 65+, Česko 2024", csNumber(d.czPer1000)],
            ["Lůžka na 1 000 lidí 65+, srovnatelné evropské země (2019/2020)", `asi ${csNumber(d.europePer1000, 0)}`],
            ["Potřeba nových lůžek do roku 2035", `asi ${csNumber(d.needBy2035, 0)}`],
            ["Potřebné tempo, lůžek ročně", `asi ${csNumber(d.needPerYear, 0)}`],
            ["Skutečně vzniklo v roce 2022", csNumber(d.built2022, 0)],
          ]}
        />
      }
    >
      <Reveal>
        <div className="grid gap-8 font-sans md:grid-cols-2">
          <div>
            <PanelTitle>Lůžka na 1 000 lidí nad 65 let</PanelTitle>
            <HBars
              lo={a.lo}
              hi={a.hi}
              ticks={a.ticks}
              fmt={(t) => csNumber(t, 0)}
              rows={[
                { label: "Česko, 2024", value: d.czPer1000, color: SERIES[0], text: csNumber(d.czPer1000), title: `Česko 2024: ${csNumber(d.czPer1000)}`, strong: true },
                { label: "Srovnatelné evropské země", value: d.europePer1000, color: MUTED_MARK, text: `asi ${csNumber(d.europePer1000, 0)}`, title: `Srovnatelné evropské země: asi ${d.europePer1000}` },
              ]}
            />
          </div>
          <div>
            <PanelTitle>Nová lůžka za rok</PanelTitle>
            <HBars
              start={2}
              lo={b.lo}
              hi={b.hi}
              ticks={b.ticks}
              fmt={(t) => csNumber(t, 0)}
              rows={[
                { label: "Potřebné tempo do roku 2035", value: d.needPerYear, color: MUTED_MARK, text: `asi ${csNumber(d.needPerYear, 0)}`, title: `Potřeba: asi ${csNumber(d.needPerYear, 0)} lůžek ročně` },
                { label: "Skutečně vzniklo v roce 2022", value: d.built2022, color: SERIES[0], text: csNumber(d.built2022, 0), title: `Vzniklo 2022: ${csNumber(d.built2022, 0)}`, strong: true },
              ]}
            />
          </div>
        </div>
        <Note>
          Lůžek za deset let přibylo, seniorů ale rychleji. Do roku 2035 bude potřeba zhruba {csNumber(d.needBy2035, 0)} nových lůžek dlouhodobé a následné péče, o 53 % víc než v roce 2021.
        </Note>
      </Reveal>
    </ChartFrame>
  );
}

// ---------------------------------------------------------------------------
// 5. Hospodaření zdravotního pojištění (ř. 307)
// ---------------------------------------------------------------------------
export function InsuranceBalanceFigure() {
  const d = INSURANCE_BALANCE;
  const a = niceTicks(0, d.plan2026.spending, 3);
  const b = niceTicks(0, d.funds[0].value, 4);
  return (
    <ChartFrame
      title="Pojištění je ve schodku a zůstatky na účtech pojišťoven klesly pod jeden měsíc výdajů"
      subtitle="Vlevo zdravotně pojistné plány na rok 2026, vpravo zůstatky na účtech všech sedmi pojišťoven; mld. Kč"
      source="Zdravotně pojistné plány pojišťoven a jejich hodnocení MZ; rok 2026 = schválené plány (sněmovní tisk 280/0). Zůstatek fondů: důvodová zpráva k tisku 235."
      table={
        <DataTable
          header={["Ukazatel", "mld. Kč"]}
          rows={[
            ["Příjmy 2026 (plán)", csNumber(d.plan2026.revenue)],
            ["Výdaje 2026 (plán)", csNumber(d.plan2026.spending)],
            ["Schodek 2026 (plán)", csNumber(d.plan2026.deficit)],
            ...d.funds.map((f) => [`Zůstatky na účtech, ${f.label.toLowerCase()}`, csNumber(f.value)]),
            ["Měsíční výdaje systému (pro měřítko)", `asi ${csNumber(d.monthlySpending, 0)}`],
          ]}
        />
      }
    >
      <Reveal>
        <div className="grid gap-8 font-sans md:grid-cols-2">
          <div>
            <PanelTitle>Plán na rok 2026</PanelTitle>
            <HBars
              lo={a.lo}
              hi={a.hi}
              ticks={a.ticks}
              fmt={(t) => csNumber(t, 0)}
              rows={[
                { label: "Příjmy", value: d.plan2026.revenue, color: MUTED_MARK, text: csNumber(d.plan2026.revenue), title: `Příjmy 2026: ${csNumber(d.plan2026.revenue)} mld. Kč` },
                { label: "Výdaje", value: d.plan2026.spending, color: SERIES[0], text: csNumber(d.plan2026.spending), title: `Výdaje 2026: ${csNumber(d.plan2026.spending)} mld. Kč`, strong: true },
              ]}
            />
            <p data-anim style={anim(2)} className="mt-3 text-[16px] text-ink">
              Schodek <span className="font-semibold tabular-nums">{csNumber(d.plan2026.deficit)} mld. Kč</span>; pojištění je ve schodku od roku 2023.
            </p>
          </div>
          <div>
            <PanelTitle>Zůstatky na účtech pojišťoven</PanelTitle>
            <HBars
              start={3}
              lo={b.lo}
              hi={b.hi}
              ticks={b.ticks}
              fmt={(t) => csNumber(t, 0)}
              rows={[
                ...d.funds.map((f, i) => ({
                  label: f.label,
                  value: f.value,
                  color: i === d.funds.length - 1 ? SERIES[0] : MUTED_MARK,
                  text: csNumber(f.value),
                  title: `${f.label}: ${csNumber(f.value)} mld. Kč`,
                  strong: i === d.funds.length - 1,
                })),
                {
                  label: <span className="italic">Pro měřítko: výdaje systému za jeden měsíc</span>,
                  value: d.monthlySpending,
                  color: INK.axis,
                  text: `asi ${csNumber(d.monthlySpending, 0)}`,
                  title: `Měsíční výdaje systému: asi ${d.monthlySpending} mld. Kč`,
                },
              ]}
            />
          </div>
        </div>
      </Reveal>
    </ChartFrame>
  );
}
