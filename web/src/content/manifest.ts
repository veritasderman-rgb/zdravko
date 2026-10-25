/**
 * Manifest reformy českého zdravotnictví (7. 5. 2026) a jeho rozpracování ve studii „Zdraví blíž lidem“ v3.
 *
 * Zdroje: Manifest (07-manifest-reformy-2026-05-07.md, Příloha B), registr opatření studie
 * (registr.json), Část XI studie (deset briefů doprovodu) a Část III (jádro J1–J10, podmínky P1–P5).
 *
 * Jazyk: píšeme „my“, krátké věty, bez žargonu. Kódy opatření (J, P, Pil, M) odpovídají registru.
 * Termíny „Rok N“ jsou roky od nástupu vlády; ve studii je Rok 1 = 2030 (základní scénář „Vláda 2030“).
 */

export const MANIFEST = {
  title: "Manifest reformy českého zdravotnictví",
  date: "7. 5. 2026",
  authors: "Josef Pavlovic, Bára Malíková a Resortní tým České pirátské strany pro zdravotnictví",
  source: "https://www.skorezdravotnictvi.cz/clanek-manifest-reforma-zdravotnictvi",
  hub: "https://www.skorezdravotnictvi.cz/manifest/",
  intro:
    "Manifest reformy z 7. 5. 2026 vychází z pěti čísel, o kterých se nemusíme dohadovat, a odpovídá na ně ve třinácti oblastech. Naše studie ho rozpracovává do opatření, právních nástrojů, termínů a peněz. U každé oblasti ukazujeme, co Manifest slibuje, co z toho ve studii děláme a co z něj zbývá rozpracovat.",
  fiveData: [
    { value: "463", label: "úmrtí na nemoci srdce a cév na 100 000 lidí", compare: "průměr EU-27: 313", source: "Eurostat, 2023" },
    { value: "31,1 %", label: "lidí se účastní screeningu tlustého střeva", compare: "průměr OECD: 42 %", source: "OECD, 2024" },
    { value: "37,1 %", label: "antibiotik, která lékaři předepisují, je z první volby (skupina Access)", compare: "cíl WHO: 60 %", source: "Státní ústav pro kontrolu léčiv, 2024" },
    { value: "11,6", label: "sebevražd na 100 000 obyvatel", compare: "průměr EU: 10,4", source: "Eurostat, 2023" },
    { value: "~2 200", label: "léků, které právě chybí v lékárnách (aktivní výpadky)", compare: "v roce 2019 asi 580", source: "Státní ústav pro kontrolu léčiv, 5/2026" },
  ],
};

export const MANIFEST_NOTE =
  "Manifest je politický dokument autorů z 7. 5. 2026 a říká, co se má změnit a proč. Studie „Zdraví blíž lidem“ z něj vychází a rozpracovává ho do opatření, nástrojů, termínů a peněz. Tři oblasti (pomezí zdravotní a sociální péče, prevence a data) tvoří nosnou část plánu, deset dalších jsou doplňková opatření s vlastním krátkým briefem. Co z Manifestu ještě není rozpracované do kroků, uvádíme u každé oblasti.";

/** Zkrácená verze pro perex stránky. */
export const MANIFEST_NOTE_SHORT = "Studie z Manifestu vychází; co ještě není rozpracované do kroků, uvádíme u každé oblasti.";

export type ManifestArea = {
  n: number;
  slug: string;
  title: string; // název z Manifestu, zkrácený max. 4 slova
  promise: string; // co Manifest slibuje, 1–2 věty srozumitelně
  layer: "jadro" | "doprovod"; // jádro = studie to rozpracovala do jádra (oblasti 6, 8, 10), doprovod = brief v Části XI
  studyArea?: string;
  measures: { code: string; label: string; when: string }[];
  manifestSteps: { year: string; text: string }[];
  facts: { value: string; label: string; compare: string }[];
  inspiration: string;
  gaps?: string;
  dispute?: string;
};

// ---------------------------------------------------------------------------
// Přepočet roků: Rok 1 Manifestu = 2030 (nástup vlády na přelomu 2029 a 2030)
// ---------------------------------------------------------------------------

export const YEAR_OFFSET = 2029;

/** „Rok 3“ → „2032“, „Rok 1–2“ → „2030–2031“, „Rok 5+“ → „2034 a později“. */
export function manifestYear(label: string): string {
  const nums = label.match(/\d+/g)?.map(Number) ?? [];
  if (nums.length === 0) return "";
  const from = YEAR_OFFSET + nums[0];
  if (label.includes("+")) return `${from} a později`;
  if (nums.length > 1) return `${from}–${YEAR_OFFSET + nums[1]}`;
  return String(from);
}

// ---------------------------------------------------------------------------
// Opatření studie: krátký popis a termín (zkráceno z registr.json)
// ---------------------------------------------------------------------------

