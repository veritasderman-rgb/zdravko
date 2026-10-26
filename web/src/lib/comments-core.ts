/**
 * Zápisy připomínek: jedna validace pro interní i veřejnou připomínku a každá změna
 * spolu se svým auditním záznamem v jedné transakci. Funkce dostávají databázi zvenku
 * (produkce: WebSocket pool, testy: PGlite), samy nesahají na cookies ani na formuláře.
 */
import { and, eq, isNull } from "drizzle-orm";
import * as schema from "@/db/schema";
import type { AnyDb } from "@/db/pool";
import { CODE_RE } from "@/lib/codes";
import { can, canSetStatus, type Role } from "@/lib/roles";

/** Chyba, jejíž text lze ukázat uživateli. */
export class CommentError extends Error {}

export const KINDS = ["cislo", "vecna", "zneni", "zdroj", "pravni", "otazka", "podpora", "redakcni"] as const;
export const PUBLIC_KINDS = ["vecna", "cislo", "zneni", "zdroj", "otazka", "podpora"] as const;
export const SEVERITIES = ["zasadni", "doporucujici", "redakcni"] as const;
export const STATUSES = ["nova", "prirazena", "v_reseni", "navrh_vyporadani", "zkontrolovano", "vyporadana", "zverejnena"] as const;
export const PRIORITIES = ["nizka", "bezna", "vysoka"] as const;
export const VSTATUSES = ["otevreno", "overeno_potvrzeno", "overeno_opraveno", "neoveritelne"] as const;

export const GENERAL = "obecne";
/** Návrh nového opatření (průvodce na /studie/navrhnout-opatreni); jako obecná připomínka nemá blok. */
export const PROPOSAL = "navrh-opatreni";
const QUOTE_MAX = 300;

type Kind = (typeof KINDS)[number];
type Severity = (typeof SEVERITIES)[number];

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

export type Target = {
  documentId: number;
  versionId: number;
  versionLabel: string;
  blockKey: string;
  block: { id: number; anchorId: string | null; text: string; textHash: string } | null;
};

/**
 * Ověří, že verze patří k dokumentu a blok k verzi. Klient posílá jen identifikátory;
 * text bloku, kotvu a úryvek bere server z databáze.
 */
export async function resolveTarget(db: AnyDb, input: { documentId: number; versionId: number; blockKey: string }): Promise<Target> {
  const { documentId, versionId } = input;
  const blockKey = input.blockKey || GENERAL;
  if (!Number.isInteger(documentId) || documentId <= 0 || !Number.isInteger(versionId) || versionId <= 0) {
    throw new CommentError("Chybí vazba na dokument. Obnovte prosím stránku.");
  }
  const [version] = await db
    .select({ id: schema.documentVersions.id, documentId: schema.documentVersions.documentId, label: schema.documentVersions.label })
    .from(schema.documentVersions)
    .where(eq(schema.documentVersions.id, versionId));
  if (!version || version.documentId !== documentId) throw new CommentError("Verze dokumentu neodpovídá. Obnovte prosím stránku.");
  if (blockKey === GENERAL || blockKey === PROPOSAL) return { documentId, versionId, versionLabel: version.label, blockKey, block: null };
  const [block] = await db
    .select({ id: schema.blocks.id, anchorId: schema.blocks.anchorId, text: schema.blocks.text, textHash: schema.blocks.textHash })
    .from(schema.blocks)
    .where(and(eq(schema.blocks.versionId, versionId), eq(schema.blocks.blockKey, blockKey)));
  if (!block) throw new CommentError("Odstavec, ke kterému píšete, v této verzi dokumentu není. Obnovte prosím stránku.");
  return { documentId, versionId, versionLabel: version.label, blockKey, block };
}

