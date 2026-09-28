"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function StartupIntro() {
  const [visible, setVisible] = useState(true);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

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
          className="fixed inset-0 z-[140] flex items-center justify-center overflow-hidden bg-[#32170c]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }}
          aria-label="Ayodhya Restaurant intro"
        >
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,147,60,.12),transparent_48%)]"
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.img
            src={`${basePath}/brand/ayodhya-full-logo.jpg`}
            alt="Ayodhya Restaurant — Where Taste Meets Tradition"
            className="relative z-10 w-[min(90vw,860px)] select-none rounded-[1.6rem] object-contain shadow-[0_30px_100px_rgba(0,0,0,.34)]"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: [0.96, 1.02, 1] }}
            transition={{
              opacity: { duration: 0.7 },
              scale: { duration: 4.2, ease: [0.22, 1, 0.36, 1] },
            }}
            draggable={false}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function RouteLoader() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-[#32170c]"
      aria-label="Loading Ayodhya Restaurant"
    >
      <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
        <motion.span
          className="absolute inset-0 rounded-full border border-brass/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
        />
        <motion.span
          className="absolute inset-3 rounded-full border border-dashed border-brass/25"
          animate={{ rotate: -360 }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "linear" }}
        />
        <motion.span
          className="absolute inset-7 rounded-full bg-brass/5 blur-xl"
          animate={{ scale: [0.92, 1.12, 0.92], opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={`${basePath}/brand/ayodhya-submark.jpg`}
          alt="Ayodhya Restaurant submark"
          className="relative z-10 h-28 w-28 select-none rounded-full object-cover sm:h-32 sm:w-32"
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
