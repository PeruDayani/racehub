import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../drizzle/schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

declare global {
  // eslint-disable-next-line no-var
  var _db: PostgresJsDatabase<typeof schema> | undefined;
  // eslint-disable-next-line no-var
  var _sql: ReturnType<typeof postgres> | undefined;
}

// ✅ Initialize singleton safely
export const sql =
  global._sql ??
  postgres(databaseUrl, {
    prepare: false,
    idle_timeout: 20,
    max_lifetime: 1800,
  });

export const db = global._db ?? drizzle(sql, { schema });

// ✅ Cache in globalThis for dev hot-reload
if (process.env.NODE_ENV !== "production") {
  global._sql = sql;
  global._db = db;
}
