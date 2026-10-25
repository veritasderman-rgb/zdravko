/**
 * Registr čísel: každé citlivé číslo webu na jednom místě, se zdrojem, rokem, jednotkou,
 * definicí, rozpětím a druhem. Grafy a kalkulačky berou hodnoty odsud; texty, které číslo
 * píší slovy, hlídá kontrola `pnpm check:cisla` podle pole `forms` (vypíše všechna místa
 * na webu i ve studii, kde se číslo objevuje, a ohlásí, když ve studii chybí).
 *
 * Druhy:
 *  - udaj:     změřená nebo úřední hodnota z citovaného zdroje,
 *  - projekce: výhled cizí instituce (ČSÚ, ÚZIS, NRR) nebo jejich přepočet,
 *  - scenar:   scénářový výpočet ekonomického modelu studie (model_v3.py); model zatím
 *              není zveřejněný, výsledek proto není ověřený dopad,
 *  - cil:      cíl nebo plán reformy,
 *  - pravidlo: pravidlo, které reforma navrhuje (sazba, podíl, práh).
 *
 * Zdroj „MZ ČR 2025“ (Strategické analýzy potřeb rezortu) studie používá jen k ověření
 * dat; uvádíme ho stejně jako studie, bez odkazu na dokument.
 */

export type Kind = "udaj" | "projekce" | "scenar" | "cil" | "pravidlo";

export const KIND_LABEL: Record<Kind, string> = {
  udaj: "Údaj ze zdroje",
  projekce: "Výhled",
  scenar: "Scénářový výpočet",
  cil: "Cíl reformy",
  pravidlo: "Pravidlo návrhu",
};

export const KIND_NOTE: Record<Kind, string> = {
  udaj: "Změřená nebo úřední hodnota z citovaného zdroje.",
  projekce: "Výhled jiné instituce nebo jeho přepočet; skutečnost se může lišit.",
  scenar: "Výsledek ekonomického modelu studie za uvedených předpokladů. Model zatím není zveřejněný, nejde tedy o ověřený dopad.",
  cil: "Cíl nebo plán, ke kterému reforma míří.",
  pravidlo: "Pravidlo, které reforma navrhuje.",
};

/** Poznámka ke grafům a tabulkám z modelu. */
export const MODEL_NOTE = "Scénářový výpočet ekonomického modelu studie (model_v3.py), ceny 2026. Model zatím není zveřejněný; zveřejníme ho s tabulkou vstupů.";

export type Source = { title: string; detail?: string; url?: string };

