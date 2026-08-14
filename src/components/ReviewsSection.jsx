"use client";

import { Star, Quote, ExternalLink } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/primitives";
import { RESTAURANT } from "@/lib/constants";

const GOOGLE_REVIEW_URL =
  "https://www.google.com/search?q=Ayodhya+Restaurant+Betul+reviews";
const GOOGLE_MAPS_URL = RESTAURANT.mapsDirectionsUrl;

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? "fill-brass text-brass" : "text-sand"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection({ reviews }) {
  const items = reviews || [];

  return (
    <section id="reviews" className="relative overflow-hidden bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Guest Love"
          title="Loved Around Betul"
          description="Honest words from our guests — shared with their permission."
        />

        {items.length === 0 ? (
          <Reveal>
            <div className="mt-12 flex flex-col items-center gap-6 rounded-[2rem] border border-dashed border-sand bg-soft/60 p-10 text-center">
              <Quote className="h-8 w-8 text-brass" />
              <p className="max-w-lg text-base text-walnut">
                Reviews are shared by our guests as they come in — check back soon, or be the first
                to tell Betul about your meal.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={GOOGLE_REVIEW_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-espresso"
                >
                  Leave a Google Review <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-charcoal transition hover:border-terracotta hover:text-terracotta"
                >
                  Read More Reviews
                </a>
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 6).map((r, i) => (
              <Reveal key={r.id} delay={i * 0.06} className="h-full">
                <figure className="flex h-full flex-col rounded-[2rem] bg-soft p-7 shadow-soft ring-1 ring-sand/60">
                  <div className="flex items-center justify-between">
                    <StarRow rating={r.rating} />
                    <Quote className="h-6 w-6 text-brass/40" />
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-espresso">
                    “{r.review}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center justify-between border-t border-sand pt-4">
                    <div>
                      <p className="text-sm font-bold text-charcoal">{r.name}</p>
                      <p className="text-xs text-walnut/70">
                        {r.source}
                        {r.date ? ` · ${r.date}` : ""}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-burnt"
            >
              Leave a Google Review <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-charcoal transition hover:border-terracotta hover:text-terracotta"
            >
              Read More Reviews
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
