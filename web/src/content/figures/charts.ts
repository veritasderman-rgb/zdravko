import { CISLA, n } from "@/content/cisla";

/**
 * Data datových grafů studie „Zdraví blíž lidem“ v3 (01-studie-zdravi-bliz-lidem-v3.md).
 * Čísla řádků odkazují na studii v3. Co už je v `@/content/reforma` (SPENDING_SHARE, GP_DECLINE,
 * AVOIDABLE, NURSES, VARIANTS, FUNDING, COST_2038, TAXES …), se tu neopakuje, jen importuje.
 * Dopočty (rozdíly do celku, podíly) jsou v komponentách nebo označené komentářem „dopočet“.
 */

// ---------------------------------------------------------------------------
// 1. Úhrady pojišťoven podle segmentů 2024 (ř. 215, 225, 229)
// ---------------------------------------------------------------------------
export const SPENDING_SEGMENTS = {
  year: 2024,
  /** Celý lůžkový segment včetně nemocničních ambulancí a centrových léčiv (ř. 225). */
  inpatientTotal: 56.3,
  /** Akutní lůžková péče = 150 mld. Kč (ř. 225). */
  acuteBn: 150,
  rows: [
    { key: "acute", label: "Akutní lůžková péče", value: n("acuteShare"), inpatient: true, emphasis: 0 },
    { key: "hospAmb", label: "Nemocniční ambulance", value: 12.8, inpatient: true },
    // dopočet: 56,3 − 29,7 − 12,8
    { key: "inpatientRest", label: "Zbytek lůžkového segmentu, mj. centrová léčiva (dopočet)", value: 13.8, inpatient: true },
    { key: "gp", label: "Praktici pro dospělé", value: n("gpShare"), inpatient: false, emphasis: 1 },
    // dopočet: 100 − 56,3 − 4,3
    { key: "rest", label: "Ostatní péče mimo lůžkový segment (dopočet)", value: 39.4, inpatient: false },
  ],
} as const;

// ---------------------------------------------------------------------------
// 2. Věk praktiků pro dospělé (ř. 239–243)
// ---------------------------------------------------------------------------
export const GP_AGE = {
  /** Všichni aktivní lékaři oboru v ambulantní péči (ř. 243). */
  doctors: 6120,
  over60: 43.6,
  /** Ročně atestuje (ř. 245). */
  attestLow: 150,
  attestHigh: 200,
};

// ---------------------------------------------------------------------------
// 3. Odvratitelné hospitalizace a úmrtnost (ř. 257, 263, 2004)
// ---------------------------------------------------------------------------
export const AVOIDABLE_GAP = [
  { key: "dm", label: "Úmrtnost na diabetes", cz: 49.4 as number | null, ref: 23.5 as number | null, refLabel: "EU", unit: "na 100 000", excess: null as number | null, chronic: true, source: "Eurostat hlth_cd_asdr2, 2023" },
  { key: "cvd", label: "Úmrtnost na kardiovaskulární nemoci", cz: null, ref: null, refLabel: "EU", unit: "", excess: 48, chronic: true, source: "Eurostat hlth_cd_asdr2, 2023 (studie uvádí jen rozdíl)" },
  { key: "acsc", label: "Odvratitelné hospitalizace (ACSC)", cz: n("acsc"), ref: 473, refLabel: "OECD", unit: "na 100 000 obyvatel 15+", excess: null, chronic: false, source: "OECD Health at a Glance 2025, 2021/2022" },
  { key: "treat", label: "Léčitelná úmrtnost (do 75 let)", cz: n("treatableMortality"), ref: 86.8, refLabel: "EU27", unit: "na 100 000", excess: null, chronic: false, source: "Eurostat hlth_cd_apr, 2023" },
  { key: "prev", label: "Preventabilní úmrtnost (do 75 let)", cz: 173.9, ref: 150.9, refLabel: "EU27", unit: "na 100 000", excess: null, chronic: false, source: "Eurostat hlth_cd_apr, 2023" },
];

