import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ authenticated: false }, { status: 200 });
  return Response.json({ authenticated: true, email: admin.email });
}
