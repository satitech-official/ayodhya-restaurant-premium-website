"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/icons";
import { LogoLockup } from "@/components/Logo";
import OpenStatus from "@/components/OpenStatus";
import { NAV_LINKS, RESTAURANT } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Navbar({ settings }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          solid
            ? "border-b border-brass/15 bg-charcoal/90 text-soft backdrop-blur-md"
            : "border-b border-transparent bg-transparent text-soft",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Ayodhya Restaurant — home" className="text-terracotta">
            <LogoLockup dark />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "link-underline text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors",
                  pathname === link.href ? "text-burnt" : "text-soft/85 hover:text-soft",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <OpenStatus hours={settings.hours} showDetail={false} />
            <a
              href={RESTAURANT.phoneHref}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 text-cream/90 transition hover:border-burnt hover:text-burnt"
              aria-label="Call the restaurant"
            >
              <Phone className="h-4 w-4" />
            </a>
            <Link
              href="/reserve"
              className="rounded-full bg-terracotta px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.12em] text-soft transition hover:bg-burnt"
            >
              Reserve Table
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-soft lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-charcoal text-soft lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="pattern-jaali-light absolute inset-0 opacity-20" aria-hidden="true" />
            <nav
              className="relative flex flex-1 flex-col items-start justify-center gap-1 px-8 pt-20"
              aria-label="Mobile"
            >
              {[
                { label: "Home", href: "/" },
                { label: "Menu", href: "/menu" },
                { label: "Gallery", href: "/gallery" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Reserve a Table", href: "/reserve" },
              ].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    className="font-display text-4xl font-medium text-cream transition hover:text-burnt"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="relative flex items-center justify-between gap-4 border-t border-cream/10 px-8 py-6">
              <OpenStatus hours={settings.hours} />
              <a
                href={RESTAURANT.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-cream/70"
              >
                <InstagramIcon className="h-4 w-4" /> {RESTAURANT.instagramHandle}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
