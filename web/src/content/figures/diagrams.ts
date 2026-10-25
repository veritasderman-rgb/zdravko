/**
 * Data diagramů studie „Zdraví blíž lidem“ v3 (01-studie-zdravi-bliz-lidem-v3.md).
 * U každého diagramu je odkaz na řádky studie, ze kterých obsah vychází. Rozvržení
 * a popisky uzlů odpovídají interaktivní verzi diagramů v dokumentu Claude Docs
 * „Zdraví blíž lidem — studie reformy zdravotnictví, verze 3“; čísla a termíny jsou
 * ověřené proti textu a tabulkám studie. Nic, co ve studii není, sem nepatří.
 *
 * Co už je v `@/content/reforma` (GATES, FUNDING, NET_COST, COST_2038 …), se tu neopisuje.
 */

/** Druh uzlu určuje jen vzhled (viz study-figures/diagrams/shared.tsx). */
export type NodeKind =
  | "base" // běžný krok nebo instituce
  | "core" // opatření jádra J1–J10
  | "cond" // podmínka P1–P5
  | "gate" // brána
  | "result" // výsledek, souhrn
  | "main" // zvýrazněný krok
  | "new" // nový prvek po reformě
  | "changed" // mění se úloha
  | "same" // beze změny
  | "warn" // předpoklad, pojistka, zastavení
  | "decision"; // rozhodnutí (kosočtverec)

export type EdgeKind = "normal" | "critical" | "dashed" | "new" | "stop" | "line";

export type DNode = {
  id: string;
  title: string;
  code?: string;
  lines?: string[];
  kind?: NodeKind;
  /** Číslo díry (organigram dnes) nebo díry, kterou prvek zavírá (cílový stav). */
  badge?: number;
};

export type DEdge = { from: string; to: string; kind?: EdgeKind; label?: string };

export type DiagramSource = { lines: string; note?: string };

// ---------------------------------------------------------------------------
// 1. Kritická cesta reformy · 3 řetězce, 4 brány (ř. 71–117; tabulka kroků ř. 73–103)
// ---------------------------------------------------------------------------

export const CRITICAL_PATH = {
  source: { lines: "ř. 71–123 (tabulka 29 kroků ř. 73–103, text ř. 107–123)" } as DiagramSource,
  title: "Pilot před zákonem, peníze před týmy, kapacita před přeměnou lůžek",
  subtitle: "Tři řetězce a čtyři brány · základní scénář Vláda 2030 · pořadí, nikoli měřítko",
  periods: ["2027–6/2028", "7/2028–2029", "2030–2031", "2032", "2033–2038"],
  /** Brány leží mezi obdobími: B1 za 1. obdobím, B2 za 2. atd. (ř. 83, 87, 97, 101). */
  gateDates: { B1: "6/2028", B2: "12/2029–1/2030", B3: "12/2031", B4: "2033" } as Record<string, string>,
  lanes: [
    {
      id: "penize",
      name: "Peníze",
      steps: [
        { id: "p0", title: "Podněty do úhrad", lines: ["do 30. 6. 2027: sestry, výkony; plánovací hodnota daní"] },
        { id: "p1", title: "Znění a RIA", lines: ["§ 3c platba státu; víno, líh, pivo; slazené nápoje, fond"] },
        { id: "p2", title: "Vlna 1 účinná", lines: ["1. 1. 2031: vzorec platby státu, víno, fond prevence"] },
        { id: "p3", title: "Peníze na týmy", lines: ["slazené nápoje od 2032; platby týmům asi 6 mld. Kč ročně"] },
        { id: "p4", title: "Plný náběh", lines: ["21,5 mld. Kč ročně (15–25, ceny 2026); daně 5 mld. Kč"] },
      ] as DNode[],
    },
    {
      id: "pece",
      name: "Primární péče",
      steps: [
        { id: "l0", title: "Pilot ve 3 ORP", lines: ["dohoda do 6/2027, smlouva podle § 17; provoz 2028–2029"] },
        { id: "l1", title: "Věcný záměr", lines: ["zákon o primární péči, znění a RIA; první zpráva z pilotu"] },
        { id: "l2", title: "Smluvní model", lines: ["pětileté smlouvy všech pojišťoven; vyhláška 2031"] },
        { id: "l3", title: "Zákon účinný", lines: ["1. 1. 2032; týmy a sestry nabíhají: 60 → 120 týmů"] },
        { id: "l4", title: "520 týmů", lines: ["4 000 sester navíc; nikdo bez praktika v ORP s týmem"] },
      ] as DNode[],
    },
    {
      id: "luzka",
      name: "Síť lůžek",
      steps: [
        { id: "s0", title: "Kulaté stoly", lines: ["síť 2/2028, dlouhodobá péče 4/2028: pravidla plánu"] },
        { id: "s1", title: "Záměr zákona o síti", lines: ["ústavní rozbor; SGEI a veřejná podpora do 6/2029"] },
        { id: "s2", title: "Zákon o síti", lines: ["předložen 2031, účinný nejpozději 1. 1. 2033"] },
        { id: "s3", title: "Krajské plány", lines: ["první 2033; kraj doloží kapacitu dlouhodobé péče"] },
        { id: "s4", title: "Přeměna lůžek", lines: ["8 000 do roku 2038; stop při obložnosti nad 85 %"] },
      ] as DNode[],
    },
  ],
  /** Dvě závislosti napříč řetězci (ř. 111–113). */
  cross: [
    { from: "p2", to: "l3", kind: "dashed", label: "peníze před náběhem týmů" },
    { from: "l3", to: "s4", kind: "dashed", label: "týmy před přeměnou lůžek" },
  ] as DEdge[],
};

// ---------------------------------------------------------------------------
// 2. Teorie změny · 5 řetězců, 4 předpoklady (ř. 386–404)
// ---------------------------------------------------------------------------

