import { INDICATORS, RISKS, RULES, STEPS_2029, VARIANTS } from "@/content/reforma";
import { Timeline } from "@/components/charts/timeline";
import { ChartFrame } from "@/components/charts/chart-frame";
import { HBarChart } from "@/components/charts/hbar-chart";
import { Card, NextLink, PageHero, Section } from "@/components/web/ui";
import { ChainsDiagram } from "@/components/web/visuals";

export const metadata = { title: "Jak a kdy" };

export default function JakPage() {
  return (
    <>
      <PageHero eyebrow="Jak a kdy" title="První zákony mohou platit od roku 2031, cíl je kolem roku 2038" lead="Dřív to nejde a říkáme to na rovinu. Z opozice nelze přijmout zákon. Velký zákon trvá od prvního podkladu po účinnost dva až tři a půl roku. A ministerstvo zvládne za jedno volební období napsat realisticky dva velké zákony. Předchozí verze slibovala zákony od roku 2029; nezávislý posudek řekl, že se to stihnout nedá, a měl pravdu." />

      <Section eyebrow="Časová osa" title="Pět fází a čtyři kontrolní body" lead="V každém kontrolním bodě se podle čísel rozhodne jedna ze tří věcí: pokračovat, upravit, nebo zmenšit. Klikněte na bod a uvidíte, co v něm musí platit.">
        <ChartFrame title="Základní scénář: nová vláda nastupuje na přelomu let 2029 a 2030" source="Studie v3, Část VIII. Na 1. 1. 2029 záměrně nic neplánujeme: ten den začíná platit jiná velká změna v pojištění a v říjnu jsou volby.">
          <Timeline />
        </ChartFrame>
      </Section>

      <Section eyebrow="Co na co navazuje" title="Tři řetězce v pevném pořadí" lead="Nejdřív peníze, pak lidé, pak lůžka. Kdo některý článek přeskočí, reformu nezrychlí, jen ji rozbije.">
        <ChainsDiagram />
      </Section>

      <Section eyebrow="Čtyři pravidla" title="Platí od roku 2026 do roku 2038, ať vládne kdokoli" lead="Reforma kvůli jednomu neúspěchu nekončí. Část, která nefunguje, ano.">
        <ol className="grid gap-3 md:grid-cols-2">
          {RULES.map((r, i) => (
            <li key={r.title} className="flex gap-4 rounded-xl border border-line bg-paper p-5">
              <span className="big-number text-4xl text-accent">{i + 1}</span>
              <div>
                <div className="display-title text-2xl">{r.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{r.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Tři varianty" title="Plná, bez nových center, minimální" lead="Základ je varianta A. Když v prosinci 2031 nebude v prvních týmech aspoň polovina sester, reforma se zmenší na variantu B: týmy fungují v dnešních ordinacích, nové budovy se nestaví. Varianta C je zhruba to, co dělá dnešní ministerstvo, a slouží jen pro srovnání.">
        <div className="grid gap-4 lg:grid-cols-[2fr_3fr]">
          <ChartFrame title="Kolik varianty stojí ročně (2038)" source="Model studie v3; mld. Kč, ceny roku 2026" table={{ header: ["Varianta", "mld. Kč"], rows: VARIANTS.rows.map((v) => [v.name, v.cost]) }}>
            <HBarChart rows={VARIANTS.rows.map((v) => ({ label: v.name, value: v.cost, highlight: v.key === "A" }))} unit="mld. Kč" />
          </ChartFrame>
          <div className="overflow-x-auto rounded-xl border border-line bg-paper">
            <table className="doc-table">
              <thead>
                <tr><th></th>{VARIANTS.rows.map((v) => <th key={v.key}>{v.name}</th>)}</tr>
              </thead>
              <tbody>
                <tr><td>Jednorázové investice (mld. Kč)</td>{VARIANTS.rows.map((v) => <td key={v.key}>{v.invest}</td>)}</tr>
                <tr><td>Kolik praktiků bude v týmech (2038)</td>{VARIANTS.rows.map((v) => <td key={v.key}>{v.teams}</td>)}</tr>
                <tr><td>Sester navíc (2038)</td>{VARIANTS.rows.map((v) => <td key={v.key}>{v.nurses ? v.nurses.toLocaleString("cs-CZ") : "0"}</td>)}</tr>
                <tr><td>Pomůže tam, kde lékař chybí</td>{VARIANTS.rows.map((v) => <td key={v.key}>{v.rural}</td>)}</tr>
                <tr><td>Kdy platí</td>{VARIANTS.rows.map((v) => <td key={v.key}>{v.when}</td>)}</tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm text-muted">{VARIANTS.note}</p>
      </Section>

      <Section eyebrow="Do voleb 2029" title="Opoziční roky nejsou čekárna" lead="Sedm věcí, které uděláme bez vládní většiny. Co se nepovede, řekneme v červnu 2028 veřejně.">
        <ol className="grid gap-3 md:grid-cols-2">
          {STEPS_2029.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-xl border border-line bg-paper p-5">
              <span className="big-number text-4xl text-accent">{i + 1}</span>
              <div>
                <div className="font-semibold">{s.title} <span className="font-normal text-muted">· {s.when}</span></div>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Jak poznáte, že to funguje" title="Osm čísel, podle kterých se bude reforma hodnotit" lead="Měří je státní statistický ústav ÚZIS s univerzitou, ne my. Cílové hodnoty jsou návrh k diskusi. Předchozí verze měla cíle, které model neunesl, a my jsme je snížili nebo škrtli.">
        <div className="overflow-x-auto rounded-xl border border-line bg-paper">
          <table className="doc-table">
            <thead>
              <tr><th>Co měříme</th><th>Dnes</th><th>Cíl 2033</th><th>Cíl kolem 2038</th></tr>
            </thead>
            <tbody>
              {INDICATORS.map((i) => (
                <tr key={i.code}>
                  <td><span className="code-ref mr-1">{i.code}</span>{i.name}</td>
                  <td>{i.today}</td>
                  <td>{i.y2033}</td>
                  <td>{i.y2038}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Na co si dáváme pozor" title="Na každé riziko máme předem domluvenou pojistku" lead="Reformu nejvíc ohrožují tři věci: nedostatek sester, podceněné náklady a to, zda ministerstvo stihne napsat zákony.">
        <div className="grid gap-3 md:grid-cols-2">
          {RISKS.map((r) => (
            <Card key={r.risk} title={r.risk}>
              <div className="eyebrow text-muted">Jak to poznáme včas</div>
              <p>{r.signal}</p>
              <div className="mt-2 eyebrow text-accent">Pojistka</div>
              <p>{r.safeguard}</p>
            </Card>
          ))}
        </div>
      </Section>

      <div className="mx-auto max-w-[1100px] px-4">
        <NextLink href="/penize" title="Peníze" text="21,5 miliardy ročně: na co půjdou, kdo je zaplatí a jak si to přepočítat." />
      </div>
    </>
  );
}
