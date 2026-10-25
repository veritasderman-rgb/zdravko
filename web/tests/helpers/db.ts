import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { generateDrizzleJson, generateMigration } from "drizzle-kit/api";
import * as schema from "@/db/schema";
import type { AnyDb } from "@/db/pool";

/** Prázdná databáze v paměti (PGlite) se schématem vygenerovaným ze src/db/schema.ts. */
export async function testDb(): Promise<{ db: AnyDb; client: PGlite }> {
  const client = new PGlite();
  const statements = await generateMigration(generateDrizzleJson({}), generateDrizzleJson(schema as unknown as Record<string, unknown>));
  for (const s of statements) await client.exec(s);
  return { db: drizzle({ client, schema }) as unknown as AnyDb, client };
}

/** Deterministické kotvy pro testy. */
export function idSeq(prefix = "a") {
  let n = 0;
  return () => `${prefix}${String(++n).padStart(5, "0")}`;
}
