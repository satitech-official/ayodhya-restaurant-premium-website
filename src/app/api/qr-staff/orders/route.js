import { qrPool as pool } from "@/db/qr-pool";
import { hasQrStaffSession } from "@/lib/qr-staff-auth";
import { pilotEnabled, sameOrigin, ensureQrTables, publicOrder } from "@/lib/qr-dinein";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const flow = ["new","accepted","preparing","ready","served","completed"];

function deny(request) {
  if (!pilotEnabled()) return Response.json({ error: "QR pilot disabled." }, { status: 503 });
  if (!hasQrStaffSession(request)) return Response.json({ error: "Not signed in as Ayodhya admin." }, { status: 401 });
  if (!pool) return Response.json({ error: "Database is not configured." }, { status: 503 });
  return null;
}
export async function GET(request) {
  const blocked = deny(request);
  if (blocked) return blocked;
  try {
    await ensureQrTables();
    const [orders, requests] = await Promise.all([
      pool.query("SELECT * FROM qr_dinein_orders ORDER BY created_at DESC LIMIT 150"),
      pool.query("SELECT * FROM qr_dinein_requests WHERE NOT resolved ORDER BY created_at DESC LIMIT 100")
    ]);
    return Response.json({
      orders: orders.rows.map((r) => ({ ...publicOrder(r), id:r.id, notes:r.notes })),
      requests: requests.rows
    }, { headers: { "Cache-Control":"no-store" } });
  } catch (error) {
    console.error("[Ayodhya QR] admin fetch failed:",error);
    return Response.json({ error: "Could not load orders." }, { status: 503 });
  }
}
export async function PATCH(request) {
  const blocked = deny(request);
  if (blocked) return blocked;
  if (!sameOrigin(request)) return Response.json({ error: "Forbidden." }, { status: 403 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON." }, { status: 400 }); }
  try {
    await ensureQrTables();
    const id = Number(body?.id);
    if (!Number.isSafeInteger(id) || id < 1) return Response.json({ error: "Invalid ID." }, { status: 400 });
    if (body.action === "resolve_request") {
      const r = await pool.query("UPDATE qr_dinein_requests SET resolved=TRUE WHERE id=$1 RETURNING id", [id]);
      return Response.json({ ok:r.rowCount > 0 });
    }
    if (body.action === "payment") {
      if (!["paid","unpaid"].includes(body?.value)) return Response.json({ error: "Invalid payment state." }, { status: 400 });
      const r = await pool.query("UPDATE qr_dinein_orders SET payment_status=$2,updated_at=NOW() WHERE id=$1 RETURNING id", [id,body.value]);
      return Response.json({ ok:r.rowCount > 0 });
    }
    if (body.action !== "status") return Response.json({ error: "Unknown action." }, { status: 400 });
    const current = String(body?.from || "");
    const next = String(body?.to || "");
    if (!(flow.includes(current) && (next === flow[flow.indexOf(current)+1] || (next === "cancelled" && flow.indexOf(current) < 4)))) {
      return Response.json({ error: "Invalid order status transition." }, { status: 400 });
    }
    const r = await pool.query(
      "UPDATE qr_dinein_orders SET status=$3,updated_at=NOW() WHERE id=$1 AND status=$2 RETURNING id",
      [id,current,next]
    );
    return Response.json({ ok:r.rowCount > 0, conflict:r.rowCount === 0 }, { status: r.rowCount ? 200 : 409 });
  } catch (error) {
    console.error("[Ayodhya QR] admin update failed:",error);
    return Response.json({ error: "Update failed." }, { status: 503 });
  }
}
