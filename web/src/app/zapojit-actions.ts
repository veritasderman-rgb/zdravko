"use server";

import { headers } from "next/headers";
import { withPoolDb } from "@/db/pool";
import { LIST_NAME, ORG_LIST_NAME, brevo, roundTableList } from "@/lib/brevo";
import { sendMail, signupConfirmMail } from "@/lib/mail";
import { clientIp, hitLimit, keyHash, openSealed, sealToken } from "@/lib/privacy-core";
import { privacySecret, siteUrl } from "@/lib/privacy";
import { LIMITS, interestLabel, orgError, requestLabel, roundTableError, type OrgInput, type RoundTableInput } from "@/content/zapojit";
import type { ActionState } from "@/app/actions";

const PURPOSE = "zapojit";
/** Platnost odkazu k potvrzení (hodiny). */
const LINK_HOURS = 48;

type Signup = ({ kind: "stoly" } & RoundTableInput) | ({ kind: "org" } & OrgInput);
export type SignupState = ActionState & { kind?: Signup["kind"] };

function str(fd: FormData, key: string, max: number): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

const list = (fd: FormData, key: string) => fd.getAll(key).filter((v): v is string => typeof v === "string").slice(0, 20);

/** Past na roboty (skryté pole) a příliš rychlé nebo staré odeslání. */
function botCheck(fd: FormData): SignupState | null {
  if (str(fd, "website", 200)) return { ok: true };
  const ts = Number(fd.get("ts"));
  const age = Date.now() - ts;
  if (!Number.isFinite(ts) || ts <= 0 || age < 2500 || age > 24 * 60 * 60 * 1000) {
    return { error: "Formulář byl odeslán příliš rychle nebo vypršel. Obnovte prosím stránku a zkuste to znovu." };
  }
  return null;
}

function summary(s: Signup): string[] {
  const who = [s.name, s.org].filter(Boolean).join(", ");
  if (s.kind === "stoly") {
    return [`Kdo: ${who}`, ...(s.role ? [`Role: ${s.role}`] : []), `Témata: ${s.topics.join("; ")}`, `Zájem: ${interestLabel(s.interest)}`, ...(s.note ? [`Poznámka: ${s.note}`] : []), ...(s.newsletter ? ["Chcete i novinky e-mailem"] : [])];
  }
  return [
    `Organizace: ${s.org}`,
    `Kontakt: ${s.name}${s.role ? `, ${s.role}` : ""}`,
    `S čím se ozýváte: ${s.requests.map(requestLabel).join("; ")}`,
    ...(s.note ? [`Zpráva: ${s.note}`] : []),
    ...(s.publish ? ["Souhlasíte se zveřejněním názvu organizace mezi podporovateli"] : []),
    ...(s.newsletter ? ["Chcete i novinky e-mailem"] : []),
  ];
}

/** Omezení počtu, zapečetěný odkaz a e-mail k potvrzení. V našem webu se nic neukládá. */
async function requestConfirm(s: Signup): Promise<SignupState> {
  const secret = privacySecret();
  const ip = clientIp(await headers());
  const allowed = await withPoolDb(
    async (pdb) =>
      (await hitLimit(pdb, "zapojit-ip", keyHash(secret, ip), [{ windowS: 3600, max: 10 }])) &&
      (await hitLimit(pdb, "zapojit-email", keyHash(secret, s.email), [{ windowS: 86400, max: 5 }])),
  );
  if (!allowed) return { error: "Přihlášek přišlo v poslední době hodně. Zkuste to prosím později." };
  const site = siteUrl();
  const url = `${site}/zapojte-se/potvrdit?t=${encodeURIComponent(sealToken(secret, PURPOSE, s, LINK_HOURS))}`;
  const sent = await sendMail({ to: s.email, ...signupConfirmMail({ kind: s.kind, url, hours: LINK_HOURS, privacyUrl: `${site}/ochrana-udaju#zapojeni`, summary: summary(s) }) });
  if (!sent) return { error: "Potvrzovací e-mail se nepodařilo odeslat. Zkuste to prosím za chvíli." };
  return { ok: true, kind: s.kind };
}

