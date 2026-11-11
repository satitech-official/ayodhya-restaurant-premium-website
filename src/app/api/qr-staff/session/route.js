import crypto from "node:crypto";
import { qrPool } from "@/db/qr-pool";
import { checkStaffPassword, hasQrStaffSession, makeQrStaffToken, staffCookie, clearStaffCookie } from "@/lib/qr-staff-auth";
import { pilotEnabled, sameOrigin } from "@/lib/qr-dinein";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  return Response.json({ authenticated: pilotEnabled() && hasQrStaffSession(request) }, { headers: { "Cache-Control":"no-store" } });
}
export async function POST(request) {
  if (!pilotEnabled() || !qrPool) return Response.json({ error:"QR kitchen is unavailable." }, { status:503 });
  if (!sameOrigin(request)) return Response.json({ error:"Forbidden." }, { status:403 });
  let body;
  try { body=await request.json(); } catch { return Response.json({error:"Invalid request."},{status:400}); }
  try {
    await qrPool.query("CREATE TABLE IF NOT EXISTS qr_staff_failed_logins (id BIGSERIAL PRIMARY KEY, ip_hash TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())");
    await qrPool.query("CREATE INDEX IF NOT EXISTS qr_staff_failed_logins_idx ON qr_staff_failed_logins (ip_hash,created_at DESC)");
    const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const ipHash = crypto.createHmac("sha256", process.env.QR_STAFF_SECRET || "unset").update(ip).digest("hex");
    const recent = await qrPool.query("SELECT count(*)::int AS n FROM qr_staff_failed_logins WHERE ip_hash=$1 AND created_at>NOW()-INTERVAL '15 minutes'",[ipHash]);
    if (recent.rows[0].n>=7) return Response.json({error:"Too many attempts. Please try later."},{status:429});
    if (!checkStaffPassword(body?.password)) {
      await qrPool.query("INSERT INTO qr_staff_failed_logins(ip_hash) VALUES ($1)",[ipHash]);
      return Response.json({error:"Incorrect staff access code."},{status:401});
    }
    return Response.json({ authenticated:true }, { headers:{"Set-Cookie":staffCookie(makeQrStaffToken()),"Cache-Control":"no-store"} });
  } catch (error) {
    console.error("[Ayodhya QR] staff login failed:",error);
    return Response.json({error:"Kitchen sign-in temporarily unavailable."},{status:503});
  }
}
export async function DELETE(request) {
  if (!sameOrigin(request)) return Response.json({error:"Forbidden."},{status:403});
  return Response.json({authenticated:false},{headers:{"Set-Cookie":clearStaffCookie(),"Cache-Control":"no-store"}});
}
