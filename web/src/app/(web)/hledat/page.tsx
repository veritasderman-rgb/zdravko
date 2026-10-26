import { Container, Eyebrow } from "@/components/web/ui";
import { metaFor } from "@/lib/seo";
import { SearchClient } from "./search-client";

// Výsledky hledání do vyhledávačů nepatří; stránka se jen prochází kvůli odkazům.
export const metadata = metaFor("/hledat", "Hledat na webu", "Hledání na webu Zdraví blíž lidem: stránky, časté otázky, slovníček, čísla, oblasti Manifestu a celý text studie.", {
  robots: { index: false, follow: true },
});

export default function HledatPage() {
  return (
    <section className="pb-16 pt-8 sm:pt-14">
      <Container>
        <Eyebrow>Hledat</Eyebrow>
        <h1 className="mt-3.5 text-balance font-serif text-[38px] font-semibold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[52px]">Hledat na webu a ve studii</h1>
        <p className="mt-4 max-w-[38em] text-[19px] leading-normal text-muted">
          Prohledá stránky webu, časté otázky, slovníček, čísla se zdroji, oblasti Manifestu a celý text studie. Diakritiku psát nemusíte.
        </p>
        <SearchClient />
      </Container>
    </section>
  );
}
