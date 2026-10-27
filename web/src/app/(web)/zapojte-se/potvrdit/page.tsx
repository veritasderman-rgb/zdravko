import { PageHero, Section } from "@/components/web/ui";
import { ConfirmSignupForm } from "@/components/web/zapojit-forms";

export const metadata = { title: "Potvrzení přihlášky", robots: { index: false } };

export default async function ConfirmSignupPage({ searchParams }: PageProps<"/zapojte-se/potvrdit">) {
  const t = (await searchParams).t;
  const token = typeof t === "string" ? t : "";
  return (
    <>
      <PageHero eyebrow="Zapojte se" title="Potvrďte prosím přihlášku" lead="Jedním kliknutím potvrdíte, že přihlášku nebo zprávu poslal majitel e-mailu. Teprve pak ji uložíme." />
      <Section tone="paper" title="Jedno kliknutí">
        {token ? <ConfirmSignupForm token={token} /> : <p className="text-[18px] text-ink">V odkazu chybí kód. Otevřete prosím odkaz z e-mailu celý.</p>}
      </Section>
    </>
  );
}
