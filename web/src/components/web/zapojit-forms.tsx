"use client";

import { useActionState, useEffect, useId, useState, type ReactNode } from "react";
import { confirmSignup, contactOrganization, signupRoundTables, type SignupState } from "@/app/zapojit-actions";
import { INTEREST, LIMITS, ORG_REQUESTS, ROLES, TOPICS } from "@/content/zapojit";
import { trackEvent } from "@/lib/analytics";

const INPUT = "w-full rounded-[10px] border border-line-strong bg-paper px-3.5 py-2.5 text-[17px] text-ink";
const LABEL = "mb-1 block text-[15px] font-semibold text-ink";
const OPTIONAL = <span className="font-normal text-muted">(nepovinné)</span>;
const CARD = "flex min-h-12 cursor-pointer items-start gap-3 rounded-card border-2 border-line bg-paper px-4 py-3 text-[17px] leading-snug hover:border-line-strong has-checked:border-forest has-checked:bg-sage-soft";
const CHECK = "mt-1 size-5 shrink-0 accent-forest";
const SUBMIT = "inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-forest px-7 text-[18px] font-bold text-white hover:bg-forest-deep disabled:opacity-60 sm:w-auto";

/** Skryté pole proti robotům a čas otevření formuláře (odeslání do 2,5 s server odmítne). */
function BotFields({ id }: { id: string }) {
  const [ts] = useState(() => Date.now());
  return (
    <>
      <input type="hidden" name="ts" value={ts} />
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor={`${id}-web`}>Web</label>
        <input id={`${id}-web`} name="website" type="text" tabIndex={-1} autoComplete="off" data-ui />
      </div>
    </>
  );
}

function Contact({ id, forOrg }: { id: string; forOrg: boolean }) {
  const org = (
    <div key="org">
      <label className={LABEL} htmlFor={`${id}-org`}>
        {forOrg ? "Organizace" : <>Organizace {OPTIONAL}</>}
      </label>
      <input id={`${id}-org`} name="organization" required={forOrg} minLength={forOrg ? 2 : undefined} maxLength={LIMITS.org} autoComplete="organization" className={INPUT} data-ui />
    </div>
  );
  const role = forOrg ? (
    <div key="role">
      <label className={LABEL} htmlFor={`${id}-role`}>
        Vaše funkce {OPTIONAL}
      </label>
      <input id={`${id}-role`} name="role" maxLength={LIMITS.role} autoComplete="organization-title" className={INPUT} data-ui />
    </div>
  ) : (
    <div key="role">
      <label className={LABEL} htmlFor={`${id}-role`}>
        Kdo jste {OPTIONAL}
      </label>
      <select id={`${id}-role`} name="role" defaultValue="" className={INPUT} data-ui>
        <option value="">Vyberte…</option>
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  );
  const name = (
    <div key="name">
      <label className={LABEL} htmlFor={`${id}-name`}>
        Jméno a příjmení
      </label>
      <input id={`${id}-name`} name="name" required minLength={2} maxLength={LIMITS.name} autoComplete="name" className={INPUT} data-ui />
    </div>
  );
  const email = (
    <div key="email">
      <label className={LABEL} htmlFor={`${id}-email`}>
        E-mail
      </label>
      <input id={`${id}-email`} name="email" type="email" required maxLength={200} autoComplete="email" className={INPUT} data-ui />
    </div>
  );
  // Za organizaci nejdřív organizace a funkce, u přihlášky nejdřív člověk.
  return <div className="grid gap-4 sm:grid-cols-2">{forOrg ? [org, role, name, email] : [name, email, org, role]}</div>;
}

function Newsletter({ id }: { id: string }) {
  return (
    <label htmlFor={`${id}-novinky`} className="flex cursor-pointer items-start gap-3 text-[17px] text-ink">
      <input id={`${id}-novinky`} type="checkbox" name="newsletter" value="ano" className={CHECK} data-ui />
      <span>Posílejte mi i novinky e-mailem: nová verze studie, vypořádání připomínek.</span>
    </label>
  );
}

