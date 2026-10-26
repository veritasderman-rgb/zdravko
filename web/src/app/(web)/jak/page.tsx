import { GATES, INDICATORS, MILESTONES, PHASES, RISKS, RULES, STEPS_2029, VARIANTS } from "@/content/reforma";
import { Timeline } from "@/components/charts/timeline";
import { ChartFrame } from "@/components/charts/chart-frame";
import { DataTable } from "@/components/charts/data-table";
import { HBarChart } from "@/components/charts/hbar-chart";
import { csNumber } from "@/components/charts/theme";
import { CodeRef, NextStep, PageHero, Section, TextLink } from "@/components/web/ui";
import { ChainsDiagram } from "@/components/web/visuals";
import { MODEL_NOTE } from "@/content/cisla";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/jak");

const yearsOf = (from: number, to: number) => {
  const a = Math.floor(from);
  const b = Math.floor(to - 0.01);
  return a === b ? `${a}` : `${a}–${b}`;
};

/** Tabulková verze časové osy: fáze, kontrolní body a milníky v časovém pořadí. */
const TIMELINE_ROWS = [
  ...PHASES.map((p) => ({ at: p.from, row: [`Fáze ${p.id} · ${p.name}`, yearsOf(p.from, p.to), p.text] })),
  ...GATES.map((g) => ({ at: g.at, row: [`Kontrolní bod ${g.id} · ${g.name}`, g.when, g.must] })),
  ...MILESTONES.map((m) => ({ at: m.at, row: [m.label, m.detail, ""] })),
]
  .sort((a, b) => a.at - b.at)
  .map((x) => x.row);

const VARIANT_ROWS: { label: string; get: (v: (typeof VARIANTS.rows)[number]) => string }[] = [
  { label: "Jednorázové investice (mld. Kč)", get: (v) => v.invest },
  { label: "Kolik praktiků bude v týmech (2038)", get: (v) => v.teams },
  { label: "Sester navíc (2038)", get: (v) => (v.nurses ? v.nurses.toLocaleString("cs-CZ") : "0") },
  { label: "Pomůže tam, kde lékař chybí", get: (v) => v.rural },
  { label: "Kdy platí", get: (v) => v.when },
];

const smallHead = "text-[15px] font-bold uppercase tracking-[0.06em]";

