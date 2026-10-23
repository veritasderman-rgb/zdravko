import "server-only";
import { and, asc, count, desc, eq, inArray, sql as dsql } from "drizzle-orm";
import { db, schema } from "@/db";

export async function listDocumentsWithStats() {
  const docs = await db.select().from(schema.documents).orderBy(asc(schema.documents.sort));
  const versions = await db
    .select()
    .from(schema.documentVersions)
    .where(eq(schema.documentVersions.isCurrent, true));
  const blockCounts = await db
    .select({ documentId: schema.blocks.documentId, n: count() })
    .from(schema.blocks)
    .innerJoin(schema.documentVersions, eq(schema.blocks.versionId, schema.documentVersions.id))
    .where(eq(schema.documentVersions.isCurrent, true))
    .groupBy(schema.blocks.documentId);
  const commentCounts = await db
    .select({ documentId: schema.comments.documentId, n: count(), open: count(dsql`case when ${schema.comments.status} not in ('vyporadana','zverejnena') then 1 end`) })
    .from(schema.comments)
    .groupBy(schema.comments.documentId);
  const verifyCounts = await db
    .select({ documentId: schema.verifications.documentId, n: count(), open: count(dsql`case when ${schema.verifications.status} = 'otevreno' then 1 end`) })
    .from(schema.verifications)
    .groupBy(schema.verifications.documentId);
  return docs.map((d) => ({
    ...d,
    version: versions.find((v) => v.documentId === d.id) ?? null,
    blocks: blockCounts.find((b) => b.documentId === d.id)?.n ?? 0,
    comments: commentCounts.find((c) => c.documentId === d.id) ?? { n: 0, open: 0 },
    verifications: verifyCounts.find((c) => c.documentId === d.id) ?? { n: 0, open: 0 },
  }));
}

export async function getDocumentBySlug(slug: string) {
  const doc = await db.query.documents.findFirst({ where: eq(schema.documents.slug, slug) });
  if (!doc) return null;
  const version = await db.query.documentVersions.findFirst({
    where: and(eq(schema.documentVersions.documentId, doc.id), eq(schema.documentVersions.isCurrent, true)),
  });
  if (!version) return null;
  return { doc, version };
}

export async function getBlocks(versionId: number) {
  return db.select().from(schema.blocks).where(eq(schema.blocks.versionId, versionId)).orderBy(asc(schema.blocks.ordinal));
}

export async function getCommentCountsByBlock(documentId: number) {
  const rows = await db
    .select({ blockKey: schema.comments.blockKey, n: count(), open: count(dsql`case when ${schema.comments.status} not in ('vyporadana','zverejnena') then 1 end`) })
    .from(schema.comments)
    .where(and(eq(schema.comments.documentId, documentId), dsql`${schema.comments.parentId} is null`))
    .groupBy(schema.comments.blockKey);
  return new Map(rows.map((r) => [r.blockKey, { n: r.n, open: r.open }]));
}

export async function getCommentsForBlock(documentId: number, blockKey: string) {
  return db
    .select()
    .from(schema.comments)
    .where(and(eq(schema.comments.documentId, documentId), eq(schema.comments.blockKey, blockKey)))
    .orderBy(asc(schema.comments.createdAt));
}

export interface CommentFilter {
  doc?: string;
  status?: string;
  severity?: string;
  kind?: string;
  code?: string;
  q?: string;
  channel?: string;
}

export async function listComments(f: CommentFilter) {
  const conds = [dsql`${schema.comments.parentId} is null`];
  if (f.doc) conds.push(eq(schema.documents.slug, f.doc));
  if (f.status) conds.push(eq(schema.comments.status, f.status as never));
  if (f.severity) conds.push(eq(schema.comments.severity, f.severity as never));
  if (f.kind) conds.push(eq(schema.comments.kind, f.kind as never));
  if (f.code) conds.push(dsql`${f.code} = any(${schema.comments.codes})`);
  if (f.channel) conds.push(eq(schema.comments.channel, f.channel));
  if (f.q) conds.push(dsql`(${schema.comments.body} ilike ${"%" + f.q + "%"} or ${schema.comments.quote} ilike ${"%" + f.q + "%"})`);
  return db
    .select({
      c: schema.comments,
      docSlug: schema.documents.slug,
      docTitle: schema.documents.title,
      headingPath: schema.blocks.headingPath,
    })
    .from(schema.comments)
    .innerJoin(schema.documents, eq(schema.comments.documentId, schema.documents.id))
    .leftJoin(schema.blocks, and(eq(schema.blocks.versionId, schema.comments.versionId), eq(schema.blocks.blockKey, schema.comments.blockKey)))
    .where(and(...conds))
    .orderBy(desc(schema.comments.createdAt))
    .limit(500);
}

