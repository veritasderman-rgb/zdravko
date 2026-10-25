/**
 * Obsah veřejného webu. Čísla pocházejí ze studie „Zdraví blíž lidem“ v3.1 (23. 10. 2026),
 * z politické verze 3 a z prezentace „Co chceme a proč“. Částky jsou v mld. Kč ročně,
 * ceny roku 2026, pokud není uvedeno jinak.
 *
 * Čísla, která mají zdroj, rok a definici, žijí v registru `@/content/cisla`; datové řady tady
 * je jen čtou (n("…")). Texty, které číslo píší slovy, hlídá `pnpm check:cisla`.
 *
 * Jazyk: píšeme „my“ (navrhovatelé), krátké věty, odborné pojmy vysvětlujeme při prvním
 * použití a ve slovníčku (GLOSSARY).
 */

import { MODEL_NOTE, n } from "@/content/cisla";

export const META = {
  title: "Zdraví blíž lidem",
  subtitle: "Plán reformy zdravotnictví · verze 3.1 ke konzultaci · 23. 10. 2026",
  author: "Josef Pavlovic, resortní tým Zdravotnictví",
  claim: "Představujeme plán a hledáme pro něj podporu.",
  deadline: "31. 3. 2027",
};

export const KEY_NUMBERS = [
  { value: "21,5 mld. Kč", label: "ročně navíc, až reforma poběží naplno (kolem roku 2038)", note: "odhad 15 až 25 mld. Kč; necelá 4 % toho, co dnes stojí zdravotní pojištění" },
  { value: "520 týmů", label: "lékařů a sester blízko domova, s asi 4 000 sestrami navíc", note: "jeden tým pro 10 až 25 tisíc lidí" },
  { value: "8 000 lůžek", label: "v nemocnicích změní účel: z akutních na lůžka pro doléčení a rehabilitaci", note: "ze 48 036 na asi 40 000; nic nerušíme dřív, než je náhrada. Podle odhadu Ministerstva zdravotnictví z roku 2025 bude do roku 2035 potřeba nejméně 8 tisíc lůžek následné a dlouhodobé péče navíc" },
  { value: "5 mld. Kč", label: "ročně z daní na tiché víno a slazené nápoje", note: "plánujeme opatrně; program strany počítá s 10 až 15 mld. Kč. Nejméně 40 % jde na prevenci" },
];

// ---------------------------------------------------------------------------
// PROČ
// ---------------------------------------------------------------------------

export const SPENDING_SHARE = {
  title: "Na akutní lůžka jde téměř sedmkrát víc peněz než na praktické lékaře pro dospělé",
  source: "ÚZIS, platby zdravotních pojišťoven za rok 2024, podíl v procentech",
  rows: [
    { label: "Akutní lůžka v nemocnicích", value: n("acuteShare"), highlight: true },
    { label: "Ambulantní specialisté", value: 20.3 },
    { label: "Všichni praktici (dospělí i děti)", value: 6.4 },
    { label: "Praktici pro dospělé", value: n("gpShare"), highlight: true },
  ],
};

export const GP_DECLINE = {
  title: "Praktických lékařů pro dospělé ubývá: v roce 2035 jich bude 3 900 až 4 500 místo dnešních 5 500",
  source: "ÚZIS, NRZP a NRHZS, stav k 31. 3. 2023; ročně ubude 110 až 180 lékařů, téměř polovina (43,6 %) je starší 60 let",
  points: Array.from({ length: 10 }, (_, i) => {
    const year = 2026 + i;
    return { year, low: n("gpCount") - 180 * i, high: n("gpCount") - 110 * i };
  }),
};

export const BEDS = {
  title: "Akutní lůžka jsou obsazená z 56 %, lůžka pro doléčení a dlouhodobou péči z 85 %",
  source: "ÚZIS 2024. V osmi krajích je následná péče obsazená nad 85 %, tedy prakticky plná. Produkce akutní lůžkové péče klesá asi o 1,5 % ročně a řada nemocnic má oddělení s obložností pod 50 % (MZ ČR, 2025)",
  rows: [
    { label: `Akutní lůžka (${n("acuteBeds").toLocaleString("cs-CZ")})`, value: n("acuteOccupancy") },
    { label: "Lůžka následné a dlouhodobé péče (doléčení, rehabilitace)", value: n("followUpLtcOccupancy") },
  ],
  threshold: 85,
};

export const AVOIDABLE = {
  title: "Zbytečných hospitalizací máme o čtvrtinu víc než průměr vyspělých zemí",
  source: "OECD Health at a Glance 2025, data 2021/2022; hospitalizace na 100 000 obyvatel, kterým by předešla dobrá péče mimo nemocnici",
  rows: [
    { label: "Česko dnes", value: n("acsc"), highlight: true },
    { label: "Náš cíl pro rok 2033", value: 550 },
    { label: "Náš cíl kolem roku 2038", value: 530 },
    { label: "Průměr zemí OECD", value: 473 },
  ],
};

export const GAP = {
  title: "Zdravotnímu pojištění bude chybět 60 až 104 miliard ročně, i kdyby se nic neměnilo",
  source: `Mezera: Národní rozpočtová rada, září 2026, přepočet studie na ceny roku 2026 (přesné hodnoty tabulky D.1 se ověřují). Reforma tuto díru nezpůsobuje ani nezaceluje. Náklad reformy: ${MODEL_NOTE}`,
  rows: [
    { year: "2035", gap: n("insuranceGap2035"), reform: n("netCost2035") },
    { year: "2038", gap: n("insuranceGap2038"), reform: n("netCost2038") },
    { year: "2050", gap: n("insuranceGap2050"), reform: n("netCost2050") },
  ],
};

export const NURSES = {
  title: "Sester chybí už dnes: jen všeobecných sester je do 12 let potřeba nejméně 24 000 nových úvazků",
  source: "MZ ČR 2025 a vládní program pro nelékařské zdravotnické profese 2026 až 2037. Ve zdravotnictví pracuje asi 83 tisíc sester, 3 tisíce chybí, přes 12 tisíc je starších 60 let. Ročně vystuduje asi 680 sester na vysokých a 570 na vyšších odborných školách",
  rows: [
    { label: "Kolik nových všeobecných sester je ročně potřeba (24 000 za 12 let)", value: Math.round(n("nursesNeed") / 12) },
    { label: "Kolik všeobecných sester ročně vystuduje (VŠ a VOŠ)", value: n("nursesGrads") },
    { label: "Kolik navíc ročně potřebuje reforma (průměr)", value: n("nursesPerYear"), highlight: true },
  ],
};

export const PREVENTION_FACTS = [
  { value: "11,2 litru", label: "čistého alkoholu vypije průměrný Čech starší 15 let za rok (2023). Průměr vyspělých zemí je 8,5 litru." },
  { value: "+43 %", label: "víc úmrtí na nemoci jater než v průměru Evropské unie." },
  { value: "31 %", label: "lidí chodí na vyšetření tlustého střeva, které včas odhalí rakovinu. Ve vyspělých zemích 42 %." },
  { value: "60 až 70 %", label: "lidí s pozitivním testem na krev ve stolici dojde na kolonoskopii (MZ ČR, 2025)." },
  { value: "25 %", label: "seniorů je očkováno proti chřipce." },
  { value: "60 %", label: "žen chodí na mamografii, víc než ve většině vyspělých zemí. Kam systém lidi aktivně zve, tam prevence funguje." },
  { value: "0 Kč", label: "je dnes daň z tichého vína i ze slazených nápojů." },
];

