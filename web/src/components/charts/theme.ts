// Validovaná referenční paleta (dataviz): sloty v pevném pořadí, nikdy necyklovat.
// SERIES se nemění (ověřená na barvoslepost); neutrály ladí s pískovou půdou směru B.
export const SERIES = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6", "#e34948"] as const;
export const MUTED_MARK = "#BDB8AE"; // potlačené pruhy při zvýraznění jednoho
export const INK = { primary: "#1C2321", secondary: "#52594F", muted: "#6E695F", grid: "#E6DFD1", axis: "#CFC5B3", surface: "#FBF8F2" };
/** Neutrály a popisky na tmavém pásu (forest-deep). */
export const ON_DARK = { rest: "#2E4F46", text: "#C9D9CF", blueText: "#8FBCF2", orangeText: "#F4A27E" };
/** Pruhy: max. 22–24 px, zaoblený jen datový konec. */
export const BAR = { size: 22, radius: 4 };

/** Písmo os a popisků v Recharts: bezpatkové, nikdy pod 13 px. */
export const FONT_SANS = "var(--font-sans)";
export const FONT_SERIF = "var(--font-serif)";
export const TICK = { fontSize: 14, fill: INK.secondary, style: { fontFamily: FONT_SANS } };
export const LABEL = { fontSize: 14, fill: INK.primary, fontWeight: 600, style: { fontFamily: FONT_SANS } };

export const csNumber = (n: number, digits = 1) =>
  n.toLocaleString("cs-CZ", { minimumFractionDigits: 0, maximumFractionDigits: digits });
