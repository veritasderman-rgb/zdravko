// Vygeneruje PDF z tiskových stránek běžícího webu:
//   studie      /studie/tisk      → public/studie.pdf
//   handout     /tisk/handout     → public/podklady/zdravi-bliz-lidem-handout.pdf
//   prezentace  /tisk/prezentace  → public/podklady/zdravi-bliz-lidem-prezentace.pdf
//
//   pnpm build && pnpm start -p 3077 &
//   CHROMIUM_PATH=/cesta/k/chrome pnpm pdf               # jen studie
//   CHROMIUM_PATH=/cesta/k/chrome pnpm pdf podklady      # handout a prezentace
//   CHROMIUM_PATH=/cesta/k/chrome pnpm pdf vse
//
// Adresu webu lze změnit proměnnou PDF_BASE (výchozí http://localhost:3077); u studie platí
// i starší PDF_URL a PDF_OUT. Používá playwright-core (bez stahování prohlížeče); cestu
// k Chromu dejte do CHROMIUM_PATH, jinak se zkusí systémový Chrome (channel "chrome").
import { chromium } from "playwright-core";
import { mkdirSync, renameSync } from "node:fs";
import { dirname, resolve } from "node:path";

const base = process.env.PDF_BASE ?? "http://localhost:3077";

/** Studie: A4 s okraji, číslo stránky dává @page z print.css, do patičky jde název a verze. */
async function studie(page) {
  const blocks = await page.locator("article.study-text .block-row").count();
  if (blocks < 100) throw new Error(`stránka obsahuje jen ${blocks} bloků studie; PDF se negeneruje`);
  const label = (await page.locator("[data-pdf-footer]").first().getAttribute("data-pdf-footer")) ?? "Zdraví blíž lidem · studie";
  return {
    note: `${blocks} bloků`,
    pdf: {
      format: "A4",
      preferCSSPageSize: true,
      margin: { top: "18mm", right: "16mm", bottom: "20mm", left: "16mm" },
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: `<div style="width:100%;font-family:Georgia,serif;font-size:8pt;color:#000;padding:0 16mm;"><span>${label.replace(/[<>&]/g, "")}</span></div>`,
    },
  };
}

/** Podklady pro média: listy mají vlastní rozměr přes @page, bez okrajů a bez patičky. */
const sheets = (min) => async (page) => {
  const n = await page.locator("[data-pdf-ready] .sheet").count();
  if (n < min) throw new Error(`stránka obsahuje jen ${n} listů; PDF se negeneruje`);
  return { note: `${n} listů`, pdf: { preferCSSPageSize: true, margin: { top: "0", right: "0", bottom: "0", left: "0" } } };
};

const TARGETS = {
  studie: { url: process.env.PDF_URL ?? `${base}/studie/tisk`, out: process.env.PDF_OUT ?? "public/studie.pdf", prepare: studie, wait: 2500 },
  handout: { url: `${base}/tisk/handout`, out: "public/podklady/zdravi-bliz-lidem-handout.pdf", prepare: sheets(2), wait: 500 },
  prezentace: { url: `${base}/tisk/prezentace`, out: "public/podklady/zdravi-bliz-lidem-prezentace.pdf", prepare: sheets(5), wait: 500 },
};
const GROUPS = { podklady: ["handout", "prezentace"], vse: ["studie", "handout", "prezentace"] };

const arg = process.argv[2] ?? "studie";
const names = GROUPS[arg] ?? [arg];
for (const name of names) if (!TARGETS[name]) throw new Error(`neznámý cíl ${name}; použijte ${[...Object.keys(TARGETS), ...Object.keys(GROUPS)].join(", ")}`);

const exe = process.env.CHROMIUM_PATH;
const browser = await chromium.launch(exe ? { executablePath: exe } : { channel: "chrome" });
try {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 900, height: 1200 } });
  for (const name of names) {
    const t = TARGETS[name];
    const page = await context.newPage();
    page.on("pageerror", (e) => console.warn("stránka hlásí chybu:", e.message));
    const response = await page.goto(t.url, { waitUntil: "networkidle", timeout: 180_000 });
    // Chybová stránka nebo prázdný obsah (databáze nedostupná) nesmí přepsat zveřejněné PDF.
    if (!response || !response.ok()) throw new Error(`stránka ${t.url} vrátila stav ${response?.status() ?? "bez odpovědi"}`);
    const { note, pdf } = await t.prepare(page);
    // Grafy se kreslí na klientovi; dáme jim chvíli a počkáme na písma.
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(t.wait);
    const out = resolve(t.out);
    mkdirSync(dirname(out), { recursive: true });
    // Nejdřív do dočasného souboru, hotové PDF se přejmenuje až po úspěšném zápisu.
    const tmp = `${out}.tmp`;
    await page.pdf({ path: tmp, printBackground: true, ...pdf });
    renameSync(tmp, out);
    console.log(`PDF uloženo: ${out} (${await page.title()}, ${note})`);
    await page.close();
  }
} finally {
  await browser.close();
}
