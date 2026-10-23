import type { StudyFigure } from "./registry";
import { CriticalPathFigure } from "./diagrams/critical-path";
import { TheoryOfChangeFigure } from "./diagrams/theory-of-change";
import { LayersFigure } from "./diagrams/layers";
import { PatientPathFigure } from "./diagrams/patient-path";
import { TeamOrgFigure } from "./diagrams/team-org";
import { NetworkPlanFigure } from "./diagrams/network-plan";
import { DepsCareFigure, DepsMoneyFigure } from "./diagrams/dependencies";
import { Org2038Figure, OrgTodayFigure } from "./diagrams/org-charts";
import { MoneyFlowsFigure } from "./diagrams/money-flows";
import { GovernanceFigure } from "./diagrams/governance";
import { ActorMapFigure } from "./diagrams/actor-map";
import { RiskMatrixFigure } from "./diagrams/risk-matrix";
import {
  ACTOR_MAP,
  CRITICAL_PATH,
  DEPS_CARE,
  DEPS_MONEY,
  GOVERNANCE,
  LAYERS,
  MONEY_FLOWS,
  NETWORK_PLAN,
  ORG_2038,
  ORG_TODAY,
  PATIENT_PATH,
  RISK_MATRIX,
  TEAM_ORG,
  THEORY_OF_CHANGE,
} from "@/content/figures/diagrams";

/** Diagramy studie (schémata, organigramy, grafy závislostí, matice). Čísla řádků platí pro studii v3. */
export const DIAGRAM_FIGURES: StudyFigure[] = [
  { id: "kriticka-cesta", match: ["kritická cesta reformy"], title: CRITICAL_PATH.title, Component: CriticalPathFigure }, // ř. 111
  { id: "teorie-zmeny", match: ["teorie změny"], title: THEORY_OF_CHANGE.title, Component: TheoryOfChangeFigure }, // ř. 390
  { id: "tri-vrstvy", match: ["tři vrstvy opatření"], title: LAYERS.title, Component: LayersFigure }, // ř. 410
  { id: "cesta-pacienta", match: ["cesta pacienta"], title: PATIENT_PATH.title, Component: PatientPathFigure }, // ř. 492
  { id: "organigram-tymu", match: ["organigram týmu sdružené péče"], title: TEAM_ORG.title, Component: TeamOrgFigure }, // ř. 584
  { id: "krajsky-plan", match: ["proces krajského plánu sítě"], title: NETWORK_PLAN.title, Component: NetworkPlanFigure }, // ř. 896
  { id: "zavislosti-penize-lide", match: ["graf závislostí 1/2"], title: DEPS_MONEY.title, Component: DepsMoneyFigure }, // ř. 1206
  { id: "zavislosti-pece-sit", match: ["graf závislostí 2/2"], title: DEPS_CARE.title, Component: DepsCareFigure }, // ř. 1210
  { id: "organigram-dnes", match: ["organigram · dnes"], title: ORG_TODAY.title, Component: OrgTodayFigure }, // ř. 1284
  { id: "organigram-2038", match: ["organigram · cílový stav"], title: ORG_2038.title, Component: Org2038Figure }, // ř. 1288
  { id: "toky-penez", match: ["toky peněz dnes a po reformě"], title: MONEY_FLOWS.title, Component: MoneyFlowsFigure }, // ř. 1296
  { id: "rizeni-reformy", match: ["řízení reformy · v opozici"], title: GOVERNANCE.title, Component: GovernanceFigure }, // ř. 1950
  { id: "mapa-akteru", match: ["mapa aktérů"], title: ACTOR_MAP.title, Component: ActorMapFigure }, // ř. 1852
  { id: "matice-rizik", match: ["matice rizik"], title: RISK_MATRIX.title, Component: RiskMatrixFigure }, // ř. 2084
];
