import { NextResponse, type NextRequest } from "next/server";
import { withPoolDb } from "@/db/pool";
import { applyRetention } from "@/lib/privacy-core";

export const dynamic = "force-dynamic";

/**
 * Denní mazání podle lhůt uchování (vercel.json → crons). Vercel posílá
 * Authorization: Bearer $CRON_SECRET; bez nastaveného CRON_SECRET se nespustí.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET není nastaven" }, { status: 503 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "neoprávněno" }, { status: 401 });
  const result = await withPoolDb((db) => applyRetention(db));
  return NextResponse.json(result);
}