// ---------------------------------------------------------------------------
// 4. Lůžka dlouhodobé péče (ř. 291, 295). Časová řada 2014–2024 ve studii není.
// ---------------------------------------------------------------------------
export const LTC_BEDS = {
  czPer1000: 35.1, // OECD 2024
  europePer1000: 46, // srovnatelné evropské země, Eurostat 2019/2020
  needBy2035: n("ltcNeed2035"), // Přecechtěl a Hlávka 2025
  needPerYear: 2800,
  built2022: 1928,
};

// ---------------------------------------------------------------------------
// 5. Hospodaření zdravotního pojištění (ř. 305, 309, 1475)
// ---------------------------------------------------------------------------
export const INSURANCE_BALANCE = {
  plan2026: { revenue: 555.8, spending: 570.8, deficit: n("insurersDeficit2026") },
  /** Zůstatek základních fondů všech sedmi pojišťoven, mld. Kč (důvodová zpráva k tisku 235). */
  funds: [
    { label: "Začátek roku 2021", value: 69.9 },
    { label: "Konec roku 2025", value: n("insurersReserves") },
  ],
  /** Měsíční výdaje systému, pro měřítko (ř. 1475). */
  monthlySpending: 47,
};

// ---------------------------------------------------------------------------
// 6. Akutní lůžka a plánovací trajektorie (ř. 840–880, 102)
// ---------------------------------------------------------------------------
export const ACUTE_BEDS = {
  actual: [
    { year: 2024, beds: n("acuteBeds"), note: "NZIP/ÚZIS" },
    { year: 2025, beds: 46018, note: "předběžně" },
  ],
  /** Plán: do 2032 jen dobrovolné přeměny, od 2033 krajské plány, asi 1 330 ročně, 2038 asi 40 000 (ř. 102, 852). */
  plan: [
    { year: 2031, beds: n("acuteBeds") },
    { year: 2032, beds: n("acuteBeds") },
    // „asi 40 000“: dnešní akutní lůžka minus 8 000 přeměněných, zaokrouhleno na tisíce
    { year: 2038, beds: Math.round((n("acuteBeds") - n("bedsToConvert")) / 1000) * 1000 },
  ],
  perYear: 1330,
  per1000From: 4.4,
  per1000To: 3.7,
  /** 2010–2013 ubylo 5 914 akutních lůžek, následných přibylo 22 (ř. 886). */
  lesson: { acuteLost: n("bedsLesson"), followUpAdded: 22 },
};

// ---------------------------------------------------------------------------
// 7. Pravidlo rozdělení daní za zdraví (ř. 1010, 1062–1072)
// ---------------------------------------------------------------------------
export const HEALTH_TAX_SPLIT = {
  /** Dolní hranice pro Fond prevence, valorizovaně. */
  fund: 2,
  scenarios: [
    { key: "plan", label: "Plánovací výnos", total: n("healthTaxPlan") },
    { key: "upper", label: "Horní hranice rozpětí", total: CISLA.healthTaxPlan.range[1] },
    { key: "peer", label: "Cíl Hospodářské strategie PEER (dolní mez)", total: CISLA.peerTaxTarget.range[0] },
  ],
  /** Pravidlo Hospodářské strategie PEER: nejméně 40 % výnosu do Fondu prevence. */
  peerShare: n("preventionFundShare") / 100,
};

