import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { loadStudy } from "@/lib/study-data";

// Náhled kapitoly pro sdílení: název kapitoly. Obnovuje se se stránkou kapitoly.
export const revalidate = 300;

export const alt = "Kapitola odborné studie Zdraví blíž lidem";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ kapitola: string }> }) {
  const { kapitola } = await params;
  let title = "Odborná studie ke konzultaci";
  try {
    title = (await loadStudy())?.chapters.find((c) => c.slug === kapitola)?.title ?? title;
  } catch {
    // Bez databáze zůstane obecný náhled studie.
  }
  return ogImage({ eyebrow: "Odborná studie ke konzultaci", title });
}
