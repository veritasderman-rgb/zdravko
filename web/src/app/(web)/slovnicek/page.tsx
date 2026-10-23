import { GLOSSARY } from "@/content/reforma";
import { NextLink, PageHero, Section } from "@/components/web/ui";

export const metadata = { title: "Slovníček pojmů" };

export default function SlovnicekPage() {
  return (
    <>
      <PageHero eyebrow="Slovníček" title="Pojmy, které v plánu potkáte" lead="Snažíme se psát bez odborných výrazů. Tam, kde se jim nevyhneme, je tady vysvětlujeme." />
      <Section title="Od primární péče po rozpočtovou radu">
        <dl className="grid gap-3 md:grid-cols-2">
          {GLOSSARY.map((g) => (
            <div key={g.term} className="rounded-xl border border-line bg-paper p-5">
              <dt className="font-semibold">{g.term}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">{g.text}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <div className="mx-auto max-w-[1100px] px-4">
        <NextLink href="/studie" title="Plné znění studie" text="Odborná studie, verze 3 ke konzultaci, ke čtení." />
      </div>
    </>
  );
}
