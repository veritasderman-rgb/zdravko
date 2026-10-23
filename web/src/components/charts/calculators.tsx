"use client";

import { CalcOutput, CalculatorFrame, RangeInput } from "@/components/web/blocks";
import { useState } from "react";
import { TAXES } from "@/content/reforma";
import { SERIES, csNumber } from "./theme";

/** Zaokrouhlí na desítky (Kč) – výsledky kalkulaček jsou orientační, proto „asi“. */
const tens = (v: number) => Math.round(v / 10) * 10;
/** Miliardy: nad 10 na celé, pod 10 na desetiny. */
const bn = (v: number) => (v >= 10 ? csNumber(Math.round(v), 0) : csNumber(Math.round(v * 10) / 10, 1));

/** Platba státu: Kč měsíčně na státního pojištěnce ↔ mld. Kč ročně. 100 Kč = 7,2 mld. Kč. */
export function StatePaymentCalculator() {
  const [kc, setKc] = useState(180);
  const mld = (kc * TAXES.statePayees * 12) / 1000;
  return (
    <CalculatorFrame
      question="Kolik stojí vyšší platba státu?"
      note="Reforma počítá s asi 180 Kč měsíčně (13 mld. Kč ročně). Jen zacelit díru v pojištění v roce 2038 by stálo asi 1 150 Kč měsíčně (83 mld. Kč), i bez reformy."
    >
      <p className="text-[18px] leading-relaxed text-ink-2">
        Stát platí zdravotní pojištění za asi 6 milionů dětí, důchodců a studentů. Každých 100 Kč měsíčně na osobu stojí státní rozpočet 7,2 mld. Kč ročně. Posuňte, o kolik má stát platit víc.
      </p>
      <RangeInput id="calc-platba" label="Navýšení platby za státního pojištěnce" value={kc} min={0} max={500} step={10} onChange={setKc} format={(v) => `${csNumber(v, 0)} Kč měsíčně`} />
      <CalcOutput value={`asi ${bn(mld)} mld. Kč`} text="ročně ze státního rozpočtu" />
    </CalculatorFrame>
  );
}

/** Daně za zdraví pro jednoho člověka: víno a slazené nápoje. */
export function PersonalTaxCalculator() {
  const [glasses, setGlasses] = useState(1);
  const [litres, setLitres] = useState(1);
  const wine = glasses * TAXES.glassLitres * TAXES.wineRatePerLitre * 52;
  const sugarLow = litres * TAXES.sugarPerLitreLow * 52;
  const sugarHigh = litres * TAXES.sugarPerLitreHigh * 52;
  return (
    <CalculatorFrame
      question="Kolik zaplatím já?"
      note="Zjednodušeno: daň z vína 23,40 Kč na litr, 52 týdnů v roce. Malí vinaři platí poloviční sazbu, takže jejich víno zdraží méně."
    >
      <p className="text-[18px] leading-relaxed text-ink-2">
        Tiché víno bude zdaněné 23,40 Kč na litr jako šumivé. Slazené nápoje s hodně cukru zdraží asi o 6 až 8 Kč na litr, pokud výrobce cukr nesníží. Kdo takové nápoje nepije, nezaplatí nic. Posuňte podle své spotřeby.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <RangeInput id="calc-vino" label="Sklenek tichého vína (2 dl) týdně" value={glasses} min={0} max={14} step={1} onChange={setGlasses} format={(v) => `${csNumber(v, 0)} ${v === 1 ? "sklenka" : v >= 2 && v <= 4 ? "sklenky" : "sklenek"}`} />
          <CalcOutput value={`asi ${csNumber(tens(wine), 0)} Kč`} text="ročně navíc za víno" />
        </div>
        <div className="flex flex-col gap-4">
          <RangeInput id="calc-napoje" label="Litrů slazených nápojů nad hranicí cukru týdně" value={litres} min={0} max={10} step={0.5} onChange={setLitres} format={(v) => `${csNumber(v, 1)} l`} />
          <CalcOutput
            value={litres === 0 ? "0 Kč" : `asi ${csNumber(tens(sugarLow), 0)} až ${csNumber(tens(sugarHigh), 0)} Kč`}
            text="ročně navíc za slazené nápoje, pokud zůstanou neodslazené"
          />
        </div>
      </div>
    </CalculatorFrame>
  );
}

/** Rozdělení výnosu daní za zdraví podle pravidla: 2 mld. Kč fond prevence pevně, zbytek platba státu. */
export function TaxSplitCalculator() {
  const [revenue, setRevenue] = useState(5);
  const fund = Math.min(2, revenue);
  const state = Math.max(0, revenue - fund);
  const parts = [
    { label: "Národní fond prevence", value: fund, color: SERIES[2] },
    { label: "Do zdravotního pojištění", value: state, color: SERIES[0] },
  ];
  return (
    <CalculatorFrame
      question="Kam jdou peníze z daní za zdraví?"
      note="Odvody z mezd se nemění. Počítáme s 5 mld. Kč ročně, může to být 5 až 7."
    >
      <p className="text-[18px] leading-relaxed text-ink-2">
        Národní fond prevence dostane vždy první 2 mld. Kč, i kdyby daně vynesly méně. Zbytek jde do zdravotního pojištění. Posuňte, kolik by daně vynesly.
      </p>
      <RangeInput id="calc-vynos" label="Výnos daní za zdraví ročně" value={revenue} min={3} max={7} step={0.5} onChange={setRevenue} format={(v) => `${csNumber(v, 1)} mld. Kč`} />
      <CalcOutput value={`${csNumber(state, 1)} mld. Kč`} text={`půjde do zdravotního pojištění; Národní fond prevence dostane ${csNumber(fund, 1)} mld. Kč`} />
      <div>
        <div className="flex h-6 w-full gap-[2px]" aria-hidden>
          {parts.map((p, i) => (
            <div key={p.label} className="h-full" style={{ width: `${(p.value / revenue) * 100}%`, background: p.color, borderRadius: i === parts.length - 1 ? "0 4px 4px 0" : undefined }} />
          ))}
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-[16px] text-ink-2">
          {parts.map((p) => (
            <li key={p.label} className="flex items-center gap-2">
              <span aria-hidden className="inline-block h-3.5 w-3.5 rounded-[3px]" style={{ background: p.color }} />
              {p.label}: <span className="font-semibold tabular-nums text-ink">{csNumber(p.value, 1)} mld. Kč</span>
            </li>
          ))}
        </ul>
      </div>
    </CalculatorFrame>
  );
}
