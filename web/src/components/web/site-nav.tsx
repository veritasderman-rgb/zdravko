import Link from "next/link";

export const SITE_LINKS = [
  { href: "/proc", label: "Proč" },
  { href: "/co-chceme", label: "Co chceme" },
  { href: "/jak", label: "Jak a kdy" },
  { href: "/penize", label: "Peníze" },
  { href: "/pro-koho", label: "Pro koho" },
  { href: "/otazky", label: "Otázky" },
  { href: "/studie", label: "Studie" },
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
        <div className="ml-auto flex items-center gap-4 text-xs text-muted">
          <Link href="/slovnicek" className="hover:text-foreground">Slovníček</Link>
          <Link href="/rt" className="hover:text-foreground">Pro resortní tým</Link>
        </div>
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
          <p className="mt-1">Plán reformy zdravotnictví, verze 3 ke konzultaci z 20. 10. 2026. Josef Pavlovic, resortní tým Zdravotnictví. Je to návrh k diskusi, ne program strany.</p>
        </div>
        <div>
          <div className="font-semibold text-foreground">Připomínky</div>
          <p className="mt-1">Představujeme plán a hledáme pro něj podporu. První kolo připomínek končí 31. 3. 2027. Ke každé připomínce napíšeme, jak jsme s ní naložili, a zveřejníme to před červnem 2028. <Link href="/studie" className="underline">Plné znění studie</Link> · <Link href="/slovnicek" className="underline">Slovníček pojmů</Link></p>
        </div>
        <div>
          <div className="font-semibold text-foreground">Střet zájmů</div>
          <p className="mt-1">Autor plánu je členem Správní rady VZP, členem ekonomické rady PEER a autorem HSPA Monitoru. O smlouvě na zkoušku rozhoduje vedení VZP, výsledky hodnotí nezávislý hodnotitel a autor se z hlasování o zkoušce vyloučí.</p>
        </div>
      </div>
    </footer>
  );
}
