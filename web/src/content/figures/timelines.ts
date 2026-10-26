/**
 * Data pro časové osy studie (obrázky ve skupině „timelines“).
 * Zdroj: /01-studie-zdravi-bliz-lidem-v3.md; „ř.“ odkazuje na řádek tohoto souboru.
 * Fáze, brány a milníky (PHASES, GATES, MILESTONES) se neopisují, importují se z reforma.ts.
 * Roky jsou desetinné: 2031 = 1. 1. 2031, 2028.45 = červen 2028, 2029.8 = říjen 2029.
 * Nic tu není dopočítané ani domyšlené; kde studie termín neuvádí, položka chybí a je vypsaná zvlášť.
 */

// ---------------------------------------------------------------------------
// Společné typy pro Ganttovy obrázky
// ---------------------------------------------------------------------------

/** Druh pruhu: příprava a věcný záměr, zákonodárný proces až do účinnosti, provoz a náběh, vládní krok. */
export type BarKind = "prep" | "law" | "ramp" | "gov";
/** Druh značky: účinnost, další stupeň nebo „nejdříve“, krok vlády. */
export type MarkKind = "eff" | "step" | "gov";
/** Kde je popisek: r vpravo, l vlevo, a nad čárou, b pod čárou, in uvnitř pruhu. `w` = nejvyšší šířka popisku v px (delší text se zalomí). */
export type LabelPos = "r" | "l" | "a" | "b" | "in";

export type TrackItem =
  | { t: "bar"; from: number; to: number; kind: BarKind; label?: string; pos?: LabelPos; w?: number; sub?: boolean; dashed?: boolean; title?: string }
  | { t: "mark"; at: number; kind: MarkKind; label?: string; pos?: LabelPos; w?: number; end?: boolean; ask?: boolean; title?: string };

/** Svislá čára přes celý graf. */
export type AxisLine = { at: number; kind: "gate" | "election" | "soft"; label: string };

/** Volby do Sněmovny, říjen 2029 (MILESTONES v reforma.ts), a souběh vládních událostí 1. 1. 2029 (ř. 1566–1572). */
export const ELECTION_LINE: AxisLine = { at: 2029.8, kind: "election", label: "volby do Sněmovny, říjen 2029" };
export const MERGE_2029_LINE: AxisLine = { at: 2029, kind: "soft", label: "1. 1. 2029: souběh vládních událostí, náš plán nic neklade" };

// ---------------------------------------------------------------------------
// Obrázek 1 (ř. 158): přehled harmonogramu 2026–2038
// ---------------------------------------------------------------------------

/**
 * Doplňky k MILESTONES z reforma.ts: další účinnosti ve stejný den (klíč = `label` milníku).
 * J9: ř. 1003 a 1182 (cukerná daň 1. 1. 2032); J8: ř. 1002 a 1182 (plná sazba vína 1. 1. 2033).
 */
export const MILESTONE_EXTRAS: Record<string, string> = {
  "Zákon o primární péči platí": "Ve stejný den začíná platit daň ze slazených nápojů (J9).",
  "Zákon o síti nemocnic platí, první krajské plány": "Ve stejný den začíná platit plná sazba daně z tichého vína (J8).",
};

/** Pevné body harmonogramu (ř. 154): 30. 6. 2027, volby v říjnu 2029, 1. 1. 2032. Klíč = `label` milníku. */
export const FIXED_POINTS = new Set<string>([
  "Dohoda o zkoušce, návrhy do úhrad na rok 2028",
  "Volby do Sněmovny",
  "Zákon o primární péči platí",
]);

/** Milníky, které jsou účinností zákona či pravidla (značka kosočtverec). Klíč = `label` milníku. */
export const EFFECT_LABELS = new Set<string>([
  "Nová platba státu, daně a fond prevence platí",
  "Zákon o primární péči platí",
  "Zákon o síti nemocnic platí, první krajské plány",
]);

/** 1. 1. 2029: reforma nic neklade (ř. 154, 1566–1572). */
export const IDLE_2029 = {
  at: 2029,
  label: "Nic neklademe",
  detail: "1. 1. 2029",
  text: "Nabíhá strop pobytu podle § 22b zák. 48/1997 Sb., ruší se § 52 zák. 108/2006 Sb. a vrací se vzorec platby státu. Náš plán na tento den nic neklade.",
};

// ---------------------------------------------------------------------------
// Obrázek 2 (ř. 1184): harmonogram pilířů 4 a 5
// ---------------------------------------------------------------------------

export type PillarRow = {
  code: string;
  label: string;
  pillar: 4 | 5;
  /** Krátký termín pod názvem na ploše grafu. */
  short: string;
  /** Termín, jak ho uvádí studie (pole „Termín: základní scénář“ v registru, ř. 2491–2533, nebo karta/tabulka). */
  term: string;
  /** Řádky studie. */
  src: string;
  items: TrackItem[];
};

export const PILLAR_AXIS = { x0: 2027, x1: 2036 };

