/**
 * Podklady pro média: handout na dvě strany, prezentace a shrnutí na stránce /pro-media.
 * Jedna linka pro všechny tři: máme problém, nabízíme řešení, detaily jsou ve studii, zapojte se.
 * Čísla jsou stejná jako na webu a ve studii v3.2 (hlídá je `pnpm check:cisla`).
 */
import { FIVE_CHANGES, META, NOT_DOING } from "@/content/reforma";

export const PITCH = {
  title: "Zdraví blíž lidem",
  subtitle: "Plán reformy zdravotnictví, verze 3.2 ke konzultaci",
  /** Jedna věta, o co nám jde. */
  claim: "Chceme, aby každý měl svého lékaře a svou sestru blízko domova, aby nemocnice dostaly jasnou roli a aby prevence měla stálé peníze.",
  /** Krátký popis k převzetí (perex článku, anotace pořadu). */
  boilerplate:
    "Zdraví blíž lidem je plán reformy českého zdravotnictví na tři volební období. Praktici se mohou dobrovolně spojit do týmů s víc sestrami, pacient dostane termín u specialisty podle toho, jak to spěchá, okresní nemocnice dostanou jistou roli v doléčení a rehabilitaci a prevence stálé peníze z daní z tichého vína a slazených nápojů. Až reforma poběží naplno kolem roku 2038, bude stát asi 21,5 mld. Kč ročně, necelá 4 % dnešních výdajů zdravotního pojištění. Studie je ve verzi 3.2 ke konzultaci a připomínky přijímá do 31. 3. 2027.",
};

/** Máme problém: čtyři fakta, která platí bez ohledu na to, kdo vládne. */
export const PROBLEM = [
  {
    value: "200 → 509 tisíc",
    title: "Přibývá lidí, kteří potřebují péči",
    text: "Lidí nad 85 let je dnes 200 tisíc, v roce 2050 jich bude 509 tisíc. Těch, kdo se o ně postarají a kdo na péči vydělají, bude méně.",
    source: "ÚZIS",
  },
  {
    value: "5 500 → 3 900 až 4 500",
    title: "Praktických lékařů ubývá",
    text: "Praktiků pro dospělé je dnes 5 500, v roce 2035 jich bude 3 900 až 4 500. V obcích do 2 000 obyvatel za čtyři roky zaniklo 428 ordinací a vzniklo jen 291. Svého dětského lékaře nemělo 182 tisíc dětí.",
    source: "ÚZIS, NRZP",
  },
  {
    value: "29,7 % : 4,3 %",
    title: "Peníze končí hlavně na akutních lůžkách",
    text: "Na akutní lůžka jde 29,7 % plateb pojišťoven, na praktiky pro dospělé 4,3 %. Akutní lůžka jsou přitom obsazená z 56 %, lůžka pro doléčení a dlouhodobou péči z 85,4 %.",
    source: "ÚZIS 2024",
  },
  {
    value: "70 mld. Kč",
    title: "Pojištění bude chybět peněz i bez reformy",
    text: "V roce 2038 bude zdravotnímu pojištění chybět 70 mld. Kč ročně, i kdyby se nic neměnilo. Péče na dnešní úrovni se udrží, jen když lidé budou stonat později a méně.",
    source: "Národní rozpočtová rada 2026",
  },
];

/** Nabízíme řešení: pět změn, které lidé pocítí. */
export const SOLUTION = FIVE_CHANGES.map((c) => ({ n: c.n, title: c.title, text: c.short, codes: c.codes }));

/** Co to stojí a kdy. */
export const COST = [
  { value: "21,5 mld. Kč", label: "ročně, až reforma poběží naplno kolem roku 2038 (odhad 15 až 25 mld. Kč), necelá 4 % dnešních výdajů zdravotního pojištění" },
  { value: "520 týmů", label: "lékařů a sester blízko domova a asi 4 000 sester navíc" },
  { value: "8 000 lůžek", label: "změní účel na doléčení a rehabilitaci, žádné dřív, než je náhrada" },
  { value: "5 mld. Kč", label: "ročně z daní na tiché víno a slazené nápoje, nejméně 40 % na prevenci" },
];

export const TIMELINE = [
  { when: "do 31. 3. 2027", what: "první kolo připomínek k verzi 3.2" },
  { when: "2027 a 2028", what: "kulaté stoly a dohody s organizacemi" },
  { when: "2028 a 2029", what: "zkouška ve třech regionech" },
  { when: "2031 až 2033", what: "zákony, peníze a daně začnou platit" },
  { when: "kolem 2038", what: "reforma běží naplno" },
];

/** Čeho se lidé bojí a co neděláme (krátké věty z NOT_DOING). */
export const NOT_DOING_SHORT = NOT_DOING.slice(0, 5).map((x) => x.title);

/** Detaily jsou ve studii. */
export const STUDY_POINTS = [
  "Plné znění po kapitolách, s grafy, harmonogramem a závislostmi mezi opatřeními",
  "Každé číslo má zdroj, rok a definici; co ještě ověřujeme, je v textu označené",
  "Ekonomický model se třemi variantami podle toho, co se podaří",
  "Rizika a kontrolní body, na kterých se reforma může zastavit nebo zmenšit",
];

/** Zapojte se: čtyři cesty, od pěti minut po kulatý stůl. */
export const JOIN = [
  { title: "Napište připomínku", text: `ke kterémukoli odstavci studie, do ${META.deadline}`, path: "/studie" },
  { title: "Navrhněte opatření", text: "které v plánu chybí; průvodce vás provede otázkami", path: "/studie/navrhnout-opatreni" },
  { title: "Přihlaste se ke kulatému stolu", text: "k tématu, kterému rozumíte; pozvánku pošleme, až bude termín", path: "/zapojte-se#kulate-stoly" },
  { title: "Ozvěte se za organizaci", text: "chcete se setkat, plán podpořit nebo pomoct s jeho částí", path: "/zapojte-se#organizace" },
];

/** Soubory ke stažení na /pro-media (generuje je `pnpm pdf podklady`). */
export const DOWNLOADS = {
  handout: { href: "/podklady/zdravi-bliz-lidem-handout.pdf", title: "Handout na dvě strany", text: "Máme problém, nabízíme řešení, detaily jsou ve studii, zapojte se. Na tisk A4 oboustranně." },
  prezentace: { href: "/podklady/zdravi-bliz-lidem-prezentace.pdf", title: "Prezentace", text: "Snímky 16 : 9 k převzetí do reportáže nebo k promítnutí. Čísla jsou stejná jako ve studii." },
  studie: { href: "/studie.pdf", title: "Celá studie", text: "Plné znění verze 3.2 se zdroji, grafy a přílohami." },
};
