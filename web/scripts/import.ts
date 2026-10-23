/**
 * Import Markdown dokumentů reformy do databáze.
 *
 *   pnpm import:docs            # naimportuje jen dokumenty, jejichž obsah se změnil
 *   pnpm import:docs --force    # založí novou verzi i u nezměněných dokumentů
 *
 * Každý dokument se rozseká na bloky (nadpis, odstavec, odrážka, tabulka, citace)
 * se stabilním klíčem `cesta-nadpisů#druhN`. Připomínky se vážou na tento klíč,
 * takže přežijí novou verzi dokumentu, pokud se nezmění struktura nadpisů.
 */
import "dotenv/config";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { toString as mdToString } from "mdast-util-to-string";
import type { Root, RootContent, Table } from "mdast";
import { and, eq, inArray } from "drizzle-orm";
import { db, schema } from "../src/db";
import { CODE_RE, familyOf } from "../src/lib/codes";

const ROOT = path.resolve(__dirname, "../..");

const DOCS: { slug: string; title: string; kind: string; file: string; label: string }[] = [
  { slug: "studie", title: "Zdraví blíž lidem — studie v3", kind: "studie", file: "01-studie-zdravi-bliz-lidem-v3.md", label: "v3 (20. 10. 2026)" },
  { slug: "politicka-verze", title: "Politická verze 3 (konzultační)", kind: "politicka", file: "02-politicka-verze-v3.md", label: "v3 (20. 10. 2026)" },
  { slug: "one-pager", title: "One-pager pro předsedu", kind: "one-pager", file: "03-one-pager-pro-predsedu.md", label: "20. 10. 2026" },
  { slug: "podklad-peer", title: "Podklad pro PEER", kind: "peer", file: "04-podklad-pro-PEER.md", label: "20. 10. 2026" },
  { slug: "prezentace-co-chceme", title: "Prezentace: co chceme a proč", kind: "prezentace", file: "05-prezentace-co-chceme-a-proc.md", label: "20. 10. 2026" },
  { slug: "prezentace-rt", title: "Prezentace pro resortní tým", kind: "prezentace", file: "06-prezentace-pro-RT.md", label: "20. 10. 2026" },
  { slug: "navrh-platformy", title: "Návrh konzultační platformy", kind: "navrh", file: "docs/navrh-konzultacni-platformy.md", label: "23. 10. 2026" },
];

type BlockRow = typeof schema.blocks.$inferInsert;

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function hash(s: string): string {
  return createHash("sha256").update(s).digest("hex").slice(0, 16);
}

function sliceSource(src: string, node: RootContent): string {
  const p = node.position;
  if (!p) return "";
  return src.slice(p.start.offset ?? 0, p.end.offset ?? 0);
}

function tableMeta(t: Table): { header: string[]; rows: string[][] } {
  const [head, ...rest] = t.children;
  return {
    header: head ? head.children.map((c) => mdToString(c)) : [],
    rows: rest.map((r) => r.children.map((c) => mdToString(c))),
  };
}

function findCodes(text: string): string[] {
  const found = new Set<string>();
  for (const m of text.matchAll(CODE_RE)) found.add(m[1]);
  return [...found].sort();
}

function findVerifications(text: string): string[] {
  const out: string[] = [];
  const re = /Ověřit\s*:\s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const rest = text.slice(m.index + m[0].length);
    // konec věty: tečka následovaná mezerou a velkým písmenem, nebo konec bloku
    const end = rest.search(/\.(\s+[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]|\s*$)/);
    const sentence = (end >= 0 ? rest.slice(0, end) : rest).trim();
    if (sentence) out.push(sentence.slice(0, 400));
  }
  return out;
}

interface Parsed {
  blocks: Omit<BlockRow, "versionId" | "documentId">[];
  verifications: { blockKey: string; text: string }[];
  codeRows: { code: string; label: string; layer?: string; pillar?: string; meta: Record<string, string> }[];
}

