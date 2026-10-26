import { getBlocks, getDocumentBySlug } from "@/lib/queries";
import { META } from "@/content/reforma";
import { BlockView } from "@/components/block-view";
import { SITE } from "@/lib/site";

/**
 * Tisková podoba studie: zdroj pro public/studie.pdf (web/scripts/pdf.mjs).
 * Stejné bloky a obrázky jako veřejná čtečka, bez hledání a připomínek,
 * s úvodní stranou, obsahem a dovětkem, kam posílat připomínky.
 */
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Studie k tisku",
  robots: { index: false, follow: false },
};

const VERSION_DATE = META.subtitle.split(" · ").pop() ?? "";

function Note() {
  return (
    <div className="doc-note">
      <p className="m-0 font-bold">Čte se vám to lépe jako PDF? Tady je celá studie.</p>
      <p className="mb-0 mt-2">
        Připomínky nám ale prosím nevpisujte do PDF, pošlete je souhrnně. Nejlepší cesta je formulář na webu{" "}
        <strong>{SITE}/studie</strong>: u každého odstavce je tlačítko „Připomínka“ a dole na stránce formulář pro připomínku ke studii jako celku. Stačí jméno a e-mail; nic z toho nezveřejňujeme. Pokud píšete za organizaci, pošlete jednu souhrnnou připomínku s odkazem na část a odstavec studie.
      </p>
      <p className="mb-0 mt-2">
        Interaktivní grafy, časové osy a kalkulačky jsou ve čtečce na webu; v PDF jsou jejich statické podoby. Místa označená „Ověřit“ jsou údaje, které autoři zatím neověřili v primárním zdroji.
      </p>
    </div>
  );
}

export default async function StudiePrintPage() {
  const found = await getDocumentBySlug("studie");
  if (!found) {
    return (
      <div className="doc-page">
        <p>Studie se teď nedá načíst.</p>
      </div>
    );
  }
  const { doc, version } = found;
  const blocks = await getBlocks(version.id);
  const headings = blocks.filter((b) => b.kind === "heading" && (b.level ?? 1) <= 3);

  return (
    <div className="doc-page">
      <section className="doc-cover" aria-label="Titulní strana">
        <div>
          <p className="m-0 text-[11pt] uppercase tracking-[0.08em]">Studie reformy zdravotnictví · konzultační verze</p>
          <h1 className="mb-0 mt-6 text-[34pt] font-semibold leading-[1.05]">{doc.title.replace(/\s*—\s*studie.*$/i, "")}</h1>
          <p className="mb-0 mt-4 text-[14pt]">Studie reformy zdravotnictví, konzultační verze {version.label}</p>
          <p className="mb-0 mt-1 text-[12pt]">{META.author}</p>
          <p className="mb-0 mt-1 text-[12pt]">Datum verze: {VERSION_DATE}</p>
        </div>
        <Note />
      </section>

      <section className="doc-toc" role="doc-toc" aria-label="Obsah">
        <h2 className="text-[18pt] font-semibold">Obsah</h2>
        <ol>
          {headings.map((h) => (
            <li key={h.blockKey} data-level={h.level ?? 1}>
              <a href={`#${h.blockKey}`}>{h.text}</a>
            </li>
          ))}
        </ol>
      </section>

      <article className="prose-block study-text">
        {blocks.map((b) => (
          <BlockView key={b.blockKey} block={b} slug="studie" selected={false} query={{ kod: null, s: null }} readOnly />
        ))}
      </article>

      <section className="doc-end" aria-label="Závěrečná poznámka">
        <h2 className="text-[18pt] font-semibold">Jak poslat připomínku</h2>
        <Note />
        <p className="mt-4 text-[10pt]">
          Dokument vygenerovaný z webové čtečky studie dne {new Date().toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" })}. Aktuální znění, vypořádání připomínek a seznam otevřených ověření jsou na {SITE}/studie.
        </p>
      </section>
    </div>
  );
}
