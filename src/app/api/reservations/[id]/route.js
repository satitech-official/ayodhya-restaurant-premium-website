import { db } from "@/db";
import { reservations } from "@/db/schema";
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
  if (body.status) patch.status = body.status;
  if (body.specialRequest !== undefined) patch.specialRequest = body.specialRequest;

  const [row] = await db
    .update(reservations)
    .set(patch)
    .where(eq(reservations.id, Number(id)))
    .returning();

  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ reservation: row });
}

export async function DELETE(request, { params }) {
  if (!db) return Response.json({ error: "Database is not configured. Add DATABASE_URL to enable this feature." }, { status: 503 });
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(reservations).where(eq(reservations.id, Number(id)));
  return Response.json({ ok: true });
}
