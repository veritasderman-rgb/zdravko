import type { ReactNode } from "react";
import { FIVE_CHANGES, HONEST_CHANGES, INSPIRATION } from "@/content/reforma";
import { Callout, Chip, CodeRef, NextStep, PageHero, Section, TextLink } from "@/components/web/ui";
import { FearFact, PatientJourney } from "@/components/web/blocks";
import { EReferral, HealthCentre, HomeVisit, SeniorTaxi } from "@/components/web/illustrations";
import { BedWaffle, TeamOrganigram, TriageLanes } from "@/components/web/visuals";
import { TaxSplitCalculator } from "@/components/charts/calculators";

export const metadata = { title: "Co chceme" };

function Figure({ children, caption }: { children: ReactNode; caption: string }) {
  return (
    <figure className="flex flex-col gap-2.5">
      {children}
      <figcaption className="text-[16px] text-muted">{caption}</figcaption>
    </figure>
  );
}

/** Vizuál ke každé změně: ilustrace s lidmi, kde to jde, jinak schéma nebo kalkulačka. */
const VISUALS: Record<number, ReactNode> = {
  1: (
    <div className="flex flex-col gap-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Figure caption="Obecní zdravotní centrum: budova patří obci">
          <HealthCentre />
        </Figure>
        <Figure caption="Senior taxi: obec objedná odvoz k lékaři">
          <SeniorTaxi />
        </Figure>
      </div>
      <TeamOrganigram />
    </div>
  ),
  2: (
    <div className="flex flex-col gap-8">
      <Figure caption="eŽádanka: lékař označí, jak to spěchá">
        <EReferral />
      </Figure>
      <TriageLanes />
    </div>
  ),
  3: <BedWaffle />,
  4: <TaxSplitCalculator />,
  5: (
    <Figure caption="Sestra z týmu jezdí za křehkými seniory domů">
      <HomeVisit />
    </Figure>
  ),
};

const blockTitle = "text-[16px] font-bold uppercase tracking-[0.06em] text-forest";

export default function CoPage() {
  return (
    <>
      <PageHero
        eyebrow="Co chceme"
        title="Pět změn, které lidé pocítí"
        lead="Kolem roku 2038 má mít každý člověk v Česku svého lékaře a svou sestru blízko domova. Ke specialistovi se dostane podle toho, jak to spěchá. A v nemocnici na akutním lůžku leží jen tehdy, když to opravdu potřebuje."
        aside={
          <nav aria-label="Pět změn">
            <ol className="border-t border-line-strong">
              {FIVE_CHANGES.map((c) => (
                <li key={c.n}>
                  <a href={`#zmena-${c.n}`} className="group flex min-h-11 items-baseline gap-4 border-b border-line-strong py-3 text-ink">
                    <span className="w-8 shrink-0 font-serif text-[32px] font-semibold leading-none text-forest">{c.n}</span>
                    <span className="text-[18px] font-semibold leading-snug underline decoration-line-strong decoration-2 underline-offset-[5px] group-hover:decoration-forest">{c.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        }
      />

      {FIVE_CHANGES.map((c, i) => (
        <Section key={c.n} id={`zmena-${c.n}`} tone={i % 2 === 0 ? "paper" : "sand"} eyebrow={`Změna ${c.n} z 5`} title={c.title}>
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div className={i % 2 === 1 ? "lg:order-last" : ""}>{VISUALS[c.n]}</div>
            <div className="flex flex-col gap-7">
              <div>
                <h3 className={blockTitle}>Co uděláme</h3>
                <p className="mt-2 max-w-[38em] text-[19px] leading-relaxed text-ink md:text-[20px]">{c.what}</p>
              </div>
              <div className="rounded-card bg-sage-soft p-6">
                <h3 className={blockTitle}>Co to přinese</h3>
                <p className="mt-2 text-[19px] leading-relaxed text-ink md:text-[20px]">{c.brings}</p>
              </div>
              <div>
                <h3 className={blockTitle}>Kdy</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {c.when.split(" · ").map((w) => (
                    <li key={w}>
                      <Chip className="whitespace-normal text-left">{w}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="flex flex-wrap items-center gap-2 text-[16px] text-muted">
                Ve studii:
                {c.codes.map((k) => (
                  <CodeRef key={k} code={k} link={false} />
                ))}
              </p>
            </div>
          </div>
          {c.n === FIVE_CHANGES.length && (
            <div className="mt-12 max-w-[52em]">
              <Callout title="Jedno pravidlo o penězích">
                Všech pět změn drží pohromadě jedno pravidlo o penězích: stát bude platit zdravotní pojištění za děti, důchodce a studenty podle toho, kolik péče skutečně potřebují, ne podle dnešního vzorce. Nový vzorec přijme vláda s platností od 1. 1. 2031.
              </Callout>
            </div>
          )}
        </Section>
      ))}

      <Section
        id="cesta-pacienta"
        tone="paper"
        eyebrow="Cesta pacienta"
        title="Co se změní pro vás, krok za krokem"
        lead="Největší změnu pocítí dlouhodobě nemocný člověk, křehký senior a ten, kdo dnes nemá praktika. Pro zdravého třicátníka se změní málo."
      >
        <PatientJourney defaultStep={1} />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Callout title="Co se změní, i když se vám to nebude líbit">
            <ul className="flex list-disc flex-col gap-2 pl-5">
              {HONEST_CHANGES.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </Callout>
          <Callout title="Co se nezmění" tone="sage">
            Svobodná volba lékaře i pojišťovny zůstává. Ke specialistovi může každý dál i bez doporučení. O léčbě vždy rozhoduje člověk; technika zapisuje a měří, nerozhoduje.
          </Callout>
        </div>
      </Section>

      <Section
        id="co-reforma-nedela"
        eyebrow="Co reforma nedělá"
        title="Šest věcí, které se nám přisuzují a v plánu nejsou"
        lead="Každá z nich by podkopala důvěru pacientů nebo zdravotníků, bez které reforma nejde udělat."
      >
        <FearFact full />
        <p className="mt-8 text-[18px] text-ink-2">
          Podrobnosti k jednotlivým opatřením najdete v <TextLink href="/studie">plném znění studie</TextLink>.
        </p>
      </Section>

      <Section tone="paper" eyebrow="Nevymýšlíme nic nového" title="Půjčujeme si, co už jinde funguje">
        <ul className="grid gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {INSPIRATION.map((x, i) => (
            <li key={x.country} className={`flex flex-col gap-1.5 border-t-2 border-forest pt-4 sm:pr-6 ${i > 0 ? "lg:border-l lg:border-l-line lg:pl-6" : ""}`}>
              <span className="font-serif text-[24px] font-semibold leading-tight text-ink">{x.country}</span>
              <span className="text-[17px] text-muted">{x.what}</span>
            </li>
          ))}
        </ul>
      </Section>

      <NextStep title="Kdy a jak" text="Časová osa, čtyři kontrolní body a čtyři pravidla, která platí bez ohledu na to, kdo vládne." href="/jak" label="Jak a kdy" />
    </>
  );
}
