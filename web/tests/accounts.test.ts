/**
 * Osobní účty a role: oprávnění podle role, přihlášení jednorázovým odkazem,
 * správa lidí a vynucení rolí při změně stavu připomínky a registru „Ověřit“.
 */
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import type { PGlite } from "@electric-sql/pglite";
import * as schema from "@/db/schema";
import type { AnyDb } from "@/db/pool";
import { importDocumentVersion } from "@/lib/importer";
import { CommentError, createComment, setCommentStatus, setVerificationStatus } from "@/lib/comments-core";
import { AccountError, consumeLoginToken, createLoginToken, getActiveUser, updateUser, upsertUser } from "@/lib/accounts-core";
import { ROLES, can, canSetStatus, statusTargets } from "@/lib/roles";
import { openSession, sealSession } from "@/lib/session";
import { idSeq, testDb } from "./helpers/db";

const SRC = `# Studie

## Pilíř 1

První odstavec o týmech primární péče a sestrách v ordinaci. Ověřit: výše platby.
`;

let db: AnyDb;
let client: PGlite;
let documentId: number;
let versionId: number;

beforeAll(async () => {
  process.env.SESSION_SECRET = "testovaci-tajemstvi-pro-session-0123456789";
  ({ db, client } = await testDb());
  const r = await importDocumentVersion(db, { slug: "studie", title: "Studie", kind: "studie", sourcePath: "s.md", sort: 0, label: "v1", src: SRC, makeId: idSeq() });
  if (r.status !== "imported") throw new Error("import selhal");
  documentId = r.documentId;
  versionId = r.versionId;
});

beforeEach(async () => {
  await client.exec("delete from events where entity <> 'import'; delete from comments; delete from login_tokens; delete from users;");
});

const koordinator = () => upsertUser(db, { email: "Koord@Example.cz ", name: "Kamila Koordinátorová", role: "koordinator" }, "test");

describe("role", () => {
  it("čtenář jen připomínkuje, koordinátor smí všechno", () => {
    expect(ROLES.map((r) => can(r, "manageUsers"))).toEqual([false, false, false, false, true]);
    expect(can("ctenar", "triage")).toBe(false);
    expect(can("garant", "triage")).toBe(true);
    expect(can("garant", "export")).toBe(false);
    expect(can("autor", "export")).toBe(true);
    expect(can("oponent", "verify")).toBe(false);
    expect(statusTargets("ctenar")).toEqual([]);
  });

  it("stavy: oponent kontroluje, autor vypořádává, zveřejňuje jen koordinátor", () => {
    expect(canSetStatus("garant", "v_reseni", "navrh_vyporadani")).toBe(true);
    expect(canSetStatus("garant", "navrh_vyporadani", "vyporadana")).toBe(false);
    expect(canSetStatus("oponent", "navrh_vyporadani", "zkontrolovano")).toBe(true);
    expect(canSetStatus("oponent", "navrh_vyporadani", "v_reseni")).toBe(true);
    expect(canSetStatus("oponent", "nova", "prirazena")).toBe(false);
    expect(canSetStatus("autor", "zkontrolovano", "vyporadana")).toBe(true);
    expect(canSetStatus("autor", "vyporadana", "zverejnena")).toBe(false);
    expect(canSetStatus("koordinator", "vyporadana", "zverejnena")).toBe(true);
    expect(canSetStatus("ctenar", "nova", "nova")).toBe(true);
  });
});

describe("přihlášení odkazem", () => {
  it("odkaz platí jednou a jen pro aktivního člověka", async () => {
    const u = await koordinator();
    expect(u.email).toBe("koord@example.cz");
    const link = await createLoginToken(db, "KOORD@example.cz");
    expect(link?.user.id).toBe(u.id);
    const [stored] = await db.select().from(schema.loginTokens);
    expect(stored.tokenHash).not.toBe(link!.token);

    expect(await consumeLoginToken(db, "spatny")).toBeNull();
    const logged = await consumeLoginToken(db, link!.token);
    expect(logged?.id).toBe(u.id);
    expect(logged?.lastLoginAt).not.toBeNull();
    expect(await consumeLoginToken(db, link!.token)).toBeNull();
  });

  it("neznámý e-mail ani deaktivovaný člověk odkaz nedostane; starý odkaz po deaktivaci neplatí", async () => {
    await koordinator();
    const g = await upsertUser(db, { email: "garant@example.cz", name: "Gustav Garant", role: "garant" }, "test");
    expect(await createLoginToken(db, "nikdo@example.cz")).toBeNull();
    const link = await createLoginToken(db, g.email);
    await updateUser(db, g.id, { active: false }, "test");
    expect(await consumeLoginToken(db, link!.token)).toBeNull();
    expect(await createLoginToken(db, g.email)).toBeNull();
    expect(await getActiveUser(db, g.id)).toBeNull();
  });

  it("prošlý odkaz neplatí", async () => {
    const u = await koordinator();
    const link = await createLoginToken(db, u.email);
    await client.exec("update login_tokens set expires_at = now() - interval '1 minute'");
    expect(await consumeLoginToken(db, link!.token)).toBeNull();
  });
});

