import type { StudyFigure } from "./registry";
import { AcuteBedsFigure, GpP2Figure, RampFigure } from "./charts/lines";
import { LawsByYearFigure } from "./charts/laws";
import { HealthTaxSplitFigure, MoneyFlowFigure, SensitivityFigure, VariantsFigure } from "./charts/model";
import { NursesFigure } from "./charts/people";
import { AvoidableGapFigure, GpAgeFigure, InsuranceBalanceFigure, LtcBedsFigure, SpendingSegmentsFigure } from "./charts/problem";

/**
 * Datové grafy studie v3. `match` je krátký podřetězec popisu zástupného odstavce
 * (čísla řádků studie v komentářích).
 */
export const CHART_FIGURES: StudyFigure[] = [
  // ř. 227
  { id: "uhrady-segmenty-2024", match: ["OIS-11-24"], title: "Na akutní lůžka jde téměř sedmkrát víc peněz než na praktické lékaře pro dospělé", Component: SpendingSegmentsFigure },
  // ř. 241
  { id: "vek-praktiku", match: ["stav k 31. 3. 2023"], title: "Téměř polovina praktiků pro dospělé je starší 60 let", Component: GpAgeFigure },
  // ř. 259
  { id: "odvratitelne-hospitalizace-umrtnost", match: ["hlth_cd_asdr2"], title: "Nejvíc zaostáváme u nemocí, o kterých rozhoduje péče o chroniky", Component: AvoidableGapFigure },
  // ř. 293
  { id: "luzka-dlouhodobe-pece", match: ["DF_HEALTH_LTCR_BED"], title: "Lůžek dlouhodobé péče je méně než ve srovnatelných zemích", Component: LtcBedsFigure },
  // ř. 307
  { id: "hospodareni-pojisteni", match: ["Zdravotně pojistné plány"], title: "Pojištění je ve schodku a zůstatek fondů klesá", Component: InsuranceBalanceFigure },
  // ř. 850
  { id: "akutni-luzka-trajektorie", match: ["OIS-11-28"], title: "Do roku 2038 změní účel asi 8 000 akutních lůžek", Component: AcuteBedsFigure },
  // ř. 1066
  { id: "dane-za-zdravi-rozdeleni", match: ["pravidlo rozdělení daní za zdraví"], title: "Pravidlo rozdělení daní za zdraví", Component: HealthTaxSplitFigure },
  // ř. 1379
  { id: "citlivost-nakladu-2038", match: ["citlivost čistého nákladu"], title: "Citlivost čistého nákladu 2038", Component: SensitivityFigure },
  // ř. 1387
  { id: "varianty-abc-2038", match: ["varianty A, B, C v roce 2038"], title: "Varianty A, B, C v roce 2038", Component: VariantsFigure },
  // ř. 1406
  { id: "nabeh-2028-2038", match: ["náběh 2028–2038"], title: "Náběh čistého nákladu 2028–2038", Component: RampFigure },
  // ř. 1444
  { id: "tok-penez-2038", match: ["tok peněz na reformu"], title: "Kdo zaplatí reformu v roce 2038", Component: MoneyFlowFigure },
  // ř. 1485
  { id: "sestry-bilance", match: ["úvazků do 2037", "úvazků sester do 2037"], title: "Sestry: potřeba náhrady, absolventky a potřeba reformy", Component: NursesFigure },
  // ř. 1493
  { id: "praktici-p2", match: ["P2 = +50 atestací"], title: "Praktici pro dospělé bez rezidenčních míst P2 a s nimi", Component: GpP2Figure },
  // ř. 1721
  { id: "legislativni-zatez", match: ["součet tabulek vln 0–4"], title: "Legislativní zátěž podle let", Component: LawsByYearFigure },
];
