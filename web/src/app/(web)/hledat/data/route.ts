import { loadStudy } from "@/lib/study-data";
import { studyEntries, webEntries, type SearchEntry } from "@/lib/search-index";

// Data pro hledání na webu (/hledat). Odpověď se drží v mezipaměti a obnovuje se nejvýš
// jednou za pět minut, takže hledání nezatěžuje databázi.
export const dynamic = "force-static";
export const revalidate = 300;

export async function GET() {
  const entries: SearchEntry[] = webEntries();
  let study = false;
  try {
    const s = await loadStudy();
    if (s) {
      entries.push(...studyEntries(s));
      study = true;
    }
  } catch (e) {
    console.error("Hledání: studie není dostupná", e);
  }
  return Response.json({ study, entries });
}
