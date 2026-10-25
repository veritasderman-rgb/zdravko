/**
 * Ochrana veřejných připomínek a osobních údajů: limity, potvrzení e-mailem,
 * odkaz na vlastní údaje, export, výmaz na žádost a mazání podle lhůt.
 */
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import type { PGlite } from "@electric-sql/pglite";
import * as schema from "@/db/schema";
import type { AnyDb } from "@/db/pool";
import { importDocumentVersion } from "@/lib/importer";
import { createComment, type NewComment } from "@/lib/comments-core";
import {
  ANONYMIZED_NAME,
  ERASED_BODY,
  ERASED_NAME,
  applyRetention,
  clientIp,
  confirmComment,
  dropUnverified,
  erasePersonalData,
  exportPersonalData,
  hitLimit,
  isDuplicate,
  keyHash,
  newVerifyToken,
  openDataToken,
  signDataToken,
  spamReason,
} from "@/lib/privacy-core";
import { idSeq, testDb } from "./helpers/db";

const SRC = `# Studie

## Pilíř 1

První odstavec o týmech primární péče a sestrách v ordinaci.
`;

const SECRET = "testovaci-tajemstvi-0123456789";
const EMAIL = "jana@example.cz";

let db: AnyDb;
let client: PGlite;
let documentId: number;
let versionId: number;

const pub = (over: Partial<NewComment> = {}): NewComment => ({
  documentId,
  versionId,
  blockKey: "studie/pilir-1#p1",
  kind: "vecna",
  severity: "doporucujici",
  body: "Veřejná připomínka k týmům primární péče.",
  authorName: "Jana Tajná",
  email: EMAIL,
  organization: "Spolek pacientů",
  channel: "verejnost",
  priority: "nizka",
  actor: "verejnost",
  ...over,
});

const comment = async (id: number) => (await db.select().from(schema.comments).where(eq(schema.comments.id, id)))[0];
const ago = (sqlInterval: string, id: number) => client.exec(`update comments set created_at = now() - interval '${sqlInterval}' where id = ${id}`);

beforeAll(async () => {
  ({ db, client } = await testDb());
  const r = await importDocumentVersion(db, { slug: "studie", title: "Studie", kind: "studie", sourcePath: "s.md", sort: 0, label: "v1", src: SRC, makeId: idSeq() });
  if (r.status !== "imported") throw new Error("import selhal");
  documentId = r.documentId;
  versionId = r.versionId;
});

beforeEach(async () => {
  await client.exec("delete from events where entity <> 'import'; delete from resolutions; delete from comments; delete from rate_hits;");
});

describe("limity a antispam", () => {
  it("pustí nejvýš max pokusů v okně a každý klíč počítá zvlášť", async () => {
    const limits = [{ windowS: 600, max: 3 }];
    const a = keyHash(SECRET, "203.0.113.5");
    for (let i = 0; i < 3; i++) expect(await hitLimit(db, "pripominka-ip", a, limits)).toBe(true);
    expect(await hitLimit(db, "pripominka-ip", a, limits)).toBe(false);
    expect(await hitLimit(db, "pripominka-ip", keyHash(SECRET, "203.0.113.6"), limits)).toBe(true);
    expect(await hitLimit(db, "udaje-ip", a, limits)).toBe(true);
  });

  it("pokus přes limit se nezapíše a starší záznamy mimo okno se nepočítají", async () => {
    const k = keyHash(SECRET, "198.51.100.1");
    await hitLimit(db, "s", k, [{ windowS: 600, max: 1 }]);
    expect(await hitLimit(db, "s", k, [{ windowS: 600, max: 1 }])).toBe(false);
    expect((await db.select().from(schema.rateHits)).length).toBe(1);
    await client.exec("update rate_hits set created_at = now() - interval '11 minutes'");
    expect(await hitLimit(db, "s", k, [{ windowS: 600, max: 1 }])).toBe(true);
  });

  it("souběžné pokusy nepřekročí limit", async () => {
    const k = keyHash(SECRET, "192.0.2.9");
    const results = await Promise.all(Array.from({ length: 6 }, () => hitLimit(db, "soubeh", k, [{ windowS: 600, max: 3 }])));
    expect(results.filter(Boolean)).toHaveLength(3);
  });

  it("neukládá adresu IP, jen její HMAC závislý na tajemství", async () => {
    const k = keyHash(SECRET, "203.0.113.5");
    expect(k).not.toContain("203.0.113.5");
    expect(k).toBe(keyHash(SECRET, " 203.0.113.5 "));
    expect(k).not.toBe(keyHash("jine-tajemstvi-0123456789", "203.0.113.5"));
  });

  it("vezme první adresu z x-forwarded-for", () => {
    const h = (m: Record<string, string>) => ({ get: (n: string) => m[n] ?? null });
    expect(clientIp(h({ "x-forwarded-for": "203.0.113.5, 10.0.0.1" }))).toBe("203.0.113.5");
    expect(clientIp(h({ "x-real-ip": "198.51.100.7" }))).toBe("198.51.100.7");
    expect(clientIp(h({}))).toBe("neznama");
  });

  it("odmítne text s víc než třemi odkazy", () => {
    expect(spamReason("Zdroj: https://czso.cz a https://uzis.cz")).toBeNull();
    expect(spamReason("a http://a.cz b http://b.cz c www.c.cz d https://d.cz")).toMatch(/odkazy/);
  });

  it("pozná stejný text ze stejného e-mailu za posledních 24 hodin", async () => {
    const r = await createComment(db, pub());
    expect(await isDuplicate(db, EMAIL, pub().body)).toBe(true);
    expect(await isDuplicate(db, "jiny@example.cz", pub().body)).toBe(false);
    await ago("25 hours", r.id);
    expect(await isDuplicate(db, EMAIL, pub().body)).toBe(false);
  });
});

