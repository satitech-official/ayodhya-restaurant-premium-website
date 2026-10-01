import { pool } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { ensureTakeawayOrdersTable, mapTakeawayOrder } from "@/lib/takeaway-orders";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["submitted", "confirmed", "ready", "completed", "cancelled"]);

export async function PATCH(request, { params }) {
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!pool) return Response.json({ error: "Database is not configured." }, { status: 503 });

  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const status = body?.status ? String(body.status) : "";
  const readyTime = body?.readyTime !== undefined ? String(body.readyTime).trim().slice(0, 100) : null;
  if (status && !ALLOWED.has(status)) {
    return Response.json({ error: "Invalid status." }, { status: 400 });
  }

  await ensureTakeawayOrdersTable();
  const result = await pool.query(
    `UPDATE takeaway_orders
     SET status = COALESCE(NULLIF($1,''), status),
         ready_time = CASE WHEN $2::text IS NULL THEN ready_time ELSE $2 END,
         updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [status, readyTime, Number(id)],
  );

  if (!result.rows[0]) return Response.json({ error: "Order not found." }, { status: 404 });
  return Response.json({ order: mapTakeawayOrder(result.rows[0]) });
}

export async function DELETE(request, { params }) {
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!pool) return Response.json({ error: "Database is not configured." }, { status: 503 });
  const { id } = await params;
  await ensureTakeawayOrdersTable();
  await pool.query(`DELETE FROM takeaway_orders WHERE id = $1`, [Number(id)]);
  return Response.json({ ok: true });
}
