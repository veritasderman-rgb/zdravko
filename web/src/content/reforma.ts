/**
 * Obsah veřejného webu. Všechna čísla pocházejí ze studie „Zdraví blíž lidem“ v3
 * (20. 10. 2026), z politické verze 3 a z prezentace „Co chceme a proč“.
 * Částky jsou v mld. Kč ročně, ceny 2026, pokud není uvedeno jinak.
 */

export const META = {
  title: "Zdraví blíž lidem",
  subtitle: "Plán reformy zdravotnictví · konzultační verze 3 · 20. 10. 2026",
  author: "Josef Pavlovic, resortní tým Zdravotnictví",
  claim: "Představujeme plán a hledáme pro něj podporu.",
  deadline: "31. 3. 2027",
};

export const KEY_NUMBERS = [
  { value: "21,5 mld. Kč", label: "čistý roční náklad v plném náběhu kolem roku 2038", note: "rozpětí 15 až 25 mld. Kč, necelá 4 % dnešních výdajů pojištění" },
  { value: "520 týmů", label: "sdružené péče a asi 4 000 sester navíc", note: "každý tým pro 10 až 25 tisíc lidí" },
  { value: "8 000 lůžek", label: "přeměněných z akutní na následnou péči do roku 2038", note: "ze 48 036 na asi 40 000, nic se neruší bez náhrady" },
  { value: "5 mld. Kč", label: "ročně z daní za zdraví", note: "2 mld. Kč prevence, 3 mld. Kč platba státu do pojištění" },
];

// ---------------------------------------------------------------------------
// PROČ
// ---------------------------------------------------------------------------

export const SPENDING_SHARE = {
  title: "Akutní lůžka čerpají téměř sedmkrát víc peněz než praktici pro dospělé",
  source: "ÚZIS, úhrady zdravotního pojištění 2024",
  rows: [
    { label: "Akutní lůžková péče", value: 29.7, highlight: true },
    { label: "Ambulantní specialisté", value: 20.3 },
    { label: "Všichni praktici (dospělí i děti)", value: 6.4 },
    { label: "Praktici pro dospělé", value: 4.3, highlight: true },
  ],
};

export const GP_DECLINE = {
  title: "Praktiků pro dospělé ubývá: v roce 2035 jich bude 3 900 až 4 500 místo 5 500",
  source: "ÚZIS; úbytek 110 až 180 ročně, 43,6 % praktiků je starších 60 let",
  points: Array.from({ length: 10 }, (_, i) => {
    const year = 2026 + i;
    return { year, low: 5500 - 180 * i, high: 5500 - 110 * i };
  }),
};

export const BEDS = {
  title: "Akutní lůžka jsou obsazená z 56 %, lůžka následné péče z 85 %",
  source: "ÚZIS 2024; v osmi krajích je následná péče nad 85 %",
  rows: [
    { label: "Akutní lůžka (48 036)", value: 56 },
    { label: "Lůžka následné péče", value: 85 },
  ],
  threshold: 85,
};

export const AVOIDABLE = {
  title: "Odvratitelných hospitalizací máme o 25 % víc než průměr OECD",
  source: "OECD Health at a Glance; hospitalizace na 100 000 obyvatel, kterým by předešla dobrá péče mimo nemocnici",
  rows: [
    { label: "Česko dnes", value: 592, highlight: true },
    { label: "Cíl 2033", value: 550 },
    { label: "Cíl kolem 2038", value: 530 },
    { label: "Průměr OECD", value: 473 },
  ],
};

export const GAP = {
  title: "Při dnešních pravidlech bude pojištění chybět 60 až 104 mld. Kč ročně",
  source: "Národní rozpočtová rada, září 2026, tab. D.1; ceny 2026. Reforma mezeru nezpůsobuje ani nezavírá.",
  rows: [
    { year: "2035", gap: 59.7, reform: 16.9 },
    { year: "2038", gap: 70.0, reform: 21.5 },
    { year: "2050", gap: 104.4, reform: 24.9 },
  ],
};

export const NURSES = {
  title: "Sester chybí už dnes: do roku 2037 je třeba nahradit přes 30 000 úvazků",
  source: "Studie v3, Část V; vysoké školy dodají asi 1 300 absolventek ročně",
  rows: [
    { label: "Náhrada odchodů, ročně", value: 2500 },
    { label: "Absolventky VŠ, ročně", value: 1300 },
    { label: "Reforma navíc, průměr ročně", value: 440, highlight: true },
  ],
};

export const PREVENTION_FACTS = [
  { value: "10,6 l", label: "čistého alkoholu na osobu 15+ ročně (OECD 8,4 l)" },
  { value: "+43 %", label: "úmrtí na chronické nemoci jater proti průměru EU" },
  { value: "31 %", label: "lidí chodí na screening tlustého střeva (OECD 42 %)" },
  { value: "25 %", label: "seniorů je očkováno proti chřipce" },
  { value: "60 %", label: "žen chodí na mamografii, víc než průměr OECD: kde systém zve, prevence funguje" },
  { value: "0 Kč", label: "daň z tichého vína a ze slazených nápojů" },
];

