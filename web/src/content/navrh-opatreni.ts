/**
 * Průvodce návrhem nového opatření (/studie/navrhnout-opatreni). Otázky jsou poskládané tak,
 * aby z odpovědí šlo opatření posoudit stejně jako opatření studie: problém, co se změní,
 * nástroj, kdo ho provede, kdy začne platit, na co navazuje, kolik stojí, jak se pozná přínos
 * a z čeho návrh vychází. Stejnou definici používá formulář v prohlížeči i kontrola na serveru.
 */

export type Option = { v: string; l: string; hint?: string };

export type Field = {
  id: string;
  label: string;
  /** Proč se ptáme a co do odpovědi patří. */
  hint?: string;
  /** Příklad dobré odpovědi (zobrazí se jako ukázka, nevyplňuje se). */
  example?: string;
  type: "text" | "email" | "textarea" | "select" | "radio" | "multi" | "codes";
  options?: Option[];
  required?: boolean;
  /** Nejmenší počet znaků u textu. */
  min?: number;
  max: number;
  /** Nejvýš tolik odkazů v textu (výchozí 2; zdroje mají vlastní limit). */
  maxLinks?: number;
  /** Pole se ukáže, jen když jiné pole má jednu z hodnot. */
  showIf?: { field: string; values: string[] };
};

export type Step = { id: string; title: string; intro: string; fields: Field[] };

export type Answers = Record<string, string | string[]>;

export const AREAS: Option[] = [
  { v: "pilir-1", l: "Pilíř 1: praktici, sestry a týmy blízko domova" },
  { v: "pilir-2", l: "Pilíř 2: síť nemocnic a lůžková péče" },
  { v: "pilir-3", l: "Pilíř 3: digitální nástroje a data" },
  { v: "pilir-4", l: "Pilíř 4: prevence a daně za zdraví" },
  { v: "pilir-5", l: "Pilíř 5: péče doma, stáří a konec života" },
  { v: "oblast-1", l: "Hodnocení přínosu a nákladů péče" },
  { v: "oblast-2", l: "Volba pacienta a připlácení bez úplatků" },
  { v: "oblast-3", l: "Pojišťovny a služby pojištěncům" },
  { v: "oblast-4", l: "Transparence a otevřená data" },
  { v: "oblast-5", l: "Dostupné léky" },
  { v: "oblast-6", l: "Klinický výzkum" },
  { v: "oblast-7", l: "Stomatologie" },
  { v: "oblast-8", l: "Vzdělávání a podmínky zdravotníků" },
  { v: "oblast-9", l: "Práva pacientů" },
  { v: "oblast-10", l: "Duševní zdraví" },
  { v: "financovani", l: "Financování zdravotnictví jako celku" },
  { v: "jinde", l: "Jinde nebo nevím" },
];

export const WAVES: Option[] = [
  { v: "vlna-0", l: "Hned, bez nového zákona (2027 až 2029)", hint: "Úhradová vyhláška, smlouvy pojišťoven, metodika ministerstva, pozměňovací návrh k vládnímu zákonu." },
  { v: "vlna-1", l: "S penězi a daněmi, od 1. 1. 2031", hint: "Platba státu za státní pojištěnce, daně za zdraví, Fond prevence." },
  { v: "vlna-2", l: "Se zákonem o primární péči, od 1. 1. 2032", hint: "Týmy praktiků a sester, smlouvy na pět let, kompetence sester." },
  { v: "vlna-3", l: "Se zákonem o síti nemocnic, od 1. 1. 2033", hint: "Krajské plány sítě, přeměna lůžek, dojezd záchranky." },
  { v: "vlna-4", l: "V dokončení reformy, 2033 a později", hint: "Léky, sestry v pokročilé praxi, financování sociálně-zdravotní péče." },
  { v: "nevim", l: "Nevím, posuďte sami" },
];

