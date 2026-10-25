/**
 * Správa lidí z příkazové řádky (hlavně první koordinátor, dokud nikdo nemůže na /lide):
 *
 *   pnpm users:add --email jana@example.cz --name "Jana Nováková" --role koordinator [--org "RT zdravotnictví"]
 *   pnpm users:list
 *
 * Role: ctenar, garant, oponent, autor, koordinator (src/lib/roles.ts).
 */
import "dotenv/config";
import { asc } from "drizzle-orm";
import { withPoolDb } from "../src/db/pool";
import * as schema from "../src/db/schema";
import { upsertUser } from "../src/lib/accounts-core";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const cmd = process.argv[2];
  if (cmd === "add") {
    const email = arg("email");
    const name = arg("name");
    const role = arg("role") ?? "ctenar";
    if (!email || !name) throw new Error("chybí --email nebo --name");
    const u = await withPoolDb((db) => upsertUser(db, { email, name, organization: arg("org") ?? null, role }, "příkazová řádka"));
    console.log(`uloženo: #${u.id} ${u.name} <${u.email}>, role ${u.role}${u.active ? "" : " (neaktivní)"}`);
  } else if (cmd === "list") {
    const rows = await withPoolDb((db) => db.select().from(schema.users).orderBy(asc(schema.users.name)));
    for (const u of rows) console.log(`#${u.id}\t${u.role}\t${u.active ? "aktivní" : "neaktivní"}\t${u.name} <${u.email}>${u.organization ? `, ${u.organization}` : ""}`);
    if (!rows.length) console.log("zatím nikdo");
  } else {
    throw new Error("použití: pnpm users:add --email … --name … --role … | pnpm users:list");
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
