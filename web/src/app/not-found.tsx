import Link from "next/link";
import type { Metadata } from "next";
import { MORE_LINKS, SITE_LINKS, SiteFooter, SiteNav } from "@/components/web/site-nav";
import { Button, Container, Eyebrow } from "@/components/web/ui";
import { SearchForm } from "@/components/web/search-form";

export const metadata: Metadata = { title: "Stránka nenalezena", robots: { index: false } };

export default function NotFound() {
  const links = [...SITE_LINKS, ...MORE_LINKS.filter((l) => l.href !== "/hledat")];
  return (
    <>
      <SiteNav />
      <main id="obsah" className="flex-1">
        <section className="py-16 md:py-24">
          <Container className="flex flex-col items-start gap-8">
            <div className="flex flex-col items-start">
              <Eyebrow>Stránka nenalezena</Eyebrow>
              <h1 className="mt-4 max-w-[16em] text-balance font-serif text-[38px] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[52px] lg:text-[62px] lg:leading-[1.04]">
                Tuhle stránku jsme nenašli.
              </h1>
              <p className="mt-5 max-w-[34em] text-[19px] leading-normal text-muted sm:text-[22px]">
                Možná se adresa změnila, nebo v ní je překlep. Zkuste hledání, nebo pokračujte některou ze stránek níže.
              </p>
            </div>
            <SearchForm id="hledat-404" label="Hledat na webu a ve studii" placeholder="například porodnice, sestry, peníze" />
            <nav aria-label="Stránky webu" className="w-full max-w-[44em]">
              <ul className="flex flex-wrap gap-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-11 items-center rounded-full border border-line-strong bg-paper px-4 text-[16px] font-semibold text-ink hover:border-forest hover:bg-sage-soft">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Button href="/" icon="arrow">
              Na úvod
            </Button>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
