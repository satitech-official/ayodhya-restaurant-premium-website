"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarDays,
  Images,
  BadgePercent,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { LogoLockup } from "@/components/Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Menu", href: "/admin/menu", icon: UtensilsCrossed },
  { label: "Reservations", href: "/admin/reservations", icon: CalendarDays },
  { label: "Gallery", href: "/admin/gallery", icon: Images },
  { label: "Offers", href: "/admin/offers", icon: BadgePercent },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#f6efe6]">
      <div className="mx-auto flex max-w-[1440px]">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-charcoal p-5 text-soft lg:flex">
          <Link href="/" className="text-terracotta">
            <LogoLockup dark compact />
          </Link>
          <nav className="mt-8 flex flex-col gap-1" aria-label="Admin">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
                    active ? "bg-terracotta text-soft" : "text-cream/70 hover:bg-cream/10 hover:text-cream",
                  )}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-2 border-t border-cream/10 pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-cream/70 transition hover:bg-cream/10 hover:text-cream"
            >
              <ExternalLink className="h-4 w-4" /> View Website
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-cream/70 transition hover:bg-terracotta/20 hover:text-cream"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <div className="sticky top-0 z-30 border-b border-sand bg-charcoal px-4 py-3 text-soft lg:hidden">
            <div className="flex items-center justify-between">
              <Link href="/admin" className="text-terracotta">
                <LogoLockup dark compact />
              </Link>
              <button type="button" onClick={logout} className="flex items-center gap-1.5 text-xs font-semibold text-cream/80">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
                      active ? "bg-terracotta text-soft" : "bg-cream/10 text-cream/80",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" /> {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
