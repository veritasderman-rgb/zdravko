import Link from "next/link";

export const SITE_LINKS = [
  { href: "/proc", label: "Proč" },
  { href: "/co-chceme", label: "Co chceme" },
  { href: "/jak", label: "Jak a kdy" },
  { href: "/penize", label: "Peníze" },
  { href: "/pro-koho", label: "Pro koho" },
  { href: "/otazky", label: "Otázky" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-[rgba(251,250,247,0.92)] backdrop-blur">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-x-6 gap-y-1 px-4 py-3 text-sm">
        <Link href="/" className="font-semibold tracking-tight">
          Zdraví blíž lidem
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted">
          {SITE_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/rt" className="ml-auto text-xs text-muted hover:text-foreground">
          Pro resortní tým
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-paper">
      <div className="mx-auto grid max-w-[1100px] gap-6 px-4 py-10 text-sm text-muted md:grid-cols-3">
        <div>
          <div className="font-semibold text-foreground">Zdraví blíž lidem</div>
          <p className="mt-1">Plán reformy zdravotnictví, konzultační verze 3 z 20. 10. 2026. Josef Pavlovic, resortní tým Zdravotnictví. Verze 3 je konzultační dokument, ne program strany.</p>
        </div>
        <div>
          <div className="font-semibold text-foreground">Připomínky</div>
          <p className="mt-1">Představujeme plán a hledáme pro něj podporu. První kolo připomínek končí 31. 3. 2027. Každou připomínku vypořádáme písemně a vypořádání zveřejníme před červnem 2028.</p>
        </div>
        <div>
          <div className="font-semibold text-foreground">Střet zájmů</div>
          <p className="mt-1">Autor je členem Správní rady VZP, členem PEER a autorem HSPA Monitoru. O smlouvě pilotu rozhoduje vedení VZP, výsledky hodnotí nezávislý hodnotitel a autor se z hlasování o pilotu vyloučí.</p>
        </div>
      </div>
    </footer>
  );
}
