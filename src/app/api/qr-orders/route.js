import { qrPool as pool } from "@/db/qr-pool";
import {
  pilotEnabled, validTable, sameOrigin, prepareLines,
  ensureQrTables, createOrderIdentifiers
} from "@/lib/qr-dinein";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(request) {
  if (!pilotEnabled()) return Response.json({ error: "QR pilot is disabled." }, { status: 503 });
  if (!pool) return Response.json({ error: "Restaurant ordering backend is not configured." }, { status: 503 });
  if (!sameOrigin(request)) return Response.json({ error: "Origin not allowed." }, { status: 403 });
  if (!(request.headers.get("content-type") || "").includes("application/json")) {
    return Response.json({ error: "JSON request expected." }, { status: 415 });
  }
  let body;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid order data." }, { status: 400 }); }
  const table = String(body?.table || "");
  if (!validTable(table)) return Response.json({ error: "Invalid restaurant table QR." }, { status: 400 });
  const clientId = String(body?.clientRequestId || "");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clientId)) {
    return Response.json({ error: "Invalid request ID." }, { status: 400 });
  }
  const notes = String(body?.notes || "").trim().slice(0, 250);
  try {
    await ensureQrTables();
    // Exact replay of the same request ID must never create another order.
    const earlier = await pool.query(
      "SELECT order_code,tracking_token,table_code,subtotal FROM qr_dinein_orders WHERE client_request_id=$1",
      [clientId]
    );
    if (earlier.rows.length) {
      const r = earlier.rows[0];
      if (r.table_code !== table) return Response.json({ error: "Request ID already used at another table." }, { status: 409 });
      return Response.json({ code: r.order_code, token: r.tracking_token, subtotal: Number(r.subtotal), reused: true });
    }
    const { items, subtotal } = await prepareLines(body?.items);
    const recent = await pool.query(
      "SELECT count(*)::int AS count FROM qr_dinein_orders WHERE table_code=$1 AND created_at > NOW() - INTERVAL '5 minutes'",
      [table]
    );
    if (recent.rows[0].count >= 6) return Response.json({ error: "Too many recent table orders. Please ask the waiter." }, { status: 429 });
    const { code, token } = createOrderIdentifiers();
    const result = await pool.query(
      "INSERT INTO qr_dinein_orders(order_code,tracking_token,client_request_id,table_code,items_json,subtotal,notes) VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7) ON CONFLICT(client_request_id) DO NOTHING RETURNING order_code,tracking_token,subtotal",
      [code, token, clientId, table, JSON.stringify(items), subtotal, notes]
    );
    const row = result.rows[0] || (await pool.query(
      "SELECT order_code,tracking_token,subtotal FROM qr_dinein_orders WHERE client_request_id=$1",
      [clientId]
    )).rows[0];
    return Response.json({ code: row.order_code, token: row.tracking_token, subtotal: Number(row.subtotal), reused: !result.rows.length }, { status: result.rows.length ? 201 : 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[Ayodhya QR] order failed:", error);
    const safe = /^(Select|An item|Quantity|Duplicate|Order exceeds)/.test(error.message);
    return Response.json({ error: safe ? error.message : "Could not save your order. Please try again or ask staff." }, { status: safe ? 400 : 503 });
  }
}