export const PROBLEM_FACTS = [
  { value: "14,9 mld. Kč", label: "plánovaný schodek pojišťoven na rok 2026; zůstatek fondů klesl ze 69,9 na 43,2 mld. Kč" },
  { value: "182 tisíc", label: "dětí nemělo v roce 2022 dětského praktika" },
  { value: "428 : 291", label: "míst praktiků zaniklo proti vzniklým v obcích do 2 000 obyvatel (2018 až 2022)" },
  { value: "5 914 : 22", label: "akutních lůžek ubylo proti přibylým následným v letech 2010 až 2013. Přesně to se nesmí opakovat" },
];

// ---------------------------------------------------------------------------
// CO CHCEME
// ---------------------------------------------------------------------------

export const FIVE_CHANGES = [
  {
    n: 1,
    title: "Svůj lékař a sestra blízko domova",
    what: "Praktici se dobrovolně spojí do týmů sdružené péče pro 10 až 25 tisíc lidí: víc sester, nutriční terapeut, fyzioterapeut, psycholog, návštěvní služba a senior taxi. Tým dostane pětiletou smlouvu místo ročního bonusu a platí se za funkce, ne za formu. Praktik smí víc: předepisovat léky, kvůli kterým dnes posílá ke specialistovi, a dělat ultrazvuk v ordinaci.",
    brings: "Lékař i pro ty, kdo ho dnes nemají; péče o chroniky, která nečeká na zhoršení; každý pacient má jmenovitého lékaře a svou sestru i v týmu.",
    when: "pilot ve třech ORP 2028 až 2029; zákon o primární péči účinný 1. 1. 2032; asi 520 týmů a 4 000 sester navíc kolem roku 2038",
    codes: ["J1", "J2", "J3"],
  },
  {
    n: 2,
    title: "Ke specialistovi podle naléhavosti",
    what: "Lékař vyplní v elektronické žádance naléhavost: do 2 týdnů, do 6 týdnů, plánované. Pojišťovna garantuje termín podle kategorie. Přímý přístup bez žádanky zůstává; sankce nikdy nedopadá na pacienta.",
    brings: "Poprvé bude vidět, kdo a jak dlouho čeká; nemocnější jde dřív, ne ten, kdo dřív zavolá.",
    when: "pozměňovací návrh k vládní novele eŽádanky 2027 až 2028; zákonná garance termínu od 1. 1. 2032",
    codes: ["J5"],
  },
  {
    n: 3,
    title: "Nemocnice, která se přeměňuje, ne ruší",
    what: "Zákon o síti lůžkové péče: každý kraj má desetiletý plán. Akutní lůžko se přemění na následnou, rehabilitační nebo paliativní péči až tehdy, když kraj prokáže, že pacient má kam jít a záchranka dojede včas. Fond přeměny dorovná nemocnici příjem po dobu změny.",
    brings: "Okresní nemocnice dostane stabilní roli blízko domova: doléčení, rehabilitace, jednodenní chirurgie, ambulance; zákrok se dělá tam, kde ho dělají často a dobře.",
    when: "zákon předložen 2031, přijat 2032, účinný nejpozději 1. 1. 2033; první krajské plány 2033; 8 000 přeměněných lůžek do roku 2038",
    codes: ["J6", "J7"],
  },
  {
    n: 4,
    title: "Prevence a daně za zdraví",
    what: "Tiché víno zdaníme jako šumivé (23,40 Kč na litr, malí vinaři polovinu), zavedeme pásmovou daň ze slazených nápojů po britském vzoru a automatickou valorizaci daní z lihu a piva. Výnos 5 mld. Kč ročně: 2 mld. Kč dostane Národní fond prevence, zbytek zvýší platbu státu do zdravotního pojištění.",
    brings: "Méně cukru v nápojích dřív, než daň začne platit; sestra, která zavolá po pozitivním testu; očkování v lékárně; stálý zdroj prevence.",
    when: "valorizace a víno od 1. 1. 2031 (plná sazba vína 2033); daň ze slazených nápojů přijata 2030, účinná 1. 1. 2032",
    codes: ["J8", "J9", "P4"],
  },
  {
    n: 5,
    title: "Důstojné stárnutí a závěr života doma",
    what: "Návštěvní služba týmu za křehkými seniory, domácí péče s delší indikací, mobilní paliativní tým v každém okrese, hrazený rozhovor o plánu péče, jednodušší dříve vyslovené přání. Dlouhodobá péče dostane vlastní, veřejně sledovaný účet.",
    brings: "Doma místo chodby urgentu; rodina, která ví, komu zavolat; domov je možnost, ne povinnost.",
    when: "dříve vyslovené přání jako poslanecký návrh 2028 až 2029; indikace domácí péče sestrou od 1. 1. 2032; paliativní týmy 2031 až 2034",
    codes: ["J4", "P3"],
  },
];

