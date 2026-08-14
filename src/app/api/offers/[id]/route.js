import { db } from "@/db";
import { offers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const FIELDS = ["title", "description", "image", "badge", "ctaLabel", "ctaLink", "validFrom", "validUntil", "active"];

export async function PATCH(request, { params }) {
  if (!db) return Response.json({ error: "Database is not configured. Add DATABASE_URL to enable this feature." }, { status: 503 });
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch = {};
  for (const k of FIELDS) if (body[k] !== undefined) patch[k] = body[k];

  const [row] = await db.update(offers).set(patch).where(eq(offers.id, Number(id))).returning();
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ offer: row });
}

export async function DELETE(request, { params }) {
  if (!db) return Response.json({ error: "Database is not configured. Add DATABASE_URL to enable this feature." }, { status: 503 });
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(offers).where(eq(offers.id, Number(id)));
  return Response.json({ ok: true });
}