// ---------------------------------------------------------------------------
// 8. Citlivost čistého nákladu 2038 (ř. 1359–1381)
// ---------------------------------------------------------------------------
export const SENSITIVITY = {
  central: n("netCost2038"),
  ranges: [
    { key: "mc", label: "Monte Carlo, 20 000 běhů: 90 % výsledků", lo: 19.2, hi: 23.0, mid: 21.0, midLabel: "medián 21,0" },
    // Podklad pro PEER (04-podklad-pro-PEER.md, ř. 120): žádný z deseti předpokladů sám neposune odhad mimo 19,4–23,1.
    { key: "single", label: "Každý z 10 předpokladů zvlášť (podklad pro PEER)", lo: 19.4, hi: 23.1 },
    { key: "study", label: "Rozpětí studie, i se strukturními scénáři", lo: 15, hi: 25 },
    { key: "extreme", label: "Krajní souběh všech dolních nebo všech horních mezí", lo: 13.3, hi: 30.6 },
  ],
  scenarios: [
    { label: "Polovina sester, mzdová úroveň a dolní mez plateb týmům", value: 17.3 },
    { label: "Jen polovina sester (brána B3 splněna napůl)", value: 19.4 },
    { label: "Platby týmům, fond přeměny a rezerva na horní mezi", value: 25.7 },
    { label: "Tři sestry na lékaře už v roce 2038", value: 25.9 },
  ],
  /** 1 000 sester navíc nebo méně ≈ 1,1 mld. Kč ročně (ř. 1381). */
  perThousandNurses: 1.1,
};

// ---------------------------------------------------------------------------
// 9. Varianty A, B, C (ř. 1383–1398); čisté náklady jsou ve VARIANTS
// ---------------------------------------------------------------------------
export const VARIANT_EXTRA = {
  /** Společný základ všech tří variant (ř. 1385). */
  commonBase: 7.6,
  fullEffect: { A: "8 až 10 let", B: "5 až 7 let", C: "1 až 2 roky" } as Record<string, string>,
  diffs: [
    { from: "A", to: "B", value: 3.8, buys: "další profese, budovy, spádovou odpovědnost a vstup tam, kde praxe není" },
    { from: "B", to: "C", value: 6.5, buys: "sestry a platby týmům místo plošného zvýšení kapitace" },
  ],
};

// ---------------------------------------------------------------------------
// 10. Náběh 2028–2038, scénář Vláda 2030 (ř. 1402–1408)
// Čistý náklad po letech: ekonomický model v3, jak ho uvádí prezentace „Co chceme a proč“
// (05-prezentace-co-chceme-a-proc.md, snímek 13). Součet 115,8 = „asi 116 mld. Kč“ ze studie (ř. 1408).
// Počty týmů: ř. 95, 103, 1404.
// ---------------------------------------------------------------------------
export const RAMP = [
  { year: 2028, net: 0.3, teams: 8 as number | null },
  { year: 2029, net: 0.3, teams: null },
  { year: 2030, net: 1.0, teams: null },
  { year: 2031, net: 3.9, teams: 60 },
  { year: 2032, net: 7.4, teams: 120 },
  { year: 2033, net: 11.3, teams: null },
  { year: 2034, net: 14.5, teams: null },
  { year: 2035, net: n("netCost2035"), teams: 330 },
  { year: 2036, net: 18.6, teams: null },
  { year: 2037, net: 20.1, teams: null },
  { year: 2038, net: n("netCost2038"), teams: n("teams2038") },
];

// ---------------------------------------------------------------------------
// 12. Sestry (ř. 1481–1483; opravená čísla z vládního programu 2026–2037, viz NURSES)
// ---------------------------------------------------------------------------
export const NURSES_EXTRA = {
  replacementMin: 24000,
  yearsLow: 10,
  yearsHigh: 12,
  gradsUni: 680,
  gradsCollege: 570,
  /** Průměrný roční výstup programu 2026–2037: 11 078 všeobecných sester z VŠ a asi 11 000 z VOŠ za 12 let (studie v3.1, Část V). */
  gradsProgramPerYear: 1840,
  /** Reforma přidává v letech 2032–2037 450 až 600 sester ročně, vrchol 595 v roce 2034 (ř. 1483). */
  reformLow: 450,
  reformHigh: 600,
  reformPeak: 595,
  reformPeakYear: 2034,
  /** Co uváděla studie v3 (ř. 1483). */
  v3Replacement: 30000,
  v3Grads: 1300,
};

