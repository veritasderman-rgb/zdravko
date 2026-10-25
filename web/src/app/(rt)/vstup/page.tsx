import { LoginForm } from "./login-form";

export const metadata = { title: "Vstup" };

export default async function VstupPage({ searchParams }: PageProps<"/vstup">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/rt";
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Vstup pro resortní tým</h1>
      <p className="mt-2 text-sm text-muted">
        Interní část studie „Zdraví blíž lidem“ je pro členy týmu s účtem. Zadejte e-mail, pod kterým vás koordinátor založil; pošleme na něj odkaz pro
        přihlášení. Ve veřejném vypořádání se jména osob nezveřejňují, jen organizace.
      </p>
      <LoginForm next={next} />
      <p className="mt-6 text-sm text-muted">Účet nemáte? Napište koordinátorovi konzultace, ten vás založí a přidělí roli.</p>
    </main>
  );
}
