import registr from "@/content/registr.json";
import { MAIN_INDICATORS, MATRIX_GROUPS, ORG_GROUPS, ORG_MANIFEST, type OrgItem } from "@/content/figures/vazby";
import { DiagramFrame, SwatchBox, type LegendItem } from "./shared";

/**
 * Organigramy pilířů a matice vlivů na ukazatele. Obojí se skládá přímo z registru
 * opatření (Příloha A studie, registr.json), takže nové opatření v registru se tu
 * objeví samo; kontrola úplnosti je ve scripts/check-vazby.ts.
 */

type Reg = { code: string; label: string; layer: string; area: string; wave: string; termBase: string; indicator: string };
const REG = new Map((registr as Reg[]).map((r) => [r.code, r]));

/** Název bez dlouhé závorky s výčtem. */
function shortLabel(label: string) {
  const cut = label.replace(/\s*\((?:[^()]|\([^()]*\))*\)\s*$/, "");
  return cut.length >= 12 ? cut : label;
}

function shortTerm(t: string) {
  if (!t || t === "—") return "";
  const parts = t.split(";").map((s) => s.trim()).filter(Boolean);
  const out = parts.slice(0, 2).join("; ");
  return out.length > 90 ? `${out.slice(0, 88).replace(/\s+\S*$/, "")} …` : out;
}

function waveText(w: string) {
  if (!w || w === "—") return "";
  return `vlna ${w.replace(/\s*\(.*\)\s*/g, "")}`;
}

/** Ukazatele z registru: hlavní část = měří účinek, závorka „… sledují“ = jen sleduje. */
export function indicatorsOf(code: string) {
  const raw = REG.get(code)?.indicator ?? "";
  const [main, paren = ""] = raw.split("(");
  const pick = (s: string): string[] => s.match(/\b[HD]\d{1,2}\b/g) ?? [];
  const tracked: string[] = /sleduj/.test(paren) ? pick(paren) : [];
  const measured = [...pick(main), ...(/sleduj/.test(paren) ? [] : pick(paren))];
  return { measured, tracked };
}

const KIND = (code: string) =>
  /^J\d/.test(code) ? "core" : /^P\d/.test(code) ? "cond" : "base";

function OrgCard({ code, root = false }: { code: string; root?: boolean }) {
  const r = REG.get(code);
  if (!r) return null;
  const kind = KIND(code);
  const cls =
    kind === "core" ? "border-2 border-forest bg-sage-soft" : kind === "cond" ? "border-2 border-dashed border-forest bg-paper" : /^M/.test(code) ? "border border-line-strong bg-sand" : "border border-forest/50 bg-paper";
  const { measured } = indicatorsOf(code);
  const meta = [waveText(r.wave), shortTerm(r.termBase)].filter(Boolean).join(" · ");
  return (
    <a
      href={`/studie?q=${encodeURIComponent(code)}`}
      className={`org-card block rounded-[10px] px-3 py-2 text-ink no-underline transition-shadow hover:shadow-md ${cls} ${root ? "min-h-[84px]" : ""}`}
      title={r.label}
    >
      <span className={`block font-semibold leading-snug ${root ? "text-[15px]" : "text-[14px]"}`}>
        <span className="mr-1.5 inline-block rounded-[5px] bg-stone px-1.5 font-mono text-[13px] font-normal">{code}</span>
        {shortLabel(r.label)}
      </span>
      {meta && <span className="mt-1 block text-[13px] leading-snug text-ink-2">{meta}</span>}
      {measured.length > 0 && (
        <span className="mt-1.5 flex flex-wrap gap-1" aria-label="Ukazatele">
          {measured.map((m) => (
            <span key={m} className={`rounded-full px-1.5 text-[12px] font-semibold leading-5 ${m.startsWith("H") ? "bg-forest text-white" : "bg-stone text-ink-2"}`}>
              {m}
            </span>
          ))}
        </span>
      )}
    </a>
  );
}

function Branch({ items }: { items: OrgItem[] }) {
  return (
    <ul className="relative mt-2 ml-3 flex flex-col gap-2 border-l border-line-strong pl-4">
      {items.map((it) => (
        <li key={it.code} className="relative before:absolute before:-left-4 before:top-5 before:h-px before:w-4 before:bg-line-strong">
          <OrgCard code={it.code} />
          {it.children && <Branch items={it.children} />}
        </li>
      ))}
    </ul>
  );
}

const ORG_LEGEND: LegendItem[] = [
  { swatch: <SwatchBox kind="core" />, label: "jádro (J1–J10)" },
  { swatch: <SwatchBox kind="cond" />, label: "podmínka (P1–P5)" },
  { swatch: <span aria-hidden className="inline-block h-3.5 w-5 shrink-0 rounded-[3px] border border-forest/50 bg-paper" />, label: "doplňkové opatření pilíře" },
  { swatch: <span aria-hidden className="inline-block h-3.5 w-5 shrink-0 rounded-[3px] border border-line-strong bg-sand" />, label: "opatření z Manifestu" },
  { swatch: <span aria-hidden className="inline-block rounded-full bg-forest px-1.5 text-[12px] font-semibold leading-5 text-white">H5</span>, label: "hlavní ukazatel, kterým se měří účinek" },
];

