import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://web-b5qk.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Interní část a jednorázové odkazy z e-mailů do vyhledávačů nepatří.
      disallow: ["/rt", "/d/", "/pripominky", "/overit", "/kody", "/lide", "/vstup", "/api/", "/cron/", "/potvrdit", "/ochrana-udaju/sprava", "/ochrana-udaju/export", "/studie/tisk"],
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
