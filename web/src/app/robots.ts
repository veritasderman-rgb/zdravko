import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";


export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Interní část a jednorázové odkazy z e-mailů do vyhledávačů nepatří.
      disallow: ["/rt", "/d/", "/pripominky", "/overit", "/kody", "/lide", "/vstup", "/api/", "/cron/", "/potvrdit", "/novinky/potvrdit", "/ochrana-udaju/sprava", "/ochrana-udaju/export", "/studie/tisk", "/studie/kotva", "/hledat/data"],
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
