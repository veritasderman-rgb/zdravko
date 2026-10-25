/**
 * Kontrola registru ověření HSPA (src/content/overeni-hspa.json).
 *
 *   pnpm check:overeni          # každý záznam sedí na blok studie, čísla sedí na registr čísel
 *   pnpm check:overeni --list   # vypíše i nespárované záznamy s úryvkem
 *
 * Studii parsuje stejným importérem jako web (bloky, cesta nadpisů), takže kontrola odpovídá tomu,
 * co čtečka opravdu ukáže. Chyba je záznam bez bloku (úryvek v textu bloku není nebo sedí jinam),
 * neplatný verdikt, `cislo` bez klíče v cisla.ts, nebo položka „Ověřit“ ve studii bez záznamu.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseDocument, findVerifications } from "../src/lib/importer";
import { CISLA } from "../src/content/cisla";
import { OVERENI, forBlock, forVerification, normText, type OvereniRecord } from "../src/content/overeni-hspa";

const ROOT = path.resolve(__dirname, "../..");
const STUDY = path.join(ROOT, OVERENI.study);
const list = process.argv.includes("--list");

const src = readFileSync(STUDY, "utf8");
const parsed = parseDocument(src);
const VERDICTS = new Set(["potvrzuje", "upresnuje", "rozpor", "castecne", "hspa_nema"]);
const TYPES = new Set(["overit", "tvrzeni", "ukazatel", "cislo"]);

const errors: string[] = [];
const matched = new Set<string>();
for (const b of parsed.blocks) for (const r of forBlock(b.headingPath, b.text)) matched.add(r.id);

for (const r of OVERENI.records as OvereniRecord[]) {
  if (!VERDICTS.has(r.verdict)) errors.push(`${r.id}: neplatný verdikt ${r.verdict}`);
  if (!TYPES.has(r.type)) errors.push(`${r.id}: neplatný typ ${r.type}`);
  if (!r.study_text?.trim()) errors.push(`${r.id}: prázdný úryvek`);
  if (r.type === "cislo") {
    if (!r.key || !(r.key in CISLA)) errors.push(`${r.id}: číslo ${r.key} není v cisla.ts`);
    continue;
  }
  if (typeof r.line !== "number") errors.push(`${r.id}: chybí řádek`);
  if (!matched.has(r.id)) errors.push(`${r.id}: řádek ${r.line} nesedí na žádný blok (${r.headingPath}): ${normText(r.study_text).slice(0, 80)}`);
  for (const h of r.hspa) if (!("url" in h && h.url) && h.kind !== "dataset") errors.push(`${r.id}: odkaz bez url (${h.kind})`);
}

// každé „Ověřit:“ ve studii má záznam
let verifs = 0;
let missing = 0;
for (const v of findVerifications(parsed.blocks.map((b) => b.text).join("\n"))) {
  // „Ověřit:“ jako zmínka v textu (ř. 1619: značíme „Ověřit:“) nemá co ověřovat
  if (normText(v).replace(/^ověřit\s*:\s*/, "").length < 4) continue;
  verifs++;
  if (!forVerification(v)) {
    missing++;
    errors.push(`Ověřit bez záznamu: ${v.slice(0, 100)}`);
  }
}

const anchored = OVERENI.records.filter((r) => r.type !== "cislo").length;
console.log(`Registr ověření: ${OVERENI.records.length} záznamů, ${anchored} na bloky studie, ${matched.size} spárováno; „Ověřit“ ve studii ${verifs}, bez záznamu ${missing}.`);
if (errors.length) {
  for (const e of errors.slice(0, list ? errors.length : 40)) console.error("  " + e);
  if (!list && errors.length > 40) console.error(`  … a dalších ${errors.length - 40} (pnpm check:overeni --list)`);
  console.error(`Chyb: ${errors.length}`);
  process.exit(1);
}
console.log("OK");