export default function JakPage() {
  const [a, b, c] = VARIANTS.rows;
  return (
    <>
      <PageHero
        eyebrow="Jak a kdy"
        title="První zákony mohou platit od roku 2031, cíl je kolem roku 2038"
        lead="Dřív to nejde a říkáme to na rovinu. Z opozice nelze přijmout zákon. Velký zákon trvá od prvního podkladu po účinnost dva až tři a půl roku. A ministerstvo zvládne za jedno volební období napsat realisticky dva velké zákony. Předchozí verze slibovala zákony od roku 2029; nezávislý posudek řekl, že se to stihnout nedá, a měl pravdu."
      />

      <Section
        id="casova-osa"
        tone="paper"
        eyebrow="Časová osa"
        title="Pět fází a čtyři kontrolní body"
        lead="V každém kontrolním bodě se podle čísel rozhodne jedna ze tří věcí: pokračovat, upravit, nebo zmenšit. Klikněte na bod a uvidíte, co v něm musí platit."
      >
        <ChartFrame
          title="Základní scénář: nová vláda nastupuje na přelomu let 2029 a 2030"
          subtitle="Fáze reformy, kontrolní body B1 až B4 a hlavní milníky, 2026–2038"
          source="Studie v3, Část VIII. Na 1. 1. 2029 záměrně nic neplánujeme: ten den začíná platit jiná velká změna v pojištění a v říjnu jsou volby."
          table={<DataTable header={["Co", "Kdy", "Podrobnosti"]} rows={TIMELINE_ROWS} numeric={false} />}
        >
          <Timeline />
        </ChartFrame>
      </Section>

      <Section eyebrow="Co na co navazuje" title="Tři řetězce v pevném pořadí" lead="Nejdřív peníze, pak lidé, pak lůžka. Kdo některý článek přeskočí, reformu rozbije.">
        <ChainsDiagram />
        <p className="mt-6 text-[17px]">
          <TextLink href="/souvislosti" arrow>
            Celá mapa vazeb: na čem které opatření stojí a co umožní
          </TextLink>
        </p>
      </Section>

      <Section tone="paper" eyebrow="Čtyři pravidla" title="Platí od roku 2026 do roku 2038, ať vládne kdokoli" lead="Když jedna část selže, zastaví se jen ona a zbytek reformy pokračuje.">
        <ol className="grid gap-x-12 md:grid-cols-2">
          {RULES.map((r, i) => (
            <li key={r.title} className="flex gap-5 border-t border-line-strong py-7">
              <span className="w-10 shrink-0 font-serif text-[48px] font-semibold leading-none text-forest md:text-[56px]">{i + 1}</span>
              <div>
                <h3 className="font-serif text-[22px] font-semibold leading-snug text-ink md:text-[26px]">{r.title}</h3>
                <p className="mt-2 text-[18px] leading-relaxed text-ink-2">{r.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="varianty"
        eyebrow="Tři varianty"
        title="Plná, bez nových center, minimální"
        lead="Základ je varianta A. Když v prosinci 2031 nebude v prvních týmech aspoň polovina sester, reforma se zmenší na variantu B: týmy fungují v dnešních ordinacích, nové budovy se nestaví. Varianta C je zhruba to, co dělá dnešní ministerstvo, a slouží jen pro srovnání."
      >
        <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <ChartFrame
            title={`Plná varianta stojí ${csNumber(a.cost)} mld. Kč ročně, bez nových center ${csNumber(b.cost)}, minimální ${csNumber(c.cost)}`}
            subtitle="Čistý roční náklad v roce 2038, mld. Kč, ceny roku 2026"
            source={`mld. Kč. ${MODEL_NOTE}`}
            table={<DataTable header={["Varianta", "mld. Kč ročně"]} rows={VARIANTS.rows.map((v) => [v.name, csNumber(v.cost)])} />}
          >
            <HBarChart rows={VARIANTS.rows.map((v) => ({ label: v.name, value: v.cost, highlight: v.key === "A" }))} unit="mld. Kč" />
          </ChartFrame>

          {/* Desktop: srovnávací tabulka */}
          <div className="hidden overflow-x-auto rounded-card border border-line bg-paper md:block" role="region" aria-label="Srovnání variant" tabIndex={0}>
            <table className="w-full border-collapse text-left text-[17px] leading-snug">
              <thead>
                <tr>
                  <th scope="col" className="border-b-2 border-line-strong px-4 py-3">
                    <span className="sr-only">Ukazatel</span>
                  </th>
                  {VARIANTS.rows.map((v) => (
                    <th key={v.key} scope="col" className={`border-b-2 border-line-strong px-4 py-3 font-serif text-[19px] font-semibold ${v.key === "A" ? "bg-sage-soft" : ""}`}>
                      {v.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VARIANT_ROWS.map((r) => (
                  <tr key={r.label} className="border-b border-line last:border-b-0">
                    <th scope="row" className="px-4 py-3 align-top text-[16px] font-semibold text-muted">{r.label}</th>
                    {VARIANTS.rows.map((v) => (
                      <td key={v.key} className={`px-4 py-3 align-top text-ink ${v.key === "A" ? "bg-sage-soft/60" : ""}`}>{r.get(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobil: karty */}
          <ul className="flex flex-col gap-4 md:hidden">
            {VARIANTS.rows.map((v) => (
              <li key={v.key} className={`rounded-card border border-line p-5 ${v.key === "A" ? "bg-sage-soft" : "bg-paper"}`}>
                <h3 className="font-serif text-[22px] font-semibold text-ink">{v.name}</h3>
                <dl className="mt-3 flex flex-col gap-2.5">
                  {VARIANT_ROWS.map((r) => (
                    <div key={r.label}>
                      <dt className="text-[15px] font-semibold text-muted">{r.label}</dt>
                      <dd className="text-[17px] text-ink">{r.get(v)}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-8 max-w-[44em] text-[18px] leading-relaxed text-ink-2">{VARIANTS.note}</p>
      </Section>

      <Section tone="paper" eyebrow="Do voleb 2029" title="Co uděláme ještě v opozici" lead="Sedm věcí, které uděláme bez vládní většiny. Co se nepovede, řekneme v červnu 2028 veřejně.">
        <ol className="grid gap-x-12 md:grid-cols-2">
          {STEPS_2029.map((s, i) => (
            <li key={s.title} className="flex gap-5 border-t border-line-strong py-6">
              <span className="w-9 shrink-0 font-serif text-[36px] font-semibold leading-none text-forest">{i + 1}</span>
              <div>
                <h3 className="text-[19px] font-bold leading-snug text-ink">
                  {s.title} <span className="font-normal text-muted">· {s.when}</span>
                </h3>
                <p className="mt-1.5 text-[18px] leading-relaxed text-ink-2">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="ukazatele"
        eyebrow="Jak poznáte, že to funguje"
        title="Osm čísel, podle kterých se bude reforma hodnotit"
        lead="Nezávisle je měří státní statistický ústav ÚZIS spolu s univerzitou. Cílové hodnoty jsou návrh k diskusi. Předchozí verze měla cíle, které model neunesl, a my jsme je snížili nebo škrtli."
      >
        <div className="rounded-card border border-line bg-paper p-2 md:p-4">
          <DataTable
            caption="Osm hlavních ukazatelů reformy: dnešní stav a cíle"
            header={["Co měříme", "Dnes", "Cíl 2033", "Cíl kolem 2038"]}
            numeric={false}
            rows={INDICATORS.map((i) => [
              <span key={i.code} className="flex flex-col items-start gap-1.5">
                <CodeRef code={i.code} link={false} />
                <span className="font-semibold">{i.name}</span>
              </span>,
              i.today,
              i.y2033,
              i.y2038,
            ])}
          />
        </div>
      </Section>

      <Section
        id="rizika"
        tone="paper"
        eyebrow="Na co si dáváme pozor"
        title="Na každé riziko máme předem domluvenou pojistku"
        lead="Reformu nejvíc ohrožují tři věci: nedostatek sester, podceněné náklady a to, zda ministerstvo stihne napsat zákony."
      >
        <div className="border-t border-line-strong">
          {RISKS.map((r) => (
            <details key={r.risk} className="group border-b border-line-strong">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-serif text-[21px] font-semibold leading-snug text-ink md:text-[24px] [&::-webkit-details-marker]:hidden">
                {r.risk}
                <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-forest transition-transform group-open:rotate-180">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <div className="grid gap-5 pb-6 md:grid-cols-2">
                <div>
                  <h3 className={`${smallHead} text-muted`}>Jak to poznáme včas</h3>
                  <p className="mt-1.5 text-[18px] leading-relaxed text-ink-2">{r.signal}</p>
                </div>
                <div className="rounded-card bg-sage-soft p-5">
                  <h3 className={`${smallHead} text-forest`}>Pojistka</h3>
                  <p className="mt-1.5 text-[18px] leading-relaxed text-ink">{r.safeguard}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </Section>

      <NextStep title="Kolik to stojí" text="21,5 miliardy ročně: na co půjdou, kdo je zaplatí a jak si to přepočítat." href="/penize" label="Peníze" />
    </>
  );
}