function parseDocument(src: string): Parsed {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(src) as Root;
  const blocks: Parsed["blocks"] = [];
  const verifications: Parsed["verifications"] = [];
  const codeRows: Parsed["codeRows"] = [];

  const headingStack: { level: number; slug: string; title: string }[] = [];
  const usedSectionKeys = new Map<string, number>();
  let sectionKey = "uvod";
  let headingPath = "";
  let counters: Record<string, number> = {};
  let ordinal = 0;

  const push = (
    kind: BlockRow["kind"],
    node: RootContent,
    opts: { text?: string; md?: string; meta?: unknown; level?: number; keyOverride?: string } = {},
  ) => {
    const text = (opts.text ?? mdToString(node)).replace(/\s+/g, " ").trim();
    if (!text && kind !== "thematic_break") return;
    const prefix = kind === "heading" ? "h" : kind === "paragraph" ? "p" : kind === "list_item" ? "li" : kind === "table" ? "t" : kind === "quote" ? "q" : "x";
    counters[prefix] = (counters[prefix] ?? 0) + 1;
    const blockKey = opts.keyOverride ?? `${sectionKey}#${prefix}${counters[prefix]}`;
    const codes = findCodes(text);
    const ver = findVerifications(text);
    blocks.push({
      blockKey,
      ordinal: ordinal++,
      kind,
      level: opts.level ?? null,
      sectionKey,
      headingPath,
      text,
      md: opts.md ?? sliceSource(src, node),
      meta: opts.meta ?? null,
      codes,
      hasVerify: ver.length > 0,
      textHash: hash(text),
    });
    for (const v of ver) verifications.push({ blockKey, text: v });
  };

  for (const node of tree.children) {
    switch (node.type) {
      case "heading": {
        const title = mdToString(node).trim();
        while (headingStack.length && headingStack[headingStack.length - 1].level >= node.depth) headingStack.pop();
        headingStack.push({ level: node.depth, slug: slugify(title) || "sekce", title });
        let key = headingStack.map((h) => h.slug).join("/");
        const n = (usedSectionKeys.get(key) ?? 0) + 1;
        usedSectionKeys.set(key, n);
        if (n > 1) key = `${key}-${n}`;
        sectionKey = key;
        headingPath = headingStack.map((h) => h.title).join(" › ");
        counters = {};
        push("heading", node, { level: node.depth, keyOverride: `${sectionKey}#h` });
        break;
      }
      case "paragraph":
        push("paragraph", node);
        break;
      case "list":
        for (const item of node.children) push("list_item", item as unknown as RootContent);
        break;
      case "table": {
        const meta = tableMeta(node);
        const text = [meta.header.join(" | "), ...meta.rows.map((r) => r.join(" | "))].join(" \n ");
        push("table", node, { text, meta });
        // registr kódů: řádky, jejichž první buňka je kód
        for (const row of meta.rows) {
          const first = row[0]?.trim() ?? "";
          const m = first.match(/^\**((?:J|P|Pil|M|H|D|R|B)\d+(?:\.\d+)?)\**(?:\s+(.*))?$/);
          if (!m) continue;
          const code = m[1];
          const labelInline = m[2]?.trim();
          const headerIsRegistr = meta.header[0]?.toLowerCase().startsWith("kód");
          const label = headerIsRegistr ? row[1] : labelInline || row[1];
          const metaObj: Record<string, string> = {};
          meta.header.forEach((h, i) => (metaObj[h] = row[i] ?? ""));
          codeRows.push({
            code,
            label: (label ?? "").replace(/\*\*/g, "").trim(),
            layer: headerIsRegistr ? row[2] : undefined,
            pillar: headerIsRegistr ? row[3] : undefined,
            meta: metaObj,
          });
        }
        break;
      }
      case "blockquote":
        push("quote", node);
        break;
      case "code":
        push("code", node, { text: node.value });
        break;
      case "thematicBreak":
        break; // oddělovače slajdů nenesou obsah
      case "html":
        push("other", node, { text: node.value });
        break;
      default:
        push("other", node);
    }
  }
  return { blocks, verifications, codeRows };
}

const GATES: Record<string, string> = {
  B1: "Brána B1 Mandát (6/2028)",
  B2: "Brána B2 Koaliční smlouva (12/2029–1/2030)",
  B3: "Brána B3 Lidé a data (12/2031)",
  B4: "Brána B4 Nezávislé hodnocení (2033)",
};

