"use server";

import { revalidatePath } from "next/cache";
import { withPoolDb } from "@/db/pool";
import { getSession } from "@/lib/auth";
import { AccountError, updateUser, upsertUser } from "@/lib/accounts-core";
import { can } from "@/lib/roles";
import type { ActionState } from "@/app/actions";

function str(fd: FormData, key: string, max: number): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

async function coordinator() {
  const s = await getSession();
  return s && can(s.role, "manageUsers") ? s : null;
}

/** Založení člověka nebo úprava podle e-mailu (jen koordinátor). */
export async function saveUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const s = await coordinator();
  if (!s) return { error: "Lidi spravuje jen koordinátor." };
  try {
    await withPoolDb((db) => upsertUser(db, { email: str(fd, "email", 200), name: str(fd, "name", 120), organization: str(fd, "organization", 200), role: str(fd, "role", 20) }, s.name));
  } catch (e) {
    if (e instanceof AccountError) return { error: e.message };
    console.error(e);
    return { error: "Uložení se nepovedlo." };
  }
  revalidatePath("/lide");
  return { ok: true };
}

/** Změna role nebo deaktivace (jen koordinátor). */
export async function changeUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const s = await coordinator();
  if (!s) return { error: "Lidi spravuje jen koordinátor." };
  const id = Number(fd.get("id"));
  if (!Number.isInteger(id) || id <= 0) return { error: "Člověk nenalezen." };
  try {
    await withPoolDb((db) => updateUser(db, id, { role: str(fd, "role", 20), active: fd.get("active") === "on" }, s.name));
  } catch (e) {
    if (e instanceof AccountError) return { error: e.message };
    console.error(e);
    return { error: "Uložení se nepovedlo." };
  }
  revalidatePath("/lide");
  return { ok: true };
}
