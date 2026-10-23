"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, count, eq, gt, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { sealSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { CODE_RE } from "@/lib/codes";
import { commentConfirmation, sendMail } from "@/lib/mail";

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
  const priorityRaw = str(fd, "priority", 20);
  const priority = PRIORITIES.has(priorityRaw) ? priorityRaw : undefined;
  if (!id || !STATUSES.has(status)) return;
  await db
    .update(schema.comments)
    .set({ status: status as never, assignee: assignee || null, topic: topic || null, ...(priority ? { priority } : {}), updatedAt: new Date() })
    .where(eq(schema.comments.id, id));
  await db.insert(schema.events).values({ entity: "comment", entityId: id, action: "status", actor: session.name, payload: { status, assignee, topic, priority } });
  revalidatePath("/pripominky");
  const slug = str(fd, "slug", 100);
  if (slug) revalidatePath(`/d/${slug}`);
}

const VSTATUS = new Set(["otevreno", "overeno_potvrzeno", "overeno_opraveno", "neoveritelne"]);
const PRIORITIES = new Set(["nizka", "bezna", "vysoka"]);
const PUBLIC_KINDS = new Set(["vecna", "cislo", "zneni", "zdroj", "otazka", "podpora"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Veřejná připomínka bez přihlášení: libovolné jméno a e-mail (nikdy se nezveřejňují).
 * Ukládá se s kanálem „verejnost“ a nízkou prioritou; tým ji může povýšit.
 */
export async function addPublicComment(_prev: ActionState, fd: FormData): Promise<ActionState> {
  // Past na roboty a příliš rychlé odeslání. Čas otevření formuláře musí být přítomný,
  // ne starší než den a aspoň 2,5 s před odesláním.
  if (str(fd, "website", 200)) return { ok: true };
  const ts = Number(fd.get("ts"));
  const age = Date.now() - ts;
  if (!Number.isFinite(ts) || ts <= 0 || age < 2500 || age > 24 * 60 * 60 * 1000) {
    return { error: "Formulář byl odeslán příliš rychle nebo vypršel. Obnovte prosím stránku a zkuste to znovu." };
  }

  const documentId = Number(fd.get("documentId"));
  const versionId = Number(fd.get("versionId"));
  const blockKey = str(fd, "blockKey", 300) || "obecne";
  const name = str(fd, "name", 80);
  const email = str(fd, "email", 200).toLowerCase();
  const organization = str(fd, "organization", 200);
  const kind = str(fd, "kind", 20);
  const body = str(fd, "body", 5000);

  if (!documentId || !versionId) return { error: "Chybí vazba na dokument. Obnovte prosím stránku." };
  if (name.length < 2) return { error: "Uveďte jméno nebo přezdívku (aspoň dva znaky)." };
  if (!EMAIL_RE.test(email)) return { error: "Zadejte platný e-mail." };
  if (!PUBLIC_KINDS.has(kind)) return { error: "Vyberte typ připomínky." };
  if (body.length < 10) return { error: "Napište připomínku (aspoň deset znaků)." };

  // Omezení na straně serveru: nejvýš 5 připomínek z jednoho e-mailu za 10 minut
  // a nejvýš 30 veřejných připomínek celkem za minutu.
  const verejnost = eq(schema.comments.channel, "verejnost");
  const [{ n: perEmail }] = await db
    .select({ n: count() })
    .from(schema.comments)
    .where(and(verejnost, eq(schema.comments.email, email), gt(schema.comments.createdAt, sql`now() - interval '10 minutes'`)));
  if (perEmail >= 5) return { error: "Z této adresy přišlo za posledních deset minut hodně připomínek. Zkuste to prosím později." };
  const [{ n: perMinute }] = await db
    .select({ n: count() })
    .from(schema.comments)
    .where(and(verejnost, gt(schema.comments.createdAt, sql`now() - interval '1 minute'`)));
  if (perMinute >= 30) return { error: "Právě přichází hodně připomínek najednou. Zkuste to prosím za chvíli." };

  const [version] = await db.select({ id: schema.documentVersions.id, documentId: schema.documentVersions.documentId, label: schema.documentVersions.label }).from(schema.documentVersions).where(eq(schema.documentVersions.id, versionId));
  if (!version || version.documentId !== documentId) return { error: "Verze dokumentu neodpovídá. Obnovte prosím stránku." };

  // Vazba na blok: buď obecná připomínka, nebo existující blok této verze; úryvek bereme
  // z uloženého textu bloku, ne z formuláře.
  let quote: string | null = null;
  if (blockKey !== "obecne") {
    const [block] = await db.select({ text: schema.blocks.text }).from(schema.blocks).where(and(eq(schema.blocks.versionId, versionId), eq(schema.blocks.blockKey, blockKey)));
    if (!block) return { error: "Odstavec, ke kterému píšete, v této verzi studie není. Obnovte prosím stránku." };
    quote = block.text.slice(0, 300);
  }

  const codes = [...new Set([...body.matchAll(CODE_RE)].map((m) => m[1]))];
  const [row] = await db
    .insert(schema.comments)
    .values({
      documentId,
      versionId,
      blockKey,
      quote,
      kind: kind as never,
      severity: "doporucujici",
      body,
      codes,
      authorName: name,
      email,
      organization: organization || null,
      onBehalf: "osoba",
      channel: "verejnost",
      priority: "nizka",
    })
    .returning({ id: schema.comments.id });
  await db.insert(schema.events).values({ entity: "comment", entityId: row.id, action: "created", actor: `verejnost: ${name}`, payload: { blockKey, kind, channel: "verejnost" } });

  // Potvrzení e-mailem; když selže, připomínka zůstává uložená.
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://web-b5qk.vercel.app";
  const studyUrl = blockKey === "obecne" ? `${site}/studie` : `${site}/studie#${encodeURIComponent(blockKey)}`;
  const mail = commentConfirmation({ name, id: row.id, body, quote: quote || null, studyUrl, versionLabel: version.label });
  const sent = await sendMail({ to: email, ...mail });
  if (sent) await db.insert(schema.events).values({ entity: "comment", entityId: row.id, action: "confirmation_sent", actor: "system", payload: { to: email } });
  const notify = process.env.COMMENT_NOTIFY_TO;
  if (notify) await sendMail({ to: notify, subject: `Nová veřejná připomínka č. ${row.id}`, text: `${name}${organization ? ` (${organization})` : ""}, ${email}\n\n${quote ? `K místu: „${quote}“\n\n` : ""}${body}\n\n${site}/pripominky?channel=verejnost` });

  revalidatePath("/pripominky");
  revalidatePath("/rt");
  return { ok: true };
}

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
