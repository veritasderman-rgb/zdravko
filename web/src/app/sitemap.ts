import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { loadStudy } from "@/lib/study-data";

/** Veřejné stránky pro vyhledávače; interní část (čtečka týmu, připomínky, registry) sem nepatří. */
const PAGES: [path: string, priority: number][] = [
  ["/", 1],
  ["/studie", 0.9],
  ["/proc", 0.8],
  ["/co-chceme", 0.8],
  ["/jak", 0.8],
  ["/penize", 0.8],
  ["/pro-koho", 0.7],
  ["/souvislosti", 0.7],
  ["/studie/zavislosti", 0.7],
  ["/studie/navrhnout-opatreni", 0.7],
  ["/plan", 0.6],
  ["/cisla", 0.6],
  ["/otazky", 0.6],
  ["/slovnicek", 0.5],
  ["/ochrana-udaju", 0.3],
];

// Kapitoly studie se čtou z databáze; seznam se obnovuje jednou za hodinu.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = PAGES.map(([path, priority]) => ({ url: `${SITE}${path === "/" ? "" : path}`, changeFrequency: "weekly", priority }));
  try {
    const study = await loadStudy();
    const lastModified = study?.version.importedAt;
    for (const c of study?.chapters ?? []) pages.push({ url: `${SITE}/studie/${c.slug}`, changeFrequency: "weekly", priority: 0.7, lastModified });
  } catch (e) {
    // Bez databáze zůstanou v sitemap aspoň stálé stránky.
    console.error("Sitemap: kapitoly studie nejsou dostupné", e);
  }
  return pages;
}
