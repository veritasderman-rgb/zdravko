import Link from "next/link";
import type { ReactNode } from "react";
import { FIVE_CHANGES, GATES, KEY_SUBJECTS, META, NOT_DOING, PHASES, STEPS_2029 } from "@/content/reforma";
import { Icon, type IconName } from "./icons";
import { Chip, Eyebrow } from "./ui";

/**
 * Sdílené obsahové bloky veřejného webu, směr B (zadání kap. 5.3).
 * Serverové; klientské části (PatientJourney, Stepper, RangeInput, CalcOutput) jsou ve vlastních
 * souborech a odsud se jen re-exportují.
 */

export { Icon, type IconName } from "./icons";
export { PatientJourney } from "./patient-journey";
export { CalcOutput, RangeInput, Stepper } from "./inputs";

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const cs = (n: number) => n.toLocaleString("cs-CZ");

// ---------------------------------------------------------------------------
// Waffle
// ---------------------------------------------------------------------------

/**
 * Mřížka 10 × 10 (nebo `cells` buněk po deseti). Hodnoty jsou procenta a zaokrouhlí se na celé
 * buňky (29,7 → 30); přesná čísla patří do `label` skupiny, který se vypíše v legendě.
 * Zbytek je forest-mid na tmavém pásu, jinak stone.
 */