export const THEORY_OF_CHANGE = {
  source: { lines: "ř. 386–404 (tabulka řetězců ř. 394–400); předpoklady podle pravidel rozhodování ř. 1954–1961" } as DiagramSource,
  title: "Pět řetězců změny platí, jen když se splní čtyři předpoklady",
  subtitle: "Čte se zleva doprava: vstupy, činnosti, výstupy, výsledky, dopady",
  columns: ["Vstupy", "Činnosti", "Výstupy", "Výsledky", "Dopady"],
  inputs: [
    { id: "i1", title: "Peníze", lines: ["platby týmům, fond přeměny lůžek, daně za zdraví, platba státu (J10)"] },
    { id: "i2", title: "Lidé", lines: ["sestry a praktici, rezidenční místa, nábor a aprobace"] },
    { id: "i3", title: "Pravidla a data", lines: ["pětileté smlouvy, zákony vln 1 až 3, eŽádanka a registry"] },
  ] as DNode[],
  /** Pět řetězců: činnost → výstup → výsledek (měřený mezikrok) a síla evidence z tabulky ř. 396–400. */
  chains: [
    {
      name: "Týmy → kontinuita",
      evidence: "střední; pozorovací studie",
      activity: { id: "a1", title: "Týmy", lines: ["standard a smlouva, sestry, kompetence"], codes: ["J1", "J2", "J3"] },
      output: { id: "o1", title: "Týmy v terénu", lines: ["asi 520 kolem 2038, sestry v týmech"] },
      outcome: { id: "r1", title: "Kontinuita péče", lines: ["index UPC roste, méně lidí bez lékaře"] },
    },
    {
      name: "Péče doma → méně příjmů",
      evidence: "silná pro výsledky u chroniků, slabá pro úspory",
      activity: { id: "a2", title: "Péče doma", lines: ["návštěvní služba, doprava k lékaři"], codes: ["J4"] },
      output: { id: "o2", title: "Péče u pacienta", lines: ["návštěvy a kontroly podle protokolu"] },
      outcome: { id: "r2", title: "Méně příjmů", lines: ["odvratitelné hospitalizace (ACSC) a rehospitalizace"] },
    },
    {
      name: "eŽádanka → termín včas",
      evidence: "nízká; jde o nástroj měření, nikoli léčby",
      activity: { id: "a3", title: "eŽádanka", lines: ["triážní údaj, měření čekání"], codes: ["J5"] },
      output: { id: "o3", title: "Data o čekání", lines: ["po kategoriích a krajích, veřejně"] },
      outcome: { id: "r3", title: "Termín včas", lines: ["v lhůtě podle kategorie žádanky"] },
    },
    {
      name: "Síť → péče blíž domovu",
      evidence: "střední; závisí na politické vůli",
      activity: { id: "a4", title: "Síť", lines: ["plán sítě, kapacita dlouhodobé péče"], codes: ["J6", "J7"] },
      output: { id: "o4", title: "Přeměna lůžek", lines: ["8 000 do roku 2038, obložnost pod 85 %"] },
      outcome: { id: "r4", title: "Péče blíž domovu", lines: ["akutní lůžková péče z 29,7 % na 26 %"] },
    },
    {
      name: "Daně → zdravější volby",
      evidence: "silná",
      activity: { id: "a5", title: "Daně", lines: ["víno, líh a pivo, slazené nápoje"], codes: ["J8", "J9"] },
      output: { id: "o5", title: "Výnos a fond", lines: ["5 mld. Kč ročně, 2 mld. Kč do fondu prevence"] },
      outcome: { id: "r5", title: "Zdravější volby", lines: ["méně alkoholu a cukru, víc screeningu"] },
    },
  ],
  impacts: [
    { id: "m1", title: "Zdraví", lines: ["víc let ve zdraví, méně úmrtí, kterým šlo předejít"] },
    { id: "m2", title: "Spravedlnost", lines: ["menší rozdíly mezi kraji a skupinami, bez vyšších plateb"] },
    { id: "m3", title: "Udržitelnost", lines: ["síť, která obstojí ve stárnoucí společnosti"] },
  ] as DNode[],
  assumptions: [
    { id: "s1", title: "Sestry", lines: ["polovina míst obsazena do 12/2031 (brána B3)"], otherwise: "jinak varianta B" },
    { id: "s2", title: "Data", lines: ["eŽádanka a registry pojišťoven průběžně"], otherwise: "jinak brána čeká" },
    { id: "s3", title: "Peníze", lines: ["vzorec platby státu a daně ve vlně 1"], otherwise: "jinak varianta B" },
    { id: "s4", title: "Dlouhodobá péče", lines: ["kapacita v kraji před přeměnou lůžek"], otherwise: "jinak lůžko zůstává" },
  ],
};

// ---------------------------------------------------------------------------
// 3. Tři vrstvy opatření · 10 jádro, 5 podmínek, 10 oblastí doprovodu
//    (ř. 406–431; kódy a názvy z registru web/src/content/registr.json; oblasti ř. 2147–2158)
// ---------------------------------------------------------------------------

export const LAYERS = {
  source: { lines: "ř. 406–431; registr opatření (registr.json); oblasti Manifestu ř. 2147–2158" } as DiagramSource,
  title: "Bez deseti opatření jádra reforma není; pět podmínek ho drží",
  subtitle: "Tři vrstvy opatření; doprovod má vlastní harmonogram a jádro nezdržuje",
  /** Krátké popisky jádra a podmínek; plné názvy bere textová verze z registru. */
  short: {
    J1: "standard týmu a pětiletá smlouva",
    J2: "sesterská složka a kompetence sester",
    J3: "kompetence praktiků",
    J4: "návštěvní služba a doprava k lékaři",
    J5: "eŽádanka s triáží a měření čekání",
    J6: "krajský plán sítě lůžkové péče",
    J7: "kapacita následné a dlouhodobé péče",
    J8: "daň z tichého vína a valorizace daní z lihu a piva",
    J9: "pásmová daň ze slazených nápojů",
    J10: "nový vzorec platby státu (§ 3c)",
    P1: "personální bilance po krajích, nábor a aprobace",
    P2: "rezidenční místa pro primární péči",
    P3: "sociální účet, sdílené peníze na pomezí péče",
    P4: "Fond prevence, nejméně 40 % (aspoň 2 mld. Kč)",
    P5: "HSPA v zákoně jako rámec hodnocení",
  } as Record<string, string>,
  /** Deset oblastí Manifestu (tabulka ř. 2149–2158). */
  areas: [
    "Hodnocení účelnosti a standard péče",
    "Rozšířená péče",
    "Pojišťovny, DRG, evidence nároků",
    "Transparence a otevřená data",
    "Dostupné léky",
    "Světový klinický výzkum",
    "Stomatologie",
    "Vzdělání a podmínky personálu",
    "Práva pacientů",
    "Duševní zdraví",
  ],
};

// ---------------------------------------------------------------------------
// 4. Cesta pacienta · 7 kroků, 2 rozhodnutí, 3 vstupy mimo tým (ř. 488–518)
// ---------------------------------------------------------------------------

