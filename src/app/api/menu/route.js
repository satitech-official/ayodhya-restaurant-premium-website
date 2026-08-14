import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { asc, eq, ilike, or, inArray, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { FALLBACK_MENU_ITEMS } from "@/lib/fallback-data";

export const dynamic = "force-dynamic";

const CATEGORY_GROUPS = {
  "quick-bites": ["sandwiches", "maggi", "starters", "delhi-chaat", "noodles", "pasta"],
  beverages: ["beverages", "shakes"],
  "south-indian": ["south-indian", "dosa-specials"],
  "north-indian": ["north-indian", "paneer-specials", "rice-biryani", "breads"],
  chinese: ["chinese", "noodles", "soups-salads"],
};

function fallbackMenu(searchParams) {
  const cat = searchParams.get("cat");
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const signature = searchParams.get("signature");
  const recommended = searchParams.get("recommended");
  let rows = FALLBACK_MENU_ITEMS;
  if (cat) {
    if (cat === "recommended") rows = rows.filter((i) => i.recommended);
    else if (CATEGORY_GROUPS[cat]) rows = rows.filter((i) => CATEGORY_GROUPS[cat].includes(i.category));
    else rows = rows.filter((i) => i.category === cat);
  }
  if (signature === "1") rows = rows.filter((i) => i.signature);
  if (recommended === "1") rows = rows.filter((i) => i.recommended);
  if (q) rows = rows.filter((i) => [i.name, i.description, i.cuisine].some((v) => String(v || "").toLowerCase().includes(q)));
  return rows;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (!db) return Response.json({ items: fallbackMenu(searchParams), mode: "fallback" });

  const cat = searchParams.get("cat");
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const signature = searchParams.get("signature");
  const recommended = searchParams.get("recommended");

  const conds = [];
  if (cat) {
    if (cat === "recommended") conds.push(eq(menuItems.recommended, true));
    else if (CATEGORY_GROUPS[cat]) conds.push(inArray(menuItems.category, CATEGORY_GROUPS[cat]));
    else conds.push(eq(menuItems.category, cat));
  }
  if (signature === "1") conds.push(eq(menuItems.signature, true));
  if (recommended === "1") conds.push(eq(menuItems.recommended, true));
  if (q) {
    conds.push(or(ilike(menuItems.name, `%${q}%`), ilike(menuItems.description, `%${q}%`), ilike(menuItems.cuisine, `%${q}%`)));
  }

  try {
    const rows = await db.select().from(menuItems).where(conds.length ? and(...conds) : undefined).orderBy(asc(menuItems.name));
    return Response.json({ items: rows.length ? rows : fallbackMenu(searchParams) });
  } catch {
    return Response.json({ items: fallbackMenu(searchParams), mode: "fallback" });
  }
}

export async function POST(request) {
  if (!db) return Response.json({ error: "Database is not configured. Add DATABASE_URL before editing menu data." }, { status: 503 });
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  const name = (body.name || "").trim();
  if (!name) return Response.json({ error: "Dish name is required" }, { status: 400 });
  if (!body.category) return Response.json({ error: "Category is required" }, { status: 400 });

  const [row] = await db.insert(menuItems).values({
    name,
    slug: body.slug || slugify(name),
    description: body.description || "",
    category: body.category,
    cuisine: body.cuisine || "",
    price: body.price != null ? String(body.price) : "0",
    image: body.image || "",
    vegetarian: body.vegetarian !== false,
    spicyLevel: Number(body.spicyLevel) || 0,
    recommended: Boolean(body.recommended),
    bestseller: Boolean(body.bestseller),
    signature: Boolean(body.signature),
    available: body.available !== false,
  }).returning();
  return Response.json({ item: row }, { status: 201 });
}
