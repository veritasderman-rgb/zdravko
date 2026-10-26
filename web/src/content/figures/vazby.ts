/**
 * Vazby mezi opatřeními studie v3.2 (01-studie-zdravi-bliz-lidem-v3.2.md).
 *
 * Tři pohledy na totéž:
 *  1. MAPA: opatření jádra, podmínky, brány a klíčové zákony na časové ose po pásech.
 *     Vazba „needs“ znamená „bez A nejde B“ (tabulka 29 kroků, karty „Na čem závisí“,
 *     Část IV); vazba „boost“ znamená „A posiluje B“ (efekt, ne podmínka).
 *     Pravidlo: vazba „needs“ nikdy nemíří proti času (kontroluje scripts/check-vazby.ts).
 *  2. ORGANIGRAMY: každé opatření z registru (Příloha A) pod opatřením jádra nebo
 *     podmínkou, na které stojí; doprovod Manifestu bez vazby na jádro podle oblastí.
 *  3. MATICE: které opatření hýbe kterým hlavním ukazatelem H1–H8 (sloupec „ukazatel“
 *     registru).
 *
 * Názvy a termíny jsou zkrácené ze studie; nic, co ve studii není, sem nepatří.
 */

export type LaneId = "rizeni" | "penize" | "lide" | "primarni" | "sit" | "doma";

/** Pořadí pásů minimalizuje délku vazeb mezi pásy (spočítáno přes všechna pořadí). */
export const LANES: { id: LaneId; title: string }[] = [
  { id: "penize", title: "Peníze a daně" },
  { id: "doma", title: "Prevence a péče doma" },
  { id: "rizeni", title: "Řízení, data a brány" },
  { id: "primarni", title: "Primární péče" },
  { id: "lide", title: "Lidé" },
  { id: "sit", title: "Lůžka a síť" },
];

/** Časové sloupce mapy (podle prvního účinku opatření v základním scénáři „Vláda 2030“). */
export const COLUMNS = ["2027–2028", "2029", "2030", "2031", "2032", "2033 a dál"];
/** Kdo je u moci: první dva sloupce opozice, od přelomu 2029/2030 vláda. */
export const OPPOSITION_COLS = 2;

export type MapKind = "core" | "cond" | "gate" | "step" | "result" | "extra";

export type MapNode = {
  id: string;
  /** Kód z registru nebo brány; kroky bez kódu ho nemají. */
  code?: string;
  title: string;
  lane: LaneId;
  col: number;
  /** Pořadí v buňce (pás × sloupec), shora. */
  row: number;
  when: string;
  kind: MapKind;
};

