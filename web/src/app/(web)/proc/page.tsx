import { AVOIDABLE, BEDS, GAP, GP_DECLINE, NURSES, PREVENTION_FACTS, PROBLEM_FACTS, SPENDING_SHARE } from "@/content/reforma";
import { ChartFrame } from "@/components/charts/chart-frame";
import { DataTable } from "@/components/charts/data-table";
import { HBarChart } from "@/components/charts/hbar-chart";
import { GpDeclineChart } from "@/components/charts/gp-decline-chart";
import { GapChart } from "@/components/charts/gap-chart";
import { OccupancyMeters } from "@/components/charts/meters";
import { SERIES, csNumber } from "@/components/charts/theme";
import { Callout, NextStep, PageHero, Section } from "@/components/web/ui";
import { BigNumber, Waffle } from "@/components/web/blocks";

export const metadata = { title: "Proč měnit" };

/** Čísla, která vyprávějí: serifové číslo a jedna věta, oddělené linkou (ne mřížka malých karet). */
function Facts({ items }: { items: { value: string; label: string }[] }) {
  return (
    <ul className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f) => (
        <li key={f.value + f.label} className="flex flex-col gap-2 border-t border-line-strong py-6">
          <span className="font-serif text-[44px] font-semibold leading-none tracking-[-0.02em] text-ink [font-variant-numeric:lining-nums_tabular-nums] md:text-[56px]">{f.value}</span>
          <span className="text-[18px] leading-relaxed text-ink-2">{f.label}</span>
        </li>
      ))}
    </ul>
  );
}

function HeroAside() {
  return (
    <div className="flex flex-col gap-5">
      <p className="font-serif text-[44px] font-semibold leading-none tracking-[-0.02em] text-ink [font-variant-numeric:lining-nums_tabular-nums] md:text-[56px]">
        29,7 % <span className="text-[0.55em] font-normal italic text-muted">vs</span> 4,3 %
      </p>
      <p className="max-w-[26em] text-[18px] leading-relaxed text-ink-2">
        Z každých 100 Kč, které pojišťovny zaplatí, jde 29,70 Kč na akutní lůžka v nemocnicích a 4,30 Kč na praktické lékaře pro dospělé.
      </p>
      <Waffle
        label="Sto čtverečků představuje 100 Kč úhrad pojišťoven. 30 je modrých pro akutní lůžka, 4 oranžové pro praktiky pro dospělé, zbytek pro vše ostatní."
        groups={[
          { value: 29.7, color: SERIES[0], label: "akutní lůžka 29,7 %" },
          { value: 4.3, color: SERIES[1], label: "praktici pro dospělé 4,3 %" },
        ]}
        cell={26}
      />
      <p className="text-[15px] text-muted">Zdroj: {SPENDING_SHARE.source}</p>
    </div>
  );
}

