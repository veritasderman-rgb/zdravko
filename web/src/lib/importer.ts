/**
 * Import Markdown dokumentu do databáze: rozsekání na bloky, přenesení kotev z předchozí
 * verze a zápis nové verze v jedné transakci. Volá ho scripts/import.ts (produkce) i testy
 * (PGlite). Bez přístupu k souborům a k proměnným prostředí.
 */
import { createHash } from "node:crypto";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { toString as mdToString } from "mdast-util-to-string";
import type { Root, RootContent, Table } from "mdast";
import { and, asc, eq, inArray, isNull, sql } from "drizzle-orm";
import * as schema from "@/db/schema";
import type { AnyDb } from "@/db/pool";
import { CODE_RE } from "@/lib/codes";
import { assignAnchors, newAnchorId, type NextBlock, type PrevBlock } from "@/lib/anchors";

type BlockRow = typeof schema.blocks.$inferInsert;

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function hash(s: string): string {
  return createHash("sha256").update(s).digest("hex").slice(0, 16);
}

function sliceSource(src: string, node: RootContent): string {
  const p = node.position;
  if (!p) return "";
  return src.slice(p.start.offset ?? 0, p.end.offset ?? 0);
}

function tableMeta(t: Table): { header: string[]; rows: string[][] } {
  const [head, ...rest] = t.children;
  return {
    header: head ? head.children.map((c) => mdToString(c)) : [],
    rows: rest.map((r) => r.children.map((c) => mdToString(c))),
  };
}

function findCodes(text: string): string[] {
  const found = new Set<string>();
  for (const m of text.matchAll(CODE_RE)) found.add(m[1]);
  return [...found].sort();
}

export function findVerifications(text: string): string[] {
  const out: string[] = [];
  const re = /Ověřit\s*:\s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const rest = text.slice(m.index + m[0].length);
    // konec věty: tečka následovaná mezerou a velkým písmenem, nebo konec bloku
    const end = rest.search(/\.(\s+[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]|\s*$)/);
    const sentence = (end >= 0 ? rest.slice(0, end) : rest).trim();
    if (sentence) out.push(sentence.slice(0, 400));
  }
  return out;
}

export type ParsedBlock = Omit<BlockRow, "versionId" | "documentId" | "anchorId">;
export type CodeRow = { code: string; label: string; layer?: string; pillar?: string; meta: Record<string, string> };

export interface Parsed {
  blocks: ParsedBlock[];
  verifications: { blockKey: string; text: string }[];
  codeRows: CodeRow[];
}

