import Link from "next/link";
import { KEY_SUBJECTS, META } from "@/content/reforma";
import { SUPPORTERS } from "@/content/zapojit";
import { NextStep, PageHero, Section, TextLink } from "@/components/web/ui";
import { JsonLd } from "@/components/json-ld";
import { NewsletterForm } from "@/components/web/newsletter-form";
import { OrganizationForm, RoundTableForm } from "@/components/web/zapojit-forms";
import { breadcrumbs, pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/zapojte-se");

const WAYS = [
  { href: "/studie", title: "Napsat připomínku", text: "K odstavci nebo ke studii jako celku. Stačí pár minut.", time: "5 minut" },
  { href: "/studie/navrhnout-opatreni", title: "Navrhnout opatření", text: "Chybí v plánu něco důležitého? Průvodce vás provede otázkami.", time: "20 až 30 minut" },
  { href: "#kulate-stoly", title: "Přihlásit se ke kulatému stolu", text: "K tématu, kterému rozumíte. Pozvánku pošleme, až bude termín.", time: "2 minuty" },
  { href: "#organizace", title: "Ozvat se za organizaci", text: "Setkání, podpora, spolupráce na části plánu.", time: "3 minuty" },
  { href: "#novinky", title: "Odebírat novinky", text: "Nová verze studie, termíny kulatých stolů, vypořádání připomínek.", time: "1 minuta" },
];

export default function ZapojteSePage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Zapojte se", path: "/zapojte-se" }])} />
      <PageHero
        eyebrow="Zapojte se"
        title="Plán chceme projednat s vámi, dokud se dá měnit"
        lead={`První kolo připomínek k verzi 3.2 končí ${META.deadline}. Pak přijdou kulaté stoly k jednotlivým tématům. Vyberte si, jak se chcete zapojit; každá cesta vede k týmu, který plán upravuje.`}
        aside={
          <nav aria-label="Jak se zapojit">
            <ul className="flex flex-col gap-2.5">
              {WAYS.map((w) => (
                <li key={w.href}>
                  <Link href={w.href} className="flex min-h-11 flex-col gap-1 rounded-card border border-line bg-paper px-5 py-4 hover:border-forest hover:bg-sage-soft">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="font-serif text-[20px] font-semibold text-ink">{w.title}</span>
                      <span className="text-[15px] text-muted">{w.time}</span>
                    </span>
                    <span className="text-[16px] leading-snug text-ink-2">{w.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        }
      />

      <Section
        id="kulate-stoly"
        tone="paper"
        eyebrow="Kulaté stoly"
        title="Řekněte nám, o které téma stojíte"
        lead="Plánujeme devět setkání k jednotlivým tématům a z každého zveřejníme výstup. Termíny ani místa zatím nejsou. Přihlaste se k tématům, která vás zajímají, a jakmile bude termín, pošleme vám pozvánku."
        className="scroll-mt-6"
      >
        <div className="max-w-[56rem] rounded-panel border border-line bg-sand p-5 sm:p-7">
          <RoundTableForm />
        </div>
      </Section>

      <Section
        id="organizace"
        eyebrow="Za organizaci"
        title="Ozvěte se za svou organizaci"
        lead="Chcete plán probrat, podpořit ho nebo pomoct s některou jeho částí? Napište nám. Zprávu dostane autor studie a ozve se vám."
        className="scroll-mt-6"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
          <div className="rounded-panel border border-line bg-paper p-5 sm:p-7">
            <OrganizationForm />
          </div>
          <div className="flex flex-col gap-4 text-[18px] leading-relaxed text-ink-2">
            <p>
              S deseti organizacemi plán projednáme sami a dřív, než půjde do Sněmovny: {KEY_SUBJECTS.join(", ")}. Ozvat se ale může kterákoli organizace, spolek, nemocnice, obec nebo škola.
            </p>
            <p>
              Připomínky organizací vyřizujeme přednostně. Když posíláte připomínky za organizaci, pošlete prosím jednu souhrnnou{" "}
              <TextLink href="/studie#pripominka">přes formulář ke studii</TextLink> s odkazem na část a odstavec.
            </p>
            <p>
              Píšete za redakci? Podklady a kontakt jsou na stránce <TextLink href="/pro-media">Pro média</TextLink>.
            </p>
          </div>
        </div>
      </Section>

      {SUPPORTERS.length > 0 && (
        <Section id="podpora" tone="paper" eyebrow="Podpora" title="Organizace, které plán podporují" lead="Uvádíme jen organizace, které o to samy požádaly a znění odsouhlasily.">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORTERS.map((s) => (
              <li key={s.name} className="rounded-card border border-line bg-sand p-5">
                <p className="font-serif text-[20px] font-semibold text-ink">
                  {s.url ? (
                    <a href={s.url} className="underline hover:text-forest" rel="noopener noreferrer" target="_blank">
                      {s.name}
                    </a>
                  ) : (
                    s.name
                  )}
                </p>
                {s.what && <p className="mt-1 text-[16px] text-ink-2">{s.what}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="novinky" tone={SUPPORTERS.length > 0 ? "sand" : "paper"} eyebrow="Novinky e-mailem" title="Dáme vám vědět, až bude co říct" lead="Nová verze studie, termíny kulatých stolů a vypořádání připomínek. Jen o důležitých krocích." className="scroll-mt-6">
        <NewsletterForm />
      </Section>

      <NextStep title="Přečtěte si studii" text="Plné znění po kapitolách. U každého odstavce můžete napsat připomínku." href="/studie" label="Číst studii" />
    </>
  );
}
