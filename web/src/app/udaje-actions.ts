"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { count, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { withPoolDb } from "@/db/pool";
import { dataAccessMail, sendMail } from "@/lib/mail";
import { DATA_LINK_HOURS, clientIp, erasePersonalData, hitLimit, keyHash, openDataToken, signDataToken } from "@/lib/privacy-core";
import { privacySecret, siteUrl } from "@/lib/privacy";
import type { ActionState } from "@/app/actions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(fd: FormData, key: string, max: number): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Žádost o odkaz na vlastní údaje. Odpověď je vždy stejná, ať u nás e-mail je, nebo ne,
 * aby formulář neprozrazoval, kdo připomínkoval. Odkaz přijde jen na tu adresu.
 */
export async function requestMyData(_prev: ActionState, fd: FormData): Promise<ActionState> {
  if (str(fd, "website", 200)) return { ok: true };
  const email = str(fd, "email", 200).toLowerCase();
  if (!EMAIL_RE.test(email)) return { error: "Zadejte platný e-mail." };
  const secret = privacySecret();
  const ip = clientIp(await headers());
  const allowed = await withPoolDb(
    async (pdb) =>
      (await hitLimit(pdb, "udaje-ip", keyHash(secret, ip), [{ windowS: 3600, max: 5 }])) &&
      (await hitLimit(pdb, "udaje-email", keyHash(secret, email), [{ windowS: 86400, max: 3 }])),
  );
  if (!allowed) return { error: "O odkaz jste žádali v poslední době několikrát. Zkuste to prosím později." };

  const [{ n }] = await db.select({ n: count() }).from(schema.comments).where(eq(schema.comments.email, email));
  if (n > 0) {
    const url = `${siteUrl()}/ochrana-udaju/sprava?t=${encodeURIComponent(signDataToken(secret, email))}`;
    await sendMail({ to: email, ...dataAccessMail({ url, hours: DATA_LINK_HOURS, count: n }) });
  }
  return { ok: true };
}

/** Výmaz vlastních údajů z odkazu v e-mailu. */
export async function eraseMyData(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = openDataToken(privacySecret(), str(fd, "t", 1000));
  if (!email) return { error: "Odkaz neplatí nebo vypršel. Požádejte prosím o nový." };
  if (fd.get("souhlas") !== "on") return { error: "Potvrďte prosím, že chcete údaje smazat." };
  try {
    await withPoolDb((pdb) => erasePersonalData(pdb, email));
  } catch (e) {
    console.error(e);
    return { error: "Údaje se nepodařilo smazat. Zkuste to prosím znovu, případně nám napište." };
  }
  revalidatePath("/pripominky");
  revalidatePath("/rt");
  // Po výmazu stránka s údaji už nic neukáže; potvrzení nese parametr v adrese.
  redirect(`/ochrana-udaju/sprava?t=${encodeURIComponent(str(fd, "t", 1000))}&smazano=1`);
}