export const PILLAR_ROWS: PillarRow[] = [
  {
    code: "J8", label: "Tiché víno, líh a pivo", pillar: 4,
    short: "2030 → 1. 1. 2031",
    term: "Předložit 2030, účinnost 1. 1. 2031; víno poloviční sazba 2031–2032, plná 1. 1. 2033",
    src: "ř. 1002, 1044, 2491",
    items: [
      { t: "bar", from: 2026.85, to: 2028.45, kind: "prep", title: "F0 (11/2026–6/2028): konzultace a podněty" },
      { t: "bar", from: 2028.5, to: 2030, kind: "prep", title: "F1 (do 12/2029): věcný záměr a volební program" },
      { t: "bar", from: 2030, to: 2031, kind: "law", title: "předložení 2030 (vlna 1)" },
      { t: "mark", at: 2031, kind: "eff", title: "účinnost 1. 1. 2031" },
      { t: "mark", at: 2033, kind: "step", title: "plná sazba vína 1. 1. 2033 (2031–2032 poloviční)" },
    ],
  },
  {
    code: "J9", label: "Daň ze slazených nápojů", pillar: 4,
    short: "2030 → 1. 1. 2032",
    term: "Ohlášení v programu 2029; předložit 2030, účinnost 1. 1. 2032; dvouleté ohlášení 2030–2031",
    src: "ř. 1003, 1058, 2492",
    items: [
      { t: "bar", from: 2029, to: 2030, kind: "prep", title: "ohlášení ve volebním programu 2029" },
      { t: "bar", from: 2030, to: 2032, kind: "law", title: "předložení 2030, účinnost 1. 1. 2032" },
      { t: "bar", from: 2030, to: 2032, kind: "ramp", sub: true, title: "dvouleté ohlášení 2030–2031 (reformulace nápojů)" },
      { t: "mark", at: 2032, kind: "eff", title: "účinnost 1. 1. 2032" },
    ],
  },
  {
    code: "P4", label: "Fond prevence", pillar: 4,
    short: "2030 → 1. 1. 2031",
    term: "Teze do B1 (6/2028); předložit 2030, účinnost 1. 1. 2031; příjem z daně ze slazených nápojů od 1. 1. 2032",
    src: "ř. 1004, 1080, 2497",
    items: [
      { t: "bar", from: 2026.85, to: 2028.45, kind: "prep", title: "konzultace s MF a NRR od F0, teze do B1 (6/2028)" },
      { t: "bar", from: 2030, to: 2031, kind: "law", title: "předložení 2030" },
      { t: "mark", at: 2031, kind: "eff", title: "účinnost 1. 1. 2031" },
      { t: "mark", at: 2032, kind: "step", title: "příjem z daně ze slazených nápojů od 1. 1. 2032" },
    ],
  },
  {
    code: "Pil4.1", label: "Minimální cena alkoholu", pillar: 4,
    short: "2032 → 1. 1. 2034",
    term: "Notifikace 2031–2032; předložit 2032, účinnost 1. 1. 2034",
    src: "ř. 1086, 2517",
    items: [
      { t: "bar", from: 2031, to: 2033, kind: "ramp", sub: true, title: "notifikace TRIS 2031–2032" },
      { t: "bar", from: 2032, to: 2034, kind: "law", title: "předložení 2032, účinnost 1. 1. 2034" },
      { t: "mark", at: 2034, kind: "eff", title: "účinnost 1. 1. 2034" },
    ],
  },
  {
    code: "Pil4.2", label: "Noční prodej alkoholu", pillar: 4,
    short: "2032 → 1. 1. 2033",
    term: "Ověřit: dřívější poslanecký návrh; předložit 2032, účinnost 1. 1. 2033",
    src: "ř. 1096, 2518",
    items: [
      { t: "bar", from: 2032, to: 2033, kind: "law", title: "předložení 2032" },
      { t: "mark", at: 2033, kind: "eff", title: "účinnost 1. 1. 2033" },
    ],
  },
  {
    code: "Pil4.3", label: "Reklama na alkohol", pillar: 4,
    short: "2032 → 1. 1. 2033",
    term: "Předložit 2032, účinnost 1. 1. 2033",
    src: "ř. 1097, 2519",
    items: [
      { t: "bar", from: 2032, to: 2033, kind: "law", title: "předložení 2032" },
      { t: "mark", at: 2033, kind: "eff", title: "účinnost 1. 1. 2033" },
    ],
  },
  {
    code: "Pil4.4", label: "Varování na obalech", pillar: 4,
    short: "2032 → 1. 1. 2033",
    term: "Předložit 2032, účinnost 1. 1. 2033",
    src: "ř. 1098, 2520",
    items: [
      { t: "bar", from: 2032, to: 2033, kind: "law", title: "předložení 2032" },
      { t: "mark", at: 2033, kind: "eff", title: "účinnost 1. 1. 2033" },
    ],
  },
  {
    code: "Pil4.5", label: "Daň podle gramu alkoholu", pillar: 4,
    short: "debata → nejdříve 2033",
    term: "Debata do voleb 2029; účinnost nejdříve 2033",
    src: "ř. 1099, 2521",
    items: [
      { t: "bar", from: 2027, to: 2029.8, kind: "prep", dashed: true, title: "debata do voleb 2029 (začátek studie neuvádí)" },
      { t: "mark", at: 2033, kind: "step", ask: true, title: "účinnost nejdříve 2033" },
    ],
  },
  {
    code: "Pil4.6", label: "Zubní prevence do 18 let", pillar: 4,
    short: "2030 → 1. 1. 2032",
    term: "Zákon předložit 2030, účinnost 1. 1. 2032",
    src: "ř. 1107, 2522",
    items: [
      { t: "bar", from: 2030, to: 2032, kind: "law", title: "předložení 2030, účinnost 1. 1. 2032" },
      { t: "mark", at: 2032, kind: "eff", title: "účinnost 1. 1. 2032" },
    ],
  },
  {
    code: "Pil4.7", label: "Očkování seniorů", pillar: 4,
    short: "vyhláška 2031",
    term: "Úhradová vyhláška nové vlády (2031)",
    src: "ř. 1108, 2523",
    items: [{ t: "mark", at: 2031, kind: "eff", title: "úhradová vyhláška nové vlády (2031)" }],
  },
  {
    code: "Pil4.9", label: "Krátká intervence", pillar: 4,
    short: "vyhláška 2031",
    term: "Úhradová vyhláška nové vlády (2031)",
    src: "ř. 1110, 2525",
    items: [{ t: "mark", at: 2031, kind: "eff", title: "úhradová vyhláška nové vlády (2031)" }],
  },
  {
    code: "Pil4.11", label: "Tabák a nikotin: postupný růst", pillar: 4,
    short: "podnět 2027 · 2030 → 1. 1. 2031",
    term: "Podnět současné vládě 2027; předložení 2030, účinnost 1. 1. 2031 (doplňkový scénář: prodloužení dnešního plánu od 2028)",
    src: "ř. 1092 a násl., registr Pil4.11",
    items: [
      { t: "mark", at: 2027, kind: "eff", title: "podnět současné vládě, aby prodloužila plán zvyšování po roce 2027" },
      { t: "bar", from: 2030, to: 2031, kind: "law", title: "novela zákona o spotřebních daních s J8: předložení 2030, účinnost 1. 1. 2031" },
      { t: "mark", at: 2031, kind: "eff", title: "účinnost 1. 1. 2031" },
    ],
  },
  {
    code: "Pil4.12", label: "Podpora těch, kdo chodí na prevenci", pillar: 4,
    short: "2031 · příspěvek 2032",
    term: "S Národním fondem prevence od 1. 1. 2031; příspěvek za prevenci od 1. 1. 2032",
    src: "ř. 1092 a násl., registr Pil4.12",
    items: [
      { t: "mark", at: 2031, kind: "eff", title: "hrazené odvykání kouření z přírůstku daně, od 1. 1. 2031" },
      { t: "mark", at: 2032, kind: "eff", title: "pilot nižšího pojistného za aktivní péči o zdraví, ročníky do 40 let, od 1. 1. 2032" },
    ],
  },
  {
    code: "Pil5.1", label: "Domácí péče: indikace", pillar: 5,
    short: "2030 → 1. 1. 2032",
    term: "Zákon předložit 2030, účinnost 1. 1. 2032",
    src: "ř. 1006, 1149, 1186, 2527",
    items: [
      { t: "bar", from: 2030, to: 2032, kind: "law", title: "předložení 2030, účinnost 1. 1. 2032" },
      { t: "mark", at: 2032, kind: "eff", title: "účinnost 1. 1. 2032" },
    ],
  },
  {
    code: "Pil5.2", label: "Paliativní tým v okrese", pillar: 5,
    short: "vyhláška 2031 → 2034",
    term: "Úhradová vyhláška 2031; náběh 2031–2034",
    src: "ř. 1150, 2528",
    items: [
      { t: "mark", at: 2031, kind: "eff", title: "úhradová vyhláška 2031" },
      { t: "bar", from: 2031, to: 2035, kind: "ramp", title: "náběh 2031–2034" },
    ],
  },
  {
    code: "Pil5.3", label: "Plán péče a koordinátor", pillar: 5,
    short: "vyhláška 2031",
    term: "Úhradová vyhláška 2031",
    src: "ř. 1151, 2529",
    items: [{ t: "mark", at: 2031, kind: "eff", title: "úhradová vyhláška 2031" }],
  },
  {
    code: "Pil5.7", label: "Dříve vyslovené přání", pillar: 5,
    short: "návrh poslanců 2028–29",
    term: "Poslanecký návrh 2028–2029, závisí na většině",
    src: "ř. 1171, 1186, 2533",
    items: [{ t: "bar", from: 2028, to: 2030, kind: "law", title: "poslanecký návrh 2028–2029; účinnost studie neuvádí" }],
  },
  {
    code: "P3", label: "Sociální účet", pillar: 5,
    short: "2033 → 1. 1. 2034",
    term: "Věcný záměr do 12/2029; předložit 2033, účinnost 1. 1. 2034; rozhodnutí o pojištění dlouhodobé péče do konce 2031",
    src: "ř. 1005, 1138, 1186, 2496",
    items: [
      { t: "bar", from: 2028, to: 2030, kind: "prep", title: "jednání s MPSV od 2028, věcný záměr do 12/2029" },
      { t: "mark", at: 2032, kind: "step", title: "rozhodnutí o pojištění dlouhodobé péče do konce 2031" },
      { t: "bar", from: 2033, to: 2034, kind: "law", title: "předložení 2033" },
      { t: "mark", at: 2034, kind: "eff", title: "účinnost 1. 1. 2034" },
    ],
  },
];

