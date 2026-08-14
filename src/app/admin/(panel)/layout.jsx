import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }) {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value || "";
  if (!verifyToken(token)) redirect("/admin/login");

  return <AdminSidebar>{children}</AdminSidebar>;
}