// ---------------------------------------------------------------------------
// 13. Praktici pro dospělé a rezidenční místa P2 (ř. 1491–1495)
// Pravidlo studie: 5 500 v roce 2026, úbytek 110 až 180 ročně; P2 = +50 atestací ročně od 2033.
// Řada po roce 2035 je jen aritmetika téhož pravidla do konce náběhu reformy (2038).
// ---------------------------------------------------------------------------
export const GP_P2 = {
  start: n("gpCount"),
  startYear: 2026,
  lossLow: 110,
  lossHigh: 180,
  p2PerYear: 50,
  p2From: 2033,
  endYear: 2038,
};

// ---------------------------------------------------------------------------
// 14. Legislativní zátěž podle let (ř. 1594–1723): 20 předloh, 4 malé, 13 středních, 3 velké
// Rok předložení z tabulek vln. Předlohy předložené společně (např. hlava zák. 372/2011 Sb.
// s novelou zák. 48/1997 Sb., zákon o síti s doprovodnými novelami) jsou jedna předloha.
// Nařízení vlády a pověřovací akt SGEI se nepočítají. Vlna 0 přispívá jednou malou předlohou;
// tabulka vlny 0 neurčuje, která to je, proto ji vedeme souhrnně za roky 2027–2028.
// ---------------------------------------------------------------------------
export type BillSize = "S" | "M" | "L";
export const BILLS: { year: string; wave: number; size: BillSize; name: string }[] = [
  { year: "2027–28", wave: 0, size: "S", name: "Vlna 0: návrh z opozice (pozměňovací nebo poslanecký)" },
  { year: "2030", wave: 1, size: "S", name: "Vzorec platby státu (zák. 592/1992 Sb.)" },
  { year: "2030", wave: 1, size: "M", name: "Daň z tichého vína a valorizace (zák. 353/2003 Sb.)" },
  { year: "2030", wave: 1, size: "M", name: "Zákon o dani ze slazených nápojů" },
  { year: "2030", wave: 1, size: "M", name: "Zákon o Fondu prevence" },
  { year: "2030", wave: 2, size: "L", name: "Primární péče (nová hlava zák. 372/2011 Sb. s novelou zák. 48/1997 Sb.)" },
  { year: "2030", wave: 2, size: "S", name: "eŽádanka (zák. 325/2021 Sb.), jen pokud neprojde ve vlně 0" },
  { year: "2030", wave: 2, size: "M", name: "Zdravotnický ombudsman" },
  { year: "2030", wave: 2, size: "M", name: "Rozšířená péče a ochranný limit" },
  { year: "2031", wave: 3, size: "L", name: "Zákon o síti lůžkové péče s doprovodnými novelami" },
  { year: "2032", wave: 4, size: "M", name: "Sestra v pokročilé praxi" },
  { year: "2032", wave: 4, size: "M", name: "Základní sazba DRG zákonem" },
  { year: "2032", wave: 4, size: "M", name: "Zastoupení pojištěnců" },
  { year: "2032", wave: 4, size: "S", name: "HSPA jako oficiální rámec (NZIS)" },
  { year: "2032", wave: 4, size: "M", name: "Hodnocení technologií (mandát SÚKL a ÚZIS)" },
  { year: "2032", wave: 4, size: "M", name: "Alkohol: noční prodej, reklama, varování" },
  { year: "2032", wave: 4, size: "M", name: "Zákon o minimální ceně alkoholu" },
  { year: "2033", wave: 4, size: "M", name: "Sdílené financování sociálně-zdravotních služeb" },
  { year: "2033", wave: 4, size: "M", name: "Psychoterapie jako zdravotní služba" },
  { year: "2034", wave: 4, size: "L", name: "Zákon o pojištění dlouhodobé péče (podmíněně)" },
];
export const BILL_YEARS = ["2027–28", "2029", "2030", "2031", "2032", "2033", "2034"];
export const BILL_SIZES: { key: BillSize; label: string }[] = [
  { key: "S", label: "malá (do 10 bodů)" },
  { key: "M", label: "střední" },
  { key: "L", label: "velká" },
];
