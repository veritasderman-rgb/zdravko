import type { Metadata } from "next";
import { Geist_Mono, Source_Sans_3, Source_Serif_4 } from "next/font/google";
import "./globals.css";

// Patkové titulky (Source Serif 4), bezpatkový text (Source Sans 3), kódy opatření (Geist Mono).
// Proměnné se v globals.css skládají do --font-serif a --font-sans (utility font-serif, font-sans).
const serif = Source_Serif_4({
  variable: "--font-serif-src",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});
const sans = Source_Sans_3({ variable: "--font-sans-src", subsets: ["latin", "latin-ext"], weight: ["400", "600", "700"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: { default: "Zdraví blíž lidem", template: "%s · Zdraví blíž lidem" },
  description: "Plán reformy zdravotnictví ke konzultaci: každý má svůj tým lékaře a sestry, nemocnice mění roli, prevence má stálé peníze.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className={`${serif.variable} ${sans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#obsah"
          className="sr-only z-50 rounded-full bg-ink px-5 py-3 text-lg font-bold text-on-dark focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Přeskočit na obsah
        </a>
        {children}
      </body>
    </html>
  );
}
