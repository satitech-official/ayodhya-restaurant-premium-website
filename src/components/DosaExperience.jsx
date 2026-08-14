"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal, SectionHeading, Img, VegDot, Spicy } from "@/components/primitives";
import { img, IMAGES, DOSA_EXPERIENCE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

function DosaCard({ d, index }) {
  return (
    <div className="group relative w-[82vw] shrink-0 snap-center sm:w-[420px]">
      <div className="relative h-[480px] overflow-hidden rounded-[2rem] bg-espresso ring-1 ring-brass/20">
        <Img
          src={img(IMAGES[d.image], 900, 1150)}
          alt={d.name}
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-[1.3s] ease-out group-hover:scale-105"
          sizes="420px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

        {/* index number */}
        <span className="absolute right-5 top-4 font-display text-6xl font-semibold text-cream/15">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="absolute left-5 top-5 flex items-center gap-2">
          <span className="rounded-full border border-cream/25 bg-charcoal/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-cream backdrop-blur-sm">
            {d.tag}
          </span>
          <VegDot />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="font-display text-3xl font-semibold text-soft">{d.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-cream/70">{d.description}</p>

          {/* hover / focus reveal */}
          <div className="mt-4 flex flex-wrap gap-1.5 opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
            {d.ingredients.map((ing) => (
              <span
                key={ing}
                className="rounded-full border border-cream/20 bg-charcoal/50 px-2.5 py-1 text-[11px] text-cream/85 backdrop-blur-sm"
              >
                {ing}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div className="flex flex-col gap-1.5">
              <Spicy level={d.spice} className="text-burnt" />
              <span className="font-display text-2xl font-semibold text-soft">
                {formatPrice(d.price)}
              </span>
            </div>
            <Link
              href="/menu?cat=dosa-specials"
              className="rounded-full bg-terracotta px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-soft transition hover:bg-burnt"
            >
              Order It
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DosaExperience() {
  const track = useRef(null);

  const scroll = (dir) => {
    track.current?.scrollBy({ left: dir * 440, behavior: "smooth" });
  };

  return (
    <section className="noise relative overflow-hidden bg-charcoal py-20 text-soft lg:py-28">
      <div className="pattern-jaali-light absolute inset-0 opacity-[0.14]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            tone="light"
            eyebrow="The Dosa Counter"
            title="Not Just Dosa. An Ayodhya Experience."
            description="Crispy, loaded, cheesy or fiery — explore the creative dosas that made our counter a Betul favourite."
          />
          <Reveal>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label="Previous dosa"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream transition hover:border-burnt hover:text-burnt"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label="Next dosa"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream transition hover:border-burnt hover:text-burnt"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div
            ref={track}
            className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {DOSA_EXPERIENCE.map((d, i) => (
              <DosaCard key={d.name} d={d} index={i} />
            ))}

            {/* end card */}
            <div className="flex w-[70vw] shrink-0 snap-center items-center justify-center sm:w-[320px]">
              <Link
                href="/menu?cat=dosa-specials"
                className="group flex h-[420px] w-full flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-brass/40 p-8 text-center transition hover:border-burnt"
              >
                <span className="font-display text-5xl text-brass">🌯</span>
                <p className="font-display text-3xl font-semibold text-cream">See Every Dosa</p>
                <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-burnt">
                  Full Dosa Menu <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