/** Opatření pilířů 4 a 5, u nichž studie termín neuvádí (registr: „Termín neuveden“, „Ověřit“). Nejsou na ose. */
export const PILLAR_UNDATED = [
  { code: "Pil4.8", label: "Navigace po pozitivním screeningu", term: "Pilot s evaluací (start ověřit); výkon po pilotu", src: "ř. 1109, 2524" },
  { code: "Pil4.10", label: "Strava a pohyb", term: "Termín v textu neuveden (ověřit); vyhodnocení po třech letech", src: "ř. 2526" },
  { code: "Pil5.4", label: "Podpora pečujících rodin", term: "Ověřit", src: "ř. 1152, 2530" },
  { code: "Pil5.5", label: "Konziliární paliativní tým v nemocnicích", term: "Start v největších nemocnicích; termín neuveden", src: "ř. 2531" },
  { code: "Pil5.6", label: "Nabídka plánu péče při hospitalizaci", term: "Termín neuveden", src: "ř. 2532" },
];

// ---------------------------------------------------------------------------
// Obrázek 3 (ř. 1562): vládní reformy 2026–2029 a fáze F0–F1 plánu
// ---------------------------------------------------------------------------

export const GOV_AXIS = { x0: 2026.6, x1: 2030.25 };

export type TwoTrackRow = {
  label: string;
  note?: string;
  /** Výška řádku na ploše grafu (px). */
  h: number;
  items: TrackItem[];
  /** Dílčí kroky pro mobil a textovou verzi. */
  steps: { when: string; text: string }[];
  src: string;
};

