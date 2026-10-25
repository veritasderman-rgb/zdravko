import "../(web)/print.css";
import "./print-doc.css";

/**
 * Tiskové stránky bez navigace a patičky (zdroj pro PDF). Sdílí tiskový styl
 * veřejného webu (print.css: černá na bílé, bez tlačítek) a přidává vlastní
 * rozvržení dokumentu (print-doc.css).
 */
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="obsah" className="print-doc flex-1">
      {children}
    </main>
  );
}