// Proč teď: demografie a co znamená dostupnost. Čísla ze studie (Část I a Část III, pilíř 5; ÚZIS).
export const WHY_NOW = {
  eyebrow: "Proč to děláme",
  title: "Blíží se demografická vlna. Chceme udržet péči na dnešní úrovni, a to bez změn nejde.",
  lead: "Lidí nad 85 let je dnes 200 tisíc, v roce 2050 jich bude půl milionu. Těch, kdo se o ně postarají a kdo na péči vydělají, bude méně. To není názor, o kterém se dá diskutovat. Ti lidé už se narodili.",
  points: [
    {
      title: "Roky ve zdraví",
      text: "Péče na dnešní úrovni se udrží jen tehdy, když budeme stonat později a méně. Program strany si dává cíl prodloužit život ve zdraví o pět let během jedné generace. Proto prevence dostává stálé peníze a praktik se sestrou mají čas na dlouhodobě nemocné dřív, než skončí v nemocnici.",
    },
    {
      title: "Dostupnost není ordinace v každé obci",
      text: "Praktik nebude v každé z více než 6 000 obcí; není tam ani dnes. Dostupná péče znamená, že se k lékaři dostanete do několika desítek minut, že vás tam odveze senior taxi objednané obcí, když sami nemůžete, a že sestra z týmu přijede za vámi domů.",
    },
    {
      title: "Vybavená ordinace místo prázdné",
      text: "Vybavit každou ordinaci v každé obci ultrazvukem, EKG a laboratoří není finančně možné. Přístroje proto mají být tam, kam se lidé dostanou: v centru primární péče pro 10 až 25 tisíc lidí, kde slouží celý den místo hodiny týdně.",
    },
  ],
  facts: [
    { value: "200 → 509 tisíc", label: "lidí nad 85 let v letech 2024 a 2050 (ÚZIS)" },
    { value: "115 → 241 tisíc", label: "lidí nad 75 let s vysokou potřebou péče, příspěvek III a IV, v letech 2024 a 2050 (ÚZIS)" },
    { value: "2,5 vs 5,6", label: "pracovníků dlouhodobé péče na 100 seniorů u nás a v průměru OECD" },
  ],
};

export const PROBLEM_FACTS = [
  { value: "14,9 mld. Kč", label: "schodek plánují pojišťovny na rok 2026. Jejich rezervy klesly ze 69,9 na 43,2 mld. Kč." },
  { value: "182 tisíc", label: "dětí nemělo v roce 2022 svého dětského lékaře." },
  { value: "68 %", label: "seniorů nad 65 let má aspoň jednu vážnou chronickou nemoc. Diabetiků je přes milion (MZ ČR, 2025)." },
  { value: "428 : 291", label: "v malých obcích do 2 000 obyvatel zaniklo za čtyři roky 428 ordinací praktiků a jen 291 vzniklo." },
  { value: "5 914 : 22", label: "v letech 2010 až 2013 ubylo 5 914 akutních lůžek a přibylo jen 22 lůžek pro doléčení. Přesně tohle se nesmí opakovat." },
];

// ---------------------------------------------------------------------------
// CO CHCEME
// ---------------------------------------------------------------------------

export const FIVE_CHANGES = [
  {
    n: 1,
    title: "Svůj lékař a svoje sestra blízko domova",
    what: "Praktici se mohou dobrovolně spojit do týmu, který se stará o 10 až 25 tisíc lidí v okolí. V týmu je víc sester, k tomu nutriční terapeut, fyzioterapeut a psycholog, sestra jezdí za pacienty domů a obec zajistí odvoz k lékaři (senior taxi). Tým dostane od pojišťovny smlouvu na pět let místo ročního bonusu a platí se mu za to, co skutečně zajišťuje. Praktik bude smět víc než dnes: předepsat léky, kvůli kterým dnes posílá pacienta ke specialistovi, a udělat ultrazvuk přímo v ordinaci.",
    brings: "Lékaře i pro lidi, kteří ho dnes nemají. Péči o dlouhodobě nemocné, která nečeká, až se stav zhorší. A každý má v týmu svého jmenovitého lékaře a svou sestru, kteří ho znají.",
    when: "zkouška ve třech regionech 2028 a 2029 · zákon o primární péči platí od 1. 1. 2032 · asi 520 týmů a 4 000 sester navíc kolem roku 2038",
    codes: ["J1", "J2", "J3"],
    /** Jedna věta pro úvodní stránku (ChangeRow). */
    short: "Praktici se mohou dobrovolně spojit do týmu s víc sestrami. Sestra jezdí i za pacienty domů.",
    icon: "team" as const,
  },
  {
    n: 2,
    title: "Ke specialistovi podle toho, jak to spěchá",
    what: "Lékař v elektronické žádance zaškrtne, jak je vyšetření naléhavé: do 2 týdnů, do 6 týdnů, nebo plánované. Pojišťovna pak ručí za to, že pacient termín v této lhůtě dostane. Kdo chce jít ke specialistovi bez žádanky, může dál. Když lhůtu někdo nedodrží, nikdy to neodnese pacient.",
    brings: "Poprvé bude vidět, kdo a jak dlouho čeká. Dřív se dostane na řadu ten, kdo to víc potřebuje, a ne ten, kdo dřív zavolal.",
    when: "pozměňovací návrh k vládní novele o eŽádance 2027 až 2028 · zákonná záruka termínu od 1. 1. 2032",
    codes: ["J5"],
    /** Jedna věta pro úvodní stránku (ChangeRow). */
    short: "Lékař v žádance zaškrtne: do 2 týdnů, do 6 týdnů, nebo plánované. Pojišťovna ručí za termín.",
    icon: "clock" as const,
  },
  {
    n: 3,
    title: "Nemocnice se mění, neruší",
    what: "Každý kraj dostane podle nového zákona desetiletý plán své sítě nemocnic. Akutní lůžko se změní na lůžko pro doléčení, rehabilitaci nebo péči na konci života jen tehdy, když kraj doloží, že pacienti mají kam jít a že záchranka dojede včas. Nemocnici, která plán plní, dorovná fond přeměny po dobu změny příjem.",
    brings: "Okresní nemocnice dostane jistou roli blízko domova: doléčení, rehabilitaci, jednodenní chirurgii a ambulance. Náročný zákrok se udělá tam, kde ho dělají často a dobře. Evropské peníze z IROP už dnes dostane jen nemocnice, která zruší 20 akutních lůžek a zřídí 20 následných.",
    when: "zákon předložen 2031, přijat 2032, platí nejpozději od 1. 1. 2033 · první krajské plány 2033 · 8 000 změněných lůžek do roku 2038",
    codes: ["J6", "J7"],
    /** Jedna věta pro úvodní stránku (ChangeRow). */
    short: "Okresní nemocnice dostane jistou roli: doléčení, rehabilitaci, jednodenní chirurgii a ambulance.",
    icon: "hospital" as const,
  },
  {
    n: 4,
    title: "Prevence, která má stálé peníze",
    what: "Tiché víno zdaníme stejně jako šumivé (23,40 Kč na litr, malí vinaři polovinu), zavedeme daň ze slazených nápojů podle množství cukru po britském vzoru a daň z lihu a piva se bude každý rok zvyšovat s inflací. Počítáme opatrně s 5 mld. Kč ročně, program strany (Hospodářská strategie PEER) s 10 až 15 mld. Kč. Nejméně 40 % výnosu, vždy aspoň 2 mld. Kč, půjde do Fondu prevence zdravotních pojišťoven, zbytek do zdravotního pojištění.",
    brings: "Výrobci sníží cukr v nápojích dřív, než daň začne platit. Sestra zavolá, když vyjde pozitivní test. Očkovat bude moci i lékárna. Prevence přestane záviset na tom, co zbude.",
    when: "víno a valorizace od 1. 1. 2031 (víno zprvu poloviční sazbou, plná od 2033) · daň ze slazených nápojů přijata 2030, platí od 1. 1. 2032",
    codes: ["J8", "J9", "P4"],
    /** Jedna věta pro úvodní stránku (ChangeRow). */
    short: "Daně z tichého vína a slazených nápojů: nejméně 5 mld. Kč ročně, z toho nejméně 40 % na prevenci.",
    icon: "leaf" as const,
  },
  {
    n: 5,
    title: "Stáří a konec života doma, a ne na chodbě urgentu",
    what: "Sestra z týmu jezdí za křehkými seniory domů. Domácí péči půjde předepsat na delší dobu. V každém okrese bude mobilní tým paliativní péče, který se stará o lidi na konci života u nich doma. Pojišťovna zaplatí lékaři rozhovor o tom, jakou péči si člověk přeje, a sepsat „dříve vyslovené přání“ bude jednodušší. Dlouhodobá péče dostane vlastní veřejně sledovaný účet.",
    brings: "Doma místo chodby urgentního příjmu. Rodina, která ví, komu zavolat. Domov jako možnost, nikoli povinnost.",
    when: "dříve vyslovené přání jako poslanecký návrh 2028 až 2029 · domácí péče předepsaná sestrou od 1. 1. 2032 · paliativní týmy 2031 až 2034",
    codes: ["J4", "P3"],
    /** Jedna věta pro úvodní stránku (ChangeRow). */
    short: "Domov jako možnost, nikoli povinnost. V každém okrese mobilní paliativní tým.",
    icon: "home" as const,
  },
];

