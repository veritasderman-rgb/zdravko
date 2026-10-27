import { CONFLICT, FUNDING, META, PATIENT_JOURNEY } from "@/content/reforma";
import { COST, JOIN, NOT_DOING_SHORT, PITCH, PROBLEM, SOLUTION, STUDY_POINTS, TIMELINE } from "@/content/podklady";
import { Mark, PageSize, Qr, shortUrl } from "@/components/podklady/qr";
import { pressContact } from "@/lib/privacy";
import { SITE } from "@/lib/site";

/**
 * Prezentace 16 : 9 pro novináře a k promítnutí: stejná linka jako handout.
 * Zdroj pro public/podklady/zdravi-bliz-lidem-prezentace.pdf (pnpm pdf podklady).
 */
export const dynamic = "force-static";
export const metadata = { title: "Prezentace k tisku", robots: { index: false, follow: false } };

const VERSION_DATE = META.subtitle.split(" · ").pop() ?? "";
const STEPS = ["Máme problém", "Nabízíme řešení", "Detaily jsou ve studii", "Zapojte se"];
const JOURNEY = [0, 3, 5].map((i) => PATIENT_JOURNEY[i]);
const fmt = (v: number) => v.toLocaleString("cs-CZ", { maximumFractionDigits: 1 });

function Slide({ n, step, title, children, dark = false }: { n: number; step?: number; title?: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <section className={`sheet sheet-slide flex flex-col ${dark ? "bg-forest! text-on-dark" : ""}`} aria-label={`Snímek ${n}`}>
      {(step || title) && (
        <header className="flex flex-col gap-[0.12in]">
          {step && <p className={`text-[13pt] font-bold uppercase tracking-[0.08em] ${dark ? "text-honey" : "text-forest"}`}>{`${step}. ${STEPS[step - 1]}`}</p>}
          {title && <h2 className={`max-w-[11in] text-balance font-serif text-[32pt] font-semibold leading-[1.08] tracking-[-0.01em] ${dark ? "text-white" : "text-ink"}`}>{title}</h2>}
        </header>
      )}
      <div className="mt-[0.35in] flex min-h-0 flex-1 flex-col">{children}</div>
      <footer className={`mt-[0.2in] flex items-center justify-between text-[10pt] ${dark ? "text-on-dark-muted" : "text-muted"}`}>
        <span className="flex items-center gap-2">
          <Mark className="size-[0.26in]" />
          {PITCH.title} · {PITCH.subtitle.toLowerCase()}
        </span>
        <span>{n}</span>
      </footer>
    </section>
  );
}

function Big({ value, label, source }: { value: string; label: string; source?: string }) {
  return (
    <div className="flex flex-col gap-[0.08in]">
      <span className="whitespace-nowrap font-serif text-[38pt] font-semibold leading-none text-forest [font-variant-numeric:lining-nums]">{value}</span>
      <span className="text-[17pt] leading-snug text-ink">{label}</span>
      {source && <span className="text-[10pt] text-muted">Zdroj: {source}</span>}
    </div>
  );
}

