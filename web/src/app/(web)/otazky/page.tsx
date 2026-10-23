import { CONFLICT, FAQ } from "@/content/reforma";
import { Card, NextLink, PageHero, Section } from "@/components/web/ui";

export const metadata = { title: "Časté otázky" };

export default function OtazkyPage() {
  return (
    <>
      <PageHero eyebrow="Otázky" title="Osm otázek, které slyšíme nejčastěji" lead="Odpovědi se opírají o čísla studie, ne o přání. Pojmy vysvětluje slovníček." />
      <Section title="Odpovědi">
        <div className="divide-y divide-line rounded-xl border border-line bg-paper">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-5 py-4" open={f === FAQ[0]}>
              <summary className="display-title cursor-pointer select-none text-2xl marker:text-accent">{f.q}</summary>
              <p className="mt-2 max-w-3xl text-base leading-relaxed text-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-6">
          <Card title="Střet zájmů říkáme předem" tone="warm">{CONFLICT}</Card>
        </div>
        <p className="mt-6 max-w-3xl text-base leading-relaxed">
          Dnešní stav nefunguje a každý rok čekání ho zhoršuje. Tento plán je začátek rozhovoru, ne poslední slovo. Do voleb chceme mít dohodu s odborníky, hotové podklady zákonů a běžící zkoušku ve třech regionech. Pak budeme mít právo říct, že jsme připraveni.
        </p>
      </Section>
      <div className="mx-auto max-w-[1100px] px-4">
        <NextLink href="/slovnicek" title="Slovníček pojmů" text="Primární péče, zbytečná hospitalizace, platba státu, kontrolní bod a další pojmy vysvětlené." />
      </div>
    </>
  );
}