export const PATIENT_JOURNEY = [
  { step: "Hledám praktika", today: "Obvolávám ordinace. Kolik lidí nemá lékaře, nikdo neměří.", after: "Tým odpovídá za lidi ve svém okolí a nové pacienty přijímá. Komu pojišťovna do 30 dnů nezajistí registraci, tomu zajistí vyšetření u lékaře nebo sestry smluvního týmu. Počet lidí bez lékaře se zveřejňuje každé čtvrtletí za každý region." },
  { step: "Mám svou dvojici", today: "Jeden lékař a jedna sestra. Když lékař onemocní, ordinace zavře.", after: "Mám svého jmenovitého lékaře a svou sestru, kteří mě znají, i když pracují v týmu. Zástup je výjimka, nikoli pravidlo. Pojišťovna měří, jak často se pacient dostane ke svému lékaři, a platí za to." },
  { step: "Jsem dlouhodobě nemocný", today: "Kontrola jednou za půl roku. Kvůli receptu s omezením musím ke specialistovi.", after: "Sestra mě zve na kontroly podle plánu, nutriční terapeut se mnou sestaví jídelníček, který zvládnu. Praktik smí léčbu zahájit a upravit sám. U srdečního selhání hlídá váhu a tlak přístroj u mě doma a upozornění vyhodnocuje sestra, a ne stroj." },
  { step: "Potřebuji specialistu", today: "Objednávám se sám. Dřív jde ten, kdo dřív zavolá. Čekací doby nikdo neměří.", after: "Lékař v žádance zaškrtne, jak to spěchá (do 2 týdnů, do 6 týdnů, plánované), a objedná mě přímo. Pojišťovna ručí za termín. Bez žádanky mohu jít dál. Ke gynekologovi, očnímu, zubaři, psychiatrovi a do onkologie bez doporučení jako dnes." },
  { step: "Musím do nemocnice", today: "Zákrok i doléčení v nejbližší nemocnici, ať ho tam dělají dvacetkrát, nebo dvakrát ročně.", after: "Náročný zákrok v nemocnici, která ho dělá často. Doléčení a rehabilitace blízko domova, kam za mnou může rodina. Každý plán sítě musí zaručit, že 95 % obyvatel kraje má urgentní příjem do 30 minut jízdy." },
  { step: "Nedojdu k lékaři", today: "Záchranka a chodba urgentu, nebo nic.", after: "Lékař nebo sestra z týmu přijedou. Odvoz k lékaři (senior taxi) objedná obec a sladí ho s termínem vyšetření." },
  { step: "Vracím se z nemocnice", today: "Domácí péči předepíše praktik na tři měsíce, jiný lékař jen na 14 dnů. Sestra ji od roku 2026 smí jen upravit, pokud to lékař dovolí. Plán nikdo nekoordinuje.", after: "Domácí péče na delší dobu, může ji předepsat i sestra se specializací. V týmu je koordinátor péče. Jedno šetření stačí pro příspěvek na péči i pro plán péče." },
  { step: "Konec života", today: "Rozhovor o přáních nikdo nehradí. Dříve vyslovené přání je těžké platně sepsat a nikdo ho nenajde.", after: "Pojišťovna hradí rozhovor o plánu péče. Plán vidí i záchranka. V okrese je mobilní paliativní tým. Dříve vyslovené přání bez úředně ověřeného podpisu, uložené v registru. Domov je možnost, nikoli povinnost." },
  { step: "Platím", today: "Doplatky za léky a zubaře dnes pětinu nejchudších domácností finančně ničí.", after: "U lékaře nic nového neplatím: žádné poplatky, žádné příplatky za pořadí. Hlídáme, aby domácností, které zdravotní výdaje finančně ničí, nepřibývalo." },
];

export const NOT_DOING = [
  { title: "Žádné nové poplatky u lékaře", fear: "Budu u lékaře platit víc?", short: "Žádné nové poplatky.", text: "Nezavádíme regulační poplatky ani příplatky za to, že se někdo dostane na řadu dřív. Hlídáme, aby lidé neplatili ze své kapsy víc než dnes." },
  { title: "Dětští lékaři zůstávají", fear: "Zruší dětské lékaře?", short: "Dětští lékaři zůstávají.", text: "Nerušíme praktické lékaře pro děti a dorost. Děti budou mít svoje dětské týmy. Jen tam, kde dětský lékař chybí, bude moci dítě zaregistrovat praktik pro dospělé, který pracuje v týmu." },
  { title: "Nemocnice nerušíme, měníme jejich roli", fear: "Zavřou nám nemocnici?", short: "Měníme roli, nerušíme.", text: "Část akutních lůžek se změní na lůžka pro doléčení, rehabilitaci a péči na konci života. Žádné lůžko se nezmění dřív, než kraj doloží, že pacienti mají kam jít a že záchranka dojede včas." },
  { title: "Nic neprodáváme", fear: "Bude se privatizovat?", short: "Nic neprodáváme.", text: "Nemocnice ani pojišťovny se neprivatizují. Praktici zůstávají soukromými lékaři a o hodnotu své ordinace nepřijdou. Budovy zdravotních center budou patřit obci nebo kraji." },
  { title: "Nikoho nenutíme", fear: "Budu potřebovat doporučení?", short: "Nikoho nenutíme.", text: "Praktik se do týmu zapojí jen dobrovolně. Kdo zůstane sám, dostane od pojišťovny stejně jako dnes a nikdy méně. Ke specialistovi může každý dál i bez doporučení." },
  { title: "Reforma odvody nezvedá, ale neslibujeme, že nikdy neporostou", fear: "Zvednou se mi odvody?", short: "Reforma je nezvedá. Časem ale porostou tak jako tak.", text: "Tato reforma odvody z mezd nemění. Říkáme ale na rovinu, že zdravotnictví bude dražší: lidí, kteří potřebují péči, přibývá, a těch, kdo na ni vydělávají, ubývá. Časem se pojistné zvednout může. Podle programu strany ale jen spolu s nižší daní z příjmu, aby celkové zdanění práce nerostlo a nedopadlo nejvíc na lidi s nízkými příjmy. Bez těchto změn by bylo potřeba zvednout ho ještě víc, nebo by víc šlo na dluh. Výnos z daní na víno a slazené nápoje jde na prevenci a do zdravotního pojištění; plánujeme s 5 mld. Kč ročně." },
];

// Rozcestník pod hero úvodní stránky (AudienceEntry)
export const AUDIENCES = [
  { title: "Pacient a rodina", text: "Co se změní pro vás a vaše blízké", href: "/co-chceme", icon: "home" as const },
  { title: "Lékař a sestra", text: "Co reforma znamená pro vaši ordinaci", href: "/pro-koho#prakticti-lekari", icon: "team" as const },
  { title: "Obec, kraj, pojišťovna", text: "Co nabízíme a co potřebujeme", href: "/pro-koho", icon: "building" as const },
];

