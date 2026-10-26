import { GLOSSARY } from "@/content/reforma";
import { NextStep, PageHero, Section } from "@/components/web/ui";
import { slug } from "../_lib/slug";
import { BackStep } from "./back-step";
import { JsonLd } from "@/components/json-ld";
import { absUrl, pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/slovnicek");

const TERMS = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "cs"));
const LETTERS = TERMS.reduce<{ letter: string; items: typeof TERMS }[]>((acc, g) => {
  const letter = g.term.charAt(0).toLocaleUpperCase("cs");
  const last = acc[acc.length - 1];
  if (last && last.letter === letter) last.items.push(g);
  else acc.push({ letter, items: [g] });
  return acc;
}, []);
const letterId = (l: string) => `pismeno-${slug(l) || l}`;

const TERMS_LD = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Slovníček pojmů reformy Zdraví blíž lidem",
  url: absUrl("/slovnicek"),
  inLanguage: "cs",
  hasDefinedTerm: TERMS.map((t) => ({ "@type": "DefinedTerm", name: t.term, description: t.text, url: `${absUrl("/slovnicek")}#${slug(t.term)}` })),
};

export default function SlovnicekPage() {
  return (
    <>
      <JsonLd data={TERMS_LD} />
      <PageHero eyebrow="Slovníček" title="Pojmy, které v plánu potkáte" lead="Snažíme se psát bez odborných výrazů. Tam, kde se jim nevyhneme, je tady vysvětlujeme." />

      <Section id="pojmy" tone="paper" title="Od primární péče po rozpočtovou radu">
        <nav aria-label="Písmena" className="mb-10">
          <ul className="flex flex-wrap gap-2">
            {LETTERS.map((l) => (
              <li key={l.letter}>
                <a
                  href={`#${letterId(l.letter)}`}
                  className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-line-strong bg-paper px-3 font-serif text-[20px] font-semibold text-forest hover:border-forest hover:bg-sage-soft"
                >
                  {l.letter}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex max-w-[52em] flex-col gap-10">
          {LETTERS.map((l) => (
            <section key={l.letter} id={letterId(l.letter)} aria-labelledby={`${letterId(l.letter)}-h`} className="scroll-mt-6">
              <h3 id={`${letterId(l.letter)}-h`} className="border-b-2 border-forest pb-2 font-serif text-[32px] font-semibold leading-none text-forest">
                {l.letter}
              </h3>
              <dl>
                {l.items.map((g) => (
                  <div key={g.term} id={slug(g.term)} className="scroll-mt-6 border-b border-line py-5">
                    <dt className="font-serif text-[22px] font-semibold leading-snug text-ink">
                      <a href={`#${slug(g.term)}`} className="inline-flex min-h-11 items-center hover:underline hover:decoration-2 hover:underline-offset-4">
                        {g.term}
                      </a>
                    </dt>
                    <dd className="mt-1.5 max-w-[38em] text-[19px] leading-relaxed text-ink-2">{g.text}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </Section>

      <BackStep>
        <NextStep title="Vraťte se ke čtení" text="Pojem máte vysvětlený. Tlačítko vás vrátí tam, odkud jste přišli; když jste přišli rovnou sem, zavede vás na úvod." href="/" label="Zpět" />
      </BackStep>
    </>
  );
}
