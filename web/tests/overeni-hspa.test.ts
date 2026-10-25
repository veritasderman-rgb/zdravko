/**
 * Registr ověření proti HSPA Monitoru: tvar záznamů, pokrytí registru čísel a ukazatelů Části IX,
 * párování na položky „Ověřit“ a na bloky studie. Úplné kotvení všech záznamů hlídá `pnpm check:overeni`.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CISLA } from "@/content/cisla";
import { OVERENI, evidenceLinks, forBlock, forCislo, forVerification, normText, topVerdict } from "@/content/overeni-hspa";
import { findVerifications, parseDocument } from "@/lib/importer";

const VERDICTS = ["potvrzuje", "upresnuje", "rozpor", "castecne", "hspa_nema"];
const TYPES = ["overit", "tvrzeni", "ukazatel", "cislo"];

describe("registr ověření HSPA", () => {
  it("každý záznam má typ, verdikt, úryvek a odkazy s url", () => {
    const ids = new Set<string>();
    for (const r of OVERENI.records) {
      expect(TYPES, r.id).toContain(r.type);
      expect(VERDICTS, r.id).toContain(r.verdict);
      expect(r.study_text.trim().length, r.id).toBeGreaterThan(0);
      expect(ids.has(r.id), `duplicitní id ${r.id}`).toBe(false);
      ids.add(r.id);
      if (r.type !== "cislo") expect(typeof r.line, r.id).toBe("number");
      for (const h of r.hspa) if (h.kind !== "dataset") expect(h.url, `${r.id} ${h.kind}`).toMatch(/^https:\/\/skorezdravotnictvi\.cz\//);
      if (r.verdict !== "hspa_nema") expect(r.hspa.length, `${r.id} ${r.verdict} bez odkazu`).toBeGreaterThan(0);
    }
    expect(OVERENI.summary.records).toBe(OVERENI.records.length);
  });

  it("každé číslo z cisla.ts má záznam a žádný záznam nemíří na neznámý klíč", () => {
    for (const r of OVERENI.records.filter((x) => x.type === "cislo")) expect(CISLA, r.id).toHaveProperty(r.key!);
    for (const key of Object.keys(CISLA)) expect(forCislo(key).length, key).toBeGreaterThan(0);
  });

  it("pokrývá všech 21 ukazatelů Části IX", () => {
    const codes = new Set(OVERENI.records.filter((r) => r.type === "ukazatel").map((r) => r.ukazatel));
    const expected = ["HLY", ...Array.from({ length: 8 }, (_, i) => `H${i + 1}`), ...Array.from({ length: 12 }, (_, i) => `D${i + 1}`)];
    for (const c of expected) expect(codes.has(c), c).toBe(true);
  });

  it("normalizace sjednotí markdown, svislítka a mezery", () => {
    expect(normText("| **H6** | 29,7 % (2024) |")).toBe("h6 29,7 % (2024)");
    expect(normText("[odkaz](https://x) a b")).toBe("odkaz a b");
  });

  it("odkazy vynechají koncepty a duplicity, verdikt skupiny je nejsilnější", () => {
    const sample = OVERENI.records.filter((r) => r.hspa.some((h) => h.kind === "article"));
    const links = evidenceLinks(sample.slice(0, 20), 50);
    expect(new Set(links.map((l) => l.url)).size).toBe(links.length);
    const drafts = OVERENI.records.flatMap((r) => r.hspa).filter((h) => h.kind === "article" && h.published === false);
    for (const d of drafts) expect(links.some((l) => l.url === d.url)).toBe(false);
    expect(topVerdict([{ verdict: "potvrzuje" }, { verdict: "rozpor" }] as never)).toBe("rozpor");
  });

  it("sedí na studii: položky „Ověřit“ i bloky importéru", () => {
    const src = readFileSync(path.resolve(__dirname, "..", "..", OVERENI.study), "utf8");
    const parsed = parseDocument(src);
    const text = parsed.blocks.map((b) => b.text).join("\n");
    const verifs = findVerifications(text).filter((v) => normText(v).replace(/^ověřit\s*:\s*/, "").length >= 4);
    const unmatched = verifs.filter((v) => !forVerification(v));
    expect(unmatched, "Ověřit bez záznamu").toEqual([]);

    const matched = new Set<string>();
    for (const b of parsed.blocks) for (const r of forBlock(b.headingPath, b.text)) matched.add(r.id);
    const anchored = OVERENI.records.filter((r) => r.type !== "cislo");
    const lost = anchored.filter((r) => !matched.has(r.id)).map((r) => `${r.id} ř. ${r.line}`);
    expect(lost, "záznamy bez bloku").toEqual([]);
  });
});
