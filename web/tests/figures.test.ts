/**
 * Každé zástupné místo pro obrázek ve studii (*[Graf/diagram: …]*) musí mít ve čtečce
 * odpovídající obrázek; jinak by se místo grafu ukázal jen popisek.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";
import { STUDY_FIGURES } from "@/components/study-figures";
import { PLACEHOLDER_RE, findFigure } from "@/components/study-figures/registry";
import { DEPENDENCY_FIGURES } from "@/content/figures/zavislosti";
import { isCode } from "@/lib/codes";

it("každé zástupné místo ve studii v3.1 má obrázek", () => {
  const src = readFileSync(path.resolve(__dirname, "../../01-studie-zdravi-bliz-lidem-v3.1.md"), "utf8");
  const placeholders = src
    .split("\n")
    .map((l) => l.trim().match(PLACEHOLDER_RE)?.[1])
    .filter((x): x is string => !!x);
  expect(placeholders.length).toBeGreaterThan(30);
  const missing = placeholders.filter((d) => !findFigure(STUDY_FIGURES, d));
  expect(missing).toEqual([]);
});

it("každý graf na stránce /studie/zavislosti je v registru a má místo ve studii", () => {
  const src = readFileSync(path.resolve(__dirname, "../../01-studie-zdravi-bliz-lidem-v3.1.md"), "utf8");
  const inStudy = new Set(
    src
      .split("\n")
      .map((l) => l.trim().match(PLACEHOLDER_RE)?.[1])
      .filter((x): x is string => !!x)
      .map((d) => findFigure(STUDY_FIGURES, d)?.id),
  );
  for (const f of DEPENDENCY_FIGURES) {
    expect(STUDY_FIGURES.some((s) => s.id === f.id), f.id).toBe(true);
    expect(inStudy.has(f.id), f.id).toBe(true);
  }
  for (const f of DEPENDENCY_FIGURES) for (const c of f.codes) expect(isCode(c), `${f.id}: ${c}`).toBe(true);
});