export const PATIENT_JOURNEY = [
  { step: "Hledám praktika", today: "Obvolávám ordinace; kolik lidí praktika nemá, nikdo neměří.", after: "Tým odpovídá za své spádové území a přijímá nové pacienty. Komu pojišťovna do 30 dnů nezařídí registraci, tomu zajistí vyšetření lékařem nebo sestrou smluvního týmu. Počet lidí bez praktika se zveřejňuje čtvrtletně po ORP." },
  { step: "Mám svou dvojici", today: "Jeden lékař a jedna sestra; když lékař onemocní, ordinace zavře.", after: "Jmenovitý ošetřující lékař a sestra, kteří mě znají, i v týmu; zástup je výjimka, ne pravidlo. Kontinuitu měří index UPC a platí se za ni." },
  { step: "Jsem chronik", today: "Kontrola jednou za půl roku; kvůli receptu s omezením musím ke specialistovi.", after: "Sestra mě zve na kontrolu podle protokolu, nutriční terapeut se mnou sestaví plán, který zvládnu; praktik smí léčbu zahájit a upravit sám. U srdečního selhání hlídá váhu a tlak doma dálkové sledování, upozornění třídí sestra, ne stroj." },
  { step: "Potřebuji specialistu", today: "Objednávám se sám; dřív jde ten, kdo dřív zavolá; čekací doby nikdo neměří.", after: "Lékař vyplní v eŽádance naléhavost (do 2 týdnů, do 6 týdnů, plánované) a objedná mě přímo. Pojišťovna garantuje termín podle kategorie. Bez žádanky mohu jít dál; ke gynekologovi, očnímu, zubaři, psychiatrovi a do onkologie bez doporučení jako dnes." },
  { step: "Musím do nemocnice", today: "Zákrok i doléčení v nejbližší nemocnici, ať ho tam dělají dvacetkrát, nebo dvakrát ročně.", after: "Náročný zákrok v centru, které ho dělá často; doléčení a rehabilitace v nemocnici blízko domova, kam za mnou může rodina. Urgentní příjem do 30 minut jízdy pro 95 % obyvatel kraje je podmínkou každého plánu sítě." },
  { step: "Nedojdu k lékaři", today: "Záchranka a chodba urgentu, nebo nic.", after: "Lékař nebo sestra týmu přijedou; senior taxi objednává obec a sladí odvoz s termínem vyšetření." },
  { step: "Po propuštění z nemocnice", today: "Domácí péči indikuje praktik na tři měsíce, jiný lékař na 14 dnů; plán nikdo nekoordinuje.", after: "Domácí péče s delší indikací, i sestrou se specializací; koordinátor péče v týmu; jedno šetření pro příspěvek na péči i plán péče." },
  { step: "Závěr života", today: "Rozhovor o přáních nikdo nehradí; dříve vyslovené přání je těžké platně vyslovit a nikdo ho nenajde.", after: "Hrazený rozhovor o plánu péče; plán vidí i záchranka; mobilní paliativní tým v okrese; dříve vyslovené přání bez úředně ověřeného podpisu, v registru. Domov je možnost, ne povinnost." },
  { step: "Platím", today: "Doplatky na léky a zubař způsobují katastrofické výdaje u 21 % nejchudší pětiny domácností.", after: "Nic nového u lékaře neplatím: žádné poplatky, žádné příplatky za pořadí. Podíl domácností s katastrofickými výdaji se nesmí zhoršit a hlídáme ho jako hlavní ukazatel." },
];

export const NOT_DOING = [
  { title: "Nezavádí poplatky", text: "Žádné regulační poplatky ani příplatky za kratší čekání. Katastrofické výdaje domácností se nesmí zhoršit." },
  { title: "Neruší dětské praktiky", text: "Dětské týmy zůstávají. Kde dětský praktik chybí, může se dítě registrovat u praktika pro dospělé v týmu." },
  { title: "Neruší nemocnice", text: "Mění účel části akutních lůžek. Žádné lůžko se nepřemění, dokud kraj neprokáže kapacitu následné péče a dojezd záchranky." },
  { title: "Neprivatizuje", text: "Praktici zůstávají soukromí a hodnotu praxe neztratí; budovy center vlastní obec nebo kraj. Pojišťovny ani nemocnice se neprodávají." },
  { title: "Nikoho nenutí", text: "Vstup praktika do týmu je dobrovolný; kdo nevstoupí, zůstává u dnešní úhrady, ne u nižší. Povinné doporučení ke specialistovi nezavádíme." },
  { title: "Nesnižuje odvody z práce", text: "Daně za zdraví jdou do prevence a do platby státu. Neslibujeme víc než 5 mld. Kč ročně." },
];

export const HONEST_CHANGES = [
  "Ordinace ve vsi po odchodu lékaře nevznikne; nahradí ji služba týmu, detašované pracoviště jeden nebo dva dny v týdnu a senior taxi.",
  "K některým náročným zákrokům se pojede dál.",
  "Tiché víno zdraží o 23,40 Kč na litr a slazené nápoje nad hranicí cukru asi o 6 až 8 Kč na litr, pokud je výrobce neodsladí.",
];

// ---------------------------------------------------------------------------
// JAK
// ---------------------------------------------------------------------------

export const PHASES = [
  { id: "F0", name: "Konzultace", from: 2026.85, to: 2028.5, text: "Kulaté stoly, memoranda o podpoře, pozměňovací návrhy k vládním předlohám, dohoda o pilotu." },
  { id: "F1", name: "Příprava vládnutí", from: 2028.5, to: 2030, text: "Věcné záměry zákonů, volební program, běžící pilot." },
  { id: "F2", name: "První roky ve vládě", from: 2030, to: 2032, text: "Předložení zákonů; peníze a daně účinné od 1. 1. 2031." },
  { id: "F3", name: "Náběh", from: 2032, to: 2034, text: "Zákon o primární péči, zákon o síti, první krajské plány." },
  { id: "F4", name: "Přeměna a ukotvení", from: 2034, to: 2039, text: "Náběh týmů na 520, přeměna 8 000 lůžek, nezávislé hodnocení." },
];

