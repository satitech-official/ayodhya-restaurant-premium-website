import { db } from "@/db";
import { reservations } from "@/db/schema";
import { desc, eq, ilike, or, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!db) return Response.json({ error: "Database is not configured. Add DATABASE_URL to enable this feature." }, { status: 503 });
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const status = searchParams.get("status");

  const conds = [];
  if (date) conds.push(eq(reservations.date, date));
  if (status) conds.push(eq(reservations.status, status));
  if (q) conds.push(or(ilike(reservations.name, `%${q}%`), ilike(reservations.phone, `%${q}%`)));

  const rows = await db
    .select()
    .from(reservations)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(reservations.createdAt));

  return Response.json({ reservations: rows });
}

export async function POST(request) {
  if (!db) return Response.json({ error: "Database is not configured. Add DATABASE_URL to enable this feature." }, { status: 503 });
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const date = (body.date || "").trim();
  const time = (body.time || "").trim();
  const guests = Number(body.guests);

  if (!name || name.length < 2)
    return Response.json({ error: "Please enter your full name." }, { status: 400 });
  if (!/^[+\d][\d\s-]{7,15}$/.test(phone))
    return Response.json({ error: "Please enter a valid phone number." }, { status: 400 });
  if (!date || !time)
    return Response.json({ error: "Please choose a date and time." }, { status: 400 });
  if (!guests || guests < 1 || guests > 30)
    return Response.json({ error: "Please select a valid number of guests." }, { status: 400 });

  const [row] = await db
    .insert(reservations)
    .values({
      name,
      phone,
      date,
      time,
      guests,
      occasion: body.occasion || "Regular Dining",
      seating: body.seating || "No preference",
      specialRequest: (body.specialRequest || "").trim(),
      status: "new",
    })
    .returning();

  return Response.json({ reservation: row }, { status: 201 });
}
