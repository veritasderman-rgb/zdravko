import { NextResponse, type NextRequest } from "next/server";
import { openSession, SESSION_COOKIE } from "@/lib/session";

// Veřejný web reformy je přístupný všem; interní část (čtečka, připomínky,
// registry, export) vyžaduje platnou session, jinak jde na /vstup.
export async function proxy(request: NextRequest) {
  const session = await openSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = "/vstup";
  url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/rt/:path*", "/d/:path*", "/pripominky/:path*", "/overit/:path*", "/kody/:path*", "/api/:path*"],
};
