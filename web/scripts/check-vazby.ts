// Kontrola dat vazeb (src/content/figures/vazby.ts):
//  - vazba „bez A nejde B“ nesmí mířit proti času (sloupec A ≤ sloupec B),
//  - každá vazba odkazuje na existující uzel, každý kód existuje v registru,
//  - organigramy obsahují každé opatření z registru právě jednou.
// Spuštění: pnpm check:vazby
import registr from "../src/content/registr.json";
import { COLUMNS, MAP_EDGES, MAP_NODES, ORG_GROUPS, ORG_MANIFEST, type OrgItem } from "../src/content/figures/vazby";

const errors: string[] = [];
const codes = new Set((registr as { code: string }[]).map((r) => r.code));
const byId = new Map(MAP_NODES.map((n) => [n.id, n]));

for (const n of MAP_NODES) {
  if (n.code && !/^B\d$/.test(n.code) && !codes.has(n.code)) errors.push(`mapa: kód ${n.code} není v registru`);
  if (n.col < 0 || n.col >= COLUMNS.length) errors.push(`mapa: ${n.id} má neplatný sloupec`);
}
const cells = new Map<string, number[]>();
for (const n of MAP_NODES) {
  const k = `${n.lane}:${n.col}`;
  cells.set(k, [...(cells.get(k) ?? []), n.row]);
}
for (const [k, rows] of cells) {
  const sorted = [...rows].sort((a, b) => a - b);
  if (sorted.some((r, i) => r !== i)) errors.push(`mapa: buňka ${k} má řádky ${rows.join(",")} (čekám 0..n-1)`);
}
const seen = new Set<string>();
for (const e of MAP_EDGES) {
  const a = byId.get(e.from);
  const b = byId.get(e.to);
  if (!a || !b) {
    errors.push(`mapa: vazba ${e.from} → ${e.to} odkazuje na neexistující uzel`);
    continue;
  }
  const key = `${e.from}>${e.to}>${e.kind}`;
  if (seen.has(key)) errors.push(`mapa: duplicitní vazba ${key}`);
  seen.add(key);
  if (e.kind === "needs" && a.col > b.col) errors.push(`mapa: „${a.title}“ (${COLUMNS[a.col]}) má být dřív než „${b.title}“ (${COLUMNS[b.col]}), ale je později`);
}

const counts = new Map<string, number>();
const walk = (items: OrgItem[]) =>
  items.forEach((it) => {
    counts.set(it.code, (counts.get(it.code) ?? 0) + 1);
    if (it.children) walk(it.children);
  });
ORG_GROUPS.forEach((g) => walk(g.roots));
ORG_MANIFEST.forEach((a) => a.codes.forEach((c) => counts.set(c, (counts.get(c) ?? 0) + 1)));
for (const c of codes) if (!counts.has(c)) errors.push(`organigramy: chybí ${c}`);
for (const [c, n] of counts) {
  if (!codes.has(c)) errors.push(`organigramy: ${c} není v registru`);
  if (n > 1) errors.push(`organigramy: ${c} je tam ${n}×`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`vazby v pořádku: ${MAP_NODES.length} uzlů, ${MAP_EDGES.length} vazeb, ${counts.size} opatření v organigramech`);
