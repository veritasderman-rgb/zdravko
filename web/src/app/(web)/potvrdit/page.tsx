import { PageHero, Section } from "@/components/web/ui";
import { ConfirmCommentForm } from "@/components/web/privacy-forms";

export const metadata = { title: "Potvrzení připomínky nebo návrhu", robots: { index: false } };

export default async function ConfirmPage({ searchParams }: PageProps<"/potvrdit">) {
  const t = (await searchParams).t;
  const token = typeof t === "string" ? t : "";
  return (
    <>
      <PageHero
        eyebrow="Připomínka nebo návrh ke studii"
        title="Potvrďte prosím, že jste ji poslali vy"
        lead="Potvrzením nám dáte vědět, že připomínku nebo návrh opatření poslal majitel e-mailu. Teprve pak ji uvidí resortní tým."
      />
      <Section tone="paper" title="Jedno kliknutí">
        {token ? <ConfirmCommentForm token={token} /> : <p className="text-[18px] text-ink">V odkazu chybí kód. Otevřete prosím odkaz z e-mailu celý.</p>}
      </Section>
    </>
  );
}
