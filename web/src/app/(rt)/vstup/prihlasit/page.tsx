import { CompleteLoginForm } from "../login-form";

export const metadata = { title: "Přihlášení" };

export default async function PrihlasitPage({ searchParams }: PageProps<"/vstup/prihlasit">) {
  const sp = await searchParams;
  const token = typeof sp.t === "string" ? sp.t : "";
  const next = typeof sp.next === "string" ? sp.next : "/rt";
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Přihlášení</h1>
      <p className="mt-2 text-sm text-muted">Dokončete přihlášení tlačítkem.</p>
      {token ? <CompleteLoginForm token={token} next={next} /> : <p className="mt-6 text-sm">V odkazu chybí kód. Otevřete prosím odkaz z e-mailu celý.</p>}
    </main>
  );
}