async function main() {
  const force = process.argv.includes("--force");
  const allCodeRows: Parsed["codeRows"] = [];

  for (const [i, d] of DOCS.entries()) {
    const file = path.join(ROOT, d.file);
    const src = readFileSync(file, "utf8");
    const sourceHash = hash(src);

    const [doc] = await db
      .insert(schema.documents)
      .values({ slug: d.slug, title: d.title, kind: d.kind, sourcePath: d.file, sort: i })
      .onConflictDoUpdate({
        target: schema.documents.slug,
        set: { title: d.title, kind: d.kind, sourcePath: d.file, sort: i },
      })
      .returning();

    const current = await db.query.documentVersions.findFirst({
      where: and(eq(schema.documentVersions.documentId, doc.id), eq(schema.documentVersions.isCurrent, true)),
    });
    const parsed = parseDocument(src);
    allCodeRows.push(...parsed.codeRows);

    if (current && current.sourceHash === sourceHash && !force) {
      console.log(`= ${d.slug}: beze změny (${parsed.blocks.length} bloků)`);
      continue;
    }

    // Nová verze vzniká jako neaktuální; aktuální se stane až po úspěšném uložení všech bloků.
    // Při selhání uprostřed importu tak zůstává viditelná předchozí úplná verze.
    const [version] = await db
      .insert(schema.documentVersions)
      .values({ documentId: doc.id, label: d.label, sourceHash, isCurrent: false })
      .returning();

    const rows: BlockRow[] = parsed.blocks.map((b) => ({ ...b, versionId: version.id, documentId: doc.id }));
    for (let k = 0; k < rows.length; k += 150) {
      await db.insert(schema.blocks).values(rows.slice(k, k + 150));
    }

    await db
      .update(schema.documentVersions)
      .set({ isCurrent: false })
      .where(and(eq(schema.documentVersions.documentId, doc.id), eq(schema.documentVersions.isCurrent, true)));
    await db.update(schema.documentVersions).set({ isCurrent: true }).where(eq(schema.documentVersions.id, version.id));

    // Ověřit: zachovat stav existujících položek, nové přidat, zmizelé ponechat (historie)
    for (const v of parsed.verifications) {
      await db
        .insert(schema.verifications)
        .values({ documentId: doc.id, versionId: version.id, blockKey: v.blockKey, text: v.text, textHash: hash(v.text) })
        .onConflictDoUpdate({
          target: [schema.verifications.documentId, schema.verifications.textHash],
          set: { versionId: version.id, blockKey: v.blockKey },
        });
    }

    await db.insert(schema.events).values({
      entity: "import",
      entityId: version.id,
      action: "imported",
      actor: "scripts/import.ts",
      payload: { slug: d.slug, blocks: rows.length, verifications: parsed.verifications.length, sourceHash },
    });
    console.log(`+ ${d.slug}: ${rows.length} bloků, ${parsed.verifications.length} ověření, verze #${version.id}`);
  }

  // Registr kódů: první výskyt v registru opatření vyhrává, ostatní doplní label.
  const seen = new Map<string, Parsed["codeRows"][number]>();
  for (const r of allCodeRows) {
    const prev = seen.get(r.code);
    if (!prev || (!prev.layer && r.layer)) seen.set(r.code, r);
  }
  for (const [code, label] of Object.entries(GATES)) {
    if (!seen.has(code)) seen.set(code, { code, label, layer: "Brána", meta: {} });
  }
  const existing = await db.select({ code: schema.codes.code }).from(schema.codes).where(inArray(schema.codes.code, [...seen.keys()]));
  const existingSet = new Set(existing.map((e) => e.code));
  for (const r of seen.values()) {
    const family = familyOf(r.code);
    const layer = r.layer ?? (family === "H" || family === "D" ? "Ukazatel" : family === "R" ? "Riziko" : family === "B" ? "Brána" : null);
    const values = { code: r.code, family, label: r.label || null, layer, pillar: r.pillar ?? null, meta: r.meta };
    if (existingSet.has(r.code)) {
      await db.update(schema.codes).set(values).where(eq(schema.codes.code, r.code));
    } else {
      await db.insert(schema.codes).values(values);
    }
  }
  console.log(`~ registr kódů: ${seen.size} kódů`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
