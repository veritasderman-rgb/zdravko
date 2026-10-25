import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { listComments } from "@/lib/queries";
import { commentsCsv } from "@/lib/export";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const sp = req.nextUrl.searchParams;
  const g = (k: string) => sp.get(k) || undefined;
  const rows = await listComments({ doc: g("doc"), status: g("status"), severity: g("severity"), kind: g("kind"), code: g("code"), q: g("q"), channel: g("channel"), overeni: g("overeni") });
  const publicMode = sp.get("verejne") === "1";

  const body = commentsCsv(rows, publicMode);
  return new NextResponse(body, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="pripominky-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
