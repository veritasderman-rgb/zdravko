import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { openSession, SESSION_COOKIE, type Session } from "./session";

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return openSession(token);
}

export async function requireSession(): Promise<Session> {
  const s = await getSession();
  if (!s) redirect("/vstup");
  return s;
}