const SHORT: Record<string, { label: string; when: string }> = {
  // Jádro a podmínky
  J1: { label: "Standard týmu primární péče a pětiletá smlouva s pojišťovnou", when: "pilot 2028–2029, platí od 1. 1. 2032" },
  J2: { label: "Sestry v týmu: vlastní složka platby a rozšířené kompetence", when: "podnět 2027, pilot 2028, rozšířená praxe od 2033" },
  J4: { label: "Návštěvní služba a odvoz seniorů k lékaři (senior taxi)", when: "pilot 2028, platí od 1. 1. 2032" },
  J5: { label: "Elektronická žádanka s údajem o naléhavosti a měření čekání", when: "dobrovolně od 2027, záruka termínu od 1. 1. 2032" },
  J7: { label: "Dost míst pro doléčení a dlouhodobou péči jako podmínka každé přeměny lůžek", when: "standard 2031–2032, první posouzení 2033" },
  J8: { label: "Daň z tichého vína a pravidelné zvyšování daní z lihu a piva", when: "platí od 1. 1. 2031, plná sazba 2033" },
  J9: { label: "Daň ze slazených nápojů podle množství cukru", when: "platí od 1. 1. 2032" },
  P1: { label: "Personální bilance po krajích: nábor ze zahraničí a rychlejší uznání aprobací", when: "zveřejnit do konce 2029, měřit koncem 2031" },
  P2: { label: "Rezidenční místa pro praktiky a pediatry", when: "podnět 2027, v rozpočtu 2028, závazně od 2031" },
  P3: { label: "Sociální účet a sdílené financování sociálně-zdravotní péče", when: "záměr do konce 2029, platí od 1. 1. 2034" },
  P4: { label: "Fond prevence zdravotních pojišťoven: nejméně 40 % daní za zdraví, aspoň 2 mld. Kč", when: "platí od 1. 1. 2031" },
  P5: { label: "Měření výkonu zdravotnictví (rámec HSPA) ukotvené v zákoně", when: "platí od 1. 1. 2033" },
  // Doplňky pilířů
  "Pil2.2": { label: "Pravidla podle zdravotní potřeby místo limitů na počet výkonů", when: "první skupiny výkonů v úhradách 2031" },
  "Pil2.6": { label: "Hrazená péče porodních asistentek doma i v porodnici; žádná porodnice se nezavře bez jejich sítě v území", when: "podnět 2027, smlouvy od 2031, v zákoně o síti od 2033" },
  "Pil3.1": { label: "Sledování pacientů na dálku (nejdřív srdeční selhání a vysoký tlak)", when: "pilot 2028, hrazený výkon od 1. 1. 2031" },
  "Pil3.2": { label: "Zapisovatel s umělou inteligencí jen jako pilot", when: "pilot od 2028" },
  "Pil3.3": { label: "Portál pacienta a pravidla pro digitální nástroje", when: "do dvou let od nástupu vlády" },
  "Pil4.1": { label: "Minimální cena alkoholu", when: "platí od 1. 1. 2034" },
  "Pil4.2": { label: "Obce mohou omezit noční prodej alkoholu (22 až 6 h)", when: "platí od 1. 1. 2033" },
  "Pil4.3": { label: "Přísnější reklama na alkohol tam, kde ji sledují děti", when: "platí od 1. 1. 2033" },
  "Pil4.4": { label: "Zdravotní varování na obalech alkoholu", when: "platí od 1. 1. 2033" },
  "Pil4.5": { label: "Daň podle gramů alkoholu ve všech nápojích (volba pro program 2029)", when: "debata do voleb 2029, nejdříve 2033" },
  "Pil4.6": { label: "Zubní prevence do 18 let: fluoridový lak, zalití rýh, instruktáž", when: "platí od 1. 1. 2032" },
  "Pil4.7": { label: "Očkování seniorů proti chřipce: pozvání od sestry, očkování v lékárnách", when: "od úhradové vyhlášky 2031" },
  "Pil4.8": { label: "Navigace po pozitivním screeningu: sestra provede člověka vyšetřením", when: "pilot ve dvou krajích, start ověříme" },
  "Pil4.9": { label: "Krátká intervence u praktika (stručné poradenství k rizikovým zvykům)", when: "od úhradové vyhlášky 2031" },
  "Pil4.10": { label: "Strava a pohyb: školní stravování, reklama dětem, nutriční terapeut", when: "termín ověříme, vyhodnocení po třech letech" },
  "Pil4.11": { label: "Daň z tabáku a nikotinu: každý rok o 5 % nad inflaci, bez skoků; sáčky a e-cigarety podle nikotinu", when: "podnět 2027, platí od 1. 1. 2031" },
  "Pil4.12": { label: "Nižší pojistné pro ty, kdo aktivně pečují o své zdraví, a hrazené odvykání kouření", when: "odvykání od 2031, pilot do 40 let od 2032" },
  "Pil5.1": { label: "Domácí péče na delší dobu, může ji předepsat sestra se specializací", when: "platí od 1. 1. 2032" },
  "Pil5.2": { label: "Mobilní paliativní tým v každém okrese", when: "úhrada 2031, náběh 2031–2034" },
  "Pil5.3": { label: "Společný plán péče, koordinátor a hrazené plánování péče", when: "úhrada od 2031" },
  "Pil5.4": { label: "Podpora pečujících rodin: odlehčovací služby, edukace, dlouhodobé ošetřovné", when: "termín ověříme" },
  "Pil5.5": { label: "Paliativní tým v nemocnicích s 200 a více akutními lůžky", when: "termín zatím není" },
  "Pil5.6": { label: "Nabídka plánu péče při hospitalizaci křehkého seniora", when: "termín zatím není" },
  "Pil5.7": { label: "Dříve vyslovené přání: jednodušší ověření, registr, povinnost respektovat", when: "poslanecký návrh 2028–2029" },
  // Doprovod: oblasti 1 až 10 studie
  "M1.1": { label: "Metodika hodnocení organizačních modelů péče pod ÚZIS, poprvé na pilotu", when: "2027" },
  "M1.2": { label: "Nezávislá instituce pro hodnocení léků, výkonů a modelů péče", when: "podoba 2028–2029, zákon od 2033" },
  "M1.3": { label: "Standard hrazené péče jako výstup hodnocení, soutěž pojišťoven nad standardem", when: "2033 a později" },
  "M1.4": { label: "Napojení na evropské společné hodnocení klinického přínosu", when: "průběžně" },
  "M2.1": { label: "Zákon vymezí rozšířenou péči, doplatek a ochranný limit", when: "předložit 2030, platí od 1. 1. 2032" },
  "M2.2": { label: "Plně hrazená základní varianta se nabídne jako první, bez vlivu na termín", when: "platí od 1. 1. 2032" },
  "M2.3": { label: "Fondy prevence pojišťoven se změní na fondy rozšířené péče", when: "platí od 1. 1. 2032" },
  "M2.4": { label: "Veřejný ceník a nezávislé posouzení hranice nadstandardu", when: "platí od 1. 1. 2032" },
  "M3.1": { label: "Pojišťovna eviduje plnění nároku včetně čekání", when: "pilot 2028, plošně od 2031" },
  "M3.2": { label: "Jeden návrh správy pojišťoven: hlas pojištěnců, veřejná jednání, losovaný panel", when: "podnět 2027, zákon od 1. 1. 2033" },
  "M3.3": { label: "Pravidla platby za případ (DRG) v zákoně: sazba, valorizace, přechod", when: "platí od 1. 1. 2033" },
  "M3.4": { label: "Pružnost v krizi: odchylka vlády a rizikový koridor ±5 %", when: "platí od 1. 1. 2033" },
  "M4.1": { label: "Otevřená anonymizovaná data na úrovni poskytovatele", when: "od 2027" },
  "M4.2": { label: "Informace pro pacienta před zákrokem a volné kapacity v reálném čase", when: "od 2027" },
  "M4.3": { label: "Rámec HSPA jako oficiální měřítko v zákoně (viz P5)", when: "platí od 1. 1. 2033" },
  "M4.4": { label: "Reformu hodnotí ÚZIS s univerzitou, a ne autoři studie", when: "jmenovat do konce 2027, zpráva 2033" },
  "M4.5": { label: "Střet zájmů v komisích ministerstva: veřejná prohlášení o zájmech, vyloučení z hlasování, veřejné zápisy", when: "podnět 2027, příkaz ministra 2030, zákon 2033 a později" },
  "M5.1": { label: "Seznam základních léků se zajištěnou dostupností a pravidla pro výpadky", when: "bez zákona kdykoli, zákon 2032–2033" },
  "M5.2": { label: "Online srovnávač doplatků", when: "termín zatím není" },
  "M5.3": { label: "Lékárník: kurýrní rozvoz s kontrolou a širší pravomoci v prevenci a očkování", when: "platí 2032–2033" },
  "M5.4": { label: "Léky na vzácná onemocnění: společný rizikový fond pojišťoven, podmíněná úhrada", when: "platí 2032–2033" },
  "M6.1": { label: "Program AZV pro akademické klinické studie (audit, monitoring, mikrogranty)", when: "podnět do 2028, výzva 2031" },
  "M6.2": { label: "Samostatná linka pro výzkum zdravotních služeb a primární péče", when: "první výzva 2031" },
  "M6.3": { label: "Roční přehled studií po krajích a vyhodnocení dopadů", when: "termín zatím není" },
  "M6.4": { label: "Pilotní týmy vyhodnotit jako studii s kontrolní skupinou", when: "registrace 2028, běh 2028–2029" },
  "M7.1": { label: "Úhrada ošetření kořenových kanálků i u stoliček (nejdřív vyčíslit náklad)", when: "podnět 2027, platí s úhradami 2031" },
  "M7.2": { label: "Sazby, které udrží smluvní zubaře mimo velká města; plně hrazené základní výkony", when: "podnět 2027, platí s úhradami 2031" },
  "M7.3": { label: "Hrazená zubní prevence do 18 let (viz Pil4.6)", when: "platí od 1. 1. 2032" },
  "M7.4": { label: "Samostatnější dentální hygienistky a ordinace dentální hygieny (pilot)", when: "termín zatím není" },
  "M7.5": { label: "Celostátní šetření zubního zdraví dětí (5, 12 a 15 let), pak po pěti letech", when: "2031, dřív jen když ho zadá dnešní ministerstvo" },
  "M8.1": { label: "Rezidenční místa podle skutečné potřeby (viz P2)", when: "závazně od 2031" },
  "M8.2": { label: "Lékaři: přehledné akreditace, jasná délka přípravy, placené stáže, započítané přesčasy", when: "podnět 2028, závazně od 2031" },
  "M8.3": { label: "Sestry: akreditované kurzy kompetencí, administrativa na recepci a zapisovatele", when: "kurzy s pilotem od 2028" },
  "M8.4": { label: "Podmínky sester: bez nočních služeb, předvídatelný rozpis, plat jako v nemocnici", when: "od úhradové vyhlášky 2031" },
  "M8.5": { label: "Nábor ze zahraničí a rychlejší uznání aprobací (viz P1)", when: "zveřejnit do konce 2029" },
  "M9.1": { label: "Zdravotnický ombudsman bez poplatků, například u veřejného ochránce práv", when: "předložit 2030, platí od 1. 1. 2032" },
  "M9.2": { label: "Úřad musí doporučení ombudsmana do 30 dnů splnit, nebo písemně zdůvodnit proč ne", when: "platí od 1. 1. 2032" },
  "M9.3": { label: "Roční přehled stížností a délky jejich šetření, průzkumy zkušeností, reforma akreditací", when: "termín zatím není" },
  "M9.4": { label: "Porod podle práva a WHO: blízká osoba u porodu, nepřerušený kontakt s dítětem", when: "termín zatím není" },
  "M9.5": { label: "Dříve vyslovené přání bez ověřeného podpisu a registr (viz Pil5.7)", when: "poslanecký návrh 2028–2029" },
  "M10.1": { label: "Psycholog v každém týmu primární péče", when: "pilot 2028, platí od 1. 1. 2032" },
  "M10.2": { label: "Krátké hrazené intervence a hrazená psychoterapie podle potřeby", when: "termín zatím není" },
  "M10.3": { label: "Psychoterapie jako zdravotní služba: kvalifikace, definice, úhrada", when: "platí od 1. 1. 2034" },
  "M10.4": { label: "Stabilní financování sociální části center duševního zdraví z kraje", when: "platí od 2033 a později" },
  "M10.5": { label: "Roční mapa center duševního zdraví, rezidenční místa v psychiatrii", when: "od 2027" },
};

