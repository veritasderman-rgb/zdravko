import { KEY_SUBJECTS, META, ROUND_TABLES, STAKEHOLDERS } from "@/content/reforma";
import { Button, Chip, NextStep, PageHero, Section } from "@/components/web/ui";
import { HealthCentre } from "@/components/web/illustrations";
import { slug } from "../_lib/slug";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/pro-koho");

type Stakeholder = (typeof STAKEHOLDERS)[number];

/** Jedna skupina: kdo, co nabízíme / co potřebujeme ve dvou sloupcích, první krok jako čip. Kotva = slug z `who`. */
function StakeholderCard({ s }: { s: Stakeholder }) {
  return (
    <article id={slug(s.who)} className="flex scroll-mt-6 flex-col gap-5 rounded-card border border-line bg-paper p-6 md:p-8">
      <header>
        <h3 className="font-serif text-[24px] font-semibold leading-tight text-ink md:text-[28px]">{s.who}</h3>
        {s.org && <p className="mt-1 text-[16px] text-muted">{s.org}</p>}
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <h4 className="text-[15px] font-bold uppercase tracking-[0.06em] text-forest">Co nabízíme</h4>
          <p className="mt-1.5 text-[18px] leading-relaxed text-ink">{s.offer}</p>
        </div>
        <div>
          <h4 className="text-[15px] font-bold uppercase tracking-[0.06em] text-muted">Co potřebujeme</h4>
          <p className="mt-1.5 text-[18px] leading-relaxed text-ink-2">{s.need}</p>
        </div>
      </div>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[16px] text-muted">
        První krok:
        <Chip className="whitespace-normal text-left">{s.step}</Chip>
      </p>
    </article>
  );
}

export default function ProKohoPage() {
  return (
    <>
      <PageHero
        eyebrow="Pro koho"
        title="Reforma na tři volební období nemůže být reformou jedné strany"
        lead={`Proto plán nejdřív projednáme s těmi, kteří budou péči poskytovat, platit a dostávat. Bez nich se neprosadí ani s vládní většinou. ${META.claim}`}
        aside={
          <div className="flex flex-col gap-4">
            <p className="text-[16px] font-bold uppercase tracking-[0.06em] text-forest">Projednáme to se všemi deseti</p>
            <ul className="flex flex-wrap gap-2" aria-label="Deset organizací, se kterými plán projednáme">
              {KEY_SUBJECTS.map((k) => (
                <li key={k}>
                  <Chip>{k}</Chip>
                </li>
              ))}
            </ul>
            <p className="text-[17px] leading-relaxed text-ink-2">
              S každou z těchto deseti organizací plán projednáme dřív, než půjde do Sněmovny. Chceme znát jejich výhrady a zapracovat je do další verze plánu.
            </p>
          </div>
        }
      />

      <Section id="skupiny" tone="paper" eyebrow="Co nabízíme a co potřebujeme" title="Co komu nabízíme a co od koho potřebujeme">
        <nav aria-label="Skupiny" className="mb-8">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[17px]">
            {STAKEHOLDERS.map((s) => (
              <li key={s.who}>
                <a href={`#${slug(s.who)}`} className="inline-flex min-h-11 items-center font-semibold text-forest underline decoration-2 underline-offset-[5px]">
                  {s.who}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="grid gap-5 lg:grid-cols-2">
          {STAKEHOLDERS.map((s) => (
            <StakeholderCard key={s.who} s={s} />
          ))}
        </div>
      </Section>

      <Section
        id="kulate-stoly"
        eyebrow="Kulaté stoly"
        title="Devět setkání, z každého jeden veřejný výstup"
        lead="Měsíce jsou orientační. Přesné termíny a místa zatím nejsou; kdo se přihlásí, dostane pozvánku jako první."
      >
        <div className="grid items-start gap-12 lg:grid-cols-[3fr_2fr]">
          <div>
            <ol className="border-l-2 border-forest">
              {ROUND_TABLES.map((t) => (
                <li key={t.when} className="relative flex flex-col gap-0.5 py-3 pl-6 sm:flex-row sm:items-baseline sm:gap-5">
                  <span aria-hidden className="absolute -left-[7px] top-[22px] h-3 w-3 rounded-full border-2 border-sand bg-forest" />
                  <span className="w-24 shrink-0 font-serif text-[22px] font-semibold tabular-nums text-forest">
                    <span className="sr-only">orientačně </span>
                    {t.when}
                  </span>
                  <span className="text-[18px] text-ink">{t.topic}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 max-w-[44em] text-[19px] leading-relaxed text-ink-2">
              Jak se zapojit: první kolo připomínek končí {META.deadline}. Ke každé připomínce napíšeme, jak jsme s ní naložili, a zveřejníme to. Chceme najít slabá místa dřív, než je najde praxe.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/zapojte-se#kulate-stoly" variant="secondary" icon="arrow">
                Přihlásit se ke kulatému stolu
              </Button>
              <Button href="/zapojte-se#organizace" variant="secondary">
                Ozvat se za organizaci
              </Button>
            </div>
          </div>
          <figure className="flex flex-col gap-2.5">
            <HealthCentre />
            <figcaption className="text-[16px] text-muted">Obecní zdravotní centrum: budova patří obci</figcaption>
          </figure>
        </div>
      </Section>

      <NextStep title="Nejčastější otázky" text="Na co se lidé ptají nejčastěji, s odpověďmi opřenými o čísla studie." href="/otazky" label="Otázky" />
    </>
  );
}
