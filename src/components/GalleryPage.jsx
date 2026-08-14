"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, Img } from "@/components/primitives";
import Lightbox from "@/components/Lightbox";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Food", "Restaurant", "Dosa Specials", "Beverages", "Guests", "Events"];
const HEIGHTS = ["h-72", "h-96", "h-64", "h-80", "h-72", "h-88"];

export default function GalleryPage({ images }) {
  const [cat, setCat] = useState("All");
  const [index, setIndex] = useState(null);

  const visible = useMemo(
    () => (cat === "All" ? images : images.filter((g) => g.category === cat)),
    [images, cat],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition",
              cat === c
                ? "border-charcoal bg-charcoal text-soft"
                : "border-sand bg-soft text-walnut hover:border-walnut",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cat}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-10 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4"
        >
          {visible.map((g, i) => (
            <Reveal key={g.id} delay={(i % 4) * 0.04}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "group relative block w-full overflow-hidden rounded-2xl ring-1 ring-sand/60 transition hover:ring-brass/60",
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
                  <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-brass">{g.category}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </motion.div>
      </AnimatePresence>

      {index !== null && (
        <Lightbox items={visible} index={index} onChange={setIndex} onClose={() => setIndex(null)} />
      )}
    </div>
  );
}