export function VazbyOrgFigure() {
  const total = registr.length;
  const textVersion = (
    <>
      {ORG_GROUPS.map((g) => (
        <div key={g.id}>
          <p className="font-semibold text-ink">{g.title}</p>
          <ul className="list-disc pl-5">
            {g.roots.map((r) => (
              <li key={r.code}>
                {r.code} {shortLabel(REG.get(r.code)?.label ?? "")}
                {r.children && `: ${flat(r.children).map((c) => `${c} ${shortLabel(REG.get(c)?.label ?? "")}`).join("; ")}`}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div>
        <p className="font-semibold text-ink">Doprovod Manifestu bez přímé vazby na jádro</p>
        <ul className="list-disc pl-5">
          {ORG_MANIFEST.map((a) => (
            <li key={a.area}>
              {a.area}: {a.codes.map((c) => `${c} ${shortLabel(REG.get(c)?.label ?? "")}`).join("; ")}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
  return (
    <DiagramFrame
      title="Každé opatření visí na opatření jádra, na kterém stojí"
      subtitle={`Organigramy pěti pilířů a doprovodu Manifestu · všech ${total} opatření z registru · klikněte na opatření a najdete ho ve studii`}
      legend={ORG_LEGEND}
      textVersion={textVersion}
    >
      <div className="org-groups flex flex-col gap-8">
        {ORG_GROUPS.map((g) => (
          <section key={g.id} aria-label={g.title} className="org-group">
            <div className="org-head relative flex flex-col items-center pb-5 after:absolute after:bottom-0 after:left-1/2 after:h-5 after:w-px after:bg-line-strong">
              <p className="rounded-full bg-forest px-4 py-1.5 text-center text-[15px] font-bold text-white">{g.title}</p>
              <p className="mt-2 max-w-[60ch] text-center text-[14px] leading-snug text-ink-2">{g.lead}</p>
              <span aria-hidden className="org-keep hidden" />
            </div>
            <div className="grid gap-x-3 gap-y-6 [grid-template-columns:repeat(auto-fit,minmax(196px,1fr))]">
              {g.roots.map((r) => (
                <div
                  key={r.code}
                  className="relative pt-5 before:absolute before:left-1/2 before:top-0 before:h-5 before:w-px before:bg-line-strong after:absolute after:left-0 after:right-0 after:top-0 after:h-px after:bg-line-strong first:after:left-1/2 last:after:right-1/2"
                >
                  <OrgCard code={r.code} root />
                  {r.children && <Branch items={r.children} />}
                </div>
              ))}
            </div>
          </section>
        ))}
        <section aria-label="Doprovod Manifestu" className="org-group">
          <div className="flex flex-col items-center pb-4">
            <p className="rounded-full border-2 border-forest px-4 py-1.5 text-center text-[15px] font-bold text-forest">Doprovod Manifestu bez přímé vazby na jádro</p>
            <p className="mt-2 max-w-[60ch] text-center text-[14px] leading-snug text-ink-2">Tato opatření mají vlastní harmonogram a jádro reformy nezdržují ani nepodmiňují.</p>
          </div>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
            {ORG_MANIFEST.map((a) => (
              <div key={a.area} className="rounded-[12px] border border-line p-3">
                <p className="text-[14px] font-bold text-ink">{a.area}</p>
                <div className="mt-2 flex flex-col gap-2">
                  {a.codes.map((c) => (
                    <OrgCard key={c} code={c} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DiagramFrame>
  );
}

function flat(items: OrgItem[]): string[] {
  return items.flatMap((i) => [i.code, ...(i.children ? flat(i.children) : [])]);
}

// ---------------------------------------------------------------------------
// Matice vlivů
// ---------------------------------------------------------------------------

export function VazbyMatrixFigure() {
  const all = registr as Reg[];
  const groups = MATRIX_GROUPS.map((g) => ({
    title: g.title,
    rows: all.filter((r) => g.prefixes.some((p) => (p.endsWith(".") ? r.code.startsWith(p) : p === "M" ? r.code.startsWith("M") : r.code === p))).filter((r) => {
      const { measured, tracked } = indicatorsOf(r.code);
      return measured.length + tracked.length > 0;
    }),
  })).filter((g) => g.rows.length > 0);
  const shown = groups.flatMap((g) => g.rows);
  const without = all.length - shown.length;
  const counts = MAIN_INDICATORS.map((h) => shown.filter((r) => indicatorsOf(r.code).measured.includes(h.code)).length);
  const top = MAIN_INDICATORS.map((h, k) => ({ ...h, n: counts[k] })).sort((a, b) => b.n - a.n);
  const weakest = top[top.length - 1];

  const textVersion = (
    <ul className="list-disc pl-5">
      {shown.map((r) => {
        const { measured, tracked } = indicatorsOf(r.code);
        return (
          <li key={r.code}>
            {r.code} {shortLabel(r.label)}: {measured.join(", ") || "—"}
            {tracked.length ? `; sleduje ${tracked.join(", ")}` : ""}
          </li>
        );
      })}
    </ul>
  );

  return (
    <DiagramFrame
      title={
        weakest.n === 0
          ? `Nejvíc opatření míří na ${top[0].short.toLowerCase()} (${top[0].code}); ${weakest.short.toLowerCase()} (${weakest.code}) přímo neměří žádné`
          : `Nejvíc opatření míří na ${top[0].short.toLowerCase()} (${top[0].code}); ${weakest.short.toLowerCase()} (${weakest.code}) měří nejméně`
      }
      subtitle={`Co se kde ovlivňuje · ${shown.length} opatření s vlastním ukazatelem × osm hlavních ukazatelů H1–H8 · všechny míří k cíli +5 let života ve zdraví`}
      legend={[
        { swatch: <Dot />, label: "ukazatel měří účinek opatření" },
        { swatch: <Dot hollow />, label: "ukazatel opatření jen sleduje" },
        { swatch: <span aria-hidden className="rounded-full bg-stone px-1.5 text-[12px] font-semibold leading-5 text-ink-2">D3</span>, label: "doplňkový ukazatel D1–D12" },
      ]}
      textVersion={textVersion}
    >
      <div className="vazby-scroll -mx-1 overflow-x-auto px-1" tabIndex={0} role="region" aria-label="Matice vlivů, na úzké obrazovce se posouvá do stran">
        <table className="vazby-matrix w-full min-w-[860px] table-fixed border-collapse text-[14px]">
          {/* Pevné šířky: název opatření 34 %, osm ukazatelů po 7 %, doplňkové 10 %; drží se i v tisku. */}
          <colgroup>
            <col style={{ width: "34%" }} />
            {MAIN_INDICATORS.map((h) => (
              <col key={h.code} style={{ width: "7%" }} />
            ))}
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="pb-2 text-left align-bottom text-[13px] font-bold uppercase tracking-[0.06em] text-muted">
                Opatření
              </th>
              {MAIN_INDICATORS.map((h) => (
                <th key={h.code} scope="col" className="px-1 pb-2 text-center align-bottom text-[12px] font-semibold leading-tight text-ink-2">
                  <span className="block font-mono text-[13px] font-bold text-ink">{h.code}</span>
                  {h.short}
                </th>
              ))}
              <th scope="col" className="pb-2 pl-2 text-left align-bottom text-[12px] font-semibold leading-tight text-ink-2">
                Doplňkové
              </th>
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g.title}>
              <tr>
                <th colSpan={MAIN_INDICATORS.length + 2} scope="colgroup" className="border-t-2 border-line-strong pb-1 pt-3 text-left text-[13px] font-bold uppercase tracking-[0.06em] text-forest">
                  {g.title}
                </th>
              </tr>
              {g.rows.map((r) => {
                const { measured, tracked } = indicatorsOf(r.code);
                const ds = [...measured, ...tracked].filter((x) => x.startsWith("D"));
                return (
                  <tr key={r.code} className="border-t border-line hover:bg-sand">
                    <th scope="row" className="py-1.5 pr-2 text-left font-normal leading-snug text-ink">
                      <span className="mr-1.5 inline-block rounded-[5px] bg-stone px-1.5 font-mono text-[13px]">{r.code}</span>
                      {shortLabel(r.label)}
                    </th>
                    {MAIN_INDICATORS.map((h) => (
                      <td key={h.code} className="text-center">
                        {measured.includes(h.code) ? <Dot label={`${r.code} měří ${h.code}`} /> : tracked.includes(h.code) ? <Dot hollow label={`${r.code} sleduje ${h.code}`} /> : null}
                      </td>
                    ))}
                    <td className="py-1 pl-2">
                      <span className="flex flex-wrap gap-1">
                        {ds.map((d) => (
                          <span key={d} className="rounded-full bg-stone px-1.5 text-[12px] font-semibold leading-5 text-ink-2">
                            {d}
                          </span>
                        ))}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          ))}
          <tfoot>
            <tr className="border-t-2 border-line-strong">
              <th scope="row" className="pt-2 text-left text-[13px] font-bold text-ink">
                Počet opatření, která ukazatel měří
              </th>
              {counts.map((n, k) => (
                <td key={MAIN_INDICATORS[k].code} className="pt-2 text-center font-mono text-[15px] font-bold text-ink">
                  {n}
                </td>
              ))}
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="mt-2 text-[14px] leading-snug text-muted">
        Zbylých {without} opatření z registru nemá vlastní ukazatel; jejich plnění se sleduje v registru a ve zprávě nezávislého hodnotitele. Všech osm hlavních ukazatelů míří k nadřazenému cíli prodloužit život ve zdraví o pět let.
      </p>
    </DiagramFrame>
  );
}

function Dot({ hollow = false, label }: { hollow?: boolean; label?: string }) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-block h-3.5 w-3.5 rounded-full align-middle ${hollow ? "border-2 border-forest bg-paper" : ""}`}
      // Plná tečka nese informaci barvou; inline pozadí zůstane i v tisku (print.css ruší jen pozadí z tříd).
      style={hollow ? undefined : { backgroundColor: "#1f4a3d" }}
    />
  );
}
