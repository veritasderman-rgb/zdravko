/**
 * Přiřazení trvalých kotev blokům nové verze dokumentu.
 *
 * Polohový klíč `sekce#p3` se posune, když se do sekce vloží odstavec, a připomínka by pak
 * ukazovala na cizí text. Kotva se proto přenáší podle obsahu, ne podle pořadí:
 *
 *  1. exact:   stejný druh bloku a stejný text (hash). Mezi více kandidáty vyhraje blok
 *              ve stejné sekci, pak blok s nejbližší relativní polohou v dokumentu.
 *              Stejný text v jiné sekci se označí jako moved.
 *  2. similar: upravený text. Zbylé bloky stejného druhu se párují podle podobnosti slov
 *              (Diceův koeficient nad multimnožinou slov); páruje se od nejpodobnějších,
 *              každý blok nejvýš jednou. Krátké bloky (nadpisy, krátké odrážky) potřebují
 *              vyšší shodu, aby se dva různé krátké texty nespojily omylem.
 *  3. new:     blok bez předchůdce dostane novou kotvu.
 *  Bloky staré verze, které nikdo nepřevzal, jsou removed.
 *
 * Funkce je čistá (bez databáze), aby šla testovat; importér výsledek jen zapíše.
 */

export type PrevBlock = {
  id: number;
  anchorId: string;
  kind: string;
  text: string;
  textHash: string;
  sectionKey: string;
  ordinal: number;
};

export type NextBlock = {
  kind: string;
  text: string;
  textHash: string;
  sectionKey: string;
  ordinal: number;
};

export type AnchorMethod = "exact" | "moved" | "similar" | "new";

export type Assignment = { anchorId: string; method: AnchorMethod; fromBlockId: number | null; similarity: number | null };

export type AnchorResult = { assignments: Assignment[]; removed: PrevBlock[] };

/** Práh podobnosti pro upravený text; krátké bloky potřebují víc. */
export const SIMILARITY_MIN = 0.55;
export const SIMILARITY_MIN_SHORT = 0.8;
const SHORT_WORDS = 8;

export function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}%,.]+/gu, " ")
    .replace(/(?<!\d)[,.]|[,.](?!\d)/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** Diceův koeficient nad multimnožinou slov: 2·|A∩B| / (|A| + |B|). */
export function similarity(a: string[], b: string[]): number {
  if (!a.length && !b.length) return 1;
  if (!a.length || !b.length) return 0;
  const counts = new Map<string, number>();
  for (const w of a) counts.set(w, (counts.get(w) ?? 0) + 1);
  let common = 0;
  for (const w of b) {
    const n = counts.get(w) ?? 0;
    if (n > 0) {
      common++;
      counts.set(w, n - 1);
    }
  }
  return (2 * common) / (a.length + b.length);
}

let seq = 0;
/** Výchozí generátor kotev: krátký, náhodný a čitelný v URL. */
export function newAnchorId(): string {
  const rnd = globalThis.crypto?.randomUUID?.().replace(/-/g, "").slice(0, 12) ?? `${Date.now().toString(36)}${(seq++).toString(36)}`;
  return `a${rnd}`;
}

export function assignAnchors(prev: PrevBlock[], next: NextBlock[], makeId: () => string = newAnchorId): AnchorResult {
  const prevLen = Math.max(1, prev.length - 1);
  const nextLen = Math.max(1, next.length - 1);
  const rel = (ordinal: number, len: number) => ordinal / len;

  const result: (Assignment | null)[] = next.map(() => null);
  const used = new Set<number>();

  // 1. Přesná shoda textu
  const byHash = new Map<string, PrevBlock[]>();
  for (const p of prev) {
    const k = `${p.kind}|${p.textHash}`;
    byHash.set(k, [...(byHash.get(k) ?? []), p]);
  }
  next.forEach((n, i) => {
    const cands = (byHash.get(`${n.kind}|${n.textHash}`) ?? []).filter((p) => !used.has(p.id));
    if (!cands.length) return;
    const pos = rel(n.ordinal, nextLen);
    const best = cands.reduce((a, b) => {
      const sa = (a.sectionKey === n.sectionKey ? 0 : 1) * 10 + Math.abs(rel(a.ordinal, prevLen) - pos);
      const sb = (b.sectionKey === n.sectionKey ? 0 : 1) * 10 + Math.abs(rel(b.ordinal, prevLen) - pos);
      return sb < sa ? b : a;
    });
    used.add(best.id);
    result[i] = { anchorId: best.anchorId, method: best.sectionKey === n.sectionKey ? "exact" : "moved", fromBlockId: best.id, similarity: 1 };
  });

  // 2. Upravený text: páry podle podobnosti, od nejpodobnějších
  const restNext = next.map((n, i) => ({ n, i })).filter(({ i }) => !result[i]);
  const restPrev = prev.filter((p) => !used.has(p.id));
  if (restNext.length && restPrev.length) {
    const prevWords = new Map(restPrev.map((p) => [p.id, words(p.text)]));
    const pairs: { i: number; p: PrevBlock; score: number; sim: number }[] = [];
    for (const { n, i } of restNext) {
      const nw = words(n.text);
      for (const p of restPrev) {
        if (p.kind !== n.kind) continue;
        const pw = prevWords.get(p.id)!;
        const sim = similarity(nw, pw);
        const short = Math.min(nw.length, pw.length) < SHORT_WORDS;
        if (sim < (short ? SIMILARITY_MIN_SHORT : SIMILARITY_MIN)) continue;
        // Shoda sekce a blízká poloha rozhodují jen mezi zhruba stejně podobnými kandidáty.
        const score = sim + (p.sectionKey === n.sectionKey ? 0.05 : 0) - 0.02 * Math.abs(rel(p.ordinal, prevLen) - rel(n.ordinal, nextLen));
        pairs.push({ i, p, score, sim });
      }
    }
    pairs.sort((a, b) => b.score - a.score);
    for (const { i, p, sim } of pairs) {
      if (result[i] || used.has(p.id)) continue;
      used.add(p.id);
      result[i] = { anchorId: p.anchorId, method: "similar", fromBlockId: p.id, similarity: Math.round(sim * 1000) / 1000 };
    }
  }

  // 3. Nové bloky
  const assignments = result.map((r) => r ?? { anchorId: makeId(), method: "new" as const, fromBlockId: null, similarity: null });
  const removed = prev.filter((p) => !used.has(p.id));
  return { assignments, removed };
}
