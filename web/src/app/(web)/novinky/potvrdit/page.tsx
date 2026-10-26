import { PageHero, Section } from "@/components/web/ui";
import { ConfirmNewsletterForm } from "@/components/web/newsletter-form";

export const metadata = { title: "Potvrzení odběru", robots: { index: false } };

export default async function ConfirmNewsletterPage({ searchParams }: PageProps<"/novinky/potvrdit">) {
  const t = (await searchParams).t;
  const token = typeof t === "string" ? t : "";
  return (
    <>
      <PageHero eyebrow="Novinky e-mailem" title="Potvrďte prosím odběr" lead="Jedním kliknutím potvrdíte, že novinky chce dostávat majitel e-mailu." />
      <Section tone="paper" title="Jedno kliknutí">
        {token ? <ConfirmNewsletterForm token={token} /> : <p className="text-[18px] text-ink">V odkazu chybí kód. Otevřete prosím odkaz z e-mailu celý.</p>}
      </Section>
    </>
  );
}
