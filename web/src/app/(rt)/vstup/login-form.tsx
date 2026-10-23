"use client";

import { useActionState } from "react";
import { login, type ActionState } from "@/app/actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 space-y-4 rounded-lg border border-line bg-paper p-5">
      <input type="hidden" name="next" value={next} />
      <div>
        <label className="field" htmlFor="code">Přístupový kód</label>
        <input id="code" name="code" type="password" required autoComplete="off" />
      </div>
      <div>
        <label className="field" htmlFor="name">Jméno a příjmení</label>
        <input id="name" name="name" required minLength={2} />
      </div>
      <div>
        <label className="field" htmlFor="organization">Organizace (nepovinné)</label>
        <input id="organization" name="organization" placeholder="např. RT zdravotnictví, Institut Pi, PEER" />
      </div>
      {state.error && <p className="text-sm text-rose-700">{state.error}</p>}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Ověřuji…" : "Vstoupit"}
      </button>
    </form>
  );
}
