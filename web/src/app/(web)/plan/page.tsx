import {
  BEYOND_MANIFEST,
  MANIFEST,
  MANIFEST_AREAS,
  MANIFEST_NOTE,
  MANIFEST_NOTE_SHORT,
  manifestYear,
  type ManifestArea,
} from "@/content/manifest";
import { Callout, Chip, CodeRef, NextStep, PageHero, Section, TextLink } from "@/components/web/ui";

export const metadata = { title: "13 oblastí" };

const LAYER_LABEL = { jadro: "nosná část plánu", doprovod: "doplňkové opatření" } as const;

function FiveNumbers() {
  return (
    <div className="rounded-panel border border-line bg-paper p-6 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.06em] text-muted sm:text-base">Pět čísel, ze kterých Manifest vychází</p>
      <ul className="mt-4 divide-y divide-line">
        {MANIFEST.fiveData.map((d) => (
          <li key={d.label} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 py-3 sm:grid-cols-[7.5rem_1fr]">
            <span className="font-serif text-[28px] font-semibold leading-none tracking-[-0.01em] text-forest tabular-nums sm:text-3xl">{d.value}</span>
            <span className="text-base text-ink-2">
              {d.label}
              <span className="mt-0.5 block text-sm text-muted">
                {d.compare} · {d.source}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AreaFacts({ facts, cardClass }: { facts: ManifestArea["facts"]; cardClass: string }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {facts.map((f) => (
        <li key={f.label} className={`rounded-card border border-line p-5 ${cardClass}`}>
          <div className="font-serif text-4xl font-semibold leading-none tracking-[-0.02em] text-forest tabular-nums">{f.value}</div>
          <div className="mt-2 text-base text-ink">{f.label}</div>
          <div className="mt-1 text-sm text-muted">{f.compare}</div>
        </li>
      ))}
    </ul>
  );
}

function AreaSection({ area, tone }: { area: ManifestArea; tone: "sand" | "paper" }) {
  const cardClass = tone === "paper" ? "bg-sand" : "bg-paper";
  return (
    <Section
      id={`oblast-${area.n}`}
      eyebrow={`Oblast ${area.n} · ${LAYER_LABEL[area.layer]}`}
      title={area.title}
      lead={area.promise}
      tone={tone}
      className="scroll-mt-16"
    >
      <div className="flex flex-col gap-8 sm:gap-10">
        {area.studyArea && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Chip variant="topic">{area.layer === "jadro" ? "Nosná část plánu" : "Doplňkové opatření"}</Chip>
            <span className="text-base text-muted">Ve studii: {area.studyArea}</span>
          </div>
        )}

        <AreaFacts facts={area.facts} cardClass={cardClass} />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h3 className="font-serif text-2xl font-semibold leading-snug">Co je ve studii</h3>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {area.measures.map((m) => (
                <li key={m.code} className="flex flex-col gap-1.5 py-3 sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="shrink-0 sm:w-[5.5rem]">
                    <CodeRef code={m.code} link={false} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base text-ink sm:text-[17px]">{m.label}</span>
                    <span className="block text-sm text-muted">{m.when}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <h3 className="font-serif text-2xl font-semibold leading-snug">Kroky podle Manifestu</h3>
              <ol className="mt-4 divide-y divide-line border-y border-line">
                {area.manifestSteps.map((s) => (
                  <li key={s.year + s.text} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3">
                    <span>
                      <span className="block text-sm font-bold uppercase tracking-[0.06em] text-forest">{s.year}</span>
                      <span className="block font-serif text-lg font-semibold leading-tight text-ink">{manifestYear(s.year)}</span>
                    </span>
                    <span className="text-base text-ink-2 sm:text-[17px]">{s.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            {(area.gaps || area.dispute) && (
              <div className="flex flex-col gap-4">
                {area.gaps && (
                  <Callout title="Co z Manifestu zbývá rozpracovat" tone="sage">
                    <p>{area.gaps}</p>
                  </Callout>
                )}
                {area.dispute && (
                  <Callout title="Co je sporné" tone={tone === "paper" ? "sand" : "sage"}>
                    <p>{area.dispute}</p>
                  </Callout>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="max-w-[44em] text-base text-muted">
          <span className="font-bold text-ink-2">Kde to už funguje: </span>
          {area.inspiration}
        </p>
      </div>
    </Section>
  );
}

export default function PlanPage() {
  return (
    <>
      <PageHero
        eyebrow="Z čeho vycházíme"
        title="Třináct oblastí Manifestu a co s nimi děláme"
        lead={`${MANIFEST.intro} ${MANIFEST_NOTE_SHORT}`}
        aside={<FiveNumbers />}
      />

      <Section
        tone="paper"
        eyebrow="Jak Manifest čteme"
        title="Nosná část, doplňková opatření a roky od nástupu vlády"
        lead={MANIFEST_NOTE}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-card border border-line bg-sand p-5 sm:p-6">
            <Chip variant="topic">Nosná část plánu</Chip>
            <p className="mt-3 text-base text-ink-2 sm:text-[17px]">
              Nosná část plánu jsou opatření, bez kterých reforma nefunguje: mají zákon, termín a peníze. Patří sem tři oblasti Manifestu (6, 8 a 10): pomezí zdravotní a sociální péče, prevence a data ve službách pacienta. Jejich opatření nesou kódy{" "}
              <CodeRef code="J" link={false} />, <CodeRef code="P" link={false} /> a <CodeRef code="Pil" link={false} />.
            </p>
          </div>
          <div className="rounded-card border border-line bg-sand p-5 sm:p-6">
            <Chip variant="topic">Doplňková opatření</Chip>
            <p className="mt-3 text-base text-ink-2 sm:text-[17px]">
              Doplňková opatření jsou zbylých deset oblastí. Každá má ve studii stručný podklad s vlastním tempem a kódy <CodeRef code="M" link={false} /> (od M1.1 do M10.5). Když se jedno zdrží, nosná část jede dál, a naopak.
            </p>
          </div>
          <div className="rounded-card border border-line bg-sand p-5 sm:p-6">
            <Chip variant="topic">Rok 1 = 2030</Chip>
            <p className="mt-3 text-base text-ink-2 sm:text-[17px]">
              Manifest počítá roky od nástupu vlády. Ve studii je Rok 1 rok 2030 (základní scénář „Vláda 2030“), proto u každého kroku uvádíme i kalendářní rok: Rok 3 je 2032.
            </p>
          </div>
          <div className="rounded-card border border-line bg-sand p-5 sm:p-6">
            <Chip variant="topic">Zdroj</Chip>
            <p className="mt-3 text-base text-ink-2 sm:text-[17px]">
              {MANIFEST.title} napsali {MANIFEST.authors} a zveřejnili ho {MANIFEST.date}. Závazné je znění na zdrojové adrese.
            </p>
            <p className="mt-3 flex flex-col items-start gap-1">
              <TextLink href={MANIFEST.source} arrow>
                Celý Manifest
              </TextLink>
              <TextLink href={MANIFEST.hub} arrow>
                Stránky jednotlivých priorit
              </TextLink>
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="oblasti"
        tone="sand"
        eyebrow="Rozcestník"
        title="Třináct oblastí na jednom místě"
        lead="Kliknutím přeskočíte na oblast. Zeleně podbarvené jsou tři oblasti, které tvoří nosnou část plánu (mají zákon, termín a peníze)."
      >
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MANIFEST_AREAS.map((a) => (
            <li key={a.n}>
              <a
                href={`#oblast-${a.n}`}
                className={`flex h-full min-h-11 items-start gap-4 rounded-card border border-line p-4 text-ink no-underline transition-colors hover:border-line-strong hover:bg-sage-soft sm:p-5 ${
                  a.layer === "jadro" ? "bg-sage-soft" : "bg-paper"
                }`}
              >
                <span className="w-9 shrink-0 font-serif text-4xl font-semibold leading-none text-forest tabular-nums">{a.n}</span>
                <span className="flex min-w-0 flex-col gap-2">
                  <span className="font-serif text-xl font-semibold leading-snug">{a.title}</span>
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <Chip variant="topic">{LAYER_LABEL[a.layer]}</Chip>
                    <span className="text-sm text-muted sm:text-base">{a.measures.length} opatření</span>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </Section>

      {MANIFEST_AREAS.map((a) => (
        <AreaSection key={a.n} area={a} tone={a.n % 2 === 1 ? "paper" : "sand"} />
      ))}

      <Section
        tone="sand"
        eyebrow="Jak Manifest naplňujeme"
        title="Nástroje, kterými Manifest naplňujeme"
        lead="Manifest říká, co se má změnit a proč. Studie k tomu doplňuje, kdo to udělá, podle jakého zákona, kdy a za jaké peníze, a podle čeho poznáme, že se daří. Tohle jsou nástroje, které Manifest nepopisoval a bez kterých by jeho priority zůstaly na papíře."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {BEYOND_MANIFEST.map((b) => (
            <li key={b.title} className="rounded-card border border-line bg-paper p-5 sm:p-6">
              <h3 className="font-serif text-xl font-semibold leading-snug sm:text-2xl">{b.title}</h3>
              <p className="mt-2 text-base text-ink-2 sm:text-[17px]">{b.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <NextStep
        title="Kdy a jak"
        text="Časová osa do roku 2038 a čtyři kontrolní body."
        href="/jak"
        label="Kdy a jak"
      />
    </>
  );
}
