import { CONFLICT, FAQ } from "@/content/reforma";
import { Card, NextLink, PageHero, Section } from "@/components/web/ui";

export const metadata = { title: "Časté otázky" };

export default function OtazkyPage() {
  return (
    <>
      <PageHero eyebrow="Otázky" title="Osm otázek, které slyšíme nejčastěji" lead="Odpovědi se opírají o čísla studie, ne o přání." />
      <Section title="Odpovědi">
        <div className="divide-y divide-line rounded-xl border border-line bg-paper">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-5 py-4" open={f === FAQ[0]}>
              <summary className="cursor-pointer select-none text-lg font-semibold leading-snug marker:text-accent">{f.q}</summary>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-6">
          <Card title="Střet zájmů říkáme předem" tone="warm">{CONFLICT}</Card>
        </div>
        <p className="mt-6 max-w-3xl text-base leading-relaxed">
          Současný stav nefunguje a každý rok čekání ho zhoršuje. Tento plán je začátek rozhovoru, ne poslední slovo. Do voleb chceme mít dohodu s odborníky, hotové zákony v šuplíku a běžící pilot. Pak budeme mít právo říct, že jsme připraveni.
        </p>
      </Section>
      <div className="mx-auto max-w-[1100px] px-4">
        <NextLink href="/" title="Zpět na úvod" text="Co, proč a jak na jedné stránce." />
      </div>
    </>
  );
}
