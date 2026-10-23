import { ELECTION_LINE, GOV_AXIS, GOV_EDGE_NOTE, GOV_ROWS, MERGE_2029_LINE, PLAN_ROWS, type TwoTrackRow } from "@/content/figures/timelines";
import { PHASES } from "@/content/reforma";
import { FigureShell, GanttHeader, GridOverlay, Legend, SW, TextVersion, Track, YEARS, gateLines } from "./gantt-core";

/**
 * Obrázek ř. 1562: časová osa, vládní reformy 2026–2029 a fáze F0–F1 plánu.
 * Dvě dráhy nad sebou: vláda (stav k 20. 10. 2026 podle tabulky předloh v Části VI)
 * a náš plán (sloupec „Kdy“, kroky F0–F1). Pravý okraj osy je 2030; naše zákony jsou až za ním.
 */

const LW = 178;
const YEAR_TICKS = YEARS(2027, 2030);
const LINES = [...gateLines(), MERGE_2029_LINE, ELECTION_LINE].filter((l) => l.at <= GOV_AXIS.x1);

function Lane({ title, tone, rows }: { title: string; tone: "gov" | "plan"; rows: TwoTrackRow[] }) {
  return (
    <div>
      <div className={`relative px-3 py-1 text-[13px] font-bold uppercase tracking-[0.06em] ${tone === "gov" ? "bg-stone text-ink-2" : "bg-sage-soft text-forest"}`}>{title}</div>
      {rows.map((r, ri) => (
        <div key={r.label} className="grid border-b border-line" style={{ gridTemplateColumns: `${LW}px 1fr`, minHeight: r.h }}>
          <div className="flex items-center py-1.5 pr-3">
            <span className="text-[14px] font-semibold leading-tight text-ink">{r.label}</span>
          </div>
          <div className="relative">
            <Track axis={GOV_AXIS} items={r.items} base={ri} />
          </div>
        </div>
      ))}
    </div>
  );
}

function StepList({ rows }: { rows: TwoTrackRow[] }) {
  return (
    <ul className="flex flex-col">
      {rows.map((r) => (
        <li key={r.label} className="border-t border-line py-2.5">
          <p className="text-[15px] font-semibold leading-snug text-ink">{r.label}</p>
          <ul className="mt-1 flex flex-col gap-1">
            {r.steps.map((s) => (
              <li key={s.when + s.text} className="text-[15px] leading-snug text-ink-2">
                <span className="font-semibold text-ink">{s.when}</span> {s.text}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export function GovVsPlanTimeline() {
  const f = PHASES.slice(0, 2);
  return (
    <FigureShell title="Do voleb 2029 běží vládní předlohy souběžně s našimi fázemi F0 a F1; naše zákony přijdou až po nich">
      <div
        role="img"
        aria-label="Dvě dráhy nad sebou na ose let 2026 až 2029: sedm vládních reforem a kroky našeho plánu ve fázích F0 a F1. Totéž je v textové verzi pod obrázkem."
        className="hidden @min-[640px]:block"
      >
        <GanttHeader axis={GOV_AXIS} lw={LW} years={YEAR_TICKS} phases={false} />
        <div className="relative">
          <GridOverlay axis={GOV_AXIS} lw={LW} years={YEAR_TICKS} lines={LINES} />
          <Lane title="Vláda · stav k 20. 10. 2026" tone="gov" rows={GOV_ROWS} />
          <Lane title={`Náš plán · fáze ${f.map((p) => p.id).join(" a ")}`} tone="plan" rows={PLAN_ROWS} />
        </div>
        <p className="mt-2 text-right text-[14px] text-ink-2">{GOV_EDGE_NOTE} →</p>
      </div>

      <div className="@min-[640px]:hidden">
        <h4 className="mb-1 text-[13px] font-bold uppercase tracking-[0.06em] text-ink-2">Vláda · stav k 20. 10. 2026</h4>
        <StepList rows={GOV_ROWS} />
        <h4 className="mb-1 mt-6 text-[13px] font-bold uppercase tracking-[0.06em] text-forest">Náš plán · fáze F0 a F1</h4>
        <StepList rows={PLAN_ROWS} />
        <p className="mt-3 border-t border-line pt-3 text-[15px] leading-snug text-ink-2">{GOV_EDGE_NOTE}</p>
      </div>

      <Legend
        items={[
          { swatch: SW.diamond("gov"), text: "krok vlády" },
          { swatch: SW.diamond("gov", true), text: "krok vlády k ověření" },
          { swatch: SW.bar("gov"), text: "vládní krok v čase" },
          { swatch: SW.bar("prep"), text: "náš krok: konzultace, návrhy, věcný záměr" },
          { swatch: SW.bar("law"), text: "náš poslanecký návrh" },
          { swatch: SW.bar("ramp"), text: "pilot" },
          { swatch: SW.diamond("eff"), text: "náš termín" },
          { swatch: SW.gate, text: "brány B1 a B2" },
          { swatch: SW.soft, text: "1. 1. 2029: souběh vládních událostí" },
          { swatch: SW.election, text: "volby, říjen 2029" },
        ]}
      />
      <p className="mt-3 text-[14px] leading-snug text-ink-2">
        Sesterská preskripce a konvergence CZ-DRG v ose chybí, protože nemají veřejný termín.
      </p>

      <TextVersion
        caption="Vládní reformy 2026 až 2029 a kroky našeho plánu ve fázích F0 a F1"
        header={["Dráha a řádek", "Termíny a kroky", "Zdroj"]}
        rows={[
          ...GOV_ROWS.map((r) => [`Vláda: ${r.label}`, r.steps.map((s) => `${s.when}: ${s.text}`).join(" "), r.src]),
          ...PLAN_ROWS.map((r) => [`Plán: ${r.label}`, r.steps.map((s) => `${s.when}: ${s.text}`).join(" "), r.src]),
        ]}
      />
    </FigureShell>
  );
}
