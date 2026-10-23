import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./icons";

/**
 * Základní komponenty veřejného webu, směr B (zadání kap. 5.1).
 * Všechny jsou serverové. Barva action patří jen primárnímu tlačítku.
 */

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function isExternal(href: string) {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.endsWith(".pdf");
}

/** Obsahový kontejner: max. 1200 px, boční odsazení clamp(16px, 4vw, 40px). */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-[1200px] px-[clamp(16px,4vw,40px)]", className)}>{children}</div>;
}

const BUTTON_VARIANTS = {
  primary: "min-h-[58px] w-full px-[30px] text-[19px] bg-action text-white hover:bg-action-hover sm:w-auto",
  secondary: "min-h-[52px] px-6 text-lg border-2 border-forest text-forest hover:bg-sage-soft",
  "secondary-on-dark": "min-h-[52px] px-6 text-lg border-2 border-on-dark text-on-dark hover:bg-white/10 focus-visible:outline-on-dark",
} as const;

/**
 * Tlačítko-odkaz. primary = okrová pilulka, max. jedno na obrazovku; secondary = obrys forest;
 * secondary-on-dark = obrys on-dark na tmavém pásu.
 */
export function Button({
  href,
  variant = "primary",
  icon,
  children,
  className,
  external,
}: {
  href: string;
  variant?: "primary" | "secondary" | "secondary-on-dark";
  icon?: "arrow" | "download" | "external";
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const cls = cx(
    "inline-flex items-center justify-center gap-3 rounded-full text-center font-bold leading-tight no-underline transition-colors",
    BUTTON_VARIANTS[variant],
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      {icon && <Icon name={icon} size={variant === "primary" ? 22 : 20} className="shrink-0" />}
    </>
  );
  if (external ?? isExternal(href)) {
    const newTab = external || /^(https?:)?\/\//.test(href);
    return (
      <a href={href} className={cls} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

/** Textový odkaz: vždy podtržený, forest, tučný; volitelně šipka 20 px. */
export function TextLink({
  href,
  children,
  arrow = false,
  className,
  onDark = false,
}: {
  href: string;
  children: ReactNode;
  arrow?: boolean;
  className?: string;
  onDark?: boolean;
}) {
  const cls = cx(
    "font-bold underline decoration-2 underline-offset-[5px]",
    onDark ? "text-on-dark hover:text-white" : "text-forest hover:text-ink",
    arrow && "inline-flex min-h-11 items-center gap-2.5",
    className,
  );
  const content = (
    <>
      {children}
      {arrow && <Icon name="arrow" size={20} className="shrink-0" />}
    </>
  );
  if (isExternal(href)) {
    return (
      <a href={href} className={cls}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

/** Štítek nad nadpisem: 16/700 verzálky, forest (na tmavém sage). Renderuje <span class="block">, takže jde vložit i do nadpisu. */
export function Eyebrow({ children, onDark = false, className }: { children: ReactNode; onDark?: boolean; className?: string }) {
  return (
    <span
      className={cx(
        "block text-sm font-bold uppercase leading-snug tracking-[0.06em] sm:text-base",
        onDark ? "text-sage" : "text-forest",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Čip: topic (obrys), verify („Ověřujeme“ s lupou), gate (kontrolní bod, např. „B3 · Lidé a data · 12/2031“). */
export function Chip({ variant = "topic", children, className }: { variant?: "topic" | "verify" | "gate"; children?: ReactNode; className?: string }) {
  if (variant === "verify") {
    return (
      <span className={cx("inline-flex items-center gap-1.5 rounded-full bg-verify-bg px-3 py-1 text-[15px] font-bold leading-snug text-verify-fg", className)}>
        <Icon name="search" size={16} className="shrink-0" />
        {children ?? "Ověřujeme"}
      </span>
    );
  }
  if (variant === "gate") {
    return (
      <span className={cx("inline-flex items-center gap-2 self-start rounded-full bg-ink px-3 py-1.5 text-sm font-bold leading-snug text-on-dark sm:text-[15px]", className)}>
        {children}
      </span>
    );
  }
  return (
    <span className={cx("inline-flex items-center rounded-full border border-line-strong px-3 py-1 text-[15px] leading-snug sm:text-base", className)}>
      {children}
    </span>
  );
}

/** Kód opatření (dnešní .code-ref): bg-stone, Geist Mono 14 px, rádius 6. Na veřejném webu link={false}. */
export function CodeRef({ code, link = true }: { code: string; link?: boolean }) {
  const cls = "inline-block whitespace-nowrap rounded-[6px] bg-stone px-2 py-0.5 font-mono text-sm leading-snug text-ink no-underline";
  if (!link) return <span className={cls}>{code}</span>;
  return (
    <Link href={`/kody/${code}`} className={cx(cls, "hover:underline")}>
      {code}
    </Link>
  );
}

const SECTION_TONES = {
  sand: "",
  paper: "border-y border-line bg-paper",
  dark: "tone-dark bg-forest-deep text-on-dark",
} as const;

/** Pás přes celou šíři s kontejnerem 1200 px: eyebrow, serif H2, perex a obsah. */
export function Section({
  id,
  eyebrow,
  title,
  lead,
  tone = "sand",
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  tone?: "sand" | "paper" | "dark";
  children?: ReactNode;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <section id={id} className={cx("py-12 md:py-24", SECTION_TONES[tone], className)}>
      <Container>
        <div className="flex max-w-[44em] flex-col gap-3 sm:gap-3.5">
          {eyebrow && <Eyebrow onDark={dark}>{eyebrow}</Eyebrow>}
          <h2 className="text-balance font-serif text-[28px] font-semibold leading-[1.12] tracking-[-0.01em] sm:text-[36px] lg:text-[44px] lg:leading-[1.1]">
            {title}
          </h2>
          {lead && <p className={cx("text-[19px] leading-normal sm:text-[21px]", dark ? "text-on-dark-muted" : "text-muted")}>{lead}</p>}
        </div>
        {children && <div className="mt-7 sm:mt-10">{children}</div>}
      </Container>
    </section>
  );
}

/** Hero podstránky: eyebrow, serif H1, perex, volitelně vizuál vpravo (mobil pod textem) a jedno primární CTA. Bez tmavého bloku. */
export function PageHero({
  eyebrow,
  title,
  lead,
  aside,
  cta,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  aside?: ReactNode;
  cta?: { href: string; label: string };
}) {
  return (
    <section className="pb-12 pt-8 sm:pb-16 sm:pt-16">
      <Container className={cx("grid gap-10 lg:gap-12", !!aside && "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center")}>
        <div className="flex flex-col items-start">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-3.5 text-balance font-serif text-[38px] font-semibold leading-[1.08] tracking-[-0.02em] sm:mt-5 sm:text-[52px] lg:text-[62px] lg:leading-[1.04]">
            {title}
          </h1>
          <p className="mt-4 max-w-[34em] text-pretty text-[19px] leading-normal text-muted sm:mt-6 sm:text-[22px]">{lead}</p>
          {cta && (
            <div className="mt-7 w-full sm:mt-9 sm:w-auto">
              <Button href={cta.href} icon="arrow">
                {cta.label}
              </Button>
            </div>
          )}
        </div>
        {aside && <div className="min-w-0">{aside}</div>}
      </Container>
    </section>
  );
}

/** Pruh „Další krok“ na konci každé veřejné stránky: bg-sage-soft, primární tlačítko vpravo (mobil pod textem). */
export function NextStep({ title, text, href, label }: { title: string; text: string; href: string; label: string }) {
  return (
    <section aria-labelledby="dalsi-krok" className="py-12 md:py-24">
      <Container>
        <div className="flex flex-col gap-6 rounded-band bg-sage-soft px-5 py-7 sm:px-14 sm:py-12 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex max-w-[36em] flex-col gap-2.5">
            <Eyebrow>Další krok</Eyebrow>
            <h2 id="dalsi-krok" className="text-balance font-serif text-[26px] font-semibold leading-[1.15] sm:text-[38px] sm:leading-[1.12]">
              {title}
            </h2>
            <p className="text-lg text-ink-2 sm:text-[19px]">{text}</p>
          </div>
          <Button href={href} icon="arrow" className="shrink-0">
            {label}
          </Button>
        </div>
      </Container>
    </section>
  );
}

/** Poctivá poznámka („Co se změní i k horšímu“, „Říkáme to otevřeně“): klidná, bez červené a bez barevného pruhu. */
export function Callout({ title, children, tone = "sand" }: { title: string; children: ReactNode; tone?: "sand" | "sage" }) {
  return (
    <div className={cx("flex items-start gap-4 rounded-card p-[18px] sm:gap-[18px] sm:px-8 sm:py-7", tone === "sage" ? "bg-sage-soft" : "bg-sand")}>
      <Icon name="info" size={30} className="mt-0.5 hidden shrink-0 text-forest sm:block" />
      <div className="flex flex-col gap-1.5">
        <p className="font-serif text-xl font-semibold leading-snug sm:text-2xl">{title}</p>
        <div className="text-base text-ink-2 sm:text-[19px]">{children}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LEGACY (deprecated): zachováno, dokud podstránky nepřejdou na nové bloky.
// Implementováno nad novými tokeny. Smaže koordinátor po migraci.
// ---------------------------------------------------------------------------