/** Dráha „vláda“: sloupec „Stav k 20. 10. 2026“ a údaje o termínech v tabulce předloh (ř. 1547–1556). */
export const GOV_ROWS: TwoTrackRow[] = [
  {
    label: "Moderní veřejné zdravotní pojištění 2030", h: 50, src: "ř. 1547",
    items: [{ t: "mark", at: 2026.72, kind: "gov", label: "představeno 22. 9. 2026, znění není veřejné", pos: "r" }],
    steps: [
      { when: "22. 9. 2026", text: "Představeno jako prezentace ministerstva; vnitřní připomínkové řízení. Paragrafové znění není veřejné, záznam ve VeKLEP jsme k 20. 10. nenašli (Ověřit)." },
    ],
  },
  {
    label: "Centralizace onkochirurgie", h: 88, src: "ř. 1548",
    items: [
      { t: "bar", from: 2027, to: 2030.25, kind: "gov", label: "urologie 2027–2030", pos: "in", title: "urologie 2027–2030" },
      { t: "mark", at: 2026.67, kind: "gov", label: "1. 9. 2026 játra, slinivka, jícen", pos: "b", w: 150 },
      { t: "mark", at: 2027, kind: "gov", label: "1. 1. 2027 gynekologie, rektum", pos: "a", w: 140 },
      { t: "mark", at: 2028, kind: "gov", label: "1. 1. 2028 plíce", pos: "a", w: 140 },
    ],
    steps: [
      { when: "1. 9. 2026", text: "Játra, slinivka a jícen (Věstník MZ 6/2026 a 10/2026); platí bez zákona." },
      { when: "1. 1. 2027", text: "Gynekologie a rektum." },
      { when: "1. 1. 2028", text: "Plíce." },
      { when: "2027–2030", text: "Urologie." },
    ],
  },
  {
    label: "Zákon 38/2025 Sb. (sociálně-zdravotní pomezí)", h: 88, src: "ř. 1549",
    items: [
      { t: "mark", at: 2027, kind: "gov", label: "1. 1. 2027 další krok", pos: "a", w: 140 },
      { t: "mark", at: 2029, kind: "gov", label: "1. 1. 2029 strop pobytu, zrušení § 52", pos: "a", w: 160 },
      { t: "mark", at: 2030.18, kind: "gov", end: true, label: "2031 očekává se nový zákon o sociálních službách", pos: "b", w: 190, title: "nový zákon o sociálních službách se očekává 2031" },
    ],
    steps: [
      { when: "od 1. 3. 2025", text: "Zákon platí." },
      { when: "1. 1. 2027", text: "Další krok zákona." },
      { when: "1. 1. 2029", text: "Pojišťovna hradí pobyt nad 90 dnů jen s indikací revizního lékaře (§ 22b zák. 48/1997 Sb.); ruší se § 52 zák. 108/2006 Sb." },
      { when: "2031", text: "Očekává se nový zákon o sociálních službách." },
    ],
  },
  {
    label: "Sněmovní tisk 235 (platba státu)", h: 62, src: "ř. 1550",
    items: [
      { t: "mark", at: 2026.73, kind: "gov", label: "2. čtení 23. 9. 2026", pos: "b" },
      { t: "bar", from: 2027, to: 2029, kind: "gov", label: "pevný základ 18 362 Kč", pos: "in" },
      { t: "mark", at: 2029, kind: "gov", label: "od 2029 vzorec § 3c", pos: "a" },
    ],
    steps: [
      { when: "23. 9. 2026", text: "Druhé čtení skončilo; podány pozměňovací návrhy č. 1796 a 1813; třetí čtení zatím nebylo (podzim 2026)." },
      { when: "1. 1. 2027", text: "Pevný vyměřovací základ 18 362 Kč (platba 2 479 Kč měsíčně, asi +21 mld. Kč); do roku 2029 se vypíná automatický vzorec § 3c." },
      { when: "1. 1. 2029", text: "Vrací se automatický vzorec § 3c zák. 592/1992 Sb.; rok 2028 má podle ministra zůstat bez valorizace." },
    ],
  },
  {
    label: "Úhradová vyhláška 2027 a cyklus 2028", h: 62, src: "ř. 1551",
    items: [
      { t: "mark", at: 2026.83, kind: "gov", label: "do 31. 10. 2026 Sbírka", pos: "b" },
      { t: "mark", at: 2027, kind: "gov", label: "1. 1. 2027", pos: "a" },
      { t: "mark", at: 2028, kind: "gov", label: "1. 1. 2028 vyhláška 2028", pos: "a" },
    ],
    steps: [
      { when: "do 31. 10. 2026", text: "Návrh vyhlášky rozděluje 604,8 mld. Kč; do Sbírky (dohoda ve 12 z 15 segmentů z 18. 6. 2026)." },
      { when: "1. 1. 2027", text: "Vyhláška 2027 platí." },
      { when: "1. 1. 2028", text: "Účinnost vyhlášky 2028 (podněty do dohodovacího řízení se podávají do 31. 1. 2027, dohoda do 30. 6. 2027)." },
    ],
  },
  {
    label: "Novela zák. 325/2021 Sb. (povinná eŽádanka)", h: 50, src: "ř. 1552",
    items: [{ t: "mark", at: 2027.5, kind: "gov", ask: true, label: "1. 7. 2027 povinnost podle návrhu (Ověřit)", pos: "r" }],
    steps: [
      { when: "30. 9. 2026", text: "Verze pro jednání vlády; vláda ji zatím neprojednala." },
      { when: "1. 7. 2027", text: "Termín povinné eŽádanky, který uvádí návrh. Ověřit." },
    ],
  },
  {
    label: "Reforma hygienické služby", h: 62, src: "ř. 1553",
    items: [
      { t: "mark", at: 2027.29, kind: "gov", label: "4/2027 meziresortní řízení", pos: "a" },
      { t: "mark", at: 2027.66, kind: "gov", label: "30. 8. 2027 vláda", pos: "b" },
      { t: "mark", at: 2028, kind: "gov", ask: true, label: "1. 1. 2028 účinnost (Ověřit)", pos: "r" },
    ],
    steps: [
      { when: "od přelomu 9/10 2026", text: "Vnitřní připomínkové řízení." },
      { when: "4/2027", text: "Plánované meziresortní řízení." },
      { when: "30. 8. 2027", text: "Plánované jednání vlády." },
      { when: "1. 1. 2028", text: "Účinnost; harmonogram je těsný. Ověřit." },
    ],
  },
];

