import { cache } from "react";
import { getBlocks, getDocumentBySlug } from "@/lib/queries";
import { splitStudy } from "@/lib/study";

/**
 * Aktuální verze studie z databáze, rozdělená na kapitoly. `cache` sdílí jeden dotaz mezi
 * generateMetadata a stránkou během jednoho vykreslení; mezi požadavky drží výsledek
 * mezipaměť stránky (revalidate na stránkách studie). Vrací null, když studie v databázi není.
 */
export const loadStudy = cache(async () => {
  const found = await getDocumentBySlug("studie");
  if (!found) return null;
  const blocks = await getBlocks(found.version.id);
  return { ...found, blocks, ...splitStudy(blocks) };
});

export type LoadedStudy = NonNullable<Awaited<ReturnType<typeof loadStudy>>>;
