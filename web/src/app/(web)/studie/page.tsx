import Link from "next/link";
import { getBlocks, getDocumentBySlug } from "@/lib/queries";
import { Outline } from "@/components/outline";
import { BlockView } from "@/components/block-view";

// Veřejná čtečka odborné studie: jen ke čtení, bez připomínek. Text se načítá z databáze
// a obnovuje nejpozději po pěti minutách, aby nová verze nepotřebovala nový build.
export const revalidate = 300;
export const metadata = { title: "Odborná studie", description: "Plné znění konzultační verze 3 studie Zdraví blíž lidem ke čtení." };

export default async function StudiePage() {
  const found = await getDocumentBySlug("studie");
  if (!found) {
    return (
      <main className="mx-auto max-w-[800px] px-4 py-16">
        <h1 className="text-2xl font-semibold">Studie zatím není k dispozici</h1>
        <p className="mt-2 text-muted">Text se připravuje. Zkuste to prosím později.</p>
      </main>
    );
  }
  const { doc, version } = found;
  const blocks = await getBlocks(version.id);
  const headings = blocks.filter((b) => b.kind === "heading" && (b.level ?? 1) <= 3);
  const empty = new Map<string, { n: number; open: number }>();

  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-0 px-2 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden max-h-[calc(100vh-57px)] overflow-y-auto border-r border-line py-4 pr-3 lg:sticky lg:top-[57px] lg:block">
        <Outline headings={headings} slug="studie" counts={empty} current={null} basePath="" />
      </aside>
      <main className="min-w-0 px-2 py-6 lg:px-8">
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm text-stone-800">
          <strong>Konzultační verze 3</strong> z 20. 10. 2026, plné znění odborné studie ke čtení. Místa označená „Ověřit“ jsou údaje, které autoři zatím
          neověřili v primárním zdroji. Připomínky zatím sbíráme v resortním týmu; veřejné připomínkování otevřeme po schválení verze 7. 12. 2026.{" "}
          <Link href="/" className="underline">Zpět na shrnutí</Link>.
        </div>
        <div className="mb-4 text-xs text-muted">{doc.title} · {version.label} · {blocks.length} odstavců, tabulek a odrážek</div>
        <article className="prose-block">
          {blocks.map((b) => (
            <BlockView key={b.blockKey} block={b} slug="studie" selected={false} query={{ kod: null, s: null }} readOnly />
          ))}
        </article>
      </main>
    </div>
  );
}
