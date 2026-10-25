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

export const metadata: Metadata = {
  title: { default: "Zdraví blíž lidem", template: "%s · Zdraví blíž lidem" },
  description: "Plán reformy zdravotnictví ke konzultaci: každý má svůj tým lékaře a sestry, nemocnice mění roli, prevence má stálé peníze.",
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