export const PATIENT_PATH = {
  source: { lines: "ř. 488–518 (pravidla 1–8 ř. 496–503); J5 ř. 690–700" } as DiagramSource,
  title: "Pořadí u specialisty určuje triáž v eŽádance; pacient se vrací ke svému týmu",
  subtitle: "Cesta pacienta po reformě · měkký gatekeeping, přímý přístup zůstává",
  nodes: [
    { id: "priznak", title: "Příznak", lines: ["pacient se ozve svému týmu"] },
    { id: "tym", title: "Tým sdružené péče", lines: ["jmenovitý lékař a sestra", "většinu potíží vyřeší sám"] },
    { id: "d1", title: "Je potřeba specialista?", kind: "decision" },
    { id: "ezadanka", title: "eŽádanka s triáží", kind: "main", lines: ["otázka, výsledky, kategorie: urgentní do 2 týdnů, do 6 týdnů, nebo plánovaná"] },
    { id: "specialista", title: "Ambulantní specialista", lines: ["termín v lhůtě kategorie; kategorii smí zdůvodněně změnit"] },
    { id: "d2", title: "Je potřeba hospitalizace?", kind: "decision" },
    { id: "nemocnice", title: "Nemocnice", lines: ["akutní lůžko jen při potřebě"] },
    { id: "nasledna", title: "Následná péče nebo domů", lines: ["propouštěcí zpráva týmu, návštěvy, paliativní tým"] },
    { id: "triaz", title: "Triáž kraje nebo pojišťovny", lines: ["pro lidi bez praktika a s varovnými příznaky; vystaví eŽádanku"] },
    { id: "primy", title: "Přímý přístup", lines: ["bez žádanky zůstává; se žádankou má pacient přednost"] },
    { id: "lhuta", title: "Lhůta nedodržena", lines: ["pojišťovna zajistí jiný termín; opakovaně: ztráta bonusu"] },
  ] as DNode[],
  edges: [
    { from: "priznak", to: "tym" },
    { from: "tym", to: "d1" },
    { from: "d1", to: "ezadanka", label: "ano" },
    { from: "d1", to: "tym", label: "ne: péče v týmu" },
    { from: "ezadanka", to: "specialista" },
    { from: "specialista", to: "d2" },
    { from: "d2", to: "nemocnice", label: "ano" },
    { from: "d2", to: "tym", label: "ne: zpětná zpráva" },
    { from: "nemocnice", to: "nasledna" },
    { from: "nasledna", to: "tym", label: "propuštění, návrat k jmenovitému lékaři" },
    { from: "priznak", to: "triaz", kind: "dashed", label: "bez praktika nebo s varovnými příznaky" },
    { from: "priznak", to: "primy", kind: "dashed", label: "přímo ke specialistovi" },
    { from: "triaz", to: "ezadanka", kind: "dashed" },
    { from: "primy", to: "specialista", kind: "dashed" },
    { from: "lhuta", to: "specialista", kind: "dashed", label: "jiný termín" },
  ] as DEdge[],
  /** Obory bez doporučení jako dnes (pravidlo 4, ř. 499). */
  directNote: "Ke gynekologovi, očnímu lékaři, zubaři, psychiatrovi a do dispenzarizované onkologie se chodí bez doporučení jako dnes.",
};

// ---------------------------------------------------------------------------
// 5. Organigram týmu sdružené péče · 7 částí týmu, 6 partnerů
//    (J1 ř. 538–586: tabulka standardu ř. 549–558; J2 ř. 598–606; J4 ř. 660–669; J5 ř. 690–700)
// ---------------------------------------------------------------------------

export const TEAM_ORG = {
  source: { lines: "ř. 538–586 (standard týmu ř. 549–558); J2 ř. 598–606; J4 ř. 660–669" } as DiagramSource,
  title: "Pacient má svého lékaře a sestru; tým kolem nich sdílí další profese",
  subtitle: "Tým sdružené péče · spádové území 10 až 25 tisíc obyvatel",
  center: { id: "dvojice", title: "Jmenovitá dvojice", kind: "main", lines: ["ošetřující lékař a sestra pro každého registrovaného", "zástup je výjimka", "kontinuita se měří (UPC)"] } as DNode,
  team: [
    { id: "dospeli", title: "Lékaři pro dospělé", lines: ["malý tým 5–7, střední 8–13"] },
    { id: "deti", title: "Lékaři pro děti", lines: ["2–4 lékaři, dětská sestra; dítě v 18 zůstává v týmu"] },
    { id: "sestry", title: "Sestry", lines: ["poradny chroniků podle protokolů; hodnotí dálkové sledování"] },
    { id: "profese", title: "Další profese", lines: ["nutriční terapeut, fyzioterapeut, psycholog"] },
    { id: "navstevy", title: "Návštěvní služba", lines: ["ležící a křehcí, lidé po propuštění"] },
    { id: "recepce", title: "Recepce a třídění požadavků", lines: ["1,5 úvazku; akutní stav týž den"] },
  ] as DNode[],
  partnersTop: [
    { id: "poj", title: "Zdravotní pojišťovny", lines: ["pětiletá smlouva se všemi; platba za funkce a výsledky"] },
    { id: "obec", title: "Obec a ORP", lines: ["budova centra, senior taxi"] },
    { id: "kraj", title: "Kraj", lines: ["telefonická triáž; plán sítě, pilot ve třech ORP"] },
  ] as DNode[],
  partnersBottom: [
    { id: "spec", title: "Ambulantní specialisté", lines: ["eŽádanka s triážním údajem; konzultace, zpětná zpráva"] },
    { id: "nem", title: "Nemocnice a ZZS", lines: ["propuštění s předáním týmu; pohotovost u urgentního příjmu"] },
    { id: "soc", title: "Domácí a paliativní péče", lines: ["sociální a pečovatelské služby; společný plán péče"] },
  ] as DNode[],
};

// ---------------------------------------------------------------------------
// 6. Proces krajského plánu sítě · 7 kroků, 1 kontrolní bod, spor a pojistka (ř. 882–898; J7 ř. 904)
// ---------------------------------------------------------------------------

