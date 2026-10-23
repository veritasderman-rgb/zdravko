import { INDICATORS, RISKS, RULES, STEPS_2029, VARIANTS } from "@/content/reforma";
import { Timeline } from "@/components/charts/timeline";
import { ChartFrame } from "@/components/charts/chart-frame";
import { HBarChart } from "@/components/charts/hbar-chart";
import { Card, NextLink, PageHero, Section } from "@/components/web/ui";

export const metadata = { title: "Jak a kdy" };

export default function JakPage() {
  return (
    <>
      <PageHero eyebrow="Jak a kdy" title="První zákony mohou platit od roku 2031, cíl je kolem roku 2038" lead="Dřív to nejde a říkáme to poctivě: v opozici nelze přijmout zákon, velká předloha trvá od věcného záměru po účinnost 24 až 42 měsíců a ministerstvo zvládne za jedno volební období realisticky dvě velké předlohy. Verze 2 slibovala zákony od roku 2029; to byl harmonogram, který se nedal stihnout, a verze 3 ho opravuje." />

      <Section eyebrow="Harmonogram" title="Pět fází, čtyři brány, žádná brána bez dat" lead="Každá brána má měřitelné kritérium a tři možné výsledky: pokračovat, upravit, nebo zmenšit. Klikněte na bránu.">
        <ChartFrame title="Základní scénář „Vláda 2030“: nová vláda nastupuje na přelomu 2029 a 2030" source="Studie v3, Část VIII. Na 1. 1. 2029 záměrně neklademe nic: ten den nabíhá strop pobytu na lůžku podle zákona 38/2025 Sb. a v říjnu jsou volby.">
          <Timeline />
        </ChartFrame>
      </Section>

      <Section eyebrow="Čtyři pravidla" title="Platí od roku 2026 do roku 2038 bez ohledu na to, kdo vládne" lead="Reforma jako celek kvůli jednomu neúspěchu nekončí; nástroj, který nefunguje, ano.">
        <ol className="grid gap-3 md:grid-cols-2">
          {RULES.map((r, i) => (
            <li key={r.title} className="rounded-xl border border-line bg-paper p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Pravidlo {i + 1}</div>
              <div className="mt-1 text-lg font-semibold">{r.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{r.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Tři varianty" title="Plná, bez center, minimální" lead="Základní je varianta A. Na B se reforma zmenší, když v prosinci 2031 nebude obsazena aspoň polovina míst sester. Varianta C je zhruba prodloužení dnešní politiky ministerstva.">
        <div className="grid gap-4 lg:grid-cols-[2fr_3fr]">
          <ChartFrame title="Čistý roční náklad variant v roce 2038" source="Model v3; mld. Kč, ceny 2026" table={{ header: ["Varianta", "mld. Kč"], rows: VARIANTS.rows.map((v) => [v.name, v.cost]) }}>
            <HBarChart rows={VARIANTS.rows.map((v) => ({ label: v.name, value: v.cost, highlight: v.key === "A" }))} unit="mld. Kč" />
          </ChartFrame>
          <div className="overflow-x-auto rounded-xl border border-line bg-paper">
            <table className="doc-table">
              <thead>
                <tr><th></th>{VARIANTS.rows.map((v) => <th key={v.key}>{v.name}</th>)}</tr>
              </thead>
              <tbody>
                <tr><td>Investice jednorázově (mld. Kč)</td>{VARIANTS.rows.map((v) => <td key={v.key}>{v.invest}</td>)}</tr>
                <tr><td>Praktici v týmech 2038</td>{VARIANTS.rows.map((v) => <td key={v.key}>{v.teams}</td>)}</tr>
                <tr><td>Sester navíc 2038</td>{VARIANTS.rows.map((v) => <td key={v.key}>{v.nurses ? v.nurses.toLocaleString("cs-CZ") : "0"}</td>)}</tr>
                <tr><td>Pomůže tam, kde praktik chybí</td>{VARIANTS.rows.map((v) => <td key={v.key}>{v.rural}</td>)}</tr>
                <tr><td>Kdy platí</td>{VARIANTS.rows.map((v) => <td key={v.key}>{v.when}</td>)}</tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm text-muted">{VARIANTS.note}</p>
      </Section>

      <Section eyebrow="Do voleb 2029" title="Opoziční roky nejsou čekárna" lead="Sedm věcí, z nichž žádná nepotřebuje vládní většinu. Co se nepovede, řekneme před bránou B1 v červnu 2028 veřejně.">
        <ol className="grid gap-3 md:grid-cols-2">
          {STEPS_2029.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-xl border border-line bg-paper p-5">
              <div className="text-2xl font-semibold text-accent">{i + 1}</div>
              <div>
                <div className="font-semibold">{s.title} <span className="font-normal text-muted">· {s.when}</span></div>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Jak poznáte, že to funguje" title="Osm hlavních ukazatelů" lead="Měří ÚZIS s univerzitou v oficiálním rámci hodnocení, ne nástroj autorů. Cílové hodnoty jsou návrh k diskusi; verze 2 měla cíle, které model neunesl, a verze 3 je snížila nebo škrtla.">
        <div className="overflow-x-auto rounded-xl border border-line bg-paper">
          <table className="doc-table">
            <thead>
              <tr><th>Ukazatel</th><th>Dnes</th><th>2033 (data za 2032)</th><th>Kolem roku 2038</th></tr>
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

      <Section eyebrow="Na co si dáváme pozor" title="Na každé riziko máme předem dohodnutou pojistku" lead="Reformu nejvíc ohrožují tři věci: nedostatek sester, podhodnocené náklady a kapacita ministerstva psát zákony.">
        <div className="grid gap-3 md:grid-cols-2">
          {RISKS.map((r) => (
            <Card key={r.risk} title={r.risk}>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">Jak ho poznáme včas</div>
              <p>{r.signal}</p>
              <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-accent">Pojistka</div>
              <p>{r.safeguard}</p>
            </Card>
          ))}
        </div>
      </Section>

      <div className="mx-auto max-w-[1100px] px-4">
        <NextLink href="/penize" title="Peníze" text="21,5 mld. Kč ročně: na co jdou, kdo je zaplatí a jak si to přepočítat." />
      </div>
    </>
  );
}
