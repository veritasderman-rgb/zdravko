import type { ComponentType } from "react";

/**
 * Registr obrázků studie. Ve studii jsou zástupné odstavce
 * `*[Graf/diagram: <popis> — interaktivní verze …]*`. Čtečka pro každý takový
 * odstavec hledá obrázek podle `match` (podřetězec popisu) a místo odstavce
 * vykreslí jeho komponentu. Popis zůstává pod obrázkem jako zdroj.
 */
export type StudyFigure = {
  /** Stabilní identifikátor (slug). */
  id: string;
  /** Podřetězce, které se hledají v popisu zástupného odstavce; stačí shoda jednoho. */
  match: string[];
  /** Titulek-tvrzení nebo název obrázku. */
  title: string;
  /** Komponenta bez props; serverová nebo klientská. */
  Component: ComponentType;
};

export const PLACEHOLDER_RE = /^\*?\s*\[Graf\/diagram:\s*([\s\S]+?)\s*\]\s*\*?$/;

/** Z popisu odstraní koncovku „— interaktivní verze je v dokumentu Claude Docs“. */
export function captionOf(desc: string): string {
  return desc.replace(/\s*[—–-]\s*interaktivní verze[^\]]*$/i, "").trim();
}

export function findFigure(figures: StudyFigure[], desc: string): StudyFigure | undefined {
  const d = desc.toLowerCase();
  return figures.find((f) => f.match.some((m) => d.includes(m.toLowerCase())));
}
