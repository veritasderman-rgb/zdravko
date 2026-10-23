import { CodeRef } from "@/components/web/ui";
import { ELECTION_LINE, PILLAR_AXIS, PILLAR_ROWS, PILLAR_UNDATED, type PillarRow } from "@/content/figures/timelines";
import { FigureShell, GanttHeader, GridOverlay, Legend, SW, TextVersion, Track, YEARS, gateLines } from "./gantt-core";

/**
 * Obrázek ř. 1184: harmonogram pilířů 4 a 5, základní scénář Vláda 2030.
 * Řádky = opatření, pruhy od podnětu po účinnost, osa 2027–2036 (po roce 2035 žádné opatření
 * pilířů 4 a 5 nemá ve studii termín). Úzký sloupec: seznam po opatřeních s termínem.
 */

const LW = 244;
const YEAR_TICKS = YEARS(2027, 2035);
const LINES = [...gateLines(), ELECTION_LINE];

const GROUPS = [
  { pillar: 4 as const, title: "Pilíř 4 · prevence a daně za zdraví" },
  { pillar: 5 as const, title: "Pilíř 5 · péče doma a závěr života" },
];

function RowLabel({ r }: { r: PillarRow }) {
  return (
    <div className="flex items-start gap-2 py-1.5 pr-3">
      <span className="mt-px w-[58px] shrink-0">
        <CodeRef code={r.code} link={false} />
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold leading-tight text-ink">{r.label}</span>
        <span className="mt-0.5 block text-[13px] leading-tight text-muted">{r.short}</span>
      </span>
    </div>
  );
}

export function PillarsGantt() {
  return (
    <FigureShell title="Daně za zdraví začnou platit v letech 2031 až 2033, z péče doma vyžaduje zákon jen jeden krok z pěti">
      {/* Širší sloupec: Gantt */}
      <div
        role="img"
        aria-label="Ganttův přehled opatření pilířů 4 a 5 od podnětu po účinnost, roky 2027 až 2035, s čarami bran B1 až B4. Totéž je v textové verzi pod obrázkem."
        className="hidden @min-[640px]:block"
      >
        <GanttHeader axis={PILLAR_AXIS} lw={LW} years={YEAR_TICKS} />
        <div className="relative">
          <GridOverlay axis={PILLAR_AXIS} lw={LW} years={YEAR_TICKS} lines={LINES} />
          {GROUPS.map((g) => (
            <div key={g.pillar}>
              <div className="relative bg-stone px-3 py-1 text-[13px] font-bold uppercase tracking-[0.06em] text-forest">{g.title}</div>
              {PILLAR_ROWS.filter((r) => r.pillar === g.pillar).map((r, ri) => (
                <div key={r.code} className="grid min-h-[46px] border-b border-line" style={{ gridTemplateColumns: `${LW}px 1fr` }}>
                  <RowLabel r={r} />
                  <div className="relative">
                    <Track axis={PILLAR_AXIS} items={r.items} base={ri} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Úzký sloupec: seznam po opatřeních */}
      <div className="@min-[640px]:hidden">
        {GROUPS.map((g) => (
          <section key={g.pillar} className="mb-5">
            <h4 className="mb-2 text-[13px] font-bold uppercase tracking-[0.06em] text-forest">{g.title}</h4>
            <ul className="flex flex-col">
              {PILLAR_ROWS.filter((r) => r.pillar === g.pillar).map((r) => (
                <li key={r.code} className="border-t border-line py-2.5">
                  <div className="flex items-start gap-2">
                    <span className="mt-px shrink-0">
                      <CodeRef code={r.code} link={false} />
                    </span>
                    <span className="text-[15px] font-semibold leading-snug text-ink">{r.label}</span>
                  </div>
                  <p className="mt-1 text-[15px] leading-snug text-ink-2">{r.term}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Legend
        items={[
          { swatch: SW.bar("prep"), text: "podněty, konzultace, věcný záměr" },
          { swatch: SW.bar("prep", true), text: "začátek studie neuvádí" },
          { swatch: SW.bar("law"), text: "zákon: od předložení po účinnost" },
          { swatch: SW.bar("ramp"), text: "náběh" },
          { swatch: SW.sub("ramp"), text: "ohlášení, notifikace (pod pruhem)" },
          { swatch: SW.diamond("eff"), text: "účinnost (u vyhlášky rok)" },
          { swatch: SW.diamond("step"), text: "další stupeň, rozhodnutí" },
          { swatch: SW.diamond("step", true), text: "nejdříve" },
          { swatch: SW.gate, text: "brány B1 až B4" },
          { swatch: SW.election, text: "volby, říjen 2029" },
        ]}
      />

      <p className="mt-3 text-[14px] leading-snug text-ink-2">
        Pod názvem opatření je rok předložení zákona a den jeho účinnosti; u vyhlášek rok, na který platí.
      </p>
      <p className="mt-2 text-[14px] leading-snug text-ink-2">
        Bez termínu ve studii, proto nejsou na ose:{" "}
        {PILLAR_UNDATED.map((u, i) => (
          <span key={u.code}>
            <CodeRef code={u.code} link={false} /> {u.label.toLowerCase()}
            {i < PILLAR_UNDATED.length - 1 ? "; " : "."}
          </span>
        ))}
      </p>

      <TextVersion
        caption="Opatření pilířů 4 a 5 a jejich termíny v základním scénáři Vláda 2030"
        header={["Opatření", "Termín", "Zdroj"]}
        rows={[
          ...PILLAR_ROWS.map((r) => [
            <span key={r.code}>
              <CodeRef code={r.code} link={false} /> {r.label}
            </span>,
            r.term,
            r.src,
          ]),
          ...PILLAR_UNDATED.map((u) => [
            <span key={u.code}>
              <CodeRef code={u.code} link={false} /> {u.label}
            </span>,
            u.term,
            u.src,
          ]),
        ]}
      />
    </FigureShell>
  );
}
