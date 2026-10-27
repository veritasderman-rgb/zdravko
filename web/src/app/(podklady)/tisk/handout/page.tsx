import { CONFLICT, META } from "@/content/reforma";
import { COST, JOIN, NOT_DOING_SHORT, PITCH, PROBLEM, SOLUTION, STUDY_POINTS, TIMELINE } from "@/content/podklady";
import { Mark, PageSize, Qr, shortUrl } from "@/components/podklady/qr";
import { pressContact } from "@/lib/privacy";
import { SITE } from "@/lib/site";

/**
 * Handout na dvě strany A4: máme problém, nabízíme řešení, detaily jsou ve studii, zapojte se.
 * Zdroj pro public/podklady/zdravi-bliz-lidem-handout.pdf (pnpm pdf podklady).
 */
export const dynamic = "force-static";
export const metadata = { title: "Handout k tisku", robots: { index: false, follow: false } };

const VERSION_DATE = META.subtitle.split(" · ").pop() ?? "";

function Step({ n, title, children }: { n: number; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex size-[9mm] shrink-0 items-center justify-center rounded-full bg-forest font-serif text-[14pt] font-semibold text-white">{n}</span>
      <h2 className="font-serif text-[19pt] font-semibold leading-none text-forest">{title}</h2>
      {children}
    </div>
  );
}

