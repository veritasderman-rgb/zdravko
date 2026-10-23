import Link from "next/link";
import { MANIFEST_AREAS } from "@/content/manifest";
import { Section, TextLink } from "@/components/web/ui";

const LAYER_LABEL = { jadro: "jádro reformy", doprovod: "doprovod" } as const;

/**
 * Pás pro úvodní stránku: třináct oblastí Manifestu, každá vede na /plan#oblast-N.
 * Serverová komponenta.
 */
export function ManifestStrip() {
  return (
    <Section
      tone="paper"
      eyebrow="Z čeho vycházíme"
      title="Manifest reformy: třináct oblastí, které postupně měníme v kroky"
      lead="Vycházíme z Manifestu reformy z května 2026. Naše studie ho rozpracovává do opatření, zákonů, termínů a peněz a u každé oblasti říká, kde se od něj liší."
    >
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MANIFEST_AREAS.map((a) => (
          <li key={a.n}>
            <Link
              href={`/plan#oblast-${a.n}`}
              className={`flex h-full min-h-11 items-start gap-4 rounded-card border border-line p-4 text-ink no-underline transition-colors hover:border-line-strong hover:bg-sage-soft sm:p-5 ${
                a.layer === "jadro" ? "bg-sage-soft" : "bg-sand"
              }`}
            >
              <span className="w-9 shrink-0 font-serif text-4xl font-semibold leading-none text-forest tabular-nums">{a.n}</span>
              <span className="flex min-w-0 flex-col gap-1.5">
                <span className="font-serif text-xl font-semibold leading-snug">{a.title}</span>
                <span className="text-sm font-bold uppercase tracking-[0.06em] text-muted">{LAYER_LABEL[a.layer]}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="mt-8">
        <TextLink href="/plan" arrow>
          Všech třináct oblastí a kroky
        </TextLink>
      </div>
    </Section>
  );
}
