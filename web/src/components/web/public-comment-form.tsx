"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addPublicComment, type ActionState } from "@/app/actions";
import { trackEvent } from "@/lib/analytics";

/** Typy připomínek nabízené veřejnosti (podmnožina interních). */
const PUBLIC_KINDS: [string, string][] = [
  ["vecna", "Věcná výhrada"],
  ["cislo", "Chyba v čísle"],
  ["zneni", "Návrh jiného znění"],
  ["zdroj", "Chybí zdroj"],
  ["otazka", "Otázka"],
  ["podpora", "Podpora"],
];

const INPUT = "w-full rounded-[10px] border border-line-strong bg-paper px-3.5 py-2.5 text-[17px] text-ink";
const LABEL = "mb-1 block text-[15px] font-semibold text-ink";

/**
 * Veřejný formulář připomínky: bez přihlášení, se jménem (libovolným) a e-mailem.
 * Jméno ani e-mail se nikdy nezveřejňují; připomínka jde do fronty týmu s nízkou prioritou.
 */
export function PublicCommentForm({ documentId, versionId, blockKey, quote = "", onDone }: { documentId: number; versionId: number; blockKey: string; quote?: string; onDone?: () => void }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(addPublicComment, {});
  const formRef = useRef<HTMLFormElement>(null);
  // Čas otevření formuláře: odeslání do 2,5 s považuje server za robota.
  const [ts] = useState(() => Date.now());
  const idp = blockKey.replace(/[^a-z0-9]/gi, "") || "obecne";

  useEffect(() => {
    if (!state.ok) return;
    formRef.current?.reset();
    trackEvent("Připomínka odeslána", { misto: blockKey === "obecne" ? "studie jako celek" : "odstavec" });
  }, [state.ok, blockKey]);

  if (state.ok) {
    return (
      <div role="status" className="rounded-card border border-line bg-sage-soft p-5 text-[17px] text-ink">
        <p className="font-semibold">Děkujeme. Ještě ji prosím potvrďte v e-mailu.</p>
        <p className="mt-1 text-muted">
          Poslali jsme vám odkaz. Připomínka se k resortnímu týmu dostane, až na něj kliknete; odkaz platí 7 dní. Když e-mail nepřijde, zkontrolujte i nevyžádanou poštu.
        </p>
        {onDone && (
          <button type="button" onClick={onDone} className="mt-4 inline-flex min-h-11 items-center rounded-full border-2 border-forest px-5 font-bold text-forest hover:bg-sage-soft">
            Zavřít
          </button>
        )}
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4" aria-describedby={`${idp}-pozn`}>
      <input type="hidden" name="documentId" value={documentId} />
      <input type="hidden" name="versionId" value={versionId} />
      <input type="hidden" name="blockKey" value={blockKey} />
      <input type="hidden" name="quote" value={quote} />
      <input type="hidden" name="ts" value={ts} />
      {/* Past na roboty: lidé pole nevidí a nevyplní. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor={`${idp}-web`}>Web</label>
        <input id={`${idp}-web`} name="website" type="text" tabIndex={-1} autoComplete="off" data-ui />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor={`${idp}-name`}>
            Jméno nebo přezdívka
          </label>
          <input id={`${idp}-name`} name="name" required minLength={2} maxLength={80} autoComplete="name" className={INPUT} data-ui />
        </div>
        <div>
          <label className={LABEL} htmlFor={`${idp}-email`}>
            E-mail
          </label>
          <input id={`${idp}-email`} name="email" type="email" required maxLength={200} autoComplete="email" className={INPUT} data-ui />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor={`${idp}-org`}>
            Organizace <span className="font-normal text-muted">(nepovinné, jen pro orientaci týmu)</span>
          </label>
          <input id={`${idp}-org`} name="organization" maxLength={200} autoComplete="organization" className={INPUT} data-ui />
        </div>
        <div>
          <label className={LABEL} htmlFor={`${idp}-kind`}>
            Typ připomínky
          </label>
          <select id={`${idp}-kind`} name="kind" defaultValue="vecna" className={INPUT} data-ui>
            {PUBLIC_KINDS.map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={LABEL} htmlFor={`${idp}-body`}>
          Připomínka
        </label>
        <textarea id={`${idp}-body`} name="body" required minLength={10} maxLength={5000} rows={5} className={INPUT} placeholder="Jedna věc, jedna připomínka. Když víte o lepším zdroji, uveďte ho." data-ui />
      </div>

      <p id={`${idp}-pozn`} className="text-[15px] text-muted">
        Jméno si můžete zvolit jakékoli. Na e-mail pošleme odkaz k potvrzení připomínky a případně se zeptáme na podrobnosti; nikde ho nezveřejníme a nikomu
        nepředáme. Připomínky od veřejnosti vyřizujeme po připomínkách odborných organizací.{" "}
        <a href="/ochrana-udaju" className="underline">
          Jak s údaji zacházíme
        </a>
      </p>

      {state.error && (
        <p role="alert" className="rounded-[10px] border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[16px] text-rose-900">
          {state.error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-action px-7 text-[18px] font-bold text-white hover:bg-action-hover disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Odesíláme…" : "Odeslat připomínku"}
        </button>
      </div>
    </form>
  );
}
