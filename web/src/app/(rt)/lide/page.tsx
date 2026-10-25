import { asc } from "drizzle-orm";
import { db, schema } from "@/db";
import { requirePermission } from "@/lib/auth";
import { ROLES, ROLE_LABEL, ROLE_NOTE } from "@/lib/roles";
import { fmtDate } from "@/lib/labels";
import { NewUserForm, UserRowForm } from "./forms";

export const dynamic = "force-dynamic";
export const metadata = { title: "Lidé a role" };

export default async function PeoplePage() {
  await requirePermission("manageUsers");
  const users = await db.select().from(schema.users).orderBy(asc(schema.users.name));
  return (
    <main className="mx-auto max-w-[1100px] px-4 py-6">
      <h1 className="text-2xl font-semibold tracking-tight">Lidé a role</h1>
      <p className="text-sm text-muted">Kdo se může přihlásit do interní části a co smí. Přihlašuje se odkazem na e-mail, žádné heslo.</p>

      <dl className="mt-4 grid gap-x-4 gap-y-1 rounded-lg border border-line bg-paper p-4 text-sm md:grid-cols-[9rem_1fr]">
        {ROLES.map((r) => (
          <div key={r} className="contents">
            <dt className="font-semibold">{ROLE_LABEL[r]}</dt>
            <dd className="text-muted">{ROLE_NOTE[r]}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-6 text-sm font-semibold text-muted">Přidat člověka nebo upravit podle e-mailu</h2>
      <div className="mt-2">
        <NewUserForm />
      </div>

      <h2 className="mt-6 text-sm font-semibold text-muted">Tým ({users.length})</h2>
      <ul className="mt-2 divide-y divide-line rounded-lg border border-line bg-paper text-sm">
        {users.map((u) => (
          <li key={u.id} className={`flex flex-wrap items-center justify-between gap-2 px-4 py-3 ${u.active ? "" : "opacity-60"}`}>
            <div>
              <p className="font-medium">
                {u.name}
                {u.organization ? <span className="text-muted"> · {u.organization}</span> : null}
              </p>
              <p className="text-xs text-muted">
                {u.email} · {u.lastLoginAt ? `poslední přihlášení ${fmtDate(u.lastLoginAt)}` : "zatím bez přihlášení"}
              </p>
            </div>
            <UserRowForm id={u.id} role={u.role} active={u.active} />
          </li>
        ))}
        {users.length === 0 && <li className="px-4 py-3 text-muted">Zatím nikdo.</li>}
      </ul>
    </main>
  );
}
