import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db, schema } from "@/db";
import { can, type Permission } from "./roles";
import { openSession, SESSION_COOKIE, type Session } from "./session";

/**
 * Přihlášený člověk podle podepsané cookie, s aktuálním jménem a rolí z databáze.
 * Deaktivovaný účet nebo změněná role platí hned, ne až po vypršení cookie.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const s = await openSession(token);
  if (!s) return null;
  const [u] = await db
    .select({ name: schema.users.name, organization: schema.users.organization, role: schema.users.role })
    .from(schema.users)
    .where(and(eq(schema.users.id, s.uid), eq(schema.users.active, true)));
  if (!u) return null;
  return { ...s, name: u.name, organization: u.organization ?? "", role: u.role };
});

export async function requireSession(): Promise<Session> {
  const s = await getSession();
  if (!s) redirect("/vstup");
  return s;
}

/** Stránka jen pro roli s daným oprávněním; ostatní vrátí na přehled. */
export async function requirePermission(perm: Permission): Promise<Session> {
  const s = await requireSession();
  if (!can(s.role, perm)) redirect("/rt");
  return s;
}