/** Dráha „plán“: sloupec „Kdy“ v tabulce předloh (ř. 1547–1556), STEPS_2029 v reforma.ts a tabulka kroků (ř. 75–103). */
export const PLAN_ROWS: TwoTrackRow[] = [
  {
    label: "Konzultace", h: 62, src: "ř. 75–76, 1879–1887",
    items: [
      { t: "bar", from: 2026.93, to: 2028.45, kind: "prep", label: "konzultace a kulaté stoly", pos: "in" },
      { t: "mark", at: 2026.93, kind: "step", label: "7. 12. 2026 verze 3 · stoly 2/2027–6/2028", pos: "b" },
    ],
    steps: [
      { when: "7. 12. 2026", text: "Resortní tým schválí verzi 3 ke konzultaci." },
      { when: "31. 3. 2027", text: "Konec prvního kola připomínek." },
      { when: "2/2027–6/2028", text: "Devět kulatých stolů; bilanční konference 6/2028 před bránou B1." },
    ],
  },
  {
    label: "Podněty a pozměňovací návrhy", h: 62, src: "ř. 77, 80, 1547–1556",
    items: [
      { t: "mark", at: 2027.5, kind: "eff", label: "úhrady 2028: dohoda do 30. 6. 2027", pos: "a" },
      { t: "bar", from: 2027, to: 2029, kind: "prep", label: "pozměňovací návrhy 2027–2028", pos: "b" },
    ],
    steps: [
      { when: "do 31. 1. 2027", text: "Podněty do dohodovacího řízení o úhradách 2028 (dohoda do 30. 6. 2027) a do seznamu výkonů." },
      { when: "2027–2028", text: "Pozměňovací návrhy k reformě v. z. p. 2030, novele zák. 325/2021 Sb. a reformě hygienické služby (podle projednávání ve Sněmovně)." },
    ],
  },
  {
    label: "Pilot ve třech ORP", h: 62, src: "ř. 78, 81, 85, 1935–1940",
    items: [
      { t: "mark", at: 2027.5, kind: "eff", label: "30. 6. 2027 dohoda o pilotu", pos: "a" },
      { t: "bar", from: 2028, to: 2030, kind: "ramp", label: "pilot běží 2028–2029", pos: "in" },
      { t: "mark", at: 2029.35, kind: "step", end: true, label: "jaro 2029 průběžné vyhodnocení", pos: "b" },
    ],
    steps: [
      { when: "do 30. 6. 2027", text: "Dohoda kraje, VZP a obcí." },
      { when: "1. 1. 2028", text: "Start provozu; provoz dva roky." },
      { when: "jaro 2029", text: "Průběžné vyhodnocení po roce provozu." },
    ],
  },
  {
    label: "Poslanecké návrhy", h: 50, src: "ř. 1171, STEPS_2029",
    items: [{ t: "bar", from: 2028, to: 2030, kind: "law", label: "poslanecké návrhy 2028–2029", pos: "in" }],
    steps: [{ when: "2028–2029", text: "Jednodušší „dříve vyslovené přání“ s registrem; dobrovolné zveřejňování počtu lidí bez praktika po regionech." }],
  },
  {
    label: "Věcné záměry a program", h: 50, src: "ř. 84, 86",
    items: [
      { t: "bar", from: 2028.5, to: 2030, kind: "prep", label: "věcné záměry 7/2028–12/2029", pos: "in" },
    ],
    steps: [
      { when: "7/2028–12/2029", text: "Věcné záměry zákonů o primární péči, o síti, finanční novely a daňových zákonů." },
      { when: "do voleb 10/2029", text: "Volební program 2029 s jádrem J1–J10." },
    ],
  },
];