export const GATES = [
  { id: "B1", name: "Mandát", at: 2028.45, when: "červen 2028", must: "Připomínky vypořádané a zveřejněné; jádro podporuje aspoň 6 z 10 klíčových subjektů; pilot podepsán; strana přijala jedno číslo daní za zdraví.", ifNot: "Volební program nese jen části, které podporu mají; místo pilotu náhradní smluvní model u jedné pojišťovny." },
  { id: "B2", name: "Koaliční smlouva", at: 2030, when: "prosinec 2029 až leden 2030", must: "Jádro v koaliční smlouvě a programovém prohlášení; předlohy v legislativním plánu vlády 2030.", ifNot: "Do plánu jde jen dohodnuté jádro; zbytek zůstává programem pro další období." },
  { id: "B3", name: "Lidé a data", at: 2032, when: "prosinec 2031", must: "Obsazena aspoň polovina míst sester v týmech první vlny; zákon o primární péči schválen; krajské plány rozpracované.", ifNot: "Varianta B: týmy bez center. Vše, co na centrech nezávisí, běží dál." },
  { id: "B4", name: "Nezávislé hodnocení", at: 2033.5, when: "2033, před volbami", must: "Zpráva nezávislého hodnotitele (ÚZIS s univerzitou) nad osmi hlavními ukazateli.", ifNot: "Hodnotitel doporučí pokračovat, upravit, nebo zmenšit; rozhodnutí i důvody se zveřejní." },
];

export const MILESTONES = [
  { at: 2026.93, label: "Schválení v3 ke konzultaci", detail: "7. 12. 2026" },
  { at: 2027.25, label: "Konec 1. kola připomínek", detail: "31. 3. 2027" },
  { at: 2027.5, label: "Dohoda o pilotu, podněty do úhrad 2028", detail: "30. 6. 2027" },
  { at: 2028, label: "Start pilotu ve třech ORP", detail: "1. 1. 2028" },
  { at: 2029.8, label: "Volby do Sněmovny", detail: "říjen 2029" },
  { at: 2031, label: "Platba státu, daně, fond prevence účinné", detail: "1. 1. 2031" },
  { at: 2032, label: "Zákon o primární péči účinný", detail: "1. 1. 2032" },
  { at: 2033, label: "Zákon o síti účinný, první krajské plány", detail: "1. 1. 2033" },
  { at: 2038, label: "520 týmů, 8 000 přeměněných lůžek", detail: "kolem roku 2038" },
];

export const RULES = [
  { title: "Žádná brána bez dat", text: "Chybí-li data, brána se odkládá; nerozhoduje se podle odhadu ani podle kalendáře." },
  { title: "Neúspěch nástroje zastaví jen ten nástroj", text: "Neprojde-li například daň ze slazených nápojů, týmy a sestry pokračují." },
  { title: "Málo sester znamená variantu B", text: "Když do konce roku 2031 nebude obsazena aspoň polovina míst sester v týmech první vlny, centra se nestavějí a reforma pokračuje bez nich." },
  { title: "Lůžko se nepřemění bez náhrady", text: "Kraj musí nejdřív prokázat kapacitu následné a dlouhodobé péče a dojezd záchranky. Obložnost akutních lůžek nad 85 % přeměnu v kraji zastaví." },
];

export const STEPS_2029 = [
  { title: "Konzultace verze 3", when: "od prosince 2026", text: "Schválení resortním týmem 7. 12. 2026, první kolo připomínek do 31. 3. 2027, devět kulatých stolů, zveřejněné vypořádání před červnem 2028." },
  { title: "Pilot ve třech ORP", when: "provoz 2028 a 2029", text: "Město, venkov a ORP bez praktiků v jednom kraji, 100 až 150 tisíc obyvatel, 30 až 50 mil. Kč ročně. Ověřuje proveditelnost týmu: zda praktici vstoupí, zda se obsadí místa sester, kolik to stojí." },
  { title: "Úhrady a výkony", when: "podněty do 30. 6. 2027", text: "Sesterská složka u týmových praxí, ultrazvuk pro praktiky, telemonitoring, konzultace lékař–lékař, navigace po screeningu." },
  { title: "Pozměňovací návrhy", when: "2027 a 2028", text: "Vláda otevírá stejné paragrafy: víceleté smlouvy i pro týmy, triážní údaj v eŽádance, zpráva o zdraví podle rámce HSPA. Navazujeme, nepředkládáme protinávrh." },
  { title: "Poslanecké návrhy", when: "2028 a 2029", text: "Dříve vyslovené přání bez úředně ověřeného podpisu, s registrem; dobrovolné zveřejňování počtu lidí bez praktika po ORP." },
  { title: "Věcné záměry zákonů", when: "7/2028 až 12/2029", text: "Zákon o primární péči, zákon o síti, finanční novela, daňové zákony, zákon o Národním fondu prevence. Bez hotových záměrů při nástupu vlády nemůže zákon platit od roku 2032." },
  { title: "Jedno číslo daní za zdraví", when: "do června 2028", text: "Strana přijme jako svůj veřejný slib 5 mld. Kč ročně a pravidlo rozdělení. Daň ze slazených nápojů ohlásíme dva roky předem, aby výrobci stihli odsladit." },
];

