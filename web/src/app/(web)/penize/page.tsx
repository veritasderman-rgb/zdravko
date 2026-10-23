import { COST_2038, FUNDING, NET_COST, TEN_NUMBERS } from "@/content/reforma";
import { ChartFrame } from "@/components/charts/chart-frame";
import { HBarChart } from "@/components/charts/hbar-chart";
import { StackedBar } from "@/components/charts/meters";
import { PersonalTaxCalculator, StatePaymentCalculator, TaxSplitCalculator } from "@/components/charts/calculators";
import { Card, NextLink, PageHero, Section } from "@/components/web/ui";

export const metadata = { title: "Peníze" };

const COST_GROUPS = ["lidé v ordinacích", "péče doma", "prevence", "nemocnice", "ostatní"];
const FUND_GROUPS = ["stát", "daně za zdraví", "obce"];

export default function PenizePage() {
  const total = FUNDING.rows.reduce((a, r) => a + r.value, 0);
  return (
    <>
      <PageHero eyebrow="Peníze" title="Čistě asi 21,5 mld. Kč ročně, tedy necelá 4 % dnešních výdajů pojištění" lead="Řekneme to nahlas: péče zdraží i bez nás, protože stárneme. Tuhle reformu neděláme proto, abychom ušetřili, ale aby za peníze, které do zdravotnictví tak jako tak půjdou, bylo víc péče tam, kde dnes chybí. Rozpětí 15 až 25 mld. Kč říkáme nahlas, protože bodový odhad by byl předstírání přesnosti." />

      <Section eyebrow="Na co" title="Přes 10 mld. Kč ze 22,8 mld. Kč provozu jsou sestry a platby týmům" lead="Tedy lidé v ordinacích blízko domova. Nemocnice dostanou z fondu přeměny asi 1,3 mld. Kč ročně ve vrcholu přeměny.">
        <ChartFrame title={COST_2038.title} source={COST_2038.source} table={{ header: ["Položka", "mld. Kč"], rows: COST_2038.rows.map((r) => [r.label, r.value]) }}>
          <HBarChart rows={COST_2038.rows} unit="" digits={2} groups={COST_GROUPS} />
        </ChartFrame>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {NET_COST.rows.map((r) => (
            <div key={r.year} className="rounded-xl border border-line bg-paper p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Rok {r.year}</div>
              <div className="mt-1 text-3xl font-semibold">{r.net.toLocaleString("cs-CZ")} mld. Kč</div>
              <div className="mt-1 text-sm text-muted">provoz {r.provoz.toLocaleString("cs-CZ")} minus úspory {r.uspory.toLocaleString("cs-CZ")}; {r.share} výdajů pojištění roku 2026</div>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-sm text-muted">Úspory jsou skutečné, ale malé. Silná primární péče přináší lepší zdraví a méně zbytečných hospitalizací, celkové výdaje ale spíš zvyšuje. Model je otevřený a kdokoli si ho může přepočítat.</p>
      </Section>

      <Section eyebrow="Kdo to zaplatí" title="Daně za zdraví, státní rozpočet a obce; odvody z práce se nemění">
        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
          <ChartFrame title={FUNDING.title} source={FUNDING.source}>
            <StackedBar rows={FUNDING.rows} groups={FUND_GROUPS} total={total} />
          </ChartFrame>
          <div className="grid gap-3">
            <Card title="Vyšší platba státu není nový peníz" tone="warm">
              Je to přesun ze státního rozpočtu do zdravotního pojištění. Aby stát mohl platit víc za své pojištěnce, musí peníze jinde přibýt, nebo ubýt. Tuhle volbu nezametáme pod koberec: patří do volebního programu 2029.
            </Card>
            <Card title="Když peníze nepřijdou">
              Nebude-li přijat nový vzorec platby státu, reforma se zmenší na variantu bez center (asi 18 mld. Kč) a při dalším nedostatku na minimální variantu (asi 11 mld. Kč). Prevence, paliativa, konzultace a fond přeměny zůstávají ve všech variantách.
            </Card>
          </div>
        </div>
      </Section>

      <Section eyebrow="Přepočítejte si to" title="Tři kalkulačky nad čísly studie" lead="Vzorce jsou převzaté z ekonomického modelu studie. Výsledky jsou scénáře s uvedenými předpoklady, ne fiskální odhad.">
        <div className="grid gap-4 lg:grid-cols-2">
          <StatePaymentCalculator />
          <TaxSplitCalculator />
          <div className="lg:col-span-2">
            <PersonalTaxCalculator />
          </div>
        </div>
      </Section>

      <Section eyebrow="Deset čísel" title="Deset čísel, která budeme opakovat" lead="Převzatá doslova z ekonomického modelu studie (verze 3, 20. 10. 2026).">
        <div className="grid gap-3 sm:grid-cols-2">
          {TEN_NUMBERS.map((x) => (
            <div key={x.n} className="flex gap-4 rounded-xl border border-line bg-paper p-4">
              <div className="w-40 shrink-0 text-lg font-semibold leading-tight">{x.n}</div>
              <div className="text-sm leading-relaxed text-muted">{x.t}</div>
            </div>
          ))}
        </div>
        <Card title="Na co nepřistoupíme" tone="warm">
          <div className="mt-0">Na poplatky za návštěvu lékaře jako zdroj reformy. Na nadstandard, který koupí kratší čekání. Na hrazenou léčbu závislou na sbírce. Na ukončení služby dřív, než funguje náhrada. Na čísla bez výpočtu a zdroje započítané dvakrát.</div>
        </Card>
      </Section>

      <div className="mx-auto max-w-[1100px] px-4">
        <NextLink href="/pro-koho" title="Pro koho" text="Co nabízíme a co potřebujeme od praktiků, sester, pojišťoven, krajů, obcí, nemocnic a pacientů." />
      </div>
    </>
  );
}
