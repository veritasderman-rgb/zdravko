import { CISLA, KIND_LABEL, KIND_NOTE, SOURCES, TOPICS, fmtRange, type Cislo, type CisloId, type Kind, type Source } from "@/content/cisla";
import mista from "@/content/cisla-mista.json";
import { Chip, PageHero, Section } from "@/components/web/ui";
import { HspaEvidence } from "@/components/hspa-evidence";
import { OVERENI, forCislo } from "@/content/overeni-hspa";

export const metadata = {
  title: "Čísla a zdroje",
  description: "Každé číslo webu se zdrojem, rokem, definicí, rozpětím a druhem: údaj, výhled, scénářový výpočet, cíl, nebo pravidlo.",
};

type Places = Record<string, { web: { file: string; line: number }[]; studie: { line: number; heading: string }[] }>;
const PLACES = mista as Places;

const KIND_CLASS: Record<Kind, string> = {
  udaj: "border-forest text-forest",
  projekce: "border-line-strong text-ink-2",
  scenar: "border-verify-fg/60 bg-verify-bg text-verify-fg",
  cil: "border-forest bg-sage-soft text-forest",
  pravidlo: "border-ink text-ink",
};

const num = (v: number) => v.toLocaleString("cs-CZ", { maximumFractionDigits: 1 });
/** Číslo, které zdroj udává jen jako rozpětí, se ukazuje jako rozpětí, ne jako náš střed. */
const fmtValue = (x: Cislo) => (x.rangeOnly && x.range ? `${num(x.range[0])}–${num(x.range[1])}` : num(x.value));

function Row({ id }: { id: CisloId }) {
  const x = CISLA[id] as Cislo;
  const src: Source = SOURCES[x.source];
  const range = fmtRange(id);
  const headings = [...new Set((PLACES[id]?.studie ?? []).map((s) => s.heading).filter(Boolean))];
  const hspa = forCislo(id);
  return (
    <li className="cislo-row grid gap-x-6 gap-y-2 border-t border-line py-5 md:grid-cols-[minmax(0,15rem)_1fr]">
      <div>
        <p className="font-serif text-[30px] font-semibold leading-none tracking-[-0.01em] text-forest tabular-nums">{fmtValue(x)}</p>
        <p className="mt-1 text-[15px] leading-snug text-ink-2">{x.unit}</p>
        {range && !x.rangeOnly && <p className="mt-1 text-[15px] text-muted">rozpětí {range}</p>}
        <span className={`mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-[13px] font-bold ${KIND_CLASS[x.kind]}`}>{KIND_LABEL[x.kind]}</span>
      </div>
      <div className="text-[17px] leading-relaxed text-ink">
        <p>{x.definition}</p>
        <dl className="mt-2 grid gap-x-4 gap-y-1 text-[15px] leading-snug text-ink-2 sm:grid-cols-[8rem_1fr]">
          <dt className="font-semibold text-ink">Rok</dt>
          <dd>
            {x.year}
            {x.prices ? ` · ${x.prices}` : ""}
          </dd>
          <dt className="font-semibold text-ink">Zdroj</dt>
          <dd>
            {src.url ? (
              <a href={src.url} className="underline">
                {src.title}
              </a>
            ) : (
              src.title
            )}
            {src.detail ? `: ${src.detail}` : ""}
            {x.sourceDetail ? `; ${x.sourceDetail}` : ""}
          </dd>
          {headings.length > 0 && (
            <>
              <dt className="font-semibold text-ink">Ve studii</dt>
              <dd>
                {headings.slice(0, 4).join(" · ")}
                {headings.length > 4 ? ` a dalších ${headings.length - 4}` : ""}{" "}
                <a href={`/studie?q=${encodeURIComponent(x.forms[0])}`} className="whitespace-nowrap underline">
                  najít ve studii
                </a>
              </dd>
            </>
          )}
        </dl>
        {x.verify && (
          <div className="mt-2">
            <Chip variant="verify">Ověřujeme: {x.verify}</Chip>
          </div>
        )}
        {hspa.length > 0 && (
          <div className="mt-2 text-[15px] leading-snug text-ink-2">
            <span className="font-semibold text-ink">HSPA Monitor: </span>
            <HspaEvidence records={hspa} className="!mt-1" />
            {hspa[0].verdict !== "rozpor" && <p className="mt-1 text-muted">{hspa[0].note}</p>}
          </div>
        )}
      </div>
    </li>
  );
}

export default function CislaPage() {
  const ids = Object.keys(CISLA) as CisloId[];
  const scenarios = ids.filter((id) => CISLA[id].kind === "scenar").length;
  return (
    <>
      <PageHero
        eyebrow="Čísla a zdroje"
        title="Odkud je každé číslo a co přesně znamená"
        lead={`Na jednom místě je ${ids.length} čísel, o která se plán opírá: zdroj, rok, definice a rozpětí. U každého je i druh. Údaj je změřená hodnota, výhled je předpověď jiné instituce a scénářový výpočet je výsledek našeho modelu za daných předpokladů. Těch je ${scenarios}. U každého čísla je i to, co k němu má HSPA Monitor (skorezdravotnictvi.cz, stav k ${OVERENI.generated_at}): shoda, novější hodnota, nebo rozpor. Je to nástroj autorů studie, proto slouží jen jako pomůcka k ověření v primárním zdroji a reformu nehodnotí.`}
      />
      <Section id="druhy" tone="paper" eyebrow="Jak číst druhy čísel" title="Údaj, výhled, scénář, cíl, pravidlo">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(KIND_LABEL) as Kind[]).map((k) => (
            <li key={k} className="rounded-card border border-line bg-paper p-4">
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[13px] font-bold ${KIND_CLASS[k]}`}>{KIND_LABEL[k]}</span>
              <p className="mt-2 text-[16px] leading-snug text-ink-2">{KIND_NOTE[k]}</p>
            </li>
          ))}
        </ul>
      </Section>
      {TOPICS.map((t, i) => (
        <Section key={t.id} id={t.id} tone={i % 2 ? "paper" : undefined} eyebrow="Čísla" title={t.title}>
          <ul>
            {ids
              .filter((id) => CISLA[id].topic === t.id)
              .map((id) => (
                <Row key={id} id={id} />
              ))}
          </ul>
        </Section>
      ))}
    </>
  );
}
