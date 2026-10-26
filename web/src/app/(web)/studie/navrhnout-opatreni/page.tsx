import Link from "next/link";
import { Callout, Container, Eyebrow, TextLink } from "@/components/web/ui";
import { JsonLd } from "@/components/json-ld";
import { REGISTRY } from "@/content/registr";
import { STEPS } from "@/content/navrh-opatreni";
import { loadStudy } from "@/lib/study-data";
import { breadcrumbs, pageMeta } from "@/lib/seo";
import { ProposalWizard } from "./proposal-wizard";

// Stránka se drží v mezipaměti; z databáze potřebuje jen číslo aktuální verze studie.
export const revalidate = 300;

export const metadata = pageMeta("/studie/navrhnout-opatreni");

const GOOD = [
  ["Problém", "kdo ho má, jak se projevuje a jak je velký"],
  ["Konkrétní změnu", "kdo začne co dělat a za co se bude platit"],
  ["Nástroj a odpovědnost", "zákon, vyhláška, smlouva nebo metodika a kdo ji provede"],
  ["Termín", "kdy může začít platit a co musí být hotové předtím"],
  ["Návaznosti", "na která opatření studie navazuje a která ovlivní"],
  ["Peníze a přínos", "řád nákladů, kdo zaplatí a podle čeho poznáme, že funguje"],
];

export default async function NavrhnoutOpatreniPage() {
  let study: Awaited<ReturnType<typeof loadStudy>> = null;
  try {
    study = await loadStudy();
  } catch (e) {
    console.error("Návrh opatření: databáze není dostupná", e);
  }

  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Studie", path: "/studie" }, { name: "Navrhnout nové opatření", path: "/studie/navrhnout-opatreni" }])} />
      <section className="pb-10 pt-8 sm:pt-14">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
          <div className="flex flex-col items-start">
            <nav aria-label="Drobečková navigace" className="text-[16px] text-muted">
              <ol className="flex flex-wrap items-center gap-x-2">
                <li>
                  <Link href="/studie" className="underline hover:text-forest">
                    Studie
                  </Link>
                </li>
                <li aria-hidden>›</li>
                <li aria-current="page" className="text-ink">
                  Navrhnout nové opatření
                </li>
              </ol>
            </nav>
            <Eyebrow className="mt-6">Vaše návrhy</Eyebrow>
            <h1 className="mt-3.5 text-balance font-serif text-[38px] font-semibold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[52px]">Navrhněte nové opatření</h1>
            <p className="mt-5 max-w-[34em] text-[19px] leading-normal text-muted sm:text-[22px]">
              Chybí v plánu něco důležitého? Průvodce vás provede {STEPS.length} kroky a závěrečným souhrnem, abychom z návrhu poznali, co chcete změnit a jak to zavést. Zabere to asi 20 až 30 minut; rozpracovaný návrh se průběžně ukládá ve vašem prohlížeči.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-panel border border-line bg-paper p-5 sm:p-6">
              <h2 className="font-serif text-[22px] font-semibold text-ink">Co potřebujeme z návrhu poznat</h2>
              <ul className="mt-3 flex flex-col gap-2 text-[17px] leading-snug">
                {GOOD.map(([t, d]) => (
                  <li key={t} className="flex gap-2.5">
                    <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-forest" />
                    <span>
                      <span className="font-semibold text-ink">{t}:</span> <span className="text-ink-2">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[16px] text-muted">Co nevíte, přeskočte nebo zvolte „Nevím“. Návrh posoudíme i tak.</p>
            </div>
          </div>
        </Container>
      </section>

      <section aria-label="Formulář návrhu" className="border-t border-line bg-paper py-10 md:py-14">
        <Container className="max-w-[56rem]">
          {study ? (
            <ProposalWizard documentId={study.doc.id} versionId={study.version.id} measures={REGISTRY} />
          ) : (
            <Callout title="Formulář se teď nedá načíst">Databáze studie teď neodpovídá. Zkuste to prosím za chvíli znovu; rozpracovaný návrh v prohlížeči zůstane.</Callout>
          )}
        </Container>
      </section>

      <section aria-labelledby="co-dal" className="border-t border-line py-10 md:py-14">
        <Container className="grid gap-6 md:grid-cols-3">
          <h2 id="co-dal" className="font-serif text-[26px] font-semibold leading-tight text-ink md:col-span-3">
            Co se s návrhem stane
          </h2>
          {[
            ["Potvrdíte ho e-mailem", "Pošleme vám odkaz k potvrzení a kopii návrhu. Resortní tým uvidí jen potvrzené návrhy."],
            ["Tým ho posoudí", "Stejně jako opatření studie: jestli řeší skutečný problém, čím ho zavést, kdy, s jakými náklady a vazbami. Když něco chybí, ozveme se."],
            ["Dozvíte se výsledek", "Převzaté návrhy se objeví v další verzi studie. Ve veřejném vypořádání uvádíme jen názvy organizací, nikdy jména lidí."],
          ].map(([t, d], i) => (
            <div key={t} className="flex flex-col gap-2 border-t-2 border-forest pt-4">
              <span className="font-serif text-[28px] font-semibold text-forest">{i + 1}</span>
              <h3 className="text-[19px] font-bold text-ink">{t}</h3>
              <p className="text-[17px] leading-relaxed text-ink-2">{d}</p>
            </div>
          ))}
          <p className="text-[17px] text-ink-2 md:col-span-3">
            Připomínku ke konkrétnímu odstavci napíšete přímo v textu <TextLink href="/studie">studie</TextLink>.
          </p>
        </Container>
      </section>
    </>
  );
}
