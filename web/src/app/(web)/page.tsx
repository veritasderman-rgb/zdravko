import { AUDIENCES, FIVE_CHANGES, GP_DECLINE, HONEST_CHANGES, KEY_NUMBERS, SPENDING_SHARE } from "@/content/reforma";
import { AudienceEntry, BigNumber, CalculatorFrame, ChangeRow, FearFact, MilestoneColumns, OrgList, PatientJourney, Waffle } from "@/components/web/blocks";
import { HomeWineCalculator } from "@/components/web/home-wine-calculator";
import { HomeVisit } from "@/components/web/illustrations";
import { ManifestStrip } from "@/components/web/manifest-strip";
import { Button, Callout, Container, Eyebrow, NextStep, Section, TextLink } from "@/components/web/ui";

// Barvy waffle a obarvených čísel ve výroku (stejné jako SERIES[0], SERIES[1] a ON_DARK v charts/theme.ts).
const BLUE = "#2A78D6";
const ORANGE = "#EB6834";
const BLUE_TEXT = "#8FBCF2";
const ORANGE_TEXT = "#F4A27E";

const ACUTE = SPENDING_SHARE.rows.find((r) => r.label.startsWith("Akutní"))?.value ?? 29.7;
const GP_ADULT = SPENDING_SHARE.rows.find((r) => r.label === "Praktici pro dospělé")?.value ?? 4.3;
const kc = (v: number) => `${v.toFixed(2).replace(".", ",")} Kč`;
const pct = (v: number) => `${v.toLocaleString("cs-CZ")} %`;
// „v roce 2035 jich bude 3 900 až 4 500 místo dnešních 5 500“ z titulku GP_DECLINE
const GP_FUTURE = GP_DECLINE.title.split(": ")[1] ?? "";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="pb-6 pt-8 sm:pb-14 sm:pt-16">
        <Container className="grid items-center gap-3 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col items-start">
            <Eyebrow>
              <span className="sm:hidden">Plán reformy · verze 3 ke konzultaci</span>
              <span className="hidden sm:inline">Plán reformy zdravotnictví · verze 3 ke konzultaci</span>
            </Eyebrow>
            <h1 className="mt-3.5 text-balance font-serif text-[38px] font-semibold leading-[1.08] tracking-[-0.02em] sm:mt-5 sm:text-[52px] lg:text-[62px] lg:leading-[1.04]">
              Každý člověk má mít svého lékaře a svou sestru blízko domova.
            </h1>
            <p className="mt-4 max-w-[34em] text-pretty text-[19px] leading-normal text-muted sm:mt-[26px] sm:text-[22px]">
              Péče o dlouhodobě nemocné a staré lidi se přesune z nemocnic blíž k nim. Nemocnice dostanou jistou roli, prevence stálé peníze.
            </p>
            <div className="mt-6 flex w-full flex-col items-stretch gap-1.5 sm:mt-9 sm:w-auto sm:flex-row sm:items-center sm:gap-7">
              <Button href="/co-chceme" icon="arrow">
                Co se změní pro mě
              </Button>
              <TextLink href="/proc" className="inline-flex min-h-12 items-center justify-center">
                Proč to potřebujeme
              </TextLink>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[560px] lg:max-w-[520px]">
            <HomeVisit className="hidden lg:block" />
            <HomeVisit crop className="mt-3 lg:hidden" />
          </div>
        </Container>
      </section>

      {/* 2. Začněte tam, kde jste vy */}
      <section aria-labelledby="zacnete" className="pb-10 pt-5 sm:pb-[72px] sm:pt-0">
        <Container className="flex flex-col gap-3 sm:gap-[18px]">
          <h2 id="zacnete" className="text-base font-bold text-muted sm:text-lg">
            Začněte tam, kde jste vy
          </h2>
          <AudienceEntry items={AUDIENCES} />
        </Container>
      </section>

      {/* 3. Proč */}
      <section aria-labelledby="proc-vyrok" className="tone-dark bg-forest-deep py-12 text-on-dark md:py-24">
        <Container className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:items-center lg:gap-x-16 lg:gap-y-6">
          <div className="flex flex-col gap-5 sm:gap-[22px]">
            <Eyebrow onDark>Proč · 1 ze 6</Eyebrow>
            <h2 id="proc-vyrok" className="text-balance font-serif text-[27px] font-semibold leading-[1.25] sm:text-[32px] lg:text-[38px] lg:leading-[1.2]">
              Z každých 100 Kč, které pojišťovny zaplatí, jde <span style={{ color: BLUE_TEXT }}>{kc(ACUTE)}</span> na akutní lůžka v nemocnicích a{" "}
              <span style={{ color: ORANGE_TEXT }}>{kc(GP_ADULT)}</span> na praktické lékaře pro dospělé.
            </h2>
            {GP_FUTURE && (
              <p className="max-w-[30em] text-on-dark-muted">
                Praktiků přitom ubývá. {GP_FUTURE.charAt(0).toUpperCase() + GP_FUTURE.slice(1)}.
              </p>
            )}
          </div>
          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:justify-self-center">
            <Waffle
              onDark
              label={`Sto čtverečků představuje 100 Kč z plateb pojišťoven. ${Math.round(ACUTE)} modrých připadá na akutní lůžka, ${Math.round(GP_ADULT)} oranžové na praktické lékaře pro dospělé, zbytek tmavých na vše ostatní.`}
              groups={[
                { value: ACUTE, color: BLUE, label: `akutní lůžka ${pct(ACUTE)}` },
                { value: GP_ADULT, color: ORANGE, label: `praktici pro dospělé ${pct(GP_ADULT)}` },
              ]}
            />
          </div>
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6 lg:col-start-1 lg:row-start-2 lg:self-start">
            <Button href="/proc" variant="secondary-on-dark">
              Dalších pět důvodů
            </Button>
            <p className="text-[15px] text-sage">Zdroj: ÚZIS, platby pojišťoven 2024</p>
          </div>
        </Container>
      </section>

      {/* 4. Pět změn */}
      <Section eyebrow="Co chceme" title="Pět změn, které pocítíte">
        <ChangeRow items={FIVE_CHANGES} />
      </Section>

      {/* 4b. Z čeho vycházíme: 13 oblastí Manifestu */}
      <ManifestStrip />

      {/* 5. Cesta pacienta */}
      <Section eyebrow="Cesta pacienta" title="Jak to bude vypadat, když…" className="pt-3! md:pt-0!">
        <PatientJourney defaultStep={4} />
      </Section>

      {/* 6. Peníze */}
      <section aria-labelledby="penize-nadpis" className="border-y border-line bg-paper py-11 md:py-24">
        <Container className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-3.5 sm:gap-[18px]">
            <h2 id="penize-nadpis">
              <Eyebrow>Peníze</Eyebrow>
            </h2>
            <BigNumber
              value={KEY_NUMBERS[0].value}
              text="ročně navíc, až reforma poběží naplno kolem roku 2038. Odhad 15 až 25 mld. Kč, necelá 4 % toho, co dnes stojí zdravotní pojištění."
              range={{ min: 15, max: 25, value: 21.5, scaleMax: 30, unit: "mld.", maxLabel: "25 mld." }}
              small={[
                { value: "520", text: "týmů lékařů a sester" },
                { value: "8 000", text: "lůžek změní účel" },
                { value: "5 mld.", text: "ročně z daní za zdraví" },
              ]}
              source="ekonomický model studie v3, ceny roku 2026"
            />
            <TextLink href="/penize" arrow className="self-start">
              Odkud peníze přijdou a na co půjdou
            </TextLink>
          </div>
          <CalculatorFrame
            question="Kolik zaplatíte za tiché víno navíc?"
            note="Zjednodušeno: daň 23,40 Kč na litr, 52 týdnů. Malí vinaři platí poloviční sazbu, takže jejich víno zdraží méně."
          >
            <HomeWineCalculator />
          </CalculatorFrame>
        </Container>
      </section>

      {/* 7. Co reforma nedělá */}
      <Section eyebrow="Co reforma nedělá" title="Obavy, které slýcháme, a jak to opravdu je">
        <FearFact />
      </Section>

      {/* 8. Jak a kdy */}
      <Section tone="paper" eyebrow="Jak a kdy" title="Po krocích, s pojistkami" lead="Bez dat se nerozhoduje. Když selže jedna část, zastaví se jen ta část.">
        <MilestoneColumns />
        <TextLink href="/jak" arrow className="mt-4">
          Celý harmonogram a pravidla
        </TextLink>
        <div className="mt-6 sm:mt-8">
          <Callout title="Co se změní i k horšímu">{HONEST_CHANGES.join(" ")}</Callout>
        </div>
      </Section>

      {/* 9. Pro koho */}
      <section aria-labelledby="pro-koho-nadpis" className="pt-11 md:pt-[104px]">
        <Container className="grid items-start gap-6 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col gap-3 sm:gap-3.5">
            <Eyebrow>Pro koho</Eyebrow>
            <h2 id="pro-koho-nadpis" className="text-balance font-serif text-[26px] font-semibold leading-[1.15] sm:text-[34px] lg:text-[40px] lg:leading-[1.12]">
              Plán projednáváme s těmi, kdo ho budou dělat
            </h2>
            <p className="text-[17px] text-muted sm:text-xl">Deset organizací, devět kulatých stolů od února 2027 do června 2028.</p>
            <TextLink href="/pro-koho" arrow className="mt-1 self-start">
              Co nabízíme a co potřebujeme
            </TextLink>
          </div>
          <OrgList />
        </Container>
      </section>

      {/* 10. Další krok */}
      <NextStep
        title="Co se změní pro vás a vaše blízké"
        text="Pět změn a devět situací, dnes a po reformě. Čtení na pět minut."
        href="/co-chceme"
        label="Co se změní pro mě"
      />
    </>
  );
}
