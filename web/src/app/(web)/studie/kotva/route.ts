import { NextResponse, type NextRequest } from "next/server";
import { chapterOfBlock } from "@/lib/study";
import { loadStudy } from "@/lib/study-data";

/**
 * Přesměruje odkaz na odstavec studie do jeho kapitoly: /studie/kotva?k=<trvalá kotva nebo klíč
 * bloku> → /studie/<kapitola>#<k>. Používají ho e-maily s potvrzením připomínky a starší
 * odkazy /studie#kotva z doby, kdy byla studie na jedné stránce.
 */
export async function GET(req: NextRequest) {
  const k = req.nextUrl.searchParams.get("k")?.trim() ?? "";
  const home = new URL("/studie", req.nextUrl);
  if (!k) return NextResponse.redirect(home, 307);
  try {
    const study = await loadStudy();
    const block = study?.blocks.find((b) => b.anchorId === k || b.blockKey === k);
    const chapter = study && block ? (study.chapters.find((c) => c.sectionKey === block.sectionKey && block.kind === "heading") ?? chapterOfBlock(study.chapters, block)) : undefined;
    if (!chapter) return NextResponse.redirect(home, 307);
    const target = new URL(`/studie/${chapter.slug}`, req.nextUrl);
    // Nadpis kapitoly je na její stránce h1, kotva by nikam nevedla.
    if (!(block?.kind === "heading" && block.sectionKey === chapter.sectionKey)) target.hash = encodeURIComponent(k);
    return NextResponse.redirect(target, 307);
  } catch (e) {
    console.error("Kotva studie: databáze není dostupná", e);
    return NextResponse.redirect(home, 307);
  }
}
