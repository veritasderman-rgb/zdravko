/**
 * Odběr novinek a zapojení do konzultace: odkazy k potvrzení, kontrola přihlášek a seznamy
 * a atributy v Brevo (fetch je podvržený).
 */
import { describe, expect, it } from "vitest";
import { ATTRIBUTES, FOLDER_NAME, LIST_NAME, ORG_LIST_NAME, brevo, roundTableList } from "@/lib/brevo";
import { openDataToken, openSealed, openToken, sealToken, signDataToken, signToken } from "@/lib/privacy-core";
import { TOPICS, orgError, roundTableError } from "@/content/zapojit";

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

describe("Brevo: kulaté stoly a organizace", () => {
  it("založí jen chybějící seznamy, složku nejvýš jednou", async () => {
    const f = fakeFetch({ lists: [{ id: 5, name: roundTableList("Sestry v primární péči") }], folders: [] });
    const ids = await brevo("k", f.impl).ensureLists([roundTableList("Sestry v primární péči"), roundTableList("Prevence a daně za zdraví"), ORG_LIST_NAME]);
    expect(ids[0]).toBe(5);
    const posts = f.calls.filter((c) => c.method === "POST");
    expect(posts.map((c) => c.path)).toEqual(["/contacts/folders", "/contacts/lists", "/contacts/lists"]);
    expect(posts[1].body).toEqual({ name: roundTableList("Prevence a daně za zdraví"), folderId: 41 });
  });

  it("založí jen chybějící atributy a pošle je s kontaktem", async () => {
    const calls: Call[] = [];
    const impl = (async (url: string, init?: RequestInit) => {
      calls.push({ method: init?.method ?? "GET", path: url.replace("https://api.brevo.com/v3", ""), body: init?.body ? JSON.parse(String(init.body)) : undefined });
      if (url.endsWith("/contacts/attributes")) return new Response(JSON.stringify({ attributes: [{ name: "ZBL_JMENO" }, { name: "EMAIL" }] }), { status: 200 });
      return new Response(null, { status: 204 });
    }) as typeof fetch;
    const api = brevo("k", impl);
    await api.ensureAttributes();
    const created = calls.filter((c) => c.method === "POST").map((c) => c.path);
    expect(created).toHaveLength(ATTRIBUTES.length - 1);
    expect(created).not.toContain("/contacts/attributes/normal/ZBL_JMENO");
    expect(calls.find((c) => c.path === "/contacts/attributes/normal/ZBL_ZPRAVA")?.body).toEqual({ type: "text" });
    await api.subscribe(EMAIL, [3, 4], { ZBL_JMENO: "Jana" });
    expect(calls.at(-1)?.body).toEqual({ email: EMAIL, listIds: [3, 4], updateEnabled: true, attributes: { ZBL_JMENO: "Jana" } });
  });
});

describe("zapečetěný odkaz přihlášky", () => {
  const data = { kind: "org", email: EMAIL, name: "Jana Nováková", note: "Rádi bychom se setkali. Žluťoučký kůň." };

  it("vrátí data jen pro svůj účel, se správným tajemstvím a do vypršení", () => {
    const now = Date.UTC(2026, 9, 1);
    const t = sealToken(SECRET, "zapojit", data, 48, now);
    expect(openSealed(SECRET, "zapojit", t, now + 47 * 3600_000)).toEqual(data);
    expect(openSealed(SECRET, "zapojit", t, now + 49 * 3600_000)).toBeNull();
    expect(openSealed(SECRET, "novinky", t, now)).toBeNull();
    expect(openSealed("jine-tajemstvi-0123456789-abcdef", "zapojit", t, now)).toBeNull();
    // Obsah v odkazu není čitelný.
    expect(Buffer.from(t, "base64url").toString("utf8")).not.toContain("Nováková");
  });

  it("odmítne pozměněný nebo useknutý odkaz", () => {
    const t = sealToken(SECRET, "zapojit", data, 48);
    const raw = Buffer.from(t, "base64url");
    raw[raw.length - 1] ^= 1;
    expect(openSealed(SECRET, "zapojit", raw.toString("base64url"))).toBeNull();
    expect(openSealed(SECRET, "zapojit", t.slice(0, 20))).toBeNull();
    expect(openSealed(SECRET, "zapojit", "")).toBeNull();
  });
});

describe("kontrola přihlášek", () => {
  const base = { email: EMAIL, name: "Jana", org: "", role: "", note: "", newsletter: false };

  it("kulaté stoly: téma z nabídky, zájem a platný e-mail", () => {
    const ok = { ...base, interest: "informovat", topics: [TOPICS[1]] };
    expect(roundTableError(ok)).toBeNull();
    expect(roundTableError({ ...ok, topics: [] })).toMatch(/téma/);
    expect(roundTableError({ ...ok, topics: ["Vymyšlené téma"] })).toMatch(/nabídce/);
    expect(roundTableError({ ...ok, interest: "neco" })).toMatch(/termínu/);
    expect(roundTableError({ ...ok, email: "jana@" })).toMatch(/e-mail/);
    expect(roundTableError({ ...ok, role: "Kosmonaut" })).toMatch(/roli/);
    expect(roundTableError({ ...ok, note: "https://a.cz https://b.cz https://c.cz https://d.cz" })).toMatch(/odkazů/);
  });

  it("organizace: název a aspoň jedna volba", () => {
    const ok = { ...base, org: "Spolek pacientů", requests: ["setkani"], publish: false };
    expect(orgError(ok)).toBeNull();
    expect(orgError({ ...ok, org: "" })).toMatch(/organizace/);
    expect(orgError({ ...ok, requests: [] })).toMatch(/ozýváte/);
    expect(orgError({ ...ok, requests: ["jine"] })).toMatch(/nabídce/);
  });
});
