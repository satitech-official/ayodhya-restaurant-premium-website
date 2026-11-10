import { pool } from "@/db";
import { pilotEnabled, ensureQrTables, publicOrder } from "@/lib/qr-dinein";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(_request, context) {
  if (!pilotEnabled() || !pool) return Response.json({ error: "Order tracking unavailable." }, { status: 503 });
  const { token } = await context.params;
  if (!/^[0-9a-f]{64}$/.test(token || "")) return Response.json({ error: "Invalid order link." }, { status: 400 });
  try {
    await ensureQrTables();
    const r = await pool.query(
      "SELECT order_code,tracking_token,table_code,items_json,subtotal,status,payment_status,created_at,updated_at FROM qr_dinein_orders WHERE tracking_token=$1",
      [token]
    );
    if (!r.rows.length) return Response.json({ error: "Order not found." }, { status: 404 });
    return Response.json({ order: publicOrder(r.rows[0]) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("[Ayodhya QR] tracking unavailable:", error);
    return Response.json({ error: "Tracking temporarily unavailable." }, { status: 503 });
  }
}