export const NETWORK_PLAN = {
  source: { lines: "ř. 882–898 (J6); kontrolní body J7 ř. 904; dojezd ř. 958; pandemická rezerva ř. 968; pojistky ř. 978–984" } as DiagramSource,
  title: "Krajský plán sítě: kraj navrhuje, MZ schvaluje, spor rozhodne vláda",
  subtitle: "Návrh zákona o síti lůžkové péče · první plány 2033, revize po třech letech",
  nodes: [
    { id: "k1", title: "1 Data a metodika", lines: ["MZ a ÚZIS: potřeby, dojezdy, personál, sezónní špičky"] },
    { id: "k2", title: "2 Návrh plánu na 10 let", lines: ["kraj: služby, čtyři skupiny lůžek, personální plán"] },
    { id: "k3", title: "3 Veřejné projednání", lines: ["pojišťovny, nemocnice včetně soukromých, obce, ZZS"] },
    { id: "k4", title: "4 MZ: kontrolní body splněny?", kind: "decision" },
    { id: "nesplneno", title: "Nesplněno", lines: ["plán se vrací kraji"] },
    { id: "k5", title: "5 Schválení MZ", kind: "main", lines: ["plán je závazný; pojišťovny naplní síť podle § 46"] },
    { id: "spor", title: "Spor: rozhoduje vláda", lines: ["rozhodnutí s veřejným odůvodněním"] },
    { id: "body", title: "Kontrolní body kroku 4", lines: ["dojezd: urgentní příjem do 30 minut pro 95 % obyvatel", "kapacita následné péče (J7)", "obložnost akutních lůžek do 85 %", "personál pro novou roli", "pandemická rezerva intenzivní péče"] },
    { id: "k6", title: "6 Přeměna po milnících", lines: ["fond přeměny vyplácí garanci příjmu a investice"] },
    { id: "k7", title: "7 Revize po třech letech", lines: ["plán na 10 let se reviduje, první revize 2036"] },
    { id: "stop", title: "Stop přeměny v kraji", kind: "warn", lines: ["obložnost nad 85 % nebo chybí kapacita (J7)"] },
  ] as DNode[],
  edges: [
    { from: "k1", to: "k2" },
    { from: "k2", to: "k3" },
    { from: "k3", to: "k4" },
    { from: "k4", to: "nesplneno", label: "ne" },
    { from: "nesplneno", to: "k2", label: "přepracovat" },
    { from: "k4", to: "k5", label: "ano" },
    { from: "k4", to: "spor", label: "spor" },
    { from: "spor", to: "k5" },
    { from: "k5", to: "k6" },
    { from: "k6", to: "k7" },
    { from: "k7", to: "k2", label: "další plán" },
    { from: "k6", to: "stop", kind: "stop", label: "pojistka" },
  ] as DEdge[],
};

// ---------------------------------------------------------------------------
// 7. a 8. Graf závislostí (Část IV, ř. 1188–1240)
// ---------------------------------------------------------------------------

export const DEPS_MONEY = {
  source: { lines: "ř. 1188–1208 a 1224–1232 (Část IV); vlny podle ř. 85–95" } as DiagramSource,
  title: "Peníze a sestry musí být na místě dřív, než týmy v roce 2032 naběhnou",
  subtitle: "Graf závislostí 1/2: peníze a lidé · šipka = bez A nejde B · silná šipka = kritická cesta",
  nodes: [
    { id: "j8", code: "J8", title: "Víno a valorizace", kind: "core", lines: ["zák. 353/2003 Sb. · vlna 1", "účinnost 1. 1. 2031"] },
    { id: "j9", code: "J9", title: "Slazené nápoje", kind: "core", lines: ["nový zákon · vlna 1", "přijat 2030, účinný 2032"] },
    { id: "dane", title: "Daně za zdraví", lines: ["plán 5 mld. Kč ročně (5–7)", "odvody z práce se nesnižují"] },
    { id: "p4", code: "P4", title: "Fond prevence", kind: "cond", lines: ["zákon o fondu · vlna 1", "nejméně 40 %, aspoň 2 mld. Kč"] },
    { id: "j10", code: "J10", title: "Vzorec platby státu", kind: "core", lines: ["§ 3c zák. 592/1992 Sb. · vlna 1", "účinnost 1. 1. 2031"] },
    { id: "penize", title: "Peníze na týmy", lines: ["kapitace a víceletá platba", "4,8–7,5 mld. Kč ročně"] },
    { id: "p1", code: "P1", title: "Personální bilance", kind: "cond", lines: ["po krajích, nábor ze zahraničí", "a rychlejší aprobace"] },
    { id: "j2", code: "J2", title: "Sestry v týmech", kind: "core", lines: ["v pilotu 2028, plošně 2031", "kompetence: vyhl. 55/2011 Sb."] },
    { id: "p2", code: "P2", title: "Rezidenční místa", kind: "cond", lines: ["noví praktici pro dospělé", "i pro děti (PLDD zůstávají)"] },
    { id: "j3", code: "J3", title: "Kompetence praktiků", kind: "core", lines: ["preskripce, nové výkony (USG)", "seznam výkonů · vlna 0"] },
    { id: "b3", code: "B3", title: "Brána · 12/2031", kind: "gate", lines: ["polovina míst sester obsazena?"] },
    { id: "tymy", title: "Týmy sdružené péče: náběh od 1. 1. 2032", kind: "result", lines: ["kolem roku 2038 asi 520 týmů; nesplněná B3 = varianta B bez center"] },
  ] as DNode[],
  edges: [
    { from: "j8", to: "dane", kind: "critical" },
    { from: "j9", to: "dane" },
    { from: "dane", to: "p4", label: "nejméně 40 %, aspoň 2 mld. Kč" },
    { from: "dane", to: "j10", kind: "critical", label: "zbytek 3–4,2 mld. Kč" },
    { from: "j10", to: "penize", kind: "critical" },
    { from: "penize", to: "tymy", kind: "critical" },
    { from: "p1", to: "j2", kind: "critical" },
    { from: "j2", to: "b3", kind: "critical" },
    { from: "b3", to: "tymy", kind: "critical", label: "ano → s centry; ne → varianta B" },
    { from: "j3", to: "tymy" },
    { from: "p2", to: "tymy" },
  ] as DEdge[],
};

