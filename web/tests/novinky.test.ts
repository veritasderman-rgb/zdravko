/**
 * Odběr novinek: podepsaný odkaz k potvrzení a založení seznamu v Brevo (fetch je podvržený).
 */
import { describe, expect, it } from "vitest";
import { FOLDER_NAME, LIST_NAME, brevo } from "@/lib/brevo";
import { openDataToken, openToken, signDataToken, signToken } from "@/lib/privacy-core";

const SECRET = "testovaci-tajemstvi-0123456789";
const EMAIL = "jana@example.cz";

describe("odkaz k potvrzení odběru", () => {
  it("platí jen pro svůj účel a do vypršení", () => {
    const now = Date.UTC(2026, 9, 1);
    const t = signToken(SECRET, "novinky", EMAIL, 48, now);
    expect(openToken(SECRET, "novinky", t, now + 47 * 3600_000)).toBe(EMAIL);
    expect(openToken(SECRET, "novinky", t, now + 49 * 3600_000)).toBeNull();
    // Odkaz k odběru neotevře vlastní údaje a naopak.
    expect(openDataToken(SECRET, t, now)).toBeNull();
    expect(openToken(SECRET, "novinky", signDataToken(SECRET, EMAIL, now), now)).toBeNull();
    expect(openToken("jine-tajemstvi-0123456789-abcdef", "novinky", t, now)).toBeNull();
  });
});

type Call = { method: string; path: string; body?: unknown };

function fakeFetch(state: { lists: { id: number; name: string }[]; folders: { id: number; name: string }[] }) {
  const calls: Call[] = [];
  const impl = (async (url: string, init?: RequestInit) => {
    const path = url.replace("https://api.brevo.com/v3", "");
    const method = init?.method ?? "GET";
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    calls.push({ method, path, body });
    const json = (status: number, data: unknown) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
    // Brevo stránkuje po `limit` od `offset`.
    const page = <T,>(items: T[]) => {
      const q = new URL(url).searchParams;
      const offset = Number(q.get("offset") ?? 0);
      return items.slice(offset, offset + Number(q.get("limit") ?? 10));
    };
    if (method === "GET" && path.startsWith("/contacts/lists")) return json(200, { lists: page(state.lists) });
    if (method === "GET" && path.startsWith("/contacts/folders")) return json(200, { folders: page(state.folders) });
    if (method === "POST" && path === "/contacts/folders") return json(201, { id: 41 });
    if (method === "POST" && path === "/contacts/lists") return json(201, { id: 42 });
    if (method === "POST" && path === "/contacts") return new Response(null, { status: 204 });
    return json(400, { message: "neznámý požadavek" });
  }) as typeof fetch;
  return { impl, calls };
}

describe("Brevo", () => {
  it("najde existující seznam podle názvu", async () => {
    const f = fakeFetch({ lists: [{ id: 6, name: "Jiný" }, { id: 11, name: LIST_NAME }], folders: [] });
    expect(await brevo("k", f.impl).ensureList()).toBe(11);
    expect(f.calls.filter((c) => c.method === "POST")).toEqual([]);
  });

  it("hledá i za první stránkou výpisu", async () => {
    const lists = Array.from({ length: 120 }, (_, i) => ({ id: 1000 + i, name: `Seznam ${i}` }));
    lists[87] = { id: 77, name: LIST_NAME };
    const f = fakeFetch({ lists, folders: [] });
    expect(await brevo("k", f.impl).ensureList()).toBe(77);
    expect(f.calls.filter((c) => c.method === "POST")).toEqual([]);
    const folders = Array.from({ length: 60 }, (_, i) => ({ id: 500 + i, name: i === 55 ? FOLDER_NAME : `Složka ${i}` }));
    const g = fakeFetch({ lists: lists.slice(0, 50), folders });
    await brevo("k", g.impl).ensureList();
    expect(g.calls.filter((c) => c.method === "POST")).toEqual([{ method: "POST", path: "/contacts/lists", body: { name: LIST_NAME, folderId: 555 } }]);
  });

  it("chybějící seznam založí do existující složky", async () => {
    const f = fakeFetch({ lists: [], folders: [{ id: 8, name: FOLDER_NAME }] });
    expect(await brevo("k", f.impl).ensureList()).toBe(42);
    expect(f.calls.filter((c) => c.method === "POST")).toEqual([{ method: "POST", path: "/contacts/lists", body: { name: LIST_NAME, folderId: 8 } }]);
  });

  it("bez složky založí složku i seznam", async () => {
    const f = fakeFetch({ lists: [], folders: [] });
    expect(await brevo("k", f.impl).ensureList()).toBe(42);
    expect(f.calls.filter((c) => c.method === "POST").map((c) => c.body)).toEqual([{ name: FOLDER_NAME }, { name: LIST_NAME, folderId: 41 }]);
  });

  it("přidá kontakt do seznamu a chybu API vyhodí", async () => {
    const f = fakeFetch({ lists: [], folders: [] });
    await brevo("k", f.impl).subscribe(EMAIL, 42);
    expect(f.calls.at(-1)).toEqual({ method: "POST", path: "/contacts", body: { email: EMAIL, listIds: [42], updateEnabled: true } });
    const failing = (async () => new Response("unauthorized", { status: 401 })) as unknown as typeof fetch;
    await expect(brevo("k", failing).ensureList()).rejects.toThrow(/401/);
  });
});
