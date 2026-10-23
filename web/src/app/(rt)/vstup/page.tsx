import { LoginForm } from "./login-form";

export const metadata = { title: "Vstup" };

export default async function VstupPage({ searchParams }: PageProps<"/vstup">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/rt";
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Vstup pro resortní tým</h1>
      <p className="mt-2 text-sm text-muted">
        Konzultační verze 3.1 studie „Zdraví blíž lidem“ je zatím jen pro členy resortního týmu. Zadejte přístupový kód a jméno,
        pod kterým se budou evidovat vaše připomínky. Ve veřejném vypořádání se jména osob nezveřejňují, jen organizace.
      </p>
      <LoginForm next={next} />
    </main>
  );
}
