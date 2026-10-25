// Vygeneruje public/studie.pdf z tiskové stránky /studie/tisk běžícího webu.
//
//   pnpm build && pnpm start -p 3077 &
//   CHROMIUM_PATH=/cesta/k/chrome pnpm pdf            # výchozí URL http://localhost:3077/studie/tisk
//
// Používá playwright-core (bez stahování prohlížeče); cestu k Chromu dejte do CHROMIUM_PATH,
// jinak se zkusí systémový Chrome (channel "chrome").
import { chromium } from "playwright-core";
import { mkdirSync, renameSync } from "node:fs";
import { dirname, resolve } from "node:path";

const url = process.env.PDF_URL ?? "http://localhost:3077/studie/tisk";
const out = resolve(process.env.PDF_OUT ?? "public/studie.pdf");
const exe = process.env.CHROMIUM_PATH;

const browser = await chromium.launch(exe ? { executablePath: exe } : { channel: "chrome" });
try {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 900, height: 1200 } });
  const page = await context.newPage();
  page.on("pageerror", (e) => console.warn("stránka hlásí chybu:", e.message));
  const response = await page.goto(url, { waitUntil: "networkidle", timeout: 180_000 });
  // Chybová stránka nebo prázdná studie (databáze nedostupná) nesmí přepsat zveřejněné PDF.
  if (!response || !response.ok()) throw new Error(`stránka ${url} vrátila stav ${response?.status() ?? "bez odpovědi"}`);
  const blocks = await page.locator("article.study-text .block-row").count();
  if (blocks < 100) throw new Error(`stránka obsahuje jen ${blocks} bloků studie; PDF se negeneruje`);
  // Grafy se kreslí na klientovi; dáme jim chvíli a počkáme na písma.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2500);
  const title = await page.title();
  mkdirSync(dirname(out), { recursive: true });
  // Nejdřív do dočasného souboru, hotové PDF se přejmenuje až po úspěšném zápisu.
  const tmp = `${out}.tmp`;
  await page.pdf({
    path: tmp,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: "18mm", right: "16mm", bottom: "20mm", left: "16mm" },
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    // Číslo stránky dává @page z print.css (střed); do patičky jde jen název.
    footerTemplate:
      '<div style="width:100%;font-family:Georgia,serif;font-size:8pt;color:#000;padding:0 16mm;">' +
      "<span>Zdraví blíž lidem · studie, konzultační verze 3.1</span></div>",
  });
  renameSync(tmp, out);
  console.log(`PDF uloženo: ${out} (${title}, ${blocks} bloků)`);
} finally {
  await browser.close();
}
