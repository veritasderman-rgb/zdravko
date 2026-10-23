import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { commentStats, listDocumentsWithStats } from "@/lib/queries";
import { DOC_KIND_LABEL, STATUS_LABEL } from "@/lib/labels";

export const dynamic = "force-dynamic";
export const metadata = { title: "Připomínky RT" };

export default async function Home() {
  await requireSession();
  const [docs, stats] = await Promise.all([listDocumentsWithStats(), commentStats()]);
  const total = stats.byStatus.reduce((a, b) => a + b.n, 0);
  const open = stats.byStatus.filter((s) => !["vyporadana", "zverejnena"].includes(s.status)).reduce((a, b) => a + b.n, 0);
  const zasadni = stats.bySeverity.find((s) => s.severity === "zasadni")?.n ?? 0;
  const verifOpen = docs.reduce((a, d) => a + d.verifications.open, 0);

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Konzultace verze 3</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Interní kolo připomínek resortního týmu k odborné studii před schválením 7. 12. 2026. Otevřete studii, klikněte na odstavec a vložte
        připomínku. Jedna věc, jeden komentář; návrh znění a zdroj pomohou vypořádání nejvíc.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Připomínek celkem" value={total} href="/pripominky" />
        <Stat label="Otevřených" value={open} href="/pripominky?status=nova" />
        <Stat label="Zásadních" value={zasadni} href="/pripominky?severity=zasadni" />
        <Stat label="Otevřených „Ověřit“" value={verifOpen} href="/overit?status=otevreno" />
      </div>

      <h2 className="mt-10 text-lg font-semibold">Připomínkovaný dokument</h2>
      <ul className="mt-3 divide-y divide-line rounded-lg border border-line bg-paper">
        {docs.map((d) => (
          <li key={d.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
            <div className="min-w-0 flex-1">
              <Link href={`/d/${d.slug}`} className="font-medium hover:underline">
                {d.title}
              </Link>
              <div className="text-xs text-muted">
                {DOC_KIND_LABEL[d.kind] ?? d.kind} · {d.version?.label ?? "bez verze"} · {d.blocks} bloků
              </div>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="chip">{d.comments.n} připomínek{d.comments.open ? ` · ${d.comments.open} otevřených` : ""}</span>
              {d.verifications.n > 0 && <span className="chip">{d.verifications.open}/{d.verifications.n} ověřit</span>}
            </div>
          </li>
        ))}
      </ul>

      {stats.byStatus.length > 0 && (
        <div className="mt-8 text-sm text-muted">
          Stav vypořádání:{" "}
          {stats.byStatus.map((s) => (
            <span key={s.status} className="chip mr-1">
              {STATUS_LABEL[s.status]} {s.n}
            </span>
          ))}
        </div>
      )}

      <div className="mt-10 rounded-lg border border-line bg-paper p-4 text-sm">
        <h3 className="font-semibold">Jak připomínkovat</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted">
          <li>Otevřete dokument a v osnově vlevo najděte část, ke které máte výhradu.</li>
          <li>Klikněte na odstavec, tabulku nebo odrážku. Vpravo se otevře formulář připomínky.</li>
          <li>Vyberte typ a závažnost, napište připomínku, pokud možno návrh nového znění a zdroj.</li>
          <li>Neověřený údaj označte přepínačem „Ověřit“. Kód opatření (J1–J10, P1–P5…) se předvyplní z textu.</li>
        </ol>
      </div>
    </main>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="rounded-lg border border-line bg-paper px-4 py-3 hover:border-accent">
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </Link>
  );
}
