import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { listCodesWithCounts } from "@/lib/queries";
import { compareCodes, FAMILY_CLASS, FAMILY_LABEL, familyOf, type CodeFamily } from "@/lib/codes";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kódy opatření" };

const ORDER: CodeFamily[] = ["J", "P", "Pil", "M", "H", "D", "R", "B"];

export default async function CodesPage() {
  await requireSession();
  const codes = (await listCodesWithCounts()).sort((a, b) => compareCodes(a.code, b.code));
  return (
    <main className="mx-auto max-w-[1100px] px-4 py-6">
      <h1 className="text-2xl font-semibold tracking-tight">Registr kódů</h1>
      <p className="text-sm text-muted">Opatření, podmínky, ukazatele, rizika a brány, jak je studie značí. Čísla ukazují, kolik bloků textu a připomínek se ke kódu váže.</p>
      {ORDER.map((fam) => {
        const items = codes.filter((c) => familyOf(c.code) === fam);
        if (!items.length) return null;
        return (
          <section key={fam} className="mt-6">
            <h2 className="text-sm font-semibold text-muted">{FAMILY_LABEL[fam]}</h2>
            <ul className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              {items.map((c) => (
                <li key={c.code}>
                  <Link href={`/kody/${c.code}`} className="flex items-center gap-3 rounded-lg border border-line bg-paper px-3 py-2 text-sm hover:border-accent">
                    <span className={`chip font-mono ${FAMILY_CLASS[fam]}`}>{c.code}</span>
                    <span className="min-w-0 flex-1 truncate">{c.label ?? <span className="text-muted">bez popisu</span>}</span>
                    <span className="shrink-0 text-xs tabular-nums text-muted">{c.blocks} bloků · {c.comments} přip.</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
