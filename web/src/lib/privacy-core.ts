/**
 * Ochrana veřejných připomínek a osobních údajů: omezení počtu odeslání, potvrzení
 * e-mailem, export a výmaz na žádost a pravidelné mazání podle lhůt uchování.
 * Funkce dostávají databázi zvenku (produkce: WebSocket pool, testy: PGlite);
 * tajemství pro HMAC se předává parametrem, takže jdou testovat bez prostředí.
 */
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { and, asc, eq, gt, inArray, isNotNull, isNull, lt, sql } from "drizzle-orm";
import * as schema from "@/db/schema";
import type { AnyDb } from "@/db/pool";

/** Lhůty uchování; stejná čísla uvádí stránka /ochrana-udaju. */
export const RETENTION = {
  /** Nepotvrzená připomínka se smaže (dny od odeslání). */
  unverifiedDays: 7,
  /** Záznamy limitů (hash adresy IP nebo e-mailu) se smažou (dny). */
  rateHitsDays: 30,
  /** Jméno a e-mail u veřejné připomínky se odstraní (měsíce od odeslání). */
  personalMonths: 24,
} as const;

/** Platnost odkazu na vlastní údaje (hodiny). */
export const DATA_LINK_HOURS = 24;

export const ERASED_NAME = "smazáno na žádost";
export const ANONYMIZED_NAME = "anonymizováno";
export const ERASED_BODY = "[Text připomínky byl smazán na žádost autora.]";

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/** HMAC hodnoty (adresa IP, e-mail) se serverovým tajemstvím: z uloženého klíče adresu nezjistíte. */
export function keyHash(secret: string, value: string): string {
  return createHmac("sha256", secret).update(value.trim().toLowerCase()).digest("hex");
}

/** První adresa z hlavičky x-forwarded-for (Vercel ji nastavuje), jinak x-real-ip. */
export function clientIp(h: { get(name: string): string | null }): string {
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "").trim() || "neznama";
}

export type Limit = { windowS: number; max: number };

/**
 * Zapíše pokus a vrátí true, když se vejde do všech limitů. Pokus přes limit se nezapisuje,
 * takže čekání limit uvolní. Kontrola a zápis běží pod transakčním zámkem na klíč, aby
 * souběžné požadavky nepřečetly stejný stav a neprošly všechny přes limit.
 */