export const MAP_NODES: MapNode[] = [
  // Řízení, data a brány
  { id: "hodn", code: "M4.4", title: "Nezávislý hodnotitel", lane: "rizeni", col: 0, row: 0, when: "jmenován do 12/2027", kind: "extra" },
  { id: "j5", code: "J5", title: "eŽádanka s triáží", lane: "rizeni", col: 0, row: 3, when: "návrh 2027; zákonem 1. 1. 2032", kind: "core" },
  { id: "pilot", title: "Pilot ve třech ORP", lane: "rizeni", col: 0, row: 1, when: "dohoda 6/2027; provoz 2028–2029", kind: "step" },
  { id: "b1", code: "B1", title: "Brána Mandát", lane: "rizeni", col: 0, row: 2, when: "6/2028", kind: "gate" },
  { id: "vz", title: "Věcné záměry zákonů", lane: "rizeni", col: 1, row: 0, when: "7/2028–12/2029", kind: "step" },
  { id: "b2", code: "B2", title: "Brána Koaliční smlouva", lane: "rizeni", col: 1, row: 1, when: "12/2029–1/2030", kind: "gate" },
  { id: "b3", code: "B3", title: "Brána Lidé a data", lane: "rizeni", col: 3, row: 0, when: "12/2031", kind: "gate" },
  { id: "b4", code: "B4", title: "Brána Nezávislé hodnocení", lane: "rizeni", col: 5, row: 0, when: "2033, před volbami", kind: "gate" },
  { id: "p5", code: "P5", title: "HSPA jako rámec hodnocení", lane: "rizeni", col: 5, row: 1, when: "zákonem 1. 1. 2033", kind: "cond" },

  // Peníze a daně
  { id: "dan", title: "Plánovací hodnota daní a pravidlo PEER", lane: "penize", col: 0, row: 0, when: "usnesení do 6/2028", kind: "step" },
  { id: "j8", code: "J8", title: "Daň z tichého vína, valorizace lihu a piva", lane: "penize", col: 3, row: 0, when: "1. 1. 2031", kind: "core" },
  { id: "pil411", code: "Pil4.11", title: "Tabák a nikotin: +5 % nad inflaci", lane: "penize", col: 3, row: 1, when: "1. 1. 2031", kind: "extra" },
  { id: "p4", code: "P4", title: "Fond prevence zdravotních pojišťoven", lane: "penize", col: 3, row: 2, when: "1. 1. 2031", kind: "cond" },
  { id: "j10", code: "J10", title: "Vzorec platby státu", lane: "penize", col: 3, row: 3, when: "1. 1. 2031", kind: "core" },
  { id: "j9", code: "J9", title: "Daň ze slazených nápojů", lane: "penize", col: 4, row: 0, when: "přijata 2030; účinná 1. 1. 2032", kind: "core" },
  { id: "m23", code: "M2.3", title: "Fondy pojišťoven → fondy rozšířené péče", lane: "penize", col: 4, row: 1, when: "1. 1. 2032", kind: "extra" },

  // Lidé
  { id: "j2", code: "J2", title: "Sestry v týmech a jejich kompetence", lane: "lide", col: 0, row: 2, when: "v pilotu 2028; plošně 2031", kind: "core" },
  { id: "j3", code: "J3", title: "Kompetence praktiků", lane: "lide", col: 0, row: 1, when: "podněty 2027; výkony 2031", kind: "core" },
  { id: "p2", code: "P2", title: "Rezidenční místa", lane: "lide", col: 0, row: 0, when: "rozpočet 2028; závazně 2031", kind: "cond" },
  { id: "p1", code: "P1", title: "Personální bilance po krajích", lane: "lide", col: 1, row: 0, when: "zveřejnit do 12/2029", kind: "cond" },

  // Primární péče
  { id: "j1", code: "J1", title: "Standard týmu a pětiletá smlouva", lane: "primarni", col: 0, row: 0, when: "v pilotu 2028", kind: "core" },
  { id: "j4", code: "J4", title: "Návštěvy doma a senior taxi", lane: "primarni", col: 0, row: 1, when: "v pilotu 2028; příplatek 2031", kind: "core" },
  { id: "smlouvy", title: "Pětileté smlouvy se všemi pojišťovnami", lane: "primarni", col: 2, row: 0, when: "od 2030, před zákonem", kind: "step" },
  { id: "zpp", title: "Zákon o primární péči", lane: "primarni", col: 3, row: 0, when: "schválen 2031; účinný 1. 1. 2032", kind: "step" },
  { id: "tymy", title: "Náběh týmů sdružené péče", lane: "primarni", col: 3, row: 1, when: "60 v roce 2031 → 520 kolem 2038", kind: "result" },
  { id: "centra", code: "Pil1.5", title: "Budovy center primární péče", lane: "primarni", col: 4, row: 0, when: "až po splněné B3, 2032–2038", kind: "extra" },

  // Lůžka a síť
  { id: "pil21", code: "Pil2.1", title: "Minimální objemy a personální standard", lane: "sit", col: 2, row: 0, when: "Věstník 2030–2031", kind: "extra" },
  { id: "zsit", title: "Zákon o síti lůžkové péče", lane: "sit", col: 4, row: 0, when: "přijat 2032; účinný nejpozději 1. 1. 2033", kind: "step" },
  { id: "zzs", code: "Pil2.4", title: "Dojezd záchranné služby", lane: "sit", col: 4, row: 1, when: "NV 1. 1. 2032; zákon 2033", kind: "extra" },
  { id: "j6", code: "J6", title: "Krajský plán sítě", lane: "sit", col: 5, row: 0, when: "příprava od 2031; plány 2033", kind: "core" },
  { id: "j7", code: "J7", title: "Kapacita následné a dlouhodobé péče", lane: "sit", col: 5, row: 1, when: "podmínka každé přeměny", kind: "core" },
  { id: "premena", title: "Přeměna 8 000 akutních lůžek", lane: "sit", col: 5, row: 2, when: "2033–2038; stop při obložnosti nad 85 %", kind: "result" },

  // Prevence a péče doma
  { id: "pil52", code: "Pil5.2", title: "Mobilní paliativní týmy", lane: "doma", col: 3, row: 0, when: "úhradová vyhláška 2031", kind: "extra" },
  { id: "pil51", code: "Pil5.1", title: "Delší indikace domácí péče sestrou", lane: "doma", col: 4, row: 0, when: "1. 1. 2032", kind: "extra" },
  { id: "pil412", code: "Pil4.12", title: "Nižší pojistné za péči o zdraví", lane: "doma", col: 4, row: 1, when: "odvykání 2031; pilot do 40 let 2032", kind: "extra" },
  { id: "p3", code: "P3", title: "Sociální účet a sdílené financování", lane: "doma", col: 5, row: 0, when: "zákonem 1. 1. 2034", kind: "cond" },
];

