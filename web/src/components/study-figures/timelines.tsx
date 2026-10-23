import type { StudyFigure } from "./registry";
import { OverviewTimeline } from "./timelines/overview";
import { PillarsGantt } from "./timelines/pillars-gantt";
import { GovVsPlanTimeline } from "./timelines/gov-vs-plan";
import { RoadmapTimeline } from "./timelines/roadmap";
import { LanesGantt } from "./timelines/lanes-gantt";

/**
 * Časové osy studie. `match` je podřetězec popisu zástupného odstavce (bez ohledu na velikost písmen);
 * u každého je zkontrolováno, že neodpovídá žádnému jinému zástupnému odstavci.
 */
export const TIMELINE_FIGURES: StudyFigure[] = [
  {
    id: "harmonogram-prehled",
    match: ["klíčové účinnosti"],
    title: "Harmonogram 2026–2038: 5 fází, 4 brány, klíčové účinnosti",
    Component: OverviewTimeline,
  },
  {
    id: "harmonogram-pilire-4-5",
    match: ["harmonogram pilířů 4 a 5"],
    title: "Harmonogram pilířů 4 a 5",
    Component: PillarsGantt,
  },
  {
    id: "vladni-reformy-a-plan",
    match: ["vládní reformy 2026–2029"],
    title: "Vládní reformy 2026–2029 a fáze F0–F1 plánu",
    Component: GovVsPlanTimeline,
  },
  {
    id: "roadmapa-reformy",
    match: ["roadmapa reformy"],
    title: "Roadmapa reformy: 5 fází, 4 brány",
    Component: RoadmapTimeline,
  },
  {
    id: "harmonogram-sedm-drah",
    match: ["7 drah"],
    title: "Harmonogram 2026–2038: 7 drah",
    Component: LanesGantt,
  },
];
