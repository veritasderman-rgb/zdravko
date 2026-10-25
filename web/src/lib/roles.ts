/**
 * Role v interní části a co která smí. Jediné místo, kde se oprávnění rozhodují;
 * stránky podle něj skrývají ovládání a server actions podle něj odmítají zápis.
 */

export const ROLES = ["ctenar", "garant", "oponent", "autor", "koordinator"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  ctenar: "čtenář",
  garant: "garant",
  oponent: "oponent",
  autor: "autor",
  koordinator: "koordinátor",
};

export const ROLE_NOTE: Record<Role, string> = {
  ctenar: "čte studii a připomínky, píše připomínky a odpovědi",
  garant: "navíc třídí připomínky (garant, téma, priorita), navrhuje vypořádání, vede registr „Ověřit“ a vidí e-maily veřejnosti",
  oponent: "navíc kontroluje návrh vypořádání: potvrdí ho, nebo vrátí k řešení",
  autor: "může totéž co garant, navíc rozhoduje o vypořádání a exportuje",
  koordinator: "může všechno, navíc zveřejňuje vypořádání a spravuje lidi a role",
};

export type Permission = "triage" | "verify" | "export" | "seeEmails" | "manageUsers";

const PERMS: Record<Role, readonly Permission[]> = {
  ctenar: [],
  garant: ["triage", "verify", "seeEmails"],
  oponent: [],
  autor: ["triage", "verify", "seeEmails", "export"],
  koordinator: ["triage", "verify", "seeEmails", "export", "manageUsers"],
};

/** Stavy připomínky, do kterých smí role připomínku posunout. */
const STATUS_TARGETS: Record<Role, readonly string[]> = {
  ctenar: [],
  garant: ["nova", "prirazena", "v_reseni", "navrh_vyporadani"],
  oponent: ["v_reseni", "zkontrolovano"],
  autor: ["nova", "prirazena", "v_reseni", "navrh_vyporadani", "zkontrolovano", "vyporadana"],
  koordinator: ["nova", "prirazena", "v_reseni", "navrh_vyporadani", "zkontrolovano", "vyporadana", "zverejnena"],
};

export const isRole = (v: unknown): v is Role => typeof v === "string" && (ROLES as readonly string[]).includes(v);

export function can(role: Role, perm: Permission): boolean {
  return PERMS[role].includes(perm);
}

export function statusTargets(role: Role): readonly string[] {
  return STATUS_TARGETS[role];
}

/** Smí role připomínku ze stavu `from` posunout do `to`? Beze změny stavu je to vždy v pořádku. */
export function canSetStatus(role: Role, from: string, to: string): boolean {
  return from === to || STATUS_TARGETS[role].includes(to);
}
