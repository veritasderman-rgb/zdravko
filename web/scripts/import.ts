/**
 * Import Markdown dokumentů reformy do databáze.
 *
 *   pnpm import:docs            # naimportuje jen dokumenty, jejichž obsah se změnil
 *   pnpm import:docs --force    # založí novou verzi i u nezměněných dokumentů
 *
 * Každá verze se zapíše v jedné transakci (src/lib/importer.ts): bloky dostanou trvalé
 * kotvy převzaté z předchozí verze podle shody textu, mapování bloků mezi verzemi se uloží
 * do tabulky block_lineage a aktuální verze se přepne až nakonec. Připomínky jsou vázané
 * na kotvy, takže vložený odstavec je nepřesune k jinému textu.
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import path from "node:path";
import { withPoolDb } from "../src/db/pool";
import { familyOf } from "../src/lib/codes";
import { importDocumentVersion, parseDocument, upsertCodes, type CodeRow } from "../src/lib/importer";

const ROOT = path.resolve(__dirname, "../..");

// Připomínkuje se jen odborná studie; ostatní dokumenty slouží jako zdroj pro veřejný web.
const DOCS: { slug: string; title: string; kind: string; file: string; label: string }[] = [
  { slug: "studie", title: "Zdraví blíž lidem — studie v3.1", kind: "studie", file: "01-studie-zdravi-bliz-lidem-v3.1.md", label: "v3.1 (23. 10. 2026)" },
];

const GATES: Record<string, string> = {
  B1: "Brána B1 Mandát (6/2028)",
  B2: "Brána B2 Koaliční smlouva (12/2029–1/2030)",
  B3: "Brána B3 Lidé a data (12/2031)",
  B4: "Brána B4 Nezávislé hodnocení (2033)",
};

async function main() {
  const force = process.argv.includes("--force");
  const host = new URL(process.env.DATABASE_URL ?? "postgres://-").hostname;
  console.log(`databáze: ${host}`);
  await withPoolDb(async (db) => {
    const codeRows: CodeRow[] = [];
    for (const [i, d] of DOCS.entries()) {
      const src = readFileSync(path.join(ROOT, d.file), "utf8");
      codeRows.push(...parseDocument(src).codeRows);
      const r = await importDocumentVersion(db, { slug: d.slug, title: d.title, kind: d.kind, sourcePath: d.file, sort: i, label: d.label, src, force, actor: "scripts/import.ts" });
      if (r.status === "unchanged") console.log(`= ${d.slug}: beze změny (${r.blocks} bloků)`);
      else console.log(`+ ${d.slug}: ${r.blocks} bloků, ${r.verifications} ověření, verze #${r.versionId}; kotvy ${JSON.stringify(r.methods)}`);
    }
    const n = await upsertCodes(db, codeRows, GATES, familyOf);
    console.log(`~ registr kódů: ${n} kódů`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