/** Úryvek musí být částí textu bloku; bez úryvku se vezme začátek bloku. */
export function pickQuote(block: Target["block"], quote: string | null | undefined): string | null {
  if (!block) return null;
  const q = norm(quote ?? "");
  if (!q) return block.text.slice(0, QUOTE_MAX);
  if (!norm(block.text).includes(q)) throw new CommentError("Úryvek není v textu odstavce, ke kterému píšete. Označte text uvnitř tohoto odstavce.");
  return q.slice(0, 2000);
}

export type NewComment = {
  documentId: number;
  versionId: number;
  blockKey: string;
  kind: string;
  severity: string;
  body: string;
  quote?: string | null;
  proposedText?: string | null;
  source?: string | null;
  needsVerification?: boolean;
  codesText?: string;
  authorName: string;
  organization?: string | null;
  onBehalf?: "osoba" | "organizace";
  email?: string | null;
  channel: "rt" | "verejnost";
  priority?: (typeof PRIORITIES)[number];
  /** Hash tokenu z potvrzovacího e-mailu; připomínka do potvrzení čeká mimo frontu týmu. */
  verifyTokenHash?: string | null;
  /** Účet autora interní připomínky. */
  authorUserId?: number | null;
  actor: string;
};

export type CreatedComment = { id: number; target: Target; quote: string | null };

export async function createComment(db: AnyDb, c: NewComment): Promise<CreatedComment> {
  const allowed: readonly string[] = c.channel === "verejnost" ? PUBLIC_KINDS : KINDS;
  if (!allowed.includes(c.kind)) throw new CommentError("Vyberte typ připomínky.");
  if (!(SEVERITIES as readonly string[]).includes(c.severity)) throw new CommentError("Vyberte závažnost.");
  if (norm(c.body).length < (c.channel === "verejnost" ? 10 : 5)) throw new CommentError("Napište text připomínky.");
  if (norm(c.authorName).length < 2) throw new CommentError("Chybí jméno autora.");
  if (c.onBehalf === "organizace" && !c.organization) throw new CommentError("Pro připomínku za organizaci musí být vyplněná organizace.");

  return db.transaction(async (tx) => {
    const t = tx as unknown as AnyDb;
    const target = await resolveTarget(t, c);
    const quote = pickQuote(target.block, c.quote);
    const codes = [...new Set([...`${c.codesText ?? ""} ${c.channel === "verejnost" ? c.body : ""}`.matchAll(CODE_RE)].map((m) => m[1]))];
    const [row] = await tx
      .insert(schema.comments)
      .values({
        documentId: target.documentId,
        versionId: target.versionId,
        blockKey: target.blockKey,
        anchorId: target.block?.anchorId ?? null,
        blockId: target.block?.id ?? null,
        blockText: target.block?.text ?? null,
        blockHash: target.block?.textHash ?? null,
        quote,
        kind: c.kind as Kind,
        severity: c.severity as Severity,
        body: c.body,
        proposedText: c.proposedText || null,
        source: c.source || null,
        needsVerification: !!c.needsVerification,
        codes,
        authorName: c.authorName,
        organization: c.organization || null,
        onBehalf: c.onBehalf ?? "osoba",
        email: c.email ?? null,
        channel: c.channel,
        priority: c.priority ?? (c.channel === "verejnost" ? "nizka" : "bezna"),
        verifyTokenHash: c.verifyTokenHash ?? null,
        authorUserId: c.authorUserId ?? null,
      })
      .returning({ id: schema.comments.id });
    await tx.insert(schema.events).values({
      entity: "comment",
      entityId: row.id,
      action: "created",
      actor: c.actor,
      payload: { blockKey: target.blockKey, anchorId: target.block?.anchorId ?? null, versionId: target.versionId, kind: c.kind, severity: c.severity, channel: c.channel },
    });
    return { id: row.id, target, quote };
  });
}

