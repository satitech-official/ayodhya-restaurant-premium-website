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

  const sparks = [
    { x: "-39%", y: "-28%", s: 5, d: 0.1 },
    { x: "38%", y: "-24%", s: 4, d: 0.5 },
    { x: "-44%", y: "18%", s: 3, d: 0.9 },
    { x: "42%", y: "23%", s: 5, d: 1.2 },
    { x: "-26%", y: "41%", s: 4, d: 0.3 },
    { x: "25%", y: "42%", s: 3, d: 1.5 },
    { x: "-9%", y: "-45%", s: 3, d: 0.7 },
    { x: "9%", y: "46%", s: 4, d: 1.0 },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[140] flex items-center justify-center overflow-hidden bg-[#2b1007]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.7, ease: EASE } }}
          aria-label="Ayodhya Restaurant intro"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_47%,rgba(225,173,72,.17),transparent_27%),radial-gradient(circle_at_center,rgba(116,45,14,.4),transparent_62%),linear-gradient(180deg,#421b0c_0%,#2b1007_100%)]" />

          <motion.div
            className="absolute h-[380px] w-[380px] rounded-full bg-brass/10 blur-[95px] sm:h-[520px] sm:w-[520px]"
            animate={{ scale: [0.82, 1.08, 0.92], opacity: [0.3, 0.72, 0.38] }}
            transition={{ duration: 4.5, ease: "easeInOut" }}
          />

          <div className="relative flex h-[320px] w-[320px] items-center justify-center sm:h-[430px] sm:w-[430px]">
            <motion.span
              className="absolute inset-[7%] rounded-full border-[2px] border-[#e6b65d]/45 shadow-[0_0_28px_rgba(224,167,68,.22)]"
              initial={{ opacity: 0, scale: 0.7, rotate: -35 }}
              animate={{ opacity: [0, 1, 0.72], scale: [0.7, 1, 1.035], rotate: 325 }}
              transition={{ duration: 4.5, ease: EASE }}
            />

            <motion.span
              className="absolute inset-[13%] rounded-full border border-[#f2c96c]/65"
              initial={{ opacity: 0, rotate: 50 }}
              animate={{ opacity: [0, 0.85, 0.55], rotate: -310 }}
              transition={{ duration: 4.5, ease: EASE }}
            />

            <motion.span
              className="absolute inset-[1%] rounded-full border border-dashed border-[#d6a84b]/30"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: [0, 0.6, 0.25], rotate: 220 }}
              transition={{ duration: 4.5, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute inset-[5%] rounded-full"
              style={{
                background:
                  "conic-gradient(from 20deg, transparent 0deg 72deg, rgba(255,213,111,.96) 78deg 83deg, transparent 90deg 204deg, rgba(255,197,71,.9) 211deg 216deg, transparent 224deg 360deg)",
                filter: "blur(.3px)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
              className="absolute inset-[10%] rounded-full"
              style={{
                background:
                  "conic-gradient(from 220deg, transparent 0deg 106deg, rgba(255,226,143,.9) 112deg 116deg, transparent 122deg 284deg, rgba(255,196,61,.85) 289deg 293deg, transparent 300deg 360deg)",
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
            />

            {sparks.map((spark, index) => (
              <motion.span
                key={index}
                className="absolute rounded-full bg-[#ffd875] shadow-[0_0_12px_#e3a73e]"
                style={{
                  width: spark.s,
                  height: spark.s,
                  left: `calc(50% + ${spark.x})`,
                  top: `calc(50% + ${spark.y})`,
                }}
                animate={{
                  opacity: [0.1, 1, 0.15],
                  scale: [0.6, 1.55, 0.7],
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 1.7 + index * 0.08,
                  delay: spark.d,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}

            <motion.div
              className="absolute inset-[21%] rounded-full bg-[#4a1b0b]/72 shadow-[0_0_45px_rgba(235,181,80,.18)] backdrop-blur-[1px]"
              initial={{ opacity: 0, scale: 0.62 }}
              animate={{ opacity: 1, scale: [0.84, 1.03, 1] }}
              transition={{ duration: 1.35, ease: EASE }}
            />

            <motion.img
              src={SUBMARK_DATA_URI}
              alt="Ayodhya Restaurant submark"
              className="relative z-10 h-[48%] w-[48%] select-none rounded-full object-cover"
              initial={{ opacity: 0, scale: 0.58, rotate: -5, filter: "blur(7px)" }}
              animate={{
                opacity: 1,
                scale: [0.86, 1.045, 1],
                rotate: 0,
                filter: "blur(0px)",
              }}
              transition={{
                opacity: { duration: 0.55 },
                scale: { duration: 2.3, ease: EASE },
                rotate: { duration: 1.15, ease: EASE },
                filter: { duration: 0.65 },
              }}
              draggable={false}
            />

            <motion.span
              className="pointer-events-none absolute z-20 h-[58%] w-10 rotate-[22deg] bg-gradient-to-r from-transparent via-[#ffe9a8]/40 to-transparent blur-md"
              initial={{ x: -150, opacity: 0 }}
              animate={{ x: 170, opacity: [0, 0.9, 0] }}
              transition={{ delay: 0.9, duration: 1.8, ease: "easeInOut" }}
            />
          </div>

          <motion.div
            className="absolute bottom-[11%] flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 0.75, 0.45], y: 0 }}
            transition={{ delay: 1.25, duration: 1.2, ease: EASE }}
          >
            <span className="h-px w-36 bg-gradient-to-r from-transparent via-brass to-transparent sm:w-52" />
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
