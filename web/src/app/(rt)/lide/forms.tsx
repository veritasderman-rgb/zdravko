"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/actions";
import { changeUser, saveUser } from "@/app/ucty-actions";
import { ROLES, ROLE_LABEL, type Role } from "@/lib/roles";

function RoleSelect({ value, id }: { value?: Role; id?: string }) {
  return (
    <select id={id} name="role" defaultValue={value ?? "ctenar"} className="!w-auto">
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {ROLE_LABEL[r]}
        </option>
      ))}
    </select>
  );
}

export function NewUserForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveUser, {});
  return (
    <form action={action} className="grid gap-2 rounded-lg border border-line bg-paper p-4 text-sm md:grid-cols-[1fr_1fr_1fr_auto_auto]">
      <input name="email" type="email" required placeholder="e-mail" aria-label="E-mail" />
      <input name="name" required minLength={2} placeholder="jméno a příjmení" aria-label="Jméno a příjmení" />
      <input name="organization" placeholder="organizace (nepovinné)" aria-label="Organizace" />
      <RoleSelect />
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Ukládám…" : "Uložit"}
      </button>
      {state.error && <p className="text-rose-700 md:col-span-5">{state.error}</p>}
      {state.ok && <p className="text-emerald-800 md:col-span-5">Uloženo. Člověk se přihlásí odkazem na svůj e-mail na stránce /vstup.</p>}
    </form>
  );
}

export function UserRowForm({ id, role, active }: { id: number; role: Role; active: boolean }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(changeUser, {});
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <RoleSelect value={role} />
      <label className="flex items-center gap-1">
        <input type="checkbox" name="active" defaultChecked={active} className="!w-auto" /> aktivní
      </label>
      <button className="btn !py-0.5 !px-2 !text-xs" type="submit" disabled={pending}>
        Uložit
      </button>
      {state.error && <span className="text-rose-700">{state.error}</span>}
    </form>
  );
}
