import Link from "next/link";
import { FIVE_CHANGES, HONEST_CHANGES, NOT_DOING, PATIENT_JOURNEY } from "@/content/reforma";
import { Card, NextLink, PageHero, Section } from "@/components/web/ui";

export const metadata = { title: "Co chceme" };

export default function CoPage() {
  return (
    <>
      <PageHero eyebrow="Co chceme" title="Pět změn, které lidé pocítí" lead="Kolem roku 2038 má každý člověk v Česku svůj tým primární péče, ke specialistovi se dostává podle naléhavosti a na akutním lůžku leží jen tehdy, když ho skutečně potřebuje. Pět změn na sebe navazuje; každá má své číslo a termín." />

      <Section title="Změna po změně">
        <ol className="space-y-4">
          {FIVE_CHANGES.map((c) => (
            <li key={c.n} className="grid gap-4 rounded-xl border border-line bg-paper p-5 md:grid-cols-[1fr_2fr_1.3fr]">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Změna {c.n}</div>
                <h3 className="mt-1 text-xl font-semibold leading-snug">{c.title}</h3>
                <div className="mt-3 flex flex-wrap gap-1">
                  {c.codes.map((k) => (
                    <span key={k} className="code-ref">{k}</span>
                  ))}
                </div>
              </div>
              <div className="text-sm leading-relaxed">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted">Co uděláme</div>
                <p className="mt-1">{c.what}</p>
                <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">Co to přinese</div>
                <p className="mt-1">{c.brings}</p>
              </div>
              <div className="rounded-lg bg-accent-soft/50 p-3 text-sm leading-relaxed">
                <div className="text-xs font-semibold uppercase tracking-wide text-accent">Kdy</div>
                <p className="mt-1">{c.when}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 max-w-3xl text-sm text-muted">
          K tomu patří jedno pravidlo o penězích, které drží všech pět změn pohromadě: nový vzorec platby státu za děti, důchodce a studenty, který sleduje, kolik péče státní pojištěnci potřebují. Přijme ho vláda s účinností od 1. 1. 2031.
        </p>
      </Section>

      <Section eyebrow="Cesta pacienta" title="Co se změní pro pacienta, krok za krokem" lead="Největší změnu pocítí chronik, křehký senior a člověk bez praktika; pro zdravého třicátníka se změní málo.">
        <div className="overflow-hidden rounded-xl border border-line bg-paper">
          <div className="hidden grid-cols-[1fr_2fr_2fr] gap-4 border-b border-line bg-stone-50 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-muted md:grid">
            <div>Krok</div>
            <div>Dnes</div>
            <div>Po reformě</div>
          </div>
          {PATIENT_JOURNEY.map((r) => (
            <div key={r.step} className="grid gap-2 border-b border-line px-5 py-4 text-sm last:border-b-0 md:grid-cols-[1fr_2fr_2fr] md:gap-4">
              <div className="font-semibold">{r.step}</div>
              <div className="text-muted"><span className="md:hidden text-xs font-semibold uppercase tracking-wide">Dnes · </span>{r.today}</div>
              <div><span className="md:hidden text-xs font-semibold uppercase tracking-wide text-accent">Po reformě · </span>{r.after}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Card title="Co se změní, i když se vám to nebude líbit" tone="warm">
            <ul className="list-disc space-y-1 pl-5">
              {HONEST_CHANGES.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </Card>
          <Card title="Co se nezmění" tone="accent">
            Svobodná volba lékaře a pojišťovny zůstává. Přímý přístup ke specialistovi zůstává. O léčbě rozhoduje vždy člověk; technologie zapisuje a měří, nerozhoduje.
          </Card>
        </div>
      </Section>

      <Section eyebrow="Co reforma nedělá" title="Šest věcí, které výslovně nenavrhujeme" lead="Každá z nich by podkopala důvěru pacientů nebo zdravotníků, na které reforma spoléhá.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NOT_DOING.map((n) => <Card key={n.title} title={n.title}>{n.text}</Card>)}
        </div>
        <p className="mt-4 text-sm text-muted">
          Podrobně k jednotlivým opatřením J1 až J10 v <Link href="/rt" className="underline">odborné studii</Link> (zatím pro resortní tým).
        </p>
      </Section>

      <div className="mx-auto max-w-[1100px] px-4">
        <NextLink href="/jak" title="Jak a kdy" text="Pět fází, čtyři brány a čtyři pravidla, která platí bez ohledu na to, kdo vládne." />
      </div>
    </>
  );
}
