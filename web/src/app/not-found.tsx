import { SiteFooter, SiteNav } from "@/components/web/site-nav";
import { Button, Container, Eyebrow } from "@/components/web/ui";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main id="obsah" className="flex-1">
        <section className="py-16 md:py-28">
          <Container className="flex flex-col items-start">
            <Eyebrow>Stránka nenalezena</Eyebrow>
            <h1 className="mt-4 max-w-[16em] text-balance font-serif text-[38px] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[52px] lg:text-[62px] lg:leading-[1.04]">
              Tuhle stránku jsme nenašli.
            </h1>
            <p className="mt-5 max-w-[34em] text-[19px] leading-normal text-muted sm:text-[22px]">
              Možná se adresa změnila, nebo v ní je překlep. Plán reformy najdete na úvodní stránce.
            </p>
            <div className="mt-8 w-full sm:w-auto">
              <Button href="/" icon="arrow">
                Na úvod
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
