/**
 * Průvodce návrhem opatření: kontrola kroků, očištění odpovědí (neznámá a skrytá pole se neukládají)
 * a sestavení návrhu pro resortní tým.
 */
import { describe, expect, it } from "vitest";
import { STEPS, cleanAnswers, proposalCodes, proposalMarkdown, stepErrors, type Answers } from "@/content/navrh-opatreni";
import { REGISTRY_CODES, REGISTRY_LABEL } from "@/content/registr";

const codes = new Set(REGISTRY_CODES);

const complete: Answers = {
  problem: "V okrese chybí praktici, asi 3 000 lidí nemá registrujícího lékaře a s každou drobností jezdí na pohotovost.",
  affected: ["pacienti", "obce"],
  basis: "praxe",
  title: "Sdílená sestra pro malé obce",
  description:
    "Obce do 2 000 obyvatel si se sousedními obcemi sdílejí sestru, která dvakrát týdně ordinuje v obecní místnosti a jezdí za lidmi domů. Je zaměstnaná u týmu praktika v nejbližším městě.",
  area: "pilir-1",
  relation: "uprava",
  relatedCodes: ["J4"],
  instrument: ["uhrady", "smlouvy"],
  who: ["pojistovny", "obce"],
  pilot: "region",
  wave: "vlna-0",
  dependsOn: ["J2"],
  cost: "do-1-mld",
  payer: ["pojisteni", "kraje-obce"],
  benefit: "Lidé v obcích bez ordinace mají péči do 15 minut cesty; měříme podíl lidí s praktikem.",
  name: "Jana",
  email: "jana@example.cz",
  onBehalf: "osoba",
};

describe("průvodce návrhem opatření", () => {
  it("úplný návrh projde všemi kroky", () => {
    for (const s of STEPS) expect(stepErrors(s, complete, codes), s.id).toEqual({});
  });

  it("povinné pole a minimální délku hlídá krok", () => {
    const e = stepErrors(STEPS[0], { problem: "krátké" }, codes);
    expect(e.problem).toMatch(/aspoň 60 znaků/);
    expect(e.affected).toBeTruthy();
    expect(e.basis).toBeTruthy();
  });

  it("podmíněné pole je povinné jen tehdy, když je vidět", () => {
    const krok = STEPS.find((s) => s.id === "opatreni")!;
    expect(stepErrors(krok, { ...complete, relatedCodes: [] }, codes).relatedCodes).toBeTruthy();
    expect(stepErrors(krok, { ...complete, relation: "nove", relatedCodes: [] }, codes).relatedCodes).toBeUndefined();
    const kontakt = STEPS.find((s) => s.id === "kontakt")!;
    expect(stepErrors(kontakt, { ...complete, onBehalf: "organizace" }, codes).organization).toBeTruthy();
  });

  it("neplatné volby a kódy mimo registr neprojdou", () => {
    const krok = STEPS.find((s) => s.id === "navaznosti")!;
    expect(stepErrors(krok, { dependsOn: ["X99"] }, codes).dependsOn).toBeTruthy();
    const kdy = STEPS.find((s) => s.id === "kdy")!;
    expect(stepErrors(kdy, { wave: "zitra" }, codes).wave).toBe("Neplatná volba.");
  });

  it("zdroje smí mít pět odkazů, ostatní texty dva", () => {
    const dukazy = STEPS.find((s) => s.id === "dukazy")!;
    const links = (n: number) => Array.from({ length: n }, (_, i) => `https://example.cz/${i}`).join("\n");
    expect(stepErrors(dukazy, { sources: links(5) }, codes)).toEqual({});
    expect(stepErrors(dukazy, { sources: links(6) }, codes).sources).toMatch(/nejvýš 5/);
    expect(stepErrors(dukazy, { examples: links(3) }, codes).examples).toMatch(/Nejvýš 2 odkazy/);
  });

  it("cleanAnswers zahodí neznámá a skrytá pole", () => {
    const a = cleanAnswers({ ...complete, relation: "nove", hack: "<script>", pilotNote: "  ", organization: "Firma" });
    expect(a.hack).toBeUndefined();
    expect(a.relatedCodes).toBeUndefined();
    expect(a.organization).toBeUndefined();
    expect(a.pilotNote).toBeUndefined();
  });

  it("návrh pro tým obsahuje odpovědi čitelně, bez jména a e-mailu", () => {
    const md = proposalMarkdown(complete, (c) => REGISTRY_LABEL.get(c));
    expect(md).toMatch(/^# Návrh nového opatření: Sdílená sestra pro malé obce/);
    expect(md).toContain("Hned, bez nového zákona (2027 až 2029)");
    expect(md).toContain(`J4 ${REGISTRY_LABEL.get("J4")}`);
    expect(md).not.toContain("jana@example.cz");
    expect(md).not.toContain("**Jméno**");
    expect(proposalCodes(complete)).toEqual(["J4", "J2"]);
  });
});
