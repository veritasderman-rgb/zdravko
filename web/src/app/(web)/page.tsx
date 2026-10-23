import Link from "next/link";
import { FIVE_CHANGES, INSPIRATION, KEY_NUMBERS, META, NOT_DOING } from "@/content/reforma";
import { Card, Section, Stat } from "@/components/web/ui";
import { SITE_LINKS } from "@/components/web/site-nav";

const TEASERS: Record<string, string> = {
  "/proc": "Peníze tečou tam, kde jsou postele, ne tam, kde jsou lidé nejvíc nemocní. Data o výchozím stavu.",
  "/co-chceme": "Pět změn, které lidé pocítí, cesta pacienta dnes a po reformě a co reforma výslovně nedělá.",
  "/jak": "Pět fází, čtyři brány s měřitelným kritériem, čtyři pravidla a co uděláme do voleb 2029.",
  "/penize": "21,5 mld. Kč ročně: na co jdou, kdo je zaplatí a jak si to přepočítat.",
  "/pro-koho": "Co nabízíme a co potřebujeme od praktiků, sester, pojišťoven, krajů, obcí, nemocnic a pacientů.",
  "/otazky": "Rušíte nemocnice? Zvýšíte daně? Kde vezmete sestry? Osm otázek, které slyšíme nejčastěji.",
};

export default function HomePage() {
  return (
    <>
      <div className="border-b border-line bg-paper">
        <div className="mx-auto max-w-[1100px] px-4 pb-14 pt-16 md:pb-20 md:pt-24">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{META.subtitle}</div>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Kolem roku 2038 má každý člověk v Česku svůj tým primární péče.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted md:text-xl">
            Ke specialistovi se dostane podle naléhavosti a na akutním lůžku leží jen tehdy, když ho skutečně potřebuje. České zdravotnictví dává
            29,7 % peněz z pojištění na akutní lůžka a 4,3 % na praktické lékaře pro dospělé. To chceme obrátit.
          </p>
          <p className="mt-6 max-w-3xl text-base text-foreground">
            <strong>{META.claim}</strong> Do voleb v říjnu 2029 chceme mít dohodu s odborníky, hotové věcné záměry zákonů a běžící pilot.
            Tento text je pozvánka k rozhovoru, ne hotový program. Přečtěte si ho, najděte slabé místo a napište nám ho. První kolo
            připomínek končí {META.deadline}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/proc" className="btn">Začít u problému</Link>
            <Link href="/co-chceme" className="btn btn-ghost">Pět změn</Link>
            <Link href="/penize" className="btn btn-ghost">Kolik to stojí</Link>
          </div>
        </div>
      </div>

      <Section eyebrow="Čtyři čísla" title="Co slibujeme a za co ručíme">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {KEY_NUMBERS.map((k) => (
            <Stat key={k.value} value={k.value} label={k.label} note={k.note} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Pět změn" title="Co lidé pocítí" lead="Pět změn na sebe navazuje; každá má své číslo a svůj termín ve scénáři, kdy nová vláda nastoupí na přelomu let 2029 a 2030.">
        <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {FIVE_CHANGES.map((c) => (
            <li key={c.n} className="rounded-xl border border-line bg-paper p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Změna {c.n}</div>
              <div className="mt-1 text-lg font-semibold leading-snug">{c.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.brings}</p>
            </li>
          ))}
          <li className="flex items-center rounded-xl border border-dashed border-line p-5">
            <Link href="/co-chceme" className="text-sm font-medium text-accent hover:underline">
              Co přesně uděláme a kdy, krok za krokem →
            </Link>
          </li>
        </ol>
      </Section>

      <Section eyebrow="Co reforma nedělá" title="Šest věcí, které se nám přičítají, a my je nenavrhujeme">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NOT_DOING.map((n) => (
            <Card key={n.title} title={n.title}>{n.text}</Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="Nevymýšlíme nic, co by svět neznal" title="Půjčujeme si, co už funguje">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INSPIRATION.map((i) => (
            <div key={i.country} className="rounded-xl border border-line bg-paper p-5">
              <div className="font-semibold">{i.country}</div>
              <div className="mt-1 text-sm text-muted">{i.what}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Průvodce" title="Co, proč a jak">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {SITE_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="group rounded-xl border border-line bg-paper p-5 transition hover:border-accent">
              <div className="text-lg font-semibold group-hover:underline">{l.label}</div>
              <div className="mt-1 text-sm text-muted">{TEASERS[l.href]}</div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
