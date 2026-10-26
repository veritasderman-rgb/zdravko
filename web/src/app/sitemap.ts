import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";


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
  ["/plan", 0.6],
  ["/cisla", 0.6],
  ["/otazky", 0.6],
  ["/slovnicek", 0.5],
  ["/ochrana-udaju", 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(([path, priority]) => ({ url: `${SITE}${path === "/" ? "" : path}`, changeFrequency: "weekly", priority }));
}
