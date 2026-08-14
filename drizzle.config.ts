import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Next.js commonly stores local secrets in .env.local, while drizzle-kit does not
// load that file automatically. Load it first, then fall back to .env.
config({ path: ".env.local" });
config();

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required for Drizzle commands. Copy .env.example to .env.local and configure PostgreSQL first.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: { url: databaseUrl },
});
