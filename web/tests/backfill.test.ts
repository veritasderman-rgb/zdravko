/**
 * Data z doby před kotvami: verze bez anchor_id a připomínky vázané jen na polohový klíč.
 * Migrace (backfillAnchors) musí dát stejný výsledek jako import, který kotvy přenáší od začátku.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { and, eq, isNull } from "drizzle-orm";
import type { PGlite } from "@electric-sql/pglite";
import * as schema from "@/db/schema";
import type { AnyDb } from "@/db/pool";
import { backfillAnchors, countBlocksWithoutAnchor, importDocumentVersion } from "@/lib/importer";
import { createComment } from "@/lib/comments-core";
import { idSeq, testDb } from "./helpers/db";

const ROOT = path.resolve(__dirname, "../..");
const V3 = readFileSync(path.join(ROOT, "01-studie-zdravi-bliz-lidem-v3.md"), "utf8");
const V31 = readFileSync(path.join(ROOT, "01-studie-zdravi-bliz-lidem-v3.1.md"), "utf8");
const DOC = { slug: "studie", title: "Studie", kind: "studie", sourcePath: "s.md", sort: 0 };

let db: AnyDb;
let client: PGlite;
let documentId: number;
let expected: Map<number, string | null>; // blok → kotva z importu
let commentAnchor: Map<number, { blockId: number | null; anchorId: string | null }>;

beforeAll(async () => {
  ({ db, client } = await testDb());
  const makeId = idSeq();
  const r3 = await importDocumentVersion(db, { ...DOC, label: "v3", src: V3, makeId });
  if (r3.status !== "imported") throw new Error();
  documentId = r3.documentId;
  const blocks3 = await db.select().from(schema.blocks).where(eq(schema.blocks.versionId, r3.versionId)).orderBy(schema.blocks.ordinal);
  for (const b of [blocks3[40], blocks3[300], blocks3[900]]) {
    await createComment(db, { documentId, versionId: r3.versionId, blockKey: b.blockKey, kind: "vecna", severity: "doporucujici", body: "Připomínka ze starých dat.", authorName: "Test", channel: "rt", actor: "Test" });
  }
  await importDocumentVersion(db, { ...DOC, label: "v3.1", src: V31, makeId });

  const all = await db.select().from(schema.blocks);
  expected = new Map(all.map((b) => [b.id, b.anchorId]));
  const comments = await db.select().from(schema.comments);
  commentAnchor = new Map(comments.map((c) => [c.id, { blockId: c.blockId, anchorId: c.anchorId }]));

  // Stav před migrací: žádné kotvy, žádné mapování, připomínky jen s polohovým klíčem.
  await client.exec("update blocks set anchor_id = null; delete from block_lineage; update comments set anchor_id = null, block_id = null, block_text = null, block_hash = null;");
});

describe("dosazení kotev do starých dat", () => {
  it("dosadí kotvy do všech verzí a naváže připomínky na původní bloky", async () => {
    expect(await countBlocksWithoutAnchor(db, documentId)).toBeGreaterThan(0);
    const r = await backfillAnchors(db, documentId, idSeq());
    expect(r.filledVersions).toBe(2);
    expect(await countBlocksWithoutAnchor(db, documentId)).toBe(0);

    // Stejné páry bloků mezi verzemi jako při importu (kotvy jsou deterministické se stejným generátorem).
    const all = await db.select().from(schema.blocks);
    for (const b of all) expect(b.anchorId).toBe(expected.get(b.id));

    const comments = await db.select().from(schema.comments);
    for (const c of comments) {
      expect(c.blockId).toBe(commentAnchor.get(c.id)!.blockId);
      expect(c.anchorId).toBe(commentAnchor.get(c.id)!.anchorId);
      expect(c.blockText).not.toBeNull();
    }
  });

  it("opakované spuštění nic nezmění", async () => {
    const before = await db.select().from(schema.blockLineage);
    const r = await backfillAnchors(db, documentId, idSeq("z"));
    expect(r.filledVersions).toBe(0);
    expect(await db.select().from(schema.blockLineage)).toHaveLength(before.length);
    expect(await db.select().from(schema.comments).where(and(isNull(schema.comments.anchorId), eq(schema.comments.documentId, documentId)))).toHaveLength(0);
  });
});
