import { AVOIDABLE, BEDS, GAP, GP_DECLINE, NURSES, PREVENTION_FACTS, PROBLEM_FACTS, SPENDING_SHARE } from "@/content/reforma";
import { ChartFrame } from "@/components/charts/chart-frame";
import { HBarChart } from "@/components/charts/hbar-chart";
import { GpDeclineChart } from "@/components/charts/gp-decline-chart";
import { GapChart } from "@/components/charts/gap-chart";
import { OccupancyMeters } from "@/components/charts/meters";
import { NextLink, PageHero, Section, Stat } from "@/components/web/ui";

export const metadata = { title: "Proč měnit" };

export default function ProcPage() {
  return (
    <>
      <PageHero eyebrow="Proč" title="Peníze tečou tam, kde jsou postele, ne tam, kde jsou lidé nejvíc nemocní." lead="Hodně věcí funguje a zachováme je: pojištění hradí 85 % výdajů na zdraví a jen půl procenta lidí říká, že se k potřebné péči nedostalo. Těžiště systému je ale v nemocnicích. A na to naráží stárnutí: lidí nad 85 let bude v roce 2050 půl milionu, dnes je jich 200 tisíc." />

      <Section eyebrow="Kam jdou peníze" title="Na akutní lůžka jde téměř sedmkrát víc než na praktiky pro dospělé" lead="Ze 571 miliard, které pojišťovny ročně zaplatí, jde asi 170 miliard na akutní lůžka v nemocnicích. Ta jsou přitom obsazená jen z 56 %. Lůžka pro doléčení a rehabilitaci jsou naopak skoro plná.">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartFrame title={SPENDING_SHARE.title} source={SPENDING_SHARE.source} table={{ header: ["Segment", "Podíl %"], rows: SPENDING_SHARE.rows.map((r) => [r.label, r.value]) }}>
            <HBarChart rows={SPENDING_SHARE.rows} unit="%" />
          </ChartFrame>
          <ChartFrame title={BEDS.title} source={BEDS.source} table={{ header: ["Lůžka", "Obsazenost %"], rows: BEDS.rows.map((r) => [r.label, r.value]) }}>
            <OccupancyMeters rows={BEDS.rows} threshold={BEDS.threshold} />
          </ChartFrame>
        </div>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
          Hospitalizujeme o čtvrtinu víc lidí než průměr vyspělých zemí. Pacient po mozkové příhodě leží na akutním lůžku, protože rehabilitační lůžko není. Senior tam leží, protože doma nemá pomoc.
        </p>
      </Section>

      <Section eyebrow="Lékař blíž" title="Praktiků ubývá a stárnou" lead="Praktických lékařů pro dospělé je asi 5 500 a každý rok jich ubude 110 až 180. Téměř polovina je starší 60 let. Praktik ordinuje sám s jednou sestrou, nemá zástup, a kvůli řadě léků musí poslat pacienta ke specialistovi, protože je sám předepsat nesmí.">
        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
          <ChartFrame title={GP_DECLINE.title} source={GP_DECLINE.source} table={{ header: ["Rok", "Dolní odhad", "Horní odhad"], rows: GP_DECLINE.points.map((p) => [p.year, p.low, p.high]) }}>
            <GpDeclineChart points={GP_DECLINE.points} />
          </ChartFrame>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {PROBLEM_FACTS.slice(1, 3).map((f) => (
              <Stat key={f.value} value={f.value} label={f.label} />
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="Péče doma, ne na lůžku z nouze" title="Zbytečných hospitalizací máme o čtvrtinu víc než vyspělé země" lead="Zbytečná hospitalizace je taková, které by předešla dobrá péče mimo nemocnici: včasná kontrola dlouhodobě nemocného, sestra, která zavolá, návštěva doma. Je to hlavní číslo, podle kterého se reforma bude v roce 2033 hodnotit.">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartFrame title={AVOIDABLE.title} source={AVOIDABLE.source} table={{ header: ["", "Na 100 000 obyvatel"], rows: AVOIDABLE.rows.map((r) => [r.label, r.value]) }}>
            <HBarChart rows={AVOIDABLE.rows} digits={0} />
          </ChartFrame>
          <ChartFrame title={NURSES.title} source={NURSES.source} table={{ header: ["", "Sester ročně"], rows: NURSES.rows.map((r) => [r.label, r.value]) }}>
            <HBarChart rows={NURSES.rows} digits={0} />
          </ChartFrame>
        </div>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
          Nedostatek sester je nejslabší místo plánu a říkáme to otevřeně. Proto pojišťovna platí jen obsazené místo, plat je jako v nemocnici bez nočních služeb, a když do konce roku 2031 přijde jen polovina sester, nové budovy se nestaví a reforma se zmenší, ne zastaví.
        </p>
      </Section>

      <Section eyebrow="Prevence místo oprav" title="Kam systém lidi aktivně zve, tam prevence funguje">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PREVENTION_FACTS.map((f) => (
            <Stat key={f.value + f.label} value={f.value} label={f.label} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Peníze" title="Zdravotní pojištění je od roku 2023 ve ztrátě" lead="I kdyby se nic neměnilo, bude zdravotnímu pojištění chybět asi 60 miliard v roce 2035, 70 miliard v roce 2038 a 104 miliard v roce 2050. Může za to hlavně stárnutí a tuhle díru musí řešit každá vláda, ať reformuje, nebo ne. Naše reforma odpovídá na jinou otázku: jakou péči za rostoucí peníze dostaneme.">
        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
          <ChartFrame title={GAP.title} source={GAP.source} table={{ header: ["Rok", "Chybějící peníze (mld. Kč)", "Reforma navíc (mld. Kč)"], rows: GAP.rows.map((r) => [r.year, r.gap, r.reform]) }}>
            <GapChart rows={GAP.rows} />
          </ChartFrame>
          <div className="grid gap-3">
            <Stat value={PROBLEM_FACTS[0].value} label={PROBLEM_FACTS[0].label} />
            <Stat value={PROBLEM_FACTS[3].value} label={PROBLEM_FACTS[3].label} />
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
          Nebudeme předstírat, že reforma ušetří. Zařídíme, aby každá koruna navíc přinesla víc zdraví a péči i tam, kde dnes chybí.
        </p>
      </Section>

      <div className="mx-auto max-w-[1100px] px-4">
        <NextLink href="/co-chceme" title="Co chceme" text="Pět změn, které lidé pocítí, a cesta pacienta dnes a po reformě." />
      </div>
    </>
  );
}
