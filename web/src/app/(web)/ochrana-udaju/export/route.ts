import { NextResponse, type NextRequest } from "next/server";
import { withPoolDb } from "@/db/pool";
import { exportPersonalData, openDataToken } from "@/lib/privacy-core";
import { privacySecret } from "@/lib/privacy";

export const dynamic = "force-dynamic";

/** Stažení vlastních údajů jako JSON; přístup jen s platným odkazem z e-mailu. */
export async function GET(req: NextRequest) {
  const email = openDataToken(privacySecret(), req.nextUrl.searchParams.get("t") ?? undefined);
  if (!email) return new NextResponse("Odkaz neplatí nebo vypršel.", { status: 403, headers: { "content-type": "text/plain; charset=utf-8" } });
  const data = await withPoolDb((db) => exportPersonalData(db, email));
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="moje-pripominky-${new Date().toISOString().slice(0, 10)}.json"`,
      "cache-control": "no-store",
    },
  });
}