export const DEPS_CARE = {
  source: { lines: "ř. 1188–1210 a 1212–1240 (Část IV); vlny 0–3 ř. 77–99" } as DiagramSource,
  title: "Zákon o primární péči stojí na pilotu, přeměna lůžek na dlouhodobé péči",
  subtitle: "Graf závislostí 2/2: péče a síť · šipka = bez A nejde B · silná šipka = kritická cesta",
  nodes: [
    { id: "dohoda", title: "Dohoda o pilotu", lines: ["kraj, VZP a obce do 6/2027", "tři ORP v jednom kraji"] },
    { id: "j1", code: "J1", title: "Pětiletá smlouva", kind: "core", lines: ["podle § 17 zák. 48/1997 Sb.", "vlna 0, bez nového zákona"] },
    { id: "j5", code: "J5", title: "eŽádanka s triáží", kind: "core", lines: ["novela zák. 325/2021 Sb.", "měří čekání a lidi bez lékaře"] },
    { id: "pilot", title: "Pilot ve třech ORP", lines: ["provoz 2028–2029", "vyhodnocení 2029 a 2030"] },
    { id: "j4", code: "J4", title: "Návštěvy a doprava", kind: "core", lines: ["návštěvní služba týmu", "senior taxi s obcemi"] },
    { id: "data", title: "Data v reálném čase", lines: ["registry pojišťoven, NRZP", "podklad pro brány a HSPA (P5)"] },
    { id: "zpp", title: "Zákon o primární péči", lines: ["nová hlava zák. 372/2011 Sb.", "vlna 2, účinnost 1. 1. 2032"] },
    { id: "tymy", title: "Týmy sdružené péče", kind: "result", lines: ["náběh od 1. 1. 2032", "kolem roku 2038 asi 520 týmů"] },
    { id: "brany", code: "B1–B4", title: "Brány", kind: "gate", lines: ["B3 rozhodne o centrech", "hodnotí ÚZIS s univerzitou"] },
    { id: "zsit", title: "Zákon o síti", lines: ["přijat 2032 · vlna 3", "účinný nejpozději 1. 1. 2033"] },
    { id: "p3", code: "P3", title: "Sociální účet", kind: "cond", lines: ["sdílené financování", "zák. 108/2006 Sb. · vlna 4"] },
    { id: "zzs", title: "Dojezd záchranky", lines: ["plán pokrytí ZZS", "zák. 374/2011 Sb. · vlna 3"] },
    { id: "j6", code: "J6", title: "Krajský plán sítě", kind: "core", lines: ["10 let, čtyři skupiny lůžek", "první krajské plány 2033"] },
    { id: "j7", code: "J7", title: "Dlouhodobá péče", kind: "core", lines: ["do 2035 chybí asi 39 000 lůžek", "a asi 21 000 pečovatelů"] },
    { id: "premena", title: "Přeměna 8 000 lůžek", kind: "result", lines: ["z 48 036 na asi 40 000 do 2038", "fond přeměny 5–10 mld. Kč", "stop při obsazenosti nad 85 %"] },
  ] as DNode[],
  edges: [
    { from: "dohoda", to: "pilot", kind: "critical" },
    { from: "j1", to: "pilot", kind: "critical" },
    { from: "pilot", to: "zpp", kind: "critical" },
    { from: "zpp", to: "tymy", kind: "critical" },
    { from: "j4", to: "tymy" },
    { from: "j5", to: "data", kind: "critical" },
    { from: "data", to: "brany", kind: "critical" },
    { from: "brany", to: "tymy", kind: "critical" },
    { from: "zsit", to: "j6", kind: "critical" },
    { from: "j6", to: "premena", kind: "critical" },
    { from: "j7", to: "premena", kind: "critical" },
    { from: "p3", to: "j7" },
    { from: "zzs", to: "premena", kind: "critical" },
  ] as DEdge[],
};

// ---------------------------------------------------------------------------
// 9. a 10. Kdo plánuje, platí a řídí: dnes a kolem roku 2038 (ř. 1280–1290; příčiny ř. 348–362)
// ---------------------------------------------------------------------------

/** `span` = počet sloupců z 12 (výchozí 4). */
export type OrgLayer = { label: string; nodes: (DNode & { span?: 3 | 4 | 6 | 8 | 12 })[] };

export const ORG_TODAY = {
  source: { lines: "ř. 1280–1286; díry vycházejí z tabulky problém → příčina ř. 348–362 a z ř. 882–884, 1222" } as DiagramSource,
  title: "Dnes za cestu pacienta neodpovídá nikdo: plán, platba a péče jsou oddělené",
  subtitle: "Kdo v systému plánuje, platí a řídí, stav 2026 · čísla v kroužku jsou díry",
  layers: [
    {
      label: "Pravidla a rozpočty",
      nodes: [
        { id: "mz", title: "MZ", lines: ["zákony, vyhlášky, úhrady", "Věstník, seznam výkonů"], badge: 6 },
        { id: "mf", title: "MF", lines: ["státní rozpočet", "platí za státní pojištěnce"] },
        { id: "mpsv", title: "MPSV", lines: ["sociální služby", "příspěvek na péči"] },
      ],
    },
    {
      label: "Platba",
      nodes: [
        { id: "zp", title: "Zdravotní pojišťovny: VZP a šest zaměstnaneckých", span: 12, lines: ["správní rady · roční úhrady a smlouvy s poskytovateli · fondy prevence", "výběrová řízení podle § 46 zák. 48/1997 Sb."], badge: 5 },
      ],
    },
    {
      label: "Vlastnictví a plán",
      nodes: [
        { id: "kraje", title: "Kraje", lines: ["vlastní nemocnice a záchrannou službu", "oprávnění, plán sociálních služeb"], span: 6 },
        { id: "obce", title: "Obce", lines: ["budovy ordinací, sociální služby", "některé vlastní nemocnice"], span: 6 },
      ],
    },
    {
      label: "Data a dohled",
      nodes: [
        { id: "uzis", title: "ÚZIS", lines: ["statistiky NZIS se zpožděním 1–3 roky", "čekání na péči se neměří"], badge: 3, span: 6 },
        { id: "sukl", title: "SÚKL", lines: ["registrace, ceny a úhrady léků", "dozor nad léčivy"], span: 6 },
      ],
    },
    {
      label: "Péče",
      nodes: [
        { id: "praktik", title: "Praktický lékař, většinou sám", span: 12, lines: ["soukromá praxe · kapitace a výkony · sestra jen někde", "praktiků pro dospělé ubývá 110 až 180 ročně"], badge: 4 },
        { id: "spec", title: "Specialisté", lines: ["soukromé ambulance", "platba za výkony"] },
        { id: "nem", title: "Nemocnice", lines: ["kraje, stát, obce,", "soukromí vlastníci"], badge: 1 },
        { id: "soc", title: "Sociální služby", lines: ["jiný rozpočet", "a jiná dokumentace"], badge: 2 },
      ],
    },
    {
      label: "Člověk",
      nodes: [{ id: "pacient", title: "Pacient", span: 12, lines: ["platí pojistné (za státní pojištěnce stát) a cestu systémem hledá sám"] }],
    },
  ] as OrgLayer[],
  holes: [
    "Síť lůžek nikdo neplánuje jako celek: kraj vlastní, pojišťovna nasmlouvá, MZ reguluje.",
    "Zdravotní a sociální péče mají dva rozpočty a dvě ministerstva; senior uvízne mezi nimi.",
    "Data přicházejí se zpožděním 1–3 roky a čekání na péči se neměří.",
    "Za lidi bez praktika neodpovídá nikdo; cestu systémem si pacient hledá sám.",
    "Prevence je rozdrobená ve fondech prevence sedmi pojišťoven.",
    "Výkonnost systému nikdo nezávisle a pravidelně nehodnotí.",
  ],
};

