"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { Reveal, SectionHeading, ArchImage, Tag } from "@/components/primitives";
import { img, IMAGES } from "@/lib/constants";

function CountUp({ value, suffix = "", label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <div ref={ref} className="flex flex-col">
      <span className="font-display text-5xl font-semibold text-charcoal sm:text-6xl">
        {n}
        {suffix}
      </span>
      <span className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-walnut/80">
        {label}
      </span>
    </div>
  );
}

const HIGHLIGHTS = [
  "Creative Dosa Counter",
  "Rich Paneer & Curry Gravies",
  "Stone-Baked Pizzas",
  "Chilled Shakes & Mojitos",
];

export default function Story() {
  return (
    <section className="relative overflow-hidden bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Image side */}
          <Reveal className="relative">
            <div className="relative mx-auto max-w-[420px]">
              <div className="clip-arch-round absolute -inset-4 -rotate-2 bg-sand/50" aria-hidden="true" />
              <div className="group relative">
                <ArchImage
                  src={img(IMAGES.interior4, 900, 1150)}
                  alt="Warm wood-toned dining room at Ayodhya Restaurant"
                  variant="arch"
                  ratio="aspect-[4/5]"
                />
                <div className="absolute -bottom-6 -right-4 sm:-right-8">
                  <div className="rounded-2xl bg-charcoal px-6 py-4 text-soft shadow-premium">
                    <p className="font-display text-3xl font-semibold text-burnt">100+</p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-cream/70">Dishes & Drinks</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Text side */}
          <div>
            <SectionHeading
              eyebrow="Our Story"
              title="Where Every Flavour Tells a Story"
              description="From crispy South Indian favourites to rich North Indian curries, sizzling Indo-Chinese dishes and contemporary comfort food, Ayodhya Restaurant brings different cravings together at one table — a modern family dining room where warm hospitality comes first."
            />
            <Reveal delay={0.1}>
              <div className="mt-7 flex flex-wrap gap-2">
                {HIGHLIGHTS.map((h) => (
                  <Tag key={h} tone="brass">
                    {h}
                  </Tag>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 grid grid-cols-2 gap-6 border-t border-sand pt-8 sm:grid-cols-4">
                <CountUp value={100} suffix="+" label="Dishes" />
                <CountUp value={20} suffix="+" label="Categories" />
                <CountUp value={9} label="Cuisines" />
                <CountUp value={7} label="Days a Week" />
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-9 flex flex-col gap-4 text-sm text-walnut sm:flex-row sm:items-center sm:gap-8">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-terracotta" /> In front of Lashkare Hospital, Ganj, Betul
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-terracotta" /> Family & group friendly
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <Link
                href="/about"
                className="group mt-9 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-terracotta"
              >
                More About Ayodhya
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