/** Text za pravým okrajem osy (ř. 1564). */
export const GOV_EDGE_NOTE = "Naše zákony se předkládají v roce 2030 a platí nejdřív od 1. 1. 2031, tedy za pravým okrajem osy.";

// ---------------------------------------------------------------------------
// Obrázek 4 (ř. 1798): roadmapa reformy; co se děje v každé fázi
// ---------------------------------------------------------------------------

/** Tabulka Fáze a brány (ř. 1804–1808). Pořadí odpovídá PHASES v reforma.ts. */
export const PHASE_DETAIL = [
  {
    id: "F0", name: "Konzultace a koalice podpory", period: "11/2026–6/2028", src: "ř. 1804",
    items: [
      "konzultace verze 3, kulaté stoly, memoranda o podpoře",
      "pozměňovací návrhy k reformě v. z. p. 2030, novele zák. 325/2021 Sb. a reformě hygienické služby",
      "podněty do dohodovacího řízení o úhradách 2028 (do 31. 1. 2027, dohoda do 30. 6. 2027) a do seznamu výkonů",
      "dohoda o pilotu (kraj, VZP, obce)",
    ],
  },
  {
    id: "F1", name: "Příprava vládnutí", period: "7/2028–12/2029", src: "ř. 1805",
    items: [
      "věcné záměry zákona o primární péči, zákona o síti, finanční novely a daňových zákonů",
      "volební program",
      "pilot běží",
      "koaliční vyjednávání",
    ],
  },
  {
    id: "F2", name: "První dva roky ve vládě", period: "2030–2031", src: "ř. 1806",
    items: [
      "vlna 1 předložena 2030, účinnost 1. 1. 2031",
      "vlna 2 předložena 2030, účinnost 1. 1. 2032",
      "vlna 3 předložena 2031",
      "závěrečné vyhodnocení pilotu 2030; úhradové vyhlášky 2031 a 2032",
    ],
  },
  {
    id: "F3", name: "Náběh", period: "2032–2033", src: "ř. 1807",
    items: [
      "zákon o primární péči účinný 1. 1. 2032",
      "zákon o síti přijat 2032, účinný nejpozději 1. 1. 2033, první krajské plány 2033",
      "vlna 4 (sestra v pokročilé praxi, DRG zákonem, hodnocení technologií) od roku 2033",
    ],
  },
  {
    id: "F4", name: "Přeměna a ukotvení", period: "2034–2038", src: "ř. 1808",
    items: [
      "náběh týmů k asi 520 kolem roku 2038",
      "přeměna 8 000 akutních lůžek podle krajských plánů",
      "podíl akutní lůžkové péče klesne z 29,7 % na 26 % kolem roku 2038",
    ],
  },
];

/** Povaha brány a výsledky (ř. 1790, 1800, 1810). Pořadí odpovídá GATES. */
export const GATE_KIND = ["politická", "politická", "věcná", "věcná"] as const;
export const GATE_OUTCOMES = "pokračovat, upravit, nebo zmenšit na variantu B; rozhodnutí i důvody se zveřejňují";

// ---------------------------------------------------------------------------
// Obrázek 5 (ř. 1816): harmonogram 2026–2038, sedm drah
// ---------------------------------------------------------------------------

/**
 * Studie dráhy nepojmenovává; tabulka „Co všechno se musí stát“ (ř. 75–103, 29 kroků s termíny základního
 * scénáře) je rozdělena do sedmi drah. Každý krok je právě v jedné dráze; `step` je číslo kroku v té tabulce.
 */
export const LANES_AXIS = { x0: 2026.8, x1: 2039 };

export type LaneEvent = {
  /** Podřádek v dráze. */
  row: number;
  /** Číslo kroku v tabulce ř. 75–103 (nebo kód z registru). */
  step: string;
  items: TrackItem[];
  when: string;
  text: string;
};

export type Lane = { id: string; name: string; events: LaneEvent[] };