export const ORG_2038 = {
  source: { lines: "ř. 1288–1290 (čtyři nové prvky); úlohy institucí podle Části III a VIII" } as DiagramSource,
  title: "Po reformě péči řídí tým ve spádu a síť lůžek plánuje kraj",
  subtitle: "Kdo plánuje, platí a řídí kolem roku 2038 · čísla v kroužku = díra, kterou prvek zavírá",
  layers: [
    {
      label: "Pravidla a rozpočty",
      nodes: [
        { id: "mz", title: "MZ", kind: "changed", lines: ["standard týmu a centra", "minimální objemy, úhrady"] },
        { id: "mf", title: "MF", kind: "changed", lines: ["vzorec platby státu (§ 3c)", "daně za zdraví 5 mld. Kč"] },
        { id: "mpsv", title: "MPSV", kind: "changed", lines: ["sdílené financování", "sociálně-zdravotní péče"] },
      ],
    },
    {
      label: "Platba",
      nodes: [
        { id: "zp", title: "Zdravotní pojišťovny", kind: "changed", span: 8, lines: ["pětiletá smlouva s týmy, garantovaný termín", "naplňují krajský plán sítě"] },
        { id: "nfp", title: "Fond prevence", kind: "new", span: 4, lines: ["40 % daní za zdraví, aspoň 2 mld. Kč", "rada fondu, vyúčtování"], badge: 5 },
      ],
    },
    {
      label: "Vlastnictví a plán",
      nodes: [
        { id: "kraje", title: "Kraje", kind: "changed", span: 6, lines: ["krajský plán sítě na 10 let", "fond přeměny, dojezd záchranky"], badge: 1 },
        { id: "obce", title: "Obce", kind: "changed", span: 6, lines: ["budovy center, senior taxi", "mohou založit tým, kde praktik chybí"] },
      ],
    },
    {
      label: "Data a hodnocení",
      nodes: [
        { id: "uzis", title: "ÚZIS", kind: "changed", span: 3, lines: ["NZIS a eŽádanka", "měří čekání"], badge: 3 },
        { id: "sukl", title: "SÚKL", kind: "same", span: 3, lines: ["léky, ceny, úhrady", "beze změny"] },
        { id: "hodnotitel", title: "Nezávislý hodnotitel", kind: "new", span: 3, lines: ["ÚZIS s univerzitou", "hodnotí brány"], badge: 6 },
        { id: "hspa", title: "HSPA (P5)", kind: "new", span: 3, lines: ["rámec hodnocení", "v zákoně"] },
      ],
    },
    {
      label: "Péče",
      nodes: [
        { id: "tym", title: "Tým sdružené péče ve spádovém území", kind: "new", span: 12, lines: ["praktici zůstávají soukromí · sestry a další profese · jmenovitý ošetřující lékař", "pětiletá smlouva se všemi pojišťovnami · návštěvní služba · dětské týmy zůstávají"], badge: 4 },
        { id: "spec", title: "Specialisté", kind: "changed", span: 4, lines: ["eŽádanka s triáží", "termín podle naléhavosti"] },
        { id: "nem", title: "Nemocnice", kind: "changed", span: 4, lines: ["přeměna lůžek podle", "krajského plánu sítě"] },
        { id: "soc", title: "Sociální služby", kind: "changed", span: 4, lines: ["sdílené financování", "se zdravotnictvím"], badge: 2 },
      ],
    },
    {
      label: "Člověk",
      nodes: [{ id: "pacient", title: "Pacient", kind: "changed", span: 12, lines: ["má jmenovitého lékaře v týmu; s eŽádankou má přednost, přímý přístup ke specialistovi zůstává"] }],
    },
  ] as OrgLayer[],
  /** Čtyři nové prvky (ř. 1290). */
  newElements: ["tým sdružené péče", "Fond prevence", "nezávislý hodnotitel", "HSPA jako zákonný rámec hodnocení"],
};

// ---------------------------------------------------------------------------
// 11. Toky peněz dnes a po reformě (ř. 1292–1300; Část V ř. 1302–1460)
// ---------------------------------------------------------------------------

export const MONEY_FLOWS = {
  source: { lines: "ř. 1292–1300; Část V: výdaje v. z. p. ř. 1366, platba státu ř. 1446, zdroje ř. 1442, fond přeměny ř. 1334, prevence ř. 1330–1331" } as DiagramSource,
  title: "Reforma přidává tři nové fondy a jeden nový zdroj, odvody z práce nemění",
  subtitle: "Toky peněz dnes a po reformě · částky v mld. Kč ročně, ceny 2026",
  today: {
    nodes: [
      { id: "poj", title: "Pojistné z práce", kind: "same", lines: ["zaměstnanci, zaměstnavatelé a OSVČ"] },
      { id: "sr", title: "Státní rozpočet", kind: "same", lines: ["platba za státní pojištěnce", "2 188 Kč měsíčně (2026)"] },
      { id: "sd", title: "Spotřební daně", kind: "same", lines: ["líh, pivo, tabák", "do rozpočtu bez vazby na zdraví"] },
      { id: "mpsv", title: "MPSV, kraje, obce a klienti", kind: "same", lines: ["příspěvek na péči, dotace"] },
      { id: "zp", title: "Zdravotní pojišťovny", kind: "same", lines: ["výdaje 2026: 570,8 mld. Kč", "roční úhrady podle vyhlášky"] },
      { id: "prakt", title: "Praktici", kind: "same", lines: ["kapitace a výkony", "úhrady na jeden rok"] },
      { id: "nem", title: "Specialisté a nemocnice", kind: "same", lines: ["výkony, DRG, paušály", "akutní lůžka 29,7 % úhrad"] },
      { id: "prev", title: "Prevence", kind: "same", lines: ["fondy prevence pojišťoven", "bez společných cílů"] },
      { id: "soc", title: "Sociální služby", kind: "same", lines: ["jiný rozpočet", "bez vazby na zdravotní péči"] },
    ] as DNode[],
    edges: [
      { from: "poj", to: "zp", kind: "normal" },
      { from: "sr", to: "zp", kind: "normal" },
      { from: "sd", to: "sr", kind: "normal" },
      { from: "zp", to: "prakt", kind: "normal" },
      { from: "zp", to: "nem", kind: "normal" },
      { from: "zp", to: "prev", kind: "normal" },
      { from: "mpsv", to: "soc", kind: "normal", label: "dva oddělené rozpočty" },
    ] as DEdge[],
  },
  after: {
    nodes: [
      { id: "poj", title: "Pojistné z práce", kind: "same", lines: ["beze změny", "odvody z práce se nesnižují"] },
      { id: "sr", title: "Státní rozpočet", kind: "changed", lines: ["nový vzorec § 3c od 2031", "reforma: asi 180 Kč měsíčně"] },
      { id: "dane", title: "Daně za zdraví", kind: "new", lines: ["5 mld. Kč ročně (5–7)", "2 do fondu prevence, 3 do platby státu"] },
      { id: "mpsv", title: "MPSV, kraje, obce a klienti", kind: "same", lines: ["mimo zdravotní pojištění"] },
      { id: "zp", title: "Zdravotní pojišťovny", kind: "changed", lines: ["pětiletá smlouva s týmy", "naplňují krajský plán sítě"] },
      { id: "fond", title: "Fond přeměny", kind: "new", lines: ["investice 5–10 mld. Kč jednorázově", "garance asi 1 mld. Kč, 2033–2040"] },
      { id: "nfp", title: "Fond prevence pojišťoven", kind: "new", lines: ["nejméně 40 % daní za zdraví"] },
      { id: "su", title: "Sociální účet", kind: "new", lines: ["sdílené financování", "se zdravotnictvím, vlna 4"] },
      { id: "tymy", title: "Týmy sdružené péče", kind: "new", lines: ["kapitace a víceletá platba", "navíc asi 6 mld. Kč (4,8–7,5)"] },
      { id: "nem", title: "Specialisté a nemocnice", kind: "changed", lines: ["přeměna 8 000 lůžek", "akutní lůžka 26 % úhrad"] },
      { id: "prev", title: "Prevence", kind: "changed", lines: ["screening, očkování 1,3 mld. Kč", "komunitní programy 0,7 mld. Kč"] },
      { id: "sz", title: "Sociálně-zdravotní péče", kind: "changed", lines: ["péče doma, dlouhodobá", "a paliativní péče"] },
    ] as DNode[],
    edges: [
      { from: "poj", to: "zp", kind: "normal" },
      { from: "sr", to: "zp", kind: "normal" },
      { from: "zp", to: "nem", kind: "normal" },
      { from: "dane", to: "sr", kind: "new" },
      { from: "dane", to: "nfp", kind: "new" },
      { from: "sr", to: "fond", kind: "new" },
      { from: "mpsv", to: "su", kind: "new" },
      { from: "zp", to: "tymy", kind: "new" },
      { from: "fond", to: "nem", kind: "new" },
      { from: "nfp", to: "prev", kind: "new" },
      { from: "su", to: "sz", kind: "new" },
    ] as DEdge[],
  },
};

