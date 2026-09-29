"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";

export default function VideoGallery({ videos = [] }) {
  const [active, setActive] = useState(null);

  if (!videos.length) return null;

  return (
    <section className="mt-16 border-t border-sand/70 pt-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-terracotta">
            <span className="h-px w-7 bg-current opacity-60" /> Videos
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
            Ayodhya in Motion.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-walnut/85">
            A closer look at the kitchen, signature preparations and the restaurant experience.
          </p>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-walnut/55">
          Tap any video to watch
        </p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {videos.map((video, index) => (
          <motion.button
            key={video.src}
            type="button"
            onClick={() => setActive(index)}
            className="group relative aspect-[9/14] overflow-hidden rounded-[1.6rem] bg-charcoal ring-1 ring-sand/70 focus:outline-none focus:ring-2 focus:ring-brass"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <video
              src={video.src}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/5 to-charcoal/10" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-left">
              <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-cream/25 bg-charcoal/35 text-cream backdrop-blur">
                <Play className="h-4 w-4 fill-current" />
              </span>
              <p className="font-display text-lg text-cream">{video.title}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brass">
                {video.label}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && videos[active] && (
          <motion.div
            className="fixed inset-0 z-[160] flex items-center justify-center bg-charcoal/92 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="relative w-full max-w-[430px] overflow-hidden rounded-[1.8rem] border border-cream/10 bg-black shadow-2xl"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur transition hover:bg-black/70"
                aria-label="Close video"
              >
                <X className="h-5 w-5" />
              </button>
              <video
                key={videos[active].src}
                src={videos[active].src}
                controls
                autoPlay
                playsInline
                className="max-h-[82vh] w-full bg-black object-contain"
              />
              <div className="bg-[#2e140b] px-5 py-4">
                <p className="font-display text-xl text-cream">{videos[active].title}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brass">
                  {videos[active].label}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
