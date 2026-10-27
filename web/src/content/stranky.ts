/**
 * Veřejné stránky webu: titulek a popis pro výsledky vyhledávání a náhledy pro sdílení
 * (pageMeta v src/lib/seo.ts) a pro hledání na webu (/hledat). Popis má asi 120 až 160 znaků.
 */
export const STRANKY = {
  "/": {
    title: "Plán reformy zdravotnictví",
    description: "Plán reformy zdravotnictví ke konzultaci: každý má svůj tým lékaře a sestry blízko domova, nemocnice mění roli a prevence má stálé peníze.",
  },
  "/proc": {
    title: "Proč měnit zdravotnictví",
    description: "Proč zdravotnictví potřebuje změnu: přibývá lidí nad 85 let, ubývá praktických lékařů a velká část peněz končí na akutních lůžkách. Čísla se zdroji.",
  },
  "/co-chceme": {
    title: "Co se změní pro pacienty",
    description: "Pět změn, které lidé pocítí: vlastní lékař a sestra blízko domova, termín u specialisty podle naléhavosti, péče doma a nová role okresních nemocnic.",
  },
  "/jak": {
    title: "Jak a kdy: harmonogram reformy",
    description: "Harmonogram reformy zdravotnictví: zkouška ve třech regionech v letech 2028 a 2029, první zákony od roku 2031 a cílový stav kolem roku 2038.",
  },
  "/penize": {
    title: "Kolik reforma stojí a kdo ji zaplatí",
    description: "Reforma stojí asi 21,5 miliardy korun ročně, v rozpětí 15 až 25 miliard. Odkud peníze přijdou, na co půjdou a proč péče zdraží i bez reformy.",
  },
  "/pro-koho": {
    title: "Pro koho je reforma",
    description: "Co reforma nabízí praktikům, sestrám, pojišťovnám, krajům, obcím a pacientům a co od nich potřebuje. Plán na tři volební období.",
  },
  "/plan": {
    title: "13 oblastí Manifestu zdravotnictví",
    description: "Třináct oblastí Manifestu zdravotnictví a jak je plán řeší: nosná a doplňková opatření, sporné body a co ještě zbývá rozpracovat.",
  },
  "/souvislosti": {
    title: "Jak to do sebe zapadá",
    description: "Mapa vazeb, organigramy pilířů a matice vlivů: co na co v reformě navazuje a co se kde ovlivňuje.",
  },
  "/studie": {
    title: "Odborná studie",
    description: "Plné znění studie reformy zdravotnictví, verze 3.2 ke konzultaci, po kapitolách: primární péče, nemocnice, prevence, peníze, zákony a harmonogram.",
  },
  "/studie/navrhnout-opatreni": {
    title: "Navrhnout nové opatření",
    description: "Chybí v plánu reformy zdravotnictví něco důležitého? Průvodce vás provede návrhem nového opatření: problém, řešení, termín, návaznosti, náklady a přínos.",
  },
  "/studie/zavislosti": {
    title: "Grafy závislostí",
    description: "Všechny grafy závislostí ze studie na jedné stránce: kritická cesta, co na co navazuje, mapa vazeb, organigramy a matice vlivů. Každý vede na své místo ve studii.",
  },
  "/cisla": {
    title: "Čísla a zdroje",
    description: "Každé číslo webu se zdrojem, rokem, definicí, rozpětím a druhem: údaj, výhled, scénářový výpočet, cíl, nebo pravidlo.",
  },
  "/otazky": {
    title: "Časté otázky k reformě",
    description: "Odpovědi na nejčastější otázky k reformě zdravotnictví: rušení nemocnic a porodnic, daně, sestry, cena reformy, týmy praktiků a střet zájmů.",
  },
  "/slovnicek": {
    title: "Slovníček pojmů",
    description: "Srozumitelné vysvětlení pojmů z plánu reformy zdravotnictví: primární péče, tým sdružené péče, obložnost, eŽádanka, daně za zdraví, Fond prevence a další.",
  },
  "/zapojte-se": {
    title: "Zapojte se do konzultace",
    description: "Jak se zapojit do konzultace plánu reformy zdravotnictví: připomínka ke studii, návrh opatření, přihláška ke kulatým stolům a setkání za organizaci.",
  },
  "/pro-media": {
    title: "Pro média",
    description: "Podklady pro novináře k plánu reformy zdravotnictví: handout na dvě strany, prezentace a celá studie v PDF, hlavní čísla se zdroji a kontakt.",
  },
  "/ochrana-udaju": {
    title: "Ochrana osobních údajů",
    description: "Jaké údaje ukládáme u připomínek, přihlášek ke kulatým stolům a odběru novinek, proč, jak dlouho a jak si je stáhnout nebo smazat.",
  },
} as const;

export type StrankaPath = keyof typeof STRANKY;