function pick(codes: string[]): { code: string; label: string; when: string }[] {
  return codes.map((code) => {
    const s = SHORT[code];
    if (!s) throw new Error(`Chybí zkrácený popis opatření ${code}`);
    return { code, ...s };
  });
}

// ---------------------------------------------------------------------------
// Třináct oblastí Manifestu
// ---------------------------------------------------------------------------

export const MANIFEST_AREAS: ManifestArea[] = [
  {
    n: 1,
    slug: "vice-muziky",
    title: "Více muziky za peníze",
    promise:
      "Každá nová úhrada a každý nový model péče projde nezávislým hodnocením přínosu a nákladů. Z výsledku vznikne standard péče, který platí pro všechny pojištěnce, a část úhrady se naváže na zlepšení výsledků.",
    layer: "doprovod",
    studyArea: "Oblast 1 (brief Části XI), J1, Pilíř 2",
    measures: pick(["M1.1", "M1.2", "M1.3", "M1.4", "J1", "Pil2.2"]),
    manifestSteps: [
      { year: "Rok 1", text: "Audit úhradového systému a návrh bonusu za výsledky pro tři pilotní diagnózy (infarkt, mrtvice, sepse)." },
      { year: "Rok 2", text: "Pilot v pěti nemocnicích, sběr výchozích dat." },
      { year: "Rok 3", text: "Dalších deset diagnóz a bonus pro praktiky v kapitační smlouvě." },
      { year: "Rok 4", text: "Vyhodnocení dopadu na výsledky péče a úprava parametrů." },
    ],
    facts: [
      { value: "5–15 %", label: "platby za případ (DRG) chce Manifest vázat na výsledek léčby", compare: "Británie (CQUIN): 1,25 % úhrad, USA (Medicare): 2 %" },
    ],
    inspiration: "Britský institut NICE hodnotí přínos a náklady od roku 1999, podobně fungují německý G-BA, francouzský HAS a skandinávské instituce; bonus za výsledky znají britský CQUIN a americký Medicare.",
    gaps:
      "Bonus 5 až 15 % k platbě za případ (DRG) vázaný na výsledek zatím není rozpracovaný. Studie zatím platí týmům za funkce, které skutečně zajistí, a odměnu za výsledky stropuje, protože nizozemské balíčkové platby za chroniky výdaje spíš zvýšily. Nemocniční část bonusu doplníme do příští verze.",
    dispute:
      "Platba vázaná na výsledek může vést k tomu, že nemocnice vylepšují hlavně to, co se měří. Těžké je i spravedlivě započítat, že některá pracoviště léčí těžší pacienty, a rozhodnout, kolik procent úhrady na výsledek vázat.",
  },
  {
    n: 2,
    slug: "volba-bez-uplatku",
    title: "Volba bez úplatků",
    promise:
      "Kdo chce péči nad rámec standardu, nemusí nic řešit pod stolem: rozdíl mezi standardem a nadstandardem se platí otevřeně. Pacient před zákrokem ví, jak dlouho se kde čeká, a má jistotu, že se ke specialistovi dostane včas.",
    layer: "doprovod",
    studyArea: "Oblast 2 (brief Části XI), J5",
    measures: pick(["M2.1", "M2.2", "M2.3", "M2.4", "J5", "M3.1", "M4.2"]),
    manifestSteps: [
      { year: "Rok 1", text: "Trestnost neformálních plateb a anonymní kanál, kam je pacienti mohou oznámit." },
      { year: "Rok 2", text: "Zveřejnění čekacích dob a ukazatelů kvality za jednotlivá pracoviště (pilot ve třech oborech)." },
      { year: "Rok 3", text: "Záruka specialisty do 30 dnů, pilot ve dvou krajích." },
      { year: "Rok 4", text: "Druhý názor hrazený pojišťovnou jako běžná služba pro onkologii a kardiochirurgii." },
    ],
    facts: [
      { value: "30 dnů", label: "do této doby má pojišťovna zajistit specialistu (návrh Manifestu)", compare: "Dánsko: zákonná záruka 30 dnů, Německo: termín do 5 dnů" },
    ],
    inspiration: "Dvouvrstvé systémy mají Nizozemsko, Švýcarsko a Francie (jasná hranice mezi standardem a nadstandardem); čekací doby zveřejňuje britská NHS a záruku termínu mají Dánsko a Německo.",
    gaps:
      "Trestnost neformálních plateb a hrazený druhý názor zatím nejsou rozpracované do kroků. Záruku specialisty do 30 dnů zatím nahrazujeme lhůtami podle naléhavosti, které zavádí elektronická žádanka (J5): do 2 týdnů, do 6 týdnů a plánovaná péče bez pevné horní hranice. Jednotnou záruku 30 dnů pro všechny tedy ještě nemáme rozpracovanou.",
    dispute:
      "Záruka do 30 dnů může frontu jen přesunout, pokud nejsou lidé, kteří by pacienty ošetřili. Zveřejňování výsledků za pracoviště zase může vést k tomu, že nemocnice odmítnou rizikovější pacienty, aby si nezhoršily statistiku.",
  },
  {
    n: 3,
    slug: "sluzby-pojistencum",
    title: "Zdravotnictví pro pojištěnce",
    promise:
      "Pojištěnec má hlas ve správě své pojišťovny a pojišťovna eviduje, zda se mu péče skutečně poskytla. Pacient dostane navigátora pro vážné nemoci a přístup ke svým zdravotním datům.",
    layer: "doprovod",
    studyArea: "Oblast 3 (brief Části XI), J5, Pilíř 3",
    measures: pick(["M3.1", "M3.2", "M3.3", "M3.4", "J5", "Pil3.3", "Pil4.8", "Pil5.3"]),
    manifestSteps: [
      { year: "Rok 1", text: "Zákon o vlastnictví zdravotních dat pacientem." },
      { year: "Rok 2", text: "Pilot navigátora pro onkologické pacienty ve třech komplexních onkologických centrech." },
      { year: "Rok 3", text: "Povinné hlášení pacientských incidentů v celé zemi." },
      { year: "Rok 5", text: "Pojišťovna jako advokát pacienta, pokuty za nedostupnou péči." },
    ],
    facts: [
      { value: "72 %", label: "lidí je spokojených s tím, jak je zdravotníci informují", compare: "průměr OECD: 78 %" },
    ],
    inspiration: "Finská služba Kanta ukazuje pacientovi, kdo se na jeho data díval; navigátora hradí pojišťovna v Nizozemsku a švédská linka 1177 pomáhá orientovat se v systému nepřetržitě.",
    gaps:
      "Povinné hlášení pacientských incidentů zatím není rozpracované. Navigátor pro vážné diagnózy máme zatím jen jako navigaci po pozitivním screeningu (pilot) a koordinátora společného plánu péče; rozšíření na onkologii doplníme.",
    dispute:
      "Vlastnictví dat pacientem zní dobře, ale naráží na bezpečnost a propojitelnost systémů: kdo ručí, když pacient data omylem sdílí špatně? Otevřené je i to, zda navigátor patří jen k rakovině, nebo ke všem vážným diagnózám.",
  },
  {
    n: 4,
    slug: "transparence",
    title: "Transparence",
    promise:
      "Anonymizovaná data o nemocnicích a ordinacích budou otevřená, aktuální a použitelná pro každého. Pacient před zákrokem uvidí čekací dobu, kvalitu péče i vzdálenost, lékař volné kapacity. Komise, které ministerstvu radí o úhradách, přístrojích a dotacích, budou bez střetu zájmů, nebo aspoň zcela průhledné (doplněno do Manifestu 23. 10. 2026).",
    layer: "doprovod",
    studyArea: "Oblast 4 (brief Části XI), P5",
    measures: pick(["M4.1", "M4.2", "M4.3", "M4.4", "M4.5", "P5", "Pil3.3"]),
    manifestSteps: [
      { year: "Rok 1", text: "Zákonná povinnost otevřených dat od ÚZIS včetně rozhraní pro programy; rámec HSPA jako oficiální měřítko." },
      { year: "Rok 1", text: "Příkaz ministra a nové statuty komisí: veřejná prohlášení o zájmech, vyloučení z hlasování u vlastní věci, jmenovitá hlasování a zápisy do 30 dnů. (Doplněno do Manifestu 23. 10. 2026.)" },
      { year: "Rok 2", text: "Ukazatele kvality za nemocnice pro deset oblastí péče (infarkt, mrtvice, rakovina a další)." },
      { year: "Rok 3", text: "Srovnávací list pro pacienta před plánovaným zákrokem." },
      { year: "Rok 5", text: "Úplná auditní stopa všech ukazatelů kvality na celostátní úrovni." },
    ],
    facts: [
      { value: "1–2 roky", label: "se zpožďují ročenky ÚZIS, ze kterých dnes data vycházejí", compare: "cíl Manifestu: data denně nebo týdně" },
    ],
    inspiration: "Britská služba NHS Find a hospital srovnává nemocnice denně, americký Hospital Compare má přes sto ukazatelů a švédské registry kvality fungují od 70. let. Evropská léková agentura zveřejňuje prohlášení o zájmech všech svých expertů a podle míry zájmu omezuje jejich roli.",
    dispute:
      "Syrová čísla za nemocnice bez přepočtu na těžkost pacientů mohou nespravedlivě poškodit centra, která berou nejtěžší případy. Je třeba rozhodnout, kolik vysvětlení k číslům přidat a kdo ručí za chybný srovnávací údaj.",
  },
  {
    n: 5,
    slug: "leky",
    title: "Dostupné léky",
    promise:
      "Pacient předem ví doplatek, lék je dostupný i při výpadcích a lékárník dělá víc než výdej. Drahé léky na vzácné nemoci mají vlastní pravidla a fond.",
    layer: "doprovod",
    studyArea: "Oblast 5 (brief Části XI)",
    measures: pick(["M5.1", "M5.2", "M5.3", "M5.4"]),
    manifestSteps: [
      { year: "Rok 1", text: "Novela zákona o léčivech (léky s omezenou dostupností) a evropský zákon o kritických lécích do českého práva." },
      { year: "Rok 2", text: "Státní zásoba rozšířená na 500 a více léčiv, pokuty za nehlášený výpadek." },
      { year: "Rok 3", text: "Online srovnávač doplatků v reálném čase." },
      { year: "Rok 4", text: "Širší pravomoci lékárníků: očkování a prevence." },
      { year: "Rok 5", text: "Fond a vlastní hodnocení pro léky na vzácná onemocnění." },
    ],
    facts: [
      { value: "asi 2 200", label: "aktivních výpadků léků", compare: "v roce 2019 asi 580" },
      { value: "100 → 500+", label: "léčiv v povinné státní zásobě (Emergency Stock)", compare: "dnes asi 100 podle zákona o léčivech" },
    ],
    inspiration: "Britští lékárníci v NHS očkují a poskytují prevenci, Belgie platí lékárníkům roční revizi léků, Nizozemsko má kurýrní výdej a skotský SMC hodnotí léky na vzácné nemoci zvlášť.",
    gaps:
      "Státní zásobu 500 a více léčiv (Emergency Stock) zatím pokrývá jen seznam základních léků (M5.1); rozsah zásoby a strop nákladů na pacienta u léků na vzácná onemocnění zbývá doplnit. Zatím navrhujeme společný rizikový fond všech pojišťoven.",
    dispute:
      "Velké státní zásoby vážou peníze a léky mají omezenou trvanlivost, takže se musí obměňovat. Omezení reexportu navíc naráží na evropské právo.",
  },
  {
    n: 6,
    slug: "pomezi",
    title: "Zdravotně sociální pomezí",
    promise:
      "Zdravotní a sociální péče se propojí tam, kde pacient skutečně žije: po mrtvici, s demencí nebo na konci života. Pojišťovna smí platit sociální službu, která ušetří léčbu, a rodina může být u pacienta v nemocnici.",
    layer: "jadro",
    studyArea: "Pilíř 5 (stáří a konec života doma), P3, J4, J7",
    measures: pick(["J4", "J7", "P3", "Pil5.1", "Pil5.2", "Pil5.3", "Pil5.4", "Pil5.5", "Pil5.6", "Pil5.7", "M9.4"]),
    manifestSteps: [
      { year: "Rok 1", text: "Mezirezortní zákon o propojení zdravotních a sociálních služeb." },
      { year: "Rok 2", text: "Pilot sdíleného financování: rehabilitace po mrtvici a péče o seniory s demencí." },
      { year: "Rok 3", text: "Hospicová a paliativní péče v plné úhradě pojišťoven." },
      { year: "Rok 4", text: "Přítomnost rodiny v nemocnici jako výchozí pravidlo a silnější domácí péče." },
    ],
    facts: [
      { value: "5 914", label: "akutních lůžek ubylo v letech 2010 až 2013, lůžek pro doléčení přibylo jen 22", compare: "údaj ze studie, Manifest číslo neuvádí" },
    ],
    inspiration: "Dánská domácí péče je první volba pro seniory, nizozemský Buurtzorg má samosprávné týmy sester a britský Better Care Fund sdílí peníze zdravotnictví a obcí.",
    gaps:
      "Mezirezortní zákon chce Manifest už v roce 1 (2030); sdílené financování máme jako sociální účet (P3) s účinností 1. 1. 2034, protože za jedno volební období projdou jen dvě velké předlohy. Rodinu v nemocnici chce Manifest bez výjimek; zatím ji dáváme jako výchozí pravidlo s odůvodněnými a zapsanými výjimkami (M9.4).",
    dispute:
      "Spojit dva resorty s různými rozpočtovými pravidly je administrativně těžké a hrozí přehazování odpovědnosti. Domácí péče také není automaticky levnější: bez dost lidí jen přenese zátěž na rodiny.",
  },
  {
    n: 7,
    slug: "vyzkum",
    title: "Světový klinický výzkum",
    promise:
      "Chceme víc akademických klinických studií, které chrání pacienty a nechávají přidanou hodnotu v Česku. Pomoct má program Agentury pro zdravotnický výzkum, rychlé mikrogranty a veřejné vyhodnocování dopadů.",
    layer: "doprovod",
    studyArea: "Oblast 6 (brief Části XI), J1 (pilot jako studie)",
    measures: pick(["M6.1", "M6.2", "M6.3", "M6.4"]),
    manifestSteps: [
      { year: "Rok 1", text: "Centrální etická komise a plné provedení evropského nařízení o klinických hodnoceních." },
      { year: "Rok 2", text: "Pobídky pro pracoviště, která se do studií zapojují (pilot v pěti fakultních nemocnicích)." },
      { year: "Rok 3", text: "Národní biobanka propojená s registry nádorů a rodiček." },
      { year: "Rok 5", text: "Cíl: Česko mezi pěti nejlepšími zeměmi EU v zapojení pacientů do studií na obyvatele." },
    ],
    facts: [
      { value: "7 měsíců", label: "po začátku pandemie nebyla vyhlášena jediná grantová soutěž na covid", compare: "příklad z Manifestu" },
      { value: "64 z 932", label: "registrovaných klinických studií je akademických (7 %)", compare: "cíl studie: 128 akademických studií do roku 2033" },
    ],
    inspiration: "Dánský Trial Nation spojuje pět univerzit a národní biobanku, britský NIHR financuje výzkum přes NHS a evropská síť ECRIN propojuje infrastruktury klinického výzkumu.",
    gaps:
      "Centrální etickou komisi, národní biobanku a plné provedení evropského nařízení o klinických hodnoceních zbývá rozpracovat. Zatím máme program AZV pro akademické studie a vyhodnocení pilotních týmů jako studie.",
    dispute:
      "Centrální etická komise zrychlí schvalování, ale kritici se bojí ztráty znalosti místních poměrů. Pobídky vázané na nábor pacientů mohou tlačit na množství studií na úkor dohledu nad pacienty.",
  },
  {
    n: 8,
    slug: "prevence",
    title: "Prevence jako standard",
    promise:
      "Prevence dostane stálé peníze, aktivní zvaní na screening a bonus pro praktiky za zlepšení zdraví jejich pacientů. Zdaníme alkohol a tabák, děti dostanou hrazenou zubní prevenci.",
    layer: "jadro",
    studyArea: "Pilíř 4 (prevence), J8, J9, P4, J1",
    measures: pick(["J8", "J9", "P4", "Pil4.11", "Pil4.12", "Pil4.1", "Pil4.2", "Pil4.3", "Pil4.4", "Pil4.5", "Pil4.6", "Pil4.7", "Pil4.8", "Pil4.9", "Pil4.10", "J1"]),
    manifestSteps: [
      { year: "Rok 1", text: "Vyšší daň z tabáku a minimální cena alkoholu (skotský vzor)." },
      { year: "Rok 2", text: "Automatické pozvánky na screening tlustého střeva, děložního čípku a prsu." },
      { year: "Rok 3", text: "Hrazená zubní hygiena do 18 let." },
      { year: "Rok 4", text: "Bonus pro praktiky za výsledky u pacientů v dlouhodobé péči." },
      { year: "Rok 5+", text: "Výchova ke zdraví ve školách podle finské severní Karélie." },
    ],
    facts: [
      { value: "463,75", label: "úmrtí na nemoci srdce a cév na 100 000 lidí", compare: "průměr EU-27: 312,95" },
      { value: "31,1 %", label: "účast na screeningu tlustého střeva", compare: "průměr OECD: 42 %, Severské země asi 70 %" },
      { value: "2,7 %", label: "výdajů jde na prevenci (podle Manifestu)", compare: "OECD 3,4 %; studie uvádí 2,74 % proti 3,2 %" },
    ],
    inspiration: "Finská severní Karélie od roku 1972 snížila úmrtnost na srdeční nemoci o desítky procent, Skotsko zavedlo od roku 2018 minimální cenu alkoholu a severské země mají účast na screeningu kolem 70 %.",
    gaps:
      "Manifest chce prevenci aspoň na 5 % výdajů; zatím máme pro Fond prevence nejméně 40 % daní za zdraví, aspoň 2 mld. Kč, a 1,3 mld. Kč na prevenci v týmech, cestu k 5 % zbývá dopočítat. Hrazenou dentální hygienu do 18 let zatím pokrývá fluoridový lak a zalití rýh (0,3 až 0,5 mld. Kč). Daň z tabáku a nikotinu roste postupně a její přírůstek jde na podporu těch, kdo chodí na prevenci (Pil4.11, Pil4.12); pozvánky na všechny screeningy zbývá doplnit.",
    dispute:
      "Daně z alkoholu a tabáku fungují na celou populaci, ale jsou politicky nepopulární a dopadají víc na lidi s nízkými příjmy. Automatické pozvánky zvyšují účast, ale i náklady a riziko zbytečné diagnostiky; kde končí prevence a začíná poručnický přístup státu, je otevřená otázka.",
  },
  {
    n: 9,
    slug: "stomatologie",
    title: "Reforma stomatologie",
    promise:
      "Základní zubní péče bude plně hrazená a zubaři budou mít důvod zůstat ve veřejném systému i mimo velká města. Děti dostanou hrazenou prevenci a větší roli dostanou dentální hygienistky.",
    layer: "doprovod",
    studyArea: "Oblast 7 (brief Části XI), Pilíř 4",
    measures: pick(["M7.1", "M7.2", "M7.3", "M7.4", "M7.5", "Pil4.6"]),
    manifestSteps: [
      { year: "Rok 1", text: "Zákon o hrazené dentální hygieně do 18 let." },
      { year: "Rok 2", text: "Standardizace materiálů: kompozit místo amalgámu u předních zubů." },
      { year: "Rok 3", text: "Bonus pro zubaře za prevenci (méně kazů, vyšší úhrada)." },
      { year: "Rok 4", text: "Pokuty pro pojišťovny, které nezajistí dostupného zubaře." },
      { year: "Rok 5", text: "Prevence rakoviny dutiny ústní při běžné prohlídce." },
    ],
    facts: [
      { value: "52,1 %", label: "pojištěnců šlo v roce 2023 na preventivní prohlídku k zubaři", compare: "v roce 2019 to bylo 55,1 % (údaj ze studie)" },
    ],
    inspiration: "Švédsko hradí zubní péči dětem a mladým, německý Bonusheft vyžaduje každoroční prohlídku pro plnou úhradu a britská NHS má tři cenová pásma, ze kterých pacient předem zná doplatek.",
    gaps:
      "Konec amalgámu a bonus pro zubaře za prevenci zbývá rozpracovat; zubaře mimo velká města zatím drží úprava sazeb (M7.2). Hrazenou dentální hygienu do 18 let zatím pokrývá fluoridový lak, zalití rýh a instruktáž (Pil4.6).",
    dispute:
      "Plně hrazená péče podle švédského vzoru je nákladná a těžko se určuje hranice mezi nutnou a kosmetickou péčí. Pokuty za nedostupnost mohou zubaře z veřejného systému spíš vytlačit a konec amalgámu zdraží plomby, takže je třeba rozhodnout, kdo rozdíl zaplatí.",
  },
  {
    n: 10,
    slug: "data",
    title: "Data ve službách pacienta",
    promise:
      "Elektronizace má lékařům a pacientům ulehčit, a ne jim přidat papírování. Lékař uvidí aktuální záznam a volné kapacity, pacient se přihlásí bankovní identitou a uvidí, kdo se na jeho data díval.",
    layer: "jadro",
    studyArea: "Pilíř 3 (digitální nástroje), J5",
    measures: pick(["J5", "Pil3.1", "Pil3.2", "Pil3.3", "M4.1", "M4.2"]),
    manifestSteps: [
      { year: "Rok 1–2", text: "Zákonné ukotvení jednotných standardů (FHIR) a propojitelnosti systémů." },
      { year: "Rok 2–3", text: "Pacientský portál přes bankovní identitu s přehledem, kdo se na data díval." },
      { year: "Rok 3", text: "Elektronické plánování kapacit (čekací doby, volná lůžka) v provozu." },
      { year: "Rok 3–5", text: "Poskytovatelé aktualizují software na jednotné standardy." },
      { year: "Rok 5+", text: "Anonymizovaná data otevřená denně." },
    ],
    facts: [
      { value: "62", label: "bodů má Česko v indexu zavedení elektronického zdravotnictví", compare: "průměr OECD: 70" },
    ],
    inspiration: "Estonsko má od roku 2008 národní elektronické zdravotnictví, dánský portál sundhed.dk funguje od roku 2003 a finská Kanta spojuje osobní záznam, e-recept a archiv vyšetření.",
    gaps: "Jednotné datové standardy (FHIR) zbývá rozpracovat; Pilíř 3 zatím navazuje na portál pacienta, který ministerstvo spustilo v lednu 2026, a na evropský prostor pro zdravotní data (EHDS).",
    dispute:
      "Lékaři se bojí, že sdílení dat poslouží ke kontrole, a ne k péči. Rychlé zavedení navíc stojí proti ochraně citlivých dat a kybernetické bezpečnosti: ransomware už české nemocnice vyřadil.",
  },
  {
    n: 11,
    slug: "personal",
    title: "Vzdělání a podmínky personálu",
    promise:
      "Lékaři se budou vzdělávat rychleji a s jasnými pravidly, sestry dostanou víc kompetencí a lepší podmínky. Chceme víc lidí, kteří zůstanou v oboru a v regionech.",
    layer: "doprovod",
    studyArea: "Oblast 8 (brief Části XI), J2, P1, P2",
    measures: pick(["M8.1", "M8.2", "M8.3", "M8.4", "M8.5", "J2", "P1", "P2", "Pil5.1"]),
    manifestSteps: [
      { year: "Rok 1", text: "Novela zákona o nelékařských povoláních: sesterská preskripce a širší kompetence." },
      { year: "Rok 2", text: "Víc míst na lékařských fakultách a regionální bonusy pro nedostatkové obory." },
      { year: "Rok 3", text: "Flexibilní kariérní cesty: sestra s rozšířenými kompetencemi (advanced practice nurse)." },
      { year: "Rok 5+", text: "Patnáctileté plánování personálu podle britského vzoru." },
    ],
    facts: [
      { value: "asi 800 mil. Kč", label: "ročně na odměny za rozšířené kompetence nelékařů (odhad Manifestu)", compare: "kurzy kompetencí asi 50 mil. Kč ročně" },
      { value: "40 %", label: "lékařů je starších 55 let", compare: "průměr EU: 33 % (údaj ze studie)" },
    ],
    inspiration: "Nizozemské specialistické sestry smějí předepisovat, britská NHS plánuje personál na patnáct let a sestry v primární péči se širokými kompetencemi mají Finsko a Spojené státy.",
    gaps:
      "Navýšení kapacit lékařských fakult, regionální bonusy a patnáctileté plánování personálu zbývá rozpracovat; zatím máme personální bilanci po krajích (P1) a roční výpočet rezidenčních míst (P2). Kompetence sester přicházejí později než v Manifestu: samostatná indikace od 2032, sestra s rozšířenou praxí od 2033 (J2).",
    dispute:
      "Širší kompetence nelékařů narážejí na odpor části lékařů. Víc míst na fakultách se projeví až za deset a více let a samo neřeší, že lidé odcházejí; otevřené je, zda stačí regionální bonusy, nebo je potřeba závazek odpracovat roky v regionu.",
  },
  {
    n: 12,
    slug: "prava-pacientu",
    title: "Práva pacientů",
    promise:
      "Stížnost pacienta se vyřídí rychle a má váhu. Chceme zdravotnického ombudsmana, který vyšetřuje a jehož doporučení nezůstane bez odpovědi, a porodnice i nemocnice, které respektují práva pacientů. Místo pouhého rušení porodnic chceme porodní asistentky, které se o ženu postarají doma i v porodnici (doplněno do Manifestu 23. 10. 2026).",
    layer: "doprovod",
    studyArea: "Oblast 9 (brief Části XI)",
    measures: pick(["M9.1", "M9.2", "M9.3", "M9.4", "M9.5", "Pil2.6"]),
    manifestSteps: [
      { year: "Rok 1", text: "Nemocniční ombudsman v každé nemocnici (zákon 290/2025 Sb., od 1. 7. 2026)." },
      { year: "Rok 1", text: "Výkony porodní asistentky v seznamu výkonů a smlouvy pojišťoven s komunitními porodními asistentkami. (Doplněno do Manifestu 23. 10. 2026.)" },
      { year: "Rok 2", text: "Jednotné stížnostní řízení s lhůtou 30 dnů a pokutami." },
      { year: "Rok 3", text: "Pilot hlášení pacientských incidentů ve třech fakultních nemocnicích." },
      { year: "Rok 3", text: "Žádná porodnice se nesloučí ani nezavře bez sítě komunitních porodních asistentek v území a plánu dojezdu (zákon o síti). (Doplněno do Manifestu 23. 10. 2026.)" },
      { year: "Rok 4", text: "Pacientský advokát pro onkologii a vážné diagnózy." },
      { year: "Rok 5+", text: "Odškodnění bez prokazování viny podle skandinávského vzoru." },
    ],
    facts: [
      { value: "38 dnů", label: "trvalo ve skutečnosti vyřízení stížnosti místo zákonných 30", compare: "u lhůty 90 dnů to bylo 172 dnů (údaj ze studie)" },
    ],
    inspiration: "Švédsko a Norsko mají ombudsmana pro pacienty, Dánsko a Švédsko odškodnění bez prokazování viny, Británie síť Healthwatch a Nizozemsko inspekci, která zveřejňuje výsledky po pracovištích.",
    gaps:
      "Hlášení incidentů, mediaci a odškodnění bez prokazování viny zbývá rozpracovat. Nemocniční ombudsman podle zákona 290/2025 Sb. už platí; k němu přidáváme zdravotnického ombudsmana u veřejného ochránce práv. Péči porodních asistentek a pravidlo, že se žádná porodnice nezavře bez jejich sítě v území, rozpracovává Pil2.6.",
    dispute:
      "Odškodnění bez viny zrychluje kompenzaci, ale kritici se bojí, že oslabí odpovědnost za chyby. Hlášení incidentů funguje jen v kultuře bez trestání, kterou je těžké vybudovat tam, kde se hledá viník.",
  },
  {
    n: 13,
    slug: "dusevni-zdravi",
    title: "Péče o duševní zdraví",
    promise:
      "Psychoterapie bude zdravotní služba s jasnou kvalifikací a úhradou. Centra duševního zdraví dostanou širší týmy a stabilní peníze a péče se přesune z lůžek blíž k lidem.",
    layer: "doprovod",
    studyArea: "Oblast 10 (brief Části XI), J1, P3",
    measures: pick(["M10.1", "M10.2", "M10.3", "M10.4", "M10.5", "J1"]),
    manifestSteps: [
      { year: "Rok 1", text: "Zákon o psychoterapii: definice profese, výcvikové standardy, úhrada." },
      { year: "Rok 2", text: "Širší týmy v centrech duševního zdraví: sociální pracovníci, peer konzultanti, adiktologové." },
      { year: "Rok 3", text: "Pilot britských Talking Therapies ve třech krajích." },
      { year: "Rok 4", text: "Duševní zdraví ve školním učivu (s ministerstvem školství)." },
      { year: "Rok 5+", text: "Přesun peněz z lůžkové do komunitní péče podle belgického vzoru." },
    ],
    facts: [
      { value: "11,6", label: "sebevražd na 100 000 obyvatel", compare: "průměr EU: 10,4" },
      { value: "77", label: "denních dávek antidepresiv na 1 000 lidí", compare: "průměr OECD: 67" },
      { value: "31 center", label: "duševního zdraví fungovalo koncem roku 2023", compare: "strategie z roku 2013 počítala do roku 2023 se 100 (údaj ze studie)" },
    ],
    inspiration: "Britské Talking Therapies nabízejí psychoterapii bez doplatku od roku 2008, Belgie od roku 2010 přesouvá peníze do komunitní péče a Nizozemsko hradí zdravotnické psychology v základním pojištění.",
    gaps:
      "Zákon o psychoterapii chce Manifest už v roce 1 (2030); zatím ho řešíme novelami zákonů s účinností 1. 1. 2034 (M10.3). Dětskou psychiatrii máme zatím jen jako rezidenční místa navázaná na cíl (M10.5); kapacity a krajské rozložení doplníme.",
    dispute:
      "Přesun z lůžek do komunity funguje jen tam, kde komunitní síť opravdu vznikne; jinak zůstanou lidé bez péče. Vysoká spotřeba antidepresiv navíc nemusí být jen selhání, část může odrážet lepší záchyt deprese.",
  },
];

