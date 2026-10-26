"use client";

import { useActionState, useId } from "react";
import type { ActionState } from "@/app/actions";
import { confirmNewsletter, subscribeNewsletter } from "@/app/novinky-actions";

/**
 * Přihlášení k odběru novinek. Světlá varianta na stránce, tmavá v patičce.
 * Po odeslání přijde e-mail s odkazem; do seznamu jde adresa až po potvrzení.
 */
export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(subscribeNewsletter, {});
  const id = useId();
  const muted = dark ? "text-on-dark-muted" : "text-muted";
  if (state.ok) {
    return (
      <p role="status" className={`text-[17px] ${dark ? "text-on-dark" : "text-ink"}`}>
        <span className="font-semibold">Skoro hotovo.</span> <span className={muted}>Poslali jsme vám e-mail s odkazem; odběr začne, až ho potvrdíte.</span>
      </p>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-2">
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor={`${id}-web`}>Web</label>
        <input id={`${id}-web`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <label htmlFor={`${id}-email`} className={`text-[15px] font-semibold ${dark ? "text-on-dark" : "text-ink"}`}>
        Váš e-mail
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          className={`min-h-[52px] w-full rounded-[10px] border px-3.5 text-[17px] sm:max-w-[22rem] ${dark ? "border-on-dark-muted bg-forest-deep text-on-dark" : "border-line-strong bg-paper text-ink"}`}
        />
        <button
          type="submit"
          disabled={pending}
          className={`inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-full px-6 text-[17px] font-bold disabled:opacity-60 ${dark ? "bg-sand text-forest-deep hover:bg-paper" : "bg-forest text-white hover:bg-forest-deep"}`}
        >
          {pending ? "Odesíláme…" : "Odebírat novinky"}
        </button>
      </div>
      {state.error && (
        <p role="alert" className={`text-[15px] font-semibold ${dark ? "text-on-dark" : "text-rose-800"}`}>
          {state.error}
        </p>
      )}
      <p className={`text-[14px] ${muted}`}>
        Jen o důležitých krocích. Odhlásit se jde jedním klikem v každém e-mailu.{" "}
        <a href="/ochrana-udaju#novinky" className="underline">
          Jak s údaji zacházíme
        </a>
      </p>
    </form>
  );
}

/** Potvrzení odběru tlačítkem (samotné otevření odkazu nic neudělá). */
export function ConfirmNewsletterForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(confirmNewsletter, {});
  if (state.ok) {
    return (
      <div role="status" className="rounded-card border border-line bg-sage-soft p-5 text-[17px] text-ink">
        <p className="font-semibold">Hotovo, odebíráte novinky.</p>
        <p className="mt-1 text-muted">Ozveme se, až bude co říct: nová verze studie, kulaté stoly, vypořádání připomínek.</p>
      </div>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="t" value={token} />
      {state.error && (
        <p role="alert" className="rounded-[10px] border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[16px] text-rose-900">
          {state.error}
        </p>
      )}
      <div>
        <button type="submit" disabled={pending} className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-forest px-7 text-[18px] font-bold text-white hover:bg-forest-deep disabled:opacity-60">
          {pending ? "Potvrzujeme…" : "Potvrdit odběr"}
        </button>
      </div>
    </form>
  );
}
