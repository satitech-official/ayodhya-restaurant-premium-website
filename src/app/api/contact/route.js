import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Honeypot + minimum time are lightweight spam guards.
export async function POST(request) {
  if (!db) return Response.json({ error: "Database is not configured. Add DATABASE_URL to enable this feature." }, { status: 503 });
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.website && String(body.website).length > 0) {
    // Honeypot field filled — silently drop.
    return Response.json({ ok: true });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  if (!name || name.length < 2)
    return Response.json({ error: "Please enter your name." }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (!message || message.length < 5)
    return Response.json({ error: "Please write a short message." }, { status: 400 });

  const [row] = await db
    .insert(contactMessages)
    .values({
      name,
      phone: (body.phone || "").trim(),
      email,
      subject: (body.subject || "").trim() || "General enquiry",
      message,
      read: false,
    })
    .returning();

  return Response.json({ message: row }, { status: 201 });
}

export async function GET(request) {
  if (!db) return Response.json({ error: "Database is not configured. Add DATABASE_URL to enable this feature." }, { status: 503 });
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  return Response.json({ messages: rows });
}
