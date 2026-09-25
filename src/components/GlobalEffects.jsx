"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { LogoLockup, LogoMark } from "@/components/Logo";

export function PageLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-charcoal text-soft"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.015,
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
          }}
          aria-hidden="true"
        >
          <div className="pattern-jaali-light absolute inset-0 opacity-[0.055]" />
          <motion.div
            className="absolute h-[420px] w-[420px] rounded-full bg-brass/5 blur-[110px]"
            animate={{ scale: [0.9, 1.12, 0.9], opacity: [0.35, 0.75, 0.35] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative flex flex-col items-center justify-center px-6 text-center">
            <div className="relative flex h-40 w-40 items-center justify-center sm:h-44 sm:w-44">
              <motion.span
                className="absolute inset-0 rounded-full border border-brass/25"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                className="absolute inset-3 rounded-full border border-dashed border-brass/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 13, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                className="absolute inset-7 rounded-full border border-burnt/25 bg-gradient-to-br from-brass/10 via-transparent to-burnt/10"
                animate={{ scale: [1, 1.06, 1], opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-charcoal/75 shadow-[0_0_60px_rgba(201,147,60,.18)] backdrop-blur-md"
                initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.045, 1],
                  rotate: 0,
                }}
                transition={{
                  opacity: { duration: 0.5 },
                  rotate: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                  scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <LogoMark className="h-16 w-16 sm:h-[70px] sm:w-[70px]" />
                </motion.div>
              </motion.div>

              <motion.span
                className="absolute bottom-2 h-1.5 w-1.5 rounded-full bg-burnt shadow-[0_0_14px_rgba(214,168,75,.8)]"
                animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.35, 0.8] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <motion.div
              className="mt-7"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              <LogoLockup dark />
            </motion.div>

            <div className="relative mt-6 h-px w-48 overflow-hidden bg-cream/10 sm:w-56">
              <motion.span
                className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-transparent via-brass to-transparent"
                initial={{ x: -90 }}
                animate={{ x: 260 }}
                transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <motion.p
              className="mt-4 text-[9px] font-semibold uppercase tracking-[0.34em] text-cream/45 sm:text-[10px]"
              animate={{ opacity: [0.35, 0.9, 0.35] }}
              transition={{ duration: 1.65, repeat: Infinity, ease: "easeInOut" }}
            >
              Preparing your dining experience
            </motion.p>
          </div>
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
