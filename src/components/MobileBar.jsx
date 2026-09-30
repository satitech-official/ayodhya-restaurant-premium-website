"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Phone, UtensilsCrossed, CalendarDays, ShoppingBag } from "lucide-react";
import { RESTAURANT } from "@/lib/constants";

export default function MobileBar() {
  const pathname = usePathname();
  const firstItem =
    pathname === "/menu"
      ? { label: "Home", href: "/", icon: Home }
      : { label: "Call", href: RESTAURANT.phoneHref, icon: Phone, external: true };

  const items = [
    firstItem,
    { label: "Menu", href: "/menu", icon: UtensilsCrossed },
    { label: "Takeaway", href: "/takeaway", icon: ShoppingBag },
    { label: "Reserve", href: "/reserve", icon: CalendarDays },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-brass/25 bg-charcoal/95 pb-[env(safe-area-inset-bottom)] text-cream backdrop-blur-md md:hidden"
      aria-label="Quick actions"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        const cls =
          "flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition " +
          (active ? "text-brass" : "text-cream/78 active:text-brass");

        return item.external ? (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className={cls}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </a>
        ) : (
          <Link key={item.label} href={item.href} className={cls}>
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
