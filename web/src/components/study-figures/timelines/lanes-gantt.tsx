import { ELECTION_LINE, LANES, LANES_AXIS, type Lane } from "@/content/figures/timelines";
import { FigureShell, GanttHeader, GridOverlay, Legend, SW, TextVersion, Track, YEARS, gateLines } from "./gantt-core";

/**
 * Obrázek ř. 1816: harmonogram 2026–2038, sedm drah, základní scénář Vláda 2030.
 * Studie dráhy nepojmenovává; kroky z tabulky „Co všechno se musí stát“ (ř. 75–103) jsou
 * rozdělené do sedmi drah, každý krok do jedné. Brány jsou svislé čáry.
 */

const LW = 104;
const YEAR_TICKS = YEARS(2027, 2038);
const LINES = [...gateLines(), ELECTION_LINE];
const ROW_H = 28;

function rowsOf(lane: Lane) {
  const n = Math.max(...lane.events.map((e) => e.row)) + 1;
  return Array.from({ length: n }, (_, r) => lane.events.filter((e) => e.row === r).flatMap((e) => e.items));
}

/** Řádky drah s pořadím pro zpoždění animace (každý řádek o málo později než předchozí). */
const LANE_ROWS = LANES.reduce<{ lane: Lane; rows: ReturnType<typeof rowsOf>; start: number }[]>((acc, lane) => {
  const prev = acc[acc.length - 1];
  const start = prev ? prev.start + prev.rows.length : 0;
  return [...acc, { lane, rows: rowsOf(lane), start }];
}, []);

export function LanesGantt() {
  return (
    <FigureShell title="Finanční a daňové změny jdou na 1. 1. 2031 a velké zákony na 1. 1. 2032 až 2033, takže se nekumulují s rokem 2029">
      <div
        role="img"
        aria-label="Ganttův přehled sedmi drah reformy od listopadu 2026 do roku 2038 s čarami bran B1 až B4: konzultace a koalice, pilot, legislativa, peníze a úhrady, týmy a personál, síť lůžek a hodnocení. Totéž je v textové verzi pod obrázkem."
        className="hidden @min-[640px]:block"
      >
        <GanttHeader axis={LANES_AXIS} lw={LW} years={YEAR_TICKS} />
        <div className="relative">
          <GridOverlay axis={LANES_AXIS} lw={LW} years={YEAR_TICKS} lines={LINES} />
          {LANE_ROWS.map(({ lane, rows, start }) => (
            <div key={lane.id} className="grid border-b border-line-strong" style={{ gridTemplateColumns: `${LW}px 1fr` }}>
              <div className="relative bg-stone px-2 py-2 text-[13px] font-bold leading-tight text-forest">{lane.name}</div>
              <div className="py-1">
                {rows.map((items, r) => (
                  <Track key={r} axis={LANES_AXIS} items={items} h={ROW_H} base={(start + r) * 2} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="@min-[640px]:hidden">
        {LANES.map((lane) => (
          <section key={lane.id} className="mb-5">
            <h4 className="mb-1 bg-stone px-2 py-1 text-[13px] font-bold uppercase tracking-[0.06em] text-forest">{lane.name}</h4>
            <ul className="flex flex-col">
              {lane.events.map((e) => (
                <li key={e.step + e.when} className="border-t border-line py-2 first:border-t-0">
                  <p className="text-[15px] font-semibold leading-snug text-ink">{e.when}</p>
                  <p className="text-[15px] leading-snug text-ink-2">{e.text}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Legend
        items={[
          { swatch: SW.bar("prep"), text: "příprava, konzultace, věcný záměr" },
          { swatch: SW.bar("law"), text: "zákon: od předložení po účinnost" },
          { swatch: SW.bar("ramp"), text: "provoz, náběh" },
          { swatch: SW.diamond("eff"), text: "účinnost, cíl" },
          { swatch: SW.diamond("step"), text: "termín kroku" },
          { swatch: SW.gate, text: "brány B1 až B4" },
          { swatch: SW.election, text: "volby, říjen 2029" },
        ]}
      />
      <p className="mt-3 text-[14px] leading-snug text-ink-2">
        PN je pozměňovací návrh poslaneckého klubu. Účinnost podnětů podaných do 31. 1. 2027 už od 1. 1. 2028 závisí na dnešním ministerstvu a v základním scénáři se s ní nepočítá; první vyhláška nové vlády platí od 1. 1. 2031. Přesná data krajských voleb 2028 a voleb 2029 jsou orientační.
      </p>

      <TextVersion
        caption="Sedm drah reformy a jejich termíny v základním scénáři Vláda 2030"
        header={["Dráha", "Termín", "Co se děje", "Krok"]}
        rows={LANES.flatMap((lane) => lane.events.map((e) => [lane.name, e.when, e.text, e.step]))}
      />
    </FigureShell>
  );
}
