"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { FULL_LOGO_DATA_URI, SUBMARK_DATA_URI } from "@/lib/brandAssets";

const EASE = [0.22, 1, 0.36, 1];

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
          className="fixed inset-0 z-[140] flex items-center justify-center overflow-hidden bg-[#2d1209]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.015, transition: { duration: 0.7, ease: EASE } }}
          aria-label="Ayodhya Restaurant intro"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(211,164,76,.14),transparent_34%),linear-gradient(180deg,#3a190d_0%,#2a1008_100%)]" />

          <motion.div
            className="absolute h-[420px] w-[420px] rounded-full border border-brass/10 sm:h-[560px] sm:w-[560px]"
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{ opacity: [0, 0.55, 0.18], scale: [0.72, 1, 1.08], rotate: 18 }}
            transition={{ duration: 4.1, ease: EASE }}
          />
          <motion.div
            className="absolute h-[330px] w-[330px] rounded-full border border-dashed border-brass/15 sm:h-[450px] sm:w-[450px]"
            initial={{ opacity: 0, rotate: -20 }}
            animate={{ opacity: [0, 0.42, 0.16], rotate: 35 }}
            transition={{ duration: 4.1, ease: EASE }}
          />

          <motion.div
            className="relative z-10 flex w-[92vw] max-w-[900px] items-center justify-center overflow-hidden"
            initial={{ opacity: 0, y: 18, scale: 0.9, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: [0.96, 1.015, 1], filter: "blur(0px)" }}
            transition={{
              opacity: { duration: 0.7 },
              y: { duration: 0.8, ease: EASE },
              scale: { duration: 4.1, ease: EASE },
              filter: { duration: 0.75 },
            }}
          >
            <img
              src={FULL_LOGO_DATA_URI}
              alt="Ayodhya Restaurant — Where Taste Meets Tradition"
              className="w-full select-none object-contain"
              draggable={false}
            />

            <motion.span
              className="pointer-events-none absolute -inset-y-10 w-28 rotate-[14deg] bg-gradient-to-r from-transparent via-[#ffe5a3]/28 to-transparent blur-md"
              initial={{ x: "-180%" }}
              animate={{ x: "850%" }}
              transition={{ delay: 0.7, duration: 2.5, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.div
            className="absolute bottom-[12%] h-px w-44 overflow-hidden bg-brass/10 sm:w-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6] }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <motion.span
              className="block h-full w-20 bg-gradient-to-r from-transparent via-brass to-transparent"
              initial={{ x: -90 }}
              animate={{ x: 300 }}
              transition={{ delay: 0.8, duration: 2.6, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function RouteLoader() {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-[#2d1209]"
      aria-label="Loading Ayodhya Restaurant"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(211,164,76,.11),transparent_34%)]" />
      <div className="relative flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
        <motion.span
          className="absolute inset-0 rounded-full border border-brass/35"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
        />
        <motion.span
          className="absolute inset-3 rounded-full border border-dashed border-brass/25"
          animate={{ rotate: -360 }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
        />
        <motion.span
          className="absolute inset-7 rounded-full border border-brass/10 bg-brass/5"
          animate={{ scale: [0.94, 1.08, 0.94], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={SUBMARK_DATA_URI}
          alt="Ayodhya Restaurant submark"
          className="relative z-10 h-32 w-32 select-none rounded-full object-cover sm:h-36 sm:w-36"
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: [0.96, 1.04, 0.96] }}
          transition={{
            opacity: { duration: 0.4 },
            scale: { duration: 1.65, repeat: Infinity, ease: "easeInOut" },
          }}
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
    const move = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target;
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
