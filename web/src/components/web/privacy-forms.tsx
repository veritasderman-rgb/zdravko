"use client";

import { useActionState } from "react";
import { confirmPublicComment, type ActionState } from "@/app/actions";
import { eraseMyData, requestMyData } from "@/app/udaje-actions";

const INPUT = "w-full rounded-[10px] border border-line-strong bg-paper px-3.5 py-2.5 text-[17px] text-ink";
const PRIMARY = "inline-flex min-h-[52px] items-center justify-center rounded-full bg-action px-7 text-[18px] font-bold text-white hover:bg-action-hover disabled:opacity-60";

function Alert({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p role="alert" className="rounded-[10px] border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[16px] text-rose-900">
      {text}
    </p>
  );
}

function Done({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div role="status" className="rounded-card border border-line bg-sage-soft p-5 text-[17px] text-ink">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-muted">{children}</p>
    </div>
  );
}

/** Potvrzení veřejné připomínky tlačítkem: samotné otevření odkazu (např. kontrolou pošty) nic nepotvrdí. */
export function ConfirmCommentForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(confirmPublicComment, {});
  if (state.ok) {
    return <Done title="Hotovo, připomínka je potvrzená.">Resortní tým ji projde spolu s ostatními. Když budeme potřebovat upřesnění, ozveme se na váš e-mail.</Done>;
  }
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="t" value={token} />
      <Alert text={state.error} />
      <div>
        <button type="submit" disabled={pending} className={PRIMARY}>
          {pending ? "Potvrzujeme…" : "Potvrdit připomínku"}
        </button>
      </div>
    </form>
  );
}

/** Žádost o odkaz na vlastní údaje. */
export function DataRequestForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(requestMyData, {});
  if (state.ok) {
    return (
      <Done title="Žádost máme.">
        Pokud od vás evidujeme připomínky, poslali jsme na zadaný e-mail odkaz na vaše údaje. Platí 24 hodin. Když nic nepřijde, zkontrolujte i nevyžádanou poštu.
      </Done>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="udaje-web">Web</label>
        <input id="udaje-web" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="max-w-[28rem]">
        <label htmlFor="udaje-email" className="mb-1 block text-[15px] font-semibold text-ink">
          E-mail, ze kterého jste připomínkovali
        </label>
        <input id="udaje-email" name="email" type="email" required maxLength={200} autoComplete="email" className={INPUT} />
      </div>
      <Alert text={state.error} />
      <div>
        <button type="submit" disabled={pending} className={PRIMARY}>
          {pending ? "Odesíláme…" : "Poslat odkaz na moje údaje"}
        </button>
      </div>
    </form>
  );
}

/** Výmaz vlastních údajů z odkazu v e-mailu. */
export function EraseForm({ token }: { token: string }) {
  // Po úspěšném výmazu akce přesměruje na stránku s potvrzením.
  const [state, action, pending] = useActionState<ActionState, FormData>(eraseMyData, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="t" value={token} />
      <label className="flex items-start gap-3 text-[17px] text-ink">
        <input type="checkbox" name="souhlas" required className="mt-1.5 h-5 w-5 shrink-0" />
        <span>Chci smazat jméno, e-mail, organizaci a text všech svých připomínek. Vím, že to nejde vrátit.</span>
      </label>
      <Alert text={state.error} />
      <div>
        <button type="submit" disabled={pending} className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-rose-800 px-7 text-[18px] font-bold text-rose-900 hover:bg-rose-50 disabled:opacity-60">
          {pending ? "Mažeme…" : "Smazat moje údaje"}
        </button>
      </div>
    </form>
  );
}
