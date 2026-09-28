"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

export function StartupIntro() {
  const [visible, setVisible] = useState(true);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const submarkSrc = `${basePath}/brand/ayodhya-submark.jpg`;

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
          className="fixed inset-0 z-[140] flex items-center justify-center overflow-hidden bg-[#2c1108]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.015, transition: { duration: 0.7, ease: EASE } }}
          aria-label="Ayodhya Restaurant intro"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(214,168,75,.18),transparent_25%),linear-gradient(180deg,#421b0d_0%,#2c1108_100%)]" />

          <motion.div
            className="absolute h-[390px] w-[390px] rounded-full bg-[#d6a84b]/10 blur-[90px] sm:h-[520px] sm:w-[520px]"
            animate={{ scale: [0.9, 1.1, 0.96], opacity: [0.3, 0.72, 0.34] }}
            transition={{ duration: 4.3, ease: "easeInOut" }}
          />

          <div className="relative flex h-[330px] w-[330px] items-center justify-center sm:h-[430px] sm:w-[430px]">
            <motion.span
              className="absolute inset-[5%] rounded-full border border-[#e7b85c]/35"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: [0, 0.75, 0.28], scale: [0.7, 1, 1.08] }}
              transition={{ duration: 4.2, ease: EASE }}
            />
            <motion.span
              className="absolute inset-[13%] rounded-full border border-[#f2cc72]/55"
              initial={{ opacity: 0, scale: 0.78 }}
              animate={{ opacity: [0, 0.9, 0.42], scale: [0.78, 1, 1.03] }}
              transition={{ delay: 0.12, duration: 4, ease: EASE }}
            />
            <motion.span
              className="absolute inset-[20%] rounded-full border border-[#d6a84b]/20"
              animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.98, 1.04, 0.98] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute inset-[8%]"
              animate={{ rotate: 360 }}
              transition={{ duration: 5.4, repeat: Infinity, ease: "linear" }}
            >
              <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-[#ffd978] shadow-[0_0_18px_6px_rgba(255,207,102,.55)]" />
            </motion.div>

            <motion.div
              className="relative z-10 h-[58%] w-[58%] overflow-hidden rounded-[2.1rem] border border-[#e0ad4e]/20 bg-[#4b1d0c]/80 shadow-[0_18px_60px_rgba(0,0,0,.28)]"
              initial={{ opacity: 0, scale: 0.62, y: 12, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: [0.88, 1.04, 1], y: 0, filter: "blur(0px)" }}
              transition={{
                opacity: { duration: 0.55 },
                scale: { duration: 2.1, ease: EASE },
                y: { duration: 0.85, ease: EASE },
                filter: { duration: 0.65 },
              }}
            >
              <img
                src={submarkSrc}
                alt="Ayodhya Restaurant submark"
                className="absolute inset-0 h-full w-full scale-[2.65] object-cover"
                draggable={false}
              />
              <motion.span
                className="pointer-events-none absolute -inset-y-6 w-10 rotate-[18deg] bg-gradient-to-r from-transparent via-[#ffe7a2]/38 to-transparent blur-md"
                initial={{ x: -110, opacity: 0 }}
                animate={{ x: 230, opacity: [0, 0.95, 0] }}
                transition={{ delay: 0.9, duration: 1.55, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.div
              className="absolute bottom-[8%] h-px w-36 bg-gradient-to-r from-transparent via-[#d6a84b] to-transparent sm:w-48"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: [0, 0.9, 0.45], scaleX: 1 }}
              transition={{ delay: 1.15, duration: 1.1, ease: EASE }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export function RouteLoader() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const submarkSrc = `${basePath}/brand/ayodhya-submark.jpg`;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-[#2c1108]"
      aria-label="Loading Ayodhya Restaurant"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,168,75,.14),transparent_30%)]" />
      <div className="relative flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
        <motion.span
          className="absolute inset-0 rounded-full border border-brass/30"
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.35, 0.8, 0.35] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute inset-4 rounded-full border border-brass/45"
          animate={{ scale: [1.04, 0.98, 1.04], opacity: [0.55, 0.22, 0.55] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-1"
          animate={{ rotate: 360 }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#ffd978] shadow-[0_0_14px_5px_rgba(255,207,102,.5)]" />
        </motion.div>
        <motion.div
          className="relative z-10 h-32 w-32 overflow-hidden rounded-[1.7rem] border border-brass/20 bg-[#4b1d0c]/80 sm:h-36 sm:w-36"
          animate={{ scale: [0.96, 1.03, 0.96] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={submarkSrc}
            alt="Ayodhya Restaurant submark"
            className="absolute inset-0 h-full w-full scale-[2.65] object-cover"
            draggable={false}
          />
        </motion.div>
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
