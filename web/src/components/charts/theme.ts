// Validovaná referenční paleta (dataviz): sloty v pevném pořadí, nikdy necyklovat.
export const SERIES = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6", "#e34948"] as const;
export const MUTED_MARK = "#c3c2b7"; // potlačené pruhy při zvýraznění jednoho
export const INK = { primary: "#0b0b0b", secondary: "#52514e", muted: "#898781", grid: "#e1e0d9", axis: "#c3c2b7", surface: "#fcfcfb" };
export const BAR = { size: 22, radius: 4 };

export const csNumber = (n: number, digits = 1) =>
  n.toLocaleString("cs-CZ", { minimumFractionDigits: 0, maximumFractionDigits: digits });
