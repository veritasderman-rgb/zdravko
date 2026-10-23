import { ACTOR_MAP as D } from "@/content/figures/diagrams";
import { MUTED_MARK } from "@/components/charts/theme";
import { DiagramFrame, Narrow, SourceNote, vi } from "./shared";

/** Mapa aktérů: vliv na prosazení × dnešní postoj k jádru reformy; pracovní odhad RT k ověření (ř. 1846–1873). */

type Q = "tl" | "tr" | "bl" | "br";
const quadrant = (a: { stance: number; influence: number }): Q => (`${a.influence >= 0.5 ? "t" : "b"}${a.stance >= 0.5 ? "r" : "l"}`) as Q;
const ORDER: Q[] = ["tl", "tr", "bl", "br"];

function Dot({ hot }: { hot?: boolean }) {
  return <span aria-hidden className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ background: hot ? "#1f4a3d" : MUTED_MARK }} />;
}

export function ActorMapFigure() {
  return (
    <DiagramFrame
      title={D.title}
      subtitle={D.subtitle}
      verify="Pracovní odhad RT, k ověření v konzultacích 2027"
      legend={[
        { swatch: <Dot hot />, label: "nejvíc vyjednávání" },
        { swatch: <Dot />, label: "další aktér" },
      ]}
      textVersion={
        <>
          <p>Umístění je pracovní odhad resortního týmu, ne zjištěný postoj; první jednání v roce 2027 ho ověří a mapa se překreslí.</p>
          {ORDER.map((q) => (
            <div key={q}>
              <p className="font-semibold text-ink">{D.quadrants[q]}</p>
              <ul className="list-disc pl-5">
                {D.actors
                  .filter((a) => quadrant(a) === q)
                  .map((a) => (
                    <li key={a.name}>
                      {a.name}: první krok {a.first} ({a.when})
                    </li>
                  ))}
              </ul>
            </div>
          ))}
          <SourceNote lines={D.source.lines} />
        </>
      }
    >
      <div className="hidden @min-[640px]:block">
        <div className="grid grid-cols-[28px_1fr] gap-2">
          <div className="relative">
            <span className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-[13px] text-muted">
              vliv na prosazení reformy: nízký → vysoký
            </span>
          </div>
          <div>
            <div className="relative aspect-[600/400] w-full rounded-[10px] border border-line-strong bg-paper" role="group" aria-label="Mapa aktérů: vliv × postoj">
              <span aria-hidden className="absolute bottom-0 left-1/2 top-0 border-l border-dashed border-line-strong" />
              <span aria-hidden className="absolute left-0 right-0 top-1/2 border-t border-dashed border-line-strong" />
              <span className="absolute left-3 top-2 text-[13px] font-semibold text-muted">{D.quadrants.tl}</span>
              <span className="absolute right-3 top-2 text-[13px] font-semibold text-muted">{D.quadrants.tr}</span>
              <span className="absolute bottom-2 left-3 text-[13px] font-semibold text-muted">{D.quadrants.bl}</span>
              <span className="absolute bottom-2 right-3 text-[13px] font-semibold text-muted">{D.quadrants.br}</span>
              {D.actors.map((a, k) => (
                <span
                  key={a.name}
                  data-anim
                  className={`absolute flex items-center gap-1.5 whitespace-nowrap text-[13px] leading-none ${a.hot ? "font-semibold text-ink" : "text-ink-2"} ${a.labelLeft ? "flex-row-reverse" : ""}`}
                  style={{ ...vi(k), left: `${a.stance * 100}%`, top: `${(1 - a.influence) * 100}%`, translate: a.labelLeft ? "calc(-100% + 6px) -50%" : "-6px -50%" }}
                >
                  <Dot hot={a.hot} />
                  {a.name}
                </span>
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[13px] text-muted">
              <span>odmítavý</span>
              <span>dnešní postoj k jádru reformy</span>
              <span>podporující</span>
            </div>
          </div>
        </div>
      </div>
      <Narrow className="grid gap-3">
        {ORDER.map((q, qi) => (
          <section key={q} aria-label={D.quadrants[q]} data-anim style={vi(qi)} className={`rounded-[12px] border p-3 ${q === "tl" ? "border-forest bg-sage-soft" : "border-line-strong bg-paper"}`}>
            <p className="mb-1.5 text-[15px] font-bold text-ink">{D.quadrants[q]}</p>
            <ul className="flex flex-col gap-1">
              {D.actors
                .filter((a) => quadrant(a) === q)
                .map((a) => (
                  <li key={a.name} className={`flex items-center gap-2 text-[15px] ${a.hot ? "font-semibold" : ""}`}>
                    <Dot hot={a.hot} />
                    {a.name}
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </Narrow>
      <p className="mt-3 text-[13px] leading-snug text-muted">Nejdřív jednáme s aktéry vlevo nahoře, protože bez nich se jádro neprosadí ani s vládní většinou.</p>
    </DiagramFrame>
  );
}
