"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function PageLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-charcoal text-soft"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          aria-hidden="true"
        >
          <div className="relative flex h-24 w-24 items-center justify-center">
            <motion.span
              className="absolute inset-0 rounded-full border border-brass/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <span className="absolute inset-3 rounded-full border border-brass/30" />
            <motion.span
              className="absolute inset-6 rounded-full border border-burnt/60"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative flex flex-col items-center">
              <span className="h-1 w-1 rounded-full bg-burnt animate-steam" />
              <span className="h-1 w-1 rounded-full bg-burnt animate-steam [animation-delay:0.5s]" />
            </span>
          </div>
          <p className="mt-8 font-display text-3xl font-semibold tracking-[0.3em]">AYODHYA</p>
          <motion.p
            className="mt-3 text-xs uppercase tracking-[0.3em] text-cream/50"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Preparing your experience…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!mq.matches || reduce) return undefined;

    setEnabled(true);
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target;
      const magnetic =
        target instanceof Element &&
        Boolean(target.closest("[data-cursor-magnetic], a, button"));
      setActive(Boolean(magnetic));
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="relative -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: active ? 1.6 : 1, opacity: active ? 0.9 : 0.7 }}
        transition={{ duration: 0.25 }}
      >
        <span className="block h-6 w-6 rounded-full border border-brass/70 bg-brass/10" />
      </motion.div>
    </motion.div>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-24 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-brass/40 bg-charcoal text-soft shadow-premium md:bottom-6 md:right-6"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
