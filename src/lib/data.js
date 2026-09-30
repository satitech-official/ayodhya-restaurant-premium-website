import { db } from "@/db";
import {
  menuItems,
  offers,
  gallery,
  reviews,
  businessSettings,
  menuCategories,
} from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import {
  FALLBACK_MENU_ITEMS,
  FALLBACK_CATEGORIES,
  FALLBACK_GALLERY,
  FALLBACK_OFFERS,
  FALLBACK_REVIEWS,
} from "@/lib/fallback-data";


function normalizeCategories(rows = []) {
  const seen = new Set();
  return rows.filter((category) => {
    const slug = String(category?.slug || "").trim();
    if (!slug || slug === "recommended" || slug === "all" || seen.has(slug)) return false;
    seen.add(slug);
    return true;
  });
}

function reportDataFallback(area, error) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[Ayodhya] Using bundled ${area} data.`, error?.message || "Database not configured");
  }
}

export async function getSettings() {
  if (!db) return { ...DEFAULT_SETTINGS };
  try {
    const rows = await db.select().from(businessSettings);
    const settings = { ...DEFAULT_SETTINGS };
    for (const r of rows) {
      if (r.key === "hours") {
        try {
          settings.hours = JSON.parse(r.value);
        } catch {
          settings.hours = DEFAULT_SETTINGS.hours;
        }
      } else {
        settings[r.key] = r.value;
      }
    }
    return settings;
  } catch (error) {
    reportDataFallback("settings", error);
    return { ...DEFAULT_SETTINGS };
  }
}

export async function getMenuItems() {
  // The restaurant supplied an official menu PDF. Keep the public menu locked
  // to that audited source so stale database rows can never reintroduce dishes
  // or prices that are not on the current restaurant menu.
  return FALLBACK_MENU_ITEMS;
}

export async function getCategories() {
  return normalizeCategories(FALLBACK_CATEGORIES);
}

export async function getActiveOffers() {
  if (!db) return FALLBACK_OFFERS;
  try {
    const rows = await db
      .select()
      .from(offers)
      .where(eq(offers.active, true))
      .orderBy(asc(offers.title));
    const t = new Date().toISOString().slice(0, 10);
    const active = rows.filter((o) => !o.validUntil || o.validUntil >= t);
    return active.length ? active : FALLBACK_OFFERS;
  } catch (error) {
    reportDataFallback("offer", error);
    return FALLBACK_OFFERS;
  }
}

export async function getGallery() {
  if (!db) return FALLBACK_GALLERY;
  try {
    const rows = await db.select().from(gallery).orderBy(asc(gallery.sortOrder));
    return rows.length ? rows : FALLBACK_GALLERY;
  } catch (error) {
    reportDataFallback("gallery", error);
    return FALLBACK_GALLERY;
  }
}

export async function getApprovedReviews() {
  if (!db) return FALLBACK_REVIEWS;
  try {
    const rows = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
    const approved = rows.filter((r) => r.approved);
    return approved.length ? approved : FALLBACK_REVIEWS;
  } catch (error) {
    reportDataFallback("review", error);
    return FALLBACK_REVIEWS;
  }
}
