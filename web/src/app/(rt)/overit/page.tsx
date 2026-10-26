import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/roles";
import { listVerifications } from "@/lib/queries";
import { VERIFICATION_LABEL } from "@/lib/labels";
import { updateVerification } from "@/app/actions";
import { HspaEvidence } from "@/components/hspa-evidence";
import { OVERENI, forVerification } from "@/content/overeni-hspa";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ověřit" };

export default async function VerifyPage({ searchParams }: PageProps<"/overit">) {
  const session = await requireSession();
  const editable = can(session.role, "verify");
  const sp = await searchParams;
  const status = typeof sp.status === "string" && sp.status ? sp.status : undefined;
  const rows = await listVerifications(status);

  // seskupit podle dokumentu a části
  const groups = new Map<string, typeof rows>();
  for (const r of rows) {
    const key = `${r.docTitle} › ${r.headingPath?.split(" › ").slice(0, 2).join(" › ") ?? ""}`;
    groups.set(key, [...(groups.get(key) ?? []), r]);
  }

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Otevřená ověření</h1>
          <p className="text-sm text-muted">
            Místa označená ve studii slovem „Ověřit“. Kdo má přístup ke zdroji, údaj ověří, zapíše výsledek a stav. Rozdělení osob a termínů je na schůzce 9. 11. 2026.
            U každé položky je předpřipravené, co k ní má HSPA Monitor (stav k {OVERENI.generated_at}, podrobně v <code>docs/overeni-hspa.md</code>): hodnota, rok a primární zdroj, ke kterému se má dojít. HSPA je nástroj autorů, ověření v primárním zdroji nenahrazuje.
          </p>
        </div>
        <form className="flex items-center gap-2 text-sm">
          <select name="status" defaultValue={status ?? ""} className="!w-auto">
            <option value="">Všechny stavy</option>
            {Object.entries(VERIFICATION_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button className="btn btn-ghost" type="submit">Filtrovat</button>
          <span className="text-muted">{rows.length} položek</span>
        </form>
      </div>

      {[...groups.entries()].map(([group, items]) => (
        <section key={group} className="mt-6">
          <h2 className="text-sm font-semibold text-muted">{group}</h2>
          <ul className="mt-2 divide-y divide-line rounded-lg border border-line bg-paper">
            {items.map(({ v, docSlug }) => {
              const hspa = forVerification(v.text);
              return (
              <li key={v.id} className="px-4 py-3 text-sm">
                <div className="flex flex-wrap items-start gap-2">
                  <span className={`chip mt-0.5 ${v.status === "otevreno" ? "border-amber-300 bg-amber-50 text-amber-900" : v.status === "neoveritelne" ? "border-rose-200 bg-rose-50 text-rose-900" : "border-emerald-200 bg-emerald-50 text-emerald-900"}`}>
                    {VERIFICATION_LABEL[v.status]}
                  </span>
                  <p className="min-w-0 flex-1">
                    <b>Ověřit:</b> {v.text}{" "}
                    <Link href={`/d/${docSlug}?b=${encodeURIComponent(v.blockKey)}#${encodeURIComponent(v.blockKey)}`} className="text-xs text-accent underline">
                      v textu
                    </Link>
                  </p>
                </div>
                {hspa && (
                  <div className="mt-1 text-xs text-muted">
                    <HspaEvidence records={[hspa]} dense className="!mt-0 !opacity-100" />
                    {hspa.verdict !== "rozpor" && <p className="mt-0.5">{hspa.note}</p>}
                  </div>
                )}
                {editable ? (
                <form action={updateVerification} className="mt-2 grid grid-cols-1 gap-2 text-xs md:grid-cols-[180px_160px_1fr_auto]">
                  <input type="hidden" name="id" value={v.id} />
                  <select name="status" defaultValue={v.status}>
                    {Object.entries(VERIFICATION_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                  <input name="assignee" defaultValue={v.assignee ?? ""} placeholder="kdo ověří" />
                  <input name="note" defaultValue={v.note ?? ""} placeholder="výsledek, zdroj, nové znění" />
                  <button className="btn !py-1 !px-3 !text-xs" type="submit">Uložit</button>
                </form>
                ) : (
                  (v.assignee || v.note) && (
                    <p className="mt-1 text-xs text-muted">
                      {v.assignee ? `Ověřuje: ${v.assignee}. ` : ""}
                      {v.note}
                    </p>
                  )
                )}
              </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
