import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import ws from "ws";
import * as schema from "./schema";

/**
 * Databáze s podporou transakcí. HTTP klient z `./index` transakce neumí, proto zápisy,
 * které musí proběhnout celé nebo vůbec (připomínka + audit, změna stavu + audit, import
 * verze), běží přes WebSocket pool. Pool vzniká pro jednu operaci a po ní se zavře,
 * aby v serverless prostředí nezůstávala viset spojení.
 */
neonConfig.webSocketConstructor = ws;

/** Společný typ pro produkční pool i testovací PGlite. */
export type AnyDb = PgDatabase<PgQueryResultHKT, typeof schema>;

export async function withPoolDb<T>(fn: (db: AnyDb) => Promise<T>): Promise<T> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL není nastavena");
  const pool = new Pool({ connectionString: url });
  try {
    return await fn(drizzle({ client: pool, schema }) as unknown as AnyDb);
  } finally {
    await pool.end();
  }
}