export const STEPS: Step[] = [
  {
    id: "problem",
    title: "Jaký problém řešíte",
    intro: "Dobré opatření začíná popisem problému. Napište ho tak, aby ho pochopil i člověk, který ho sám nezažil.",
    fields: [
      {
        id: "problem",
        label: "Jaký problém má opatření vyřešit?",
        hint: "Co dnes nefunguje, komu to vadí a jak se to projevuje. Pište konkrétně, klidně na příkladu.",
        example: "V našem okrese odešli dva praktici do důchodu a nikdo je nenahradil. Asi 3 000 lidí nemá praktika a s každou drobností jezdí na pohotovost do 30 km vzdálené nemocnice.",
        type: "textarea",
        required: true,
        min: 60,
        max: 3000,
      },
      {
        id: "affected",
        label: "Koho se problém týká?",
        hint: "Vyberte všechny skupiny, kterých se problém dotýká.",
        type: "multi",
        required: true,
        max: 20,
        options: [
          { v: "pacienti", l: "Pacienti a jejich rodiny" },
          { v: "seniori", l: "Senioři a lidé s chronickou nemocí" },
          { v: "deti", l: "Děti a rodiče" },
          { v: "praktici", l: "Praktičtí lékaři" },
          { v: "specialiste", l: "Ambulantní specialisté" },
          { v: "sestry", l: "Sestry a další zdravotníci" },
          { v: "nemocnice", l: "Nemocnice" },
          { v: "pojistovny", l: "Zdravotní pojišťovny" },
          { v: "kraje", l: "Kraje" },
          { v: "obce", l: "Obce" },
          { v: "socialni", l: "Sociální služby" },
          { v: "stat", l: "Stát a ministerstva" },
        ],
      },
      {
        id: "scale",
        label: "Jak velký problém je?",
        hint: "Čísla, pokud je znáte: kolika lidí se týká, kolik stojí, jak dlouho se čeká. Stačí odhad, napište, odkud je.",
        example: "Podle krajského úřadu chybí v okrese 6 praktiků; čekací doba na registraci je přes rok.",
        type: "textarea",
        max: 1500,
      },
      {
        id: "basis",
        label: "Odkud o problému víte?",
        type: "radio",
        required: true,
        max: 40,
        options: [
          { v: "praxe", l: "Z vlastní praxe nebo zkušenosti" },
          { v: "data", l: "Z dat nebo výzkumu" },
          { v: "clenove", l: "Od pacientů, klientů nebo členů naší organizace" },
          { v: "media", l: "Z médií nebo od známých" },
        ],
      },
    ],
  },
  {
    id: "opatreni",
    title: "Co navrhujete",
    intro: "Teď samotné opatření: co přesně se má změnit a kam do plánu patří.",
    fields: [
      {
        id: "title",
        label: "Pojmenujte opatření jednou větou",
        example: "Sdílená sestra pro malé obce bez ordinace",
        type: "text",
        required: true,
        min: 5,
        max: 140,
      },
      {
        id: "description",
        label: "Co přesně se má změnit?",
        hint: "Popište, co bude jinak než dnes: kdo začne co dělat, za co se bude platit, co se povolí nebo zakáže. Čím konkrétnější návrh, tím lépe ho dokážeme posoudit.",
        example: "Obce do 2 000 obyvatel si mohou se sousedními obcemi sdílet sestru, která dvakrát týdně ordinuje v obecní místnosti a jezdí za lidmi domů. Sestra je zaměstnaná u týmu praktika v nejbližším městě, pojišťovny platí její návštěvy jako výkon týmu a obce hradí prostor a dopravu.",
        type: "textarea",
        required: true,
        min: 120,
        max: 5000,
      },
      {
        id: "area",
        label: "Kam opatření v plánu patří?",
        hint: "Plán má pět pilířů a deset dalších oblastí Manifestu. Když si nejste jistí, zvolte „Jinde nebo nevím“.",
        type: "select",
        required: true,
        max: 40,
        options: AREAS,
      },
      {
        id: "relation",
        label: "Je to nové opatření, nebo úprava toho, co už ve studii je?",
        type: "radio",
        required: true,
        max: 40,
        options: [
          { v: "nove", l: "Nové opatření, ve studii nic takového není" },
          { v: "uprava", l: "Rozšíření nebo úprava opatření ze studie" },
          { v: "nahrada", l: "Náhrada opatření ze studie, které považuji za chybné" },
        ],
      },
      {
        id: "relatedCodes",
        label: "Které opatření ze studie upravujete nebo nahrazujete?",
        hint: "Hledejte podle kódu (například J4) nebo slova z názvu.",
        type: "codes",
        required: true,
        max: 3,
        showIf: { field: "relation", values: ["uprava", "nahrada"] },
      },
    ],
  },
  {
    id: "provedeni",
    title: "Jak ho zavést",
    intro: "Každé opatření potřebuje nástroj (zákon, vyhlášku, smlouvu…) a někoho, kdo ho provede. Pokud to nevíte, zvolte „Nevím“; pomůže nám ale každý tip.",
    fields: [
      {
        id: "instrument",
        label: "Jakým nástrojem se dá opatření zavést?",
        type: "multi",
        required: true,
        max: 20,
        options: [
          { v: "zakon", l: "Zákon (nový nebo novela)" },
          { v: "vyhlaska", l: "Vyhláška nebo nařízení vlády" },
          { v: "uhrady", l: "Úhradová vyhláška a dohodovací řízení", hint: "Pravidla, za co a kolik pojišťovny platí." },
          { v: "smlouvy", l: "Smlouvy pojišťoven s poskytovateli" },
          { v: "metodika", l: "Metodika nebo Věstník ministerstva" },
          { v: "rozpocet", l: "Státní rozpočet nebo dotační program" },
          { v: "kraj-obec", l: "Rozhodnutí kraje nebo obce" },
          { v: "organizace", l: "Jiná organizace péče bez nového předpisu" },
          { v: "nevim", l: "Nevím" },
        ],
      },
      {
        id: "legal",
        label: "Které předpisy by se měnily?",
        hint: "Například zákon č. 48/1997 Sb., § 17. Nevadí, když to nevíte.",
        type: "textarea",
        max: 1500,
        showIf: { field: "instrument", values: ["zakon", "vyhlaska", "uhrady"] },
      },
      {
        id: "who",
        label: "Kdo má opatření provést a kdo za něj odpovídá?",
        type: "multi",
        required: true,
        max: 20,
        options: [
          { v: "mz", l: "Ministerstvo zdravotnictví" },
          { v: "ministerstva", l: "Jiné ministerstvo (práce a sociálních věcí, financí, školství)" },
          { v: "pojistovny", l: "Zdravotní pojišťovny" },
          { v: "kraje", l: "Kraje" },
          { v: "obce", l: "Obce" },
          { v: "poskytovatele", l: "Poskytovatelé péče (ordinace, nemocnice)" },
          { v: "komory", l: "Profesní komory a odborné společnosti" },
          { v: "nevim", l: "Nevím" },
        ],
      },
      {
        id: "pilot",
        label: "Dá se opatření nejdřív vyzkoušet v menším rozsahu?",
        hint: "Reforma nové věci nejdřív zkouší ve třech regionech a podle výsledků je rozšiřuje.",
        type: "radio",
        required: true,
        max: 40,
        options: [
          { v: "region", l: "Ano, v jednom regionu nebo u části poskytovatelů" },
          { v: "projekt", l: "Ano, jako dočasný projekt" },
          { v: "ne", l: "Ne, musí platit všude najednou" },
          { v: "nevim", l: "Nevím" },
        ],
      },
      {
        id: "pilotNote",
        label: "Jak by zkouška vypadala a podle čeho poznáme, že funguje?",
        type: "textarea",
        max: 1500,
        showIf: { field: "pilot", values: ["region", "projekt"] },
      },
    ],
  },
  {
    id: "kdy",
    title: "Kdy by mělo platit",
    intro: "Reforma postupuje ve vlnách. Co nepotřebuje zákon, jde začít hned. Zákony může prosadit až vláda po volbách 2029, finanční změny platí od roku 2031, velké zákony od let 2032 a 2033.",
    fields: [
      {
        id: "wave",
        label: "Kdy by opatření mělo začít platit?",
        type: "radio",
        required: true,
        max: 40,
        options: WAVES,
      },
      {
        id: "whyWhen",
        label: "Proč právě tehdy? Co musí platit dřív?",
        hint: "Například: nejdřív musí být dost sester, musí fungovat elektronická žádanka nebo musí být schválený zákon o primární péči.",
        type: "textarea",
        max: 1500,
      },
      {
        id: "deadline",
        label: "Je nějaký pevný termín, který nesmíme propásnout?",
        example: "Podněty do dohodovacího řízení o úhradách na rok 2028 se podávají do 31. 1. 2027.",
        type: "text",
        max: 300,
      },
    ],
  },
  {
    id: "navaznosti",
    title: "Na co navazuje",
    intro: "Opatření studie na sebe navazují: některé nejdou bez jiných a některá se navzájem ovlivňují. Vazby vybírejte z registru opatření studie.",
    fields: [
      {
        id: "dependsOn",
        label: "Bez kterých opatření studie by návrh nefungoval?",
        hint: "Hledejte podle kódu (například J2) nebo slova z názvu. Pokud žádné takové není, nechte prázdné.",
        type: "codes",
        max: 10,
      },
      {
        id: "affects",
        label: "Která opatření studie by návrh ovlivnil nebo s kterými je v rozporu?",
        type: "codes",
        max: 10,
      },
      {
        id: "linksNote",
        label: "Popište vazby nebo rozpory slovy",
        hint: "Například: potřebuje sesterskou složku úhrady (J2), jinak si týmy sestru nemohou dovolit.",
        type: "textarea",
        max: 2000,
      },
      {
        id: "government",
        label: "Souvisí návrh s něčím, co dnes připravuje vláda nebo ministerstvo?",
        hint: "Například novela zákona, která je ve Sněmovně, nebo strategie ministerstva.",
        type: "textarea",
        max: 1500,
      },
    ],
  },
  {
    id: "dopady",
    title: "Peníze a dopady",
    intro: "Nemusíte znát přesná čísla. Pomůže řád velikosti a to, kdo by platil a co se tím zlepší.",
    fields: [
      {
        id: "cost",
        label: "Kolik by opatření stálo ročně?",
        type: "radio",
        required: true,
        max: 40,
        options: [
          { v: "nic", l: "Nic nebo skoro nic" },
          { v: "do-100-mil", l: "Do 100 milionů Kč" },
          { v: "do-1-mld", l: "100 milionů až 1 miliarda Kč" },
          { v: "do-5-mld", l: "1 až 5 miliard Kč" },
          { v: "nad-5-mld", l: "Víc než 5 miliard Kč" },
          { v: "nevim", l: "Nevím" },
        ],
      },
      {
        id: "costNote",
        label: "Jak jste k odhadu došli? Jsou potřeba i jednorázové investice?",
        example: "150 sester × 1 mil. Kč ročně = 150 mil. Kč; jednorázově vybavení obecních místností asi 20 mil. Kč.",
        type: "textarea",
        max: 2000,
      },
      {
        id: "payer",
        label: "Kdo by to zaplatil?",
        type: "multi",
        required: true,
        max: 20,
        options: [
          { v: "pojisteni", l: "Veřejné zdravotní pojištění" },
          { v: "rozpocet", l: "Státní rozpočet" },
          { v: "kraje-obce", l: "Kraje nebo obce" },
          { v: "fond-prevence", l: "Daně za zdraví a Fond prevence" },
          { v: "eu", l: "Evropské fondy" },
          { v: "pacienti", l: "Pacienti (doplatky, poplatky)" },
          { v: "uspora", l: "Zaplatí se z úspory jinde" },
          { v: "nevim", l: "Nevím" },
        ],
      },
      {
        id: "benefit",
        label: "Co se díky opatření zlepší a jak to poznáme?",
        hint: "Napište, co se má změnit a podle čeho to změříme: počet lidí s praktikem, čekací doba, zbytečné hospitalizace, náklady, spokojenost.",
        example: "Lidé v obcích bez ordinace budou mít péči do 15 minut cesty; měříme podíl obyvatel s registrujícím praktikem a počet ošetření na pohotovosti.",
        type: "textarea",
        required: true,
        min: 40,
        max: 2000,
      },
      {
        id: "risks",
        label: "Co se může pokazit a kdo by mohl být proti?",
        hint: "Poctivý popis rizik a odporu návrhu pomáhá. Napište i to, jak se riziku dá předejít.",
        type: "textarea",
        max: 2000,
      },
    ],
  },
  {
    id: "dukazy",
    title: "Z čeho vycházíte",
    intro: "Každé opatření studie se opírá o důkazy. Nejsou povinné, ale návrh s příkladem nebo zdrojem posoudíme rychleji.",
    fields: [
      {
        id: "examples",
        label: "Funguje to už někde?",
        hint: "Jiná země, region, nemocnice nebo pilotní projekt v Česku. Co tam funguje a co ne.",
        type: "textarea",
        max: 2000,
      },
      {
        id: "sources",
        label: "Zdroje",
        hint: "Odkazy na studie, data, zprávy nebo zákony, každý na nový řádek. Nejvýš pět odkazů.",
        type: "textarea",
        max: 3000,
        maxLinks: 5,
      },
    ],
  },
  {
    id: "kontakt",
    title: "Kdo návrh posílá",
    intro: "Jméno ani e-mail nikde nezveřejňujeme. Na e-mail vám pošleme odkaz k potvrzení a ozveme se, když budeme potřebovat návrh upřesnit.",
    fields: [
      { id: "name", label: "Jméno", hint: "Stačí jméno nebo přezdívka.", type: "text", required: true, min: 2, max: 80 },
      { id: "email", label: "E-mail", type: "email", required: true, min: 5, max: 200 },
      {
        id: "onBehalf",
        label: "Posíláte návrh za sebe, nebo za organizaci?",
        type: "radio",
        required: true,
        max: 20,
        options: [
          { v: "osoba", l: "Za sebe" },
          { v: "organizace", l: "Za organizaci" },
        ],
      },
      {
        id: "organization",
        label: "Název organizace",
        hint: "Ve veřejném vypořádání návrhů uvádíme jen názvy organizací.",
        type: "text",
        required: true,
        min: 2,
        max: 200,
        showIf: { field: "onBehalf", values: ["organizace"] },
      },
      {
        id: "role",
        label: "Jaký máte vztah ke zdravotnictví?",
        type: "select",
        max: 40,
        options: [
          { v: "pacient", l: "Pacient nebo blízký pacienta" },
          { v: "lekar", l: "Lékař nebo lékařka" },
          { v: "zdravotnik", l: "Sestra nebo jiný zdravotník" },
          { v: "vedeni", l: "Vedení ordinace nebo nemocnice" },
          { v: "pojistovna", l: "Pojišťovna" },
          { v: "sprava", l: "Veřejná správa (obec, kraj, ministerstvo)" },
          { v: "vyzkum", l: "Výzkum nebo vzdělávání" },
          { v: "neziskovka", l: "Pacientská nebo jiná nezisková organizace" },
          { v: "jine", l: "Jiný" },
        ],
      },
    ],
  },
];