export async function hitLimit(db: AnyDb, scope: string, key: string, limits: Limit[]): Promise<boolean> {
  const longest = Math.max(...limits.map((l) => l.windowS));
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${`${scope}:${key}`}, 0))`);
    const rows = await tx
      .select({ createdAt: schema.rateHits.createdAt })
      .from(schema.rateHits)
      .where(and(eq(schema.rateHits.scope, scope), eq(schema.rateHits.keyHash, key), gt(schema.rateHits.createdAt, sql`now() - make_interval(secs => ${longest})`)));
    const now = Date.now();
    for (const l of limits) {
      const n = rows.filter((r) => now - r.createdAt.getTime() < l.windowS * 1000).length;
      if (n >= l.max) return false;
    }
    await tx.insert(schema.rateHits).values({ scope, keyHash: key });
    return true;
  });
}

const URL_RE = /(https?:\/\/|www\.)\S+/gi;
const MAX_LINKS = 3;

/** Důvod odmítnutí jako spam, nebo null. Text pro uživatele. */
export function spamReason(body: string): string | null {
  if ((body.match(URL_RE) ?? []).length > MAX_LINKS) return `Připomínka obsahuje víc než ${MAX_LINKS} odkazy. Uveďte prosím jen zdroje, o které se opírá.`;
  return null;
}

/** Nový token do potvrzovacího odkazu a jeho hash pro databázi. */
export function newVerifyToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: sha256(token) };
}

export const verifyTokenHash = (token: string) => sha256(token);

/** Je od stejného e-mailu za posledních 24 hodin připomínka se stejným textem? */
export async function isDuplicate(db: AnyDb, email: string, body: string): Promise<boolean> {
  const rows = await db
    .select({ id: schema.comments.id })
    .from(schema.comments)
    .where(and(eq(schema.comments.email, email), eq(schema.comments.body, body), gt(schema.comments.createdAt, sql`now() - interval '24 hours'`)))
    .limit(1);
  return rows.length > 0;
}

export type Confirmed = { id: number; name: string; email: string | null; organization: string | null; body: string; quote: string | null; anchorId: string | null };

/**
 * Potvrdí veřejnou připomínku podle tokenu z e-mailu. Vrací null, když token neplatí,
 * připomínka už potvrzená je, nebo odkaz vypršel (po lhůtě se nepotvrzená maže).
 */
export async function confirmComment(db: AnyDb, token: string): Promise<Confirmed | null> {
  if (!token || token.length > 200) return null;
  return db.transaction(async (tx) => {
    const [row] = await tx
      .update(schema.comments)
      .set({ verifyTokenHash: null, updatedAt: new Date() })
      .where(and(eq(schema.comments.verifyTokenHash, verifyTokenHash(token)), gt(schema.comments.createdAt, sql`now() - make_interval(days => ${RETENTION.unverifiedDays})`)))
      .returning({
        id: schema.comments.id,
        name: schema.comments.authorName,
        email: schema.comments.email,
        organization: schema.comments.organization,
        body: schema.comments.body,
        quote: schema.comments.quote,
        anchorId: schema.comments.anchorId,
      });
    if (!row) return null;
    await tx.insert(schema.events).values({ entity: "comment", entityId: row.id, action: "email_verified", actor: "system", payload: {} });
    return row;
  });
}

/** Smaže nepotvrzenou připomínku (např. když se potvrzovací e-mail nepodařilo odeslat). */
export async function dropUnverified(db: AnyDb, id: number): Promise<void> {
  await db.transaction(async (tx) => {
    const gone = await tx.delete(schema.comments).where(and(eq(schema.comments.id, id), isNotNull(schema.comments.verifyTokenHash))).returning({ id: schema.comments.id });
    if (gone.length) await tx.delete(schema.events).where(and(eq(schema.events.entity, "comment"), eq(schema.events.entityId, id)));
  });
}

// ---------- Odkaz na vlastní údaje (export a výmaz) ----------

/** Podepsaný token s e-mailem a platností; nic se kvůli němu neukládá. */
/**
 * Podepsaný token s e-mailem, účelem a platností; nic se kvůli němu neukládá.
 * Účel je součástí podpisu, takže odkaz pro jeden účel nejde použít pro jiný.
 */
export function signToken(secret: string, purpose: string, email: string, hours: number, now = Date.now()): string {
  const body = Buffer.from(JSON.stringify({ e: email, x: Math.floor(now / 1000) + hours * 3600 })).toString("base64url");
  const sig = createHmac("sha256", secret).update(`${purpose}.${body}`).digest("base64url");
  return `${body}.${sig}`;
}

/** E-mail z platného tokenu daného účelu, jinak null. */
export function openToken(secret: string, purpose: string, token: string | undefined, now = Date.now()): string | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret).update(`${purpose}.${body}`).digest();
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { e?: string; x?: number };
    if (!data.e || !data.x || data.x * 1000 < now) return null;
    return data.e;
  } catch {
    return null;
  }
}

/** Odkaz na vlastní údaje (export a výmaz). */
export const signDataToken = (secret: string, email: string, now = Date.now()) => signToken(secret, "udaje", email, DATA_LINK_HOURS, now);
export const openDataToken = (secret: string, token: string | undefined, now = Date.now()) => openToken(secret, "udaje", token, now);

/** Všechny připomínky s daným e-mailem, jak je evidujeme (pro náhled a stažení). */
export async function exportPersonalData(db: AnyDb, email: string) {
  const rows = await db
    .select({
      c: schema.comments,
      document: schema.documents.title,
      version: schema.documentVersions.label,
    })
    .from(schema.comments)
    .innerJoin(schema.documents, eq(schema.documents.id, schema.comments.documentId))
    .innerJoin(schema.documentVersions, eq(schema.documentVersions.id, schema.comments.versionId))
    .where(eq(schema.comments.email, email))
    .orderBy(asc(schema.comments.createdAt));
  const ids = rows.map((r) => r.c.id);
  const resolutions = ids.length ? await db.select().from(schema.resolutions).where(inArray(schema.resolutions.commentId, ids)) : [];
  return {
    email,
    exportedAt: new Date().toISOString(),
    comments: rows.map(({ c, document, version }) => ({
      id: c.id,
      submittedAt: c.createdAt.toISOString(),
      confirmed: c.verifyTokenHash === null,
      document,
      version,
      quote: c.quote,
      kind: c.kind,
      body: c.body,
      name: c.authorName,
      organization: c.organization,
      status: c.status,
      resolution: resolutions.filter((r) => r.commentId === c.id).map((r) => ({ outcome: r.outcome, reasoning: r.reasoning, date: r.createdAt.toISOString() })),
    })),
  };
}

/** Z auditních záznamů připomínek odstraní e-mail a jméno autora. */
async function scrubEvents(tx: AnyDb, ids: number[]) {
  if (!ids.length) return;
  await tx
    .update(schema.events)
    .set({
      actor: sql`case when ${schema.events.actor} like 'verejnost:%' then 'verejnost' else ${schema.events.actor} end`,
      payload: sql`case when ${schema.events.payload} ? 'to' then ${schema.events.payload} - 'to' else ${schema.events.payload} end`,
    })
    .where(and(eq(schema.events.entity, "comment"), inArray(schema.events.entityId, ids)));
}

/**
 * Výmaz na žádost: nepotvrzené připomínky zmizí celé, u ostatních zůstane jen záznam
 * pro vypořádání (číslo, druh, místo ve studii, stav) bez jména, e-mailu, organizace a textu.
 */
export async function erasePersonalData(db: AnyDb, email: string): Promise<{ erased: number; deleted: number }> {
  return db.transaction(async (tx) => {
    const t = tx as unknown as AnyDb;
    const pending = await tx
      .delete(schema.comments)
      .where(and(eq(schema.comments.email, email), isNotNull(schema.comments.verifyTokenHash)))
      .returning({ id: schema.comments.id });
    if (pending.length) await tx.delete(schema.events).where(and(eq(schema.events.entity, "comment"), inArray(schema.events.entityId, pending.map((p) => p.id))));
    const erased = await tx
      .update(schema.comments)
      .set({ authorName: ERASED_NAME, email: null, organization: null, body: ERASED_BODY, proposedText: null, source: null, anonymizedAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.comments.email, email))
      .returning({ id: schema.comments.id });
    const ids = erased.map((e) => e.id);
    await scrubEvents(t, ids);
    await tx.insert(schema.events).values({ entity: "privacy", action: "erased_on_request", actor: "verejnost", payload: { comments: ids, deletedPending: pending.length } });
    return { erased: ids.length, deleted: pending.length };
  });
}

/**
 * Mazání podle lhůt uchování (spouští se denně):
 * nepotvrzené připomínky po 7 dnech, záznamy limitů po 30 dnech,
 * jméno a e-mail veřejných připomínek po 24 měsících, prošlé odkazy pro přihlášení po dni.
 */
export async function applyRetention(db: AnyDb): Promise<{ unverified: number; rateHits: number; anonymized: number; loginTokens: number }> {
  return db.transaction(async (tx) => {
    const t = tx as unknown as AnyDb;
    const stale = await tx
      .delete(schema.comments)
      .where(and(isNotNull(schema.comments.verifyTokenHash), lt(schema.comments.createdAt, sql`now() - make_interval(days => ${RETENTION.unverifiedDays})`)))
      .returning({ id: schema.comments.id });
    if (stale.length) await tx.delete(schema.events).where(and(eq(schema.events.entity, "comment"), inArray(schema.events.entityId, stale.map((s) => s.id))));
    const hits = await tx
      .delete(schema.rateHits)
      .where(lt(schema.rateHits.createdAt, sql`now() - make_interval(days => ${RETENTION.rateHitsDays})`))
      .returning({ id: schema.rateHits.id });
    const old = await tx
      .update(schema.comments)
      .set({ authorName: ANONYMIZED_NAME, email: null, anonymizedAt: new Date() })
      .where(
        and(
          eq(schema.comments.channel, "verejnost"),
          isNull(schema.comments.anonymizedAt),
          lt(schema.comments.createdAt, sql`now() - make_interval(months => ${RETENTION.personalMonths})`),
        ),
      )
      .returning({ id: schema.comments.id });
    await scrubEvents(t, old.map((o) => o.id));
    // Odkazy pro přihlášení do interní části: po vypršení k ničemu, den po něm pryč.
    const tokens = await tx
      .delete(schema.loginTokens)
      .where(lt(schema.loginTokens.expiresAt, sql`now() - interval '1 day'`))
      .returning({ id: schema.loginTokens.id });
    const result = { unverified: stale.length, rateHits: hits.length, anonymized: old.length, loginTokens: tokens.length };
    if (result.unverified || result.rateHits || result.anonymized || result.loginTokens) await tx.insert(schema.events).values({ entity: "privacy", action: "retention", actor: "system", payload: result });
    return result;
  });
}
