import { COST_2038, COST_GROUPS, FUNDING, FUND_GROUPS, NET_COST, TEN_NUMBERS } from "@/content/reforma";
import { ChartFrame } from "@/components/charts/chart-frame";
import { HBarChart } from "@/components/charts/hbar-chart";
import { StackedBar } from "@/components/charts/meters";
import { PersonalTaxCalculator, StatePaymentCalculator, TaxSplitCalculator } from "@/components/charts/calculators";
import { Card, NextLink, PageHero, Section } from "@/components/web/ui";
import { MoneyFlow } from "@/components/web/visuals";

export const metadata = { title: "Peníze" };

export default function PenizePage() {
  const total = FUNDING.rows.reduce((a, r) => a + r.value, 0);
  return (
    <>
      <PageHero eyebrow="Peníze" title="Asi 21,5 miliardy ročně navíc. Necelá 4 % toho, co zdravotnictví stojí dnes." lead="Řekneme to na rovinu: péče zdraží i bez nás, protože stárneme. Tuhle reformu neděláme, abychom ušetřili. Děláme ji proto, aby za peníze, které do zdravotnictví tak jako tak půjdou, bylo víc péče tam, kde dnes chybí. Říkáme rozpětí 15 až 25 miliard, protože jedno přesné číslo by bylo předstírání." />

      <Section eyebrow="Odkud a kam" title="Odkud peníze přijdou a na co půjdou" lead="Víc než polovina jde na lidi v ordinacích: sestry, platby týmům a další profese. Nemocnice dostanou na dorovnání příjmu po dobu přeměny asi 1,3 miliardy ročně.">
        <ChartFrame title="Tok peněz v roce 2038, mld. Kč ročně" source="Model studie v3, ceny roku 2026. Vlevo zdroje, vpravo použití.">
          <MoneyFlow />
        </ChartFrame>
      </Section>

      <Section eyebrow="Po položkách" title="Sedmnáct položek provozu">
        <ChartFrame title={COST_2038.title} source={COST_2038.source} table={{ header: ["Položka", "mld. Kč"], rows: COST_2038.rows.map((r) => [r.label, r.value]) }}>
          <HBarChart rows={COST_2038.rows} unit="" digits={2} groups={COST_GROUPS} />
        </ChartFrame>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {NET_COST.rows.map((r) => (
            <div key={r.year} className="rounded-xl border border-line bg-paper p-5">
              <div className="eyebrow text-accent">Rok {r.year}</div>
              <div className="big-number mt-1 text-4xl">{r.net.toLocaleString("cs-CZ")} mld. Kč</div>
              <div className="mt-2 text-sm text-muted">provoz {r.provoz.toLocaleString("cs-CZ")} minus úspory {r.uspory.toLocaleString("cs-CZ")}; to je {r.share} dnešních výdajů pojištění</div>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">Úspory jsou skutečné, ale malé. Dobrá péče blízko domova přináší víc zdraví a méně zbytečných hospitalizací, celkové výdaje ale spíš zvyšuje. Ekonomický model je veřejný a kdokoli si ho může přepočítat.</p>
      </Section>

      <Section eyebrow="Kdo to zaplatí" title="Stát, daně za zdraví a obce. Odvody z mezd se nemění.">
        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
          <ChartFrame title={FUNDING.title} source={FUNDING.source}>
            <StackedBar rows={FUNDING.rows} groups={FUND_GROUPS} total={total} />
          </ChartFrame>
          <div className="grid gap-3">
            <Card title="Vyšší platba státu nejsou nové peníze" tone="warm">
              Je to přesun ze státního rozpočtu do zdravotního pojištění. Aby stát mohl platit víc za děti, důchodce a studenty, musí peníze jinde přibýt, nebo ubýt. Tuhle volbu nezametáme pod koberec: patří do volebního programu 2029.
            </Card>
            <Card title="Když peníze nepřijdou">
              Když neprojde nová platba státu, reforma se zmenší na variantu bez nových center (asi 18 miliard) a při dalším nedostatku na minimální variantu (asi 11 miliard). Prevence, paliativní péče, konzultace lékařů a fond přeměny nemocnic zůstávají ve všech variantách.
            </Card>
          </div>
        </div>
      </Section>

      <Section eyebrow="Přepočítejte si to" title="Tři kalkulačky nad čísly studie" lead="Vzorce jsou převzaté z ekonomického modelu studie. Výsledky jsou scénáře s uvedenými předpoklady, ne přesná předpověď.">
        <div className="grid gap-4 lg:grid-cols-2">
          <StatePaymentCalculator />
          <TaxSplitCalculator />
          <div className="lg:col-span-2">
            <PersonalTaxCalculator />
          </div>
        </div>
      </Section>

      <Section eyebrow="Deset čísel" title="Deset čísel, která budeme opakovat" lead="Všechna jsou převzatá z ekonomického modelu studie, verze 3 z 20. 10. 2026.">
        <div className="grid gap-3 sm:grid-cols-2">
          {TEN_NUMBERS.map((x) => (
            <div key={x.n} className="flex gap-4 rounded-xl border border-line bg-paper p-4">
              <div className="display-title w-44 shrink-0 text-2xl leading-tight">{x.n}</div>
              <div className="text-sm leading-relaxed text-muted">{x.t}</div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Card title="Na co nepřistoupíme" tone="warm">
            Na poplatky u lékaře jako zdroj peněz pro reformu. Na připlácení za kratší čekání. Na léčbu, která závisí na sbírce. Na zrušení služby dřív, než funguje náhrada. Na čísla bez výpočtu a na peníze započítané dvakrát.
          </Card>
        </div>
      </Section>

      <div className="mx-auto max-w-[1100px] px-4">
        <NextLink href="/pro-koho" title="Pro koho" text="Co nabízíme a co potřebujeme od lékařů, sester, pojišťoven, krajů, obcí, nemocnic a pacientů." />
      </div>
    </>
  );
}
