import { ROUND_TABLES, STAKEHOLDERS } from "@/content/reforma";
import { NextLink, PageHero, Section } from "@/components/web/ui";
import { SupportMeter } from "@/components/web/visuals";

export const metadata = { title: "Pro koho" };

export default function ProKohoPage() {
  return (
    <>
      <PageHero eyebrow="Pro koho" title="Reforma na tři volební období nemůže být reformou jedné strany" lead="Proto nejdřív hledáme podporu u těch, kteří budou péči poskytovat, platit a dostávat. Bez nich se plán neprosadí ani s vládní většinou." />

      <Section eyebrow="Podpora" title="Potřebujeme šest z deseti">
        <SupportMeter />
      </Section>

      <Section eyebrow="Co nabízíme a co potřebujeme" title="Každému něco konkrétního, od každého něco konkrétního">
        <div className="grid gap-3 md:grid-cols-2">
          {STAKEHOLDERS.map((s) => (
            <article key={s.who} className="rounded-xl border border-line bg-paper p-5">
              <h3 className="display-title text-2xl">{s.who}</h3>
              {s.org && <div className="text-xs text-muted">{s.org}</div>}
              <div className="mt-3 eyebrow text-accent">Co nabízíme</div>
              <p className="mt-1 text-sm leading-relaxed">{s.offer}</p>
              <div className="mt-3 eyebrow text-muted">Co potřebujeme</div>
              <p className="mt-1 text-sm leading-relaxed">{s.need}</p>
              <div className="mt-3 rounded-lg bg-stone-50 px-3 py-2 text-xs text-muted">První krok: {s.step}</div>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Kulaté stoly" title="Devět setkání, z každého jeden veřejný výstup">
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ROUND_TABLES.map((t) => (
            <li key={t.when} className="flex items-baseline gap-3 rounded-xl border border-line bg-paper px-4 py-3">
              <span className="display-title w-16 shrink-0 text-xl">{t.when}</span>
              <span className="text-sm">{t.topic}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
          Jak se zapojit: první kolo připomínek končí 31. 3. 2027. Ke každé připomínce napíšeme, jak jsme s ní naložili, a zveřejníme to. Nehledáme potlesk, hledáme slabá místa dřív, než je najde praxe.
        </p>
      </Section>

      <div className="mx-auto max-w-[1100px] px-4">
        <NextLink href="/otazky" title="Otázky" text="Osm otázek, které slyšíme nejčastěji, a odpovědi opřené o čísla studie." />
      </div>
    </>
  );
}
