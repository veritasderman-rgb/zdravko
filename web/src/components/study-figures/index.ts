import type { StudyFigure } from "./registry";
import { DIAGRAM_FIGURES } from "./diagrams";
import { CHART_FIGURES } from "./charts";
import { TIMELINE_FIGURES } from "./timelines";

/** Všechny obrázky studie. Pořadí nerozhoduje; hledá se podle `match`. */
export const STUDY_FIGURES: StudyFigure[] = [...DIAGRAM_FIGURES, ...CHART_FIGURES, ...TIMELINE_FIGURES];