describe("správa lidí", () => {
  it("upraví člověka podle e-mailu a zapíše audit", async () => {
    await koordinator();
    const a = await upsertUser(db, { email: "jana@example.cz", name: "Jana", role: "ctenar" }, "Kamila");
    const b = await upsertUser(db, { email: "JANA@example.cz", name: "Jana Nováková", organization: "ČAS", role: "garant" }, "Kamila");
    expect(b.id).toBe(a.id);
    expect(b).toMatchObject({ name: "Jana Nováková", organization: "ČAS", role: "garant" });
    const ev = await db.select().from(schema.events).where(eq(schema.events.entityId, a.id));
    expect(ev.filter((e) => e.entity === "user").map((e) => e.action)).toEqual(["created", "updated"]);
  });

  it("odmítne neplatný e-mail, roli a odebrání posledního koordinátora", async () => {
    const k = await koordinator();
    await expect(upsertUser(db, { email: "x", name: "Xaver", role: "ctenar" }, "t")).rejects.toBeInstanceOf(AccountError);
    await expect(upsertUser(db, { email: "x@example.cz", name: "Xaver", role: "spravce" }, "t")).rejects.toThrow(/roli/);
    await expect(updateUser(db, k.id, { role: "autor" }, "t")).rejects.toThrow(/koordinátor/);
    await expect(updateUser(db, k.id, { active: false }, "t")).rejects.toThrow(/koordinátor/);
    await upsertUser(db, { email: "druhy@example.cz", name: "Druhý Koordinátor", role: "koordinator" }, "t");
    expect((await updateUser(db, k.id, { role: "autor" }, "t")).role).toBe("autor");
  });
});

describe("session", () => {
  it("platí jen s účtem a známou rolí; stará session ze sdíleného kódu ne", async () => {
    const ok = await sealSession({ uid: 7, name: "Jana", organization: "", role: "garant" });
    expect((await openSession(ok))?.uid).toBe(7);
    const legacy = await sealSession({ name: "Jana", organization: "", role: "rt" } as never);
    expect(await openSession(legacy)).toBeNull();
    const [body, sig] = ok.split(".");
    expect(await openSession(`${body}x.${sig}`)).toBeNull();
  });
});

describe("vynucení rolí při zápisech", () => {
  const comment = () =>
    createComment(db, { documentId, versionId, blockKey: "studie/pilir-1#p1", kind: "vecna", severity: "doporucujici", body: "Připomínka k odstavci.", authorName: "Jana", channel: "rt", actor: "Jana" });
  const get = async (id: number) => (await db.select().from(schema.comments).where(eq(schema.comments.id, id)))[0];

  it("čtenář stav nezmění, garant ano, ale nevypořádá", async () => {
    const r = await comment();
    await expect(setCommentStatus(db, { id: r.id, status: "v_reseni", role: "ctenar", actor: "Čtenář" })).rejects.toBeInstanceOf(CommentError);
    await setCommentStatus(db, { id: r.id, status: "navrh_vyporadani", assignee: "Gustav", topic: "pilíř 1", role: "garant", actor: "Gustav" });
    expect(await get(r.id)).toMatchObject({ status: "navrh_vyporadani", assignee: "Gustav", topic: "pilíř 1" });
    await expect(setCommentStatus(db, { id: r.id, status: "vyporadana", role: "garant", actor: "Gustav" })).rejects.toThrow(/role/);
  });

  it("oponent potvrdí návrh, ale garanta ani téma nepřepíše", async () => {
    const r = await comment();
    await setCommentStatus(db, { id: r.id, status: "navrh_vyporadani", assignee: "Gustav", topic: "pilíř 1", role: "garant", actor: "Gustav" });
    await setCommentStatus(db, { id: r.id, status: "zkontrolovano", assignee: "", topic: "", role: "oponent", actor: "Olga" });
    expect(await get(r.id)).toMatchObject({ status: "zkontrolovano", assignee: "Gustav", topic: "pilíř 1" });
    await setCommentStatus(db, { id: r.id, status: "vyporadana", role: "autor", actor: "Autor" });
    await expect(setCommentStatus(db, { id: r.id, status: "zverejnena", role: "autor", actor: "Autor" })).rejects.toThrow(/role/);
    await setCommentStatus(db, { id: r.id, status: "zverejnena", role: "koordinator", actor: "Kamila" });
    expect((await get(r.id)).status).toBe("zverejnena");
  });

  it("registr „Ověřit“ mění garant, oponent ani čtenář ne", async () => {
    const [v] = await db.select().from(schema.verifications);
    await expect(setVerificationStatus(db, { id: v.id, status: "overeno_potvrzeno", role: "oponent", actor: "Olga" })).rejects.toThrow(/Ověřit/);
    await expect(setVerificationStatus(db, { id: v.id, status: "overeno_potvrzeno", role: "ctenar", actor: "Č" })).rejects.toBeInstanceOf(CommentError);
    await setVerificationStatus(db, { id: v.id, status: "overeno_potvrzeno", note: "OK", role: "garant", actor: "Gustav" });
    const [after] = await db.select().from(schema.verifications).where(eq(schema.verifications.id, v.id));
    expect(after.status).toBe("overeno_potvrzeno");
  });
});
