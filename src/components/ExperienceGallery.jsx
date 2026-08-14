"use client";

import { useState } from "react";
import { SectionHeading, Reveal, Img } from "@/components/primitives";
import Lightbox from "@/components/Lightbox";
import { cn } from "@/lib/utils";

const HEIGHTS = ["h-64", "h-80", "h-72", "h-96", "h-64", "h-80"];

export default function ExperienceGallery({ images }) {
  const [index, setIndex] = useState(null);

  return (
    <section className="noise relative overflow-hidden bg-charcoal py-20 text-soft lg:py-28">
      <div className="pattern-jaali-light absolute inset-0 opacity-[0.14]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="light"
          eyebrow="The Ambience"
          title="More Than a Meal"
          description="Warm wood, soft light and long tables — step inside Ayodhya Restaurant before you even arrive."
        />

        <div className="mt-12 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
          {images.slice(0, 12).map((g, i) => (
            <Reveal key={g.id} delay={(i % 4) * 0.05}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "group relative block w-full overflow-hidden rounded-2xl ring-1 ring-cream/10 transition hover:ring-brass/50",
                  HEIGHTS[i % HEIGHTS.length],
                )}
              >
                <Img
                  src={g.image}
                  alt={g.caption || "Ayodhya Restaurant"}
                  className="h-full w-full object-cover transition-transform duration-[1.1s] group-hover:scale-110"
                  sizes="(min-width:1024px) 24vw, (min-width:640px) 33vw, 48vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left text-sm text-cream opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {g.caption}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {index !== null && (
        <Lightbox items={images.slice(0, 12)} index={index} onChange={setIndex} onClose={() => setIndex(null)} />
      )}
    </section>
  );
}