export const VARIANTS = {
  rows: [
    { key: "A", name: "A: plná, s centry", cost: 21.5, invest: "22 až 33", nurses: 4000, teams: "75 % praktiků", rural: "ano: obec nebo kraj založí tým", when: "základní varianta" },
    { key: "B", name: "B: bez center", cost: 17.8, invest: "6 až 11", nurses: 3450, teams: "65 %, jen kde je praxe", rural: "jen kde praxe je", when: "brána B3 nesplněna" },
    { key: "C", name: "C: minimální", cost: 11.3, invest: "5 až 10", nurses: 0, teams: "žádné týmy", rural: "ne", when: "srovnávací základ" },
  ],
  note: "Prevence, paliativa, konzultace a fond přeměny jsou ve všech třech variantách (společný základ 7,6 mld. Kč). Rozdíl A proti B kupuje budovy, další profese a schopnost vstoupit tam, kde praxe zanikla.",
};

export const INDICATORS = [
  { code: "H1", name: "Lidé bez registrujícího praktika", today: "neměří se; děti: asi 182 tisíc bez dětského praktika (2022)", y2033: "měří se od 2028; v ORP s týmem pokles aspoň o polovinu", y2038: "v ORP s týmem nikdo bez jmenovitého lékaře" },
  { code: "H2", name: "Týmy a obsazená místa sester", today: "0 týmů podle standardu (241 týmových praxí)", y2033: "plán týmů splněn aspoň z 90 %; obsazeno aspoň 50 % míst", y2038: "520 týmů; obsazeno aspoň 80 % míst" },
  { code: "H3", name: "Čekání podle naléhavosti v eŽádance", today: "neměří se; na kolonoskopii po pozitivním testu 84 dní", y2033: "aspoň 80 % urgentních do 2 týdnů", y2038: "aspoň 90 % ve všech kategoriích" },
  { code: "H4", name: "Kontinuita péče (index UPC)", today: "neměří se", y2033: "aspoň 0,7 v týmech první a druhé vlny", y2038: "aspoň 0,7 ve všech týmech" },
  { code: "H5", name: "Odvratitelné hospitalizace na 100 000", today: "592 (OECD 473)", y2033: "550", y2038: "530" },
  { code: "H6", name: "Podíl akutní lůžkové péče na výdajích", today: "29,7 % (2024)", y2033: "28 %", y2038: "26 %" },
  { code: "H7", name: "Odvratitelná úmrtnost", today: "léčitelná 107 na 100 000 (EU 87)", y2033: "sledujeme bez cíle", y2038: "sledujeme bez cíle" },
  { code: "H8", name: "Katastrofické výdaje domácností", today: "6 % domácností; nejchudší pětina 21 %", y2033: "nezhoršit", y2038: "nezhoršit" },
];

export const RISKS = [
  { risk: "Sestry nepřijdou nebo odejdou z nemocnic", signal: "obsazenost míst sester v pilotu a volná místa v nemocnicích kraje, čtvrtletně", safeguard: "náběh v etapách; plat na úrovni nemocniční sestry; platí se jen obsazené místo; při polovině sester varianta bez center" },
  { risk: "Náklady jsou vyšší", signal: "skutečné platby týmům v pilotu mimo rozpětí; čistý náklad mimo 15 až 25 mld. Kč", safeguard: "plánujeme rozpětím, ne bodem; otevřený model; přepočet z nákladů pilotu před koaliční smlouvou" },
  { risk: "Ministerstvo nestihne zákony", signal: "věcné záměry nehotové k 12/2029; v plánu vlády víc než dvě velké předlohy", safeguard: "jen dvě velké předlohy za období; záměry psát už v opozici; posílit legislativní odbor" },
  { risk: "Ministerstvo financí odmítne vzorec platby státu", signal: "záporné stanovisko v připomínkovém řízení; zmrazení platby se opakuje", safeguard: "výpočet v jedné tabulce; jednání s MF a NRR od roku 2028; při odmítnutí zůstávají daně za zdraví a reforma se zmenšuje" },
  { risk: "Přeměna lůžek zhorší dostupnost", signal: "obložnost v kraji nad 85 %; méně než 95 % obyvatel s urgentním příjmem do 30 minut", safeguard: "stop přeměny v kraji; kapacita následné péče předem; posílení záchranky před sloučením" },
  { risk: "Řetězce ovládnou primární péči", signal: "podíl praxí pod jedním skutečným vlastníkem v ORP roste", safeguard: "veřejní skuteční vlastníci; strop 20 % spádových území kraje pro jednoho vlastníka; dotace na budovu jen obci nebo kraji" },
];

// ---------------------------------------------------------------------------
// PENÍZE
// ---------------------------------------------------------------------------

