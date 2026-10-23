export const KIND_LABEL: Record<string, string> = {
  cislo: "Chyba v čísle",
  vecna: "Věcná výhrada",
  zneni: "Návrh nového znění",
  zdroj: "Chybí zdroj / evidence",
  pravni: "Právní riziko",
  otazka: "Otázka",
  podpora: "Podpora",
  redakcni: "Redakční",
};

export const SEVERITY_LABEL: Record<string, string> = {
  zasadni: "Zásadní",
  doporucujici: "Doporučující",
  redakcni: "Redakční",
};

export const SEVERITY_CLASS: Record<string, string> = {
  zasadni: "bg-rose-100 text-rose-900 border-rose-200",
  doporucujici: "bg-amber-50 text-amber-900 border-amber-200",
  redakcni: "bg-stone-100 text-stone-700 border-stone-200",
};

export const STATUS_LABEL: Record<string, string> = {
  nova: "Nová",
  prirazena: "Přiřazena",
  v_reseni: "V řešení",
  navrh_vyporadani: "Návrh vypořádání",
  zkontrolovano: "Zkontrolováno",
  vyporadana: "Vypořádána",
  zverejnena: "Zveřejněna",
};

export const STATUS_CLASS: Record<string, string> = {
  nova: "bg-sky-100 text-sky-900",
  prirazena: "bg-indigo-100 text-indigo-900",
  v_reseni: "bg-amber-100 text-amber-900",
  navrh_vyporadani: "bg-violet-100 text-violet-900",
  zkontrolovano: "bg-teal-100 text-teal-900",
  vyporadana: "bg-emerald-100 text-emerald-900",
  zverejnena: "bg-stone-200 text-stone-800",
};

export const CHANNEL_LABEL: Record<string, string> = {
  rt: "resortní tým",
  verejnost: "veřejnost",
};

export const PRIORITY_LABEL: Record<string, string> = {
  nizka: "nízká priorita",
  bezna: "běžná priorita",
  vysoka: "vysoká priorita",
};

export const PRIORITY_CLASS: Record<string, string> = {
  nizka: "bg-stone-100 text-stone-600 border-stone-200",
  bezna: "",
  vysoka: "bg-rose-100 text-rose-900 border-rose-200",
};

export const VERIFICATION_LABEL: Record<string, string> = {
  otevreno: "Otevřeno",
  overeno_potvrzeno: "Ověřeno, potvrzeno",
  overeno_opraveno: "Ověřeno, opraveno",
  neoveritelne: "Neověřitelné",
};

export const DOC_KIND_LABEL: Record<string, string> = {
  studie: "Odborná studie",
  politicka: "Politická verze",
  "one-pager": "One-pager",
  peer: "Podklad pro PEER",
  prezentace: "Prezentace",
  navrh: "Interní návrh",
};

export function fmtDate(d: Date | string): string {
  const x = typeof d === "string" ? new Date(d) : d;
  return x.toLocaleString("cs-CZ", { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