export const LANES: Lane[] = [
  {
    id: "konzultace", name: "Konzultace a koalice",
    events: [
      {
        row: 0, step: "1–2",
        items: [{ t: "bar", from: 2026.93, to: 2028.45, kind: "prep", label: "konzultace, devět kulatých stolů", pos: "r" }],
        when: "7. 12. 2026 – 6/2028",
        text: "Schválení verze 3 (7. 12. 2026), připomínky do 31. 3. 2027, kulaté stoly 2/2027–6/2028.",
      },
      {
        row: 1, step: "12",
        items: [{ t: "mark", at: 2029.8, kind: "step", label: "volební program 2029", pos: "l" }],
        when: "do voleb 10/2029",
        text: "Volební program 2029 s jádrem J1–J10, ohlášením daně ze slazených nápojů, personální bilancí po krajích a otevřeným modelem nákladů.",
      },
      {
        row: 1, step: "13",
        items: [{ t: "bar", from: 2029.92, to: 2030.08, kind: "law", label: "koaliční smlouva (B2)", pos: "r" }],
        when: "12/2029–1/2030",
        text: "Brána B2: jádro v koaliční smlouvě a programovém prohlášení; předlohy vln 1–3 v legislativním plánu vlády 2030.",
      },
      {
        row: 2, step: "14",
        items: [{ t: "bar", from: 2030, to: 2030.25, kind: "ramp", label: "řídicí výbor a projektová kancelář", pos: "r" }],
        when: "do 3/2030",
        text: "Řízení ve vládě: řídicí výbor, projektová kancelář (0,4 mld. Kč ročně), dva nové týmy legislativního odboru MZ.",
      },
    ],
  },
  {
    id: "pilot", name: "Pilot",
    events: [
      {
        row: 0, step: "4",
        items: [{ t: "mark", at: 2027.5, kind: "step", label: "dohoda o pilotu do 30. 6. 2027", pos: "r" }],
        when: "do 30. 6. 2027",
        text: "Dohoda o pilotu ve třech ORP: kraj, který se přihlásí, VZP a obce.",
      },
      {
        row: 1, step: "7",
        items: [{ t: "bar", from: 2028, to: 2030, kind: "ramp", label: "provoz ve třech ORP 2028–2029", pos: "r" }],
        when: "1. 1. 2028, provoz 2028–2029",
        text: "Start pilotu ve třech ORP, provoz dva roky.",
      },
      {
        row: 2, step: "17",
        items: [{ t: "mark", at: 2030, kind: "step", label: "od 2030 rozšíření do dalších regionů", pos: "r" }],
        when: "od 2030",
        text: "Pilot se postupně rozšiřuje do dalších regionů s kontrolními oblastmi.",
      },
    ],
  },
  {
    id: "legislativa", name: "Legislativa",
    events: [
      {
        row: 0, step: "6",
        items: [{ t: "bar", from: 2027, to: 2029, kind: "prep", label: "pozměňovací návrhy 2027–2028", pos: "r" }],
        when: "2027–2028",
        text: "Pozměňovací návrhy k reformě v. z. p. 2030, novele zák. 325/2021 Sb. a reformě hygienické služby (podle projednávání ve Sněmovně).",
      },
      {
        row: 1, step: "10",
        items: [{ t: "bar", from: 2028.5, to: 2030, kind: "prep", label: "věcné záměry 7/2028–12/2029", pos: "r" }],
        when: "7/2028–12/2029",
        text: "Věcné záměry zákona o primární péči, zákona o síti, finanční novely, daňového zákona a zákona o Fondu prevence; teze tří záměrů už k B1.",
      },
      {
        row: 2, step: "18, 24",
        items: [
          { t: "bar", from: 2030.5, to: 2032, kind: "law", label: "vlna 2: zákon o primární péči", pos: "l" },
          { t: "mark", at: 2032, kind: "eff", label: "1. 1. 2032", pos: "r" },
        ],
        when: "předložit 2. pol. 2030, účinnost 1. 1. 2032",
        text: "Vlna 2: zákon o primární péči (J1–J4); investice do center se uvolňují až po splněné bráně B3.",
      },
      {
        row: 3, step: "26",
        items: [{ t: "bar", from: 2032, to: 2035, kind: "law", label: "vlna 4: dokončení", pos: "l" }],
        when: "předložit 2032–2034, účinnost 2033–2034",
        text: "Vlna 4: sestra v pokročilé praxi s preskripcí, základní sazba DRG zákonem, HSPA v zákoně (P5), hodnocení technologií, sdílené financování sociálně-zdravotní péče (P3).",
      },
    ],
  },
  {
    id: "penize", name: "Peníze a úhrady",
    events: [
      {
        row: 0, step: "3",
        items: [{ t: "mark", at: 2027.5, kind: "step", label: "úhrady 2028: dohoda do 30. 6. 2027", pos: "r" }],
        when: "podat do 31. 1. 2027, dohoda do 30. 6. 2027",
        text: "Podněty do dohodovacího řízení o úhradách 2028 a do seznamu výkonů. Účinnost 1. 1. 2028 jen při vůli dnešního MZ, jinak 1. 1. 2031.",
      },
      {
        row: 1, step: "8",
        items: [{ t: "mark", at: 2028.45, kind: "step", label: "plánovací hodnota daní: 5 mld. Kč (do 6/2028)", pos: "r" }],
        when: "do 6/2028",
        text: "Strana potvrdí plánovací hodnotu daní za zdraví pro rozpočet reformy (5 mld. Kč ročně, rozpětí 5–7) vedle cíle PEER (10–15 mld. Kč) a pravidlo dělení podle PEER: nejméně 40 % Fondu prevence, aspoň 2 mld. Kč, zbytek platbě státu.",
      },
      {
        row: 2, step: "15, 20",
        items: [
          { t: "bar", from: 2030, to: 2031, kind: "law", label: "vlna 1 a úhradová vyhláška: 1. 1. 2031", pos: "r" },
          { t: "mark", at: 2031, kind: "eff" },
        ],
        when: "předložit 1. pol. 2030, účinnost 1. 1. 2031",
        text: "Vlna 1: nový vzorec platby státu (J10), daň z tichého vína a valorizace (J8; víno poloviční sazbou 2031–2032, plná 2033), zákon o Fondu prevence (P4). Úhradová vyhláška 2031: sesterská složka úhrady, platba za funkce, nové výkony.",
      },
      {
        row: 3, step: "16",
        items: [
          { t: "bar", from: 2030, to: 2032, kind: "law", label: "daň ze slazených nápojů: 1. 1. 2032", pos: "r" },
          { t: "mark", at: 2032, kind: "eff" },
        ],
        when: "přijat 2030, účinnost 1. 1. 2032",
        text: "Zákon o dani ze slazených nápojů (J9), pásma podle cukru.",
      },
    ],
  },
  {
    id: "personal", name: "Týmy a personál",
    events: [
      {
        row: 0, step: "P2",
        items: [{ t: "bar", from: 2027, to: 2031, kind: "prep", label: "rezidenční místa (P2): závazně od 2031", pos: "r" }],
        when: "podnět 2027, závazně od rozpočtu 2031",
        text: "Podnět do dohodovacího řízení 2027 a do rozpočtu 2028; závazně od rozpočtu 2031.",
      },
      {
        row: 1, step: "P1",
        items: [{ t: "mark", at: 2029.95, kind: "step", label: "personální bilance po krajích (P1)", pos: "r" }],
        when: "zveřejnit do B2 (12/2029)",
        text: "Zveřejněná personální bilance po krajích; měření v bráně B3 (12/2031).",
      },
      {
        row: 2, step: "19",
        items: [{ t: "bar", from: 2030, to: 2032, kind: "law", label: "smlouvy týmů, standard ve Věstníku", pos: "r" }],
        when: "od 2030 do účinnosti zákona",
        text: "Smluvní model před zákonem: pětileté smlouvy týmů se všemi pojišťovnami, standard týmu ve Věstníku MZ.",
      },
      {
        row: 3, step: "21",
        items: [{ t: "bar", from: 2031, to: 2039, kind: "ramp", label: "60 týmů 2031 → 520 kolem 2038", pos: "in", title: "60 týmů v roce 2031, 120 v roce 2032, 330 v roce 2035, asi 520 kolem roku 2038" }],
        when: "od 2031",
        text: "Náběh týmů a sester: 60 týmů v roce 2031, 120 v roce 2032, 330 v roce 2035; kolem roku 2038 asi 520 týmů.",
      },
    ],
  },
  {
    id: "sit", name: "Síť lůžek",
    events: [
      {
        row: 0, step: "22",
        items: [
          { t: "bar", from: 2031, to: 2033, kind: "law", label: "vlna 3: zákon o síti", pos: "l" },
          { t: "mark", at: 2033, kind: "eff", label: "nejpozději 1. 1. 2033", pos: "r" },
        ],
        when: "předložit 2031, přijmout 2032, účinnost nejpozději 1. 1. 2033",
        text: "Vlna 3: zákon o síti lůžkové péče (J6, J7: krajský plán na 10 let, čtyři skupiny lůžek, fond přeměny, garance příjmu); pověřovací akt SGEI před první výplatou garance.",
      },
      {
        row: 1, step: "25",
        items: [{ t: "mark", at: 2033, kind: "step", label: "první krajské plány 2033", pos: "r" }],
        when: "2033",
        text: "První krajské plány sítě (12–18 měsíců práce) s doloženou kapacitou následné a dlouhodobé péče a dojezdem záchranné služby.",
      },
      {
        row: 2, step: "28",
        items: [{ t: "bar", from: 2033, to: 2039, kind: "ramp", label: "přeměna 8 000 lůžek do 2038", pos: "in" }],
        when: "od 2033",
        text: "Přeměna akutních lůžek podle krajských plánů: 8 000 do roku 2038, asi 1 330 ročně; každé lůžko až po prokázané kapacitě dlouhodobé péče a dojezdu; stop při obložnosti nad 85 %.",
      },
    ],
  },
  {
    id: "hodnoceni", name: "Hodnocení",
    events: [
      {
        row: 0, step: "5",
        items: [{ t: "mark", at: 2027.95, kind: "step", label: "hodnotitel pilotu jmenován do 12/2027", pos: "r" }],
        when: "do 12/2027",
        text: "Jmenování nezávislého hodnotitele pilotu (ÚZIS s univerzitou), zveřejněný protokol a kontrolní ORP.",
      },
      {
        row: 1, step: "11",
        items: [{ t: "mark", at: 2029.35, kind: "step", label: "průběžné vyhodnocení pilotu", pos: "r" }],
        when: "jaro 2029",
        text: "Průběžné vyhodnocení pilotu po roce provozu, promítnuté do věcného záměru zákona o primární péči.",
      },
      {
        row: 2, step: "17",
        items: [{ t: "bar", from: 2030, to: 2031, kind: "prep", label: "závěrečné vyhodnocení pilotu", pos: "r" }],
        when: "2030",
        text: "Závěrečné vyhodnocení pilotu, promítnuté do paragrafového znění vlny 2.",
      },
      {
        row: 3, step: "29",
        items: [{ t: "mark", at: 2038.5, kind: "eff", label: "cílový stav kolem 2038", pos: "l", end: true }],
        when: "kolem roku 2038",
        text: "Cílový stav: 520 týmů, asi 4 000 sester navíc, 8 000 přeměněných lůžek, podíl akutní lůžkové péče 26 %.",
      },
    ],
  },
];