export const COST_2038 = {
  title: "Na co jde 22,8 mld. Kč provozu v roce 2038",
  source: "Ekonomický model studie v3 (Část V); provoz včetně rezervy, ceny 2026",
  rows: [
    { label: "Sestry navíc v týmech", value: 3.97, group: "lidé v ordinacích" },
    { label: "Platby týmům: lékařská složka", value: 3.73, group: "lidé v ordinacích" },
    { label: "Rezerva 10 % (IT, vzdělávání, nábor)", value: 2.07, group: "ostatní" },
    { label: "Další profese v týmu (nutriční terapeut, fyzioterapeut, psycholog, recepce)", value: 1.73, group: "lidé v ordinacích" },
    { label: "Platby týmům: odměna za výsledky", value: 1.6, group: "lidé v ordinacích" },
    { label: "Konzultace lékař–lékař, zpětná zpráva", value: 1.5, group: "ostatní" },
    { label: "Fond přeměny: garance příjmu nemocnic", value: 1.31, group: "nemocnice" },
    { label: "Prevence: screening, navigace, očkování, zuby", value: 1.3, group: "prevence" },
    { label: "Paliativní týmy", value: 0.9, group: "péče doma" },
    { label: "Platby týmům: příplatek za návštěvy", value: 0.8, group: "péče doma" },
    { label: "Pohotovost a prodloužená ordinační doba", value: 0.75, group: "lidé v ordinacích" },
    { label: "Prevence: komunitní programy", value: 0.7, group: "prevence" },
    { label: "Zapisovatel a dálkové sledování", value: 0.66, group: "ostatní" },
    { label: "Provoz center (nájem)", value: 0.53, group: "ostatní" },
    { label: "Kompetence praktiků: výkony, ultrazvuk", value: 0.5, group: "lidé v ordinacích" },
    { label: "Koordinace a nezávislé hodnocení", value: 0.4, group: "ostatní" },
    { label: "Senior taxi", value: 0.34, group: "péče doma" },
  ],
};

export const NET_COST = {
  title: "Čistý náklad po letech",
  source: "Model v3: provoz včetně rezervy minus úspory počítané bez překryvů",
  rows: [
    { year: "2035", provoz: 17.6, uspory: 0.7, net: 16.9, share: "3,0 %" },
    { year: "2038", provoz: 22.8, uspory: 1.2, net: 21.5, share: "3,8 %" },
    { year: "2050", provoz: 28.5, uspory: 3.6, net: 24.9, share: "4,4 %" },
  ],
};

export const FUNDING = {
  title: "Kdo zaplatí 21,5 mld. Kč v roce 2038",
  source: "Model v3, Část V. Vyšší platba státu je přesun ze státního rozpočtu, ne nový peníz.",
  rows: [
    { label: "Platba státu za děti, důchodce a studenty (nový vzorec)", value: 13.0, group: "stát" },
    { label: "Státní rozpočet přímo (koordinace, fond přeměny, dálkové sledování)", value: 2.6, group: "stát" },
    { label: "Daně za zdraví → platba státu do pojištění", value: 3.0, group: "daně za zdraví" },
    { label: "Daně za zdraví → Národní fond prevence", value: 2.0, group: "daně za zdraví" },
    { label: "Obce a kraje (senior taxi, provoz center)", value: 1.0, group: "obce" },
  ],
};

export const TEN_NUMBERS = [
  { n: "21,5 mld. Kč (15–25)", t: "čistý roční náklad reformy v plném náběhu kolem roku 2038, necelá 4 % dnešních výdajů pojištění" },
  { n: "6 mld. Kč", t: "platby týmům ročně (lékařská složka, odměna za výsledky, příplatek za návštěvy), rozpětí 4,8 až 7,5" },
  { n: "520 týmů, 4 000 sester", t: "kolem roku 2038; dvě sestry na lékaře v týmu, tři jako směr k roku 2050" },
  { n: "440 sester ročně", t: "průměrná potřeba reformy, zhruba třetina vysokoškolských absolventek" },
  { n: "A 21,5 / B 18 / C 11", t: "čistý náklad plné varianty, varianty bez center a minimální varianty" },
  { n: "8 000 lůžek", t: "přeměněných do roku 2038; fond přeměny 5 až 10 mld. Kč investic a asi 1 mld. Kč ročně na garanci" },
  { n: "5 mld. Kč daní", t: "ročně z daní za zdraví: 2 mld. Kč prevence, zbytek platba státu do pojištění" },
  { n: "60 / 70 / 104 mld. Kč", t: "mezera pojištění v letech 2035, 2038 a 2050 při dnešních pravidlech; řeší ji každá vláda" },
  { n: "180 Kč", t: "měsíčně na státního pojištěnce navíc za reformu; 100 Kč měsíčně znamená 7,2 mld. Kč ročně" },
  { n: "22–33 mld. Kč", t: "jednorázové investice do center a přeměny lůžek; po evropských fondech zbývá 15 až 26" },
];

export const TAXES = {
  wineRatePerLitre: 23.4,
  glassLitres: 0.2,
  sugarPerLitreLow: 6,
  sugarPerLitreHigh: 8,
  statePayees: 6.0, // mil. státních pojištěnců
  planned: [
    { label: "Tiché víno", low: 3.3, high: 4.3 },
    { label: "Slazené nápoje", low: 1.3, high: 1.8 },
    { label: "Valorizace lihu a piva", low: 0, high: 1 },
  ],
};

// ---------------------------------------------------------------------------
// PRO KOHO
// ---------------------------------------------------------------------------