export const HONEST_CHANGES = [
  "Když z malé obce odejde lékař, nová ordinace tam nejspíš nevznikne. Nahradí ji tým z okolí: sestra, která přijede, ordinace otevřená jeden nebo dva dny v týdnu a odvoz k lékaři.",
  "Za některými náročnými zákroky se pojede dál než dnes.",
  "Tiché víno zdraží o 23,40 Kč na litr. Slazené nápoje s hodně cukru zdraží asi o 6 až 8 Kč na litr, pokud výrobce cukr nesníží.",
];

// ---------------------------------------------------------------------------
// JAK
// ---------------------------------------------------------------------------

export const PHASES = [
  { id: "F0", name: "Konzultace", from: 2026.85, to: 2028.5, text: "Kulaté stoly s odborníky, dohody o podpoře, návrhy ke vládním zákonům, dohoda o zkoušce ve třech regionech." },
  { id: "F1", name: "Příprava", from: 2028.5, to: 2030, text: "Hotové podklady zákonů, volební program, běžící zkouška." },
  { id: "F2", name: "První roky vlády", from: 2030, to: 2032, text: "Předložení zákonů. Peníze a daně platí od 1. 1. 2031." },
  { id: "F3", name: "Rozjezd", from: 2032, to: 2034, text: "Zákon o primární péči, zákon o síti nemocnic, první krajské plány." },
  { id: "F4", name: "Přeměna", from: 2034, to: 2039, text: "Týmů přibývá na 520, 8 000 lůžek mění účel, nezávislé hodnocení." },
];

export const GATES = [
  { id: "B1", name: "Mandát", at: 2028.45, when: "červen 2028", must: "Připomínky jsou vypořádané a zveřejněné. Plán je projednaný se všemi 10 klíčovými organizacemi (praktici, sestry, lékařská komora, pojišťovny, kraje, obce, pacienti, odbory) a jejich výhrady jsou zapracované. Zkouška ve třech regionech je podepsaná. Strana potvrdila, s jakým výnosem daní za zdraví rozpočet reformy počítá.", ifNot: "Co s některou organizací projednané není nebo zůstalo bez dohody, do volebního programu nejde. Místo zkoušky s krajem náhradní smlouva s jednou pojišťovnou." },
  { id: "B2", name: "Koaliční smlouva", at: 2030, when: "přelom let 2029 a 2030", must: "Jádro plánu je v koaliční smlouvě a v programu vlády. Zákony jsou v plánu vlády na rok 2030.", ifNot: "Do plánu vlády jde jen dohodnuté jádro. Zbytek zůstává programem pro další období." },
  { id: "B3", name: "Lidé a data", at: 2032, when: "prosinec 2031", must: "V prvních týmech je obsazená aspoň polovina míst pro sestry. Zákon o primární péči je schválený. Kraje pracují na plánech sítě.", ifNot: "Reforma pokračuje bez nových budov zdravotních center (varianta B). Všechno, co na budovách nezávisí, běží dál." },
  { id: "B4", name: "Nezávislé hodnocení", at: 2033.5, when: "rok 2033, před volbami", must: "Nezávislý hodnotitel (statistický ústav ÚZIS s univerzitou) vyhodnotí osm hlavních ukazatelů.", ifNot: "Hodnotitel doporučí pokračovat, upravit, nebo zmenšit. Rozhodnutí i důvody se zveřejní." },
];

export const MILESTONES = [
  { at: 2026.93, label: "Schválení verze 3 ke konzultaci", detail: "7. 12. 2026" },
  { at: 2027.25, label: "Konec prvního kola připomínek", detail: "31. 3. 2027" },
  { at: 2027.5, label: "Dohoda o zkoušce, návrhy do úhrad na rok 2028", detail: "30. 6. 2027" },
  { at: 2028, label: "Start zkoušky ve třech regionech", detail: "1. 1. 2028" },
  { at: 2029.8, label: "Volby do Sněmovny", detail: "říjen 2029" },
  { at: 2031, label: "Nová platba státu, daně a fond prevence platí", detail: "1. 1. 2031" },
  { at: 2032, label: "Zákon o primární péči platí", detail: "1. 1. 2032" },
  { at: 2033, label: "Zákon o síti nemocnic platí, první krajské plány", detail: "1. 1. 2033" },
  { at: 2038, label: "520 týmů, 8 000 změněných lůžek", detail: "kolem roku 2038" },
];

export const RULES = [
  { title: "Bez dat se nerozhoduje", text: "Každý kontrolní bod stojí na číslech, která v tu chvíli existují. Když chybí, rozhodnutí se odloží a důvod se zveřejní. Nerozhoduje odhad ani kalendář." },
  { title: "Když selže jedna část, zastaví se jen ta část", text: "Když třeba neprojde daň ze slazených nápojů, týmy a sestry pokračují. Reforma kvůli jednomu neúspěchu nekončí." },
  { title: "Málo sester znamená menší reformu", text: "Když do konce roku 2031 nebude v prvních týmech obsazená aspoň polovina míst pro sestry, nové budovy zdravotních center se nestaví a reforma pokračuje bez nich." },
  { title: "Lůžko se nemění bez náhrady", text: "Kraj musí nejdřív doložit, že má dost míst pro doléčení a dlouhodobou péči a že záchranka dojede včas. Když jsou akutní lůžka v kraji obsazená nad 85 %, přeměna se tam zastaví." },
];

export const STEPS_2029 = [
  { title: "Konzultace verze 3", when: "od prosince 2026", text: "Resortní tým schválí verzi 3 k veřejné konzultaci 7. 12. 2026. První kolo připomínek končí 31. 3. 2027. Následuje devět kulatých stolů. Jak jsme s každou připomínkou naložili, zveřejníme před červnem 2028." },
  { title: "Zkouška ve třech regionech", when: "2028 a 2029", text: "Město, venkov a region bez lékařů v jednom kraji, dohromady 100 až 150 tisíc lidí, 30 až 50 mil. Kč ročně. Ověříme, jestli lékaři do týmů vstoupí, jestli se najdou sestry a kolik to stojí." },
  { title: "Návrhy do pravidel úhrad", when: "do 30. 6. 2027", text: "Navrhneme, aby pojišťovny už od roku 2028 platily sestry v týmových ordinacích, ultrazvuk u praktika, sledování pacientů na dálku a konzultaci lékaře s lékařem. Rozhodne dnešní ministerstvo." },
  { title: "Návrhy ke vládním zákonům", when: "2027 a 2028", text: "Vláda právě otevírá stejné zákony, které potřebujeme. Navrhneme do nich víceleté smlouvy pro týmy a údaj o naléhavosti v elektronické žádance. Nepředkládáme protinávrh, navazujeme." },
  { title: "Poslanecké návrhy", when: "2028 a 2029", text: "Jednodušší „dříve vyslovené přání“ s registrem. Dobrovolné zveřejňování počtu lidí bez praktika po regionech." },
  { title: "Podklady zákonů", when: "7/2028 až 12/2029", text: "Zákon o primární péči, zákon o síti nemocnic, nová platba státu, daňové zákony a zákon o Fondu prevence. Bez hotových podkladů při nástupu vlády nemůže zákon platit od roku 2032." },
  { title: "Jedno číslo daní za zdraví", when: "do června 2028", text: "Strana veřejně slíbí 5 mld. Kč ročně a pravidlo, jak se rozdělí. Daň ze slazených nápojů ohlásíme dva roky předem, aby výrobci stihli snížit cukr." },
];

export const VARIANTS = {
  rows: [
    { key: "A", name: "A: plná, s novými centry", cost: n("netCost2038"), invest: "22 až 33", nurses: 4000, teams: "75 % praktiků", rural: "ano, obec nebo kraj založí tým", when: "základní varianta" },
    { key: "B", name: "B: bez nových center", cost: n("variantB"), invest: "6 až 11", nurses: 3450, teams: "65 %, jen kde ordinace je", rural: "jen tam, kde ordinace je", when: "když v roce 2031 chybí sestry" },
    { key: "C", name: "C: minimální", cost: n("variantC"), invest: "5 až 10", nurses: 0, teams: "žádné týmy", rural: "ne", when: "pro srovnání" },
  ],
  note: "Prevence, paliativní péče, konzultace lékařů a fond přeměny nemocnic jsou ve všech třech variantách. Rozdíl mezi A a B kupuje budovy, další profese v týmu a možnost, aby obec nebo kraj založily tým tam, kde ordinace zanikla.",
};