export function Waffle({
  groups,
  cells = 100,
  onDark = false,
  label,
  legend = true,
  cell,
}: {
  groups: { value: number; color: string; label: string }[];
  cells?: number;
  onDark?: boolean;
  label: string;
  legend?: boolean;
  cell?: number;
}) {
  const rest = onDark ? "#2E4F46" : "#EAE3D6";
  const colors: string[] = [];
  for (const g of groups) {
    const n = Math.round((g.value / 100) * cells);
    for (let i = 0; i < n && colors.length < cells; i++) colors.push(g.color);
  }
  const used = colors.length;
  while (colors.length < cells) colors.push(rest);

  const fixed = cell !== undefined;
  const gap = fixed ? Math.max(2, Math.round(cell * 0.18)) : undefined;

  return (
    <figure className="m-0 flex flex-col items-start gap-4 sm:gap-[18px]">
      <div
        role="img"
        aria-label={label}
        className={cx("grid w-max grid-cols-10", !fixed && "gap-1 sm:gap-1.5")}
        style={fixed ? { gap } : undefined}
      >
        {colors.map((c, i) => (
          <span
            key={i}
            className={cx("block", !fixed && "size-7 rounded-[5px] sm:size-[34px] sm:rounded-[6px]")}
            style={fixed ? { background: c, width: cell, height: cell, borderRadius: Math.max(3, Math.round(cell * 0.18)) } : { background: c }}
          />
        ))}
      </div>
      {legend && (
        <figcaption className={cx("flex flex-col gap-1 text-[15px] sm:flex-row sm:flex-wrap sm:gap-x-6 sm:text-base", onDark ? "text-on-dark-muted" : "text-muted")}>
          {groups.map((g) => (
            <span key={g.label} className="flex items-center gap-2">
              <span aria-hidden="true" className="size-3 shrink-0 rounded-[3px] sm:size-3.5" style={{ background: g.color }} />
              {g.label}
            </span>
          ))}
          {used < cells && (
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className={cx("size-3 shrink-0 rounded-[3px] sm:size-3.5", !onDark && "border border-line-strong")} style={{ background: rest }} />
              vše ostatní
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

// ---------------------------------------------------------------------------
// BigNumber
// ---------------------------------------------------------------------------

/**
 * Velké číslo, jedna věta, zdroj. S `range` se pod číslem zobrazí osa s pásmem rozpětí (sage)
 * a značkou hodnoty (forest). `small` = až tři menší čísla pod tím.
 */
export function BigNumber({
  value,
  text,
  source,
  range,
  small,
}: {
  value: string;
  text: string;
  source?: string;
  range?: { min: number; max: number; value: number; scaleMax: number; unit: string; minLabel?: string; maxLabel?: string };
  small?: { value: string; text: string }[];
}) {
  return (
    <div className="flex flex-col gap-3.5 sm:gap-[18px]">
      <p className="font-serif text-[56px] font-semibold leading-none tracking-[-0.02em] [font-variant-numeric:lining-nums_tabular-nums] lg:text-[84px]">{value}</p>
      <p className="max-w-[34em] text-lg sm:text-[22px] sm:leading-normal">{text}</p>
      {range && <RangeAxis {...range} />}
      {small && small.length > 0 && (
        <ul className="mt-2.5 grid grid-cols-3 gap-4 sm:mt-[18px]">
          {small.map((s) => (
            <li key={s.value} className="flex flex-col gap-1">
              <span className="font-serif text-[26px] font-semibold leading-tight sm:text-[34px]">{s.value}</span>
              <span className="text-[15px] leading-snug text-muted sm:text-base">{s.text}</span>
            </li>
          ))}
        </ul>
      )}
      {source && <p className="text-sm text-muted sm:text-[15px]">{/^zdroj/i.test(source) ? source : `Zdroj: ${source}`}</p>}
    </div>
  );
}

function RangeAxis({
  min,
  max,
  value,
  scaleMax,
  unit,
  minLabel,
  maxLabel,
}: {
  min: number;
  max: number;
  value: number;
  scaleMax: number;
  unit: string;
  minLabel?: string;
  maxLabel?: string;
}) {
  const pct = (v: number) => `${Math.min(100, Math.max(0, (v / scaleMax) * 100))}%`;
  return (
    <div
      role="img"
      aria-label={`Odhad ${cs(value)} ${unit}, rozpětí ${cs(min)} až ${cs(max)} ${unit}, na ose od 0 do ${cs(scaleMax)}`}
      className="relative mt-2 h-[52px] sm:h-14"
    >
      <span className="absolute inset-x-0 top-5 h-0.5 bg-line-strong sm:top-[22px]" />
      <span className="absolute top-3 h-[18px] rounded-full bg-sage sm:top-3.5" style={{ left: pct(min), width: `calc(${pct(max)} - ${pct(min)})` }} />
      <span
        className="absolute top-1.5 -ml-[15px] size-[30px] rounded-full border-4 border-paper bg-forest sm:top-2"
        style={{ left: pct(value) }}
      />
      <span className="absolute left-0 top-9 text-sm text-muted sm:top-10 sm:text-[15px]">0</span>
      <span className="absolute top-9 -translate-x-1/2 text-sm text-muted sm:top-10 sm:text-[15px]" style={{ left: pct(min) }}>
        {minLabel ?? cs(min)}
      </span>
      <span className="absolute top-9 -translate-x-1/2 whitespace-nowrap text-sm text-muted sm:top-10 sm:text-[15px]" style={{ left: pct(max) }}>
        {maxLabel ?? `${cs(max)} ${unit}`}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AudienceEntry
// ---------------------------------------------------------------------------

/** Rozcestník „Začněte tam, kde jste vy“: tři karty, celá karta je odkaz. */
export function AudienceEntry({ items }: { items: { title: string; text: string; href: string; icon: IconName }[] }) {
  return (
    <ul className="grid gap-2.5 sm:gap-4 md:grid-cols-3">
      {items.map((it) => (
        <li key={it.href + it.title} className="flex">
          <Link
            href={it.href}
            className="group flex w-full items-center gap-3.5 rounded-card border border-line bg-paper p-4 text-ink no-underline transition-colors hover:border-forest sm:gap-[18px] sm:px-6 sm:py-[22px]"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage-soft text-forest sm:size-14">
              <Icon name={it.icon} size={28} className="size-[22px] sm:size-7" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-lg font-bold leading-snug text-forest underline underline-offset-4 group-hover:decoration-2 sm:text-xl">{it.title}</span>
              <span className="text-base leading-snug text-muted sm:text-[17px]">{it.text}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// ChangeRow
// ---------------------------------------------------------------------------

/** Pět změn jako seznam řádků: serif číslice, nadpis, jedna věta, ikona v kruhu a šipka. Celý řádek je odkaz. */
export function ChangeRow({ items, hrefBase = "/co-chceme#zmena-" }: { items: typeof FIVE_CHANGES; hrefBase?: string }) {
  return (
    <ol className="border-t border-line-strong">
      {items.map((c) => (
        <li key={c.n}>
          <Link
            href={`${hrefBase}${c.n}`}
            className="group grid grid-cols-[32px_minmax(0,1fr)] items-start gap-3.5 border-b border-line-strong py-[18px] text-ink no-underline transition-colors hover:bg-paper md:grid-cols-[80px_minmax(0,1fr)_72px_40px] md:items-center md:gap-6 md:px-3 md:py-7"
          >
            <span aria-hidden="true" className="font-serif text-[36px] font-semibold leading-none text-forest md:text-[56px]">
              {c.n}
            </span>
            <span className="flex flex-col gap-1 md:gap-1.5">
              <span className="font-serif text-[22px] font-semibold leading-[1.22] underline-offset-[6px] group-hover:underline md:text-[30px] md:leading-[1.2]">
                <span className="sr-only">{c.n}. </span>
                {c.title}
              </span>
              <span className="text-base text-muted md:text-[19px]">{c.short}</span>
            </span>
            <span className="hidden size-16 place-items-center rounded-full bg-sage-soft text-forest md:grid">
              <Icon name={c.icon} size={30} />
            </span>
            <Icon name="arrow" size={28} className="hidden text-forest md:block" />
          </Link>
        </li>
      ))}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// FearFact
// ---------------------------------------------------------------------------

// Pro úvod se pod odpovědí bere první věta NOT_DOING.text. Výjimka: u „Nikoho nenutíme“
// odpovídá na obavu „Budu potřebovat doporučení?“ až třetí věta, proto se bere ta.
const FEAR_SENTENCE: Record<string, number> = { "Nikoho nenutíme": 2 };

const ABBREVIATIONS = new Set(["mld", "mil", "tis", "tzv", "např", "tj", "č"]);

function sentences(text: string) {
  // Dělí tam, kde po tečce začíná velké písmeno; zkratky („5 mld. Kč“) větu neukončí.
  const out: string[] = [];
  const re = /[.!?]\s+(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ])/g;
  let start = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    const word = text.slice(start, m.index).split(" ").pop() ?? "";
    if (ABBREVIATIONS.has(word)) continue;
    out.push(text.slice(start, m.index + 1).trim());
    start = m.index + m[0].length;
  }
  out.push(text.slice(start).trim());
  return out;
}

/** Co reforma nedělá: obava (serif kurzíva) a odpověď. Na úvodu krátká odpověď a jedna věta, s `full` celý text. */
export function FearFact({ full = false }: { full?: boolean }) {
  return (
    <ul className="grid border-t border-line-strong lg:grid-cols-2 lg:gap-x-14">
      {NOT_DOING.map((n) => {
        const all = sentences(n.text);
        const line = all[FEAR_SENTENCE[n.title] ?? 0] ?? all[0];
        return (
          <li
            key={n.title}
            className="flex flex-col gap-1 border-b border-line-strong py-[18px] sm:grid sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-6 sm:py-[26px]"
          >
            <p className="font-serif text-[19px] italic leading-snug text-muted sm:text-[21px]">{n.fear}</p>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold leading-snug sm:text-xl">{full ? n.title : n.short}</p>
              <p className={cx("text-base text-ink-2 sm:text-lg", !full && "hidden sm:block")}>{full ? n.text : line}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// MilestoneColumns
// ---------------------------------------------------------------------------

const gate = (id: string) => GATES.find((g) => g.id === id);

// Čtyři milníky pro úvod. Názvy a data z PHASES, GATES, STEPS_2029 a META; čísla jsou v reforma.ts
// (MILESTONES, STEPS_2029, KEY_NUMBERS).
const MILESTONE_COLUMNS = [
  {
    year: "2027",
    title: PHASES[0].name,
    text: `Připomínky do ${META.deadline}, devět kulatých stolů.`,
    gate: `${gate("B1")?.id} · ${gate("B1")?.name} · 6/2028`,
  },
  {
    year: "2028",
    title: STEPS_2029[1]?.title ?? "Zkouška ve třech regionech",
    text: "Město, venkov a region bez lékařů, 100 až 150 tisíc lidí.",
    gate: `${gate("B2")?.id} · ${gate("B2")?.name}`,
  },
  {
    year: "2031–32",
    title: "Peníze a zákony platí",
    text: "Daně od 1. 1. 2031, zákon o primární péči od 1. 1. 2032.",
    gate: `${gate("B3")?.id} · ${gate("B3")?.name} · 12/2031`,
  },
  {
    year: "2038",
    title: "Reforma naplno",
    text: "520 týmů, 4 000 sester navíc, 8 000 lůžek s novým účelem.",
    gate: `${gate("B4")?.id} · Hodnocení · 2033`,
  },
];

/** Časová osa na úvodu: čtyři sloupce (desktop) nebo svislý seznam s levou linkou (mobil). */
export function MilestoneColumns() {
  return (
    <ol className="flex flex-col gap-[22px] border-l-2 border-forest pl-[18px] lg:grid lg:grid-cols-4 lg:gap-0 lg:border-l-0 lg:border-t-2 lg:pl-0">
      {MILESTONE_COLUMNS.map((m, i) => (
        <li key={m.year} className={cx("flex flex-col gap-1 lg:gap-2.5 lg:p-6", i === 0 ? "lg:pl-0" : "lg:border-l lg:border-line")}>
          <span className="font-serif text-[30px] font-semibold leading-tight text-forest lg:text-[40px]">{m.year}</span>
          <span className="text-[17px] font-bold leading-snug sm:text-lg">{m.title}</span>
          <span className="text-base text-muted sm:text-[17px]">{m.text}</span>
          <Chip variant="gate" className="mt-1.5">
            {m.gate}
          </Chip>
        </li>
      ))}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// OrgList
// ---------------------------------------------------------------------------

/** Deset klíčových organizací (KEY_SUBJECTS) ve dvou sloupcích. */
export function OrgList() {
  return (
    <ul className="grid grid-cols-2 gap-x-5 text-base leading-snug sm:gap-x-8 sm:text-lg">
      {KEY_SUBJECTS.map((s) => (
        <li key={s} className="border-b border-line py-3 sm:py-3.5">
          {s}
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Kalkulačky
// ---------------------------------------------------------------------------

/** Rámec kalkulačky: panel bg-sand, eyebrow „Spočítejte si“, serif otázka, vstupy a výstup (children), poznámka. */
export function CalculatorFrame({ question, children, note, eyebrow = "Spočítejte si" }: { question: string; children: ReactNode; note?: string; eyebrow?: string }) {
  return (
    <div className="flex flex-col gap-3.5 rounded-panel border border-line bg-sand p-5 sm:gap-5 sm:p-9">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h3 className="text-balance font-serif text-[22px] font-semibold leading-[1.2] sm:text-[30px]">{question}</h3>
      {children}
      {note && <p className="text-sm text-muted sm:text-[15px]">{note}</p>}
    </div>
  );
}
