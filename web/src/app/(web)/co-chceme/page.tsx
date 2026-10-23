import Link from "next/link";
import { FIVE_CHANGES, HONEST_CHANGES, NOT_DOING, PATIENT_JOURNEY } from "@/content/reforma";
import { Card, NextLink, PageHero, Section } from "@/components/web/ui";
import { BedWaffle, TeamOrganigram, TriageLanes } from "@/components/web/visuals";
import { TaxSplitCalculator } from "@/components/charts/calculators";

export const metadata = { title: "Co chceme" };

const VISUALS: Record<number, React.ReactNode> = {
  1: <TeamOrganigram />,
  2: <TriageLanes />,
  3: <BedWaffle />,
  4: <TaxSplitCalculator />,
};

export default function CoPage() {
  return (
    <>
      <PageHero eyebrow="Co chceme" title="Pět změn, které lidé pocítí" lead="Kolem roku 2038 má mít každý člověk v Česku svého lékaře a svou sestru blízko domova. Ke specialistovi se dostane podle toho, jak to spěchá. A v nemocnici na akutním lůžku leží jen tehdy, když to opravdu potřebuje." />

      <Section title="Změna po změně">
        <ol className="space-y-6">
          {FIVE_CHANGES.map((c) => (
            <li key={c.n} className="overflow-hidden rounded-2xl border border-line bg-paper">
              <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_1fr]">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="big-number text-5xl text-accent">{c.n}</span>
                    <h3 className="display-title text-3xl md:text-4xl">{c.title}</h3>
                  </div>
                  <div className="mt-4 eyebrow text-muted">Co uděláme</div>
                  <p className="mt-1 text-base leading-relaxed">{c.what}</p>
                  <div className="mt-4 eyebrow text-muted">Co to přinese</div>
                  <p className="mt-1 text-base leading-relaxed">{c.brings}</p>
                  <div className="mt-4 rounded-lg bg-accent-soft/60 px-4 py-3 text-sm leading-relaxed">
                    <span className="eyebrow text-accent">Kdy</span>
                    <div className="mt-1">{c.when}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1 text-xs text-muted">
                    ve studii: {c.codes.map((k) => <span key={k} className="code-ref">{k}</span>)}
                  </div>
                </div>
                <div className="flex items-center">{VISUALS[c.n] ?? <HomeCareVisual />}</div>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted">
          Všech pět změn drží pohromadě jedno pravidlo o penězích: stát bude platit zdravotní pojištění za děti, důchodce a studenty podle toho, kolik péče skutečně potřebují, ne podle dnešního vzorce. Nový vzorec přijme vláda s platností od 1. 1. 2031.
        </p>
      </Section>

      <Section eyebrow="Cesta pacienta" title="Co se změní pro vás, krok za krokem" lead="Největší změnu pocítí dlouhodobě nemocný člověk, křehký senior a ten, kdo dnes nemá praktika. Pro zdravého třicátníka se změní málo.">
        <ol className="relative space-y-4 border-l-2 border-line pl-6">
          {PATIENT_JOURNEY.map((r, i) => (
            <li key={r.step} className="relative">
              <span className="absolute -left-[33px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">{i + 1}</span>
              <div className="rounded-xl border border-line bg-paper p-4">
                <div className="display-title text-xl">{r.step}</div>
                <div className="mt-2 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg bg-stone-50 p-3 text-sm leading-relaxed text-muted"><span className="eyebrow text-muted">Dnes</span><div className="mt-1">{r.today}</div></div>
                  <div className="rounded-lg bg-accent-soft/50 p-3 text-sm leading-relaxed"><span className="eyebrow text-accent">Po reformě</span><div className="mt-1">{r.after}</div></div>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Card title="Co se změní, i když se vám to nebude líbit" tone="warm">
            <ul className="list-disc space-y-1 pl-5">
              {HONEST_CHANGES.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </Card>
          <Card title="Co se nezmění" tone="accent">
            Svobodná volba lékaře i pojišťovny zůstává. Ke specialistovi může každý dál i bez doporučení. O léčbě vždy rozhoduje člověk; technika zapisuje a měří, nerozhoduje.
          </Card>
        </div>
      </Section>

      <Section eyebrow="Co reforma nedělá" title="Šest věcí, které se nám přisuzují a v plánu nejsou" lead="Každá z nich by podkopala důvěru pacientů nebo zdravotníků, bez které reforma nejde udělat.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NOT_DOING.map((n) => <Card key={n.title} title={n.title}>{n.text}</Card>)}
        </div>
        <p className="mt-4 text-sm text-muted">
          Podrobnosti k jednotlivým opatřením najdete v <Link href="/studie" className="underline">plném znění studie</Link>.
        </p>
      </Section>

      <div className="mx-auto max-w-[1100px] px-4">
        <NextLink href="/jak" title="Jak a kdy" text="Časová osa, čtyři kontrolní body a čtyři pravidla, která platí bez ohledu na to, kdo vládne." />
      </div>
    </>
  );
}

function HomeCareVisual() {
  const steps = ["Sestra přijede domů", "Domácí péče na delší dobu", "Rozhovor o plánu péče", "Paliativní tým v okrese", "Dříve vyslovené přání v registru"];
  return (
    <ol className="w-full space-y-2">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-3 rounded-lg border border-line bg-paper px-4 py-3 text-sm">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1baf7a] text-xs font-semibold text-white">{i + 1}</span>
          {s}
        </li>
      ))}
    </ol>
  );
}