describe("potvrzení e-mailem", () => {
  it("potvrdí připomínku jen správným tokenem a jen jednou", async () => {
    const t = newVerifyToken();
    const r = await createComment(db, pub({ verifyTokenHash: t.hash }));
    expect((await comment(r.id)).verifyTokenHash).toBe(t.hash);
    expect(t.hash).not.toBe(t.token);

    expect(await confirmComment(db, "spatny-token")).toBeNull();
    const ok = await confirmComment(db, t.token);
    expect(ok?.id).toBe(r.id);
    expect((await comment(r.id)).verifyTokenHash).toBeNull();
    expect(await confirmComment(db, t.token)).toBeNull();
    const ev = await db.select().from(schema.events).where(eq(schema.events.action, "email_verified"));
    expect(ev).toHaveLength(1);
  });

  it("po sedmi dnech odkaz neplatí", async () => {
    const t = newVerifyToken();
    const r = await createComment(db, pub({ verifyTokenHash: t.hash }));
    await ago("8 days", r.id);
    expect(await confirmComment(db, t.token)).toBeNull();
  });

  it("nepotvrzenou připomínku jde smazat i s auditem, potvrzenou ne", async () => {
    const t = newVerifyToken();
    const pending = await createComment(db, pub({ verifyTokenHash: t.hash }));
    const done = await createComment(db, pub({ body: "Jiná, už potvrzená připomínka." }));
    await dropUnverified(db, pending.id);
    await dropUnverified(db, done.id);
    expect(await comment(pending.id)).toBeUndefined();
    expect(await comment(done.id)).toBeDefined();
    const ev = await db.select().from(schema.events).where(eq(schema.events.entityId, pending.id));
    expect(ev).toHaveLength(0);
  });
});

describe("odkaz na vlastní údaje", () => {
  it("platí 24 hodin a jen s podpisem", () => {
    const now = Date.UTC(2026, 9, 25, 12);
    const t = signDataToken(SECRET, EMAIL, now);
    expect(openDataToken(SECRET, t, now + 60_000)).toBe(EMAIL);
    expect(openDataToken(SECRET, t, now + 25 * 3600_000)).toBeNull();
    expect(openDataToken("jine-tajemstvi-0123456789", t, now)).toBeNull();
    const [body, sig] = t.split(".");
    const forged = Buffer.from(JSON.stringify({ e: "cizi@example.cz", x: 9999999999 })).toString("base64url");
    expect(openDataToken(SECRET, `${forged}.${sig}`, now)).toBeNull();
    expect(openDataToken(SECRET, `${body}.`, now)).toBeNull();
    expect(openDataToken(SECRET, undefined, now)).toBeNull();
  });

  it("export obsahuje jen připomínky daného e-mailu i s vypořádáním", async () => {
    const mine = await createComment(db, pub());
    await createComment(db, pub({ email: "jiny@example.cz", authorName: "Jiný", body: "Cizí připomínka k odstavci." }));
    await db.insert(schema.resolutions).values({ commentId: mine.id, outcome: "akceptovano", reasoning: "Doplněno.", authorName: "Tým" });
    const data = await exportPersonalData(db, EMAIL);
    expect(data.comments).toHaveLength(1);
    expect(data.comments[0]).toMatchObject({ id: mine.id, name: "Jana Tajná", organization: "Spolek pacientů", confirmed: true });
    expect(data.comments[0].resolution[0].outcome).toBe("akceptovano");
  });
});

