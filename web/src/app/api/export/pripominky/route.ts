import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { listComments } from "@/lib/queries";
import { CHANNEL_LABEL, KIND_LABEL, PRIORITY_LABEL, SEVERITY_LABEL, STATUS_LABEL } from "@/lib/labels";

export const dynamic = "force-dynamic";

function csv(v: unknown): string {
  let s = v == null ? "" : String(v);
  // Excel by text začínající = + - @ nebo tabulátorem vyhodnotil jako vzorec; apostrof ho nechá jako text.
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Export tabulky připomínek (středník, UTF-8 s BOM pro Excel). ?verejne=1 skryje jména osob. */
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const sp = req.nextUrl.searchParams;
  const g = (k: string) => sp.get(k) || undefined;
  const rows = await listComments({ doc: g("doc"), status: g("status"), severity: g("severity"), kind: g("kind"), code: g("code"), q: g("q"), channel: g("channel") });
  const publicMode = sp.get("verejne") === "1";

  const header = ["ID", "Dokument", "Část", "Klíč bloku", "Kódy", "Typ", "Závažnost", "Stav", "Téma", "Garant", "Připomínkové místo", "Kanál", "Priorita", ...(publicMode ? [] : ["E-mail"]), "Úryvek", "Připomínka", "Návrh znění", "Zdroj", "Ověřit", "Vloženo"];
  const lines = [header.join(";")];
  for (const { c, docTitle, headingPath } of rows) {
    const place = publicMode ? c.organization ?? "jednotlivec" : `${c.authorName}${c.organization ? ` (${c.organization})` : ""}`;
    lines.push(
      [c.id, docTitle, headingPath ?? "", c.blockKey, c.codes.join(" "), KIND_LABEL[c.kind], SEVERITY_LABEL[c.severity], STATUS_LABEL[c.status], c.topic ?? "", c.assignee ?? "", place, CHANNEL_LABEL[c.channel] ?? c.channel, PRIORITY_LABEL[c.priority] ?? c.priority, ...(publicMode ? [] : [c.email ?? ""]), c.quote ?? "", c.body, c.proposedText ?? "", c.source ?? "", c.needsVerification ? "ano" : "", c.createdAt.toISOString()]
        .map(csv)
        .join(";"),
    );
  }
  const body = "﻿" + lines.join("\r\n");
  return new NextResponse(body, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="pripominky-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
