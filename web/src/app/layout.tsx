import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
// Písma jsou v projektu (Fontsource), build je nestahuje z Google Fonts.
// Patkové titulky (Source Serif 4), bezpatkový text (Source Sans 3), kódy opatření (Geist Mono).
// Názvy rodin skládá globals.css do --font-serif a --font-sans (utility font-serif, font-sans).
import "@fontsource-variable/source-serif-4/wght.css";
import "@fontsource-variable/source-serif-4/wght-italic.css";
import "@fontsource-variable/source-sans-3/wght.css";
import "@fontsource-variable/geist-mono/wght.css";
import "./globals.css";
import { SITE } from "@/lib/site";
import { STRANKY } from "@/content/stranky";

const DESCRIPTION = STRANKY["/"].description;

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Zdraví blíž lidem", template: "%s · Zdraví blíž lidem" },
  description: DESCRIPTION,
  // Náhledový obrázek dodává opengraph-image.tsx u každé stránky (src/lib/og.tsx).
  openGraph: { siteName: "Zdraví blíž lidem", locale: "cs_CZ", type: "website", description: DESCRIPTION },
  twitter: { card: "summary_large_image" },
  // Ověření vlastnictví webu v Google Search Console a v Seznam Webmaster (kódy z prostředí Vercelu).
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.SEZNAM_SITE_VERIFICATION ? { other: { "seznam-wmt": process.env.SEZNAM_SITE_VERIFICATION } } : {}),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <a
          href="#obsah"
          className="sr-only z-50 rounded-full bg-ink px-5 py-3 text-lg font-bold text-on-dark focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Přeskočit na obsah
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
