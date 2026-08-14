"use client";

import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { Reveal, Img } from "@/components/primitives";
import { img, IMAGES, RESTAURANT } from "@/lib/constants";

export default function ReservationCTA() {
  return (
    <section className="relative overflow-hidden">
      <Img
        src={img(IMAGES.family3, 1600, 900)}
        alt="A family celebrating over dinner at Ayodhya Restaurant"
        className="absolute inset-0 h-full w-full object-cover"
        eager
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/80 to-charcoal/50" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-burnt">Reservations</p>
          <h2 className="mt-4 text-balance font-display text-4xl font-semibold leading-[1.05] text-soft sm:text-5xl">
            Your Table, Ready When You Are.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-cream/75">
            Reserve ahead for family dinners, birthdays and group meals — or just walk in and let
            the kitchen surprise you.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/reserve"
              data-cursor-magnetic
              className="group inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-burnt"
            >
              Reserve a Table
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={RESTAURANT.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-cream transition hover:border-burnt hover:text-burnt"
            >
              <Phone className="h-4 w-4" /> {RESTAURANT.phoneDisplay}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
