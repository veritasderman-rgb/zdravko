import Link from "next/link";
import { FIVE_CHANGES, INSPIRATION, KEY_NUMBERS, META, NOT_DOING } from "@/content/reforma";
import { Card, Section, Stat } from "@/components/web/ui";
import { SITE_LINKS } from "@/components/web/site-nav";
import { HeroSplit, PhasesStrip } from "@/components/web/visuals";

const TEASERS: Record<string, string> = {
  "/proc": "Peníze tečou tam, kde jsou postele, ne tam, kde jsou lidé nejvíc nemocní. Šest grafů o tom, jak na tom jsme.",
  "/co-chceme": "Pět změn, které lidé pocítí. Cesta pacienta dnes a po reformě. Co reforma nedělá.",
  "/jak": "Časová osa do roku 2038, čtyři kontrolní body, čtyři pravidla a co uděláme do voleb 2029.",
  "/penize": "21,5 miliardy ročně: na co půjdou, kdo je zaplatí a tři kalkulačky, kde si to přepočítáte.",
  "/pro-koho": "Co nabízíme a co potřebujeme od lékařů, sester, pojišťoven, krajů, obcí, nemocnic a pacientů.",
  "/otazky": "Rušíte nemocnice? Zvýšíte daně? Kde vezmete sestry? Osm otázek, které slyšíme nejčastěji.",
  "/studie": "Plné znění odborné studie, verze 3 ke konzultaci, ke čtení.",
};

export default function HomePage() {
  return (
    <>
      <div className="bg-ink text-white">
        <div className="mx-auto grid max-w-[1100px] gap-10 px-4 pb-16 pt-16 md:grid-cols-[3fr_2fr] md:items-center md:pb-24 md:pt-24">
          <div>
            <div className="eyebrow text-[#9fd3c4]">{META.subtitle}</div>
            <h1 className="display-title mt-3 text-5xl md:text-7xl lg:text-8xl">
              Každý člověk má mít svého lékaře a svou sestru blízko domova.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
              Dnes dává české zdravotnictví 29,7 % peněz z pojištění na akutní lůžka v nemocnicích a jen 4,3 % na praktické lékaře pro dospělé.
              Chceme to obrátit: péči o dlouhodobě nemocné a staré lidi přesunout blíž k nim, nemocnicím dát jistou roli a prevenci stálé peníze.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/proc" className="btn !bg-white !text-ink">Začít u problému</Link>
              <Link href="/co-chceme" className="btn !border-white/40 !bg-transparent !text-white">Pět změn</Link>
              <Link href="/studie" className="btn !border-white/40 !bg-transparent !text-white">Číst studii</Link>
            </div>
          </div>
          <div className="rounded-2xl bg-white/95 p-5 text-foreground">
            <div className="eyebrow text-accent">Kam dnes jdou peníze</div>
            <HeroSplit />
            <div className="mt-2 text-xs text-muted">Podíl na platbách zdravotních pojišťoven za rok 2024. Zdroj: ÚZIS.</div>
          </div>
        </div>
      </div>

      <div className="border-b border-line bg-paper">
        <div className="mx-auto max-w-[1100px] px-4 py-6 text-base leading-relaxed">
          <strong>{META.claim}</strong> Do voleb v říjnu 2029 chceme mít dohodu s odborníky, hotové podklady zákonů a běžící zkoušku ve třech regionech.
          Tento plán je pozvánka k rozhovoru, ne hotový program. Přečtěte si ho, najděte slabé místo a napište nám ho. První kolo připomínek končí {META.deadline}.
        </div>
      </div>

      <Section eyebrow="Čtyři čísla" title="Co slibujeme a za co ručíme">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {KEY_NUMBERS.map((k) => (
            <Stat key={k.value} value={k.value} label={k.label} note={k.note} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Pět změn" title="Co lidé pocítí" lead="Pět změn na sebe navazuje. Každá má své číslo a svůj termín v základním scénáři, kdy nová vláda nastoupí na přelomu let 2029 a 2030.">
        <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {FIVE_CHANGES.map((c) => (
            <li key={c.n} className="rounded-xl border border-line bg-paper p-5">
              <div className="big-number text-4xl text-accent">{c.n}</div>
              <div className="display-title mt-2 text-2xl">{c.title}</div>
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

      <Section eyebrow="Kdy" title="Dvanáct let, čtyři kontrolní body" lead="První zákony mohou platit od roku 2031, zákon o primární péči od roku 2032, cíl je kolem roku 2038. Oranžové čáry jsou kontrolní body, kde se podle čísel rozhodne, zda pokračovat, upravit, nebo zmenšit.">
        <PhasesStrip />
        <div className="mt-3"><Link href="/jak" className="text-sm font-medium text-accent hover:underline">Celá časová osa a pravidla →</Link></div>
      </Section>

      <Section eyebrow="Co reforma nedělá" title="Šest věcí, které se nám přisuzují a v plánu nejsou">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NOT_DOING.map((n) => (
            <Card key={n.title} title={n.title}>{n.text}</Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="Nevymýšlíme nic nového" title="Půjčujeme si, co už jinde funguje">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INSPIRATION.map((i) => (
            <div key={i.country} className="rounded-xl border border-line bg-paper p-5">
              <div className="display-title text-2xl">{i.country}</div>
              <div className="mt-1 text-sm text-muted">{i.what}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Průvodce" title="Co, proč a jak">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {SITE_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="group rounded-xl border border-line bg-paper p-5 transition hover:border-accent">
              <div className="display-title text-2xl group-hover:underline">{l.label}</div>
              <div className="mt-1 text-sm text-muted">{TEASERS[l.href]}</div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
