/**
 * Studie na webu po kapitolách: každý blok patří právě do jedné kapitoly, adresy kapitol jsou
 * jedinečné a nekolidují s jinými stránkami pod /studie, a hledání na webu má odkaz na každý odstavec.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseDocument } from "@/lib/importer";
import { chapterDescription, chapterSlug, splitStudy } from "@/lib/study";
import { studyEntries, webEntries } from "@/lib/search-index";
import { STRANKY } from "@/content/stranky";

const src = readFileSync(path.resolve(__dirname, "../../01-studie-zdravi-bliz-lidem-v3.2.md"), "utf8");
// Bloky z parseru mají stejná pole jako řádky tabulky blocks (kromě id a verze).
const blocks = parseDocument(src).blocks.map((b, i) => ({ ...b, id: i, versionId: 1, documentId: 1, anchorId: `a${i}` })) as unknown as Parameters<typeof splitStudy>[0];
const { chapters, prelude } = splitStudy(blocks);

describe("kapitoly studie", () => {
  it("má 15 částí a úvodních kapitol a 3 přílohy", () => {
    expect(chapters).toHaveLength(18);
    expect(chapters.filter((c) => c.slug.startsWith("priloha-"))).toHaveLength(3);
    expect(chapters[0].slug).toBe("stav-dokumentu");
  });

  it("každý blok je v jedné kapitole, v podtitulu, nebo je to nadpis kapitoly či název studie", () => {
    const inChapters = chapters.reduce((n, c) => n + c.blocks.length, 0);
    expect(inChapters + prelude.length + chapters.length + 1).toBe(blocks.length);
  });

  it("adresy kapitol jsou jedinečné a nekolidují s jinými stránkami", () => {
    const slugs = chapters.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of ["zavislosti", "tisk", "kotva"]) expect(slugs).not.toContain(s);
    expect(chapterSlug("zdravi-bliz-lidem/cast-i-vychozi-stav-proc-menit")).toBe("cast-i-vychozi-stav");
    expect(chapterSlug("zdravi-bliz-lidem/cast-ii-logika-reformy")).toBe("cast-ii-logika-reformy");
    expect(chapterSlug("zdravi-bliz-lidem/cast-iii-jadro-reformy-sit-luzkove-pece-pilir-2")).toBe("cast-iii-sit-luzkove-pece");
    expect(chapterSlug("zdravi-bliz-lidem/nova-kapitola-")).toBe("nova-kapitola");
  });

  it("popis kapitoly je krátký text, ne podtitul studie", () => {
    for (const c of chapters) {
      const d = chapterDescription(c);
      expect(d.length).toBeLessThanOrEqual(160);
      expect(d).not.toMatch(/^Studie reformy zdravotnictví · verze/);
    }
  });
});

describe("hledání na webu", () => {
  it("obsahuje všechny stránky z přehledu STRANKY", () => {
    const urls = new Set(webEntries().map((e) => e.url));
    for (const p of Object.keys(STRANKY)) expect(urls).toContain(p);
  });

  it("každý textový odstavec studie má odkaz do své kapitoly", () => {
    const entries = studyEntries({ chapters });
    const text = entries.filter((e) => e.text);
    const expected = chapters.reduce((n, c) => n + c.blocks.filter((b) => b.kind !== "heading" && b.text.trim() && !b.text.startsWith("[Graf/diagram")).length, 0);
    expect(text).toHaveLength(expected);
    for (const e of entries) expect(e.url).toMatch(/^\/studie\/[a-z0-9-]+(#.+)?$/);
  });

  it("popisy stránek mají délku vhodnou pro výsledky vyhledávání", () => {
    for (const [p, s] of Object.entries(STRANKY)) {
      expect(s.description.length, p).toBeGreaterThanOrEqual(80);
      expect(s.description.length, p).toBeLessThanOrEqual(165);
    }
  });
});
