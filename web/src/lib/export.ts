/**
 * Tabulka připomínek pro export (CSV se středníkem, UTF-8 s BOM pro Excel).
 * Ve veřejném režimu se nikdy neuvádí jméno osoby ani e-mail: místo nich organizace
 * ověřená přihlášením týmu, u veřejnosti jen „jednotlivec (veřejnost)“.
 */
import type * as schema from "@/db/schema";
import { CHANNEL_LABEL, KIND_LABEL, PRIORITY_LABEL, SEVERITY_LABEL, STATUS_LABEL } from "@/lib/labels";

type Comment = typeof schema.comments.$inferSelect;
export type ExportRow = { c: Comment; docTitle: string; headingPath: string | null };

export function csv(v: unknown): string {
  let s = v == null ? "" : String(v);
  // Excel by text začínající = + - @ nebo tabulátorem vyhodnotil jako vzorec; apostrof ho nechá jako text.
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function commentsCsv(rows: ExportRow[], publicMode: boolean): string {
  const header = ["ID", "Dokument", "Část", "Klíč bloku", "Kotva", "Kódy", "Typ", "Závažnost", "Stav", "Téma", "Garant", "Připomínkové místo", "Kanál", "Priorita", ...(publicMode ? [] : ["E-mail"]), "Úryvek", "Text bloku při podání", "Připomínka", "Návrh znění", "Zdroj", "Ověřit", "Vloženo"];
  const lines = [header.join(";")];
  for (const { c, docTitle, headingPath } of rows) {
    // Veřejně se uvádí jen organizace ověřená přihlášením týmu; organizace, kterou napsal
    // nepřihlášený člověk z veřejnosti, je jen orientační a nezveřejňuje se.
    const place = publicMode ? (c.channel === "verejnost" ? "jednotlivec (veřejnost)" : c.organization ?? "jednotlivec") : `${c.authorName}${c.organization ? ` (${c.organization})` : ""}`;
    lines.push(
      [c.id, docTitle, headingPath ?? "", c.blockKey, c.anchorId ?? "", c.codes.join(" "), KIND_LABEL[c.kind], SEVERITY_LABEL[c.severity], STATUS_LABEL[c.status], c.topic ?? "", c.assignee ?? "", place, CHANNEL_LABEL[c.channel] ?? c.channel, PRIORITY_LABEL[c.priority] ?? c.priority, ...(publicMode ? [] : [c.email ?? ""]), c.quote ?? "", c.blockText ?? "", c.body, c.proposedText ?? "", c.source ?? "", c.needsVerification ? "ano" : "", c.createdAt.toISOString()]
        .map(csv)
        .join(";"),
    );
  }
  return "﻿" + lines.join("\r\n");
}
