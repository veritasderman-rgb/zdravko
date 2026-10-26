/**
 * Zápisy připomínek: validace, transakce s auditem, odpovědi, změny stavu a export bez osobních údajů.
 */
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import type { PGlite } from "@electric-sql/pglite";
import * as schema from "@/db/schema";
import type { AnyDb } from "@/db/pool";
import { importDocumentVersion } from "@/lib/importer";
import { CommentError, PROPOSAL, createComment, createReply, setCommentStatus, setVerificationStatus, type NewComment } from "@/lib/comments-core";
import { commentsCsv } from "@/lib/export";
import { idSeq, testDb } from "./helpers/db";

const SRC = `# Studie

## Pilíř 1

První odstavec o týmech primární péče a sestrách v ordinaci.

Druhý odstavec o penězích na náběh týmů. Ověřit: výše platby.

## Pilíř 2

Odstavec o síti lůžkové péče a krajských plánech.
`;

let db: AnyDb;
let client: PGlite;
let documentId: number;
let versionId: number;
let otherDocVersionId: number;

const base = (): NewComment => ({ documentId, versionId, blockKey: "studie/pilir-1#p1", kind: "vecna", severity: "doporucujici", body: "Připomínka k prvnímu odstavci.", authorName: "Jana Tajná", organization: "Česká asociace sester", channel: "rt", actor: "Jana Tajná" });

async function count(table: typeof schema.comments | typeof schema.events) {
  return (await db.select().from(table)).length;
}

beforeAll(async () => {
  ({ db, client } = await testDb());
  const r = await importDocumentVersion(db, { slug: "studie", title: "Studie", kind: "studie", sourcePath: "s.md", sort: 0, label: "v1", src: SRC, makeId: idSeq() });
  if (r.status !== "imported") throw new Error("import selhal");
  documentId = r.documentId;
  versionId = r.versionId;
  const o = await importDocumentVersion(db, { slug: "jiny", title: "Jiný", kind: "studie", sourcePath: "j.md", sort: 1, label: "v1", src: "# Jiný\n\nText jiného dokumentu.\n", makeId: idSeq("b") });
  if (o.status !== "imported") throw new Error("import selhal");
  otherDocVersionId = o.versionId;
});

beforeEach(async () => {
  await client.exec("drop trigger if exists fail_events on events; delete from events where entity <> 'import'; delete from comments;");
});

describe("návrh nového opatření", () => {
  it("uloží se ke studii bez bloku, s celým návrhem a kódy navázaných opatření", async () => {
    const r = await createComment(db, {
      ...base(),
      blockKey: PROPOSAL,
      kind: "zneni",
      body: "Návrh nového opatření: Sdílená sestra pro malé obce",
      proposedText: "# Návrh nového opatření: Sdílená sestra pro malé obce",
      codesText: "J2 J4",
      channel: "verejnost",
      email: "navrh@example.cz",
    });
    const [c] = await db.select().from(schema.comments).where(eq(schema.comments.id, r.id));
    expect(c.blockKey).toBe(PROPOSAL);
    expect(c.blockId).toBeNull();
    expect(c.quote).toBeNull();
    expect(c.proposedText).toContain("Sdílená sestra");
    expect(c.codes).toEqual(["J2", "J4"]);
  });
});

describe("validace", () => {
  it("uloží připomínku s kotvou, blokem a textem bloku v době podání", async () => {
    const r = await createComment(db, base());
    const [c] = await db.select().from(schema.comments).where(eq(schema.comments.id, r.id));
    const [b] = await db.select().from(schema.blocks).where(eq(schema.blocks.id, c.blockId!));
    expect(c.anchorId).toBe(b.anchorId);
    expect(c.blockText).toBe(b.text);
    expect(c.blockHash).toBe(b.textHash);
    expect(c.quote).toBe(b.text.slice(0, 300));
  });

  it("odmítne verzi jiného dokumentu", async () => {
    await expect(createComment(db, { ...base(), versionId: otherDocVersionId })).rejects.toBeInstanceOf(CommentError);
  });

  it("odmítne neexistující verzi a blok", async () => {
    await expect(createComment(db, { ...base(), versionId: 99999 })).rejects.toThrow(/Verze/);
    await expect(createComment(db, { ...base(), blockKey: "studie/pilir-1#p9" })).rejects.toThrow(/není/);
  });

  it("úryvek musí být z textu bloku", async () => {
    await expect(createComment(db, { ...base(), quote: "text, který v odstavci není" })).rejects.toThrow(/Úryvek/);
    const ok = await createComment(db, { ...base(), quote: "týmech   primární péče" });
    expect(ok.quote).toBe("týmech primární péče");
  });

  it("veřejnost nesmí použít interní typy připomínek", async () => {
    await expect(createComment(db, { ...base(), channel: "verejnost", kind: "pravni", body: "Dlouhá veřejná připomínka." })).rejects.toThrow(/typ/);
  });

  it("připomínka ke studii jako celku nemá kotvu ani blok", async () => {
    const r = await createComment(db, { ...base(), blockKey: "obecne" });
    const [c] = await db.select().from(schema.comments).where(eq(schema.comments.id, r.id));
    expect(c.anchorId).toBeNull();
    expect(c.blockId).toBeNull();
  });

  it("za organizaci jen s vyplněnou organizací", async () => {
    await expect(createComment(db, { ...base(), onBehalf: "organizace", organization: null })).rejects.toBeInstanceOf(CommentError);
  });
});

