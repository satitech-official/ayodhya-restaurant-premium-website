import { AUTH_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const cookie = `${AUTH_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
  return Response.json({ ok: true }, { status: 200, headers: { "Set-Cookie": cookie } });
}
