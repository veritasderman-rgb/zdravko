"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, count, eq, gt, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { sealSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { withPoolDb } from "@/db/pool";
import { CommentError, createComment, createReply, setCommentStatus, setVerificationStatus } from "@/lib/comments-core";
import { commentVerification, loginMail, sendMail } from "@/lib/mail";
import { LOGIN_LINK_MINUTES, consumeLoginToken, createLoginToken } from "@/lib/accounts-core";
import { RETENTION, clientIp, confirmComment, dropUnverified, hitLimit, isDuplicate, keyHash, newVerifyToken, spamReason } from "@/lib/privacy-core";
import { privacySecret, siteUrl } from "@/lib/privacy";

export type ActionState = { error?: string; ok?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(fd: FormData, key: string, max = 20000): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Jen lokální absolutní cesta; "//host" nebo "/\\host" by byl otevřený redirect. */
const safeNext = (next: string) => (/^\/(?![\/\\])/.test(next) ? next : "/rt");

/**
 * Žádost o odkaz pro přihlášení. Odpověď je vždy stejná, ať účet existuje, nebo ne;
 * odkaz přijde jen na e-mail aktivního člena týmu.
 */
export async function requestLogin(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = str(fd, "email", 200).toLowerCase();
  const next = safeNext(str(fd, "next", 500) || "/rt");
  if (!EMAIL_RE.test(email)) return { error: "Zadejte platný e-mail." };
  const secret = privacySecret();
  const ip = clientIp(await headers());
  let link: Awaited<ReturnType<typeof createLoginToken>> = null;
  try {
    link = await withPoolDb(async (pdb) => {
      const ok =
        (await hitLimit(pdb, "prihlaseni-ip", keyHash(secret, ip), [{ windowS: 3600, max: 20 }])) &&
        (await hitLimit(pdb, "prihlaseni-email", keyHash(secret, email), [{ windowS: 3600, max: 5 }]));
      if (!ok) throw new CommentError("O odkaz jste žádali v poslední době několikrát. Zkuste to prosím za hodinu.");
      return createLoginToken(pdb, email);
    });
  } catch (e) {
    return failure(e, "Odkaz se nepodařilo připravit. Zkuste to prosím znovu.");
  }
  if (link) {
    const url = `${siteUrl()}/vstup/prihlasit?t=${encodeURIComponent(link.token)}&next=${encodeURIComponent(next)}`;
    const sent = await sendMail({ to: email, ...loginMail({ name: link.user.name, url, minutes: LOGIN_LINK_MINUTES }) });
    if (!sent) return { error: "E-mail s odkazem se nepodařilo odeslat. Zkuste to prosím za chvíli." };
  }
  return { ok: true };
}

/** Přihlášení tlačítkem na stránce z odkazu (samotné otevření odkazu nic nespotřebuje). */
export async function completeLogin(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const token = str(fd, "t", 200);
  const next = safeNext(str(fd, "next", 500) || "/rt");
  let user: Awaited<ReturnType<typeof consumeLoginToken>>;
  try {
    user = await withPoolDb((pdb) => consumeLoginToken(pdb, token));
  } catch (e) {
    return failure(e, "Přihlášení se nepodařilo. Zkuste to prosím znovu.");
  }
  if (!user) return { error: "Odkaz neplatí. Platí jen jednou a jen 20 minut; požádejte o nový." };
  const sealed = await sealSession({ uid: user.id, name: user.name, organization: user.organization ?? "", role: user.role });
  (await cookies()).set(SESSION_COOKIE, sealed, sessionCookieOptions);
  redirect(next);
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
        authorUserId: session.uid,
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
    await withPoolDb((db) => createReply(db, { parentId: Number(fd.get("parentId")), body: str(fd, "body"), authorName: session.name, organization: session.organization || null, authorUserId: session.uid, actor: session.name }));
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
        role: session.role,
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

/**
 * Veřejná připomínka bez přihlášení: libovolné jméno a e-mail (nikdy se nezveřejňují).
 * Uloží se jako čekající na potvrzení; týmu se ukáže, až autor klikne na odkaz z e-mailu.
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
  const spam = spamReason(body);
  if (spam) return { error: spam };

  // Omezení na straně serveru: z jedné adresy IP nejvýš 5 připomínek za 10 minut a 20 za den,
  // z jednoho e-mailu nejvýš 5 za 10 minut, celkem nejvýš 30 veřejných připomínek za minutu.
  // Adresu IP ani e-mail v záznamech limitů neukládáme, jen jejich HMAC.
  const secret = privacySecret();
  const ip = clientIp(await headers());
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

  const site = siteUrl();
  let created: Awaited<ReturnType<typeof createComment>>;
  let token: string;
  try {
    const result = await withPoolDb(async (pdb) => {
      if (!(await hitLimit(pdb, "pripominka-ip", keyHash(secret, ip), [{ windowS: 600, max: 5 }, { windowS: 86400, max: 20 }]))) return "limit" as const;
      // Stejný text ze stejného e-mailu podruhé neukládáme (dvojí odeslání, opakované vložení).
      if (await isDuplicate(pdb, email, body)) return "duplicate" as const;
      const t = newVerifyToken();
      const c = await createComment(pdb, {
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
        verifyTokenHash: t.hash,
        actor: "verejnost",
      });
      return { c, token: t.token };
    });
    if (result === "limit") return { error: "Z vaší sítě přišlo v poslední době hodně připomínek. Zkuste to prosím později." };
    if (result === "duplicate") return { ok: true };
    created = result.c;
    token = result.token;
  } catch (e) {
    return failure(e, "Připomínku se nepodařilo uložit. Zkuste to prosím znovu.");
  }

  const anchor = created.target.block?.anchorId;
  const mail = commentVerification({
    name,
    id: created.id,
    body,
    quote: created.quote || null,
    confirmUrl: `${site}/potvrdit?t=${encodeURIComponent(token)}`,
    studyUrl: anchor ? `${site}/studie#${encodeURIComponent(anchor)}` : `${site}/studie`,
    versionLabel: created.target.versionLabel,
    days: RETENTION.unverifiedDays,
    privacyUrl: `${site}/ochrana-udaju`,
  });
  const sent = await sendMail({ to: email, ...mail });
  if (!sent) {
    // Bez e-mailu by připomínku nešlo potvrdit; smažeme ji, ať ji lze poslat znovu bez duplicity.
    await withPoolDb((pdb) => dropUnverified(pdb, created.id));
    return { error: "Potvrzovací e-mail se nepodařilo odeslat. Zkontrolujte prosím adresu, nebo to zkuste za chvíli znovu." };
  }
  await db.insert(schema.events).values({ entity: "comment", entityId: created.id, action: "verification_sent", actor: "system", payload: {} });
  return { ok: true };
}

/** Potvrzení veřejné připomínky tlačítkem na stránce /potvrdit (ne samotným otevřením odkazu). */
export async function confirmPublicComment(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const token = str(fd, "t", 200);
  let row: Awaited<ReturnType<typeof confirmComment>>;
  try {
    row = await withPoolDb((pdb) => confirmComment(pdb, token));
  } catch (e) {
    return failure(e, "Připomínku se nepodařilo potvrdit. Zkuste to prosím znovu.");
  }
  if (!row) return { error: "Odkaz neplatí. Připomínka už je potvrzená, nebo odkaz vypršel (platí 7 dní)." };
  const site = siteUrl();
  const notify = process.env.COMMENT_NOTIFY_TO;
  if (notify) await sendMail({ to: notify, subject: `Nová veřejná připomínka č. ${row.id}`, text: `${row.name}${row.organization ? ` (${row.organization})` : ""}\n\n${row.quote ? `K místu: „${row.quote}“\n\n` : ""}${row.body}\n\n${site}/pripominky?channel=verejnost` });
  revalidatePath("/pripominky");
  revalidatePath("/rt");
  return { ok: true };
}

export async function updateVerification(fd: FormData): Promise<void> {
  const session = await getSession();
  if (!session) return;
  try {
    await withPoolDb((db) => setVerificationStatus(db, { id: Number(fd.get("id")), status: str(fd, "status", 30), assignee: str(fd, "assignee", 120), note: str(fd, "note", 4000), role: session.role, actor: session.name }));
  } catch (e) {
    if (!(e instanceof CommentError)) console.error(e);
    return;
  }
  revalidatePath("/overit");
}
