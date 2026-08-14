import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!db) {
    return Response.json({ ok: true, database: false, mode: "fallback" });
  }
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, database: true, mode: "database" });
  } catch {
    return Response.json({ ok: false, database: false, mode: "database-error" }, { status: 503 });
  }
}
