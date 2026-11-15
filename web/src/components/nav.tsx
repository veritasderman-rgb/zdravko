import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logout } from "@/app/actions";
import { ROLE_LABEL, can } from "@/lib/roles";

/**
 * Navigace interní části pro resortní tým.
 * Řádek se smí zalomit: bez toho na telefonu vytlačil jméno a odhlášení mimo obrazovku.
 */
export async function Nav() {
  const session = await getSession();
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2 text-sm">
        <Link href="/rt" className="font-semibold tracking-tight">
          Zdraví blíž lidem <span className="text-muted font-normal">· připomínky k v3</span>
        </Link>
        {session && (
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted">
            <Link href="/d/studie" className="hover:text-foreground">Studie</Link>
            <Link href="/pripominky" className="hover:text-foreground">Připomínky</Link>
            <Link href="/overit" className="hover:text-foreground">Ověřit</Link>
            <Link href="/kody" className="hover:text-foreground">Kódy</Link>
            {can(session.role, "manageUsers") && <Link href="/lide" className="hover:text-foreground">Lidé</Link>}
            <Link href="/" className="hover:text-foreground">Veřejný web</Link>
          </nav>
        )}
        <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-x-3 gap-y-1 text-muted">
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
