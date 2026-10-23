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
      <PageHero eyebrow="Proč" title="Peníze tečou tam, kde jsou postele, ne tam, kde jsou lidé nejvíc nemocní." lead="Z povinného pojištění je hrazeno 85 % výdajů a nenaplněnou potřebu péče hlásí jen 0,5 % lidí. To funguje a zachováme to. Těžiště systému je ale v nemocnicích a na tento poměr naráží stárnutí: lidí nad 85 let bude v roce 2050 zhruba 509 tisíc místo 202 tisíc v roce 2021." />

      <Section eyebrow="Nemocniční těžiště" title="Akutní lůžka čerpají téměř sedmkrát víc než praktici pro dospělé" lead="Podíl na úhradách zdravotního pojištění za rok 2024. Celkem jde do akutní lůžkové péče asi 170 mld. Kč ze 571 mld. Kč.">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartFrame title={SPENDING_SHARE.title} source={SPENDING_SHARE.source} table={{ header: ["Segment", "Podíl %"], rows: SPENDING_SHARE.rows.map((r) => [r.label, r.value]) }}>
            <HBarChart rows={SPENDING_SHARE.rows} unit="%" />
          </ChartFrame>
          <ChartFrame title={BEDS.title} source={BEDS.source} table={{ header: ["Lůžka", "Obložnost %"], rows: BEDS.rows.map((r) => [r.label, r.value]) }}>
            <OccupancyMeters rows={BEDS.rows} threshold={BEDS.threshold} />
          </ChartFrame>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
          Máme 48 036 akutních lůžek, tedy 4,4 na 1 000 obyvatel. Hospitalizujeme o čtvrtinu víc lidí než průměr OECD. Pacient po mozkové příhodě leží na akutním lůžku, protože rehabilitační není; senior tam leží, protože doma nemá pomoc.
        </p>
      </Section>

      <Section eyebrow="Lékař blíž" title="Praktiků ubývá a stárnou" lead="Praktiků pro dospělé je asi 5 500 a ročně jich ubude 110 až 180. Téměř polovina je starší 60 let. Praktik ordinuje sám s jednou sestrou, bez zástupu, a kvůli řadě receptů musí posílat pacienta ke specialistovi.">
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

      <Section eyebrow="Péče doma, ne na lůžku z nouze" title="Odvratitelných hospitalizací máme o čtvrtinu víc než průměr OECD" lead="Odvratitelná hospitalizace je taková, které by předešla dobrá péče mimo nemocnici: kontrola chronika, sestra, která zavolá, návštěva doma. Je to hlavní ukazatel, podle kterého se reforma bude v roce 2033 hodnotit.">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartFrame title={AVOIDABLE.title} source={AVOIDABLE.source} table={{ header: ["", "Na 100 000 obyvatel"], rows: AVOIDABLE.rows.map((r) => [r.label, r.value]) }}>
            <HBarChart rows={AVOIDABLE.rows} digits={0} />
          </ChartFrame>
          <ChartFrame title={NURSES.title} source={NURSES.source} table={{ header: ["", "Sester ročně"], rows: NURSES.rows.map((r) => [r.label, r.value]) }}>
            <HBarChart rows={NURSES.rows} digits={0} />
          </ChartFrame>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
          Nedostatek sester je nejslabší místo plánu a přiznáváme ho. Proto se platí jen obsazené místo, plat je na úrovni nemocniční sestry bez nočních služeb, a když do konce roku 2031 přijde jen polovina sester, centra se nestavějí a reforma se zmenší, nezastaví.
        </p>
      </Section>

      <Section eyebrow="Prevence místo oprav" title="Kde systém lidi aktivně zve, prevence funguje">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PREVENTION_FACTS.map((f) => (
            <Stat key={f.value + f.label} value={f.value} label={f.label} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Peníze" title="Pojištění hospodaří od roku 2023 se schodkem" lead="Při dnešních pravidlech příjmů bude zdravotnímu pojištění chybět asi 60 mld. Kč v roce 2035, 70 mld. Kč v roce 2038 a 104 mld. Kč v roce 2050. Tuto mezeru musí řešit každá vláda, ať reformuje, nebo ne. Naše reforma odpovídá na jinou otázku: jakou péči za rostoucí výdaje dostaneme.">
        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
          <ChartFrame title={GAP.title} source={GAP.source} table={{ header: ["Rok", "Mezera (mld. Kč)", "Reforma (mld. Kč)"], rows: GAP.rows.map((r) => [r.year, r.gap, r.reform]) }}>
            <GapChart rows={GAP.rows} />
          </ChartFrame>
          <div className="grid gap-3">
            <Stat value={PROBLEM_FACTS[0].value} label={PROBLEM_FACTS[0].label} />
            <Stat value={PROBLEM_FACTS[3].value} label={PROBLEM_FACTS[3].label} />
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
          Nebudeme předstírat, že reforma ušetří; zařídíme, aby každá koruna navíc přinesla víc zdraví a péči i tam, kde dnes chybí.
        </p>
      </Section>

      <div className="mx-auto max-w-[1100px] px-4">
        <NextLink href="/co-chceme" title="Co chceme" text="Pět změn, které lidé pocítí, a cesta pacienta dnes a po reformě." />
      </div>
    </>
  );
}
