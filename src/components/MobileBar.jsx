"use client";

import Link from "next/link";
import { Phone, UtensilsCrossed, CalendarDays, Navigation } from "lucide-react";
import { RESTAURANT } from "@/lib/constants";

export default function MobileBar() {
  const items = [
    { label: "Call", href: RESTAURANT.phoneHref, icon: Phone, external: true },
    { label: "Menu", href: "/menu", icon: UtensilsCrossed },
    { label: "Reserve", href: "/reserve", icon: CalendarDays },
    { label: "Directions", href: RESTAURANT.mapsDirectionsUrl, icon: Navigation, external: true },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-brass/20 bg-charcoal/95 pb-[env(safe-area-inset-bottom)] text-cream backdrop-blur-md md:hidden"
      aria-label="Quick actions"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return item.external ? (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-cream/80 active:text-burnt"
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </a>
        ) : (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-cream/80 active:text-burnt"
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