export const INDICATORS = [
  { code: "H1", name: "Lidé bez svého praktika", today: "neměří se; dětí bez dětského lékaře bylo 182 tisíc (2022)", y2033: "měří se od 2028; tam, kde je tým, aspoň o polovinu méně", y2038: "tam, kde je tým, nikdo bez jmenovitého lékaře" },
  { code: "H2", name: "Týmy a obsazená místa sester", today: "0 týmů podle standardu (241 týmových ordinací)", y2033: "aspoň 90 % plánovaných týmů; aspoň 50 % míst sester obsazeno", y2038: "520 týmů; aspoň 80 % míst obsazeno" },
  { code: "H3", name: "Čekání podle naléhavosti", today: "neměří se; na kolonoskopii po pozitivním testu se čeká 84 dní", y2033: "aspoň 80 % urgentních pacientů do 2 týdnů", y2038: "aspoň 90 % ve všech kategoriích" },
  { code: "H4", name: "Jak často se pacient dostane ke svému lékaři", today: "neměří se", y2033: "aspoň 7 z 10 návštěv u svého lékaře v prvních týmech", y2038: "aspoň 7 z 10 ve všech týmech" },
  { code: "H5", name: "Zbytečné hospitalizace na 100 000 lidí", today: "592 (průměr OECD 473)", y2033: "550", y2038: "530" },
  { code: "H6", name: "Podíl akutních lůžek na výdajích pojištění", today: "29,7 % (2024)", y2033: "28 %", y2038: "26 %" },
  { code: "H7", name: "Úmrtí, kterým šlo předejít", today: "léčitelná úmrtí 107 na 100 000 (EU 87)", y2033: "sledujeme bez cíle", y2038: "sledujeme bez cíle" },
  { code: "H8", name: "Domácnosti, které zdravotní výdaje finančně ničí", today: "6 % domácností; mezi nejchudšími 21 %", y2033: "nesmí přibýt", y2038: "nesmí přibýt" },
];

export const RISKS = [
  { risk: "Sestry nepřijdou nebo odejdou z nemocnic", signal: "každé čtvrtletí sledujeme, kolik míst pro sestry je v týmech obsazených a kolik volných míst mají nemocnice v kraji", safeguard: "týmy rostou postupně; plat jako v nemocnici, bez nočních; pojišťovna platí jen obsazené místo; když je sester polovina, nové budovy se nestaví" },
  { risk: "Bude to dražší", signal: "skutečné platby týmům ve zkoušce vybočí z odhadu; celkový náklad vybočí z 15 až 25 mld. Kč", safeguard: "místo jednoho čísla počítáme s rozpětím; model zveřejníme i s tabulkou vstupů a do té doby jeho čísla označujeme jako scénářové výpočty; před koaliční smlouvou přepočítáme podle skutečných nákladů zkoušky" },
  { risk: "Ministerstvo nestihne napsat zákony", signal: "podklady zákonů nejsou hotové do konce roku 2029; vláda plánuje víc než dva velké zákony", safeguard: "jen dva velké zákony za volební období; podklady napíšeme už v opozici; ministerstvo posílí o dva legislativní týmy" },
  { risk: "Ministerstvo financí odmítne vyšší platbu státu", signal: "záporné stanovisko v připomínkovém řízení; platba se znovu zmrazí", safeguard: "výpočet v jedné tabulce; jednání s ministerstvem a rozpočtovou radou od roku 2028; při odmítnutí zůstávají daně za zdraví a reforma se zmenší" },
  { risk: "Změna lůžek zhorší dostupnost péče", signal: "akutní lůžka v kraji obsazená nad 85 %; méně než 95 % lidí má urgentní příjem do 30 minut", safeguard: "přeměna se v kraji zastaví; místa pro doléčení musí být připravená předem; záchranka se posílí dřív, než se cokoli slučuje" },
  { risk: "Ordinace skoupí velké řetězce", signal: "podíl ordinací v regionu pod jedním vlastníkem roste", safeguard: "skuteční vlastníci jsou veřejní; jeden vlastník smí mít nejvýš 20 % území kraje; dotaci na budovu dostane jen obec nebo kraj" },
];

// ---------------------------------------------------------------------------
// PENÍZE
// ---------------------------------------------------------------------------

export const COST_2038 = {
  title: "Na co půjde 22,8 mld. Kč ročně, až reforma poběží naplno (2038)",
  source: `Provoz včetně rezervy. ${MODEL_NOTE}`,
  rows: [
    { label: "Sestry navíc v týmech", value: 3.97, group: "lidé v ordinacích" },
    { label: "Platby týmům za registrované pacienty", value: 3.73, group: "lidé v ordinacích" },
    { label: "Rezerva 10 % (IT, vzdělávání, nábor)", value: 2.07, group: "ostatní" },
    { label: "Další profese v týmu (nutriční terapeut, fyzioterapeut, psycholog, recepce)", value: 1.73, group: "lidé v ordinacích" },
    { label: "Odměna týmům za výsledky", value: 1.6, group: "lidé v ordinacích" },
    { label: "Konzultace lékaře s lékařem, zpráva zpět praktikovi", value: 1.5, group: "ostatní" },
    { label: "Dorovnání příjmu nemocnic po dobu přeměny", value: 1.31, group: "nemocnice" },
    { label: "Prevence: screening, navigace, očkování, zuby", value: 1.3, group: "prevence" },
    { label: "Paliativní týmy", value: 0.9, group: "péče doma" },
    { label: "Příplatek za návštěvy doma", value: 0.8, group: "péče doma" },
    { label: "Večerní a víkendové ordinační hodiny", value: 0.75, group: "lidé v ordinacích" },
    { label: "Prevence: komunitní programy", value: 0.7, group: "prevence" },
    { label: "Zapisovatel a sledování pacientů na dálku", value: 0.66, group: "ostatní" },
    { label: "Provoz budov center", value: 0.53, group: "ostatní" },
    { label: "Nové výkony praktiků, ultrazvuk", value: 0.5, group: "lidé v ordinacích" },
    { label: "Řízení reformy a nezávislé hodnocení", value: 0.4, group: "ostatní" },
    { label: "Odvoz k lékaři (senior taxi)", value: 0.34, group: "péče doma" },
  ],
};

export const COST_GROUPS = ["lidé v ordinacích", "péče doma", "prevence", "nemocnice", "ostatní"];

export const NET_COST = {
  rows: [
    { year: "2035", provoz: 17.6, uspory: 0.7, net: n("netCost2035"), share: "3,0 %" },
    { year: "2038", provoz: n("opCost2038"), uspory: n("savings2038"), net: n("netCost2038"), share: "3,8 %" },
    { year: "2050", provoz: 28.5, uspory: n("savings2050"), net: n("netCost2050"), share: "4,4 %" },
  ],
};

export const FUNDING = {
  title: "Kdo zaplatí 21,5 mld. Kč ročně",
  source: `${MODEL_NOTE} Vyšší platba státu nejsou nové peníze, ale přesun ze státního rozpočtu.`,
  rows: [
    { label: "Stát: vyšší platba za děti, důchodce a studenty", value: n("statePaymentExtra"), group: "stát" },
    { label: "Stát: přímé výdaje (řízení, fond přeměny, sledování na dálku)", value: 2.6, group: "stát" },
    // Pravidlo PEER: fond nejméně 40 % výnosu, vždy aspoň 2 mld. Kč; zbytek do pojištění.
    { label: "Daně za zdraví: do zdravotního pojištění", value: n("healthTaxPlan") - Math.max(2, (n("preventionFundShare") / 100) * n("healthTaxPlan")), group: "daně za zdraví" },
    { label: "Daně za zdraví: Fond prevence", value: Math.max(2, (n("preventionFundShare") / 100) * n("healthTaxPlan")), group: "daně za zdraví" },
    { label: "Obce a kraje: odvoz k lékaři, provoz center", value: 1.0, group: "obce" },
  ],
};
export const FUND_GROUPS = ["stát", "daně za zdraví", "obce"];

