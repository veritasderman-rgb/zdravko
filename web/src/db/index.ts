import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = NeonHttpDatabase<typeof schema>;

let instance: Db | undefined;

/** Klient vzniká až při prvním dotazu, aby `next build` nepotřeboval DATABASE_URL. */
function getDb(): Db {
  if (!instance) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL není nastavena");
    instance = drizzle({ client: neon(url), schema });
  }
  return instance;
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop, _receiver) {
    const real = getDb();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
