import Link from "next/link";
import { withPoolDb } from "@/db/pool";
import { PageHero, Section } from "@/components/web/ui";
import { EraseForm } from "@/components/web/privacy-forms";
import { exportPersonalData, openDataToken } from "@/lib/privacy-core";
import { privacySecret } from "@/lib/privacy";
import { KIND_LABEL, STATUS_LABEL, fmtDate } from "@/lib/labels";

export const dynamic = "force-dynamic";
export const metadata = { title: "Moje údaje", robots: { index: false } };

export default async function MyDataPage({ searchParams }: PageProps<"/ochrana-udaju/sprava">) {
  const sp = await searchParams;
  const token = typeof sp.t === "string" ? sp.t : "";
  const erased = sp.smazano === "1";
  const email = openDataToken(privacySecret(), token);

  if (!email) {
    return (
      <>
        <PageHero eyebrow="Moje údaje" title="Odkaz neplatí" lead="Odkaz na vaše údaje platí 24 hodin. O nový můžete požádat na stránce o ochraně údajů." />
        <Section tone="paper" title="Požádat o nový odkaz">
          <Link href="/ochrana-udaju#moje-udaje" className="text-[18px] font-semibold text-forest underline">
            Na stránku o ochraně údajů
          </Link>
        </Section>
      </>
    );
  }

  const data = await withPoolDb((db) => exportPersonalData(db, email));
  return (
    <>
      <PageHero eyebrow="Moje údaje" title="Co o vás evidujeme" lead={`Připomínky odeslané z adresy ${email}. Můžete si je stáhnout, nebo údaje smazat.`} />
      {erased && (
        <Section title="Údaje jsme smazali">
          <p role="status" className="max-w-[44em] rounded-card border border-line bg-sage-soft p-5 text-[18px] text-ink">
            Jméno, e-mail, organizaci a text vašich připomínek jsme odstranili. Ve vypořádání zůstává jen číslo připomínky, místo ve studii a stav vyřízení, bez
            vazby na vás.
          </p>
        </Section>
      )}
      <Section tone="paper" title={`Připomínky (${data.comments.length})`}>
        {data.comments.length === 0 ? (
          <p className="text-[18px] text-ink">S touto adresou u nás žádné připomínky nejsou.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {data.comments.map((c) => (
              <li key={c.id} className="rounded-card border border-line bg-paper p-4 text-[17px] text-ink">
                <p className="text-[15px] text-muted">
                  č. {c.id} · {fmtDate(c.submittedAt)} · {KIND_LABEL[c.kind] ?? c.kind} · {c.confirmed ? (STATUS_LABEL[c.status] ?? c.status) : "čeká na potvrzení e-mailem"}
                </p>
                {c.quote && <p className="mt-2 text-[16px] italic text-ink-2">K místu: „{c.quote}“</p>}
                <p className="mt-2 whitespace-pre-wrap">{c.body}</p>
                {c.proposal && (
                  <details className="mt-2">
                    <summary className="cursor-pointer font-semibold text-forest">Celý návrh opatření</summary>
                    <p className="mt-2 whitespace-pre-wrap text-[16px]">{c.proposal}</p>
                  </details>
                )}
                <p className="mt-2 text-[15px] text-muted">
                  Podepsáno: {c.name}
                  {c.organization ? `, ${c.organization}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6">
          <a href={`/ochrana-udaju/export?t=${encodeURIComponent(token)}`} className="text-[18px] font-semibold text-forest underline">
            Stáhnout všechno jako soubor (JSON)
          </a>
        </p>
      </Section>
      {data.comments.length > 0 && (
        <Section title="Smazat moje údaje" lead="Smažeme jméno, e-mail, organizaci a text vašich připomínek. Nepotvrzené připomínky zmizí celé. Ve vypořádání zůstane jen číslo připomínky, místo ve studii a stav vyřízení, bez vazby na vás.">
          <EraseForm token={token} />
        </Section>
      )}
    </>
  );
}
