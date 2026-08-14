"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading, Reveal } from "@/components/primitives";
import DishCard from "@/components/DishCard";
import { CRAVINGS } from "@/lib/constants";
import { getCravings, cn } from "@/lib/utils";

export default function CravingSelector({ items }) {
  const [active, setActive] = useState("crispy");

  const matches = items
    .filter((i) => getCravings(i).includes(active))
    .slice(0, 6);

  return (
    <section className="relative overflow-hidden bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Food Discovery"
          title="What Are You Craving?"
          description="Something crispy, cheesy, spicy, creamy or light — tell us the mood and we'll point you to the right plate."
        />

        <Reveal delay={0.1}>
          <div className="mt-9 flex flex-wrap justify-center gap-2.5">
            {CRAVINGS.map((c) => {
              const selected = active === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActive(c.id)}
                  aria-pressed={selected}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all",
                    selected
                      ? "border-terracotta bg-terracotta text-soft shadow-lift"
                      : "border-sand bg-soft text-walnut hover:border-terracotta/50 hover:text-terracotta",
                  )}
                >
                  <span aria-hidden="true">{c.emoji}</span>
                  {c.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {matches.map((item) => (
              <DishCard key={item.id} item={item} />
            ))}
          </motion.div>
        </AnimatePresence>

        <Reveal delay={0.1}>
          <div className="mt-12 text-center">
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-espresso"
            >
              Browse the Full Menu
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
