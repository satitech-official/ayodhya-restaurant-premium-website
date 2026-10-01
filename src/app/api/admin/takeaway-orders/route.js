import { pool } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { ensureTakeawayOrdersTable, mapTakeawayOrder } from "@/lib/takeaway-orders";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!pool) return Response.json({ error: "Database is not configured." }, { status: 503 });

  await ensureTakeawayOrdersTable();
  const result = await pool.query(`SELECT * FROM takeaway_orders ORDER BY created_at DESC LIMIT 300`);
  return Response.json({ orders: result.rows.map(mapTakeawayOrder) });
}
