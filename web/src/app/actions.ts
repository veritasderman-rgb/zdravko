"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, count, eq, gt, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { sealSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { withPoolDb } from "@/db/pool";
import { CommentError, createComment, createReply, setCommentStatus, setVerificationStatus } from "@/lib/comments-core";
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

/** Chyby z jádra (validace) ukážeme uživateli, ostatní zalogujeme a vrátíme obecnou zprávu. */
function failure(e: unknown, fallback: string): ActionState {
  if (e instanceof CommentError) return { error: e.message };
  console.error(e);
  return { error: fallback };
}

export async function addComment(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "Přihlášení vypršelo." };
  const slug = str(fd, "slug", 100);
  try {
    await withPoolDb((db) =>
      createComment(db, {
        documentId: Number(fd.get("documentId")),
        versionId: Number(fd.get("versionId")),
        blockKey: str(fd, "blockKey", 300),
        kind: str(fd, "kind", 20),
        severity: str(fd, "severity", 20),
        body: str(fd, "body"),
        quote: str(fd, "quote", 2000),
        proposedText: str(fd, "proposedText"),
        source: str(fd, "source", 2000),
        needsVerification: fd.get("needsVerification") === "on",
        codesText: str(fd, "codes", 500),
        authorName: session.name,
        organization: session.organization || null,
        onBehalf: str(fd, "onBehalf", 20) === "organizace" ? "organizace" : "osoba",
        channel: "rt",
        actor: session.name,
      }),
    );
  } catch (e) {
    return failure(e, "Připomínku se nepodařilo uložit. Zkuste to prosím znovu.");
  }
  revalidatePath(`/d/${slug}`);
  revalidatePath("/pripominky");
  revalidatePath("/rt");
  return { ok: true };
}

export async function addReply(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "Přihlášení vypršelo." };
  const slug = str(fd, "slug", 100);
  try {
    await withPoolDb((db) => createReply(db, { parentId: Number(fd.get("parentId")), body: str(fd, "body"), authorName: session.name, organization: session.organization || null, actor: session.name }));
  } catch (e) {
    return failure(e, "Odpověď se nepodařilo uložit.");
  }
  revalidatePath(`/d/${slug}`);
  return { ok: true };
}

export async function updateCommentStatus(fd: FormData): Promise<void> {
  const session = await getSession();
  if (!session) return;
  try {
    await withPoolDb((db) =>
      setCommentStatus(db, {
        id: Number(fd.get("id")),
        status: str(fd, "status", 30),
        assignee: str(fd, "assignee", 120),
        topic: str(fd, "topic", 120),
        priority: str(fd, "priority", 20),
        actor: session.name,
      }),
    );
  } catch (e) {
    if (!(e instanceof CommentError)) console.error(e);
    return;
  }
  revalidatePath("/pripominky");
  const slug = str(fd, "slug", 100);
  if (slug) revalidatePath(`/d/${slug}`);
}

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

  let created: Awaited<ReturnType<typeof createComment>>;
  try {
    created = await withPoolDb((db) =>
      createComment(db, {
        documentId,
        versionId,
        blockKey,
        kind,
        severity: "doporucujici",
        body,
        authorName: name,
        email,
        organization: organization || null,
        onBehalf: "osoba",
        channel: "verejnost",
        priority: "nizka",
        actor: `verejnost: ${name}`,
      }),
    );
  } catch (e) {
    return failure(e, "Připomínku se nepodařilo uložit. Zkuste to prosím znovu.");
  }
  const row = { id: created.id };
  const quote = created.quote;
  const version = { label: created.target.versionLabel };
  const anchor = created.target.block?.anchorId;

  // Potvrzení e-mailem; když selže, připomínka zůstává uložená.
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://web-b5qk.vercel.app";
  const studyUrl = anchor ? `${site}/studie#${encodeURIComponent(anchor)}` : `${site}/studie`;
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
  try {
    await withPoolDb((db) => setVerificationStatus(db, { id: Number(fd.get("id")), status: str(fd, "status", 30), assignee: str(fd, "assignee", 120), note: str(fd, "note", 4000), actor: session.name }));
  } catch (e) {
    if (!(e instanceof CommentError)) console.error(e);
    return;
  }
  revalidatePath("/overit");
}