const FIELDS = new Map(STEPS.flatMap((s) => s.fields.map((f) => [f.id, f] as const)));

/** Je pole v aktuálních odpovědích vidět (podmínka showIf)? */
export function isVisible(f: Field, a: Answers): boolean {
  if (!f.showIf) return true;
  const v = a[f.showIf.field];
  const vals = Array.isArray(v) ? v : v ? [v] : [];
  return vals.some((x) => f.showIf!.values.includes(x));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Odkazy v textu počítá stejně jako ochrana veřejných připomínek (privacy-core). */
const LINK_RE = /(https?:\/\/|www\.)\S+/gi;
const DEFAULT_MAX_LINKS = 2;
const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const list = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

/** Chyby jednoho pole (prázdný seznam = v pořádku). `codes` je seznam platných kódů opatření. */
export function fieldErrors(f: Field, a: Answers, codes?: ReadonlySet<string>): string | null {
  if (!isVisible(f, a)) return null;
  const v = a[f.id];
  if (f.type === "multi" || f.type === "codes") {
    const xs = list(v);
    if (f.required && xs.length === 0) return f.type === "codes" ? "Vyberte aspoň jedno opatření." : "Vyberte aspoň jednu možnost.";
    if (xs.length > f.max) return `Vyberte nejvýš ${f.max}.`;
    if (f.type === "multi" && xs.some((x) => !f.options?.some((o) => o.v === x))) return "Neplatná volba.";
    if (f.type === "codes" && codes && xs.some((x) => !codes.has(x))) return "Vyberte opatření ze seznamu.";
    return null;
  }
  const s = text(v);
  if (f.type === "select" || f.type === "radio") {
    if (!s) return f.required ? "Vyberte jednu možnost." : null;
    return f.options?.some((o) => o.v === s) ? null : "Neplatná volba.";
  }
  if (!s) return f.required ? "Toto pole je povinné." : null;
  if (f.min && s.length < f.min) return `Napište prosím víc (aspoň ${f.min} znaků, teď ${s.length}).`;
  if (s.length > f.max) return `Text je příliš dlouhý (nejvýš ${f.max} znaků).`;
  if (f.type === "email" && !EMAIL_RE.test(s)) return "Zadejte platný e-mail.";
  const links = (s.match(LINK_RE) ?? []).length;
  const maxLinks = f.maxLinks ?? DEFAULT_MAX_LINKS;
  if (links > maxLinks) return f.id === "sources" ? `Uveďte nejvýš ${maxLinks} odkazů.` : `Nejvýš ${maxLinks} odkazy; další zdroje uveďte v kroku „Z čeho vycházíte“.`;
  return null;
}

/** Chyby celého kroku podle id pole. */
export function stepErrors(step: Step, a: Answers, codes?: ReadonlySet<string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of step.fields) {
    const e = fieldErrors(f, a, codes);
    if (e) out[f.id] = e;
  }
  return out;
}

