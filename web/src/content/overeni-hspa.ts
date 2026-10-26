/**
 * Registr ověření studie proti HSPA Monitoru (skorezdravotnictvi.cz), data v `overeni-hspa.json`.
 *
 * Záznam = místo ve studii (řádek, doslovný úryvek, cesta nadpisů) + co k němu HSPA má
 * (indikátor, článek, registrované tvrzení, dataset) + verdikt. Čtyři typy:
 *  - overit:   místo označené ve studii „Ověřit:“ (registr Ověřit na /overit),
 *  - tvrzeni:  faktické tvrzení studie, ke kterému HSPA má článek nebo indikátor,
 *  - ukazatel: dvacet ukazatelů reformy z Části IX (HLY, H1–H8, D1–D12),
 *  - cislo:    číslo z registru `cisla.ts` (pole `key`).
 *
 * HSPA Monitor je nástroj autorů studie, proto není zdrojem hodnocení reformy (střet zájmů je
 * uvedený v úvodu studie). Tady slouží jen jako pomůcka k ověření: ukazuje hodnotu, rok a
 * primární zdroj (ÚZIS, Eurostat, OECD…), ke kterému má redakce dojít.
 *
 * Registr se negeneruje za běhu; vzniká z dávkové rešerše a mění se commitem.
 * Kontrola, že každý záznam sedí na blok studie: `pnpm check:overeni`.
 */
import reg from "./overeni-hspa.json";

export type Verdict = "potvrzuje" | "upresnuje" | "rozpor" | "castecne" | "hspa_nema";
export type RecordType = "overit" | "tvrzeni" | "ukazatel" | "cislo";

export type HspaRef =
  | { kind: "indicator"; id: string; name: string; value?: number | string | null; unit?: string | null; year?: number | string | null; source?: string | null; url: string; verification?: string; note?: string }
  | { kind: "article"; file: string; title?: string; quote?: string; url: string; published?: boolean; note?: string }
  | { kind: "claim"; id: string; file?: string; title?: string; quote?: string; value?: number | string | null; unit?: string | null; as_of?: number | string | null; url?: string; published?: boolean; note?: string }
  | { kind: "dataset"; file: string; ref?: string; note?: string; url?: string };

export type OvereniRecord = {
  id: string;
  type: RecordType;
  line: number | string;
  part: string;
  section: string;
  headingPath?: string;
  study_text: string;
  hspa: HspaRef[];
  verdict: Verdict;
  note: string;
  /** Jen `ukazatel`. */
  ukazatel?: string;
  baseline?: string;
  /** Jen `cislo`: klíč z cisla.ts. */
  key?: string;
  reverse?: boolean;
};

export type Registry = {
  version: string;
  generated_at: string;
  study: string;
  hspa_commit: string;
  hspa_site: string;
  summary: { records: number; by_type: Record<string, number>; by_verdict: Record<string, number>; hspa_articles_linked: number; hspa_articles_published: number; hspa_indicators_linked: number; hspa_indicators_total: number };
  records: OvereniRecord[];
  coverage: { articles: { item: string; matched: boolean; reason: string | null }[]; indicators: { item: string; matched: boolean; reason: string | null }[] };
};

export const OVERENI = reg as unknown as Registry;

export const VERDICT_LABEL: Record<Verdict, string> = {
  potvrzuje: "HSPA potvrzuje",
  upresnuje: "HSPA upřesňuje",
  rozpor: "HSPA uvádí jinak",
  castecne: "HSPA má téma",
  hspa_nema: "HSPA nemá",
};

/** Barvy: zelená shoda, modrá upřesnění, červená rozpor, šedá téma bez čísla, tlumená nic. */
export const VERDICT_CLASS: Record<Verdict, string> = {
  potvrzuje: "border-emerald-200 bg-emerald-50 text-emerald-900",
  upresnuje: "border-sky-200 bg-sky-50 text-sky-900",
  rozpor: "border-rose-200 bg-rose-50 text-rose-900",
  castecne: "border-line bg-stone text-ink-2",
  hspa_nema: "border-line text-muted",
};

