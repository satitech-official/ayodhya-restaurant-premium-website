"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Lightbox({ items, index, onClose, onChange }) {
  const touchX = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onChange((index - 1 + items.length) % items.length);
      if (e.key === "ArrowRight") onChange((index + 1) % items.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, items.length, onChange, onClose]);

  const current = items[index];
  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] flex items-center justify-center bg-charcoal/95 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) onChange((index + (dx < 0 ? 1 : -1) + items.length) % items.length);
          touchX.current = null;
        }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream transition hover:border-burnt hover:text-burnt"
        >
          <X className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Previous image"
          onClick={(e) => {
            e.stopPropagation();
            onChange((index - 1 + items.length) % items.length);
          }}
          className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/20 text-cream transition hover:border-burnt hover:text-burnt"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next image"
          onClick={(e) => {
            e.stopPropagation();
            onChange((index + 1) % items.length);
          }}
          className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/20 text-cream transition hover:border-burnt hover:text-burnt"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <motion.figure
          key={index}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex max-h-[88vh] max-w-5xl flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.image}
            alt={current.caption || "Ayodhya Restaurant"}
            className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-premium"
            referrerPolicy="no-referrer"
            onError={(event) => {
              const node = event.currentTarget;
              if (node.dataset.fallbackApplied === "1") return;
              node.dataset.fallbackApplied = "1";
              node.src = "/images/fallback-restaurant.svg";
            }}
          />
          {current.caption && (
            <figcaption className="mt-4 flex items-center gap-3 text-sm text-cream/85">
              <span className="h-px w-8 bg-brass" />
              {current.caption}
              <span className="h-px w-8 bg-brass" />
            </figcaption>
          )}
          <span className="mt-2 text-xs text-cream/50">
            {index + 1} / {items.length}
          </span>
        </motion.figure>
      </motion.div>
    </AnimatePresence>
  );
}