function Status({ state, children }: { state: SignupState; children: ReactNode }) {
  if (!state.error) return null;
  return (
    <p role="alert" className="rounded-card border-2 border-danger bg-paper px-4 py-3 text-[17px] font-semibold text-danger">
      {children}
    </p>
  );
}

function Done({ title }: { title: string }) {
  return (
    <div role="status" className="rounded-card border border-line bg-sage-soft p-5 text-[17px] text-ink">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-muted">Poslali jsme vám e-mail s odkazem. Platí 48 hodin a do té doby nic neukládáme. Když e-mail nepřijde, zkontrolujte i nevyžádanou poštu.</p>
    </div>
  );
}

/**
 * Zájem o kulaté stoly. Termíny zatím nejsou, proto nabízíme „dejte mi vědět“ a „chci se zúčastnit“.
 * Každé téma má v Brevo vlastní seznam, takže pozvánka půjde jen těm, koho téma zajímá.
 */
export function RoundTableForm() {
  const id = useId().replace(/:/g, "");
  const [topics, setTopics] = useState<string[]>([]);
  const [state, action, pending] = useActionState<SignupState, FormData>(async (prev, fd) => {
    const res = await signupRoundTables(prev, fd);
    if (res.ok) trackEvent("Kulaté stoly: přihláška", { zajem: String(fd.get("interest") ?? ""), temat: fd.getAll("topic").length });
    return res;
  }, {});
  const all = topics.length === TOPICS.length;

  if (state.ok) return <Done title="Skoro hotovo. Přihlášku prosím potvrďte v e-mailu." />;

  return (
    <form action={action} className="flex flex-col gap-6">
      <BotFields id={id} />
      <fieldset>
        <legend className="mb-1 text-[17px] font-bold text-ink">Která témata vás zajímají</legend>
        <p className="mb-3 text-[16px] text-muted">Vyberte jedno nebo víc. Pozvánku pošleme jen k vybraným tématům.</p>
        <button
          type="button"
          onClick={() => setTopics(all ? [] : [...TOPICS])}
          className="mb-3 inline-flex min-h-11 items-center rounded-full border-2 border-forest px-4 text-[16px] font-bold text-forest hover:bg-sage-soft"
        >
          {all ? "Zrušit výběr" : "Vybrat všechna témata"}
        </button>
        <div className="grid gap-2 sm:grid-cols-2">
          {TOPICS.map((t, i) => (
            <label key={t} htmlFor={`${id}-t${i}`} className={CARD}>
              <input
                id={`${id}-t${i}`}
                type="checkbox"
                name="topic"
                value={t}
                checked={topics.includes(t)}
                onChange={(e) => setTopics((x) => (e.target.checked ? [...x, t] : x.filter((y) => y !== t)))}
                className={CHECK}
                data-ui
              />
              <span className="text-ink">{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-[17px] font-bold text-ink">Co chcete</legend>
        <div className="grid gap-2">
          {INTEREST.map((o, i) => (
            <label key={o.v} htmlFor={`${id}-z${i}`} className={CARD}>
              <input id={`${id}-z${i}`} type="radio" name="interest" value={o.v} required defaultChecked={i === 0} className={CHECK} data-ui />
              <span>
                <span className="text-ink">{o.l}</span>
                <span className="mt-0.5 block text-[15px] text-muted">{o.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Contact id={id} forOrg={false} />

      <div>
        <label className={LABEL} htmlFor={`${id}-note`}>
          Poznámka {OPTIONAL}
        </label>
        <textarea id={`${id}-note`} name="note" maxLength={LIMITS.note} rows={3} className={INPUT} placeholder="Například čím můžete přispět nebo kdy se vám setkání nehodí." data-ui />
      </div>

      <Newsletter id={id} />

      <p className="text-[15px] text-muted">
        Údaje uložíme až po potvrzení odkazem z e-mailu, a to v Brevo, přes které posíláme pozvánky. Nikde je nezveřejňujeme.{" "}
        <a href="/ochrana-udaju#zapojeni" className="underline">
          Jak s údaji zacházíme
        </a>
      </p>

      <Status state={state}>{state.error}</Status>

      <div>
        <button type="submit" disabled={pending || topics.length === 0} className={SUBMIT}>
          {pending ? "Odesíláme…" : "Odeslat přihlášku"}
        </button>
        {topics.length === 0 && <p className="mt-2 text-[15px] text-muted">Nejdřív vyberte aspoň jedno téma.</p>}
      </div>
    </form>
  );
}

/** Zpráva za organizaci: setkání, podpora, spolupráce nebo zástupce na kulatý stůl. Tým ji dostane e-mailem. */
export function OrganizationForm() {
  const id = useId().replace(/:/g, "");
  const [state, action, pending] = useActionState<SignupState, FormData>(async (prev, fd) => {
    const res = await contactOrganization(prev, fd);
    if (res.ok) trackEvent("Organizace: zpráva", { zadost: fd.getAll("request").join(",") });
    return res;
  }, {});

  if (state.ok) return <Done title="Děkujeme. Zprávu prosím potvrďte v e-mailu, pak ji dostane autor studie." />;

  return (
    <form action={action} className="flex flex-col gap-6">
      <BotFields id={id} />
      <Contact id={id} forOrg />

      <fieldset>
        <legend className="mb-3 text-[17px] font-bold text-ink">S čím se ozýváte</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {ORG_REQUESTS.map((o, i) => (
            <label key={o.v} htmlFor={`${id}-r${i}`} className={CARD}>
              <input id={`${id}-r${i}`} type="checkbox" name="request" value={o.v} className={CHECK} data-ui />
              <span>
                <span className="text-ink">{o.l}</span>
                <span className="mt-0.5 block text-[15px] text-muted">{o.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={LABEL} htmlFor={`${id}-note`}>
          Zpráva {OPTIONAL}
        </label>
        <textarea id={`${id}-note`} name="note" maxLength={LIMITS.note} rows={5} className={INPUT} placeholder="Co chcete probrat, kterých částí plánu se to týká, kdy se vám to hodí." data-ui />
      </div>

      <label htmlFor={`${id}-verejne`} className="flex cursor-pointer items-start gap-3 text-[17px] text-ink">
        <input id={`${id}-verejne`} type="checkbox" name="publish" value="ano" className={CHECK} data-ui />
        <span>
          Název organizace smíte uvést na webu mezi organizacemi, které plán podporují.
          <span className="mt-0.5 block text-[15px] text-muted">Jen u podpory. Před zveřejněním se vám ozveme a znění odsouhlasíme. Jména lidí neuvádíme.</span>
        </span>
      </label>

      <Newsletter id={id} />

      <p className="text-[15px] text-muted">
        Zprávu po potvrzení dostane autor studie e-mailem a kontakt uložíme v Brevo, abychom se mohli ozvat.{" "}
        <a href="/ochrana-udaju#zapojeni" className="underline">
          Jak s údaji zacházíme
        </a>
      </p>

      <Status state={state}>{state.error}</Status>

      <div>
        <button type="submit" disabled={pending} className={SUBMIT}>
          {pending ? "Odesíláme…" : "Odeslat zprávu"}
        </button>
      </div>
    </form>
  );
}

/** Potvrzení tlačítkem (samotné otevření odkazu nic neudělá). */
export function ConfirmSignupForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<SignupState, FormData>(confirmSignup, {});
  useEffect(() => {
    if (state.ok) trackEvent("Potvrzeno", { co: state.kind === "org" ? "organizace" : "kulaté stoly" });
  }, [state.ok, state.kind]);
  if (state.ok) {
    return (
      <div role="status" className="rounded-card border border-line bg-sage-soft p-5 text-[17px] text-ink">
        <p className="font-semibold">{state.kind === "org" ? "Hotovo, zprávu jsme předali autorovi studie." : "Hotovo, jste přihlášeni."}</p>
        <p className="mt-1 text-muted">
          {state.kind === "org" ? "Ozveme se vám e-mailem, obvykle do týdne." : "Až bude termín a místo, pošleme vám pozvánku. Odhlásit se jde odkazem v každém e-mailu."}
        </p>
      </div>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="t" value={token} />
      <Status state={state}>{state.error}</Status>
      <div>
        <button type="submit" disabled={pending} className={SUBMIT}>
          {pending ? "Potvrzujeme…" : "Potvrdit"}
        </button>
      </div>
    </form>
  );
}
