/**
 * Kontakty v Brevo (HTTP API v3, bez knihovny): odběr novinek, zájem o kulaté stoly a zprávy
 * od organizací. Seznamy i vlastní atributy kontaktu si web najde nebo založí sám podle názvu,
 * takže stačí API klíč; číslo seznamu novinek lze pevně dát proměnnou BREVO_LIST_ID.
 * Kontakt se přidává až po potvrzení odkazem z e-mailu.
 */
export const LIST_NAME = "Zdraví blíž lidem — novinky";
export const FOLDER_NAME = "Zdraví blíž lidem";
/** Seznam pro jeden kulatý stůl: až bude termín, pozvánka jde právě jemu. */
export const roundTableList = (topic: string) => `Zdraví blíž lidem — kulatý stůl: ${topic}`;
export const ORG_LIST_NAME = "Zdraví blíž lidem — organizace";
/** Vlastní textové atributy kontaktu (předpona ZBL, aby se nepletly s výchozími atributy účtu). */
export const ATTRIBUTES = ["ZBL_JMENO", "ZBL_ORGANIZACE", "ZBL_ROLE", "ZBL_ZAJEM", "ZBL_KULATE_STOLY", "ZBL_ZADOST", "ZBL_ZPRAVA", "ZBL_ZVEREJNIT"] as const;
export type Attribute = (typeof ATTRIBUTES)[number];

type Fetch = typeof fetch;

export class BrevoError extends Error {}

export function brevo(apiKey: string, fetchImpl: Fetch = fetch) {
  async function call<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
    const res = await fetchImpl(`https://api.brevo.com/v3${path}`, {
      method: init.method ?? "GET",
      headers: { "api-key": apiKey, accept: "application/json", ...(init.body ? { "content-type": "application/json" } : {}) },
      body: init.body ? JSON.stringify(init.body) : undefined,
    });
    if (!res.ok) throw new BrevoError(`Brevo ${init.method ?? "GET"} ${path}: ${res.status} ${(await res.text()).slice(0, 300)}`);
    return (res.status === 204 ? {} : await res.json()) as T;
  }

  /** Všechny položky stránkovaného výpisu (seznamy, složky) po 50. */
  async function all(path: string, key: "lists" | "folders"): Promise<{ id: number; name: string }[]> {
    const out: { id: number; name: string }[] = [];
    for (let offset = 0; ; offset += 50) {
      const page = (await call<Record<string, { id: number; name: string }[] | undefined>>(`${path}?limit=50&offset=${offset}`))[key] ?? [];
      out.push(...page);
      if (page.length < 50) return out;
    }
  }

  /** Čísla seznamů podle názvů: chybějící založí (i se složkou, když chybí). */
  async function ensureLists(names: string[]): Promise<number[]> {
    const lists = await all("/contacts/lists", "lists");
    let folderId: number | null = null;
    const ids: number[] = [];
    for (const name of names) {
      const found = lists.find((l) => l.name === name);
      if (found) {
        ids.push(found.id);
        continue;
      }
      folderId ??=
        (await all("/contacts/folders", "folders")).find((f) => f.name === FOLDER_NAME)?.id ??
        (await call<{ id: number }>("/contacts/folders", { method: "POST", body: { name: FOLDER_NAME } })).id;
      const id = (await call<{ id: number }>("/contacts/lists", { method: "POST", body: { name, folderId } })).id;
      lists.push({ id, name });
      ids.push(id);
    }
    return ids;
  }

  /** Číslo seznamu novinek: najde ho podle názvu, jinak založí složku i seznam. */
  async function ensureList(): Promise<number> {
    return (await ensureLists([LIST_NAME]))[0];
  }

  /** Založí chybějící vlastní atributy kontaktu (text). */
  async function ensureAttributes(): Promise<void> {
    const have = new Set((await call<{ attributes?: { name: string }[] }>("/contacts/attributes")).attributes?.map((a) => a.name) ?? []);
    for (const name of ATTRIBUTES) {
      if (!have.has(name)) await call(`/contacts/attributes/normal/${name}`, { method: "POST", body: { type: "text" } });
    }
  }

  /** Přidá potvrzený e-mail do seznamů; existující kontakt jen doplní o seznamy a atributy. */
  async function subscribe(email: string, listIds: number | number[], attributes?: Partial<Record<Attribute, string>>): Promise<void> {
    const body: Record<string, unknown> = { email, listIds: Array.isArray(listIds) ? listIds : [listIds], updateEnabled: true };
    if (attributes && Object.keys(attributes).length) body.attributes = attributes;
    await call("/contacts", { method: "POST", body });
  }

  return { ensureList, ensureLists, ensureAttributes, subscribe };
}