// ---------------------------------------------------------------------------
// 12. Řízení reformy · v opozici (F0–F1) a ve vládě (F2–F4) (ř. 1946–1958; ř. 87–89)
// ---------------------------------------------------------------------------

export const GOVERNANCE = {
  source: { lines: "ř. 1946–1958; složení řídicího výboru ř. 89 (krok 14)" } as DiagramSource,
  title: "V opozici řídí resortní tým, ve vládě řídicí výbor s nezávislým hodnotitelem",
  subtitle: "Řízení přípravy a provádění reformy; řídicí výbor jediný schvaluje přechod branou",
  opposition: {
    heading: "V opozici: fáze F0 a F1, 2026–2029",
    nodes: [
      { id: "pred", title: "Předsednictvo strany", lines: ["schvaluje volební program a plánovací hodnotu daní"] },
      { id: "klub", title: "Poslanecký klub", lines: ["pozměňovací návrhy k vládním předlohám"] },
      { id: "rt", title: "Resortní tým (RT)", kind: "main", lines: ["vede studii, konzultace a věcné záměry zákonů"] },
      { id: "pi", title: "Institut Pi", lines: ["analýzy, oponentura, podpora věcných záměrů"] },
      { id: "partneri", title: "Partneři konzultace", lines: ["komory, sdružení praktiků, sestry, odbory, pojišťovny, kraje, obce, nemocnice, pacienti"] },
      { id: "pilot", title: "Pilot ve třech ORP", lines: ["kraj, VZP a obce; nezávislý hodnotitel jmenovaný před startem"] },
    ] as DNode[],
    edges: [
      { from: "pred", to: "rt", kind: "line" },
      { from: "klub", to: "rt", kind: "line" },
      { from: "pi", to: "rt", kind: "line" },
      { from: "rt", to: "partneri", kind: "line" },
      { from: "rt", to: "pilot", kind: "line" },
    ] as DEdge[],
  },
  government: {
    heading: "Ve vládě: fáze F2 až F4, od roku 2030",
    nodes: [
      { id: "vlada", title: "Vláda", lines: ["legislativní plán, předlohy, rozpočet"] },
      { id: "vybor", title: "Řídicí výbor reformy", kind: "main", lines: ["MZ, MPSV, MMR, MF, pojišťovny, kraje, obce, praktici, pacienti", "čtvrtletně; schvaluje přechod branou"] },
      { id: "hodnotitel", title: "Nezávislý hodnotitel", lines: ["ÚZIS s univerzitou, hodnotí každou bránu veřejně"] },
      { id: "kancelar", title: "Projektová kancelář reformy", lines: ["registr opatření, rizik a ukazatelů, podklady pro brány", "0,4 mld. Kč ročně"] },
      { id: "mz", title: "MZ", lines: ["legislativa + tým pro primární péči + tým pro síť"] },
      { id: "mpsv", title: "MPSV", lines: ["sociální účet, dlouhodobá péče"] },
      { id: "mf", title: "MF", lines: ["platba státu, daně za zdraví"] },
      { id: "kraje", title: "Kraje", lines: ["krajské plány sítě, fond přeměny"] },
      { id: "poj", title: "Pojišťovny", lines: ["pětileté smlouvy, data pro brány"] },
    ] as DNode[],
    edges: [
      { from: "vybor", to: "vlada", kind: "normal", label: "doporučuje" },
      { from: "hodnotitel", to: "vybor", kind: "normal", label: "zpráva výboru i veřejnosti" },
      { from: "vybor", to: "kancelar", kind: "line" },
      { from: "kancelar", to: "mz", kind: "line" },
      { from: "kancelar", to: "mpsv", kind: "line" },
      { from: "kancelar", to: "mf", kind: "line" },
      { from: "kancelar", to: "kraje", kind: "line" },
      { from: "kancelar", to: "poj", kind: "line" },
    ] as DEdge[],
  },
};

// ---------------------------------------------------------------------------
// 13. Mapa aktérů · 16 subjektů · pracovní odhad RT, k ověření (ř. 1846–1873)
// ---------------------------------------------------------------------------

/**
 * Umístění je pracovní odhad resortního týmu z interaktivní verze mapy (ř. 1852–1854):
 * `stance` 0 = odmítavý, 1 = podporující postoj k jádru; `influence` 0 = nízký, 1 = vysoký vliv.
 * `first`/`when` = první krok a termín z tabulky ř. 1858–1873.
 */