export const TEN_NUMBERS = [
  { n: "21,5 mld. Kč (15 až 25)", t: "ročně navíc, až reforma poběží naplno kolem roku 2038; necelá 4 % dnešních výdajů zdravotního pojištění" },
  { n: "6 mld. Kč", t: "ročně dostanou týmy (za registrované pacienty, za výsledky a za návštěvy doma); odhad 4,8 až 7,5" },
  { n: "520 týmů, 4 000 sester", t: "kolem roku 2038; dvě sestry na jednoho lékaře v týmu, do roku 2050 tři" },
  { n: "440 sester ročně", t: "potřebuje reforma navíc; asi čtvrtina všeobecných sester, které podle ministerstva vyjdou ze škol v letech 2026 až 2037" },
  { n: "A 21,5 · B 18 · C 11", t: "miliard ročně stojí plná varianta, varianta bez nových center a minimální varianta" },
  { n: "8 000 lůžek", t: "změní účel do roku 2038; fond přeměny stojí 5 až 10 mld. Kč jednorázově a asi 1 mld. Kč ročně na dorovnání příjmu nemocnic" },
  { n: "5 mld. Kč daní", t: "ročně z tichého vína, slazených nápojů a valorizace lihu a piva, plánováno opatrně (program strany: 10 až 15 mld. Kč); nejméně 40 % na prevenci" },
  { n: "60 · 70 · 104 mld. Kč", t: "bude chybět zdravotnímu pojištění v letech 2035, 2038 a 2050, i kdyby se nic neměnilo; to musí řešit každá vláda" },
  { n: "180 Kč měsíčně", t: "navíc zaplatí stát za každého svého pojištěnce kvůli reformě; každých 100 Kč měsíčně znamená 7,2 mld. Kč ročně" },
  { n: "22 až 33 mld. Kč", t: "jednorázově na budovy center a přeměnu lůžek; po evropských fondech zbývá najít 15 až 26" },
];

export const TAXES = {
  wineRatePerLitre: n("wineTax"),
  glassLitres: 0.2,
  sugarPerLitreLow: 6,
  sugarPerLitreHigh: 8,
  statePayees: n("statePayees"),
};

// ---------------------------------------------------------------------------
// PRO KOHO
// ---------------------------------------------------------------------------

export const KEY_SUBJECTS = ["Sdružení praktických lékařů", "Sdružení dětských praktiků", "Česká asociace sester", "Česká lékařská komora", "VZP", "Svaz zdravotních pojišťoven", "Asociace krajů", "Svaz měst a obcí", "Pacientské organizace", "Odbory"];

export const STAKEHOLDERS = [
  { who: "Praktičtí lékaři", org: "SPL ČR, SPLDD ČR, Mladí praktici", offer: "Zaplacenou sestru navíc, smlouvu na pět let, zrušení omezení, které léky smíte předepsat, ultrazvuk v ordinaci a vzorovou smlouvu pro prodej ordinace při odchodu do důchodu. Dětské praktiky nerušíme.", need: "Pomoc s tím, jak má tým vypadat, a podporu zkoušky ve třech regionech.", step: "Pracovní skupina k podobě týmu, začátek roku 2027" },
  { who: "Sestry", org: "Česká asociace sester", offer: "Víc pravomocí, možnost samostatně předepsat domácí péči, plat jako v nemocnici bez nočních služeb a od roku 2033 novou roli sestry s rozšířenou praxí.", need: "Pomoc s tím, co sestra smí a jak mají vypadat poradny pro dlouhodobě nemocné.", step: "Společná pracovní skupina, začátek roku 2027" },
  { who: "Lékařská komora", org: "ČLK", offer: "Každý pacient má v týmu svého jmenovitého lékaře. Lékař rozhoduje o léčbě nezávisle na vlastníkovi ordinace a má méně papírování.", need: "Aspoň neutrální postoj k větším pravomocem sester a k údaji o naléhavosti v žádance.", step: "Jednání o verzi 3, první pololetí 2027" },
  { who: "Zdravotní pojišťovny", org: "VZP, Svaz zdravotních pojišťoven", offer: "Měřitelné výsledky, data pro řízení sítě, méně zbytečných hospitalizací, víceleté smlouvy.", need: "Smlouvu na zkoušku ve třech regionech, zaplacení sester v týmech a stejnou smlouvu u všech pojišťoven.", step: "Návrh smlouvy vedení VZP, dohoda do 30. 6. 2027" },
  { who: "Kraje", org: "Asociace krajů ČR", offer: "Fond přeměny nemocnic, dorovnání příjmu, vlastní krajský plán místo rozhodnutí z Prahy a spoluodpovědnost místo samoty hejtmana.", need: "Kraj, který se přihlásí ke zkoušce, a pravidla pro krajský plán.", step: "Výzva krajům, začátek roku 2027" },
  { who: "Obce", org: "Svaz měst a obcí ČR", offer: "Lékaře blíž lidem, spolufinancování odvozu k lékaři a dotaci na budovu centra, pokud má smlouvu s týmem.", need: "Prostory pro ordinace a provoz senior taxi.", step: "Setkání s novými vedeními obcí po volbách, začátek roku 2027" },
  { who: "Nemocnice a odbory", org: "AČMN, Asociace krajských nemocnic, LOK-SČL, OSZSP ČR", offer: "Změnu role místo rušení, 5 až 10 mld. Kč na přestavbu, dorovnání příjmu, pojistku: nad 85 % obsazenosti se nic nemění, a každému dotčenému zdravotníkovi nabídku předem.", need: "Spolupráci na pravidlech, podle kterých vzniknou krajské plány.", step: "Kulatý stůl k síti nemocnic, 2028" },
  { who: "Poskytovatelé sociálních služeb", org: "APSS ČR", offer: "Dost míst pro dlouhodobou péči jako podmínku každé změny lůžek a veřejný účet dlouhodobé péče.", need: "Údaje o volných místech po krajích.", step: "Společná bilance kapacit, 2028" },
  { who: "Pacienti", org: "pacientské organizace", offer: "Zaručený termín podle naléhavosti, jmenovitého lékaře, zdravotnického ombudsmana a žádné poplatky.", need: "Připomínky k cestě pacienta a k tomu, co měříme.", step: "Veřejná konzultace verze 3, od prosince 2026" },
  { who: "Vinaři a výrobci nápojů", org: "", offer: "Poloviční sazbu pro malé vinaře, postupný náběh během dvou let, zvyšování s inflací místo skoků a daň ze slazených nápojů ohlášenou dva roky předem.", need: "Přijetí postupného náběhu a snížení cukru v nápojích.", step: "Konzultace 2028" },
  { who: "Ministerstvo financí a Národní rozpočtová rada", org: "", offer: "Veřejný ekonomický model, rozpětí nákladů místo jednoho čísla a otevřené přiznání, že vyšší platba státu je přesun peněz, a ne nový zdroj.", need: "Odborné posouzení nové platby státu a fondu prevence.", step: "Předání modelu, 2028" },
  { who: "Možní koaliční partneři", org: "", offer: "Společné autorství, společný harmonogram a tři varianty podle toho, co se podaří.", need: "Jádro plánu v koaliční smlouvě.", step: "Setkání zdravotních expertů stran, 2028 až 2029" },
];

