"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { FULL_LOGO_DATA_URI, SUBMARK_DATA_URI } from "@/lib/brandAssets";

export function StartupIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = previousOverflow;
    }, 4500);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[140] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#32170c" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          aria-label="Ayodhya Restaurant"
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 42%, rgba(201,147,60,.10), transparent 34%), linear-gradient(180deg, #3a190d 0%, #2a1008 100%)",
            }}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.72, 1, 0.72] }}
            transition={{ duration: 4.5, ease: "easeInOut" }}
          />
          <motion.img
            src={FULL_LOGO_DATA_URI}
            alt="Ayodhya Restaurant — Where Taste Meets Tradition"
            className="relative z-10 w-[86vw] max-w-[620px] select-none object-contain"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 54%, rgba(0,0,0,.94) 66%, transparent 86%)",
              maskImage:
                "radial-gradient(ellipse at center, black 54%, rgba(0,0,0,.94) 66%, transparent 86%)",
            }}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: [0.96, 1.015, 1] }}
            transition={{
              opacity: { duration: 0.8 },
              scale: { duration: 4.1, ease: [0.22, 1, 0.36, 1] },
            }}
            draggable={false}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function RouteLoader() {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#32170c" }}
      aria-label="Loading Ayodhya Restaurant"
    >
      <div className="relative flex h-44 w-44 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full border border-brass/35"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
        />
        <motion.span
          className="absolute inset-3 rounded-full border border-dashed border-brass/25"
          animate={{ rotate: -360 }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-6 rounded-full bg-brass/5 blur-xl"
          animate={{ scale: [0.92, 1.12, 0.92], opacity: [0.35, 0.8, 0.35] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={SUBMARK_DATA_URI}
          alt="Ayodhya Restaurant submark"
          className="relative z-10 h-28 w-28 select-none object-cover"
          style={{
            WebkitMaskImage: "radial-gradient(circle, black 48%, transparent 76%)",
            maskImage: "radial-gradient(circle, black 48%, transparent 76%)",
          }}
          animate={{ scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
          draggable={false}
        />
      </div>
    </div>
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
