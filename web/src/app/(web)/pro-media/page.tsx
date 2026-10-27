import { CONFLICT, META } from "@/content/reforma";
import { COST, DOWNLOADS, JOIN, NOT_DOING_SHORT, PITCH, PROBLEM, SOLUTION, STUDY_POINTS, TIMELINE } from "@/content/podklady";
import { Button, Callout, Chip, NextStep, PageHero, Section, TextLink } from "@/components/web/ui";
import { Icon } from "@/components/web/icons";
import { JsonLd } from "@/components/json-ld";
import { pdfInfo, pdfLabel } from "@/lib/pdf-info";
import { pressContact } from "@/lib/privacy";
import { breadcrumbs, pageMeta } from "@/lib/seo";

// Velikost a počet stran PDF se čtou ze složky public při sestavení.
export const dynamic = "force-static";

export const metadata = pageMeta("/pro-media");

export default function ProMediaPage() {
  const contact = pressContact();
  const files = [
    { ...DOWNLOADS.handout, info: pdfLabel(pdfInfo(DOWNLOADS.handout.href), "strana") },
    { ...DOWNLOADS.prezentace, info: pdfLabel(pdfInfo(DOWNLOADS.prezentace.href), "snímek") },
    { ...DOWNLOADS.studie, info: pdfLabel(pdfInfo(DOWNLOADS.studie.href), "strana") },
  ];
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Pro média", path: "/pro-media" }])} />
      <PageHero
        eyebrow="Pro média"
        title="Podklady pro novináře"
        lead={`${PITCH.claim} Ke stažení je handout na dvě strany, prezentace a celá studie. Všechna čísla mají zdroj.`}
        aside={
          <div className="flex flex-col gap-3">
            <h2 className="text-[16px] font-bold uppercase tracking-[0.06em] text-forest">Ke stažení</h2>
            <ul className="flex flex-col gap-2.5">
              {files.map((f) => (
                <li key={f.href}>
                  <a href={f.href} download className="flex min-h-11 items-start gap-4 rounded-card border border-line bg-paper px-5 py-4 hover:border-forest hover:bg-sage-soft">
                    <Icon name="download" size={24} className="mt-1 shrink-0 text-forest" />
                    <span className="flex flex-col gap-1">
                      <span className="font-serif text-[20px] font-semibold text-ink">{f.title}</span>
                      <span className="text-[16px] leading-snug text-ink-2">{f.text}</span>
                      <span className="text-[15px] text-muted">{f.info}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-[17px] text-ink-2">
              Dotazy a rozhovory:{" "}
              <a href={`mailto:${contact}`} className="font-semibold text-forest underline">
                {contact}
              </a>
            </p>
          </div>
        }
      />

      <Section tone="paper" eyebrow="1. Máme problém" title="Péče na dnešní úrovni se bez změn neudrží">
        <ul className="grid gap-4 md:grid-cols-2">
          {PROBLEM.map((p) => (
            <li key={p.title} className="flex flex-col gap-2 rounded-card border border-line bg-sand p-6">
              <span className="font-serif text-[34px] font-semibold leading-none text-forest [font-variant-numeric:lining-nums_tabular-nums]">{p.value}</span>
              <h3 className="mt-1 text-[20px] font-bold text-ink">{p.title}</h3>
              <p className="text-[17px] leading-relaxed text-ink-2">{p.text}</p>
              <p className="mt-auto text-[15px] text-muted">Zdroj: {p.source}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="2. Nabízíme řešení" title="Pět změn, které lidé pocítí">
        <ol className="flex flex-col gap-3">
          {SOLUTION.map((s) => (
            <li key={s.n} className="flex gap-4 rounded-card border border-line bg-paper p-5 sm:gap-6 sm:p-6">
              <span className="font-serif text-[30px] font-semibold leading-none text-forest">{s.n}</span>
              <span className="flex flex-col gap-1">
                <span className="font-serif text-[21px] font-semibold leading-snug text-ink">{s.title}</span>
                <span className="text-[17px] leading-relaxed text-ink-2">{s.text}</span>
              </span>
            </li>
          ))}
        </ol>
        <dl className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {COST.map((c) => (
            <div key={c.value} className="flex flex-col gap-1.5 border-t-2 border-forest pt-4">
              <dt className="font-serif text-[30px] font-semibold leading-tight text-ink">{c.value}</dt>
              <dd className="text-[16px] leading-snug text-ink-2">{c.label}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-[15px] font-bold uppercase tracking-[0.06em] text-forest">Kdy</h3>
            <ol className="mt-3 flex flex-col gap-2">
              {TIMELINE.map((t) => (
                <li key={t.when} className="flex flex-col gap-0.5 text-[17px] sm:flex-row sm:gap-4">
                  <span className="shrink-0 font-semibold text-ink sm:w-36">{t.when}</span>
                  <span className="text-ink-2">{t.what}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="text-[15px] font-bold uppercase tracking-[0.06em] text-forest">Co neděláme</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {NOT_DOING_SHORT.map((t) => (
                <li key={t}>
                  <Chip className="whitespace-normal text-left">{t}</Chip>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="paper" eyebrow="3. Detaily jsou ve studii" title="Každé číslo má zdroj, každé opatření termín">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-14">
          <ul className="flex flex-col gap-3">
            {STUDY_POINTS.map((p) => (
              <li key={p} className="flex gap-3 text-[18px] leading-relaxed text-ink">
                <span aria-hidden className="mt-2.5 size-2 shrink-0 rounded-full bg-forest" />
                {p}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap content-start gap-3">
            <Button href="/studie" variant="secondary">
              Číst studii
            </Button>
            <Button href="/cisla" variant="secondary">
              Čísla a zdroje
            </Button>
            <Button href="/otazky" variant="secondary">
              Časté otázky
            </Button>
          </div>
        </div>
        <div className="mt-10 max-w-[52em]">
          <Callout title="Střet zájmů říkáme předem" tone="sage">
            {CONFLICT}
          </Callout>
        </div>
      </Section>

      <Section eyebrow="4. Zapojte se" title={`Připomínky přijímáme do ${META.deadline}`}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {JOIN.map((j) => (
            <li key={j.title} className="rounded-card border border-line bg-paper p-5">
              <p className="font-serif text-[20px] font-semibold text-ink">
                <TextLink href={j.path}>{j.title}</TextLink>
              </p>
              <p className="mt-1 text-[17px] text-ink-2">{j.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="paper" eyebrow="K převzetí" title="Krátký popis plánu">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
          <blockquote className="rounded-card border-l-4 border-forest bg-sand p-6 text-[18px] leading-relaxed text-ink">{PITCH.boilerplate}</blockquote>
          <dl className="grid grid-cols-[auto_1fr] content-start gap-x-5 gap-y-2 text-[17px]">
            <dt className="font-semibold text-muted">Název</dt>
            <dd className="text-ink">{META.title}</dd>
            <dt className="font-semibold text-muted">Verze</dt>
            <dd className="text-ink">{META.subtitle.split(" · ").slice(1).join(", ")}</dd>
            <dt className="font-semibold text-muted">Autor</dt>
            <dd className="text-ink">{META.author}</dd>
            <dt className="font-semibold text-muted">Kontakt</dt>
            <dd className="text-ink">
              <a href={`mailto:${contact}`} className="font-semibold text-forest underline">
                {contact}
              </a>
            </dd>
          </dl>
        </div>
      </Section>

      <NextStep title="Zapojte se" text="Připomínka, návrh opatření, kulatý stůl nebo setkání za organizaci." href="/zapojte-se" label="Jak se zapojit" />
    </>
  );
}