export const ROUND_TABLES = [
  { when: "2/2027", topic: "Jak má vypadat tým a smlouva na pět let" },
  { when: "4/2027", topic: "Sestry v primární péči" },
  { when: "5/2027", topic: "Zkouška ve třech regionech" },
  { when: "9/2027", topic: "Cesta pacienta a elektronická žádanka" },
  { when: "11/2027", topic: "Peníze: platba státu a daně za zdraví" },
  { when: "2/2028", topic: "Síť nemocnic a změna lůžek" },
  { when: "4/2028", topic: "Dlouhodobá péče a pomezí zdravotní a sociální péče" },
  { when: "5/2028", topic: "Prevence a daně za zdraví" },
  { when: "6/2028", topic: "Závěrečná konference a dohody o podpoře" },
];

// ---------------------------------------------------------------------------
// OTÁZKY
// ---------------------------------------------------------------------------

export const FAQ = [
  { q: "Rušíte nemocnice?", a: "Ne. Z 48 036 akutních lůžek jich 8 000 změní účel na doléčení, rehabilitaci a péči na konci života, a to až od roku 2033 podle krajských plánů. Žádné lůžko se nezmění dřív, než kraj doloží, že pacienti mají kam jít a že 95 % obyvatel má urgentní příjem do 30 minut. Okresní nemocnice dostane jistou roli místo boje o přežití, a když plán plní, dorovnáme jí příjem. V letech 2010 až 2013 ubylo 5 914 akutních lůžek a lůžek pro doléčení přibylo jen 22. Přesně tohle se nesmí opakovat." },
  { q: "Proč něco měnit, když to funguje?", a: "Protože se blíží demografická vlna, kterou nelze oddiskutovat: lidí nad 85 let bude v roce 2050 půl milionu, dnes je jich 200 tisíc, a těch, kdo se o ně postarají a kdo na péči vydělají, bude méně. Když chceme udržet péči na dnešní úrovni, musíme přidat roky ve zdraví (prevence a čas praktika na dlouhodobě nemocné) a zařídit dostupnost jinak než ordinací v každé obci: do několika desítek minut, se senior taxi objednaným obcí a s vybavenou ordinací v centru, protože vybavit plnými přístroji každou z více než 6 000 obcí není možné." },
  { q: "Zavřete naši porodnici?", a: "Ne bez náhrady. Porodů ubývá a některé malé porodnice dnes neudrží ani personál, ani bezpečný počet porodů. Zavřít je ale bez odpovědi, co dál, odmítáme. Nejdřív musí mít pojišťovna v území smlouvu s komunitními porodními asistentkami, které se o ženu starají v těhotenství, u fyziologického porodu i v šestinedělí doma, a kraj plán dojezdu k nejbližší porodnici. Péče porodní asistentky je nejlevnější a u zdravých těhotenství nejlépe doložená; u rizikových těhotenství zůstává porodnice s lékařem." },
  { q: "Zvýšíte daně?", a: "Tiché víno zdaníme stejně jako šumivé (23,40 Kč na litr, malí vinaři polovinu), zavedeme daň ze slazených nápojů podle množství cukru a daň z lihu a piva se bude zvyšovat s inflací. Počítáme opatrně s 5 mld. Kč ročně; program strany počítá s 10 až 15 mld. Kč. Zákon řekne, na co: nejméně 40 % na prevenci, vždy aspoň 2 mld. Kč, zbytek do zdravotního pojištění. Odvody z mezd se nemění a vyšší pojistné nenavrhujeme. Kdo si dá sklenku vína týdně, zaplatí asi 240 Kč ročně. Kdo nepije slazené nápoje, nezaplatí nic. Tabák a nikotin zdaníme víc, ale postupně: každý rok o 5 % nad inflaci, bez skoků, a nikotinové sáčky i e-cigarety podle obsahu nikotinu. Dnešní plán zvyšování končí rokem 2027; navrhneme současné vládě, aby ho od roku 2028 prodloužila, a v našem scénáři to platí zákonem od roku 2031. Tyhle peníze do 5 mld. Kč nepočítáme, protože cílem je, aby se kouřilo méně. To, co z nich přibude, jde na podporu lidí, kteří o své zdraví aktivně pečují: hrazené odvykání kouření pro každého, kdo se o to pokusí, a nižší pojistné pro toho, kdo se doložitelně hýbe, nekouří, pije střídmě nebo chodí do ověřených programů. Nerozhoduje razítko z prohlídky ani to, jak je kdo zdravý, ale zapojení a zlepšení v čase." },
  { q: "Kde vezmete sestry?", a: "Reforma potřebuje do roku 2038 asi 4 000 sester navíc, v průměru 440 ročně, tedy asi čtvrtinu všeobecných sester, které podle ministerstva vyjdou ze škol v letech 2026 až 2037. Je to nejslabší místo plánu a říkáme to otevřeně: zdravotnictví musí ve stejné době jen u všeobecných sester nahradit nejméně 24 000 úvazků (odhad MZ ČR, 2025). Proto tým dostane zaplaceno jen za obsazené místo, plat je jako v nemocnici bez nočních služeb, počítáme s návraty do oboru i s náborem ze zahraničí. Kdyby do konce roku 2031 přišla jen polovina potřebných sester, nové budovy se stavět nebudou a reforma poběží v menším rozsahu. Nezastaví se." },
  { q: "Proč ne hned?", a: "Protože z opozice nelze přijmout zákon a protože velký zákon trvá od prvního podkladu po účinnost dva až tři a půl roku. Předchozí verze slibovala zákony od roku 2029 a nezávislý posudek správně řekl, že se to stihnout nedá. Co jde hned, děláme hned: zkoušku ve třech regionech od roku 2028, návrhy do pravidel úhrad do 30. 6. 2027, návrhy ke vládním zákonům a hotové podklady zákonů před volbami. Kdyby dnešní vláda zaplatila sestry v týmových ordinacích už od roku 2028, podpoříme to jako první." },
  { q: "Není to drahé?", a: "Až reforma poběží naplno kolem roku 2038, bude stát čistě asi 21,5 mld. Kč ročně, tedy necelá 4 % dnešních výdajů zdravotního pojištění. Říkáme rozpětí 15 až 25 mld. Kč, protože jedno přesné číslo by bylo předstírání. Pro srovnání: i bez reformy bude zdravotnímu pojištění v roce 2038 chybět 70 mld. Kč. Za 21,5 mld. Kč dostanete 520 týmů, 4 000 sester, návštěvy doma, paliativní týmy ve všech okresech, konzultace se specialisty a prevenci se stálými penězi. Nebude to levné a nebude to úspora. Bude to víc péče blíž lidem za peníze, které do zdravotnictví půjdou tak jako tak." },
  { q: "Nutíte praktiky do týmů?", a: "Ne. Vstup je dobrovolný. Kdo zůstane sám, dostane od pojišťovny stejně jako dnes a nikdy méně. Síť samostatných ordinací, které se domluví, dostane totéž co jeden velký tým, pokud zajistí stejné služby. Praktikům dáváme, o co žádají léta: zrušení omezení, které léky smí předepsat, ultrazvuk, zástup, sestru s vlastními pacienty, jistotu na pět let a vzorovou smlouvu, aby odcházející lékař dostal za ordinaci zaplaceno a mladý nemusel shánět miliony. Dětské praktiky nerušíme a povinné doporučení ke specialistovi nezavádíme." },
  { q: "Bude mě léčit počítač?", a: "Ne. Zapisovatel přepíše rozhovor s lékařem a lékař zápis zkontroluje a podepíše. Sledování pacientů se srdečním selháním na dálku vyhodnocuje sestra, a ne stroj. První studie ukazují u zapisovatele jen malý a nejistý přínos, proto s ním nepočítáme jako s úsporou času a nejdřív ho vyzkoušíme. Každé rozhodnutí o léčbě dělá člověk a data zůstávají v Česku a v Evropské unii." },
  { q: "Proč vám věřit, když autor sedí ve správní radě VZP?", a: "Protože to říkáme sami a předem. Autor je členem Správní rady VZP. O smlouvě na zkoušku ve třech regionech rozhoduje vedení VZP, a ne správní rada. Autor se z hlasování o zkoušce vyloučí a výsledky hodnotí nezávislý hodnotitel jmenovaný před startem. Každé číslo má ve studii svůj zdroj nebo výpočet a v přehledu Čísla a zdroje je u něj rok, definice a rozpětí. Ekonomický model zveřejníme i s tabulkou vstupů; do té doby jsou jeho výsledky scénářové výpočty. Kdo najde chybu, pomůže reformě víc než ten, kdo ji pochválí." },
];