export const STAKEHOLDERS = [
  { who: "Praktici", org: "SPL ČR, SPLDD ČR, Mladí praktici", offer: "Sesterskou složku úhrady, pětiletou smlouvu, zrušení preskripčních omezení, ultrazvuk v ordinaci, vzorovou smlouvu o výkupu praxe; dětské praktiky nerušíme.", need: "Spolutvorbu standardu týmu a podporu pilotu.", step: "Pracovní skupina ke standardu týmu, 1. čtvrtletí 2027" },
  { who: "Sestry", org: "ČAS", offer: "Rozšířené kompetence, samostatnou indikaci, plat na úrovni nemocniční sestry bez nočních služeb, sestru v pokročilé praxi od roku 2033.", need: "Spolutvorbu kompetencí a protokolů poraden.", step: "Společná pracovní skupina, 1. čtvrtletí 2027" },
  { who: "Lékařská komora", org: "ČLK", offer: "Jmenovitého ošetřujícího lékaře v týmu, klinickou nezávislost vůči vlastníkovi, méně administrativy.", need: "Aspoň neutralitu ke kompetencím sester a k triážnímu údaji.", step: "Jednání nad verzí 3, 1. pololetí 2027" },
  { who: "Pojišťovny", org: "VZP, SZP ČR", offer: "Měřitelné výsledky, data pro řízení sítě, méně odvratitelných hospitalizací, víceleté smlouvy.", need: "Pilot, sesterskou složku v dohodovacím řízení, stejný standard smlouvy u zaměstnaneckých pojišťoven.", step: "Návrh smlouvy pilotu vedení VZP, dohoda do 30. 6. 2027" },
  { who: "Kraje", org: "Asociace krajů ČR", offer: "Fond přeměny, garanci příjmu, krajský plán místo centrálního rozhodnutí, spoluodpovědnost místo samoty hejtmana.", need: "Kraj, který se k pilotu přihlásí; pravidla krajského plánu.", step: "Výzva krajům, 1. čtvrtletí 2027" },
  { who: "Obce", org: "SMO ČR", offer: "Lékaře blíž lidem, spolufinancování dopravy, dotaci na budovu centra jen se smlouvou s týmem.", need: "Obecní prostory, senior taxi.", step: "Setkání s novými vedeními obcí, 1. čtvrtletí 2027" },
  { who: "Nemocnice a odbory", org: "AČMN, Asociace krajských nemocnic, LOK-SČL, OSZSP ČR", offer: "Přeměnu místo rušení, investice 5 až 10 mld. Kč, garanci příjmu, pojistku obložnosti 85 %, nabídku každému dotčenému zdravotníkovi předem.", need: "Spolupráci na pravidlech plánu sítě.", step: "Kulatý stůl k síti lůžek, 2028" },
  { who: "Poskytovatelé sociálních služeb", org: "APSS ČR", offer: "Kapacitu dlouhodobé péče jako podmínku každé přeměny, veřejný sociální účet.", need: "Data o kapacitě po krajích.", step: "Společná bilance kapacit, 2028" },
  { who: "Pacienti", org: "pacientské organizace", offer: "Garanci termínu podle naléhavosti, jmenovitého lékaře, zdravotnického ombudsmana, žádné poplatky.", need: "Připomínky k cestě pacienta a k ukazatelům.", step: "Veřejná konzultace verze 3, od prosince 2026" },
  { who: "Vinaři a výrobci nápojů", org: "", offer: "Poloviční sazbu pro malé vinaře, dvouletý náběh, valorizaci místo skoků, ohlášení daně ze slazených nápojů dva roky předem.", need: "Přijatelnost náběhu, reformulaci nápojů.", step: "Konzultace 2028" },
  { who: "Ministerstvo financí a Národní rozpočtová rada", org: "", offer: "Otevřený model, rozpětí nákladu místo jednoho čísla, přiznání, že platba státu je přesun.", need: "Technickou oponenturu vzorce platby státu a fondu prevence.", step: "Předání modelu, 2028" },
  { who: "Potenciální koaliční partneři", org: "", offer: "Společné autorství, sdílený harmonogram, varianty A, B a C.", need: "Jádro v koaliční smlouvě.", step: "Setkání zdravotních expertů stran, 2028 až 2029" },
];

export const ROUND_TABLES = [
  { when: "2/2027", topic: "Standard týmu a pětiletá smlouva" },
  { when: "4/2027", topic: "Sestry v primární péči" },
  { when: "5/2027", topic: "Pilot ve třech ORP" },
  { when: "9/2027", topic: "Cesta pacienta a eŽádanka" },
  { when: "11/2027", topic: "Financování, platba státu a daně za zdraví" },
  { when: "2/2028", topic: "Síť lůžkové péče a přeměna" },
  { when: "4/2028", topic: "Dlouhodobá a sociálně-zdravotní péče" },
  { when: "5/2028", topic: "Prevence a daně za zdraví" },
  { when: "6/2028", topic: "Bilanční konference a memoranda" },
];

// ---------------------------------------------------------------------------
// OTÁZKY
// ---------------------------------------------------------------------------