export default async function HandoutPage() {
  const contact = pressContact();
  const studyUrl = `${SITE}/studie`;
  const joinUrl = `${SITE}/zapojte-se`;
  return (
    <div data-pdf-ready>
      <PageSize size="210mm 297mm" />
      <section className="sheet sheet-a4 flex flex-col" aria-label="Strana 1">
        <header className="flex items-center justify-between gap-4 border-b-2 border-forest pb-[4mm]">
          <div className="flex items-center gap-3">
            <Mark className="size-[11mm]" />
            <span className="font-serif text-[18pt] font-semibold text-ink">{PITCH.title}</span>
          </div>
          <span className="text-right text-[9pt] leading-snug text-muted">
            {PITCH.subtitle}
            <br />
            {VERSION_DATE}
          </span>
        </header>

        <h1 className="mt-[7mm] text-balance font-serif text-[25pt] font-semibold leading-[1.08] tracking-[-0.01em] text-ink">Zdravotnictví potřebuje změnu. Máme plán a hledáme pro něj podporu.</h1>
        <p className="mt-[3mm] text-[11.5pt] leading-snug text-ink-2">{PITCH.claim}</p>

        <div className="mt-[7mm]">
          <Step n={1} title="Máme problém" />
          <ul className="mt-[4mm] grid grid-cols-2 gap-[4mm]">
            {PROBLEM.map((p) => (
              <li key={p.title} className="flex flex-col gap-[1.5mm] rounded-[3mm] bg-sand p-[4mm]">
                <span className="font-serif text-[17pt] font-semibold leading-none text-forest [font-variant-numeric:lining-nums]">{p.value}</span>
                <span className="text-[10.5pt] font-bold leading-tight text-ink">{p.title}</span>
                <span className="text-[9pt] leading-snug text-ink-2">{p.text}</span>
                <span className="mt-auto text-[7.5pt] text-muted">Zdroj: {p.source}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-[7mm]">
          <Step n={2} title="Nabízíme řešení" />
          <ol className="mt-[4mm] flex flex-col gap-[2.5mm]">
            {SOLUTION.map((s) => (
              <li key={s.n} className="flex gap-[4mm] border-t border-line pt-[2.5mm]">
                <span className="w-[6mm] shrink-0 font-serif text-[15pt] font-semibold leading-none text-forest">{s.n}</span>
                <span className="flex flex-col gap-[0.5mm]">
                  <span className="font-serif text-[12pt] font-semibold leading-tight text-ink">{s.title}</span>
                  <span className="text-[9.5pt] leading-snug text-ink-2">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-auto pt-[4mm] text-right text-[9pt] font-semibold text-forest">Co to stojí, kdy a jak se zapojit: na druhé straně →</p>
      </section>

      <section className="sheet sheet-a4 flex flex-col" aria-label="Strana 2">
        <div>
          <h2 className="font-serif text-[15pt] font-semibold text-ink">Co to stojí</h2>
          <dl className="mt-[3mm] grid grid-cols-4 gap-[4mm]">
            {COST.map((c) => (
              <div key={c.value} className="flex flex-col gap-[1mm] border-t-2 border-forest pt-[2mm]">
                <dt className="font-serif text-[15pt] font-semibold leading-tight text-ink">{c.value}</dt>
                <dd className="text-[8.5pt] leading-snug text-ink-2">{c.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-[6mm] grid grid-cols-[1.15fr_1fr] gap-[7mm]">
          <div>
            <h2 className="font-serif text-[15pt] font-semibold text-ink">Kdy</h2>
            <ol className="mt-[2mm] flex flex-col">
              {TIMELINE.map((t) => (
                <li key={t.when} className="flex gap-[3mm] border-t border-line py-[1.5mm] text-[9.5pt] leading-snug">
                  <span className="w-[26mm] shrink-0 font-bold text-ink">{t.when}</span>
                  <span className="text-ink-2">{t.what}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="font-serif text-[15pt] font-semibold text-ink">Co neděláme</h2>
            <ul className="mt-[2mm] flex flex-col">
              {NOT_DOING_SHORT.map((t) => (
                <li key={t} className="flex gap-[2.5mm] border-t border-line py-[1.5mm] text-[9.5pt] leading-snug text-ink-2">
                  <span aria-hidden className="font-bold text-forest">✕</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-[7mm] grid grid-cols-[1fr_32mm] gap-[6mm] rounded-[3mm] border-2 border-forest p-[5mm]">
          <div>
            <Step n={3} title="Detaily jsou ve studii" />
            <ul className="mt-[3mm] flex flex-col gap-[1.5mm]">
              {STUDY_POINTS.map((p) => (
                <li key={p} className="flex gap-[2.5mm] text-[9.5pt] leading-snug text-ink-2">
                  <span aria-hidden className="mt-[1.6mm] size-[1.6mm] shrink-0 rounded-full bg-forest" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-[3mm] font-serif text-[13pt] font-semibold text-forest">{shortUrl(studyUrl)}</p>
          </div>
          <Qr url={studyUrl} className="self-center" />
        </div>

        <div className="mt-[6mm] grid grid-cols-[1fr_32mm] gap-[6mm] rounded-[3mm] bg-forest p-[5mm] text-on-dark">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex size-[9mm] shrink-0 items-center justify-center rounded-full bg-honey font-serif text-[14pt] font-semibold text-forest-deep">4</span>
              <h2 className="font-serif text-[19pt] font-semibold leading-none text-white">Zapojte se!</h2>
            </div>
            <ul className="mt-[3mm] grid grid-cols-2 gap-x-[5mm] gap-y-[2.5mm]">
              {JOIN.map((j) => (
                <li key={j.title} className="text-[9.5pt] leading-snug">
                  <span className="block font-bold text-white">{j.title}</span>
                  <span className="text-on-dark-muted">{j.text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-[3mm] font-serif text-[13pt] font-semibold text-honey">{shortUrl(joinUrl)}</p>
          </div>
          <div className="self-center rounded-[2mm] bg-white p-[2mm]">
            <Qr url={joinUrl} />
          </div>
        </div>

        <footer className="mt-auto flex flex-col gap-[2mm] border-t border-line pt-[3mm] text-[8pt] leading-snug text-muted">
          <p>
            <span className="font-bold text-ink">Autor:</span> {META.author}. <span className="font-bold text-ink">Kontakt:</span> {contact}
          </p>
          <p>
            <span className="font-bold text-ink">Střet zájmů:</span> {CONFLICT}
          </p>
        </footer>
      </section>
    </div>
  );
}