// ---------------------------------------------------------------------------
// Co studie přidává nad rámec Manifestu
// ---------------------------------------------------------------------------

export const BEYOND_MANIFEST: { title: string; text: string }[] = [
  {
    title: "Týmy primární péče s pětiletou smlouvou (J1 až J4)",
    text: "Manifest týmy praktiků a sester výslovně neřeší. Studie navrhuje dobrovolné týmy pro 10 až 25 tisíc lidí, smlouvu na pět let a platbu za to, co tým skutečně zajišťuje. Kolem roku 2038 počítáme s 520 týmy a asi 4 000 sestrami navíc.",
  },
  {
    title: "Krajský plán sítě lůžkové péče (J6 a J7)",
    text: "Každý kraj dostane desetiletý plán sítě nemocnic. Akutní lůžko se změní na lůžko pro doléčení nebo rehabilitaci až tehdy, když kraj doloží, že pacienti mají kam jít a že záchranka dojede včas. Do roku 2038 se tak změní účel asi 8 000 lůžek.",
  },
  {
    title: "Nový vzorec platby státu (J10)",
    text: "Manifest se věnuje hlavně úhradám a pravidlům a zdroj peněz otevírá jen obecně. Studie navrhuje nový výpočet platby státu za jeho pojištěnce (děti, důchodce, studenty); za každého z nich zaplatí stát kvůli reformě asi o 180 Kč měsíčně víc.",
  },
  {
    title: "Personální bilance a rezidenční místa (P1, P2)",
    text: "Bez lidí reforma nebude. Proto studie po krajích zveřejní, kolik sester a lékařů je potřeba, a každý rok spočítá, kolik rezidenčních míst pro praktiky a pediatry se má vypsat.",
  },
  {
    title: "Čtyři kontrolní body a tři varianty",
    text: "Manifest popisuje kroky po letech. Studie přidává čtyři kontrolní body (2028, přelom 2029 a 2030, konec 2031 a 2033), ve kterých se podle čísel rozhodne, zda pokračovat, upravit, nebo zmenšit. Základní varianta A stojí asi 21,5 mld. Kč ročně, varianta bez nových center 18 mld. Kč a minimální varianta 11 mld. Kč.",
  },
];