describe("výmaz na žádost", () => {
  it("nepotvrzené smaže, potvrzené anonymizuje a vyčistí audit; cizí nechá", async () => {
    const t = newVerifyToken();
    const pending = await createComment(db, pub({ verifyTokenHash: t.hash, body: "Nepotvrzená připomínka autorky." }));
    const done = await createComment(db, pub());
    const other = await createComment(db, pub({ email: "jiny@example.cz", authorName: "Jiný", body: "Cizí připomínka k odstavci." }));
    await db.insert(schema.events).values({ entity: "comment", entityId: done.id, action: "confirmation_sent", actor: "verejnost: Jana Tajná", payload: { to: EMAIL } });

    const r = await erasePersonalData(db, EMAIL);
    expect(r).toEqual({ erased: 1, deleted: 1 });
    expect(await comment(pending.id)).toBeUndefined();
    const c = await comment(done.id);
    expect(c).toMatchObject({ authorName: ERASED_NAME, email: null, organization: null, body: ERASED_BODY, proposedText: null });
    expect(c.anonymizedAt).not.toBeNull();
    expect(c.anchorId).not.toBeNull();
    expect((await comment(other.id)).email).toBe("jiny@example.cz");

    const events = JSON.stringify(await db.select().from(schema.events));
    expect(events).not.toContain(EMAIL);
    expect(events).not.toContain("Jana Tajná");
    expect((await exportPersonalData(db, EMAIL)).comments).toHaveLength(0);
  });
});

describe("lhůty uchování", () => {
  it("smaže staré nepotvrzené a záznamy limitů, po 24 měsících odstraní jméno a e-mail", async () => {
    const stale = await createComment(db, pub({ verifyTokenHash: newVerifyToken().hash, body: "Stará nepotvrzená připomínka." }));
    const fresh = await createComment(db, pub({ verifyTokenHash: newVerifyToken().hash, body: "Čerstvá nepotvrzená připomínka." }));
    const old = await createComment(db, pub({ body: "Stará potvrzená připomínka veřejnosti." }));
    const recent = await createComment(db, pub({ body: "Nová potvrzená připomínka veřejnosti." }));
    const team = await createComment(db, pub({ channel: "rt", email: null, body: "Stará připomínka člena týmu.", actor: "Člen týmu" }));
    await ago("8 days", stale.id);
    await ago("25 months", old.id);
    await ago("25 months", team.id);
    await hitLimit(db, "pripominka-ip", "k1", [{ windowS: 600, max: 5 }]);
    await hitLimit(db, "pripominka-ip", "k2", [{ windowS: 600, max: 5 }]);
    await client.exec("update rate_hits set created_at = now() - interval '31 days' where key_hash = 'k1'");

    expect(await applyRetention(db)).toEqual({ unverified: 1, rateHits: 1, anonymized: 1 });
    expect(await comment(stale.id)).toBeUndefined();
    expect(await comment(fresh.id)).toBeDefined();
    expect(await comment(old.id)).toMatchObject({ authorName: ANONYMIZED_NAME, email: null, body: "Stará potvrzená připomínka veřejnosti." });
    expect((await comment(recent.id)).email).toBe(EMAIL);
    expect((await comment(team.id)).authorName).toBe("Jana Tajná");
    expect((await db.select().from(schema.rateHits)).map((h) => h.keyHash)).toEqual(["k2"]);

    // Druhé spuštění už nic nemění.
    expect(await applyRetention(db)).toEqual({ unverified: 0, rateHits: 0, anonymized: 0 });
  });
});