export const CONFLICT = "Autor plánu je členem Správní rady VZP, členem Pirátské ekonomické expertní rady (PEER) a autorem HSPA Monitoru. Plán navrhuje zkoušku s VZP a mění složení správních rad pojišťoven. Proto o smlouvě na zkoušku rozhoduje vedení VZP, výsledky hodnotí nezávislý hodnotitel a autor se z hlasování o zkoušce vyloučí.";

export const INSPIRATION = [
  { country: "Portugalsko a Estonsko", what: "týmy lékařů a sester v primární péči" },
  { country: "Dánsko a Německo", what: "plánovaná síť nemocnic" },
  { country: "Británie a Polsko", what: "daň ze slazených nápojů" },
  { country: "Skotsko", what: "minimální cena alkoholu" },
];

// ---------------------------------------------------------------------------
// SLOVNÍČEK
// ---------------------------------------------------------------------------

export const GLOSSARY = [
  { term: "Primární péče", text: "První kontakt s lékařem: praktik pro dospělé, praktik pro děti a dorost, sestra v ordinaci. Odtud pacient jde dál ke specialistům nebo do nemocnice." },
  { term: "Tým sdružené péče", text: "Několik praktiků a sester, kteří se spojí a společně se starají o 10 až 25 tisíc lidí v okolí. Mají jednu smlouvu s pojišťovnou, víc sester a další profese (nutriční terapeut, fyzioterapeut, psycholog)." },
  { term: "Centrum primární péče", text: "Budova, kde tým sídlí pod jednou střechou. Vlastní ji obec nebo kraj. Varianta B reformy je bez nových center: týmy fungují v dnešních ordinacích." },
  { term: "Spádové území", text: "Oblast, za jejíž obyvatele tým odpovídá a kde přijímá nové pacienty." },
  { term: "ORP (obec s rozšířenou působností)", text: "Větší město, které vyřizuje úřední věci i pro okolní obce. Česko jich má 205. Zkouška reformy proběhne ve třech z nich a počet lidí bez praktika se bude zveřejňovat po ORP." },
  { term: "Zkouška ve třech regionech (pilot)", text: "Dva roky (2028 a 2029) ověříme v jednom kraji na třech ORP, zda praktici do týmů vstoupí, zda se najdou sestry a kolik to stojí. Hodnotí nezávislý hodnotitel." },
  { term: "Elektronická žádanka (eŽádanka)", text: "Elektronický poukaz na vyšetření u specialisty. Navrhujeme, aby v ní lékař povinně uvedl, jak to spěchá: do 2 týdnů, do 6 týdnů, nebo plánované." },
  { term: "Akutní lůžko", text: "Lůžko pro nemocné, kteří potřebují operaci nebo intenzivní léčbu. Česko jich má 48 036, obsazená jsou z 56 %." },
  { term: "Následná péče", text: "Doléčení a rehabilitace po nemoci nebo operaci, dlouhodobá péče a péče na konci života. Těchto lůžek je málo a jsou obsazená z 85 %." },
  { term: "Obložnost", text: "Jak velká část lůžek je obsazená. Nad 85 % se podle výzkumů zvyšuje úmrtnost, proto se při této obsazenosti akutních lůžek přeměna v kraji zastaví." },
  { term: "Zbytečná (odvratitelná) hospitalizace", text: "Pobyt v nemocnici, kterému by předešla dobrá péče mimo nemocnici: včasná kontrola, sestra, která zavolá, návštěva doma. Hlavní ukazatel reformy." },
  { term: "Platba státu za státní pojištěnce", text: "Stát platí zdravotní pojištění za děti, důchodce, studenty a další, asi 6 milionů lidí. Dnes je to 2 188 Kč měsíčně na osobu. Navrhujeme nový vzorec, který sleduje skutečné náklady na jejich péči." },
  { term: "Daně za zdraví", text: "Daň z tichého vína, daň ze slazených nápojů a každoroční zvyšování daně z lihu a piva s inflací. Výnos 5 mld. Kč ročně jde na prevenci a do zdravotního pojištění." },
  { term: "Fond prevence", text: "Fond prevence zdravotních pojišťoven podle programu strany: dostane nejméně 40 % výnosu daní za zdraví, vždy aspoň 2 mld. Kč ročně, na screening, očkování, navigaci pacientů po pozitivním testu, zubní prevenci u dětí a komunitní programy." },
  { term: "Kontrolní bod (brána)", text: "Předem domluvený okamžik, kdy se podle čísel rozhodne, zda reforma pokračuje, upraví se, nebo zmenší. Jsou čtyři: B1 červen 2028, B2 přelom 2029 a 2030, B3 prosinec 2031, B4 rok 2033." },
  { term: "Varianty A, B, C", text: "A je plná reforma s novými centry (21,5 mld. Kč ročně). B je bez nových budov (17,8 mld. Kč), nastane, když v roce 2031 chybí sestry. C je minimální (11,3 mld. Kč), jen pro srovnání." },
  { term: "Kontinuita péče (index UPC)", text: "Jak často se pacient dostane ke svému jmenovitému lékaři. Cíl je aspoň 7 z 10 návštěv. Výzkumy spojují stálého lékaře s nižší úmrtností." },
  { term: "Domácnosti ohrožené zdravotními výdaji", text: "Domácnosti, které za zdraví platí ze své kapsy víc než 40 % toho, co jim zbude po základních výdajích. Dnes je to 6 % domácností, mezi nejchudšími 21 %. Nesmí jich přibýt." },
  { term: "Pravidla úhrad (úhradová vyhláška, dohodovací řízení)", text: "Každý rok se pojišťovny a poskytovatelé dohadují, kolik se za co platí. Když se nedohodnou, rozhodne ministerstvo vyhláškou. Návrhy na rok 2028 je třeba podat do 30. 6. 2027." },
  { term: "Podklad zákona (věcný záměr)", text: "Dokument, který říká, co má zákon řešit a jak, ještě před napsáním paragrafů. Velký zákon trvá od podkladu po účinnost 24 až 42 měsíců, proto podklady píšeme už v opozici." },
  { term: "ÚZIS", text: "Ústav zdravotnických informací a statistiky, státní statistický ústav pro zdravotnictví. S univerzitou bude nezávislým hodnotitelem reformy." },
  { term: "Národní rozpočtová rada (NRR)", text: "Nezávislý orgán, který hlídá veřejné finance. Z její projekce vychází odhad, kolik bude zdravotnímu pojištění chybět." },
];

// Řetězce závislostí pro diagram „co na co navazuje“
export const CHAINS = [
  { id: "penize", name: "Peníze", color: 0, steps: [
    { label: "Daně za zdraví a nová platba státu", when: "zákony 2030, platí od 1. 1. 2031" },
    { label: "Pojišťovny platí týmy a sestry", when: "od roku 2031" },
  ] },
  { id: "lide", name: "Lidé a péče", color: 2, steps: [
    { label: "Zkouška ve třech regionech", when: "2028 až 2029" },
    { label: "Smlouvy týmů s pojišťovnami", when: "od roku 2030" },
    { label: "Zákon o primární péči", when: "platí od 1. 1. 2032" },
    { label: "520 týmů, 4 000 sester", when: "kolem roku 2038" },
  ] },
  { id: "luzka", name: "Nemocnice", color: 1, steps: [
    { label: "Dost míst pro doléčení a dlouhodobou péči", when: "podmínka každé změny" },
    { label: "Zákon o síti a krajské plány", when: "platí od 2033" },
    { label: "8 000 lůžek změní účel", when: "2033 až 2038" },
  ] },
];
