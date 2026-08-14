import { db } from "@/db";
import { reviews } from "@/db/schema";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { FALLBACK_REVIEWS } from "@/lib/fallback-data";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const admin = requireAdmin(request);
  if (!db) return Response.json({ reviews: FALLBACK_REVIEWS, mode: "fallback" });
  try {
    const rows = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
    const visible = admin ? rows : rows.filter((r) => r.approved);
    return Response.json({ reviews: visible.length ? visible : FALLBACK_REVIEWS });
  } catch {
    return Response.json({ reviews: FALLBACK_REVIEWS, mode: "fallback" });
  }
}

export async function POST(request) {
  if (!db) return Response.json({ error: "Database is not configured. Add DATABASE_URL before editing reviews." }, { status: 503 });
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  const name = (body.name || "").trim();
  if (!name) return Response.json({ error: "Name is required" }, { status: 400 });
  const [row] = await db.insert(reviews).values({ name, rating: Math.min(5, Math.max(1, Number(body.rating) || 5)), review: body.review || "", source: body.source || "Google", date: body.date || "", approved: body.approved !== false }).returning();
  return Response.json({ review: row }, { status: 201 });
}
