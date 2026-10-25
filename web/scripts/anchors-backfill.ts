/**
 * Jednorázová migrace na trvalé kotvy (spustit po `pnpm db:push`, před nasazením kódu,
 * který připomínky hledá podle kotvy):
 *
 *   pnpm db:push            # přidá sloupce anchor_id, block_id, block_text, block_hash a tabulku block_lineage
 *   pnpm db:anchors         # doplní kotvy do všech verzí a naváže na ně existující připomínky
 *
 * Postupuje od nejstarší verze, celé v jedné transakci a opakované spuštění nic nezmění.
 * Na konci vypíše, kolik připomínek ukazuje na stejný, změněný, nebo odstraněný text.
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { withPoolDb } from "../src/db/pool";
import * as schema from "../src/db/schema";
import { backfillAnchors, countBlocksWithoutAnchor } from "../src/lib/importer";

async function main() {
  const host = new URL(process.env.DATABASE_URL ?? "postgres://-").hostname;
  console.log(`databáze: ${host}`);
  await withPoolDb(async (db) => {
    const docs = await db.select({ id: schema.documents.id, slug: schema.documents.slug }).from(schema.documents);
    await db.transaction(async (tx) => {
      for (const d of docs) {
        const r = await backfillAnchors(tx as never, d.id);
        const missing = await countBlocksWithoutAnchor(tx as never, d.id);
        console.log(`${d.slug}: doplněno ${r.filledVersions} verzí, navázáno ${r.linkedComments ?? "?"} připomínek, bloků bez kotvy ${missing}`);
        if (missing) throw new Error(`${d.slug}: po migraci zůstaly bloky bez kotvy`);
      }
      await tx.insert(schema.events).values({ entity: "import", action: "anchors_backfill", actor: "scripts/anchors-backfill.ts", payload: { documents: docs.map((d) => d.slug) } });
    });
    const report = await db.execute(sql`
      select k.id, k.block_key, k.parent_id,
        case when k.anchor_id is null then 'bez kotvy (obecná)'
             when cb.id is null then 'text v aktuální verzi chybí'
             when cb.text_hash = k.block_hash then 'stejný text'
             else 'text se změnil' end as stav
      from ${schema.comments} k
      left join ${schema.documentVersions} v on v.document_id = k.document_id and v.is_current
      left join ${schema.blocks} cb on cb.version_id = v.id and cb.anchor_id = k.anchor_id
      order by k.id`);
    for (const r of (report as unknown as { rows: { id: number; block_key: string; parent_id: number | null; stav: string }[] }).rows) {
      console.log(`  #${r.id}${r.parent_id ? " (odpověď)" : ""} ${r.stav}`);
    }
  });
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
