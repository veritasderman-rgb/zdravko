import { NextStep, PageHero, Section } from "@/components/web/ui";
import { VazbyMapFigure } from "@/components/study-figures/diagrams/vazby-map";
import { VazbyMatrixFigure, VazbyOrgFigure } from "@/components/study-figures/diagrams/vazby-org";

export const metadata = {
  title: "Jak to do sebe zapadá",
  description: "Mapa vazeb, organigramy pilířů a matice vlivů: co na co v reformě navazuje a co se kde ovlivňuje.",
};

export default function SouvislostiPage() {
  return (
    <>
      <PageHero
        eyebrow="Jak to do sebe zapadá"
        title="Co na co navazuje a co se kde ovlivňuje"
        lead="Reforma má desítky opatření. Na jednom obrázku je vidět, která musí přijít dřív, která na nich stojí a kterým ukazatelem poznáme, že fungují. Všechno vychází ze studie a z jejího registru opatření."
      />

      <Section
        id="mapa"
        tone="paper"
        eyebrow="Mapa vazeb"
        title="Klikněte na opatření a uvidíte celý řetězec"
        lead="Vlevo je opozice, vpravo vláda. Šipka vede vždy od toho, co musí přijít dřív. Silné šipky leží na kritické cestě: když se tam něco zdrží, zdrží se celá reforma."
      >
        <VazbyMapFigure />
      </Section>

      <Section
        id="organigramy"
        eyebrow="Organigramy pilířů"
        title="Každé opatření patří k opatření jádra, na kterém stojí"
        lead="Pět pilířů a doprovod Manifestu. Nahoře opatření jádra a podmínky, pod nimi doplňková opatření a opatření z Manifestu. Kliknutím otevřete opatření ve studii."
      >
        <VazbyOrgFigure />
      </Section>

      <Section
        id="ukazatele"
        tone="paper"
        eyebrow="Co se kde ovlivňuje"
        title="Kterým ukazatelem poznáme, že opatření funguje"
        lead="Řádky jsou opatření, sloupce osm hlavních ukazatelů. Plná tečka znamená, že ukazatel měří účinek opatření."
      >
        <VazbyMatrixFigure />
      </Section>

      <NextStep title="Kdy se co stane" text="Fáze, kontrolní body a hlavní milníky na časové ose 2026–2038." href="/jak" label="Jak a kdy" />
    </>
  );
}
