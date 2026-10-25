"use client";

import { useActionState } from "react";
import { completeLogin, requestLogin, type ActionState } from "@/app/actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(requestLogin, {});
  if (state.ok) {
    return (
      <div role="status" className="mt-6 rounded-lg border border-line bg-paper p-5 text-sm">
        <p className="font-semibold">Zkontrolujte poštu.</p>
        <p className="mt-1 text-muted">Pokud máte účet, poslali jsme vám odkaz pro přihlášení. Platí 20 minut a jen jednou.</p>
      </div>
    );
  }
  return (
    <form action={action} className="mt-6 space-y-4 rounded-lg border border-line bg-paper p-5">
      <input type="hidden" name="next" value={next} />
      <div>
        <label className="field" htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      {state.error && <p className="text-sm text-rose-700">{state.error}</p>}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Odesílám…" : "Poslat odkaz pro přihlášení"}
      </button>
    </form>
  );
}

/** Přihlášení tlačítkem: kontrola pošty, která odkaz jen otevře, ho tak nespotřebuje. */
export function CompleteLoginForm({ token, next }: { token: string; next: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(completeLogin, {});
  return (
    <form action={action} className="mt-6 space-y-4 rounded-lg border border-line bg-paper p-5">
      <input type="hidden" name="t" value={token} />
      <input type="hidden" name="next" value={next} />
      {state.error && (
        <p className="text-sm text-rose-700">
          {state.error} <a href="/vstup" className="underline">Požádat o nový odkaz</a>
        </p>
      )}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Přihlašuji…" : "Přihlásit se"}
      </button>
    </form>
  );
}
