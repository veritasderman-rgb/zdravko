import { describe, expect, it } from "vitest";
import { assignAnchors, similarity, words, type NextBlock, type PrevBlock } from "@/lib/anchors";
import { hash } from "@/lib/importer";
import { idSeq } from "./helpers/db";

type Row = [section: string, text: string, kind?: string];

function prevOf(rows: Row[]): PrevBlock[] {
  return rows.map(([sectionKey, text, kind = "paragraph"], i) => ({ id: 100 + i, anchorId: `old${i}`, kind, text, textHash: hash(text), sectionKey, ordinal: i }));
}
function nextOf(rows: Row[]): NextBlock[] {
  return rows.map(([sectionKey, text, kind = "paragraph"], i) => ({ kind, text, textHash: hash(text), sectionKey, ordinal: i }));
}

const A = "Kolem roku 2038 má každý obyvatel svůj tým primární péče a jmenovitého lékaře.";
const B = "Peníze a sestry musí být na místě dřív, než týmy v roce 2032 naběhnou.";
const C = "Přeměna akutních lůžek začne s prvními krajskými plány sítě v roce 2033.";
const X = "Nově vložený odstavec o porodních asistentkách a komunitní péči v těhotenství.";

describe("assignAnchors", () => {
  it("vložený odstavec nepřesune kotvy následujících bloků", () => {
    const prev = prevOf([["s", A], ["s", B], ["s", C]]);
    const { assignments, removed } = assignAnchors(prev, nextOf([["s", A], ["s", X], ["s", B], ["s", C]]), idSeq("n"));
    expect(assignments.map((a) => a.anchorId)).toEqual(["old0", "n00001", "old1", "old2"]);
    expect(assignments.map((a) => a.method)).toEqual(["exact", "new", "exact", "exact"]);
    expect(removed).toEqual([]);
  });

  it("smazaný odstavec je removed a ostatní drží kotvu", () => {
    const { assignments, removed } = assignAnchors(prevOf([["s", A], ["s", B], ["s", C]]), nextOf([["s", A], ["s", C]]), idSeq());
    expect(assignments.map((a) => a.anchorId)).toEqual(["old0", "old2"]);
    expect(removed.map((r) => r.anchorId)).toEqual(["old1"]);
  });

  it("odstavec přesunutý do jiné sekce si kotvu nese (moved)", () => {
    const { assignments } = assignAnchors(prevOf([["s", A], ["s", B], ["t", C]]), nextOf([["s", A], ["t", C], ["t", B]]), idSeq());
    expect(assignments[2]).toMatchObject({ anchorId: "old1", method: "moved" });
  });

  it("prohozené pořadí dvou odstavců zachová obě kotvy", () => {
    const { assignments } = assignAnchors(prevOf([["s", A], ["s", B]]), nextOf([["s", B], ["s", A]]), idSeq());
    expect(assignments.map((a) => a.anchorId)).toEqual(["old1", "old0"]);
  });

  it("upravený odstavec dostane kotvu předchůdce (similar)", () => {
    const edited = `${B} Druhou podmínkou jsou lidé.`;
    const { assignments } = assignAnchors(prevOf([["s", A], ["s", B], ["s", C]]), nextOf([["s", A], ["s", edited], ["s", C]]), idSeq());
    expect(assignments[1].anchorId).toBe("old1");
    expect(assignments[1].method).toBe("similar");
    expect(assignments[1].similarity).toBeGreaterThan(0.8);
  });

  it("přepsaný odstavec bez podobnosti je nový a starý removed", () => {
    const { assignments, removed } = assignAnchors(prevOf([["s", A], ["s", B]]), nextOf([["s", A], ["s", X]]), idSeq("n"));
    expect(assignments[1]).toMatchObject({ anchorId: "n00001", method: "new" });
    expect(removed.map((r) => r.anchorId)).toEqual(["old1"]);
  });

  it("stejný text na dvou místech se páruje podle sekce", () => {
    const same = "Viz tabulku výše.";
    const prev = prevOf([["s", same], ["t", same]]);
    const { assignments } = assignAnchors(prev, nextOf([["t", same], ["s", same]]), idSeq());
    expect(assignments.map((a) => a.anchorId)).toEqual(["old1", "old0"]);
  });

  it("krátké odlišné texty (nadpisy) se nespojí", () => {
    const { assignments } = assignAnchors(prevOf([["s", "Vlna 1: peníze a daně", "heading"]]), nextOf([["s", "Vlna 2: primární péče", "heading"]]), idSeq("n"));
    expect(assignments[0].method).toBe("new");
  });

  it("bloky různého druhu se nespojí ani při stejném textu", () => {
    const { assignments } = assignAnchors(prevOf([["s", A, "paragraph"]]), nextOf([["s", A, "list_item"]]), idSeq("n"));
    expect(assignments[0].method).toBe("new");
  });

  it("každá stará kotva připadne nejvýš jednomu bloku", () => {
    const prev = prevOf([["s", B]]);
    const { assignments } = assignAnchors(prev, nextOf([["s", B], ["s", `${B} Doplněno.`]]), idSeq("n"));
    expect(assignments.filter((a) => a.anchorId === "old0")).toHaveLength(1);
  });
});

describe("similarity", () => {
  it("je 1 pro stejná slova a 0 pro žádnou shodu", () => {
    expect(similarity(words(A), words(A))).toBe(1);
    expect(similarity(words("jedna dvě"), words("tři čtyři"))).toBe(0);
  });
  it("zachová čísla s desetinnou čárkou jako jedno slovo", () => {
    expect(words("výnos 4,8 mld. Kč")).toEqual(["výnos", "4,8", "mld", "kč"]);
  });
});
