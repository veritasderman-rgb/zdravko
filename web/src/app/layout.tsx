import type { Metadata } from "next";
import { Barlow_Condensed, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "latin-ext"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] });
const display = Barlow_Condensed({ variable: "--font-display", subsets: ["latin", "latin-ext"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: { default: "Zdraví blíž lidem", template: "%s · Zdraví blíž lidem" },
  description: "Plán reformy zdravotnictví ke konzultaci: každý má svůj tým lékaře a sestry, nemocnice mění roli, prevence má stálé peníze.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
