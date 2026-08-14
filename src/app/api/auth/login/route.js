import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createToken, serializeAuthCookie, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!db) return Response.json({ error: "Database is not configured. Add DATABASE_URL to enable this feature." }, { status: 503 });
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  const [admin] = await db.select().from(admins).where(eq(admins.email, email));
  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = createToken(admin.email);
  const cookie = serializeAuthCookie(token);
  return Response.json(
    { ok: true, email: admin.email },
    { status: 200, headers: { "Set-Cookie": cookie } },
  );
}