export function parseDocument(src: string): Parsed {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(src) as Root;
  const blocks: Parsed["blocks"] = [];
  const verifications: Parsed["verifications"] = [];
  const codeRows: Parsed["codeRows"] = [];

  const headingStack: { level: number; slug: string; title: string }[] = [];
  const usedSectionKeys = new Map<string, number>();
  let sectionKey = "uvod";
  let headingPath = "";
  let counters: Record<string, number> = {};
  let ordinal = 0;

  const push = (
    kind: BlockRow["kind"],
    node: RootContent,
    opts: { text?: string; md?: string; meta?: unknown; level?: number; keyOverride?: string } = {},
  ) => {
    const text = (opts.text ?? mdToString(node)).replace(/\s+/g, " ").trim();
    if (!text && kind !== "thematic_break") return;
    const prefix = kind === "heading" ? "h" : kind === "paragraph" ? "p" : kind === "list_item" ? "li" : kind === "table" ? "t" : kind === "quote" ? "q" : "x";
    counters[prefix] = (counters[prefix] ?? 0) + 1;
    const blockKey = opts.keyOverride ?? `${sectionKey}#${prefix}${counters[prefix]}`;
    const codes = findCodes(text);
    const ver = findVerifications(text);
    blocks.push({
      blockKey,
      ordinal: ordinal++,
      kind,
      level: opts.level ?? null,
      sectionKey,
      headingPath,
      text,
      md: opts.md ?? sliceSource(src, node),
      meta: opts.meta ?? null,
      codes,
      hasVerify: ver.length > 0,
      textHash: hash(text),
    });
    for (const v of ver) verifications.push({ blockKey, text: v });
  };

  for (const node of tree.children) {
    switch (node.type) {
      case "heading": {
        const title = mdToString(node).trim();
        while (headingStack.length && headingStack[headingStack.length - 1].level >= node.depth) headingStack.pop();
        headingStack.push({ level: node.depth, slug: slugify(title) || "sekce", title });
        let key = headingStack.map((h) => h.slug).join("/");
        const n = (usedSectionKeys.get(key) ?? 0) + 1;
        usedSectionKeys.set(key, n);
        if (n > 1) key = `${key}-${n}`;
        sectionKey = key;
        headingPath = headingStack.map((h) => h.title).join(" › ");
        counters = {};
        push("heading", node, { level: node.depth, keyOverride: `${sectionKey}#h` });
        break;
      }
      case "paragraph":
        push("paragraph", node);
        break;
      case "list":
        for (const item of node.children) push("list_item", item as unknown as RootContent);
        break;
      case "table": {
        const meta = tableMeta(node);
        const text = [meta.header.join(" | "), ...meta.rows.map((r) => r.join(" | "))].join(" \n ");
        push("table", node, { text, meta });
        // registr kódů: řádky, jejichž první buňka je kód
        for (const row of meta.rows) {
          const first = row[0]?.trim() ?? "";
          const m = first.match(/^\**((?:J|P|Pil|M|H|D|R|B)\d+(?:\.\d+)?)\**(?:\s+(.*))?$/);
          if (!m) continue;
          const code = m[1];
          const labelInline = m[2]?.trim();
          const headerIsRegistr = meta.header[0]?.toLowerCase().startsWith("kód");
          const label = headerIsRegistr ? row[1] : labelInline || row[1];
          const metaObj: Record<string, string> = {};
          meta.header.forEach((h, i) => (metaObj[h] = row[i] ?? ""));
          codeRows.push({
            code,
            label: (label ?? "").replace(/\*\*/g, "").trim(),
            layer: headerIsRegistr ? row[2] : undefined,
            pillar: headerIsRegistr ? row[3] : undefined,
            meta: metaObj,
          });
        }
        break;
      }
      case "blockquote":
        push("quote", node);
        break;
      case "code":
        push("code", node, { text: node.value });
        break;
      case "thematicBreak":
        break; // oddělovače slajdů nenesou obsah
      case "html":
        push("other", node, { text: node.value });
        break;
      default:
        push("other", node);
    }
  }
  return { blocks, verifications, codeRows };
}

// ---------------------------------------------------------------------------
// Kotvy: dosazení do starších verzí (jednorázově) a do nové verze při importu
// ---------------------------------------------------------------------------

type DbBlock = PrevBlock;

async function loadBlocks(db: AnyDb, versionId: number): Promise<(DbBlock & { anchorId: string | null })[]> {
  return db
    .select({
      id: schema.blocks.id,
      anchorId: schema.blocks.anchorId,
      kind: schema.blocks.kind,
      text: schema.blocks.text,
      textHash: schema.blocks.textHash,
      sectionKey: schema.blocks.sectionKey,
      ordinal: schema.blocks.ordinal,
    })
    .from(schema.blocks)
    .where(eq(schema.blocks.versionId, versionId))
    .orderBy(asc(schema.blocks.ordinal)) as Promise<(DbBlock & { anchorId: string | null })[]>;
}

async function setAnchors(db: AnyDb, rows: { id: number; anchorId: string }[]) {
  for (let k = 0; k < rows.length; k += 500) {
    const chunk = rows.slice(k, k + 500);
    const values = sql.join(
      chunk.map((r) => sql`(${r.id}::int, ${r.anchorId}::text)`),
      sql`, `,
    );
    await db.execute(sql`update ${schema.blocks} as b set anchor_id = v.anchor_id from (values ${values}) as v(id, anchor_id) where b.id = v.id`);
  }
}

type LineageRow = typeof schema.blockLineage.$inferInsert;

async function insertLineage(db: AnyDb, rows: LineageRow[]) {
  for (let k = 0; k < rows.length; k += 300) await db.insert(schema.blockLineage).values(rows.slice(k, k + 300));
}

/**
 * Dosadí kotvy do verzí, které je ještě nemají (data z doby před kotvami), a naváže na ně
 * připomínky: kotvu, blok a text bloku v době podání. Postupuje od nejstarší verze,
 * takže kotva prochází celou historií. Opakované spuštění nic nezmění.
 */
