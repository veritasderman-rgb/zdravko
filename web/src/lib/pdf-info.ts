import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Velikost a počet stran PDF ve složce public (pro odkazy ke stažení). Čte se při sestavení
 * stránky; když soubor chybí, vrátí null a odkaz se ukáže bez údajů.
 */
export function pdfInfo(href: string): { kb: number; pages: number } | null {
  try {
    const buf = readFileSync(path.join(process.cwd(), "public", href));
    const pages = (buf.toString("latin1").match(/\/Type\s*\/Page(?![s\w])/g) ?? []).length;
    return { kb: Math.round(buf.length / 1024), pages };
  } catch {
    return null;
  }
}

/** „2 strany, 310 kB“ / „1,4 MB“. */
export function pdfLabel(info: ReturnType<typeof pdfInfo>, unit: "strana" | "snímek"): string {
  if (!info) return "PDF";
  const n = info.pages;
  const word = unit === "strana" ? (n === 1 ? "strana" : n >= 2 && n <= 4 ? "strany" : "stran") : n === 1 ? "snímek" : n >= 2 && n <= 4 ? "snímky" : "snímků";
  const size = info.kb >= 1024 ? `${(info.kb / 1024).toLocaleString("cs-CZ", { maximumFractionDigits: 1 })} MB` : `${info.kb} kB`;
  return `PDF, ${n ? `${n} ${word}, ` : ""}${size}`;
}
