import { CONFLICT, FAQ } from "@/content/reforma";
import { Callout, NextStep, PageHero, Section, TextLink } from "@/components/web/ui";
import { slug } from "../_lib/slug";
import { CopyLinkButton, OpenFromHash } from "./faq-tools";

export const metadata = { title: "Časté otázky" };

const ITEMS = FAQ.map((f) => ({ ...f, id: slug(f.q) }));

export default function OtazkyPage() {
  return (
    <>
      <PageHero
        eyebrow="Otázky"
        title="Osm otázek, které slyšíme nejčastěji"
        lead="Odpovědi se opírají o čísla studie, ne o přání. Pojmy vysvětluje slovníček."
        aside={
          <nav aria-label="Témata otázek">
            <ul className="flex flex-wrap gap-2">
              {ITEMS.map((f) => (
                <li key={f.id}>
                  <a href={`#${f.id}`} className="inline-flex min-h-11 items-center rounded-full border border-line-strong bg-paper px-4 text-[16px] font-semibold text-ink hover:border-forest hover:bg-sage-soft">
                    {f.q}
                  </a>
                </li>
              ))}
              <li>
                <a href="#stret-zajmu" className="inline-flex min-h-11 items-center rounded-full border border-line-strong bg-paper px-4 text-[16px] font-semibold text-ink hover:border-forest hover:bg-sage-soft">
                  Střet zájmů
                </a>
              </li>
            </ul>
          </nav>
        }
      />

      <Section id="odpovedi" tone="paper" title="Odpovědi">
        <OpenFromHash />
        <div className="max-w-[52em] border-t border-line-strong">
          {ITEMS.map((f, i) => (
            <details key={f.id} id={f.id} className="group scroll-mt-6 border-b border-line-strong" open={i === 0}>
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-5 font-serif text-[22px] font-semibold leading-snug text-ink md:text-[24px] [&::-webkit-details-marker]:hidden">
                {f.q}
                <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-forest transition-transform group-open:rotate-180">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <div className="flex flex-col items-start gap-4 pb-6">
                <p className="max-w-[38em] text-[19px] leading-relaxed text-ink">{f.a}</p>
                <CopyLinkButton id={f.id} />
              </div>
            </details>
          ))}
        </div>

        <div id="stret-zajmu" className="mt-12 max-w-[52em] scroll-mt-6">
          <Callout title="Střet zájmů říkáme předem">{CONFLICT}</Callout>
        </div>

        <p className="mt-10 max-w-[44em] text-[19px] leading-relaxed text-ink-2">
          Dnešní stav nefunguje a každý rok čekání ho zhoršuje. Tento plán je začátek rozhovoru, ne poslední slovo. Do voleb chceme mít dohodu s odborníky, hotové podklady zákonů a běžící zkoušku ve třech regionech. Pak budeme mít právo říct, že jsme připraveni.
        </p>
        <p className="mt-4 text-[18px] text-ink-2">
          Pojmy vysvětluje <TextLink href="/slovnicek">slovníček</TextLink>.
        </p>
      </Section>

      <NextStep title="Přečíst studii" text="Plné znění odborné studie, verze 3.1 ke konzultaci. Každé číslo na tomto webu v ní má svůj výpočet a zdroj." href="/studie" label="Číst studii" />
    </>
  );
}