export default function ProcPage() {
  return (
    <>
      <PageHero
        eyebrow="Proč"
        title="Peníze tečou tam, kde jsou postele, a ne tam, kde jsou lidé nejvíc nemocní."
        lead="Hodně věcí funguje a zachováme je: pojištění hradí 85 % výdajů na zdraví a jen půl procenta lidí říká, že se k potřebné péči nedostalo. Těžiště systému je ale v nemocnicích. A na to naráží stárnutí: lidí nad 85 let bude v roce 2050 půl milionu, dnes je jich 200 tisíc."
        aside={<HeroAside />}
      />

      <Section
        tone="paper"
        eyebrow="Kam jdou peníze"
        title="Na akutní lůžka jde téměř sedmkrát víc než na praktiky pro dospělé"
        lead="Ze 571 miliard, které pojišťovny ročně zaplatí, jde asi 170 miliard na akutní lůžka v nemocnicích. Ta jsou přitom obsazená jen z 56 %. Lůžka pro doléčení a rehabilitaci jsou naopak skoro plná."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartFrame
            title={SPENDING_SHARE.title}
            subtitle="Podíl na platbách zdravotních pojišťoven, v procentech"
            source={SPENDING_SHARE.source}
            table={<DataTable header={["Segment", "Podíl (%)"]} rows={SPENDING_SHARE.rows.map((r) => [r.label, csNumber(r.value)])} />}
          >
            <HBarChart rows={SPENDING_SHARE.rows} unit="%" />
          </ChartFrame>
          <ChartFrame
            title={BEDS.title}
            subtitle={`Obsazenost lůžek v procentech; svislá čára je práh ${BEDS.threshold} %`}
            source={BEDS.source}
            table={<DataTable header={["Lůžka", "Obsazenost (%)"]} rows={BEDS.rows.map((r) => [r.label, r.value])} />}
          >
            <OccupancyMeters rows={BEDS.rows} threshold={BEDS.threshold} />
          </ChartFrame>
        </div>
        <p className="mt-8 max-w-[44em] text-[19px] leading-relaxed text-ink-2">
          Hospitalizujeme o čtvrtinu víc lidí než průměr vyspělých zemí. Pacient po mozkové příhodě leží na akutním lůžku, protože rehabilitační lůžko není. Senior tam leží, protože doma nemá pomoc.
        </p>
      </Section>

      <Section
        eyebrow="Lékař blíž"
        title="Praktiků ubývá a stárnou"
        lead="Praktických lékařů pro dospělé je asi 5 500 a každý rok jich ubude 110 až 180. Téměř polovina je starší 60 let. Praktik ordinuje sám s jednou sestrou, nemá zástup, a kvůli řadě léků musí poslat pacienta ke specialistovi, protože je sám předepsat nesmí."
      >
        <ChartFrame
          title={GP_DECLINE.title}
          subtitle="Počet praktických lékařů pro dospělé, dolní a horní odhad 2026–2035"
          source={GP_DECLINE.source}
          table={<DataTable header={["Rok", "Dolní odhad", "Horní odhad"]} rows={GP_DECLINE.points.map((p) => [String(p.year), p.low, p.high])} />}
        >
          <GpDeclineChart points={GP_DECLINE.points} />
        </ChartFrame>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {PROBLEM_FACTS.slice(1, 3).map((f) => (
            <BigNumber key={f.value} value={f.value} text={f.label} />
          ))}
        </div>
      </Section>

      <Section
        tone="paper"
        eyebrow="Péče doma místo lůžka z nouze"
        title="Zbytečných hospitalizací máme o čtvrtinu víc než vyspělé země"
        lead="Zbytečná hospitalizace je taková, které by předešla dobrá péče mimo nemocnici: včasná kontrola dlouhodobě nemocného, sestra, která zavolá, návštěva doma. Je to hlavní číslo, podle kterého se reforma bude v roce 2033 hodnotit."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartFrame
            title={AVOIDABLE.title}
            subtitle="Hospitalizace na 100 000 obyvatel, kterým by předešla dobrá péče mimo nemocnici"
            source={AVOIDABLE.source}
            table={<DataTable header={["", "Na 100 000 obyvatel"]} rows={AVOIDABLE.rows.map((r) => [r.label, r.value])} />}
          >
            <HBarChart rows={AVOIDABLE.rows} digits={0} />
          </ChartFrame>
          <ChartFrame
            title={NURSES.title}
            subtitle="Počet sester za rok"
            source={NURSES.source}
            table={<DataTable header={["", "Sester ročně"]} rows={NURSES.rows.map((r) => [r.label, r.value])} />}
          >
            <HBarChart rows={NURSES.rows} digits={0} />
          </ChartFrame>
        </div>
        <div className="mt-8 max-w-[52em]">
          <Callout title="Říkáme to otevřeně" tone="sage">
            Nedostatek sester je nejslabší místo plánu. Proto pojišťovna platí jen obsazené místo a plat je jako v nemocnici, ale bez nočních služeb. Kdyby do konce roku 2031 přišla jen polovina potřebných sester, nové budovy se stavět nebudou a reforma poběží v menším rozsahu. Nezastaví se.
          </Callout>
        </div>
      </Section>

      <Section eyebrow="Prevence místo oprav" title="Kam systém lidi aktivně zve, tam prevence funguje">
        <Facts items={PREVENTION_FACTS} />
      </Section>

      <Section
        tone="paper"
        eyebrow="Peníze"
        title="Zdravotní pojištění je od roku 2023 ve ztrátě"
        lead="I kdyby se nic neměnilo, bude zdravotnímu pojištění chybět asi 60 miliard v roce 2035, 70 miliard v roce 2038 a 104 miliard v roce 2050. Může za to hlavně stárnutí a tuhle díru musí řešit každá vláda, ať reformuje, nebo ne. Naše reforma odpovídá na jinou otázku: jakou péči za rostoucí peníze dostaneme."
      >
        <ChartFrame
          title={GAP.title}
          subtitle="Chybějící peníze ve zdravotním pojištění a čistý náklad reformy, mld. Kč ročně"
          source={GAP.source}
          table={<DataTable header={["Rok", "Chybějící peníze (mld. Kč)", "Reforma navíc (mld. Kč)"]} rows={GAP.rows.map((r) => [r.year, csNumber(r.gap), csNumber(r.reform)])} />}
        >
          <GapChart rows={GAP.rows} />
        </ChartFrame>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <BigNumber value={PROBLEM_FACTS[0].value} text={PROBLEM_FACTS[0].label} />
          <BigNumber value={PROBLEM_FACTS[3].value} text={PROBLEM_FACTS[3].label} />
        </div>
        <p className="mt-10 max-w-[44em] text-[19px] leading-relaxed text-ink-2">
          Nebudeme předstírat, že reforma ušetří. Zařídíme, aby každá koruna navíc přinesla víc zdraví a péči i tam, kde dnes chybí.
        </p>
      </Section>

      <NextStep title="Co s tím uděláme" text="Pět změn, které lidé pocítí, a cesta pacienta dnes a po reformě." href="/co-chceme" label="Co chceme" />
    </>
  );
}
