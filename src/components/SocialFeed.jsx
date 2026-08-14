"use client";

import { InstagramIcon } from "@/components/icons";
import { Reveal, SectionHeading, Img } from "@/components/primitives";
import { RESTAURANT } from "@/lib/constants";

export default function SocialFeed({ images }) {
  const instagram = RESTAURANT.instagramUrl;

  return (
    <section className="relative overflow-hidden bg-espresso py-20 text-soft lg:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            tone="light"
            eyebrow="Follow Along"
            title={`Fresh From ${RESTAURANT.instagramHandle}`}
            description="A glimpse of what we've been serving — dosa reels, sizzling plates and behind-the-scenes moments."
          />
          <Reveal>
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-terracotta to-burnt px-6 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:opacity-90"
            >
              <InstagramIcon className="h-4 w-4" /> Follow on Instagram
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {images.slice(0, 6).map((g, i) => (
            <Reveal key={g.id || i} delay={i * 0.05}>
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-xl ring-1 ring-cream/10"
                aria-label={`View on Instagram: ${g.caption || "Ayodhya Restaurant"}`}
              >
                <Img
                  src={g.image}
                  alt={g.caption || "Ayodhya Restaurant"}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(min-width:1024px) 16vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-charcoal/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <InstagramIcon className="h-6 w-6 text-soft" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
