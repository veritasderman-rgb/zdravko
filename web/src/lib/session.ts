// Podepsaná session v cookie s účtem (uid) a rolí. Vzniká po přihlášení odkazem z e-mailu.
// Proxy ověřuje jen podpis; stránky a akce navíc kontrolují v databázi, že účet je aktivní
// a jakou má roli (src/lib/auth.ts). Používá Web Crypto, aby fungovala i v proxy.ts.
import { isRole, type Role } from "./roles";

export const SESSION_COOKIE = "zbl_session";
const MAX_AGE_S = 60 * 60 * 24 * 30;

export interface Session {
  uid: number;
  name: string;
  organization: string;
  role: Role;
  exp: number;
}

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64url(s: string): Uint8Array<ArrayBuffer> {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function key(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) throw new Error("SESSION_SECRET chybí nebo je krátký");
  return crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function sealSession(data: Omit<Session, "exp">): Promise<string> {
  const payload: Session = { ...data, exp: Math.floor(Date.now() / 1000) + MAX_AGE_S };
  const body = b64url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("HMAC", await key(), new TextEncoder().encode(body));
  return `${body}.${b64url(sig)}`;
}

export async function openSession(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify("HMAC", await key(), fromB64url(sig), new TextEncoder().encode(body));
    if (!ok) return null;
    const data = JSON.parse(new TextDecoder().decode(fromB64url(body))) as Session;
    if (!data.exp || data.exp < Date.now() / 1000) return null;
    // Staré session ze sdíleného kódu nemají účet; s nimi se už přihlásit nejde.
    if (!Number.isInteger(data.uid) || !isRole(data.role)) return null;
    return data;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_S,
};
