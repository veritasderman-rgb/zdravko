import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Náhled stránky pro sdílení (Facebook, X, LinkedIn, e-mail): značka, eyebrow, titulek
 * a patička. Generuje se při buildu ze stejných textů jako stránka, takže se při změně
 * textu obnoví sám. Písma jsou statické řezy Fontsource (woff); znaky s háčky jsou v sadě
 * latin-ext, která musí mít vlastní jméno a stát v `fontFamily` jako záložní, jinak je
 * Satori nahradí výchozím písmem.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const C = { sand: "#f3eee4", paper: "#fbf8f2", ink: "#1c2321", muted: "#52594f", forest: "#1f4a3d", honey: "#f2d29b", line: "#cfc5b3" };

const SERIF = "Serif, SerifExt";
const SANS = "Sans, SansExt";

const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));

async function fonts() {
  const [s6, s6x, a4, a4x, a7, a7x] = await Promise.all([
    font("source-serif-4", "source-serif-4-latin-600-normal.woff"),
    font("source-serif-4", "source-serif-4-latin-ext-600-normal.woff"),
    font("source-sans-3", "source-sans-3-latin-400-normal.woff"),
    font("source-sans-3", "source-sans-3-latin-ext-400-normal.woff"),
    font("source-sans-3", "source-sans-3-latin-700-normal.woff"),
    font("source-sans-3", "source-sans-3-latin-ext-700-normal.woff"),
  ]);
  return [
    { name: "Serif", data: s6, weight: 600 as const, style: "normal" as const },
    { name: "SerifExt", data: s6x, weight: 600 as const, style: "normal" as const },
    { name: "Sans", data: a4, weight: 400 as const, style: "normal" as const },
    { name: "SansExt", data: a4x, weight: 400 as const, style: "normal" as const },
    { name: "Sans", data: a7, weight: 700 as const, style: "normal" as const },
    { name: "SansExt", data: a7x, weight: 700 as const, style: "normal" as const },
  ];
}

export async function ogImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  // Dlouhý titulek menším písmem, aby se vešel do tří řádků.
  const size = title.length > 90 ? 52 : title.length > 60 ? 60 : 70;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: C.sand, padding: "64px 72px", fontFamily: SANS }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox="0 0 38 38">
            <circle cx="19" cy="19" r="19" fill={C.forest} />
            <path d="M10 20 L19 12 L28 20 M13 18 V27 H25 V18" fill="none" stroke={C.sand} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="19" cy="22" r="2.4" fill={C.honey} />
          </svg>
          <div style={{ fontFamily: SERIF, fontSize: 34, color: C.ink }}>Zdraví blíž lidem</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center", gap: 22 }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: C.forest }}>{eyebrow}</div>
          <div style={{ fontFamily: SERIF, fontSize: size, lineHeight: 1.08, color: C.ink, letterSpacing: -1 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `2px solid ${C.line}`, paddingTop: 22, fontSize: 24, color: C.muted }}>
          <div>Plán reformy zdravotnictví · verze 3.1 ke konzultaci</div>
          <div style={{ fontWeight: 700, color: C.forest }}>Připomínky vítány</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
