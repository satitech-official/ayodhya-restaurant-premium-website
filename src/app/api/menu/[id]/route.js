import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

const FIELDS = [
  "name",
  "description",
  "category",
  "cuisine",
  "price",
  "image",
  "vegetarian",
  "spicyLevel",
  "recommended",
  "bestseller",
  "signature",
  "available",
];

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
  for (const k of FIELDS) {
    if (body[k] !== undefined) {
      if (k === "price") patch[k] = String(body[k]);
      else if (k === "spicyLevel") patch[k] = Number(body[k]) || 0;
      else patch[k] = body[k];
    }
  }
  if (body.name) patch.slug = body.slug || slugify(body.name);

  const [row] = await db
    .update(menuItems)
    .set(patch)
    .where(eq(menuItems.id, Number(id)))
    .returning();

  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ item: row });
}

export async function DELETE(request, { params }) {
  if (!db) return Response.json({ error: "Database is not configured. Add DATABASE_URL to enable this feature." }, { status: 503 });
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(menuItems).where(eq(menuItems.id, Number(id)));
  return Response.json({ ok: true });
}