export const ACTOR_MAP = {
  source: { lines: "ř. 1846–1873 (mapa ř. 1852–1854, tabulka aktérů ř. 1856–1873)" } as DiagramSource,
  title: "Nejvíc vyjednávání čeká u nemocnic, ČLK a ministerstva financí",
  subtitle: "Vliv na prosazení reformy × dnešní postoj k jádru reformy",
  quadrants: {
    tl: "Vyjednávat: velký vliv, výhrady",
    tr: "Získat závazek: velký vliv, podpora",
    bl: "Informovat: menší vliv, výhrady",
    br: "Zapojit: menší vliv, podpora",
  },
  actors: [
    { name: "MF a NRR", stance: 0.18, influence: 0.86, hot: true, first: "předat model a požádat o technickou oponenturu", when: "2028" },
    { name: "ČLK", stance: 0.32, influence: 0.82, hot: true, first: "jednání s vedením komory nad verzí 3", when: "1. pololetí 2027" },
    { name: "nemocnice: AČMN a krajské", stance: 0.11, influence: 0.74, hot: true, first: "kulatý stůl k síti lůžek", when: "kontakt 2027, kulatý stůl 2028" },
    { name: "Asociace krajů ČR", stance: 0.44, influence: 0.67, labelLeft: true, first: "výzva krajům k přihlášce do pilotu", when: "1. čtvrtletí 2027" },
    { name: "potenciální koaliční partneři", stance: 0.5, influence: 0.88, first: "setkání zdravotních expertů stran", when: "2028–2029" },
    { name: "VZP", stance: 0.61, influence: 0.8, first: "návrh smlouvy pilotu vedení VZP", when: "1. čtvrtletí 2027, dohoda do 30. 6. 2027" },
    { name: "SPL ČR", stance: 0.67, influence: 0.69, first: "pracovní skupina ke standardu týmu", when: "1. čtvrtletí 2027" },
    { name: "SZP ČR", stance: 0.56, influence: 0.57, first: "jednání o náhradním modelu", when: "2027" },
    { name: "odbory: LOK-SČL, OSZSP ČR", stance: 0.37, influence: 0.57, labelLeft: true, first: "kulatý stůl k síti lůžek", when: "2028" },
    { name: "SPLDD ČR", stance: 0.46, influence: 0.4, labelLeft: true, first: "schůzka k dětským týmům", when: "1. čtvrtletí 2027" },
    { name: "vinaři a výrobci nápojů", stance: 0.09, influence: 0.36, first: "jednání o režimu malých vinařů", when: "konzultace 2028, ohlášení v programu 2029" },
    { name: "ČAS", stance: 0.81, influence: 0.54, first: "společná pracovní skupina", when: "1. čtvrtletí 2027" },
    { name: "SMO ČR", stance: 0.75, influence: 0.38, first: "setkání s novými vedeními obcí", when: "1. čtvrtletí 2027" },
    { name: "APSS ČR", stance: 0.88, influence: 0.27, first: "společná bilance kapacit", when: "2028" },
    { name: "pacientské organizace", stance: 0.73, influence: 0.19, first: "veřejná konzultace verze 3", when: "od 12/2026" },
    { name: "Mladí praktici", stance: 0.87, influence: 0.09, labelLeft: true, first: "dotazník a setkání", when: "1. pololetí 2027" },
  ],
};

// ---------------------------------------------------------------------------
// 14. Matice rizik · 19 rizik, 4 pole (Část X, ř. 2078–2112)
// ---------------------------------------------------------------------------

export type Risk = { code: string; name: string; category: string; prob: "vysoká" | "střední"; impact: "vysoký" | "střední"; gate: string; top?: boolean };

/** Registr rizik ř. 2094–2112; `top` = tři největší rizika (ř. 2080, 2086). */
export const RISK_MATRIX = {
  source: { lines: "ř. 2078–2112 (registr rizik ř. 2092–2112)" } as DiagramSource,
  title: "Pět z devatenácti rizik má vysokou pravděpodobnost i vysoký dopad",
  subtitle: "Pravděpodobnost × dopad · odborný odhad autorů, Projektová kancelář ho přehodnocuje čtvrtletně",
  quadrants: {
    "vysoká|vysoký": "Řešit hned",
    "střední|vysoký": "Mít pojistku připravenou",
    "vysoká|střední": "Sledovat a tlumit",
    "střední|střední": "Sledovat",
  } as Record<string, string>,
  risks: [
    { code: "R1", name: "Nedostatek sester a odliv z nemocnic", category: "personál", prob: "vysoká", impact: "vysoký", gate: "B3 (12/2031); nesplněno = varianta B", top: true },
    { code: "R2", name: "Úbytek praktiků", category: "personál", prob: "vysoká", impact: "vysoký", gate: "B1, B3" },
    { code: "R3", name: "Podhodnocené náklady", category: "peníze", prob: "vysoká", impact: "vysoký", gate: "B1, B2", top: true },
    { code: "R12", name: "Kapacita legislativy MZ", category: "implementace", prob: "vysoká", impact: "vysoký", gate: "B2", top: true },
    { code: "R13", name: "Koaliční partner nepodpoří", category: "politika", prob: "vysoká", impact: "vysoký", gate: "B2" },
    { code: "R4", name: "MF/NRR odmítne vzorec platby státu", category: "peníze", prob: "střední", impact: "vysoký", gate: "B2; účinnost 1. 1. 2031" },
    { code: "R6", name: "Ústavní napadení zákona o síti", category: "právo", prob: "střední", impact: "vysoký", gate: "předložení 2031; B3" },
    { code: "R9", name: "Řetězce a koncentrace vlastnictví praxí", category: "implementace", prob: "střední", impact: "vysoký", gate: "B3, B4" },
    { code: "R11", name: "Obložnost a dostupnost při přeměně lůžek", category: "implementace", prob: "střední", impact: "vysoký", gate: "krajský plán sítě; B3, B4" },
    { code: "R14", name: "Nedohodnutý pilot", category: "implementace", prob: "střední", impact: "vysoký", gate: "B1 (6/2028)" },
    { code: "R18", name: "Politická únava a ztráta podpory odborníků", category: "politika", prob: "střední", impact: "vysoký", gate: "B1" },
    { code: "R5", name: "Lobby nápojového průmyslu a vinařů", category: "politika", prob: "vysoká", impact: "střední", gate: "B2" },
    { code: "R15", name: "Zpoždění dat", category: "evidence", prob: "vysoká", impact: "střední", gate: "B3" },
    { code: "R16", name: "Souběh 1. 1. 2029", category: "implementace", prob: "vysoká", impact: "střední", gate: "B2" },
    { code: "R19", name: "Střet zájmů autora (vnímání)", category: "politika", prob: "vysoká", impact: "střední", gate: "B1" },
    { code: "R7", name: "SGEI a veřejná podpora", category: "právo", prob: "střední", impact: "střední", gate: "předložení 2031; B3" },
    { code: "R8", name: "Notifikace TRIS", category: "právo", prob: "střední", impact: "střední", gate: "B2 (legislativní plán)" },
    { code: "R10", name: "Ztráta kontinuity v týmech", category: "implementace", prob: "střední", impact: "střední", gate: "vyhodnocení pilotu 2030; B3" },
    { code: "R17", name: "IT: eŽádanka", category: "implementace", prob: "střední", impact: "střední", gate: "B1, B3" },
  ] as Risk[],
};
