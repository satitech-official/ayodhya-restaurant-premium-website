"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Menu,
  Phone,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons";
import { LogoLockup } from "@/components/Logo";
import OpenStatus from "@/components/OpenStatus";
import { NAV_LINKS, RESTAURANT } from "@/lib/constants";
import { cn } from "@/lib/utils";

const MOBILE_LINKS = [
  { label: "Home", href: "/", no: "01" },
  { label: "Menu", href: "/menu", no: "02" },
  { label: "Takeaway", href: "/takeaway", no: "03" },
  { label: "Gallery", href: "/gallery", no: "04" },
  { label: "About", href: "/about", no: "05" },
  { label: "Contact", href: "/contact", no: "06" },
];

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

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : previous;
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[110] transition-all duration-500",
          solid
            ? "border-b border-brass/15 bg-charcoal/92 text-soft shadow-[0_12px_35px_-28px_rgba(0,0,0,.85)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent text-soft",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Ayodhya Restaurant — home" className="relative z-10 text-terracotta">
            <LogoLockup dark />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "link-underline text-[12px] font-semibold uppercase tracking-[0.13em] transition-colors",
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
              className="rounded-full bg-terracotta px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.12em] text-soft transition hover:bg-burnt hover:text-charcoal"
            >
              Reserve Table
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="relative z-10 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-cream/25 bg-charcoal/30 text-soft backdrop-blur-md lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.3 }}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] overflow-y-auto bg-charcoal text-soft lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
          >
            <motion.img
              src="/images/hero-restaurant.webp"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-[0.16]"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2 }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(22,15,10,.96),rgba(43,25,14,.91)_55%,rgba(22,15,10,.98))]" />
            <div className="pattern-jaali-light absolute inset-0 opacity-[0.16]" />
            <motion.div
              className="absolute -right-24 top-24 h-72 w-72 rounded-full border border-brass/15"
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute -right-10 top-40 h-44 w-44 rounded-full border border-brass/10"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative mx-auto flex min-h-[100dvh] max-w-xl flex-col px-5 pb-28 pt-24">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center justify-between border-b border-brass/15 pb-4"
              >
                <div>
                  <p className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.24em] text-brass">
                    <Sparkles className="h-3.5 w-3.5" /> Ayodhya Restaurant
                  </p>
                  <p className="mt-1 text-xs text-cream/45">Fine dining · Betul</p>
                </div>
                <OpenStatus hours={settings.hours} showDetail={false} />
              </motion.div>

              <nav className="grid gap-1" aria-label="Mobile">
                {MOBILE_LINKS.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -26 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.045 * index, duration: 0.42 }}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center justify-between border-b border-cream/8 py-3.5"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="text-[9px] font-bold tracking-[0.2em] text-brass/60">{link.no}</span>
                        <span className="font-display text-[2rem] font-semibold leading-none text-cream transition group-active:text-brass">
                          {link.label}
                        </span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-brass/55 transition group-active:translate-x-1 group-active:-translate-y-1" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-6 grid grid-cols-3 gap-2">
                <a
                  href={RESTAURANT.phoneHref}
                  className="flex min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border border-brass/15 bg-white/[0.035] px-2 py-3 text-center text-[9px] font-bold uppercase tracking-[0.08em] text-cream/75"
                >
                  <Phone className="h-4 w-4 text-brass" /> Call
                </a>
                <Link
                  href="/takeaway"
                  className="flex min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border border-brass/15 bg-white/[0.035] px-2 py-3 text-center text-[9px] font-bold uppercase tracking-[0.08em] text-cream/75"
                >
                  <ShoppingBag className="h-4 w-4 text-brass" /> Takeaway
                </Link>
                <Link
                  href="/reserve"
                  className="flex min-w-0 flex-col items-center justify-center gap-2 rounded-2xl bg-terracotta px-2 py-3 text-center text-[9px] font-bold uppercase tracking-[0.08em] text-soft"
                >
                  <CalendarDays className="h-4 w-4" /> Reserve
                </Link>
              </div>

              <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-xs text-cream/45">
                <span>Great food. Royal memories.</span>
                <a
                  href={RESTAURANT.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-cream/65"
                >
                  <InstagramIcon className="h-3.5 w-3.5" /> Instagram
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
