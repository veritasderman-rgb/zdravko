"use client";

import { useState } from "react";
import { TAXES } from "@/content/reforma";
import { csNumber } from "./theme";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="field">{label}</span>
      {children}
    </label>
  );
}

/** Platba státu: Kč měsíčně na státního pojištěnce ↔ mld. Kč ročně. 100 Kč = 7,2 mld. Kč. */
export function StatePaymentCalculator() {
  const [kc, setKc] = useState(180);
  const mld = (kc * TAXES.statePayees * 12) / 1000;
  return (
    <div className="rounded-xl border border-line bg-paper p-5">
      <h3 className="display-title text-2xl">Kolik stojí vyšší platba státu</h3>
      <p className="mt-1 text-sm text-muted">Stát platí zdravotní pojištění za asi 6 milionů dětí, důchodců a studentů. Každých 100 Kč měsíčně na osobu stojí státní rozpočet 7,2 mld. Kč ročně. Posuňte, o kolik má stát platit víc.</p>
      <Field label={`Navýšení platby: ${kc} Kč měsíčně na státního pojištěnce`}>
        <input type="range" min={0} max={500} step={10} value={kc} onChange={(e) => setKc(Number(e.target.value))} className="w-full accent-[#1f6f5f]" />
      </Field>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <div>
          <div className="text-3xl font-semibold">{csNumber(mld, 1)} mld. Kč</div>
          <div className="text-xs text-muted">ročně ze státního rozpočtu</div>
        </div>
        <div className="text-sm text-muted">
          Reforma počítá s asi 180 Kč měsíčně (13 mld. Kč ročně). Jen zacelit díru v pojištění v roce 2038 by stálo asi 1 150 Kč měsíčně (83 mld. Kč), i bez reformy.
        </div>
      </div>
    </div>
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
    <div className="rounded-xl border border-line bg-paper p-5">
      <h3 className="display-title text-2xl">Kolik zaplatím já</h3>
      <p className="mt-1 text-sm text-muted">Tiché víno bude zdaněné 23,40 Kč na litr jako šumivé. Slazené nápoje s hodně cukru zdraží asi o 6 až 8 Kč na litr, pokud výrobce cukr nesníží. Kdo takové nápoje nepije, nezaplatí nic. Posuňte podle své spotřeby.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label={`Sklenek tichého vína (0,2 l) týdně: ${glasses}`}>
          <input type="range" min={0} max={14} step={1} value={glasses} onChange={(e) => setGlasses(Number(e.target.value))} className="w-full accent-[#1f6f5f]" />
        </Field>
        <Field label={`Litrů slazených nápojů nad hranicí cukru týdně: ${litres}`}>
          <input type="range" min={0} max={10} step={0.5} value={litres} onChange={(e) => setLitres(Number(e.target.value))} className="w-full accent-[#1f6f5f]" />
        </Field>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="text-3xl font-semibold">{csNumber(Math.round(wine), 0)} Kč</div>
          <div className="text-xs text-muted">ročně za víno</div>
        </div>
        <div>
          <div className="text-3xl font-semibold">{csNumber(Math.round(sugarLow), 0)} až {csNumber(Math.round(sugarHigh), 0)} Kč</div>
          <div className="text-xs text-muted">ročně za slazené nápoje, pokud zůstanou neodslazené</div>
        </div>
      </div>
    </div>
  );
}

/** Rozdělení výnosu daní za zdraví podle pravidla: 2 mld. Kč fond prevence pevně, zbytek platba státu. */
export function TaxSplitCalculator() {
  const [revenue, setRevenue] = useState(5);
  const fund = Math.min(2, revenue);
  const state = Math.max(0, revenue - fund);
  return (
    <div className="rounded-xl border border-line bg-paper p-5">
      <h3 className="display-title text-2xl">Kam jdou peníze z daní za zdraví</h3>
      <p className="mt-1 text-sm text-muted">Počítáme s 5 mld. Kč ročně (může to být 5 až 7). Národní fond prevence dostane vždy první 2 mld. Kč, i kdyby daně vynesly méně. Zbytek jde do zdravotního pojištění. Odvody z mezd se nemění. Posuňte, kolik by daně vynesly.</p>
      <Field label={`Výnos daní za zdraví: ${csNumber(revenue, 1)} mld. Kč ročně`}>
        <input type="range" min={3} max={7} step={0.5} value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} className="w-full accent-[#1f6f5f]" />
      </Field>
      <div className="mt-3 flex h-[26px] w-full gap-[2px] overflow-hidden rounded">
        <div className="h-full rounded-l bg-[#1baf7a]" style={{ width: `${(fund / revenue) * 100}%` }} title={`Fond prevence ${csNumber(fund)} mld. Kč`} />
        <div className="h-full rounded-r bg-[#2a78d6]" style={{ width: `${(state / revenue) * 100}%` }} title={`Platba státu ${csNumber(state)} mld. Kč`} />
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-6 text-sm">
        <li className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#1baf7a]" /> Národní fond prevence: {csNumber(fund)} mld. Kč</li>
        <li className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#2a78d6]" /> Do zdravotního pojištění: {csNumber(state)} mld. Kč</li>
      </ul>
    </div>
  );
}