/**
 * Odpovědi zbavené neznámých polí, skrytých polí a přebytečných mezer. Na serveru se ukládá jen
 * výsledek této funkce.
 */
export function cleanAnswers(raw: unknown): Answers {
  const a = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: Answers = {};
  for (const [id, f] of FIELDS) {
    const v = a[id];
    if (f.type === "multi" || f.type === "codes") {
      const xs = [...new Set(list(v).map((x) => x.trim()).filter(Boolean))].slice(0, 30);
      if (xs.length) out[id] = xs;
    } else {
      const s = text(v).slice(0, f.max + 100);
      if (s) out[id] = s;
    }
  }
  for (const [id, f] of FIELDS) if (!isVisible(f, out)) delete out[id];
  return out;
}

const labelOf = (f: Field, v: string) => f.options?.find((o) => o.v === v)?.l ?? v;

/** Odpověď pole čitelně (volby názvem, kódy s názvem opatření). */
export function answerText(f: Field, a: Answers, codeLabel?: (code: string) => string | undefined): string {
  const v = a[f.id];
  if (Array.isArray(v)) return v.map((x) => (f.type === "codes" ? `${x}${codeLabel?.(x) ? ` ${codeLabel(x)}` : ""}` : labelOf(f, x))).join(f.type === "codes" ? "; " : ", ");
  return v ? (f.options ? labelOf(f, v) : v) : "";
}

/** Celý návrh jako Markdown pro resortní tým (bez jména a e-mailu, ty jsou ve vlastních polích). */
export function proposalMarkdown(a: Answers, codeLabel?: (code: string) => string | undefined): string {
  const parts: string[] = [`# Návrh nového opatření: ${text(a.title)}`];
  for (const step of STEPS) {
    if (step.id === "kontakt") continue;
    const lines = step.fields
      .filter((f) => isVisible(f, a) && a[f.id] !== undefined && f.id !== "title")
      .map((f) => {
        const t = answerText(f, a, codeLabel);
        return f.type === "textarea" ? `**${f.label}**\n${t}` : `**${f.label}** ${t}`;
      });
    if (lines.length) parts.push(`## ${step.title}`, ...lines);
  }
  const role = FIELDS.get("role");
  if (role && a.role) parts.push(`## O navrhovateli`, `**${role.label}** ${answerText(role, a)}`);
  return parts.join("\n\n");
}

/** Kódy opatření studie, na které návrh odkazuje (úprava, závislosti, ovlivněná opatření). */
export function proposalCodes(a: Answers): string[] {
  return [...new Set(["relatedCodes", "dependsOn", "affects"].flatMap((k) => list(a[k])))];
}
