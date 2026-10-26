/**
 * Kontrola registru čísel (src/content/cisla.ts).
 *
 *   pnpm check:cisla           # zkontroluje registr a že je seznam míst aktuální
 *   pnpm check:cisla --write   # přepíše seznam míst src/content/cisla-mista.json
 *   pnpm check:cisla --id netCost2038   # vypíše všechna místa jednoho čísla
 *
 * Pro každé číslo hledá:
 *  - odkazy v kódu (n("id"), fmt("id"), CISLA.id),
 *  - textové zápisy z pole `forms` ve zdrojích webu a ve studii v3.2.
 * Chyba je, když číslu chybí povinné údaje, když se žádný jeho zápis neobjeví ve studii
 * (studie a web se rozešly), nebo když je uložený seznam míst zastaralý.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { CISLA, SOURCES, type Cislo } from "../src/content/cisla";

const WEB = path.resolve(__dirname, "..");
const ROOT = path.resolve(WEB, "..");
const STUDY = path.join(ROOT, "01-studie-zdravi-bliz-lidem-v3.2.md");
const OUT = path.join(WEB, "src/content/cisla-mista.json");
const SKIP = new Set(["src/content/cisla.ts", "src/content/cisla-mista.json"]);

type WebPlace = { file: string; line: number };
type StudyPlace = { line: number; heading: string };
export type Places = Record<string, { web: WebPlace[]; studie: StudyPlace[] }>;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(f) ? [p] : [];
  });
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Zápis čísla jako samostatný výraz: ne „15 mld.“ pro „5 mld.“, ne „4,3“ uvnitř „14,3“, ne „592/1992 Sb.“. */
export const formRe = (form: string) => new RegExp(`(?<![\\d,.])(?<!\\d )${esc(form)}${/\d$/.test(form) ? "(?![\\d/])(?!,\\d)" : ""}`);

export function findPlaces(): Places {
  const files = walk(path.join(WEB, "src")).map((f) => ({ rel: path.relative(WEB, f), lines: readFileSync(f, "utf8").split("\n") }));
  const study = readFileSync(STUDY, "utf8").split("\n");
  const headings: string[] = [];
  let current = "";
  for (const l of study) {
    const m = l.match(/^#{1,4}\s+(.*)$/);
    if (m) current = m[1].replace(/[*_`]/g, "").trim();
    headings.push(current);
  }
  const out: Places = {};
  for (const [id, raw] of Object.entries(CISLA)) {
    const x = raw as Cislo;
    const res = x.forms.map(formRe);
    const codeRe = new RegExp(`(?:\\b(?:n|fmt|fmtRange)\\(\\s*"${id}"|CISLA\\.${id}\\b)`);
    const web: WebPlace[] = [];
    for (const f of files) {
      if (SKIP.has(f.rel)) continue;
      f.lines.forEach((l, i) => {
        if (codeRe.test(l) || res.some((r) => r.test(l))) web.push({ file: f.rel, line: i + 1 });
      });
    }
    const studie: StudyPlace[] = [];
    study.forEach((l, i) => {
      if (res.some((r) => r.test(l))) studie.push({ line: i + 1, heading: headings[i] });
    });
    out[id] = { web, studie };
  }
  return out;
}

function main() {
  const errors: string[] = [];
  for (const [id, raw] of Object.entries(CISLA)) {
    const x = raw as Cislo;
    for (const k of ["unit", "year", "definition", "kind", "source"] as const) if (!x[k]) errors.push(`${id}: chybí ${k}`);
    if (!(x.source in SOURCES)) errors.push(`${id}: neznámý zdroj ${x.source}`);
    if (!x.forms.length) errors.push(`${id}: chybí zápis v textu (forms)`);
    if (/mld\. Kč|Kč/.test(x.unit) && !x.prices && !/Kč za litr/.test(x.unit) && x.kind !== "udaj") errors.push(`${id}: peněžní částka bez cenové hladiny`);
    if (x.range && !(x.range[0] <= x.value && x.value <= x.range[1])) errors.push(`${id}: hodnota ${x.value} leží mimo rozpětí ${x.range.join("–")}`);
  }

  const places = findPlaces();
  for (const [id, p] of Object.entries(places)) {
    const x = CISLA[id as keyof typeof CISLA] as Cislo;
    if (x.inStudy !== false && p.studie.length === 0) errors.push(`${id}: žádný zápis (${x.forms.join(" | ")}) není ve studii; studie a web se rozešly, nebo chybí správný zápis ve forms`);
  }

  const idArg = process.argv.indexOf("--id");
  if (idArg > 0) {
    const id = process.argv[idArg + 1];
    const p = places[id];
    if (!p) throw new Error(`neznámé číslo ${id}`);
    console.log(`${id}: ${(CISLA as Record<string, Cislo>)[id].value} ${(CISLA as Record<string, Cislo>)[id].unit}`);
    for (const w of p.web) console.log(`  web    ${w.file}:${w.line}`);
    for (const s of p.studie) console.log(`  studie ř. ${s.line} (${s.heading})`);
    return;
  }

  const json = JSON.stringify(places, null, 1) + "\n";
  if (process.argv.includes("--write")) {
    writeFileSync(OUT, json);
    console.log(`zapsáno ${path.relative(WEB, OUT)}`);
  } else {
    let saved = "";
    try {
      saved = readFileSync(OUT, "utf8");
    } catch {}
    if (saved !== json) errors.push("seznam míst (src/content/cisla-mista.json) je zastaralý; spusťte pnpm check:cisla --write");
  }

  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  const n = Object.keys(CISLA).length;
  const used = Object.values(places).reduce((a, p) => a + p.web.length + p.studie.length, 0);
  console.log(`registr čísel v pořádku: ${n} čísel, ${used} míst použití`);
}

if (typeof require !== "undefined" && require.main === module) main();