export type MapEdge = {
  from: string;
  to: string;
  /** needs = bez A nejde B; boost = A posiluje B. */
  kind: "needs" | "boost";
  /** Leží na kritické cestě (Část IV). */
  critical?: boolean;
  /** Proč, jednou větou podle studie. */
  why: string;
};

export const MAP_EDGES: MapEdge[] = [
  // Příprava v opozici
  { from: "hodn", to: "pilot", kind: "needs", why: "Hodnotitele jmenujeme před startem pilotu, aby výsledky nehodnotil ten, kdo pilot navrhl." },
  { from: "j1", to: "pilot", kind: "needs", critical: true, why: "Pilot běží na pětileté smlouvě týmu s pojišťovnou podle § 17 zák. 48/1997 Sb." },
  { from: "j5", to: "j1", kind: "needs", why: "Bez eŽádanky nejde měřit dostupnost ani počet lidí bez praktika." },
  { from: "j2", to: "j1", kind: "needs", why: "Bez sesterské složky je tým jen větší ordinace." },
  { from: "j1", to: "j4", kind: "needs", why: "Návštěvní dny si rozděluje tým." },
  { from: "j2", to: "j4", kind: "needs", why: "Kontroly doma dělá sestra týmu." },
  { from: "pilot", to: "b1", kind: "needs", why: "Brána B1 chce podepsaný pilot, jinak náhradní smluvní model." },
  { from: "hodn", to: "b1", kind: "needs", why: "Brána B1 chce jmenovaného hodnotitele a schválené definice ukazatelů." },
  { from: "dan", to: "b1", kind: "needs", why: "Brána B1 chce potvrzenou plánovací hodnotu daní za zdraví." },
  { from: "b1", to: "vz", kind: "needs", why: "Věcné záměry se píšou s mandátem z brány B1; teze tří z nich jsou hotové už k B1." },
  { from: "vz", to: "b2", kind: "needs", critical: true, why: "Velký zákon trvá 24–42 měsíců; bez hotových záměrů při nástupu vlády nedrží termín 1. 1. 2032." },
  { from: "pilot", to: "b2", kind: "needs", why: "Brána B2 chce průběžné vyhodnocení pilotu po roce provozu." },
  { from: "p1", to: "b2", kind: "needs", why: "Personální bilance po krajích se zveřejní do brány B2 a jde do volebního programu." },

  // Vlna 1: peníze
  { from: "b2", to: "j10", kind: "needs", critical: true, why: "Nový vzorec platby státu může přijmout až nová vláda; dnes platí pevný základ." },
  { from: "b2", to: "j8", kind: "needs", why: "Daně jsou ve vlně 1, předloze vlády z 1. pololetí 2030." },
  { from: "b2", to: "p4", kind: "needs", why: "Zákon o fondu je ve vlně 1." },
  { from: "dan", to: "p4", kind: "needs", why: "Fond dostane podle pravidla PEER nejméně 40 % výnosu, vždy aspoň 2 mld. Kč." },
  { from: "j8", to: "p4", kind: "needs", why: "V letech 2031–2032 fond platí z daně z vína a valorizace lihu a piva." },
  { from: "j8", to: "pil411", kind: "needs", why: "Obojí je jedna novela zák. 353/2003 Sb." },
  { from: "j8", to: "j10", kind: "boost", why: "Zbytek výnosu nad podíl fondu zvyšuje platbu státu do pojištění." },
  { from: "b2", to: "j9", kind: "needs", why: "Zákon o dani ze slazených nápojů vláda předloží 2030; ohlášený je ve volebním programu." },
  { from: "p4", to: "j9", kind: "needs", why: "Z fondu se platí programy ve školách, na které daň ze slazených nápojů navazuje." },
  { from: "j9", to: "p4", kind: "boost", why: "Od 2032 daň ze slazených nápojů fond doplňuje." },
  { from: "p4", to: "m23", kind: "needs", why: "Dnešní fondy prevence pojišťoven se mění na fondy rozšířené péče, až prevenci převezme nový fond." },
  { from: "p4", to: "pil412", kind: "needs", why: "Vázání přírůstku daně z tabáku na odvykání a zvýhodnění patří do zákona o fondu." },
  { from: "pil411", to: "pil412", kind: "needs", why: "Odvykání a nižší pojistné platí přírůstek daně z tabáku nad úroveň roku 2027." },

  // Primární péče
  { from: "pilot", to: "smlouvy", kind: "needs", why: "Smluvní model rozšiřuje to, co pilot vyzkoušel." },
  { from: "b2", to: "smlouvy", kind: "needs", why: "Smlouvy se všemi pojišťovnami a standard ve Věstníku přicházejí s novou vládou." },
  { from: "pilot", to: "zpp", kind: "needs", critical: true, why: "Zákon se píše podle pilotu; obrácené pořadí by znamenalo psát standard naslepo." },
  { from: "b2", to: "zpp", kind: "needs", critical: true, why: "Zákon musí být v legislativním plánu vlády 2030." },
  { from: "p1", to: "zpp", kind: "needs", why: "Personální bilance musí být zveřejněná před předložením zákona." },
  { from: "j10", to: "tymy", kind: "needs", critical: true, why: "Platby týmům stojí 4,8–7,5 mld. Kč ročně; peníze musí přijít rok před zákonem." },
  { from: "smlouvy", to: "tymy", kind: "needs", critical: true, why: "Do účinnosti zákona týmy fungují na smlouvě podle § 17 zák. 48/1997 Sb." },
  { from: "j2", to: "tymy", kind: "needs", critical: true, why: "Reforma potřebuje asi 440 sester ročně; platí se jen obsazená místa." },
  { from: "p1", to: "tymy", kind: "needs", why: "Bez bilance po krajích, náboru a rychlejších aprobací nemají týmy koho zaměstnat." },
  { from: "zpp", to: "tymy", kind: "boost", why: "Zákon ukotví standard týmu a víceletou smlouvu se všemi pojišťovnami." },
  { from: "j3", to: "tymy", kind: "boost", why: "Praktik vrátí do ordinace výkony od specialistů." },
  { from: "j2", to: "j3", kind: "boost", why: "Sestra uvolní praktikovi čas." },
  { from: "p2", to: "tymy", kind: "boost", why: "Rezidenční místa nahrazují ubývající praktiky." },
  { from: "j4", to: "tymy", kind: "boost", why: "Návštěvy doma obslouží ty, kdo do ordinace nedojdou." },
  { from: "zpp", to: "pil51", kind: "needs", why: "Delší indikace domácí péče je součástí novely zák. 48/1997 Sb. ve vlně 2." },

  // Brána B3 a centra
  { from: "j2", to: "b3", kind: "needs", critical: true, why: "Kritérium B3: obsazená aspoň polovina míst sester v týmech první vlny." },
  { from: "zpp", to: "b3", kind: "needs", critical: true, why: "Kritérium B3: zákon o primární péči schválený." },
  { from: "j5", to: "b3", kind: "needs", why: "Žádná brána bez dat: B3 stojí na registrech pojišťoven a eŽádance." },
  { from: "b3", to: "centra", kind: "needs", critical: true, why: "Investice do budov center se smluvně vážou až na splněnou B3; jinak varianta B bez center." },

  // Síť
  { from: "b2", to: "zsit", kind: "needs", why: "Zákon o síti je druhá velká předloha období; věcný záměr a ústavní rozbor musí být hotové předem." },
  { from: "zsit", to: "j6", kind: "needs", critical: true, why: "Desetiletý plán, fond přeměny a garanci příjmu umožní až zákon." },
  { from: "zpp", to: "j6", kind: "needs", why: "Krajský plán počítá se spádovými územími týmů ze zákona o primární péči." },
  { from: "pil21", to: "j6", kind: "boost", why: "Prahy objemu a personální standard vstupují do krajských plánů." },
  { from: "p1", to: "j7", kind: "needs", why: "Kapacita dlouhodobé péče potřebuje pečovatele a sestry z personální bilance." },
  { from: "p3", to: "j7", kind: "boost", why: "Sdílené financování přidá sociální kapacitu; do roku 2034 se lůžka mění hlavně na následná hrazená z pojištění." },
  { from: "j6", to: "premena", kind: "needs", critical: true, why: "Lůžko se přemění jen podle krajského plánu." },
  { from: "j7", to: "premena", kind: "needs", critical: true, why: "Akutní lůžko se nepřemění, dokud kraj neprokáže kapacitu následné a dlouhodobé péče." },
  { from: "zzs", to: "premena", kind: "needs", critical: true, why: "Přeměna jen s doloženým dojezdem záchranné služby." },
  { from: "tymy", to: "premena", kind: "needs", why: "Přeměna počítá s tím, že týmy od 2032 sníží počet odvratitelných hospitalizací." },
  { from: "b3", to: "b4", kind: "needs", why: "B4 hodnotí reformu, která prošla B3." },
  { from: "hodn", to: "b4", kind: "needs", why: "Zprávu pro B4 píše nezávislý hodnotitel." },
  { from: "p5", to: "b4", kind: "boost", why: "HSPA v zákoně dělá z hodnocení pravidelnou povinnost; bez něj platí smlouva s hodnotitelem." },
  { from: "b4", to: "premena", kind: "needs", why: "Brána B4 rozhodne: pokračovat, upravit, nebo zmenšit." },

  // Prevence a péče doma
  { from: "b2", to: "pil52", kind: "needs", why: "Úhradu paliativních týmů přinese úhradová vyhláška nové vlády 2031." },
];