/** Normalizace textu pro hledání úryvku studie v textu bloku (bez markdownu, svislítek, mezer navíc). */
export function normText(s: string): string {
  return (s ?? "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[|*_`\\]/g, " ")
    .replace(/ /g, " ")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const PREFIX = 60;

/** Záznamy k číslu z registru `cisla.ts`. */
export function forCislo(key: string): OvereniRecord[] {
  return OVERENI.records.filter((r) => r.type === "cislo" && r.key === key);
}

/** Text za posledním „Ověřit:“ v úryvku (agenti často zapsali celou větu i s úvodem). */
function verifyTail(studyText: string): string {
  const n = normText(studyText);
  const i = n.lastIndexOf("ověřit:");
  return (i >= 0 ? n.slice(i + 7) : n).trim();
}

const overitIndex: { tail: string; n: string; r: OvereniRecord }[] = OVERENI.records
  .filter((r) => r.type === "overit")
  .map((r) => ({ tail: verifyTail(r.study_text), n: normText(r.study_text), r }));

const VPROBE = 25;

/** Záznam k položce registru Ověřit (text za „Ověřit:“, jak ho ukládá import, i s případným zbytkem řádku tabulky). */
export function forVerification(text: string): OvereniRecord | undefined {
  const n = normText(text).replace(/^ověřit\s*:\s*/, "");
  if (n.length < 4) return undefined;
  const probe = n.slice(0, VPROBE);
  const hit =
    overitIndex.find((x) => x.tail.length >= 4 && (x.tail.startsWith(probe) || n.startsWith(x.tail.slice(0, VPROBE)))) ??
    overitIndex.find((x) => probe.length >= 15 && x.n.includes(probe));
  return hit?.r;
}

let byHeading: Map<string, { n: string; r: OvereniRecord }[]> | null = null;
function headingIndex() {
  if (byHeading) return byHeading;
  byHeading = new Map();
  for (const r of OVERENI.records) {
    if (r.type === "cislo" || !r.headingPath) continue;
    const list = byHeading.get(r.headingPath) ?? [];
    list.push({ n: normText(r.study_text), r });
    byHeading.set(r.headingPath, list);
  }
  return byHeading;
}

/**
 * Záznamy, které sedí na blok studie: stejná cesta nadpisů a úryvek studie je v textu bloku
 * (celý, nebo aspoň jeho prvních 60 znaků, když agent úryvek zkrátil přes hranici bloku).
 */
export function forBlock(headingPath: string, text: string): OvereniRecord[] {
  const list = headingIndex().get(headingPath);
  if (!list) return [];
  const n = normText(text);
  return list.filter((x) => x.n.length > 0 && (n.includes(x.n) || n.includes(x.n.slice(0, PREFIX)))).map((x) => x.r);
}

export type EvidenceLink = { label: string; url: string; kind: "article" | "indicator" };

/**
 * Odkazy k zobrazení: publikované články (i přes registrované tvrzení, které na článek míří)
 * a indikátory, bez duplicit, články první.
 */
export function evidenceLinks(records: OvereniRecord[], max = 4): EvidenceLink[] {
  const seen = new Set<string>();
  const out: EvidenceLink[] = [];
  const add = (kind: EvidenceLink["kind"], url: string | undefined, label: string) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    out.push({ kind, url, label });
  };
  for (const r of records) {
    for (const h of r.hspa) {
      if (h.kind === "article" && h.published !== false) add("article", h.url, h.title ?? h.file);
      if (h.kind === "claim" && h.published !== false) add("article", h.url, h.title ?? h.file ?? h.id);
    }
  }
  for (const r of records) for (const h of r.hspa) if (h.kind === "indicator") add("indicator", h.url, h.name);
  return out.slice(0, max);
}

/** Nejsilnější verdikt skupiny záznamů: rozpor > upřesňuje > potvrzuje > téma > nemá. */
export function topVerdict(records: OvereniRecord[]): Verdict | null {
  const order: Verdict[] = ["rozpor", "upresnuje", "potvrzuje", "castecne", "hspa_nema"];
  for (const v of order) if (records.some((r) => r.verdict === v)) return v;
  return null;
}
