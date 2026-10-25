/**
 * Osobní účty interní části: lidé s rolí, přihlášení jednorázovým odkazem z e-mailu
 * a správa lidí koordinátorem. Databázi dostávají funkce zvenku (produkce: pool, testy: PGlite).
 */
import { and, eq, gt, isNull, lt, ne, sql } from "drizzle-orm";
import * as schema from "@/db/schema";
import type { AnyDb } from "@/db/pool";
import { newVerifyToken, verifyTokenHash } from "@/lib/privacy-core";
import { isRole, type Role } from "@/lib/roles";

/** Platnost odkazu pro přihlášení (minuty). */
export const LOGIN_LINK_MINUTES = 20;

export class AccountError extends Error {}

export type User = typeof schema.users.$inferSelect;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const normEmail = (e: string) => e.trim().toLowerCase();

export async function getActiveUser(db: AnyDb, id: number): Promise<User | null> {
  const [u] = await db.select().from(schema.users).where(and(eq(schema.users.id, id), eq(schema.users.active, true)));
  return u ?? null;
}

export type UserInput = { email: string; name: string; organization?: string | null; role: string; active?: boolean };

function validate(u: UserInput): { email: string; name: string; organization: string | null; role: Role } {
  const email = normEmail(u.email);
  const name = u.name.trim();
  if (!EMAIL_RE.test(email)) throw new AccountError("Zadejte platný e-mail.");
  if (name.length < 2) throw new AccountError("Zadejte jméno a příjmení.");
  if (!isRole(u.role)) throw new AccountError("Vyberte roli.");
  return { email, name, organization: u.organization?.trim() || null, role: u.role };
}

/** Koordinátor musí zůstat aspoň jeden, jinak by nikdo nemohl spravovat lidi. */
async function assertKeepsCoordinator(tx: AnyDb, userId: number) {
  const [{ n }] = await tx
    .select({ n: sql<number>`count(*)::int` })
    .from(schema.users)
    .where(and(eq(schema.users.role, "koordinator"), eq(schema.users.active, true), ne(schema.users.id, userId)));
  if (n === 0) throw new AccountError("Musí zůstat aspoň jeden aktivní koordinátor.");
}

/** Založí člověka, nebo podle e-mailu upraví existujícího (jméno, organizace, role, aktivní). */
export async function upsertUser(db: AnyDb, input: UserInput, actor: string): Promise<User> {
  const v = validate(input);
  const active = input.active ?? true;
  return db.transaction(async (tx) => {
    const t = tx as unknown as AnyDb;
    const [existing] = await tx.select().from(schema.users).where(eq(schema.users.email, v.email));
    if (existing && existing.role === "koordinator" && existing.active && (v.role !== "koordinator" || !active)) await assertKeepsCoordinator(t, existing.id);
    const [row] = existing
      ? await tx.update(schema.users).set({ ...v, active }).where(eq(schema.users.id, existing.id)).returning()
      : await tx.insert(schema.users).values({ ...v, active }).returning();
    await tx.insert(schema.events).values({
      entity: "user",
      entityId: row.id,
      action: existing ? "updated" : "created",
      actor,
      payload: { role: row.role, active: row.active, ...(existing && existing.role !== row.role ? { from: existing.role } : {}) },
    });
    return row;
  });
}

/** Změna role nebo aktivity existujícího člověka (správa lidí). */
export async function updateUser(db: AnyDb, id: number, change: { role?: string; active?: boolean }, actor: string): Promise<User> {
  if (change.role !== undefined && !isRole(change.role)) throw new AccountError("Vyberte roli.");
  return db.transaction(async (tx) => {
    const t = tx as unknown as AnyDb;
    const [u] = await tx.select().from(schema.users).where(eq(schema.users.id, id));
    if (!u) throw new AccountError("Člověk nenalezen.");
    const role = (change.role as Role | undefined) ?? u.role;
    const active = change.active ?? u.active;
    if (u.role === "koordinator" && u.active && (role !== "koordinator" || !active)) await assertKeepsCoordinator(t, u.id);
    const [row] = await tx.update(schema.users).set({ role, active }).where(eq(schema.users.id, id)).returning();
    // Deaktivovaný člověk se nesmí přihlásit ani starým odkazem.
    if (!active) await tx.delete(schema.loginTokens).where(eq(schema.loginTokens.userId, id));
    await tx.insert(schema.events).values({ entity: "user", entityId: id, action: "updated", actor, payload: { role, active, from: { role: u.role, active: u.active } } });
    return row;
  });
}

/**
 * Odkaz pro přihlášení: jen pro aktivního člověka; vrací token (do e-mailu) a člověka,
 * jinak null. Volající odpovídá vždy stejně, aby formulář neprozrazoval, kdo má účet.
 */
export async function createLoginToken(db: AnyDb, email: string): Promise<{ token: string; user: User } | null> {
  const [user] = await db.select().from(schema.users).where(and(eq(schema.users.email, normEmail(email)), eq(schema.users.active, true)));
  if (!user) return null;
  const t = newVerifyToken();
  await db.delete(schema.loginTokens).where(and(eq(schema.loginTokens.userId, user.id), lt(schema.loginTokens.expiresAt, sql`now()`)));
  await db.insert(schema.loginTokens).values({ userId: user.id, tokenHash: t.hash, expiresAt: sql`now() + make_interval(mins => ${LOGIN_LINK_MINUTES})` });
  return { token: t.token, user };
}

/** Použije odkaz pro přihlášení (jen jednou, jen v platnosti, jen pro aktivního člověka). */
export async function consumeLoginToken(db: AnyDb, token: string): Promise<User | null> {
  if (!token || token.length > 200) return null;
  return db.transaction(async (tx) => {
    const [t] = await tx
      .update(schema.loginTokens)
      .set({ usedAt: sql`now()` })
      .where(and(eq(schema.loginTokens.tokenHash, verifyTokenHash(token)), isNull(schema.loginTokens.usedAt), gt(schema.loginTokens.expiresAt, sql`now()`)))
      .returning({ userId: schema.loginTokens.userId });
    if (!t) return null;
    const [user] = await tx
      .update(schema.users)
      .set({ lastLoginAt: sql`now()` })
      .where(and(eq(schema.users.id, t.userId), eq(schema.users.active, true)))
      .returning();
    if (!user) return null;
    await tx.insert(schema.events).values({ entity: "user", entityId: user.id, action: "login", actor: user.name, payload: {} });
    return user;
  });
}
