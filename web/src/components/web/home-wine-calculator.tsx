"use client";

import { useState } from "react";
import { TAXES } from "@/content/reforma";
import { CalcOutput, Stepper } from "./inputs";

/** Kalkulačka na úvodu: kolik ročně navíc zaplatí za tiché víno ten, kdo vypije N sklenek týdně. */
export function HomeWineCalculator() {
  const [glasses, setGlasses] = useState(1);
  // sklenky × 0,2 l × 23,40 Kč/l × 52 týdnů, zaokrouhleno na desítky
  const yearly = Math.round((glasses * TAXES.glassLitres * TAXES.wineRatePerLitre * 52) / 10) * 10;
  return (
    <>
      <Stepper id="sklenky" label="Kolik sklenek vína (2 dl) vypijete týdně?" value={glasses} min={0} max={21} onChange={setGlasses} />
      <CalcOutput value={`asi ${yearly.toLocaleString("cs-CZ")} Kč`} text="ročně navíc. Kdo nepije slazené nápoje, na nich nezaplatí nic." />
    </>
  );
}
