/**
 * Registr čísel: data grafů a tabulek musí brát hodnoty z registru a hledání zápisů
 * čísel v textech nesmí chytat cizí čísla.
 */
import { describe, expect, it } from "vitest";
import { CISLA, SOURCES, n, type Cislo } from "@/content/cisla";
import { FUNDING, GAP, NET_COST, SPENDING_SHARE, TAXES, VARIANTS } from "@/content/reforma";
import { ACUTE_BEDS, HEALTH_TAX_SPLIT, RAMP, SENSITIVITY } from "@/content/figures/charts";
import { formRe } from "../scripts/check-cisla";

describe("registr čísel", () => {
  it("každé číslo má zdroj, rok, jednotku, definici a hodnotu uvnitř rozpětí", () => {
    for (const [id, raw] of Object.entries(CISLA)) {
      const x = raw as Cislo;
      expect(SOURCES, id).toHaveProperty(x.source);
      expect(x.year && x.unit && x.definition, id).toBeTruthy();
      if (x.range) expect(x.value >= x.range[0] && x.value <= x.range[1], id).toBe(true);
      if (x.kind === "scenar") expect(x.source, id).toBe("model");
    }
  });

  it("pomocný střed čísel, která zdroj udává jen jako rozpětí, se v kódu nepoužívá", async () => {
    const { readFileSync, readdirSync, statSync } = await import("node:fs");
    const path = await import("node:path");
    const walk = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(path.join(d, f)).isDirectory() ? walk(path.join(d, f)) : [path.join(d, f)]));
    const ids = Object.entries(CISLA).filter(([, x]) => (x as Cislo).rangeOnly).map(([id]) => id);
    const files = walk(path.resolve(__dirname, "../src")).filter((f) => /\.(ts|tsx)$/.test(f));
    for (const f of files) for (const id of ids) expect(readFileSync(f, "utf8"), `${f}: n("${id}")`).not.toContain(`n("${id}")`);
  });

  it("grafy a tabulky berou hodnoty z registru", () => {
    expect(RAMP.at(-1)!.net).toBe(n("netCost2038"));
    expect(RAMP.find((r) => r.year === 2035)!.net).toBe(n("netCost2035"));
    expect(SENSITIVITY.central).toBe(n("netCost2038"));
    expect(VARIANTS.rows.map((v) => v.cost)).toEqual([n("netCost2038"), n("variantB"), n("variantC")]);
    expect(GAP.rows.map((r) => r.gap)).toEqual([n("insuranceGap2035"), n("insuranceGap2038"), n("insuranceGap2050")]);
    expect(GAP.rows.map((r) => r.reform)).toEqual([n("netCost2035"), n("netCost2038"), n("netCost2050")]);
    expect(SPENDING_SHARE.rows[0].value).toBe(n("acuteShare"));
    expect(ACUTE_BEDS.actual[0].beds).toBe(n("acuteBeds"));
    expect(HEALTH_TAX_SPLIT.scenarios[0].total).toBe(n("healthTaxPlan"));
    expect(TAXES.wineRatePerLitre).toBe(n("wineTax"));
  });

  it("součty sedí na čistý náklad s tolerancí zaokrouhlení", () => {
    const funding = FUNDING.rows.reduce((a, r) => a + r.value, 0);
    expect(Math.abs(funding - n("netCost2038"))).toBeLessThanOrEqual(0.2);
    const row2038 = NET_COST.rows.find((r) => r.year === "2038")!;
    expect(Math.abs(row2038.provoz - row2038.uspory - row2038.net)).toBeLessThanOrEqual(0.15);
    // Fond prevence podle pravidla PEER: nejméně 40 %, aspoň 2 mld. Kč
    const fund = FUNDING.rows.find((r) => r.label.includes("Fond prevence"))!.value;
    expect(fund).toBe(Math.max(2, 0.4 * n("healthTaxPlan")));
  });
});

describe("hledání zápisů čísel", () => {
  it("najde samostatný zápis, ne část jiného čísla", () => {
    const r = formRe("5 mld. Kč");
    expect(r.test("plánujeme 5 mld. Kč ročně")).toBe(true);
    expect(r.test("až 15 mld. Kč")).toBe(false);
    expect(r.test("asi 2,5 mld. Kč")).toBe(false);
  });
  it("nepovažuje číslo zákona za hodnotu", () => {
    expect(formRe("592").test("zák. 592/1992 Sb.")).toBe(false);
    expect(formRe("592").test("592 proti 473 na 100 tisíc")).toBe(true);
    expect(formRe("4,3 %").test("z 14,3 %")).toBe(false);
  });
  it("zápis končící jednotkou smí pokračovat lomítkem", () => {
    expect(formRe("23,40 Kč").test("23,40 Kč/l")).toBe(true);
  });
});