export async function createReply(db: AnyDb, r: { parentId: number; body: string; authorName: string; organization?: string | null; authorUserId?: number | null; actor: string }) {
  if (!Number.isInteger(r.parentId) || r.parentId <= 0 || norm(r.body).length < 2) throw new CommentError("Napište odpověď.");
  return db.transaction(async (tx) => {
    const [parent] = await tx.select().from(schema.comments).where(and(eq(schema.comments.id, r.parentId), isNull(schema.comments.parentId)));
    if (!parent) throw new CommentError("Připomínka nenalezena.");
    const [row] = await tx
      .insert(schema.comments)
      .values({
        documentId: parent.documentId,
        versionId: parent.versionId,
        blockKey: parent.blockKey,
        anchorId: parent.anchorId,
        blockId: parent.blockId,
        blockText: parent.blockText,
        blockHash: parent.blockHash,
        kind: "otazka",
        severity: "redakcni",
        body: r.body,
        codes: parent.codes,
        authorName: r.authorName,
        organization: r.organization || null,
        authorUserId: r.authorUserId ?? null,
        parentId: parent.id,
      })
      .returning({ id: schema.comments.id });
    await tx.insert(schema.events).values({ entity: "comment", entityId: row.id, action: "replied", actor: r.actor, payload: { parentId: parent.id } });
    return { id: row.id };
  });
}

/**
 * Změna stavu připomínky podle role: stav jen do povolených cílů (src/lib/roles.ts),
 * garanta, téma a prioritu jen s oprávněním třídit; jinak zůstávají, jak byly.
 */
export async function setCommentStatus(
  db: AnyDb,
  s: { id: number; status: string; assignee?: string; topic?: string; priority?: string; role: Role; actor: string },
) {
  if (!Number.isInteger(s.id) || s.id <= 0 || !(STATUSES as readonly string[]).includes(s.status)) throw new CommentError("Neplatná změna stavu.");
  const triage = can(s.role, "triage");
  const priority = (PRIORITIES as readonly string[]).includes(s.priority ?? "") ? (s.priority as (typeof PRIORITIES)[number]) : undefined;
  return db.transaction(async (tx) => {
    const [current] = await tx.select({ status: schema.comments.status }).from(schema.comments).where(eq(schema.comments.id, s.id));
    if (!current) throw new CommentError("Připomínka nenalezena.");
    if (!canSetStatus(s.role, current.status, s.status)) throw new CommentError("Do tohoto stavu připomínku vaše role posunout nemůže.");
    const fields = triage ? { assignee: s.assignee || null, topic: s.topic || null, ...(priority ? { priority } : {}) } : {};
    await tx
      .update(schema.comments)
      .set({ status: s.status as (typeof STATUSES)[number], ...fields, updatedAt: new Date() })
      .where(eq(schema.comments.id, s.id));
    await tx.insert(schema.events).values({ entity: "comment", entityId: s.id, action: "status", actor: s.actor, payload: { status: s.status, from: current.status, ...(triage ? { assignee: s.assignee || null, topic: s.topic || null, priority: priority ?? null } : {}) } });
  });
}

export async function setVerificationStatus(db: AnyDb, v: { id: number; status: string; assignee?: string; note?: string; role: Role; actor: string }) {
  if (!can(v.role, "verify")) throw new CommentError("Registr „Ověřit“ vaše role měnit nemůže.");
  if (!Number.isInteger(v.id) || v.id <= 0 || !(VSTATUSES as readonly string[]).includes(v.status)) throw new CommentError("Neplatná změna stavu.");
  return db.transaction(async (tx) => {
    const updated = await tx
      .update(schema.verifications)
      .set({ status: v.status as (typeof VSTATUSES)[number], assignee: v.assignee || null, note: v.note || null, updatedAt: new Date() })
      .where(eq(schema.verifications.id, v.id))
      .returning({ id: schema.verifications.id });
    if (!updated.length) throw new CommentError("Položka nenalezena.");
    await tx.insert(schema.events).values({ entity: "verification", entityId: v.id, action: "status", actor: v.actor, payload: { status: v.status, assignee: v.assignee || null } });
  });
}
