import "./podklady.css";

/**
 * Podklady pro média (/tisk/handout, /tisk/prezentace): zdroj pro PDF ve složce public/podklady
 * (scripts/pdf.mjs). Bez navigace a patičky; na obrazovce jako listy papíru, v tisku list na stranu.
 */
export default function PodkladyLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="obsah" className="podklady flex-1">
      {children}
    </main>
  );
}
