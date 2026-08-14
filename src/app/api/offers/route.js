import { db } from "@/db";
import { offers } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { FALLBACK_OFFERS } from "@/lib/fallback-data";

export const dynamic = "force-dynamic";
const today = () => new Date().toISOString().slice(0, 10);

export async function GET(request) {
  const admin = requireAdmin(request);
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "1";
  if (!db) return Response.json({ offers: FALLBACK_OFFERS, mode: "fallback" });
  try {
    let rows;
    if (admin && all) rows = await db.select().from(offers).orderBy(asc(offers.title));
    else {
      rows = await db.select().from(offers).where(eq(offers.active, true)).orderBy(asc(offers.title));
      const t = today();
      rows = rows.filter((o) => !o.validUntil || o.validUntil >= t);
    }
    return Response.json({ offers: rows.length ? rows : FALLBACK_OFFERS });
  } catch {
    return Response.json({ offers: FALLBACK_OFFERS, mode: "fallback" });
  }
}

export async function POST(request) {
  if (!db) return Response.json({ error: "Database is not configured. Add DATABASE_URL before editing offers." }, { status: 503 });
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  const title = (body.title || "").trim();
  if (!title) return Response.json({ error: "Title is required" }, { status: 400 });
  const [row] = await db.insert(offers).values({
    slug: body.slug || slugify(title) + "-" + Date.now().toString(36), title, description: body.description || "", image: body.image || "", badge: body.badge || "", ctaLabel: body.ctaLabel || "", ctaLink: body.ctaLink || "", validFrom: body.validFrom || "", validUntil: body.validUntil || "", active: body.active !== false,
  }).returning();
  return Response.json({ offer: row }, { status: 201 });
}
