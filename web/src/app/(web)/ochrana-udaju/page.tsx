import { PageHero, Section } from "@/components/web/ui";
import { DataRequestForm } from "@/components/web/privacy-forms";
import { DATA_LINK_HOURS, RETENTION } from "@/lib/privacy-core";
import { privacyContact } from "@/lib/privacy";

export const metadata = {
  title: "Ochrana osobních údajů",
  description: "Jaké údaje ukládáme u připomínek ke studii, proč, jak dlouho a jak si je stáhnout nebo smazat.",
};

const P = "text-[18px] leading-relaxed text-ink";

export default function PrivacyPage() {
  const contact = privacyContact();
  const keep: [string, string][] = [
    ["Nepotvrzená připomínka (i s e-mailem)", `${RETENTION.unverifiedDays} dní od odeslání, pak ji smažeme celou`],
    ["Otisk adresy IP pro omezení počtu odeslání", `${RETENTION.rateHitsDays} dní`],
    ["Jméno a e-mail u veřejné připomínky", `do vypořádání, nejdéle ${RETENTION.personalMonths} měsíců od odeslání; pak je odstraníme a připomínka zůstane bez nich`],
    ["Text připomínky, místo ve studii a vypořádání", "jako záznam konzultace, bez jména a e-mailu"],
  ];
  return (
    <>
      <PageHero
        eyebrow="Ochrana osobních údajů"
        title="Jak zacházíme s vašimi údaji"
        lead="K připomínce potřebujeme jen jméno nebo přezdívku a e-mail. Nikde je nezveřejňujeme, nikomu je nepředáváme a po vypořádání je smažeme."
      />

      <Section tone="paper" title="Co ukládáme a proč">
        <div className="flex max-w-[44em] flex-col gap-4">
          <p className={P}>
            U veřejné připomínky ukládáme jméno nebo přezdívku, e-mail, nepovinně organizaci, text připomínky, místo ve studii, ke kterému míří, a čas odeslání.
            Údaje potřebujeme, abychom připomínky mohli vypořádat a v případě potřeby se zeptat na podrobnosti. Zpracováváme je z oprávněného zájmu na vedení
            veřejné konzultace ke studii.
          </p>
          <p className={P}>
            E-mail ověřujeme odkazem: připomínka se k týmu dostane, až ji majitel e-mailu potvrdí. Tak nikdo nemůže připomínkovat vaším jménem a roboti nezahltí
            frontu.
          </p>
          <p className={P}>
            Adresu IP neukládáme. Pro omezení počtu odeslání si na {RETENTION.rateHitsDays} dní uložíme jen její otisk, spočítaný s tajným klíčem serveru, ze
            kterého adresu zpět nezjistíme.
          </p>
          <p className={P}>
            Připomínky vidí jen členové resortního týmu přihlášení do interní části webu. Ve veřejném vypořádání uvádíme jen názvy organizací, nikdy jména ani
            e-maily.
          </p>
          <p className={P}>
            Údaje nikomu nepředáváme. Technicky je zpracovávají poskytovatelé, na kterých web běží: Vercel (provoz webu), Neon (databáze v Evropské unii)
            a Resend (odesílání e-mailů).
          </p>
        </div>
      </Section>

      <Section title="Jak dlouho údaje držíme">
        <dl className="grid max-w-[52em] gap-x-8 gap-y-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          {keep.map(([what, how]) => (
            <div key={what} className="contents">
              <dt className="border-t border-line pt-3 text-[17px] font-semibold text-ink">{what}</dt>
              <dd className="border-line pt-0 text-[17px] text-ink-2 sm:border-t sm:pt-3">{how}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-[44em] text-[17px] text-muted">Mazání podle těchto lhůt běží automaticky každý den.</p>
      </Section>

      <Section id="novinky" title="Odběr novinek">
        <div className="flex max-w-[44em] flex-col gap-4">
          <p className={P}>
            K odběru novinek potřebujeme jen e-mail. Do seznamu ho přidáme až poté, co odběr potvrdíte odkazem, který vám pošleme; do té doby ho
            nikde neukládáme. Seznam vede služba Brevo (Sendinblue SAS, Francie), přes kterou novinky rozesíláme.
          </p>
          <p className={P}>
            E-mail držíme, dokud odběr nezrušíte. Odhlásit se můžete odkazem v každé zprávě; pak ho ze seznamu odstraníme. Novinky posíláme jen
            o důležitých krocích: nová verze studie, kulaté stoly, vypořádání připomínek.
          </p>
        </div>
      </Section>

      <Section id="moje-udaje" tone="paper" title="Stáhnout nebo smazat moje údaje" lead={`Zadejte e-mail, ze kterého jste připomínkovali. Pošleme na něj odkaz, kde si údaje prohlédnete, stáhnete a můžete je smazat. Odkaz platí ${DATA_LINK_HOURS} hodin.`}>
        <DataRequestForm />
      </Section>

      <Section title="Další práva a kontakt">
        <div className="flex max-w-[44em] flex-col gap-4">
          <p className={P}>
            Máte právo na přístup ke svým údajům, jejich opravu a výmaz, právo vznést námitku proti zpracování a právo podat stížnost u Úřadu pro ochranu osobních
            údajů (uoou.gov.cz).
          </p>
          <p className={P}>
            Údaje zpracovává autor studie Josef Pavlovic. S opravou údajů nebo s dotazem se obraťte na{" "}
            <a href={`mailto:${contact}`} className="font-semibold text-forest underline">
              {contact}
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