export const SOURCES = {
  uzisUhrady: { title: "ÚZIS ČR, NZIP", detail: "datový souhrn OIS-11-24, náklady zdravotních pojišťoven podle segmentů" },
  uzisLuzka: { title: "ÚZIS ČR, NRHZS", detail: "datový souhrn OIS-11-28, lůžkový fond a obložnost", url: "https://www.nzip.cz/data/2378-luzkovy-fond-akutni-nasledna-dlouhodoba-pece-datovy-souhrn" },
  uzisNrzp: { title: "ÚZIS ČR, NRZP a NRHZS", detail: "praktičtí lékaři pro dospělé, stav k 31. 3. 2023" },
  uzisProjekce: { title: "ÚZIS ČR", detail: "projekce obyvatel podle věku a predikce příspěvku na péči (OIS-13-01)" },
  oecdHag: { title: "OECD", detail: "Health at a Glance 2025, odvratitelné hospitalizace (ACSC), data 2021/2022" },
  oecdHealth: { title: "OECD", detail: "Health Statistics; spotřeba alkoholu, screening" },
  eurostatMort: { title: "Eurostat", detail: "hlth_cd_apr, léčitelná a preventabilní úmrtnost do 75 let" },
  eurostatHly: { title: "Eurostat", detail: "hlth_hlye, délka života ve zdraví (Healthy Life Years); hodnoty podle Hospodářské strategie PEER" },
  nrr: { title: "Národní rozpočtová rada", detail: "Zpráva o dlouhodobé udržitelnosti veřejných financí 2026, tab. D.1; přepočet studie na ceny 2026" },
  tisk235: { title: "Poslanecká sněmovna", detail: "sněmovní tisk 235, důvodová zpráva (hospodaření pojišťoven, platba státu)" },
  vladniProgram: { title: "Vláda ČR", detail: "program pro nelékařské zdravotnické profese 2026–2037" },
  mz2025: { title: "MZ ČR 2025", detail: "Strategické analýzy potřeb rezortu zdravotnictví 2025 (studie je používá jen k ověření dat)" },
  precechtel: { title: "Přecechtěl a Hlávka", detail: "Studie efektivního zdravotnictví (2025)" },
  deloitte: { title: "Deloitte pro APSS ČR", detail: "Studie dlouhodobé sociální péče v ČR (6/2026); studie na zakázku poskytovatelů" },
  peer: { title: "Hospodářská strategie PEER", detail: "kap. 1.4, schválený programový dokument", url: "https://majak.pirati.cz/documents/647/Piratska_Hospodarska_strategie.pdf" },
  model: { title: "Studie v3.1, Část V", detail: "ekonomický model studie (model_v3.py), ceny 2026; model zatím není zveřejněný" },
  studie: { title: "Studie v3.1", detail: "návrh reformy" },
  hspa: { title: "HSPA Monitor a studie v3.1", detail: "propočet výnosu daní za zdraví (8/2026); nástroj autorů studie" },
  uzisDeti: { title: "ÚZIS ČR", detail: "registrovaní u praktického lékaře pro děti a dorost, 2022" },
  uzisPraxe: { title: "ÚZIS ČR", detail: "vznik a zánik ordinací praktiků v obcích do 2 000 obyvatel, 2018–2022" },
  uzisHistorie: { title: "ÚZIS ČR", detail: "lůžkový fond 2010–2013" },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

export type Cislo = {
  value: number;
  unit: string;
  /** Rozpětí nebo interval nejistoty [dolní, horní]. */
  range?: [number, number];
  /** Zdroj udává jen rozpětí; `value` je pak jen pomocný střed pro výpočty a nezobrazuje se. */
  rangeOnly?: boolean;
  /** K jakému roku (nebo období) hodnota patří. */
  year: string;
  /** Cenová hladina u peněžních částek. */
  prices?: string;
  definition: string;
  kind: Kind;
  source: SourceId;
  /** Upřesnění zdroje u konkrétního čísla (strana, tabulka, výpočet). */
  sourceDetail?: string;
  /** Otevřené ověření ve studii. */
  verify?: string;
  /** Jak se číslo píše v textech (pro hledání míst použití). */
  forms: string[];
  /** Musí se aspoň jedna forma objevit ve studii (výchozí ano). */
  inStudy?: boolean;
  topic: Topic;
};

export type Topic = "penize" | "lide" | "luzka" | "zdravi" | "dane";
export const TOPICS: { id: Topic; title: string }[] = [
  { id: "penize", title: "Kolik reforma stojí a kdo ji zaplatí" },
  { id: "dane", title: "Daně za zdraví" },
  { id: "lide", title: "Lékaři, sestry a týmy" },
  { id: "luzka", title: "Nemocnice a dlouhodobá péče" },
  { id: "zdravi", title: "Zdraví a obyvatelstvo" },
];

const c = <T extends Record<string, Cislo>>(x: T) => x;

export const CISLA = c({
  // --- Peníze ---------------------------------------------------------------
  netCost2038: {
    value: 21.5, range: [15, 25], unit: "mld. Kč ročně", year: "2038", prices: "ceny 2026", topic: "penize", kind: "scenar", source: "model",
    definition: "Čistý roční náklad reformy v plném náběhu: provoz včetně rezervy minus úspory počítané bez překryvů. Rozpětí zahrnuje strukturní scénáře.",
    forms: ["21,5 mld. Kč", "21,5 miliardy"],
  },
  netCost2035: {
    value: 16.9, unit: "mld. Kč ročně", year: "2035", prices: "ceny 2026", topic: "penize", kind: "scenar", source: "model",
    definition: "Čistý roční náklad uprostřed náběhu, s 330 týmy.", forms: ["17 mld. Kč", "16,9"],
  },
  netCost2050: {
    value: 24.9, unit: "mld. Kč ročně", year: "2050", prices: "ceny 2026", topic: "penize", kind: "scenar", source: "model",
    definition: "Čistý roční náklad s plným počtem sester (dvě na lékaře).", forms: ["24,9"],
  },
  opCost2038: {
    value: 22.8, unit: "mld. Kč ročně", year: "2038", prices: "ceny 2026", topic: "penize", kind: "scenar", source: "model",
    definition: "Provozní náklad reformy včetně 10% rezervy, před odečtením úspor.", forms: ["22,8"],
  },
  savings2038: {
    value: 1.2, unit: "mld. Kč ročně", year: "2038", prices: "ceny 2026", topic: "penize", kind: "scenar", source: "model",
    definition: "Úspory z méně zbytečných hospitalizací a kratších pobytů, bez překryvů.", forms: ["1,2 mld. Kč v roce 2038", "1,2 mld. Kč a v roce 2050"],
  },
  savings2050: {
    value: 3.6, unit: "mld. Kč ročně", year: "2050", prices: "ceny 2026", topic: "penize", kind: "scenar", source: "model",
    definition: "Úspory v roce 2050, bez překryvů.", forms: ["3,6 mld. Kč v roce 2050", "3,6 mld. Kč ročně"],
  },
  teamPayments: {
    value: 6, range: [4.8, 7.5], unit: "mld. Kč ročně", year: "2038", prices: "ceny 2026", topic: "penize", kind: "scenar", source: "model",
    definition: "Platby týmům v plném náběhu: lékařská složka, odměna za výsledky a příplatek za návštěvy.", forms: ["6 mld. Kč"],
  },
  variantB: {
    value: 17.8, unit: "mld. Kč ročně", year: "2038", prices: "ceny 2026", topic: "penize", kind: "scenar", source: "model",
    definition: "Čistý náklad varianty B bez nových center (platí, když brána B3 v 12/2031 nebude splněna).", forms: ["17,8"],
  },
  variantC: {
    value: 11.3, unit: "mld. Kč ročně", year: "2038", prices: "ceny 2026", topic: "penize", kind: "scenar", source: "model",
    definition: "Čistý náklad minimální varianty C bez týmů; srovnávací základ.", forms: ["11,3"],
  },
  invest: {
    value: 27.5, range: [22, 33], rangeOnly: true, unit: "mld. Kč jednorázově", year: "2030–2038", prices: "ceny 2026", topic: "penize", kind: "scenar", source: "model",
    definition: "Investice do budov center a přeměny lůžek; po evropských fondech a dnešní státní podpoře zbývá zajistit 15 až 26 mld. Kč. Nízká jistota odhadu.",
    forms: ["22 až 33 mld. Kč", "22 až 33"],
  },
  statePaymentExtra: {
    value: 13, unit: "mld. Kč ročně", year: "2038", prices: "ceny 2026", topic: "penize", kind: "scenar", source: "model",
    definition: "Vyšší platba státu za státní pojištěnce (děti, důchodce, studenty) potřebná na reformu.", forms: ["13 mld. Kč", "13,0"],
  },
  statePaymentPerPerson: {
    value: 180, unit: "Kč měsíčně na státního pojištěnce", year: "2038", prices: "ceny 2026", topic: "penize", kind: "scenar", source: "model",
    definition: "Vyšší platba státu přepočtená na jednoho státního pojištěnce a měsíc.", forms: ["180 Kč měsíčně"],
  },
  per100Kc: {
    value: 7.2, unit: "mld. Kč ročně", year: "2026", topic: "penize", kind: "udaj", source: "model",
    sourceDetail: "6,0 mil. státních pojištěnců × 100 Kč × 12 měsíců",
    definition: "Kolik ročně stojí zvýšení platby státu o 100 Kč měsíčně na státního pojištěnce.", forms: ["7,2 mld. Kč"],
  },
  statePayees: {
    value: 6.0, unit: "mil. státních pojištěnců", year: "2026", topic: "penize", kind: "udaj", source: "tisk235",
    definition: "Počet osob, za které platí pojistné stát (děti, důchodci, studenti a další).", forms: ["6,0 mil."],
  },
  insuranceGap2035: {
    value: 59.7, unit: "mld. Kč ročně", year: "2035", prices: "ceny 2026", topic: "penize", kind: "projekce", source: "nrr",
    definition: "O kolik budou výdaje zdravotního pojištění vyšší než příjmy při dnešních pravidlech příjmů; reforma tuto mezeru nezpůsobuje ani nezavírá.",
    verify: "Studie v2 uváděla 59,6 a 104,2 mld. Kč; přesné hodnoty tabulky D.1 je třeba ověřit v primárním zdroji.",
    forms: ["60 mld. Kč", "59,7"],
  },
  insuranceGap2038: {
    value: 70, unit: "mld. Kč ročně", year: "2038", prices: "ceny 2026", topic: "penize", kind: "projekce", source: "nrr",
    definition: "Mezera mezi výdaji a příjmy zdravotního pojištění při dnešních pravidlech příjmů.", forms: ["70 mld. Kč", "70,0"],
  },
  insuranceGap2050: {
    value: 104.4, unit: "mld. Kč ročně", year: "2050", prices: "ceny 2026", topic: "penize", kind: "projekce", source: "nrr",
    definition: "Mezera mezi výdaji a příjmy zdravotního pojištění při dnešních pravidlech příjmů.",
    verify: "Studie v2 uváděla 104,2 mld. Kč; ověřit v primárním zdroji.", forms: ["104 mld. Kč", "104,4"],
  },
  insurersDeficit2026: {
    value: 14.9, unit: "mld. Kč", year: "plán 2026", topic: "penize", kind: "udaj", source: "tisk235",
    definition: "Plánovaný schodek všech zdravotních pojišťoven na rok 2026 (příjmy 555,8, výdaje 570,8 mld. Kč).", forms: ["14,9 mld. Kč"],
  },
  insurersReserves: {
    value: 43.2, unit: "mld. Kč", year: "konec 2025", topic: "penize", kind: "udaj", source: "tisk235",
    definition: "Zůstatek základních fondů všech sedmi pojišťoven (na začátku roku 2021 69,9 mld. Kč).", forms: ["43,2 mld. Kč"],
  },

  // --- Daně za zdraví ---------------------------------------------------------
  healthTaxPlan: {
    value: 5, range: [5, 7], unit: "mld. Kč ročně", year: "plný náběh", prices: "ceny 2026", topic: "dane", kind: "cil", source: "hspa",
    definition: "Plánovací hodnota výnosu daní za zdraví (tiché víno, valorizace lihu a piva, slazené nápoje), se kterou počítá rozpočet reformy.",
    forms: ["5 mld. Kč"],
  },
  peerTaxTarget: {
    value: 10, range: [10, 15], rangeOnly: true, unit: "mld. Kč ročně", year: "programový cíl", prices: "cenová hladina ve zdroji neuvedena", topic: "dane", kind: "cil", source: "peer",
    definition: "Cíl výnosu daní za zdraví podle Hospodářské strategie PEER; rozpočet reformy s ním nepočítá.", forms: ["10 až 15 mld. Kč", "10–15 mld. Kč"],
  },
  preventionFundShare: {
    value: 40, unit: "% výnosu, aspoň 2 mld. Kč", year: "od 2031", prices: "2 mld. Kč valorizovaně", topic: "dane", kind: "pravidlo", source: "peer",
    definition: "Podíl výnosu daní za zdraví pro Fond prevence zdravotních pojišťoven; vždy aspoň 2 mld. Kč ročně, valorizovaně.", forms: ["40 %"],
  },
  wineTax: {
    value: 23.4, unit: "Kč za litr", year: "od 2031 (plná sazba 2033)", topic: "dane", kind: "pravidlo", source: "studie",
    definition: "Spotřební daň z tichého vína, stejná jako u šumivého; malí nezávislí vinaři do 1 000 hl v letech 2031–2032 polovinu.", forms: ["23,40 Kč"],
  },

  // --- Lidé -----------------------------------------------------------------
  teams2038: {
    value: 520, unit: "týmů sdružené péče", year: "kolem 2038", topic: "lide", kind: "cil", source: "model",
    sourceDetail: "10,9 mil. obyvatel, asi 21 000 lidí na tým",
    definition: "Počet týmů sdružené péče v plném náběhu.", forms: ["520 týmů"],
  },
  nursesExtra2038: {
    value: 4000, unit: "sester navíc", year: "kolem 2038", topic: "lide", kind: "scenar", source: "model",
    definition: "Sestry v týmech navíc proti dnešku, dvě sestry na lékaře v týmu.", forms: ["4 000 sester"],
  },
  nursesPerYear: {
    value: 440, unit: "sester ročně", year: "průměr 2031–2038", topic: "lide", kind: "scenar", source: "model",
    definition: "Kolik sester ročně reforma potřebuje navíc; asi čtvrtina všeobecných sester, které v letech 2026–2037 vyjdou ze škol.", forms: ["440 sester"],
  },
  nursesNeed: {
    value: 24000, unit: "úvazků všeobecných sester", year: "do 2037", topic: "lide", kind: "projekce", source: "vladniProgram",
    definition: "Kolik nových všeobecných sester systém potřebuje za 10 až 12 let bez ohledu na reformu.", forms: ["24 000 úvazků", "24 000"],
  },
  nursesGrads: {
    value: 1250, unit: "absolventek ročně", year: "dnes", topic: "lide", kind: "udaj", source: "mz2025",
    sourceDetail: "s. 112 a 114: asi 680 z vysokých a 570 z vyšších odborných škol",
    definition: "Kolik všeobecných sester ročně dokončí studium (VŠ a VOŠ dohromady).", forms: ["680", "570"],
  },
  gpCount: {
    value: 5500, unit: "praktiků pro dospělé", year: "2026", topic: "lide", kind: "udaj", source: "uzisNrzp",
    definition: "Praktičtí lékaři pro dospělé; ročně jich ubývá 110 až 180 a 43,6 % je starších 60 let.", forms: ["5 500"],
  },
  gpLossPerYear: {
    value: 145, range: [110, 180], rangeOnly: true, unit: "praktiků ročně", year: "2026–2035", topic: "lide", kind: "projekce", source: "uzisNrzp",
    definition: "O kolik praktiků pro dospělé ročně ubude bez reformy.", forms: ["110 až 180", "110–180"],
  },
  childrenWithoutGp: {
    value: 182000, unit: "dětí", year: "2022", topic: "lide", kind: "udaj", source: "uzisDeti", inStudy: false,
    definition: "Děti bez registrujícího praktického lékaře pro děti a dorost.", forms: ["182 tisíc"],
  },
  ruralPractices: {
    value: 428, unit: "zaniklých ordinací (vzniklo 291)", year: "2018–2022", topic: "lide", kind: "udaj", source: "uzisPraxe",
    definition: "Ordinace praktiků v obcích do 2 000 obyvatel, které za čtyři roky zanikly.", forms: ["428"],
  },

  // --- Lůžka ----------------------------------------------------------------
  acuteBeds: {
    value: 48036, unit: "akutních lůžek", year: "2024", topic: "luzka", kind: "udaj", source: "uzisLuzka",
    definition: "Smluvní akutní lůžka (4,4 na 1 000 obyvatel).", forms: ["48 036"],
  },
  bedsToConvert: {
    value: 8000, unit: "lůžek", year: "do 2038", topic: "luzka", kind: "cil", source: "studie",
    definition: "Akutní lůžka přeměněná na následnou a dlouhodobou péči podle krajských plánů, asi 1 330 ročně od 2033.", forms: ["8 000 lůžek", "8 000 akutních lůžek"],
  },
  acuteOccupancy: {
    value: 56, unit: "% obložnost", year: "2024", topic: "luzka", kind: "udaj", source: "uzisLuzka",
    definition: "Obložnost standardních akutních lůžek (v roce 2015 65,6 %).", forms: ["z 56 %", "lůžek 56 %", "56 % (2024"],
  },
  followUpOccupancy: {
    value: 84.2, unit: "% obložnost", year: "2024", topic: "luzka", kind: "udaj", source: "uzisLuzka",
    definition: "Obložnost lůžek následné péče.", forms: ["84,2 %", "z 84 %"],
  },
  followUpLtcOccupancy: {
    value: 85.4, unit: "% obložnost", year: "2024", topic: "luzka", kind: "udaj", source: "uzisLuzka",
    definition: "Obložnost lůžek následné a dlouhodobé péče dohromady; v osmi krajích nad 85 %.", forms: ["85,4 %"],
  },
  acuteShare: {
    value: 29.7, unit: "% úhrad pojišťoven", year: "2024", topic: "luzka", kind: "udaj", source: "uzisUhrady",
    definition: "Podíl vlastní akutní lůžkové péče na úhradách zdravotních pojišťoven (hlavní ukazatel H6; cíl 26 % kolem 2038).", forms: ["29,7 %"],
  },
  gpShare: {
    value: 4.3, unit: "% úhrad pojišťoven", year: "2024", topic: "luzka", kind: "udaj", source: "uzisUhrady",
    definition: "Podíl praktiků pro dospělé na úhradách zdravotních pojišťoven.", forms: ["4,3 %"],
  },
  ltcNeed2035: {
    value: 39000, unit: "nových lůžek", year: "do 2035", topic: "luzka", kind: "projekce", source: "precechtel",
    definition: "Potřeba nových lůžek dlouhodobé a následné péče, zdravotních i sociálních.", forms: ["39 000"],
  },
  carersNeed2035: {
    value: 21000, unit: "pečovatelů", year: "do 2035", topic: "luzka", kind: "projekce", source: "deloitte",
    definition: "Potřeba úvazků terénních pečovatelů navíc (jen sociální služby).", forms: ["21 000 pečovatelů", "21 000"],
  },
  bedsLesson: {
    value: 5914, unit: "zrušených akutních lůžek (následných přibylo 22)", year: "2010–2013", topic: "luzka", kind: "udaj", source: "uzisHistorie",
    definition: "Kolik akutních lůžek ubylo bez náhradní kapacity; následných lůžek přibylo jen 22.", forms: ["5 914"],
  },

  // --- Zdraví a obyvatelstvo -------------------------------------------------
  acsc: {
    value: 592, unit: "hospitalizací na 100 000 obyvatel 15+", year: "2021/2022", topic: "zdravi", kind: "udaj", source: "oecdHag",
    definition: "Odvratitelné hospitalizace pro stavy ošetřitelné ambulantně (ACSC); průměr OECD 473. Cíl 550 v roce 2033 a 530 kolem roku 2038.", forms: ["592"],
  },
  treatableMortality: {
    value: 107.2, unit: "úmrtí na 100 000", year: "2023", topic: "zdravi", kind: "udaj", source: "eurostatMort",
    definition: "Léčitelná úmrtnost do 75 let, standardizovaná; průměr EU27 86,8.", forms: ["107,2"],
  },
  hlyMen: {
    value: 61.2, unit: "let ve zdraví (muži)", year: "poslední dostupná data", topic: "zdravi", kind: "udaj", source: "eurostatHly",
    definition: "Délka života ve zdraví při narození, muži; průměr EU 63,5. Cíl Hospodářské strategie PEER: o pět let víc během jedné generace.",
    verify: "Rok dat v Eurostatu.", forms: ["61,2"],
  },
  hlyWomen: {
    value: 62.4, unit: "let ve zdraví (ženy)", year: "poslední dostupná data", topic: "zdravi", kind: "udaj", source: "eurostatHly",
    definition: "Délka života ve zdraví při narození, ženy; průměr EU 64,2.", verify: "Rok dat v Eurostatu.", forms: ["62,4"],
  },
  over85: {
    value: 200000, unit: "lidí nad 85 let", year: "2024 (2050: 509 tisíc)", topic: "zdravi", kind: "projekce", source: "uzisProjekce", inStudy: false,
    definition: "Lidé nad 85 let dnes; v roce 2050 jich bude asi 509 tisíc.", forms: ["200 tisíc", "509 tisíc"],
  },
  alcohol: {
    value: 11.2, unit: "litru čistého alkoholu na osobu 15+", year: "2023", topic: "zdravi", kind: "udaj", source: "oecdHealth",
    definition: "Registrovaná spotřeba alkoholu; průměr OECD 8,5 litru.", forms: ["11,2"],
  },
});

export type CisloId = keyof typeof CISLA;

/** Hodnota čísla z registru. */
export const n = (id: CisloId): number => CISLA[id].value;

/** Číslo s českým formátem a jednotkou, např. „21,5 mld. Kč ročně“. */
export function fmt(id: CisloId, opts: { unit?: boolean; digits?: number } = {}): string {
  const x = CISLA[id] as Cislo;
  const v = x.rangeOnly && x.range ? fmtRange(id)! : x.value.toLocaleString("cs-CZ", { maximumFractionDigits: opts.digits ?? 1 });
  return opts.unit === false ? v : `${v} ${x.unit}`;
}

export function fmtRange(id: CisloId): string | null {
  const r = (CISLA[id] as Cislo).range;
  if (!r) return null;
  const f = (v: number) => v.toLocaleString("cs-CZ", { maximumFractionDigits: 1 });
  return `${f(r[0])} až ${f(r[1])}`;
}
