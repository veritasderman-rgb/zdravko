/**
 * Odběr novinek přes Brevo (HTTP API v3, bez knihovny). Seznam kontaktů si web najde
 * nebo založí sám podle názvu, takže stačí API klíč; číslo seznamu lze pevně dát
 * proměnnou BREVO_LIST_ID. Kontakt se přidává až po potvrzení odkazem z e-mailu.
 */
export const LIST_NAME = "Zdraví blíž lidem — novinky";
export const FOLDER_NAME = "Zdraví blíž lidem";

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

  /** Číslo seznamu novinek: najde ho podle názvu, jinak založí složku i seznam. */
  async function ensureList(): Promise<number> {
    const found = (await all("/contacts/lists", "lists")).find((l) => l.name === LIST_NAME);
    if (found) return found.id;
    const folderId =
      (await all("/contacts/folders", "folders")).find((f) => f.name === FOLDER_NAME)?.id ??
      (await call<{ id: number }>("/contacts/folders", { method: "POST", body: { name: FOLDER_NAME } })).id;
    return (await call<{ id: number }>("/contacts/lists", { method: "POST", body: { name: LIST_NAME, folderId } })).id;
  }

  /** Přidá potvrzený e-mail do seznamu; existující kontakt jen doplní o seznam. */
  async function subscribe(email: string, listId: number): Promise<void> {
    await call("/contacts", { method: "POST", body: { email, listIds: [listId], updateEnabled: true } });
  }

  return { ensureList, subscribe };
}
