import { PageHero, Section } from "@/components/web/ui";
import { DataRequestForm } from "@/components/web/privacy-forms";
import { DATA_LINK_HOURS, RETENTION } from "@/lib/privacy-core";
import { privacyContact } from "@/lib/privacy";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/ochrana-udaju");

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
            Údaje nikomu nepředáváme. Technicky je zpracovávají poskytovatelé, na kterých web běží: Vercel (provoz webu), Neon (databáze v Evropské unii),
            Resend (odesílání e-mailů) a u odběru novinek a kulatých stolů Brevo (seznamy kontaktů).
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

      <Section id="zapojeni" title="Kulaté stoly a zprávy od organizací">
        <div className="flex max-w-[44em] flex-col gap-4">
          <p className={P}>
            U přihlášky ke kulatým stolům ukládáme e-mail, jméno, nepovinně organizaci a roli, vybraná témata, co chcete (zprávu o termínu, nebo účast)
            a poznámku. U zprávy za organizaci název organizace, jméno, e-mail, nepovinně funkci, s čím se ozýváte, zprávu a to, zda smíme název organizace
            uvést mezi podporovateli.
          </p>
          <p className={P}>
            Údaje uložíme až poté, co přihlášku potvrdíte odkazem z e-mailu; do té doby jsou jen v zašifrovaném odkazu a nikde je neukládáme. Po potvrzení je
            vede služba Brevo (Sendinblue SAS, Francie), přes kterou posíláme pozvánky. Každé téma kulatého stolu má vlastní seznam, takže pozvánku dostanete
            jen k tématům, která jste vybrali. Zprávu za organizaci navíc dostane e-mailem autor studie.
          </p>
          <p className={P}>
            Údaje potřebujeme, abychom vás mohli pozvat a ozvat se vám; zpracováváme je z oprávněného zájmu na vedení veřejné konzultace. Nikde je
            nezveřejňujeme. Název organizace uvedeme mezi podporovateli jen se souhlasem a po odsouhlasení znění, jména lidí nikdy.
          </p>
          <p className={P}>
            Údaje držíme do konce kulatých stolů, nejdéle do konce roku 2028, pak seznamy smažeme. Odhlásit se můžete dřív odkazem v každém e-mailu
            nebo napsat na adresu níže.
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
