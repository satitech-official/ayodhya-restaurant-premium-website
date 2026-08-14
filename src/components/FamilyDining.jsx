"use client";

import Link from "next/link";
import { ArrowRight, Users, Heart, Gift, PartyPopper, UtensilsCrossed } from "lucide-react";
import { Reveal, SectionHeading, Img } from "@/components/primitives";
import { img, IMAGES } from "@/lib/constants";

const USE_CASES = [
  { title: "Family Dinner", desc: "Platters built for passing around.", icon: UtensilsCrossed, image: IMAGES.family2 },
  { title: "Friends Meetup", desc: "Casual, loud and full of flavour.", icon: Users, image: IMAGES.family1 },
  { title: "Couple Dining", desc: "A warm corner for slow evenings.", icon: Heart, image: IMAGES.interior4 },
  { title: "Birthday Dinner", desc: "Cake, candles and celebrations.", icon: PartyPopper, image: IMAGES.family3 },
  { title: "Group Meal", desc: "Big tables, bigger appetites.", icon: Gift, image: IMAGES.family4 },
];

export default function FamilyDining() {
  return (
    <section className="noise relative overflow-hidden bg-espresso py-20 text-soft lg:py-28">
      <div className="pattern-jaali-light absolute inset-0 opacity-[0.14]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            tone="light"
            eyebrow="Dine Together"
            title="Better Together"
            description="Made for family dinners, friendly catch-ups and everyday cravings — there's always room for a few more at the table."
          />
          <Reveal>
            <Link
              href="/reserve"
              className="group inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-burnt"
            >
              Reserve Your Table
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {USE_CASES.map((u, i) => {
            const Icon = u.icon;
            return (
              <Reveal key={u.title} delay={i * 0.06} className={i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}>
                <div className="group relative h-72 overflow-hidden rounded-[2rem] ring-1 ring-cream/10 transition duration-500 hover:ring-brass/50">
                  <Img
                    src={img(u.image, 700, 900)}
                    alt={u.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                    sizes="(min-width:1024px) 20vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta text-soft">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="mt-3 font-display text-2xl font-semibold">{u.title}</h3>
                    <p className="mt-1 text-xs text-cream/70">{u.desc}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
