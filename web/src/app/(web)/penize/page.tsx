import { COST_2038, COST_GROUPS, FUNDING, FUND_GROUPS, NET_COST, TEN_NUMBERS } from "@/content/reforma";
import { ChartFrame } from "@/components/charts/chart-frame";
import { DataTable } from "@/components/charts/data-table";
import { HBarChart } from "@/components/charts/hbar-chart";
import { StackedBar } from "@/components/charts/meters";
import { csNumber } from "@/components/charts/theme";
import { PersonalTaxCalculator, StatePaymentCalculator, TaxSplitCalculator } from "@/components/charts/calculators";
import { Callout, NextStep, PageHero, Section } from "@/components/web/ui";
import { BigNumber } from "@/components/web/blocks";
import { MoneyFlow } from "@/components/web/visuals";

export const metadata = { title: "Peníze" };

const sum = (xs: { value: number }[]) => xs.reduce((a, r) => a + r.value, 0);

export default function PenizePage() {
  const total = sum(FUNDING.rows);
  const sources = FUND_GROUPS.map((g) => [`Odkud: ${g}`, csNumber(sum(FUNDING.rows.filter((r) => r.group === g)))]);
  const uses = COST_GROUPS.map((g) => [`Na co: ${g}`, csNumber(sum(COST_2038.rows.filter((r) => r.group === g)))]);

  return (
    <>
      <PageHero
        eyebrow="Peníze"
        title="Asi 21,5 miliardy ročně navíc. Necelá 4 % toho, co zdravotnictví stojí dnes."
        lead="Řekneme to na rovinu: péče zdraží i bez nás, protože stárneme. Tuhle reformu neděláme, abychom ušetřili. Děláme ji proto, aby za peníze, které do zdravotnictví tak jako tak půjdou, bylo víc péče tam, kde dnes chybí. Říkáme rozpětí 15 až 25 miliard, protože jedno přesné číslo by bylo předstírání."
        aside={
          <BigNumber
            value="21,5 mld. Kč"
            text="ročně navíc, až reforma poběží naplno kolem roku 2038. Odhad 15 až 25 mld. Kč, necelá 4 % toho, co dnes stojí zdravotní pojištění."
            range={{ min: 15, max: 25, value: 21.5, scaleMax: 30, unit: "mld. Kč", minLabel: "15", maxLabel: "25 mld." }}
            source="Ekonomický model studie v3, ceny roku 2026"
          />
        }
      />

      <Section
        id="tok-penez"
        tone="paper"
        eyebrow="Odkud a kam"
        title="Odkud peníze přijdou a na co půjdou"
        lead="Víc než polovina jde na lidi v ordinacích: sestry, platby týmům a další profese. Nemocnice dostanou na dorovnání příjmu po dobu přeměny asi 1,3 miliardy ročně."
      >
        <ChartFrame
          title="Víc než polovina peněz půjde na lidi v ordinacích"
          subtitle="Tok peněz v roce 2038, mld. Kč ročně: vlevo zdroje, vpravo použití"
          source="Model studie v3, ceny roku 2026."
          table={<DataTable header={["Skupina", "mld. Kč ročně"]} rows={[...sources, ...uses]} />}
        >
          <MoneyFlow />
        </ChartFrame>
      </Section>

      <Section id="polozky" eyebrow="Po položkách" title="Sedmnáct položek provozu">
        <ChartFrame
          title={COST_2038.title}
          subtitle="Roční provoz v roce 2038 podle položek, mld. Kč; barva značí skupinu"
          source={COST_2038.source}
          table={<DataTable header={["Položka", "Skupina", "mld. Kč"]} rows={COST_2038.rows.map((r) => [r.label, r.group, csNumber(r.value, 2)])} />}
        >
          <HBarChart rows={COST_2038.rows} unit="" digits={2} groups={COST_GROUPS} />
        </ChartFrame>
        <ul className="mt-12 grid gap-x-10 md:grid-cols-3">
          {NET_COST.rows.map((r) => (
            <li key={r.year} className="flex flex-col gap-2 border-t border-line-strong py-6">
              <span className="text-[16px] font-bold uppercase tracking-[0.06em] text-forest">Rok {r.year}</span>
              <span className="font-serif text-[34px] font-semibold leading-none text-ink [font-variant-numeric:lining-nums_tabular-nums] md:text-[40px]">{r.net.toLocaleString("cs-CZ")} mld. Kč</span>
              <span className="text-[17px] leading-relaxed text-ink-2">
                provoz {r.provoz.toLocaleString("cs-CZ")} minus úspory {r.uspory.toLocaleString("cs-CZ")}; to je {r.share} dnešních výdajů pojištění
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[44em] text-[19px] leading-relaxed text-ink-2">
          Úspory jsou skutečné, ale malé. Dobrá péče blízko domova přináší víc zdraví a méně zbytečných hospitalizací, celkové výdaje ale spíš zvyšuje. Ekonomický model je veřejný a kdokoli si ho může přepočítat.
        </p>
      </Section>

      <Section id="kdo-zaplati" tone="paper" eyebrow="Kdo to zaplatí" title="Stát, daně za zdraví a obce. Odvody z mezd se nemění.">
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
          <ChartFrame
            title={FUNDING.title}
            subtitle="Zdroje peněz na reformu v roce 2038, mld. Kč ročně; barva značí skupinu"
            source={FUNDING.source}
            table={<DataTable header={["Zdroj", "Skupina", "mld. Kč"]} rows={FUNDING.rows.map((r) => [r.label, r.group, csNumber(r.value)])} />}
          >
            <StackedBar rows={FUNDING.rows} groups={FUND_GROUPS} total={total} />
          </ChartFrame>
          <div className="flex flex-col gap-5">
            <Callout title="Vyšší platba státu nejsou nové peníze">
              Je to přesun ze státního rozpočtu do zdravotního pojištění. Aby stát mohl platit víc za děti, důchodce a studenty, musí peníze jinde přibýt, nebo ubýt. Tuhle volbu nezametáme pod koberec: patří do volebního programu 2029.
            </Callout>
            <Callout title="Když peníze nepřijdou" tone="sage">
              Když neprojde nová platba státu, reforma se zmenší na variantu bez nových center (asi 18 miliard) a při dalším nedostatku na minimální variantu (asi 11 miliard). Prevence, paliativní péče, konzultace lékařů a fond přeměny nemocnic zůstávají ve všech variantách.
            </Callout>
          </div>
        </div>
      </Section>

      <Section
        id="kalkulacky"
        eyebrow="Přepočítejte si to"
        title="Tři kalkulačky nad čísly studie"
        lead="Vzorce jsou převzaté z ekonomického modelu studie. Výsledky jsou scénáře s uvedenými předpoklady, ne přesná předpověď."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <StatePaymentCalculator />
          <TaxSplitCalculator />
          <div className="lg:col-span-2">
            <PersonalTaxCalculator />
          </div>
        </div>
      </Section>

      <Section id="deset-cisel" tone="paper" eyebrow="Deset čísel" title="Deset čísel, která budeme opakovat" lead="Všechna jsou převzatá z ekonomického modelu studie, verze 3 z 20. 10. 2026.">
        <ol className="grid gap-x-12 md:grid-cols-2">
          {TEN_NUMBERS.map((x) => (
            <li key={x.n} className="flex flex-col gap-2 border-t border-line-strong py-6">
              <span className="font-serif text-[30px] font-semibold leading-tight text-ink [font-variant-numeric:lining-nums_tabular-nums] md:text-[34px]">{x.n}</span>
              <span className="text-[17px] leading-relaxed text-ink-2">{x.t}</span>
            </li>
          ))}
        </ol>
        <div className="mt-10 max-w-[52em]">
          <Callout title="Na co nepřistoupíme">
            Na poplatky u lékaře jako zdroj peněz pro reformu. Na připlácení za kratší čekání. Na léčbu, která závisí na sbírce. Na zrušení služby dřív, než funguje náhrada. Na čísla bez výpočtu a na peníze započítané dvakrát.
          </Callout>
        </div>
      </Section>

      <NextStep title="Pro koho to děláme" text="Co nabízíme a co potřebujeme od lékařů, sester, pojišťoven, krajů, obcí, nemocnic a pacientů." href="/pro-koho" label="Pro koho" />
    </>
  );
}