// ---------------------------------------------------------------------------
// Organigramy pilířů
// ---------------------------------------------------------------------------

export type OrgItem = { code: string; children?: OrgItem[] };
export type OrgGroup = { id: string; title: string; lead: string; roots: OrgItem[] };

const leaf = (...codes: string[]): OrgItem[] => codes.map((code) => ({ code }));

export const ORG_GROUPS: OrgGroup[] = [
  {
    id: "pilir-1",
    title: "Pilíř 1 · Primární péče a lidé",
    lead: "Tým sdružené péče stojí na sestrách, praktikách a penězích; doplňková opatření z něj dělají službu pro děti, večery i místa bez lékaře.",
    roots: [
      { code: "J1", children: leaf("Pil1.1", "Pil1.2", "Pil1.3", "Pil1.5", "M10.1") },
      { code: "J2", children: leaf("M8.3", "M8.4") },
      { code: "J3", children: leaf("Pil1.4") },
      { code: "P1", children: leaf("M8.5") },
      { code: "P2", children: leaf("M8.1", "M8.2", "M10.5") },
    ],
  },
  {
    id: "pilir-2",
    title: "Pilíř 2 · Síť lůžkové péče",
    lead: "Krajský plán rozhoduje, co se s lůžky stane; kapacita dlouhodobé péče a dojezd záchranky určují, kdy smí přeměna začít.",
    roots: [
      { code: "J6", children: leaf("Pil2.1", "Pil2.2", "Pil2.3", "Pil2.4", "Pil2.5", "Pil2.6", "M3.3") },
      { code: "J7" },
    ],
  },
  {
    id: "pilir-3",
    title: "Pilíř 3 · Digitální nástroje a data",
    lead: "eŽádanka s triáží je první krok: bez dat v reálném čase nejde měřit čekání ani rozhodovat v branách.",
    roots: [{ code: "J5", children: leaf("Pil3.1", "Pil3.2", "Pil3.3", "M3.1", "M4.2") }],
  },
  {
    id: "pilir-4",
    title: "Pilíř 4 · Prevence a daně za zdraví",
    lead: "Daně za zdraví plní Fond prevence; z něj se platí screening, očkování, zubní prevence a odměna za péči o zdraví.",
    roots: [
      { code: "J8", children: leaf("Pil4.11", "Pil4.1", "Pil4.2", "Pil4.3", "Pil4.4", "Pil4.5") },
      { code: "J9", children: leaf("Pil4.10") },
      { code: "P4", children: [...leaf("Pil4.12", "Pil4.7", "Pil4.8", "Pil4.9"), { code: "Pil4.6", children: leaf("M7.3") }, { code: "M2.3" }] },
    ],
  },
  {
    id: "pilir-5",
    title: "Pilíř 5 · Péče doma a závěr života",
    lead: "Návštěvy týmu, domácí péče a paliativní týmy drží lidi doma; sociální účet rozhoduje, zda bude kam jít, když doma už to nejde.",
    roots: [
      { code: "J4", children: [...leaf("Pil5.1", "Pil5.3"), { code: "Pil5.2", children: [...leaf("Pil5.5", "Pil5.6"), { code: "Pil5.7", children: leaf("M9.5") }] }] },
      { code: "P3", children: leaf("Pil5.4", "M10.4") },
    ],
  },
  {
    id: "cela-reforma",
    title: "Celá reforma · platba státu a hodnocení",
    lead: "Vzorec platby státu platí všechny pilíře; nezávislé hodnocení podle HSPA rozhoduje v branách, zda pokračovat.",
    roots: [{ code: "J10" }, { code: "P5", children: leaf("M4.3", "M4.4", "M4.1", "M1.1", "M6.4") }],
  },
];

