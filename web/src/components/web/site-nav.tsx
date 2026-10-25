import Link from "next/link";
import { Button, Container } from "./ui";
import { SiteNavClient } from "./site-nav-client";

/** Pět hlavních položek navigace (hlavička i patička). */
export const SITE_LINKS = [
  { href: "/proc", label: "Proč" },
  { href: "/co-chceme", label: "Co chceme" },
  { href: "/jak", label: "Jak a kdy" },
  { href: "/penize", label: "Peníze" },
  { href: "/pro-koho", label: "Pro koho" },
];

/** Položky menu „Více“. */
export const MORE_LINKS = [
  { href: "/souvislosti", label: "Jak to do sebe zapadá" },
  { href: "/plan", label: "13 oblastí Manifestu" },
  { href: "/cisla", label: "Čísla a zdroje" },
  { href: "/otazky", label: "Otázky" },
  { href: "/slovnicek", label: "Slovníček" },
  { href: "/studie", label: "Studie" },
];

// Otevřená otázka 14.3 zadání: PDF studie zatím neexistuje, odkaz vede na čtečku studie.
const STUDY_PDF_HREF = "/studie.pdf";

/** Značka: kruh forest s domkem a „Zdraví blíž lidem“ v serifu. */
export function Brand() {
  return (
    <Link href="/" className="flex min-h-11 items-center gap-2.5 text-ink no-underline sm:gap-3">
      <svg viewBox="0 0 38 38" aria-hidden="true" className="size-8 shrink-0 min-[900px]:size-[38px]">
        <circle cx="19" cy="19" r="19" fill="#1F4A3D" />
        <path d="M10 20 L19 12 L28 20 M13 18 V27 H25 V18" fill="none" stroke="#F3EEE4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="19" cy="22" r="2.4" fill="#F2D29B" />
      </svg>
      <span className="whitespace-nowrap font-serif text-xl font-semibold tracking-[-0.01em] min-[900px]:text-[23px]">Zdraví blíž lidem</span>
    </Link>
  );
}

/** Hlavička veřejného webu: statická na sand, dolní linka, 84 px (mobil 64 px). */
export function SiteNav() {
  return (
    <header className="border-b border-line bg-sand">
      <Container className="flex min-h-16 items-center justify-between gap-4 min-[900px]:min-h-[84px] min-[900px]:gap-6">
        <Brand />
        <SiteNavClient links={SITE_LINKS} more={MORE_LINKS} brand={<Brand />} />
        <div className="hidden xl:block">
          <Button href="/studie" variant="secondary" className="min-h-12! whitespace-nowrap px-[22px]! text-[17px]!">
            Číst a připomínkovat studii
          </Button>
        </div>
      </Container>
    </header>
  );
}

const FOOTER_LINK = "inline-flex min-h-11 items-center text-on-dark underline decoration-1 underline-offset-4 hover:decoration-2 lg:min-h-0 lg:py-1";

function FooterNav({ id, label, links }: { id: string; label: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-labelledby={id} className="flex flex-col gap-2">
      <h2 id={id} className="text-sm font-bold uppercase tracking-[0.06em] text-sage">
        {label}
      </h2>
      <ul className="grid grid-cols-2 gap-x-4 lg:grid-cols-1 lg:gap-y-1.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className={FOOTER_LINK}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Patička na forest-deep: značka a autor, Stránky, Studie, Poctivě. */
export function SiteFooter() {
  return (
    <footer className="tone-dark bg-forest-deep text-on-dark">
      <Container className="grid gap-8 py-10 text-base sm:py-16 sm:text-[17px] md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        <div className="flex flex-col gap-3">
          <p className="font-serif text-[21px] font-semibold text-on-dark sm:text-2xl">Zdraví blíž lidem</p>
          <p className="text-on-dark-muted">Plán reformy zdravotnictví, verze 3.1 ke konzultaci, 23. 10. 2026</p>
          <p className="text-on-dark-muted">Připravil Josef Pavlovic, resortní tým Zdravotnictví. Je to návrh k diskusi, ne program strany.</p>
        </div>
        <FooterNav id="paticka-stranky" label="Stránky" links={SITE_LINKS} />
        <FooterNav
          id="paticka-studie"
          label="Studie"
          links={[
            { href: "/studie", label: "Číst studii" },
            { href: "/studie#pripominka", label: "Napsat připomínku" },
            { href: STUDY_PDF_HREF, label: "Stáhnout PDF" },
            { href: "/otazky", label: "Otázky" },
            { href: "/slovnicek", label: "Slovníček" },
          ]}
        />
        <FooterNav
          id="paticka-poctive"
          label="Poctivě"
          links={[
            { href: "/otazky#stret-zajmu", label: "Střet zájmů autora" },
            { href: "/ochrana-udaju", label: "Ochrana osobních údajů" },
            { href: "/studie", label: "Zdroje dat" },
            { href: "/vstup", label: "Přihlášení pro tým" },
          ]}
        />
      </Container>
    </footer>
  );
}
