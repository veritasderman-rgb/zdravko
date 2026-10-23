"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { sealSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { CODE_RE } from "@/lib/codes";

export type ActionState = { error?: string; ok?: boolean };

function str(fd: FormData, key: string, max = 20000): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function login(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const code = str(fd, "code", 200);
  const name = str(fd, "name", 120);
  const organization = str(fd, "organization", 200);
  const next = str(fd, "next", 500) || "/rt";
  if (!process.env.ACCESS_CODE) return { error: "Přístupový kód není nastaven na serveru." };
  if (code !== process.env.ACCESS_CODE) return { error: "Nesprávný přístupový kód." };
  if (name.length < 2) return { error: "Zadejte jméno, pod kterým se budou vaše připomínky evidovat." };
  const token = await sealSession({ name, organization, role: "rt" });
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);
  // jen lokální absolutní cesta; "//host" nebo "/\\host" by byl otevřený redirect
  redirect(/^\/(?![\/\\])/.test(next) ? next : "/rt");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/vstup");
}

const KINDS = new Set(["cislo", "vecna", "zneni", "zdroj", "pravni", "otazka", "podpora", "redakcni"]);
const SEVERITIES = new Set(["zasadni", "doporucujici", "redakcni"]);

export async function addComment(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "Přihlášení vypršelo." };

  const documentId = Number(fd.get("documentId"));
  const versionId = Number(fd.get("versionId"));
  const blockKey = str(fd, "blockKey", 300);
  const slug = str(fd, "slug", 100);
  const kind = str(fd, "kind", 20);
  const severity = str(fd, "severity", 20);
  const body = str(fd, "body");
  const proposedText = str(fd, "proposedText");
  const source = str(fd, "source", 2000);
  const quote = str(fd, "quote", 2000);
  const codesRaw = str(fd, "codes", 500);
  const onBehalf = str(fd, "onBehalf", 20) === "organizace" ? "organizace" : "osoba";
  const needsVerification = fd.get("needsVerification") === "on";

  if (!documentId || !versionId || !blockKey) return { error: "Chybí vazba na blok dokumentu." };
  if (!KINDS.has(kind)) return { error: "Vyberte typ připomínky." };
  if (!SEVERITIES.has(severity)) return { error: "Vyberte závažnost." };
  if (body.length < 5) return { error: "Napište text připomínky." };
  if (onBehalf === "organizace" && !session.organization) return { error: "Pro připomínku za organizaci musíte mít organizaci vyplněnou při vstupu." };

  const codes = [...new Set([...codesRaw.matchAll(CODE_RE)].map((m) => m[1]))];

  const [row] = await db
    .insert(schema.comments)
    .values({
      documentId,
      versionId,
      blockKey,
      quote: quote || null,
      kind: kind as never,
      severity: severity as never,
      body,
      proposedText: proposedText || null,
      source: source || null,
      needsVerification,
      codes,
      authorName: session.name,
      organization: session.organization || null,
      onBehalf,
    })
    .returning({ id: schema.comments.id });

  await db.insert(schema.events).values({ entity: "comment", entityId: row.id, action: "created", actor: session.name, payload: { blockKey, kind, severity } });

  revalidatePath(`/d/${slug}`);
  revalidatePath("/pripominky");
  revalidatePath("/rt");
  return { ok: true };
}

export async function addReply(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "Přihlášení vypršelo." };
  const parentId = Number(fd.get("parentId"));
  const body = str(fd, "body");
  const slug = str(fd, "slug", 100);
  if (!parentId || body.length < 2) return { error: "Napište odpověď." };
  const parent = await db.query.comments.findFirst({ where: eq(schema.comments.id, parentId) });
  if (!parent) return { error: "Připomínka nenalezena." };
  await db.insert(schema.comments).values({
    documentId: parent.documentId,
    versionId: parent.versionId,
    blockKey: parent.blockKey,
    kind: "otazka",
    severity: "redakcni",
    body,
    codes: parent.codes,
    authorName: session.name,
    organization: session.organization || null,
    parentId,
  });
  revalidatePath(`/d/${slug}`);
  return { ok: true };
}

const STATUSES = new Set(["nova", "prirazena", "v_reseni", "navrh_vyporadani", "zkontrolovano", "vyporadana", "zverejnena"]);

export async function updateCommentStatus(fd: FormData): Promise<void> {
  const session = await getSession();
  if (!session) return;
  const id = Number(fd.get("id"));
  const status = str(fd, "status", 30);
  const assignee = str(fd, "assignee", 120);
  const topic = str(fd, "topic", 120);
  if (!id || !STATUSES.has(status)) return;
  await db
    .update(schema.comments)
    .set({ status: status as never, assignee: assignee || null, topic: topic || null, updatedAt: new Date() })
    .where(eq(schema.comments.id, id));
  await db.insert(schema.events).values({ entity: "comment", entityId: id, action: "status", actor: session.name, payload: { status, assignee, topic } });
  revalidatePath("/pripominky");
  const slug = str(fd, "slug", 100);
  if (slug) revalidatePath(`/d/${slug}`);
}

const VSTATUS = new Set(["otevreno", "overeno_potvrzeno", "overeno_opraveno", "neoveritelne"]);

export async function updateVerification(fd: FormData): Promise<void> {
  const session = await getSession();
  if (!session) return;
  const id = Number(fd.get("id"));
  const status = str(fd, "status", 30);
  const assignee = str(fd, "assignee", 120);
  const note = str(fd, "note", 4000);
  if (!id || !VSTATUS.has(status)) return;
  await db
    .update(schema.verifications)
    .set({ status: status as never, assignee: assignee || null, note: note || null, updatedAt: new Date() })
    .where(eq(schema.verifications.id, id));
  await db.insert(schema.events).values({ entity: "verification", entityId: id, action: "status", actor: session.name, payload: { status, assignee } });
  revalidatePath("/overit");
}
