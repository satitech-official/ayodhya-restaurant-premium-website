"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, SectionHeading, Img } from "@/components/primitives";
import { img, IMAGES, COMBOS } from "@/lib/constants";
import { formatPrice, cn } from "@/lib/utils";

const SIZES = [2, 4, 6];

export default function ComboSection() {
  const [people, setPeople] = useState(2);
  const matches = COMBOS.filter((c) => c.people === people);

  return (
    <section className="relative overflow-hidden bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Combos"
          title="A Meal for Every Table"
          description="Pick your table size and we'll show the combos that make the most sense — generous, shareable and easy to order."
        />

        <Reveal delay={0.08}>
          <div className="mt-9 flex justify-center gap-3">
            {SIZES.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPeople(n)}
                aria-pressed={people === n}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold transition",
                  people === n
                    ? "border-terracotta bg-terracotta text-soft shadow-lift"
                    : "border-sand bg-soft text-walnut hover:border-terracotta/50",
                )}
              >
                <Users className="h-4 w-4" /> {n} People
              </button>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={people}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="mt-12 grid gap-6 sm:grid-cols-2"
          >
            {matches.map((c) => (
              <div
                key={c.id}
                className="group grid overflow-hidden rounded-[2rem] bg-soft shadow-soft ring-1 ring-sand/60 sm:grid-cols-2"
              >
                <div className="relative h-56 sm:h-full">
                  <Img
                    src={img(IMAGES[c.image], 700, 800)}
                    alt={c.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.1s] group-hover:scale-105"
                    sizes="(min-width:640px) 45vw, 90vw"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-burnt px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-soft">
                    {c.people} People
                  </span>
                </div>
                <div className="flex flex-col p-6">
                  <h3 className="font-display text-2xl font-semibold text-charcoal">{c.title}</h3>
                  <p className="mt-1 text-sm text-walnut/80">{c.note}</p>
                  <ul className="mt-4 space-y-2">
                    {c.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-sm text-espresso">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" /> {it}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-end justify-between pt-5">
                    <span className="font-display text-3xl font-semibold text-terracotta">
                      {formatPrice(c.price)}
                    </span>
                    <Link
                      href="/reserve"
                      className="rounded-full bg-charcoal px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-soft transition hover:bg-espresso"
                    >
                      Reserve
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
