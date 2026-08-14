import { db } from "@/db";
import {
  menuItems,
  reservations,
  offers,
  gallery,
  reviews,
  contactMessages,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!db) return Response.json({ error: "Database is not configured. Add DATABASE_URL to enable this feature." }, { status: 503 });
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const [items, resvs, allResvs, offerRows, galleryRows, reviewRows, messages] =
    await Promise.all([
      db.select().from(menuItems),
      db.select().from(reservations).where(eq(reservations.date, new Date().toISOString().slice(0, 10))),
      db.select().from(reservations),
      db.select().from(offers),
      db.select().from(gallery),
      db.select().from(reviews),
      db.select().from(contactMessages),
    ]);

  const activeOffers = offerRows.filter((o) => o.active);
  const unreadMessages = messages.filter((m) => !m.read).length;
  const pendingReservations = allResvs.filter((r) => r.status === "new" || r.status === "confirmed");

  return Response.json({
    stats: {
      menuItemCount: items.length,
      availableDishes: items.filter((i) => i.available).length,
      unavailableDishes: items.filter((i) => !i.available).length,
      reservationsToday: resvs.length,
      upcomingReservations: pendingReservations.length,
      galleryImages: galleryRows.length,
      activeOffers: activeOffers.length,
      messages: unreadMessages,
      reviews: reviewRows.filter((r) => r.approved).length,
    },
  });
}
