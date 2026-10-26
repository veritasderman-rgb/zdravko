"use server";

import { headers } from "next/headers";
import { withPoolDb } from "@/db/pool";
import { brevo } from "@/lib/brevo";
import { newsletterConfirmMail, sendMail } from "@/lib/mail";
import { clientIp, hitLimit, keyHash, openToken, signToken } from "@/lib/privacy-core";
import { privacySecret, siteUrl } from "@/lib/privacy";
import type { ActionState } from "@/app/actions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PURPOSE = "novinky";
/** Platnost odkazu k potvrzení odběru (hodiny). */
const LINK_HOURS = 48;

let listId: number | null = Number(process.env.BREVO_LIST_ID) || null;

function str(fd: FormData, key: string, max: number): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Přihlášení k odběru: pošle odkaz k potvrzení. V našem webu se nic neukládá; e-mail
 * je jen v podepsaném odkazu a do Brevo jde až po potvrzení.
 */
export async function subscribeNewsletter(_prev: ActionState, fd: FormData): Promise<ActionState> {
  if (str(fd, "website", 200)) return { ok: true };
  const email = str(fd, "email", 200).toLowerCase();
  if (!EMAIL_RE.test(email)) return { error: "Zadejte platný e-mail." };
  const secret = privacySecret();
  const ip = clientIp(await headers());
  const allowed = await withPoolDb(
    async (pdb) =>
      (await hitLimit(pdb, "novinky-ip", keyHash(secret, ip), [{ windowS: 3600, max: 10 }])) &&
      (await hitLimit(pdb, "novinky-email", keyHash(secret, email), [{ windowS: 86400, max: 3 }])),
  );
  if (!allowed) return { error: "Přihlášek přišlo v poslední době hodně. Zkuste to prosím později." };
  const site = siteUrl();
  const url = `${site}/novinky/potvrdit?t=${encodeURIComponent(signToken(secret, PURPOSE, email, LINK_HOURS))}`;
  const sent = await sendMail({ to: email, ...newsletterConfirmMail({ url, hours: LINK_HOURS, privacyUrl: `${site}/ochrana-udaju#novinky` }) });
  if (!sent) return { error: "Potvrzovací e-mail se nepodařilo odeslat. Zkuste to prosím za chvíli." };
  return { ok: true };
}

/** Potvrzení odběru tlačítkem z odkazu v e-mailu: teprve teď jde kontakt do Brevo. */
export async function confirmNewsletter(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = openToken(privacySecret(), PURPOSE, str(fd, "t", 1000));
  if (!email) return { error: "Odkaz neplatí nebo vypršel (platí 48 hodin). Přihlaste se prosím znovu." };
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    console.error("novinky: BREVO_API_KEY není nastaven");
    return { error: "Odběr se teď nedá potvrdit. Zkuste to prosím později." };
  }
  try {
    const api = brevo(key);
    listId ??= await api.ensureList();
    await api.subscribe(email, listId);
  } catch (e) {
    console.error(e);
    return { error: "Odběr se nepodařilo uložit. Zkuste to prosím za chvíli znovu." };
  }
  return { ok: true };
}