/** Zájem o kulaté stoly: zatím bez termínů, takže „dejte mi vědět“ nebo „chci se zúčastnit“. */
export async function signupRoundTables(_prev: SignupState, fd: FormData): Promise<SignupState> {
  const bot = botCheck(fd);
  if (bot) return bot;
  const input: RoundTableInput = {
    email: str(fd, "email", 200).toLowerCase(),
    name: str(fd, "name", LIMITS.name),
    org: str(fd, "organization", LIMITS.org),
    role: str(fd, "role", LIMITS.role),
    interest: str(fd, "interest", 20),
    topics: [...new Set(list(fd, "topic"))],
    note: str(fd, "note", LIMITS.note),
    newsletter: fd.get("newsletter") === "ano",
  };
  const err = roundTableError(input);
  if (err) return { error: err };
  return requestConfirm({ kind: "stoly", ...input });
}

/** Zpráva za organizaci: setkání, podpora, spolupráce nebo zástupce na kulatý stůl. */
export async function contactOrganization(_prev: SignupState, fd: FormData): Promise<SignupState> {
  const bot = botCheck(fd);
  if (bot) return bot;
  const input: OrgInput = {
    email: str(fd, "email", 200).toLowerCase(),
    name: str(fd, "name", LIMITS.name),
    org: str(fd, "organization", LIMITS.org),
    role: str(fd, "role", LIMITS.role),
    requests: [...new Set(list(fd, "request"))],
    note: str(fd, "note", LIMITS.note),
    publish: fd.get("publish") === "ano",
    newsletter: fd.get("newsletter") === "ano",
  };
  const err = orgError(input);
  if (err) return { error: err };
  return requestConfirm({ kind: "org", ...input });
}

const listIds = new Map<string, number>();
let attributesReady = false;

/** Potvrzení tlačítkem z odkazu v e-mailu: teprve teď jde kontakt do Brevo a zpráva organizace týmu. */
export async function confirmSignup(_prev: SignupState, fd: FormData): Promise<SignupState> {
  const s = openSealed<Signup>(privacySecret(), PURPOSE, str(fd, "t", 8000));
  if (!s || (s.kind !== "stoly" && s.kind !== "org")) return { error: "Odkaz neplatí nebo vypršel (platí 48 hodin). Vyplňte prosím formulář znovu." };
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    console.error("zapojit: BREVO_API_KEY není nastaven");
    return { error: "Přihlášku se teď nedá potvrdit. Zkuste to prosím později." };
  }
  const names = [...(s.kind === "stoly" ? s.topics.map(roundTableList) : [ORG_LIST_NAME]), ...(s.newsletter ? [LIST_NAME] : [])];
  try {
    const api = brevo(key);
    if (!attributesReady) {
      await api.ensureAttributes();
      attributesReady = true;
    }
    const missing = names.filter((n) => !listIds.has(n));
    if (missing.length) (await api.ensureLists(missing)).forEach((id, i) => listIds.set(missing[i], id));
    const attributes =
      s.kind === "stoly"
        ? { ZBL_JMENO: s.name, ZBL_ORGANIZACE: s.org, ZBL_ROLE: s.role, ZBL_ZAJEM: interestLabel(s.interest), ZBL_KULATE_STOLY: s.topics.join("; "), ZBL_ZPRAVA: s.note }
        : { ZBL_JMENO: s.name, ZBL_ORGANIZACE: s.org, ZBL_ROLE: s.role, ZBL_ZADOST: s.requests.map(requestLabel).join("; "), ZBL_ZPRAVA: s.note, ZBL_ZVEREJNIT: s.publish ? "ano" : "ne" };
    // Prázdné hodnoty neposíláme, ať nepřepíšou, co kontakt v Brevo už má.
    await api.subscribe(
      s.email,
      names.map((n) => listIds.get(n) as number),
      Object.fromEntries(Object.entries(attributes).filter(([, v]) => v)),
    );
  } catch (e) {
    console.error(e);
    return { error: "Přihlášku se nepodařilo uložit. Zkuste to prosím za chvíli znovu." };
  }
  const notify = process.env.COMMENT_NOTIFY_TO;
  if (s.kind === "org" && notify) {
    await sendMail({ to: notify, replyTo: s.email, subject: `Organizace se ozvala: ${s.org}`, text: `${summary(s).join("\n")}\nE-mail: ${s.email}\n\nKontakt je v Brevo v seznamu „${ORG_LIST_NAME}“.` });
  }
  return { ok: true, kind: s.kind };
}
