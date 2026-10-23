import { STUDY_FIGURES } from "./index";
import { captionOf, findFigure } from "./registry";

/**
 * Místo zástupného odstavce „[Graf/diagram: …]“ vykreslí registrovaný obrázek.
 * Popis z odstavce (bez koncovky o interaktivní verzi) zůstává pod obrázkem jako zdroj.
 * Když obrázek v registru není, vrátí null a čtečka ukáže původní odstavec.
 */
export function StudyFigureSlot({ desc, compact = false }: { desc: string; compact?: boolean }) {
  const fig = findFigure(STUDY_FIGURES, desc);
  if (!fig) return null;
  const caption = captionOf(desc);
  const Cmp = fig.Component;
  return (
    <figure className={`my-4 ${compact ? "text-sm" : ""}`} data-figure={fig.id}>
      <Cmp />
      <figcaption className={`mt-2 text-muted ${compact ? "text-xs" : "text-[15px]"}`}>{caption}</figcaption>
    </figure>
  );
}
