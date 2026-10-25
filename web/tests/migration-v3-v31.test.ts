/**
 * Migrace připomínek ze studie v3 na v3.1 na skutečných souborech z repozitáře.
 * Ověřuje, že připomínka po importu nové verze ukazuje na svůj text, i když se mezitím
 * vložily, smazaly nebo přesunuly odstavce a polohové klíče se posunuly.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { and, eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import type { AnyDb } from "@/db/pool";
import { importDocumentVersion, parseDocument } from "@/lib/importer";
import { createComment } from "@/lib/comments-core";
import { similarity, words } from "@/lib/anchors";
import { idSeq, testDb } from "./helpers/db";

const ROOT = path.resolve(__dirname, "../..");
const V3 = readFileSync(path.join(ROOT, "01-studie-zdravi-bliz-lidem-v3.md"), "utf8");
const V31 = readFileSync(path.join(ROOT, "01-studie-zdravi-bliz-lidem-v3.1.md"), "utf8");
const DOC = { slug: "studie", title: "Studie", kind: "studie", sourcePath: "studie.md", sort: 0 };

type Block = typeof schema.blocks.$inferSelect;

let db: AnyDb;
let v3: Block[];
let v31: Block[];
let v3Id: number;
let v31Id: number;
const cases: Record<string, { commentId: number; block: Block }> = {};

async function blocksOf(versionId: number) {
  return db.select().from(schema.blocks).where(eq(schema.blocks.versionId, versionId)).orderBy(schema.blocks.ordinal);
}

async function comment(block: Block) {
  const r = await createComment(db, { documentId: block.documentId, versionId: block.versionId, blockKey: block.blockKey, kind: "vecna", severity: "doporucujici", body: "Testovací připomínka k tomuto odstavci.", authorName: "Test", channel: "rt", actor: "test" });
  return r.id;
}

beforeAll(async () => {
  ({ db } = await testDb());
  const makeId = idSeq();
  const r3 = await importDocumentVersion(db, { ...DOC, label: "v3", src: V3, makeId });
  if (r3.status !== "imported") throw new Error("v3 se nenaimportovala");
  v3Id = r3.versionId;
  v3 = await blocksOf(v3Id);

  // Případy vybrané z dat: (1) nezměněný odstavec, (2) upravený odstavec,
  // (3) odstavec, jehož polohový klíč ve v3.1 patří jinému textu, (4) odstavec, který ve v3.1 není.
  const next = parseDocument(V31).blocks;
  const hashes31 = new Set(next.map((b) => `${b.kind}|${b.textHash}`));
  const byKey31 = new Map(next.map((b) => [b.blockKey, b]));
  const paras = v3.filter((b) => b.kind === "paragraph" && b.text.length > 120);
  const best31 = (b: Block) => Math.max(...next.filter((n) => n.kind === b.kind).map((n) => similarity(words(n.text), words(b.text))));

  const unchanged = paras.find((b) => hashes31.has(`${b.kind}|${b.textHash}`) && byKey31.get(b.blockKey)?.textHash === b.textHash);
  const edited = paras.find((b) => !hashes31.has(`${b.kind}|${b.textHash}`) && best31(b) > 0.8);
  const shifted = paras.find((b) => hashes31.has(`${b.kind}|${b.textHash}`) && byKey31.has(b.blockKey) && byKey31.get(b.blockKey)!.textHash !== b.textHash);
  const deleted = paras.find((b) => best31(b) < 0.4);
  if (!unchanged || !edited || !shifted || !deleted) throw new Error("v datech chybí některý z testovaných případů");
  for (const [name, block] of Object.entries({ unchanged, edited, shifted, deleted })) cases[name] = { commentId: await comment(block), block };

  const r31 = await importDocumentVersion(db, { ...DOC, label: "v3.1", src: V31, makeId });
  if (r31.status !== "imported") throw new Error("v3.1 se nenaimportovala");
  v31Id = r31.versionId;
  v31 = await blocksOf(v31Id);
});

async function currentBlockOf(commentId: number) {
  const [c] = await db.select().from(schema.comments).where(eq(schema.comments.id, commentId));
  const [b] = await db.select().from(schema.blocks).where(and(eq(schema.blocks.versionId, v31Id), eq(schema.blocks.anchorId, c.anchorId!)));
  return { c, b };
}

describe("migrace připomínek v3 → v3.1", () => {
  it("v3.1 je aktuální verze a každý blok má kotvu, unikátní v rámci verze", async () => {
    const [cur] = await db.select().from(schema.documentVersions).where(eq(schema.documentVersions.isCurrent, true));
    expect(cur.id).toBe(v31Id);
    for (const list of [v3, v31]) {
      expect(list.every((b) => b.anchorId)).toBe(true);
      expect(new Set(list.map((b) => b.anchorId)).size).toBe(list.length);
    }
  });

  it("nezměněný odstavec: připomínka ukazuje na stejný text", async () => {
    const { c, b } = await currentBlockOf(cases.unchanged.commentId);
    expect(b.text).toBe(c.blockText);
  });

  it("upravený odstavec: připomínka ukazuje na jeho novou podobu a pozná změnu", async () => {
    const { c, b } = await currentBlockOf(cases.edited.commentId);
    expect(b.textHash).not.toBe(c.blockHash);
    expect(similarity(words(b.text), words(c.blockText!))).toBeGreaterThan(0.8);
  });

  it("posunutý polohový klíč: starý klíč ukazuje jinam, kotva na původní text", async () => {
    const { c, b } = await currentBlockOf(cases.shifted.commentId);
    const atOldKey = v31.find((x) => x.blockKey === c.blockKey)!;
    expect(atOldKey.text).not.toBe(c.blockText); // tady by připomínka skončila podle starého klíče
    expect(b.text).toBe(c.blockText); // kotva vede na správný text
  });

  it("odstraněný odstavec: připomínka nemá blok v aktuální verzi, ale nese původní text", async () => {
    const [c] = await db.select().from(schema.comments).where(eq(schema.comments.id, cases.deleted.commentId));
    expect(v31.some((b) => b.anchorId === c.anchorId)).toBe(false);
    expect(c.blockText).toBe(cases.deleted.block.text);
    const [lin] = await db.select().from(schema.blockLineage).where(and(eq(schema.blockLineage.toVersionId, v31Id), eq(schema.blockLineage.anchorId, c.anchorId!)));
    expect(lin.method).toBe("removed");
  });

  it("každý text, který je v obou verzích jednou, si drží kotvu", () => {
    const count = (list: Block[]) => {
      const m = new Map<string, number>();
      for (const b of list) m.set(`${b.kind}|${b.textHash}`, (m.get(`${b.kind}|${b.textHash}`) ?? 0) + 1);
      return m;
    };
    const c3 = count(v3);
    const c31 = count(v31);
    const by31 = new Map(v31.map((b) => [`${b.kind}|${b.textHash}`, b]));
    let checked = 0;
    for (const b of v3) {
      const k = `${b.kind}|${b.textHash}`;
      if (c3.get(k) !== 1 || c31.get(k) !== 1) continue;
      expect(by31.get(k)!.anchorId).toBe(b.anchorId);
      checked++;
    }
    expect(checked).toBeGreaterThan(500);
  });

  it("mapování verzí pokrývá každý blok nové verze a každý odstraněný blok", async () => {
    const rows = await db.select().from(schema.blockLineage).where(eq(schema.blockLineage.toVersionId, v31Id));
    const toBlocks = rows.filter((r) => r.toBlockId != null);
    expect(toBlocks).toHaveLength(v31.length);
    const removed = rows.filter((r) => r.method === "removed");
    const kept = new Set(v31.map((b) => b.anchorId));
    expect(removed.every((r) => !kept.has(r.anchorId))).toBe(true);
    expect(v3.length - removed.length).toBe(rows.filter((r) => r.fromBlockId != null && r.toBlockId != null).length);
  });

  it("nezměněný dokument nevytvoří novou verzi", async () => {
    const r = await importDocumentVersion(db, { ...DOC, label: "v3.1", src: V31 });
    expect(r.status).toBe("unchanged");
  });
});