export async function commentStats() {
  const byStatus = await db.select({ status: schema.comments.status, n: count() }).from(schema.comments).where(dsql`${schema.comments.parentId} is null`).groupBy(schema.comments.status);
  const bySeverity = await db.select({ severity: schema.comments.severity, n: count() }).from(schema.comments).where(dsql`${schema.comments.parentId} is null`).groupBy(schema.comments.severity);
  return { byStatus, bySeverity };
}

export async function listVerifications(status?: string) {
  // jen položky navázané na aktuální verzi dokumentu; zmizelé zůstávají v tabulce jako historie
  const conds = [eq(schema.documentVersions.isCurrent, true)];
  if (status) conds.push(eq(schema.verifications.status, status as never));
  return db
    .select({ v: schema.verifications, docSlug: schema.documents.slug, docTitle: schema.documents.title, headingPath: schema.blocks.headingPath })
    .from(schema.verifications)
    .innerJoin(schema.documentVersions, eq(schema.verifications.versionId, schema.documentVersions.id))
    .innerJoin(schema.documents, eq(schema.verifications.documentId, schema.documents.id))
    .leftJoin(schema.blocks, and(eq(schema.blocks.versionId, schema.verifications.versionId), eq(schema.blocks.blockKey, schema.verifications.blockKey)))
    .where(and(...conds))
    .orderBy(asc(schema.documents.sort), asc(schema.blocks.ordinal));
}

export async function listCodesWithCounts() {
  const codes = await db.select().from(schema.codes);
  // unnest až po joinu na verze; čárkový FROM před JOIN by v ON neviděl tabulku blocks
  const blockRows = (await db.execute(dsql`
    select c.code as code, count(*)::int as n
    from ${schema.blocks} b
    join ${schema.documentVersions} v on v.id = b.version_id and v.is_current = true
    cross join lateral unnest(b.codes) as c(code)
    group by c.code`)).rows as { code: string; n: number }[];
  const commentRows = (await db.execute(dsql`
    select c.code as code, count(*)::int as n
    from ${schema.comments} k
    cross join lateral unnest(k.codes) as c(code)
    where k.parent_id is null
    group by c.code`)).rows as { code: string; n: number }[];
  const blockCounts = new Map(blockRows.map((r) => [r.code, r.n]));
  const commentCounts = new Map(commentRows.map((r) => [r.code, r.n]));
  return codes.map((c) => ({
    ...c,
    blocks: blockCounts.get(c.code) ?? 0,
    comments: commentCounts.get(c.code) ?? 0,
  }));
}

export async function getCode(code: string) {
  const c = await db.query.codes.findFirst({ where: eq(schema.codes.code, code) });
  const blocks = await db
    .select({ b: schema.blocks, docSlug: schema.documents.slug, docTitle: schema.documents.title })
    .from(schema.blocks)
    .innerJoin(schema.documentVersions, eq(schema.blocks.versionId, schema.documentVersions.id))
    .innerJoin(schema.documents, eq(schema.blocks.documentId, schema.documents.id))
    .where(and(eq(schema.documentVersions.isCurrent, true), dsql`${code} = any(${schema.blocks.codes})`))
    .orderBy(asc(schema.documents.sort), asc(schema.blocks.ordinal));
  const comments = await listComments({ code });
  return { code: c ?? null, blocks, comments };
}

export async function getCodesMap(list: string[]) {
  if (!list.length) return new Map<string, string | null>();
  const rows = await db.select({ code: schema.codes.code, label: schema.codes.label }).from(schema.codes).where(inArray(schema.codes.code, list));
  return new Map(rows.map((r) => [r.code, r.label]));
}
