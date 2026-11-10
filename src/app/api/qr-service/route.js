import { pool } from "@/db";
import { pilotEnabled, validTable, sameOrigin, ensureQrTables } from "@/lib/qr-dinein";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(request) {
  if (!pilotEnabled() || !pool) return Response.json({ error: "Service requests unavailable." }, { status: 503 });
  if (!sameOrigin(request)) return Response.json({ error: "Forbidden." }, { status: 403 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON." }, { status: 400 }); }
  const table = String(body?.table || "");
  const kind = String(body?.kind || "");
  if (!validTable(table) || !["water","waiter","bill"].includes(kind)) return Response.json({ error: "Invalid request." }, { status: 400 });
  try {
    await ensureQrTables();
    const recent = await pool.query(
      "SELECT id FROM qr_dinein_requests WHERE table_code=$1 AND kind=$2 AND created_at > NOW()-INTERVAL '45 seconds' LIMIT 1",
      [table, kind]
    );
    if (recent.rows.length) return Response.json({ ok: true, message: "Request already sent." });
    await pool.query("INSERT INTO qr_dinein_requests(table_code,kind) VALUES ($1,$2)", [table,kind]);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[Ayodhya QR] service request failed:",error);
    return Response.json({ error: "Could not send request." }, { status: 503 });
  }
}
