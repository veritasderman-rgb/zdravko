/**
 * Vysvětlující video na úvodní stránku: vykreslí scény z video/sceny.html snímek po snímku,
 * přidá komentář (video/narrace.mp3) a z časů slov (video/narrace-slova.json) napíše titulky.
 * Výstup: public/video/vysvetleni.mp4, .vtt a .jpg (náhled).
 *
 * Potřebuje ffmpeg a Playwright s Chromiem (nejsou závislostmi webu):  pnpm video:render
 * Jen nový náhled bez videa:  pnpm video:render --jen-nahled
 */
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { VIDEO } from "../src/content/video";

/** Co stránka se scénami vystavuje (video/sceny.html). */
type Page = { evaluate<A>(fn: (arg: A) => unknown, arg: A): Promise<unknown>; screenshot(o: object): Promise<Buffer> };
type Scenes = { setup(words: [string, number, number][], lead: number, total: number): void; render(t: number): void };

const { chromium } = createRequire(import.meta.url)("playwright");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/video");
const FPS = 30;
/** Ticho před komentářem a po něm (s). */
const LEAD = 0.6;
const TAIL = 2.4;

const words: [string, number, number][] = JSON.parse(readFileSync(join(ROOT, "video/narrace-slova.json"), "utf8"));
const total = words.at(-1)![2] + LEAD + TAIL;

/** Titulky po větách; konec věty v komentáři skript pozná podle tečky na konci slova. */
const CAPTIONS: string[] = VIDEO.paragraphs.flat();

function sentences() {
  const out: [number, number][] = [];
  let start: number | null = null;
  for (const [text, s, e] of words) {
    start ??= s;
    if (/\.$/.test(text)) {
      out.push([start, e]);
      start = null;
    }
  }
  if (out.length !== CAPTIONS.length) throw new Error(`vět v komentáři je ${out.length}, titulků ${CAPTIONS.length}`);
  return out;
}

const ts = (t: number) => {
  const ms = Math.round(t * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const m = String(Math.floor(ms / 60000) % 60).padStart(2, "0");
  const s = String(Math.floor(ms / 1000) % 60).padStart(2, "0");
  return `${h}:${m}:${s}.${String(ms % 1000).padStart(3, "0")}`;
};

/** Dlouhou větu rozdělí na dva řádky u mezery nejblíž středu. */
function wrap(text: string, max = 52) {
  if (text.length <= max) return text;
  const mid = text.length / 2;
  let best = -1;
  for (let i = 0; i < text.length; i++) {
    // Jednopísmenná předložka nebo spojka nezůstane na konci řádku.
    const ok = text[i] === " " && !/(^|\s)[aikosuvzAIKOSUVZ]$/.test(text.slice(0, i));
    if (ok && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  }
  return `${text.slice(0, best)}\n${text.slice(best + 1)}`;
}

function writeVtt() {
  const cues = sentences().map(([s, e], i, all) => {
    // Titulek zůstane až do další věty, nejvýš o 0,8 s déle než hlas.
    const next = i + 1 < all.length ? all[i + 1][0] : e + 2;
    return `${i + 1}\n${ts(s + LEAD)} --> ${ts(Math.min(next, e + 0.8) + LEAD)}\n${wrap(CAPTIONS[i])}`;
  });
  writeFileSync(join(OUT, "vysvetleni.vtt"), `WEBVTT\n\n${cues.join("\n\n")}\n`);
}

/** Snímek po snímku do ffmpeg, s komentářem posunutým o LEAD. */
async function renderVideo(page: Page) {
  const frames = Math.ceil(total * FPS);
  const ff = spawn("ffmpeg", [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-i", join(ROOT, "video/narrace.mp3"),
    "-filter:a", `adelay=${LEAD * 1000}:all=1,apad,loudnorm=I=-16:TP=-1.5`,
    "-t", total.toFixed(3),
    "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-tune", "animation",
    "-c:a", "aac", "-b:a", "96k", "-ar", "48000", "-movflags", "+faststart",
    join(OUT, "vysvetleni.mp4"),
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise<void>((res, rej) => ff.on("close", (c) => (c === 0 ? res() : rej(new Error(`ffmpeg skončil kódem ${c}`)))));

  for (let i = 0; i < frames; i++) {
    await page.evaluate((t: number) => (window as unknown as Scenes).render(t), i / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (i % 300 === 0) process.stdout.write(`snímek ${i}/${frames}\n`);
  }
  ff.stdin.end();
  await done;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  writeVtt();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(pathToFileURL(join(ROOT, "video/sceny.html")).href);
  await page.evaluate(async ({ words, LEAD, total }: { words: [string, number, number][]; LEAD: number; total: number }) => {
    await document.fonts.ready;
    (window as unknown as Scenes).setup(words, LEAD, total);
  }, { words, LEAD, total });

  if (!process.argv.includes("--jen-nahled")) await renderVideo(page);

  // Náhled: hlavní myšlenka studie (scéna 3), hned jak doběhne zvýraznění „blízko domova“.
  const kazdy = words.findIndex(([t]) => t === "Každý");
  const posterAt = words.slice(kazdy).find(([t]) => t === "blízko")![1] + LEAD + 0.9;
  await page.evaluate((t: number) => (window as unknown as Scenes).render(t), posterAt);
  await page.screenshot({ type: "jpeg", quality: 85, path: join(OUT, "vysvetleni.jpg") });
  await browser.close();
  const mb = (f: string) => (statSync(join(OUT, f)).size / 1e6).toFixed(1);
  console.log(`hotovo: ${total.toFixed(1)} s, vysvetleni.mp4 ${mb("vysvetleni.mp4")} MB, náhled ${mb("vysvetleni.jpg")} MB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
