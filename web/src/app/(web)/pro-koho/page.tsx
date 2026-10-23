import { ROUND_TABLES, STAKEHOLDERS } from "@/content/reforma";
import { NextLink, PageHero, Section } from "@/components/web/ui";

export const metadata = { title: "Pro koho" };

export default function ProKohoPage() {
  return (
    <>
      <PageHero eyebrow="Pro koho" title="Reforma, která má vydržet tři volební období, nemůže být reformou jedné strany" lead="Do června 2028 chceme písemnou podporu jádra plánu od aspoň 6 z 10 klíčových subjektů: sdružení praktiků pro dospělé i děti, České asociace sester, lékařské komory, VZP, svazu zdravotních pojišťoven, Asociace krajů, Svazu měst a obcí, pacientských organizací a odborů." />

      <Section eyebrow="Co nabízíme a co potřebujeme" title="Každému něco konkrétního, od každého něco konkrétního">
        <div className="grid gap-3 md:grid-cols-2">
          {STAKEHOLDERS.map((s) => (
            <article key={s.who} className="rounded-xl border border-line bg-paper p-5">
              <h3 className="text-lg font-semibold">{s.who}</h3>
              {s.org && <div className="text-xs text-muted">{s.org}</div>}
              <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-accent">Co nabízíme</div>
              <p className="mt-1 text-sm leading-relaxed">{s.offer}</p>
              <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">Co potřebujeme</div>
              <p className="mt-1 text-sm leading-relaxed">{s.need}</p>
              <div className="mt-3 rounded-lg bg-stone-50 px-3 py-2 text-xs text-muted">První krok: {s.step}</div>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Kulaté stoly" title="Devět stolů, každý s jedním zveřejněným výstupem">
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ROUND_TABLES.map((t) => (
            <li key={t.when} className="flex items-baseline gap-3 rounded-xl border border-line bg-paper px-4 py-3">
              <span className="w-16 shrink-0 font-semibold tabular-nums">{t.when}</span>
              <span className="text-sm">{t.topic}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 max-w-3xl text-sm text-muted">
          Jak se zapojit: první kolo připomínek končí 31. 3. 2027. Každou připomínku vypořádáme písemně a vypořádání zveřejníme. Nehledáme potlesk, hledáme slabá místa dřív, než je najde praxe.
        </p>
      </Section>

      <div className="mx-auto max-w-[1100px] px-4">
        <NextLink href="/otazky" title="Otázky" text="Osm otázek, které slyšíme nejčastěji, a odpovědi, které se opírají o čísla studie." />
      </div>
    </>
  );
}
