import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { META } from "@/content/reforma";
import { STRANKY, type StrankaPath } from "@/content/stranky";

export const SITE_NAME = "Zdraví blíž lidem";

/** Absolutní adresa stránky webu (kanonická adresa, strukturovaná data). */
export const absUrl = (path: string) => `${SITE}${path === "/" ? "" : path}`;

/** Metadata veřejné stránky z přehledu STRANKY (src/content/stranky.ts). */
export function pageMeta(path: StrankaPath, extra: Metadata = {}): Metadata {
  return metaFor(path, STRANKY[path].title, STRANKY[path].description, extra);
}

/**
 * Metadata stránky: titulek, vlastní popis pro výsledky vyhledávání, kanonická adresa
 * a náhled pro sdílení se stejným popisem. Náhledový obrázek dodává opengraph-image.tsx.
 */
export function metaFor(path: string, title: string, description: string, extra: Metadata = {}): Metadata {
  // Úvodní stránka si náhled pro sdílení bere z kořenového layoutu (obrázek app/opengraph-image),
  // vlastní openGraph by ho přepsal.
  if (path === "/") return { title, description, alternates: { canonical: absUrl(path) }, ...extra };
  return {
    title,
    description,
    alternates: { canonical: absUrl(path) },
    openGraph: { siteName: SITE_NAME, locale: "cs_CZ", type: "website", url: absUrl(path), title: `${title} · ${SITE_NAME}`, description },
    twitter: { card: "summary_large_image", title: `${title} · ${SITE_NAME}`, description },
    ...extra,
  };
}

/** Vydavatel webu ve strukturovaných datech. */
export const PUBLISHER = {
  "@type": "Organization",
  "@id": `${SITE}/#organizace`,
  name: SITE_NAME,
  url: SITE,
} as const;

export const AUTHOR = { "@type": "Person", name: META.author.split(",")[0].trim() } as const;

/** Drobečková navigace pro vyhledávače: úvod › … › stránka. */
export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Úvod", path: "/" }, ...items].map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absUrl(it.path) })),
  };
}
