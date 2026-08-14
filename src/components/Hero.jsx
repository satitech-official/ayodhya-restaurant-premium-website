"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Phone, MapPin, ArrowRight, ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/icons";
import OpenStatus from "@/components/OpenStatus";
import { LogoMark } from "@/components/Logo";
import { HERO_SLIDES, CUISINES, RESTAURANT } from "@/lib/constants";

const EASE = [0.22, 1, 0.36, 1];

// Hero imagery is intentionally local so the first paint never depends on
// Pexels/network availability. Food slides use the bundled food artwork while
// the welcome slide uses the restaurant ambience artwork.
const HERO_IMAGE_SOURCES = {
  interior1: "/images/hero-restaurant.webp",
  dosa1: "/images/hero-food.webp",
  paneer2: "/images/hero-food.webp",
  pizza1: "/images/hero-food.webp",
  mojito1: "/images/hero-food.webp",
};

const INGREDIENTS = [
  { emoji: "🌿", label: "fresh mint", className: "left-[4%] top-[12%]" },
  { emoji: "🧀", label: "paneer", className: "right-[6%] top-[18%]" },
  { emoji: "🌶️", label: "spice", className: "left-[10%] bottom-[20%]" },
  { emoji: "🍋", label: "lime", className: "right-[12%] bottom-[32%]" },
  { emoji: "🥄", label: "ghee", className: "left-[40%] -top-3" },
];

function Marquee() {
  const items = [...CUISINES, ...CUISINES];
  return (
    <div className="relative overflow-hidden border-t border-cream/10 py-4">
      <motion.div
        className="flex w-max items-center gap-8 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.28em] text-cream/40"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        {items.map((c, i) => (
          <span key={i} className="flex items-center gap-8">
            {c}
            <span className="h-1 w-1 rotate-45 bg-brass" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Hero({ settings }) {
  const [index, setIndex] = useState(0);
  const sectionRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const archX = useTransform(sx, (v) => v * 0.02);
  const archY = useTransform(sy, (v) => v * 0.02);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), 5200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const move = (e) => {
      const rect = el.getBoundingClientRect();
      mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 100);
      my.set(((e.clientY - rect.top) / rect.height - 0.5) * 100);
    };
    const mq = window.matchMedia("(pointer: fine)");
    if (mq.matches) el.addEventListener("mousemove", move, { passive: true });
    return () => el.removeEventListener("mousemove", move);
  }, [mx, my]);

  const slide = HERO_SLIDES[index];

  return (
    <section
      ref={sectionRef}
      className="noise relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-charcoal text-soft"
    >
      {/* layered background texture */}
      <div className="pattern-jaali-light absolute inset-0 opacity-[0.18]" aria-hidden="true" />
      <div
        className="absolute -left-32 top-1/3 h-[500px] w-[500px] rounded-full bg-terracotta/20 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-brass/15 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 pb-10 pt-28 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:pt-24">
        {/* Content */}
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-6 flex flex-wrap items-center gap-3"
          >
            <span className="flex items-center gap-2 rounded-full border border-brass/40 bg-brass/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brass">
              <MapPin className="h-3.5 w-3.5" /> Ganj, Betul
            </span>
            <OpenStatus hours={settings.hours} />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={slide.title}
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } }, exit: {} }}
            >
              <motion.p
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0 } }}
                className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-burnt"
              >
                {slide.kicker}
              </motion.p>
              <h1 className="text-balance font-display text-[clamp(2.6rem,7vw,4.9rem)] font-semibold leading-[0.98]">
                {slide.title.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 26, rotate: 2 },
                      show: { opacity: 1, y: 0, rotate: 0 },
                      exit: { opacity: 0, y: -12 },
                    }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="inline-block"
                  >
                    {word}
                    {i < slide.title.split(" ").length - 1 ? "\u00A0" : ""}
                  </motion.span>
                ))}
              </h1>
            </motion.div>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="mt-6 max-w-md text-base leading-relaxed text-cream/70"
          >
            From signature dosas and comforting North Indian classics to Indo-Chinese favourites,
            pizzas, beverages and more — discover Ayodhya Restaurant in the heart of Betul.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.42, ease: EASE }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/menu"
              data-cursor-magnetic
              className="group flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-burnt"
            >
              Explore Menu
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/reserve"
              data-cursor-magnetic
              className="rounded-full border border-cream/30 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-cream transition hover:border-burnt hover:text-burnt"
            >
              Reserve a Table
            </Link>
            <a
              href={RESTAURANT.mapsDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="link-underline inline-flex items-center gap-1.5 px-2 py-3.5 text-sm font-semibold text-cream/70 transition hover:text-cream"
            >
              Get Directions <ArrowUpRight className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href={RESTAURANT.phoneHref}
              className="flex items-center gap-2 text-sm font-semibold text-cream/80 transition hover:text-cream"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/25 text-burnt">
                <Phone className="h-4 w-4" />
              </span>
              {RESTAURANT.phoneDisplay}
            </a>
            <a
              href={RESTAURANT.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-cream/80 transition hover:text-cream"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/25 text-burnt">
                <InstagramIcon className="h-4 w-4" />
              </span>
              {RESTAURANT.instagramHandle}
            </a>
          </motion.div>
        </div>

        {/* Architectural arch image */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
          className="relative mx-auto block w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[440px]"
          style={{ x: archX, y: archY }}
        >
          <div className="clip-arch relative aspect-[7/9] overflow-hidden bg-espresso">
            <AnimatePresence mode="sync">
              <motion.img
                key={slide.image}
                src={HERO_IMAGE_SOURCES[slide.image] || "/images/hero-restaurant.webp"}
                alt={slide.title}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: EASE }}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  const node = event.currentTarget;
                  if (node.dataset.fallbackApplied === "1") return;
                  node.dataset.fallbackApplied = "1";
                  node.src = slide.image === "interior1" ? "/images/fallback-restaurant.svg" : "/images/fallback-food.svg";
                }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-charcoal/10" />
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <path
                d="M1.4 100 V34 C1.4 34 50 -7 50 -7 C50 -7 98.6 34 98.6 34 V100"
                fill="none"
                stroke="var(--color-brass)"
                strokeOpacity="0.6"
                strokeWidth="0.45"
              />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-5">
              <div>
                <p className="font-display text-xl font-semibold text-soft">Ayodhya</p>
                <p className="text-[11px] uppercase tracking-[0.22em] text-cream/60">Ganj · Betul</p>
              </div>
              <LogoMark className="h-8 w-8 text-burnt" />
            </div>
          </div>

          {/* floating ingredient tags */}
          {INGREDIENTS.map((g, i) => (
            <motion.span
              key={g.label}
              className={`absolute ${g.className} flex items-center gap-1.5 rounded-full border border-cream/20 bg-charcoal/70 px-3 py-1.5 text-xs font-semibold text-cream backdrop-blur-sm`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
            >
              <span
                className="animate-drift inline-block"
                style={{ animationDelay: `${i * 0.7}s` }}
              >
                {g.emoji}
              </span>
              {g.label}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <div className="relative">
        <Marquee />
      </div>
    </section>
  );
}
