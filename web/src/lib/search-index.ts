import { CISLA, type Cislo } from "@/content/cisla";
import { MANIFEST_AREAS } from "@/content/manifest";
import { FAQ, GLOSSARY } from "@/content/reforma";
import { STRANKY } from "@/content/stranky";
import { slug } from "@/app/(web)/_lib/slug";
import type { Chapter } from "@/lib/study";
import type { LoadedStudy } from "@/lib/study-data";

/** Položka hledání na webu: kde je, jak se jmenuje a text, ve kterém se hledá. */
export type SearchEntry = {
  /** Druh výsledku: stránka webu, otázka, pojem, číslo, oblast Manifestu, odstavec studie. */
  k: "stranka" | "otazka" | "pojem" | "cislo" | "oblast" | "studie";
  title: string;
  text: string;
  url: string;
  /** U odstavce studie kapitola a oddíl, ve kterém je. */
  where?: string;
};

/** Obsah webu, který je v kódu (bez databáze). */
export function webEntries(): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const [path, p] of Object.entries(STRANKY)) out.push({ k: "stranka", title: p.title, text: p.description, url: path });
  for (const f of FAQ) out.push({ k: "otazka", title: f.q, text: f.a, url: `/otazky#${slug(f.q)}` });
  for (const g of GLOSSARY) out.push({ k: "pojem", title: g.term, text: g.text, url: `/slovnicek#${slug(g.term)}` });
  for (const [id, raw] of Object.entries(CISLA)) {
    const x = raw as Cislo & { forms: readonly string[] };
    out.push({ k: "cislo", title: `${x.forms[0]} (${x.year})`, text: x.definition, url: `/cisla#${id}` });
  }
  for (const a of MANIFEST_AREAS) out.push({ k: "oblast", title: `Oblast ${a.n}: ${a.title}`, text: a.promise, url: `/plan#oblast-${a.n}` });
  return out;
}

/** Odstavce studie s adresou v kapitole (trvalá kotva, jinak klíč bloku). */
export function studyEntries(study: Pick<LoadedStudy, "chapters">): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const ch of study.chapters as Chapter[]) {
    let section = "";
    out.push({ k: "studie", title: ch.title, text: "", url: `/studie/${ch.slug}`, where: "Kapitola studie" });
    for (const b of ch.blocks) {
      if (b.kind === "heading") {
        section = b.text;
        out.push({ k: "studie", title: b.text, text: "", url: `/studie/${ch.slug}#${encodeURIComponent(b.blockKey)}`, where: ch.title });
        continue;
      }
      if (!b.text.trim() || b.text.startsWith("[Graf/diagram")) continue;
      out.push({ k: "studie", title: section || ch.title, text: b.text, url: `/studie/${ch.slug}#${encodeURIComponent(b.anchorId ?? b.blockKey)}`, where: ch.title });
    }
  }
  return out;
}
