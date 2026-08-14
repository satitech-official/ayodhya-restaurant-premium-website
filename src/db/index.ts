import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL?.trim();

const globalForDb = globalThis as typeof globalThis & {
  __ayodhyaRestaurantPool?: Pool;
};

/** True when a PostgreSQL connection string is available. */
export const databaseConfigured = Boolean(databaseUrl);

/**
 * Keep the public website bootable even before a database is configured.
 * Server data helpers fall back to bundled restaurant content when `db` is null.
 */
export const pool: Pool | null = databaseUrl
  ? globalForDb.__ayodhyaRestaurantPool ??
    new Pool({
      connectionString: databaseUrl,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 8_000,
    })
  : null;

if (pool && process.env.NODE_ENV !== "production") {
  globalForDb.__ayodhyaRestaurantPool = pool;
}

export const db = pool ? drizzle(pool) : null;
