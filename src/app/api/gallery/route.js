import { db } from "@/db";
import { gallery } from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { FALLBACK_GALLERY } from "@/lib/fallback-data";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const admin = requireAdmin(request);
  const { searchParams } = new URL(request.url);
  const cat = searchParams.get("cat");
  try {
    const rows = db ? await db.select().from(gallery).orderBy(asc(gallery.sortOrder)) : FALLBACK_GALLERY;
    const source = rows.length ? rows : FALLBACK_GALLERY;
    const filtered = cat ? source.filter((g) => g.category === cat) : source;
    return Response.json({ gallery: filtered, _admin: Boolean(admin), mode: db ? "database" : "fallback" });
  } catch {
    const filtered = cat ? FALLBACK_GALLERY.filter((g) => g.category === cat) : FALLBACK_GALLERY;
    return Response.json({ gallery: filtered, _admin: Boolean(admin), mode: "fallback" });
  }
}

export async function POST(request) {
  if (!db) return Response.json({ error: "Database is not configured. Add DATABASE_URL before editing gallery data." }, { status: 503 });
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!body.image) return Response.json({ error: "Image URL is required" }, { status: 400 });
  const [row] = await db.insert(gallery).values({ image: body.image, caption: body.caption || "", category: body.category || "Food", sortOrder: Number(body.sortOrder) || 0 }).returning();
  return Response.json({ item: row }, { status: 201 });
}