/** Doprovod Manifestu, který na jádro přímo nenavazuje: podle oblastí (Část XI). */
export const ORG_MANIFEST: { area: string; codes: string[] }[] = [
  { area: "1. Hodnocení účelnosti a standard péče", codes: ["M1.2", "M1.3", "M1.4"] },
  { area: "2. Rozšířená péče bez úplatků", codes: ["M2.1", "M2.2", "M2.4"] },
  { area: "3. Pojišťovny, DRG a evidence nároků", codes: ["M3.2", "M3.4"] },
  { area: "4. Transparence a otevřená data", codes: ["M4.5"] },
  { area: "5. Dostupné léky", codes: ["M5.1", "M5.2", "M5.3", "M5.4"] },
  { area: "6. Klinický výzkum", codes: ["M6.1", "M6.2", "M6.3"] },
  { area: "7. Stomatologie", codes: ["M7.1", "M7.2", "M7.4", "M7.5"] },
  { area: "9. Práva pacientů", codes: ["M9.1", "M9.2", "M9.3", "M9.4"] },
  { area: "10. Duševní zdraví", codes: ["M10.2", "M10.3"] },
];

// ---------------------------------------------------------------------------
// Matice vlivů
// ---------------------------------------------------------------------------

export const MAIN_INDICATORS: { code: string; short: string }[] = [
  { code: "H1", short: "Lidé bez praktika" },
  { code: "H2", short: "Týmy a sestry" },
  { code: "H3", short: "Čekání podle naléhavosti" },
  { code: "H4", short: "Kontinuita péče" },
  { code: "H5", short: "Zbytečné hospitalizace" },
  { code: "H6", short: "Podíl akutních lůžek" },
  { code: "H7", short: "Odvratitelná úmrtí" },
  { code: "H8", short: "Ničivé výdaje domácností" },
];

export const MATRIX_GROUPS: { title: string; prefixes: string[] }[] = [
  { title: "Pilíř 1 · Primární péče a lidé", prefixes: ["J1", "J2", "J3", "P1", "P2", "Pil1."] },
  { title: "Pilíř 2 · Síť lůžkové péče", prefixes: ["J6", "J7", "Pil2."] },
  { title: "Pilíř 3 · Digitální nástroje a data", prefixes: ["J5", "Pil3."] },
  { title: "Pilíř 4 · Prevence a daně za zdraví", prefixes: ["J8", "J9", "P4", "Pil4."] },
  { title: "Pilíř 5 · Péče doma a závěr života", prefixes: ["J4", "P3", "Pil5."] },
  { title: "Doprovod Manifestu", prefixes: ["M"] },
];
