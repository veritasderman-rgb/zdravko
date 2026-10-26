import type { schema } from "@/db";

type Block = typeof schema.blocks.$inferSelect;

/**
 * Studie na webu po kapitolách. Kapitola je část studie (nadpis 2. úrovně pod názvem studie)
 * nebo příloha (nadpis 1. úrovně). Adresa kapitoly se odvozuje z klíče sekce, takže zůstane
 * stejná i v další verzi, pokud se nadpis nezmění; pro hlavní části jsou krátké adresy pevné.
 */
export type Chapter = {
  slug: string;
  title: string;
  /** Úroveň nadpisu kapitoly v Markdownu (1 příloha, 2 část studie). */
  level: number;
  sectionKey: string;
  /** Bloky kapitoly bez jejího nadpisu. */
  blocks: Block[];
};

/** Krátké adresy hlavních částí podle začátku klíče sekce. */
const SHORT: [prefix: string, slug: string][] = [
  ["zdravi-bliz-lidem/stav-dokumentu", "stav-dokumentu"],
  ["zdravi-bliz-lidem/manazerske-shrnuti", "shrnuti"],
  ["zdravi-bliz-lidem/cast-i-", "cast-i-vychozi-stav"],
  ["zdravi-bliz-lidem/cast-ii-", "cast-ii-logika-reformy"],
  ["zdravi-bliz-lidem/cast-iii-jadro-reformy-primarni-pece", "cast-iii-primarni-pece"],
  ["zdravi-bliz-lidem/cast-iii-jadro-reformy-sit-luzkove-pece", "cast-iii-sit-luzkove-pece"],
  ["zdravi-bliz-lidem/cast-iii-jadro-reformy-prevence", "cast-iii-prevence-a-pece-doma"],
  ["zdravi-bliz-lidem/cast-iv-", "cast-iv-co-na-co-navazuje"],
  ["zdravi-bliz-lidem/cast-v-", "cast-v-penize-a-lide"],
  ["zdravi-bliz-lidem/cast-vi-", "cast-vi-vladni-reformy"],
  ["zdravi-bliz-lidem/cast-vii-", "cast-vii-legislativni-mapa"],
  ["zdravi-bliz-lidem/cast-viii-", "cast-viii-harmonogram"],
  ["zdravi-bliz-lidem/cast-ix-", "cast-ix-ukazatele"],
  ["zdravi-bliz-lidem/cast-x-", "cast-x-rizika-a-pojistky"],
  ["zdravi-bliz-lidem/cast-xi-", "cast-xi-oblasti-manifestu"],
  ["priloha-a-", "priloha-a-registr-opatreni"],
  ["priloha-b-", "priloha-b-vyporadani-posudku"],
  ["priloha-c-", "priloha-c-evidence-a-zdroje"],
];

/** Adresy, které pod /studie patří jiným stránkám. */
const RESERVED = new Set(["zavislosti", "tisk", "kotva"]);

/** Adresa kapitoly z klíče sekce jejího nadpisu. */
export function chapterSlug(sectionKey: string): string {
  // Pořadí v SHORT je záměrné: „cast-i-“ nesmí chytit „cast-ii-“, proto se bere nejdelší shoda.
  const hit = SHORT.filter(([p]) => sectionKey.startsWith(p)).sort((a, b) => b[0].length - a[0].length)[0];
  if (hit) return hit[1];
  const slug = (sectionKey.split("/").pop() ?? sectionKey).replace(/-+$/, "");
  return RESERVED.has(slug) ? `kapitola-${slug}` : slug;
}

const isChapterHeading = (b: Block, root: string) =>
  b.kind === "heading" && (((b.level ?? 1) === 2 && b.sectionKey.startsWith(`${root}/`)) || ((b.level ?? 1) === 1 && b.sectionKey !== root));

/**
 * Rozdělí bloky studie na kapitoly. Název studie (první nadpis 1. úrovně) a podtitul před první
 * kapitolou (verze, datum, autor) do kapitol nepatří; podtitul vrací `prelude`.
 */
export function splitStudy(blocks: Block[]): { chapters: Chapter[]; prelude: Block[] } {
  const first = blocks.find((b) => b.kind === "heading");
  const root = first && (first.level ?? 1) === 1 ? first.sectionKey : "";
  const chapters: Chapter[] = [];
  const prelude: Block[] = [];
  for (const b of blocks) {
    if (b === first && root) continue;
    if (isChapterHeading(b, root)) {
      chapters.push({ slug: chapterSlug(b.sectionKey), title: b.text, level: b.level ?? 1, sectionKey: b.sectionKey, blocks: [] });
      continue;
    }
    if (chapters.length === 0) prelude.push(b);
    else chapters[chapters.length - 1].blocks.push(b);
  }
  return { chapters, prelude };
}

export const splitChapters = (blocks: Block[]) => splitStudy(blocks).chapters;

/** Kapitola, do které patří blok (podle klíče sekce). */
export function chapterOfBlock(chapters: Chapter[], block: Pick<Block, "sectionKey" | "blockKey">): Chapter | undefined {
  return chapters.find((c) => c.blocks.some((b) => b.blockKey === block.blockKey)) ?? chapters.find((c) => block.sectionKey === c.sectionKey || block.sectionKey.startsWith(`${c.sectionKey}/`));
}

/** Krátký popis kapitoly pro výsledky vyhledávání: první odstavec, nejvýš asi 155 znaků. */
export function chapterDescription(ch: Chapter, max = 155): string {
  const p = ch.blocks.find((b) => b.kind === "paragraph" && b.text.length > 60 && !b.text.startsWith("[Graf"));
  const text = (p?.text ?? ch.title).replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:–-]$/, "")}…`;
}

/** Doba čtení v minutách (200 slov za minutu). */
export function readingMinutes(ch: Chapter): number {
  const words = ch.blocks.reduce((n, b) => n + b.text.split(/\s+/).length, 0);
  return Math.max(1, Math.round(words / 200));
}
