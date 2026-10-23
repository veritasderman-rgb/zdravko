import { ChartFrame } from "@/components/charts/chart-frame";
import { DataTable } from "@/components/charts/data-table";
import { MUTED_MARK, SERIES, csNumber } from "@/components/charts/theme";
import { NURSES } from "@/content/reforma";
import { NURSES_EXTRA } from "@/content/figures/charts";
import { Reveal } from "../reveal";
import { HBars, Legend, Note } from "./primitives";

// ---------------------------------------------------------------------------
// 12. Sestry: potřeba náhrady, absolventky a potřeba reformy (ř. 1485)
// Čísla podle opraveného NURSES (vládní program 2026–2037), ne podle v3 (30 000, 1 300).
// ---------------------------------------------------------------------------
export function NursesFigure() {
  const e = NURSES_EXTRA;
  const [needRow, gradsRow, reformRow] = NURSES.rows;
  const grads = gradsRow.value; // 680 VŠ + 570 VOŠ
  const needLow = Math.round(e.replacementMin / e.yearsHigh);
  const needHigh = Math.round(e.replacementMin / e.yearsLow);
  const shareOfGrads = (v: number) => Math.round((v / grads) * 100);
  const n = (v: number) => csNumber(v, 0);
  return (
    <ChartFrame
      title={`Reforma potřebuje v průměru ${n(reformRow.value)} sester ročně, asi třetinu absolventek; ve vrcholu ${e.reformPeakYear} skoro polovinu`}
      subtitle={`Všeobecné sestry za rok. Potřeba náhrady: nejméně ${n(e.replacementMin)} úvazků za ${e.yearsLow} až ${e.yearsHigh} let. Studie v3 pracovala s ${n(e.v3Replacement)} úvazky do roku 2037 a ${n(e.v3Grads)} absolventkami ročně; čísla jsme opravili podle vládního programu.`}
      source="Vládní program pro nelékařské zdravotnické profese 2026–2037 a MZ ČR 2025 (potřeba a absolventky); ekonomický model studie v3 (potřeba reformy)"
      table={
        <DataTable
          header={["Ukazatel", "Sester ročně", "Podíl z absolventek"]}
          rows={[
            [needRow.label, `${n(needLow)} až ${n(needHigh)}`, "—"],
            [`${gradsRow.label}: ${e.gradsUni} VŠ a ${e.gradsCollege} VOŠ`, n(grads), "100 %"],
            [`Reforma navíc v letech 2032–2037 (vrchol ${e.reformPeakYear}: ${e.reformPeak})`, `${n(e.reformLow)} až ${n(e.reformHigh)}`, `${shareOfGrads(e.reformLow)} až ${shareOfGrads(e.reformHigh)} %`],
            [reformRow.label, n(reformRow.value), `${shareOfGrads(reformRow.value)} %`],
          ]}
        />
      }
    >
      <Reveal>
        <div className="font-sans">
          <Legend
            items={[
              { label: "celý systém", color: MUTED_MARK },
              { label: "potřeba reformy", color: SERIES[0] },
            ]}
          />
          <HBars
            lo={0}
            hi={2500}
            ticks={[0, 500, 1000, 1500, 2000, 2500]}
            fmt={(t) => n(t)}
            rows={[
              { label: `Potřeba nových všeobecných sester (${n(e.replacementMin)} úvazků za ${e.yearsLow} až ${e.yearsHigh} let)`, value: needLow, whisker: needHigh, color: MUTED_MARK, text: `${n(needLow)}–${n(needHigh)}`, title: `Potřeba: ${n(needLow)} až ${n(needHigh)} ročně` },
              { label: `Absolventky VŠ (${e.gradsUni}) a VOŠ (${e.gradsCollege})`, value: grads, color: MUTED_MARK, text: n(grads), title: `Absolventky: ${n(grads)} ročně` },
              {
                label: `Reforma navíc 2032–2037, vrchol ${e.reformPeak} v roce ${e.reformPeakYear}`,
                value: e.reformLow,
                whisker: e.reformHigh,
                marker: { at: e.reformPeak, label: `vrchol ${e.reformPeakYear}: ${e.reformPeak}` },
                color: SERIES[0],
                text: `${n(e.reformLow)}–${n(e.reformHigh)}`,
                title: `Reforma 2032–2037: ${n(e.reformLow)} až ${n(e.reformHigh)} ročně; vrchol ${e.reformPeak} (${shareOfGrads(e.reformPeak)} % absolventek)`,
                strong: true,
              },
              { label: "Reforma navíc v průměru do roku 2038", value: reformRow.value, color: SERIES[0], text: `${n(reformRow.value)} (${shareOfGrads(reformRow.value)} %)`, title: `Průměr reformy: ${reformRow.value} ročně`, strong: true },
            ]}
          />
          <Note>
            Vrchol {e.reformPeak} sester v roce {e.reformPeakYear} je {shareOfGrads(e.reformPeak)} % absolventek (studie v3 uváděla 46 % z 1 300). Týmy proto přebírají nemocniční sestry jen tam, kde se podle plánu sítě práce v nemocnici prokazatelně změnila, a brána B3 v prosinci 2031 měří obsazení míst sester; když nebude splněna, reforma pokračuje jako varianta B.
          </Note>
        </div>
      </Reveal>
    </ChartFrame>
  );
}
