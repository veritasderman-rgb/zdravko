import { DEPS_CARE, DEPS_MONEY } from "./diagrams";
import { MAP_NODES } from "./vazby";
import { isCode } from "@/lib/codes";

/**
 * Grafy závislostí pro stránku /studie/zavislosti, v pořadí, v jakém je studie
 * uvádí. `id` odpovídá registru obrázků (src/components/study-figures); místo ve
 * studii, nadpis a okolní text stránka bere z aktuální verze v databázi.
 */
export type DependencyFigure = {
  id: string;
  /** Krátký název do rozcestníku. */
  short: string;
  /** Co graf ukazuje a jak ho číst, jednou dvěma větami. */
  what: string;
  /** Kódy opatření v grafu; každý vede na hledání ve studii. */
  codes: string[];
  /**
   * Které sousední odstavce studie ke grafu patří. Mezi dvěma grafy stojí odstavec,
   * který vysvětluje předchozí graf nebo uvádí následující; tady se to rozhoduje ručně.
   */
  context: { before: boolean; after: boolean };
};

const ORDER = ["J", "P", "B", "M", "Pil", "H", "D", "R"];
function codesOf(list: { code?: string }[]): string[] {
  const codes = [...new Set(list.map((n) => n.code).filter((c): c is string => isCode(c)))];
  const fam = (c: string) => ORDER.findIndex((f) => c.startsWith(f) && (f !== "P" || !c.startsWith("Pil")));
  return codes.sort((a, b) => fam(a) - fam(b) || a.localeCompare(b, "cs", { numeric: true }));
}

export const DEPENDENCY_FIGURES: DependencyFigure[] = [
  {
    id: "kriticka-cesta",
    short: "Kritická cesta",
    what: "Tři řetězce, peníze, primární péče a síť lůžek, a čtyři brány mezi nimi. Ukazuje pořadí kroků, ne jejich délku.",
    codes: [],
    context: { before: true, after: true },
  },
  {
    id: "zavislosti-penize-lide",
    short: "Peníze a lidé",
    what: "Co musí být hotové, než v roce 2032 naběhnou týmy sdružené péče: daně za zdraví, vzorec platby státu, sestry a noví praktici. Šipka znamená „bez A nejde B“, silná šipka leží na kritické cestě.",
    codes: codesOf(DEPS_MONEY.nodes),
    context: { before: true, after: true },
  },
  {
    id: "zavislosti-pece-sit",
    short: "Péče a síť",
    what: "Zákon o primární péči stojí na pilotu a datech, přeměna lůžek na dlouhodobé péči a krajských plánech sítě.",
    codes: codesOf(DEPS_CARE.nodes),
    context: { before: false, after: true },
  },
  {
    id: "mapa-vazeb",
    short: "Mapa vazeb v čase",
    what: "Opatření jádra, podmínky, brány a klíčové zákony na časové ose 2027–2033 a dál. Klik na opatření zvýrazní, co musí přijít dřív a co na něm stojí.",
    codes: codesOf(MAP_NODES),
    context: { before: true, after: true },
  },
  {
    id: "organigramy-pilire",
    short: "Organigramy pilířů",
    what: "Každé z 93 opatření registru pod opatřením jádra nebo podmínkou, na které stojí. Karta vede do studie.",
    codes: [],
    context: { before: true, after: false },
  },
  {
    id: "matice-vlivu",
    short: "Matice vlivů",
    what: "Které opatření hýbe kterým hlavním ukazatelem H1–H8.",
    codes: [],
    context: { before: true, after: true },
  },
];

export const DEPENDENCY_FIGURE_IDS = new Set(DEPENDENCY_FIGURES.map((f) => f.id));