export default async function PrezentacePage() {
  const contact = pressContact();
  const studyUrl = `${SITE}/studie`;
  const joinUrl = `${SITE}/zapojte-se`;
  const fundTotal = FUNDING.rows.reduce((s, r) => s + r.value, 0);
  const fundColors = ["#1f4a3d", "#2e4f46", "#a9c4b5", "#dce8e0", "#f2d29b"];
  let n = 0;
  return (
    <div data-pdf-ready>
      <PageSize size="13.333in 7.5in" />
      <Slide n={++n} dark>
        <div className="flex flex-1 flex-col justify-center gap-[0.3in]">
          <Mark className="size-[0.9in]" />
          <h1 className="font-serif text-[54pt] font-semibold leading-none tracking-[-0.02em] text-white">{PITCH.title}</h1>
          <p className="max-w-[9.5in] text-[22pt] leading-snug text-on-dark">Plán reformy zdravotnictví na tři volební období</p>
          <p className="text-[14pt] text-on-dark-muted">
            Verze 3.2 ke konzultaci, {VERSION_DATE} · {META.author}
          </p>
        </div>
      </Slide>

      <Slide n={++n} title="O co nám jde">
        <p className="max-w-[11in] text-[20pt] leading-snug text-ink-2">{PITCH.claim}</p>
        <ol className="mt-auto grid grid-cols-4 gap-[0.25in]">
          {STEPS.map((s, i) => (
            <li key={s} className={`flex flex-col gap-[0.12in] rounded-[0.12in] p-[0.25in] ${i === 3 ? "bg-forest text-white" : "bg-sand text-ink"}`}>
              <span className={`font-serif text-[30pt] font-semibold leading-none ${i === 3 ? "text-honey" : "text-forest"}`}>{i + 1}</span>
              <span className="font-serif text-[18pt] font-semibold leading-tight">{s}</span>
            </li>
          ))}
        </ol>
      </Slide>

      <Slide n={++n} step={1} title="Přibývá lidí, kteří potřebují péči, a ubývá praktiků">
        <div className="grid flex-1 grid-cols-2 gap-[0.6in]">
          <Big value={PROBLEM[0].value} label={PROBLEM[0].text} source={PROBLEM[0].source} />
          <Big value={PROBLEM[1].value} label={PROBLEM[1].text} source={PROBLEM[1].source} />
        </div>
      </Slide>

      <Slide n={++n} step={1} title="Peníze končí na akutních lůžkách a pojištění bude chybět i bez reformy">
        <div className="grid flex-1 grid-cols-2 gap-[0.6in]">
          <Big value={PROBLEM[2].value} label={PROBLEM[2].text} source={PROBLEM[2].source} />
          <Big value={PROBLEM[3].value} label={PROBLEM[3].text} source={PROBLEM[3].source} />
        </div>
      </Slide>

      <Slide n={++n} step={2} title="Pět změn, které lidé pocítí">
        <ol className="grid flex-1 grid-cols-5 gap-[0.2in]">
          {SOLUTION.map((s) => (
            <li key={s.n} className="flex flex-col gap-[0.12in] rounded-[0.12in] bg-sand p-[0.22in]">
              <span className="font-serif text-[30pt] font-semibold leading-none text-forest">{s.n}</span>
              <span className="font-serif text-[15pt] font-semibold leading-tight text-ink">{s.title}</span>
              <span className="text-[12pt] leading-snug text-ink-2">{s.text}</span>
            </li>
          ))}
        </ol>
      </Slide>

      <Slide n={++n} step={2} title="Dnes a po reformě">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="text-[12pt] uppercase tracking-[0.06em]">
              <th className="w-[2.2in] pb-[0.1in]" />
              <th className="pb-[0.1in] pr-[0.3in] text-muted">Dnes</th>
              <th className="pb-[0.1in] text-forest">Po reformě</th>
            </tr>
          </thead>
          <tbody>
            {JOURNEY.map((j) => (
              <tr key={j.step} className="border-t border-line align-top">
                <th className="py-[0.14in] pr-[0.3in] font-serif text-[16pt] font-semibold text-ink">{j.step}</th>
                <td className="py-[0.14in] pr-[0.3in] text-[12.5pt] leading-snug text-ink-2">{j.today}</td>
                <td className="py-[0.14in] text-[12.5pt] leading-snug text-ink">{j.after}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Slide>

      <Slide n={++n} step={2} title="Co to stojí a kdo to zaplatí">
        <dl className="grid grid-cols-4 gap-[0.3in]">
          {COST.map((c) => (
            <div key={c.value} className="flex flex-col gap-[0.06in] border-t-[3px] border-forest pt-[0.12in]">
              <dt className="font-serif text-[26pt] font-semibold leading-tight text-ink">{c.value}</dt>
              <dd className="text-[12pt] leading-snug text-ink-2">{c.label}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto">
          <p className="text-[13pt] font-bold text-ink">Kdo to zaplatí: mld. Kč ročně kolem roku 2038</p>
          <div className="mt-[0.12in] flex h-[0.42in] overflow-hidden rounded-[0.08in]">
            {FUNDING.rows.map((r, i) => (
              <span key={r.label} style={{ width: `${(r.value / fundTotal) * 100}%`, background: fundColors[i % fundColors.length] }} />
            ))}
          </div>
          <ul className="mt-[0.14in] grid grid-cols-5 gap-[0.2in] text-[10.5pt] leading-snug text-ink-2">
            {FUNDING.rows.map((r, i) => (
              <li key={r.label} className="flex gap-[0.08in]">
                <span aria-hidden className="mt-[0.04in] size-[0.14in] shrink-0 rounded-[0.03in]" style={{ background: fundColors[i % fundColors.length] }} />
                <span>
                  <span className="font-bold text-ink">{fmt(r.value)} mld. Kč</span> {r.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Slide>

      <Slide n={++n} step={2} title="Kdy a co neděláme">
        <div className="grid flex-1 grid-cols-[1.2fr_1fr] gap-[0.6in]">
          <ol className="flex flex-col">
            {TIMELINE.map((t) => (
              <li key={t.when} className="flex gap-[0.3in] border-t border-line py-[0.14in] text-[15pt] leading-snug">
                <span className="w-[2.2in] shrink-0 font-bold text-ink">{t.when}</span>
                <span className="text-ink-2">{t.what}</span>
              </li>
            ))}
          </ol>
          <ul className="flex flex-col">
            {NOT_DOING_SHORT.map((t) => (
              <li key={t} className="flex gap-[0.15in] border-t border-line py-[0.14in] text-[15pt] leading-snug text-ink">
                <span aria-hidden className="font-bold text-forest">✕</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Slide>

      <Slide n={++n} step={3} title="Každé číslo má zdroj, každé opatření termín">
        <div className="grid flex-1 grid-cols-[1fr_2.6in] gap-[0.6in]">
          <div className="flex flex-col">
            <ul className="flex flex-col gap-[0.16in]">
              {STUDY_POINTS.map((p) => (
                <li key={p} className="flex gap-[0.18in] text-[17pt] leading-snug text-ink">
                  <span aria-hidden className="mt-[0.12in] size-[0.12in] shrink-0 rounded-full bg-forest" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-auto font-serif text-[24pt] font-semibold text-forest">{shortUrl(studyUrl)}</p>
          </div>
          <Qr url={studyUrl} className="self-center" />
        </div>
      </Slide>

      <Slide n={++n} step={4} title={`Zapojte se! Připomínky přijímáme do ${META.deadline}`} dark>
        <div className="grid flex-1 grid-cols-[1fr_2.6in] gap-[0.6in]">
          <div className="flex flex-col">
            <ul className="grid grid-cols-2 gap-x-[0.4in] gap-y-[0.25in]">
              {JOIN.map((j) => (
                <li key={j.title} className="text-[14pt] leading-snug">
                  <span className="block font-serif text-[18pt] font-semibold text-white">{j.title}</span>
                  <span className="text-on-dark-muted">{j.text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-auto font-serif text-[24pt] font-semibold text-honey">{shortUrl(joinUrl)}</p>
            <p className="mt-[0.08in] text-[12pt] text-on-dark-muted">Kontakt: {contact}</p>
          </div>
          <div className="self-center rounded-[0.1in] bg-white p-[0.14in]">
            <Qr url={joinUrl} />
          </div>
        </div>
      </Slide>

      <Slide n={++n} title="Střet zájmů říkáme předem">
        <p className="max-w-[11in] text-[18pt] leading-relaxed text-ink-2">{CONFLICT}</p>
      </Slide>
    </div>
  );
}