describe("transakce s auditem", () => {
  const failEvents = () => client.exec(`
    create or replace function fail_insert() returns trigger language plpgsql as $$ begin raise exception 'audit nedostupný'; end $$;
    create trigger fail_events before insert on events for each row execute function fail_insert();`);

  it("připomínka a auditní záznam vzniknou spolu", async () => {
    const r = await createComment(db, base());
    const ev = await db.select().from(schema.events).where(eq(schema.events.entityId, r.id));
    expect(ev.map((e) => e.action)).toContain("created");
  });

  it("když audit selže, připomínka se neuloží", async () => {
    await failEvents();
    await expect(createComment(db, base())).rejects.toThrow();
    expect(await count(schema.comments)).toBe(0);
  });

  it("když audit selže, změna stavu se vrátí", async () => {
    const r = await createComment(db, base());
    await failEvents();
    await expect(setCommentStatus(db, { id: r.id, status: "vyporadana", role: "koordinator", actor: "x" })).rejects.toThrow();
    const [c] = await db.select().from(schema.comments).where(eq(schema.comments.id, r.id));
    expect(c.status).toBe("nova");
  });

  it("změna stavu zapíše audit a neexistující připomínku odmítne", async () => {
    const r = await createComment(db, base());
    await setCommentStatus(db, { id: r.id, status: "v_reseni", assignee: "Garant", priority: "vysoka", role: "koordinator", actor: "Garant" });
    const [c] = await db.select().from(schema.comments).where(eq(schema.comments.id, r.id));
    expect(c).toMatchObject({ status: "v_reseni", assignee: "Garant", priority: "vysoka" });
    const ev = await db.select().from(schema.events).where(eq(schema.events.entityId, r.id));
    expect(ev.map((e) => e.action)).toEqual(expect.arrayContaining(["created", "status"]));
    await expect(setCommentStatus(db, { id: 99999, status: "v_reseni", role: "koordinator", actor: "x" })).rejects.toThrow(/nenalezena/);
    await expect(setCommentStatus(db, { id: r.id, status: "smazana", role: "koordinator", actor: "x" })).rejects.toBeInstanceOf(CommentError);
  });

  it("stav ověření se mění spolu s auditem", async () => {
    const [v] = await db.select().from(schema.verifications);
    await setVerificationStatus(db, { id: v.id, status: "overeno_potvrzeno", note: "OK", role: "koordinator", actor: "Oponent" });
    const [after] = await db.select().from(schema.verifications).where(eq(schema.verifications.id, v.id));
    expect(after.status).toBe("overeno_potvrzeno");
    const ev = await db.select().from(schema.events).where(eq(schema.events.entity, "verification"));
    expect(ev).toHaveLength(1);
  });
});

describe("odpovědi", () => {
  it("odpověď převezme kotvu rodiče a zapíše audit", async () => {
    const r = await createComment(db, base());
    const reply = await createReply(db, { parentId: r.id, body: "Děkujeme, zapracujeme.", authorName: "Garant", actor: "Garant" });
    const [p] = await db.select().from(schema.comments).where(eq(schema.comments.id, r.id));
    const [c] = await db.select().from(schema.comments).where(eq(schema.comments.id, reply.id));
    expect(c.anchorId).toBe(p.anchorId);
    expect(c.parentId).toBe(p.id);
    const ev = await db.select().from(schema.events).where(eq(schema.events.entityId, reply.id));
    expect(ev.map((e) => e.action)).toContain("replied");
  });

  it("odpověď na neexistující nebo vnořenou připomínku odmítne", async () => {
    await expect(createReply(db, { parentId: 99999, body: "Odpověď", authorName: "X", actor: "X" })).rejects.toThrow(/nenalezena/);
    const r = await createComment(db, base());
    const reply = await createReply(db, { parentId: r.id, body: "Odpověď", authorName: "X", actor: "X" });
    await expect(createReply(db, { parentId: reply.id, body: "Odpověď na odpověď", authorName: "X", actor: "X" })).rejects.toThrow(/nenalezena/);
  });
});

describe("export bez osobních údajů", () => {
  it("veřejný export neobsahuje jména ani e-maily, interní ano", async () => {
    await createComment(db, base());
    await createComment(db, { ...base(), channel: "verejnost", authorName: "Petr Skrytý", email: "petr.skryty@example.cz", organization: "Organizace, kterou nikdo neověřil", body: "Veřejná připomínka k odstavci." });
    const rows = (await db.select().from(schema.comments)).map((c) => ({ c, docTitle: "Studie", headingPath: null }));
    const pub = commentsCsv(rows, true);
    for (const secret of ["Jana Tajná", "Petr Skrytý", "petr.skryty@example.cz", "Organizace, kterou nikdo neověřil"]) expect(pub).not.toContain(secret);
    expect(pub).toContain("Česká asociace sester");
    expect(pub).toContain("jednotlivec (veřejnost)");
    const internal = commentsCsv(rows, false);
    expect(internal).toContain("Jana Tajná");
    expect(internal).toContain("petr.skryty@example.cz");
  });

  it("buňky začínající vzorcem se v CSV neprovedou", async () => {
    await createComment(db, { ...base(), body: "=HYPERLINK(\"http://zle.cz\")" });
    const rows = (await db.select().from(schema.comments)).map((c) => ({ c, docTitle: "Studie", headingPath: null }));
    expect(commentsCsv(rows, true)).toContain(`"'=HYPERLINK(""http://zle.cz"")"`);
  });
});
