import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

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
  if (body.approved !== undefined) patch.approved = Boolean(body.approved);
  if (body.review !== undefined) patch.review = body.review;
  if (body.name !== undefined) patch.name = body.name;
  if (body.rating !== undefined) patch.rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
  if (body.source !== undefined) patch.source = body.source;

  const [row] = await db.update(reviews).set(patch).where(eq(reviews.id, Number(id))).returning();
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ review: row });
}

export async function DELETE(request, { params }) {
  if (!db) return Response.json({ error: "Database is not configured. Add DATABASE_URL to enable this feature." }, { status: 503 });
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(reviews).where(eq(reviews.id, Number(id)));
  return Response.json({ ok: true });
}