export async function backfillAnchors(db: AnyDb, documentId: number, makeId: () => string = newAnchorId) {
  const versions = await db
    .select({ id: schema.documentVersions.id })
    .from(schema.documentVersions)
    .where(eq(schema.documentVersions.documentId, documentId))
    .orderBy(asc(schema.documentVersions.id));
  let prev: DbBlock[] | null = null;
  let prevVersionId: number | null = null;
  let filledVersions = 0;
  for (const v of versions) {
    const blocks = await loadBlocks(db, v.id);
    if (blocks.length && blocks.every((b) => b.anchorId)) {
      prev = blocks as DbBlock[];
      prevVersionId = v.id;
      continue;
    }
    const { assignments, removed } = assignAnchors(prev ?? [], blocks, makeId);
    await setAnchors(
      db,
      blocks.map((b, i) => ({ id: b.id, anchorId: assignments[i].anchorId })),
    );
    await insertLineage(db, [
      ...assignments.map((a, i) => ({ documentId, fromVersionId: prevVersionId, toVersionId: v.id, anchorId: a.anchorId, fromBlockId: a.fromBlockId, toBlockId: blocks[i].id, method: a.method, similarity: a.similarity })),
      ...removed.map((r) => ({ documentId, fromVersionId: prevVersionId, toVersionId: v.id, anchorId: r.anchorId, fromBlockId: r.id, toBlockId: null, method: "removed", similarity: null })),
    ]);
    prev = blocks.map((b, i) => ({ ...b, anchorId: assignments[i].anchorId }));
    prevVersionId = v.id;
    filledVersions++;
  }
  // Připomínky z doby před kotvami: blok podle verze a polohového klíče v době podání.
  const linked = await db.execute(sql`
    update ${schema.comments} as k
    set anchor_id = b.anchor_id, block_id = b.id, block_text = b.text, block_hash = b.text_hash
    from ${schema.blocks} as b
    where k.document_id = ${documentId} and k.anchor_id is null and b.version_id = k.version_id and b.block_key = k.block_key`);
  return { filledVersions, linkedComments: (linked as { rowCount?: number }).rowCount ?? null };
}

// ---------------------------------------------------------------------------
// Import verze
// ---------------------------------------------------------------------------

export type ImportInput = {
  slug: string;
  title: string;
  kind: string;
  sourcePath: string;
  sort: number;
  label: string;
  src: string;
  force?: boolean;
  actor?: string;
  makeId?: () => string;
};

export type ImportResult =
  | { status: "unchanged"; documentId: number; blocks: number }
  | { status: "imported"; documentId: number; versionId: number; blocks: number; verifications: number; methods: Record<string, number> };

/**
 * Celý import jedné verze v jedné transakci: dokument, verze, bloky s kotvami, mapování
 * na předchozí verzi, ověření, přepnutí aktuální verze a auditní záznam. Když cokoli selže,
 * zůstane aktuální předchozí verze beze změny.
 */