export const FAQ = [
  { q: "Rušíte nemocnice?", a: "Ne. Přeměňujeme 8 000 z 48 036 akutních lůžek na následnou, rehabilitační a paliativní péči, a to až od roku 2033 podle krajských plánů. Žádné lůžko se nepřemění, dokud kraj neprokáže, že pacient má kam jít a že 95 % obyvatel má urgentní příjem do 30 minut. Okresní nemocnice dostane stabilní roli místo boje o přežití a nemocnice, která plán plní, dostane dorovnání příjmu. V letech 2010 až 2013 ubylo 5 914 akutních lůžek a následných přibylo 22; přesně tohle se nesmí opakovat." },
  { q: "Zvýšíte daně?", a: "Zdaníme tiché víno stejně jako šumivé (23,40 Kč na litr, malí vinaři polovinu), zavedeme daň ze slazených nápojů nad hranicí cukru a budeme valorizovat daň z lihu a piva o inflaci. Dohromady 5 mld. Kč ročně, s účelem v zákoně: 2 mld. Kč prevence, zbytek do zdravotního pojištění. Odvody z práce z těchto daní nesnižujeme a vyšší pojistné samostatně nenavrhujeme. Kdo si dá sklenku vína týdně, zaplatí asi 240 Kč ročně; kdo neodslazené nápoje nepije, nezaplatí nic." },
  { q: "Kde vezmete sestry?", a: "Reforma potřebuje asi 4 000 sester navíc do roku 2038, v průměru 440 ročně, tedy zhruba třetinu vysokoškolských absolventek. Je to nejslabší místo plánu a přiznáváme ho: systém musí zároveň nahradit přes 30 000 úvazků do roku 2037. Proto tým dostane zaplaceno jen za obsazené místo, plat je na úrovni nemocniční sestry bez nočních služeb, personální bilance po krajích počítá i s návraty do oboru a náborem ze zahraničí, a když do konce roku 2031 přijde jen polovina sester, centra se nestavějí a reforma se zmenší, nezastaví." },
  { q: "Proč ne hned?", a: "Protože v opozici nelze přijmout zákon a protože velká předloha trvá od záměru po účinnost dva až tři a půl roku. Verze 2 slibovala zákony od roku 2029 a oponentura správně označila takový harmonogram za nestihnutelný. Co jde hned, děláme hned: pilot od roku 2028, podněty do úhrad do 30. 6. 2027, pozměňovací návrhy k vládním předlohám a věcné záměry hotové před volbami. Kdyby dnešní vláda převzala sestry u týmových praxí už do úhradové vyhlášky 2028, budeme první, kdo to podpoří." },
  { q: "Není to drahé?", a: "Čistě 21,5 mld. Kč ročně v plném náběhu kolem roku 2038, tedy necelá 4 % dnešních výdajů zdravotního pojištění; rozpětí 15 až 25 mld. Kč říkáme nahlas, protože bodový odhad by byl předstírání přesnosti. Pro srovnání: při dnešních pravidlech bude systému v roce 2038 chybět 70 mld. Kč i bez reformy. Za 21,5 mld. Kč dostanete 520 týmů, 4 000 sester, návštěvy doma, paliativní týmy ve všech okresech, konzultace se specialisty a prevenci se stálým zdrojem. Nebude to levné a nebude to úspora; bude to víc péče blíž lidem za peníze, které do zdravotnictví půjdou tak jako tak." },
  { q: "Co praktici? Nutíte je do týmů?", a: "Nenutíme. Vstup je dobrovolný, samostatná ordinace zůstává u dnešní úhrady, ne u nižší, a smluvní síť samostatných ordinací dostane totéž co jeden poskytovatel, pokud zajistí stejné funkce. Praktikům dáváme to, o co žádají léta: zrušení preskripčních omezení, ultrazvuk, zástup, sestru s vlastními pacienty, pětiletou jistotu a vzorovou smlouvu, aby odcházející lékař dostal za praxi zaplaceno a mladý nemusel shánět miliony. Dětské praktiky nerušíme a povinné doporučení ke specialistovi nezavádíme." },
  { q: "Bude mě léčit počítač?", a: "Ne. Zapisovatel přepíše rozhovor a lékař zápis zkontroluje a podepíše; dálkové sledování u srdečního selhání hlídá sestra, ne stroj. První studie ukazují u zapisovatele jen mírný a nejistý přínos, proto s ním nepočítáme jako se zdrojem kapacity a nejdřív ho ověří pilot. Každé klinické rozhodnutí dělá člověk a data zůstávají v českém zdravotnickém systému a v EU." },
  { q: "Proč vám věřit, když autor sedí ve Správní radě VZP?", a: "Protože to říkáme sami a předem. Autor je členem Správní rady VZP; o smlouvě pilotu rozhoduje vedení VZP, ne Správní rada, autor se z hlasování o pilotu vyloučí a výsledky hodnotí nezávislý hodnotitel jmenovaný před startem. Model nákladů je otevřený a každé číslo v tomto textu má ve studii svůj výpočet a zdroj. Kdo najde chybu, pomůže reformě víc než ten, kdo ji pochválí." },
];

export const CONFLICT = "Autor je členem Správní rady VZP, členem Pirátské ekonomické expertní rady (PEER) a autorem HSPA Monitoru. Plán navrhuje pilot s VZP a mění složení správních rad pojišťoven; proto o smlouvě pilotu rozhoduje vedení VZP, výsledky hodnotí nezávislý hodnotitel a autor se z hlasování o pilotu vyloučí.";

export const INSPIRATION = [
  { country: "Portugalsko a Estonsko", what: "týmy primární péče" },
  { country: "Dánsko a Německo", what: "plán sítě nemocnic" },
  { country: "Británie a Polsko", what: "daň ze slazených nápojů" },
  { country: "Skotsko", what: "minimální cena alkoholu" },
];
