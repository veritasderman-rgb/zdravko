import "server-only";
import { SITE } from "./site";

/** Tajemství pro HMAC adres IP a odkazy na vlastní údaje; bez PRIVACY_SECRET se použije SESSION_SECRET. */
export function privacySecret(): string {
  const s = process.env.PRIVACY_SECRET || process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("PRIVACY_SECRET ani SESSION_SECRET není nastaven");
  return s;
}

export function siteUrl(): string {
  return SITE;
}

/** Kontakt správce pro dotazy k osobním údajům (stránka /ochrana-udaju). */
export function privacyContact(): string {
  return process.env.PRIVACY_CONTACT ?? "pripominky@josefpavlovic.cz";
}
