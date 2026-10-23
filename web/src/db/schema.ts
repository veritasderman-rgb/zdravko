import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Dokumenty a jejich verze. Zdrojem pravdy je Markdown v git repozitáři;
// import ho rozseká na bloky se stabilním klíčem, ke kterým se vážou připomínky.
// ---------------------------------------------------------------------------

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  kind: text("kind").notNull(), // studie | politicka | one-pager | peer | prezentace | navrh
  sourcePath: text("source_path").notNull(),
  sort: integer("sort").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const documentVersions = pgTable(
  "document_versions",
  {
    id: serial("id").primaryKey(),
    documentId: integer("document_id")
      .notNull()
      .references(() => documents.id),
    label: text("label").notNull(), // např. "v3 (20. 10. 2026)"
    sourceHash: text("source_hash").notNull(),
    isCurrent: boolean("is_current").notNull().default(true),
    importedAt: timestamp("imported_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("document_versions_document_idx").on(t.documentId)],
);

export const blockKind = pgEnum("block_kind", [
  "heading",
  "paragraph",
  "list_item",
  "table",
  "quote",
  "code",
  "thematic_break",
  "other",
]);

export const blocks = pgTable(
  "blocks",
  {
    id: serial("id").primaryKey(),
    versionId: integer("version_id")
      .notNull()
      .references(() => documentVersions.id),
    documentId: integer("document_id")
      .notNull()
      .references(() => documents.id),
    blockKey: text("block_key").notNull(), // stabilní klíč: sekce#druhN
    ordinal: integer("ordinal").notNull(),
    kind: blockKind("kind").notNull(),
    level: integer("level"), // úroveň nadpisu
    sectionKey: text("section_key").notNull(), // klíč nejbližšího nadpisu
    headingPath: text("heading_path").notNull(), // "Část V — Peníze a lidé › Kolik stojí provoz"
    text: text("text").notNull(), // prostý text pro vyhledávání
    md: text("md").notNull(), // zdrojový markdown bloku
    meta: jsonb("meta"), // tabulky: { header: string[], rows: string[][] }
    codes: text("codes").array().notNull().default([]),
    hasVerify: boolean("has_verify").notNull().default(false),
    textHash: text("text_hash").notNull(),
  },
  (t) => [
    uniqueIndex("blocks_version_key_idx").on(t.versionId, t.blockKey),
    index("blocks_document_idx").on(t.documentId),
    index("blocks_section_idx").on(t.versionId, t.sectionKey),
  ],
);

// Registr kódů: opatření J/P/Pil/M, ukazatele H/D, rizika R, brány B.
export const codes = pgTable("codes", {
  code: text("code").primaryKey(),
  family: text("family").notNull(), // J | P | Pil | M | H | D | R | B
  label: text("label"),
  layer: text("layer"), // Jádro | Podmínka | Pilíř | Doprovod | Ukazatel | Riziko | Brána
  pillar: text("pillar"),
  meta: jsonb("meta"),
});

// ---------------------------------------------------------------------------
// Připomínky. Veřejné vypořádání zobrazuje jen organizaci, nikdy jméno osoby.
// ---------------------------------------------------------------------------

export const commentKind = pgEnum("comment_kind", [
  "cislo", // chyba v čísle
  "vecna", // věcná výhrada
  "zneni", // návrh nového znění
  "zdroj", // chybí zdroj / evidence
  "pravni", // právní riziko
  "otazka",
  "podpora",
  "redakcni",
]);

export const commentSeverity = pgEnum("comment_severity", [
  "zasadni",
  "doporucujici",
  "redakcni",
]);

export const commentStatus = pgEnum("comment_status", [
  "nova",
  "prirazena",
  "v_reseni",
  "navrh_vyporadani",
  "zkontrolovano",
  "vyporadana",
  "zverejnena",
]);

export const commentVisibility = pgEnum("comment_visibility", [
  "interni",
  "registrovani",
  "verejne",
]);

export const resolutionOutcome = pgEnum("resolution_outcome", [
  "akceptovano",
  "akceptovano_castecne",
  "neakceptovano",
  "vysvetleno",
  "mimo_rozsah",
]);

export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    documentId: integer("document_id")
      .notNull()
      .references(() => documents.id),
    versionId: integer("version_id")
      .notNull()
      .references(() => documentVersions.id),
    blockKey: text("block_key").notNull(),
    quote: text("quote"), // označený úryvek, přežije přečíslování bloků
    kind: commentKind("kind").notNull(),
    severity: commentSeverity("severity").notNull().default("doporucujici"),
    body: text("body").notNull(),
    proposedText: text("proposed_text"),
    source: text("source"),
    needsVerification: boolean("needs_verification").notNull().default(false),
    codes: text("codes").array().notNull().default([]),
    authorName: text("author_name").notNull(), // nikdy se nezveřejňuje
    organization: text("organization"), // jediné, co jde do veřejného vypořádání
    onBehalf: text("on_behalf").notNull().default("osoba"), // osoba | organizace
    email: text("email"), // jen u připomínek veřejnosti; nikdy se nezveřejňuje
    channel: text("channel").notNull().default("rt"), // rt | verejnost
    priority: text("priority").notNull().default("bezna"), // nizka | bezna | vysoka (veřejnost začíná na nízké)
    visibility: commentVisibility("visibility").notNull().default("interni"),
    status: commentStatus("status").notNull().default("nova"),
    assignee: text("assignee"),
    topic: text("topic"), // téma vypořádání (pilíř / opatření / průřez)
    parentId: integer("parent_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("comments_block_idx").on(t.documentId, t.blockKey),
    index("comments_status_idx").on(t.status),
  ],
);

export const resolutions = pgTable("resolutions", {
  id: serial("id").primaryKey(),
  commentId: integer("comment_id")
    .notNull()
    .references(() => comments.id),
  outcome: resolutionOutcome("outcome").notNull(),
  reasoning: text("reasoning").notNull(),
  changeRef: text("change_ref"), // commit / verze, kde se text změnil
  authorName: text("author_name").notNull(),
  checkedBy: text("checked_by"), // oponent
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Otevřená ověření ("Ověřit:") vytěžená z textu.
export const verificationStatus = pgEnum("verification_status", [
  "otevreno",
  "overeno_potvrzeno",
  "overeno_opraveno",
  "neoveritelne",
]);

export const verifications = pgTable(
  "verifications",
  {
    id: serial("id").primaryKey(),
    documentId: integer("document_id")
      .notNull()
      .references(() => documents.id),
    versionId: integer("version_id")
      .notNull()
      .references(() => documentVersions.id),
    blockKey: text("block_key").notNull(),
    text: text("text").notNull(),
    textHash: text("text_hash").notNull(),
    status: verificationStatus("status").notNull().default("otevreno"),
    assignee: text("assignee"),
    note: text("note"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("verifications_hash_idx").on(t.documentId, t.textHash)],
);

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  entity: text("entity").notNull(), // comment | verification | import
  entityId: integer("entity_id"),
  action: text("action").notNull(),
  actor: text("actor"),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
