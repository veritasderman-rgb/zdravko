// Kódy, kterými studie označuje opatření, ukazatele, rizika a brány.
// J1–J10 jádro, P1–P5 podmínky, Pil1.1–Pil5.7 doplňková opatření pilířů,
// M1.1–M10.5 doprovod (Manifest), H1–H8 hlavní a D1–D12 doplňkové ukazatele,
// R1–R19 rizika, B1–B4 brány.
export const CODE_RE =
  /(?<![A-Za-z0-9ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýž])(J(?:10|[1-9])|P[1-5]|Pil[1-5]\.\d{1,2}|M(?:10|[1-9])\.\d{1,2}|H[1-8]|D(?:1[0-2]|[1-9])|R(?:1[0-9]|[1-9])|B[1-4])(?![0-9A-Za-z.])/g;

export type CodeFamily = "J" | "P" | "Pil" | "M" | "H" | "D" | "R" | "B";

export function familyOf(code: string): CodeFamily {
  if (code.startsWith("Pil")) return "Pil";
  return code[0] as CodeFamily;
}

export const FAMILY_LABEL: Record<CodeFamily, string> = {
  J: "Jádro",
  P: "Podmínka",
  Pil: "Pilíř",
  M: "Manifest",
  H: "Hlavní ukazatel",
  D: "Doplňkový ukazatel",
  R: "Riziko",
  B: "Brána",
};

export const FAMILY_CLASS: Record<CodeFamily, string> = {
  J: "bg-emerald-100 text-emerald-900 border-emerald-200",
  P: "bg-teal-100 text-teal-900 border-teal-200",
  Pil: "bg-lime-100 text-lime-900 border-lime-200",
  M: "bg-stone-100 text-stone-800 border-stone-200",
  H: "bg-sky-100 text-sky-900 border-sky-200",
  D: "bg-cyan-100 text-cyan-900 border-cyan-200",
  R: "bg-rose-100 text-rose-900 border-rose-200",
  B: "bg-amber-100 text-amber-900 border-amber-200",
};

/** Řazení kódů: J1 < J2 < J10 < P1 < Pil1.1 < M1.1 < H1 < D1 < R1 < B1 */
const FAMILY_ORDER: CodeFamily[] = ["J", "P", "Pil", "M", "H", "D", "R", "B"];
export function compareCodes(a: string, b: string): number {
  const fa = FAMILY_ORDER.indexOf(familyOf(a));
  const fb = FAMILY_ORDER.indexOf(familyOf(b));
  if (fa !== fb) return fa - fb;
  const na = a.replace(/^[A-Za-z]+/, "").split(".").map(Number);
  const nb = b.replace(/^[A-Za-z]+/, "").split(".").map(Number);
  for (let i = 0; i < Math.max(na.length, nb.length); i++) {
    const d = (na[i] ?? 0) - (nb[i] ?? 0);
    if (d) return d;
  }
  return 0;
}