export async function importDocumentVersion(db: AnyDb, input: ImportInput): Promise<ImportResult> {
  const parsed = parseDocument(input.src);
  const sourceHash = hash(input.src);
  const makeId = input.makeId ?? newAnchorId;

  return db.transaction(async (tx) => {
    const [doc] = await tx
      .insert(schema.documents)
      .values({ slug: input.slug, title: input.title, kind: input.kind, sourcePath: input.sourcePath, sort: input.sort })
      .onConflictDoUpdate({ target: schema.documents.slug, set: { title: input.title, kind: input.kind, sourcePath: input.sourcePath, sort: input.sort } })
      .returning();

    const current = await tx.query.documentVersions.findFirst({
      where: and(eq(schema.documentVersions.documentId, doc.id), eq(schema.documentVersions.isCurrent, true)),
    });
    if (current && current.sourceHash === sourceHash && !input.force) {
      return { status: "unchanged", documentId: doc.id, blocks: parsed.blocks.length };
    }

    // Starší verze bez kotev nejdřív doplnit, ať je z čeho kotvy přenést.
    await backfillAnchors(tx as unknown as AnyDb, doc.id, makeId);
    const prev = current ? ((await loadBlocks(tx as unknown as AnyDb, current.id)) as DbBlock[]) : [];

    const next: NextBlock[] = parsed.blocks.map((b) => ({ kind: b.kind, text: b.text, textHash: b.textHash, sectionKey: b.sectionKey, ordinal: b.ordinal }));
    const { assignments, removed } = assignAnchors(prev, next, makeId);

    const [version] = await tx.insert(schema.documentVersions).values({ documentId: doc.id, label: input.label, sourceHash, isCurrent: false }).returning();

    const rows: BlockRow[] = parsed.blocks.map((b, i) => ({ ...b, versionId: version.id, documentId: doc.id, anchorId: assignments[i].anchorId }));
    const ids = new Map<number, number>();
    for (let k = 0; k < rows.length; k += 150) {
      const inserted = await tx.insert(schema.blocks).values(rows.slice(k, k + 150)).returning({ id: schema.blocks.id, ordinal: schema.blocks.ordinal });
      for (const r of inserted) ids.set(r.ordinal, r.id);
    }

    await insertLineage(tx as unknown as AnyDb, [
      ...assignments.map((a, i) => ({ documentId: doc.id, fromVersionId: current?.id ?? null, toVersionId: version.id, anchorId: a.anchorId, fromBlockId: a.fromBlockId, toBlockId: ids.get(parsed.blocks[i].ordinal) ?? null, method: a.method, similarity: a.similarity })),
      ...removed.map((r) => ({ documentId: doc.id, fromVersionId: current?.id ?? null, toVersionId: version.id, anchorId: r.anchorId, fromBlockId: r.id, toBlockId: null, method: "removed", similarity: null })),
    ]);

    await tx.update(schema.documentVersions).set({ isCurrent: false }).where(and(eq(schema.documentVersions.documentId, doc.id), eq(schema.documentVersions.isCurrent, true)));
    await tx.update(schema.documentVersions).set({ isCurrent: true }).where(eq(schema.documentVersions.id, version.id));

    // Ověřit: zachovat stav existujících položek, nové přidat, zmizelé ponechat (historie)
    for (const v of parsed.verifications) {
      await tx
        .insert(schema.verifications)
        .values({ documentId: doc.id, versionId: version.id, blockKey: v.blockKey, text: v.text, textHash: hash(v.text) })
        .onConflictDoUpdate({ target: [schema.verifications.documentId, schema.verifications.textHash], set: { versionId: version.id, blockKey: v.blockKey } });
    }

    const methods: Record<string, number> = {};
    for (const a of assignments) methods[a.method] = (methods[a.method] ?? 0) + 1;
    if (removed.length) methods.removed = removed.length;

    await tx.insert(schema.events).values({
      entity: "import",
      entityId: version.id,
      action: "imported",
      actor: input.actor ?? "import",
      payload: { slug: input.slug, blocks: rows.length, verifications: parsed.verifications.length, sourceHash, previousVersionId: current?.id ?? null, anchors: methods },
    });
    return { status: "imported", documentId: doc.id, versionId: version.id, blocks: rows.length, verifications: parsed.verifications.length, methods };
  });
}

/** Kódy z registru opatření: první výskyt v registru vyhrává, ostatní doplní label. */
export async function upsertCodes(db: AnyDb, codeRows: CodeRow[], gates: Record<string, string>, familyOf: (code: string) => string) {
  const seen = new Map<string, CodeRow>();
  for (const r of codeRows) {
    const prev = seen.get(r.code);
    if (!prev || (!prev.layer && r.layer)) seen.set(r.code, r);
  }
  for (const [code, label] of Object.entries(gates)) {
    if (!seen.has(code)) seen.set(code, { code, label, layer: "Brána", meta: {} });
  }
  const existing = seen.size ? await db.select({ code: schema.codes.code }).from(schema.codes).where(inArray(schema.codes.code, [...seen.keys()])) : [];
  const existingSet = new Set(existing.map((e) => e.code));
  for (const r of seen.values()) {
    const family = familyOf(r.code);
    const layer = r.layer ?? (family === "H" || family === "D" ? "Ukazatel" : family === "R" ? "Riziko" : family === "B" ? "Brána" : null);
    const values = { code: r.code, family, label: r.label || null, layer, pillar: r.pillar ?? null, meta: r.meta };
    if (existingSet.has(r.code)) await db.update(schema.codes).set(values).where(eq(schema.codes.code, r.code));
    else await db.insert(schema.codes).values(values);
  }
  return seen.size;
}

/** Bloky bez kotvy (pro kontrolu po migraci). */
export async function countBlocksWithoutAnchor(db: AnyDb, documentId: number) {
  const rows = await db.select({ id: schema.blocks.id }).from(schema.blocks).where(and(eq(schema.blocks.documentId, documentId), isNull(schema.blocks.anchorId)));
  return rows.length;
}
