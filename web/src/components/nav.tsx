import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logout } from "@/app/actions";
import { ROLE_LABEL, can } from "@/lib/roles";

/** Navigace interní části pro resortní tým. */
export async function Nav() {
  const session = await getSession();
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-[1400px] items-center gap-5 px-4 py-2 text-sm">
        <Link href="/rt" className="font-semibold tracking-tight">
          Zdraví blíž lidem <span className="text-muted font-normal">· připomínky k v3</span>
        </Link>
        {session && (
          <nav className="flex items-center gap-4 text-muted">
            <Link href="/d/studie" className="hover:text-foreground">Studie</Link>
            <Link href="/pripominky" className="hover:text-foreground">Připomínky</Link>
            <Link href="/overit" className="hover:text-foreground">Ověřit</Link>
            <Link href="/kody" className="hover:text-foreground">Kódy</Link>
            {can(session.role, "manageUsers") && <Link href="/lide" className="hover:text-foreground">Lidé</Link>}
            <Link href="/" className="hover:text-foreground">Veřejný web</Link>
          </nav>
        )}
        <div className="ml-auto flex items-center gap-3 text-muted">
          {session ? (
            <>
              <span>
                {session.name}
                {session.organization ? ` · ${session.organization}` : ""}
                <span className="chip ml-2">{ROLE_LABEL[session.role]}</span>
              </span>
              <form action={logout}>
                <button className="hover:text-foreground underline" type="submit">Odhlásit</button>
              </form>
            </>
          ) : (
            <Link href="/" className="hover:text-foreground">Veřejný web</Link>
          )}
        </div>
      </div>
    </header>
  );
}
