"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

export function StartupIntro() {
  const [visible, setVisible] = useState(true);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const submarkSrc = `${basePath}/brand/ayodhya-submark-loader.webp`;
  const wordmarkSrc = `${basePath}/brand/ayodhya-hero-logo.webp`;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = previousOverflow;
    }, 3200);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const sparks = [
    { left: "12%", top: "30%", delay: 0.35, size: 4 },
    { left: "21%", top: "67%", delay: 1.1, size: 3 },
    { left: "34%", top: "15%", delay: 0.8, size: 4 },
    { left: "68%", top: "16%", delay: 1.45, size: 3 },
    { left: "80%", top: "37%", delay: 0.55, size: 5 },
    { left: "83%", top: "70%", delay: 1.75, size: 3 },
    { left: "61%", top: "84%", delay: 0.95, size: 4 },
    { left: "39%", top: "82%", delay: 1.95, size: 3 },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[140] flex items-center justify-center overflow-hidden bg-[#2a0f07]"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.018,
            filter: "blur(3px)",
            transition: { duration: 0.72, ease: EASE },
          }}
          aria-label="Ayodhya Restaurant intro"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(238,184,75,.18),transparent_23%),radial-gradient(circle_at_50%_50%,rgba(118,45,12,.42),transparent_60%),linear-gradient(180deg,#481d0d_0%,#2a0f07_100%)]" />

          <motion.div
            className="absolute h-[360px] w-[360px] rounded-full bg-[#d6a84b]/12 blur-[95px] sm:h-[520px] sm:w-[520px]"
            initial={{ opacity: 0, scale: 0.65 }}
            animate={{ opacity: [0, 0.75, 0.38], scale: [0.65, 1.1, 0.94] }}
            transition={{ duration: 4.4, ease: EASE }}
          />

          <div className="relative flex h-[330px] w-[330px] items-center justify-center sm:h-[470px] sm:w-[470px]">
            <motion.svg
              viewBox="0 0 420 420"
              className="absolute inset-0 h-full w-full"
              initial={{ opacity: 0, rotate: -22, scale: 0.82 }}
              animate={{ opacity: 1, rotate: 10, scale: 1 }}
              transition={{ duration: 1.4, ease: EASE }}
              aria-hidden="true"
            >
              <defs>
                <filter id="goldGlow">
                  <feGaussianBlur stdDeviation="3.4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <motion.circle
                cx="210"
                cy="210"
                r="158"
                fill="none"
                stroke="rgba(245,197,98,.92)"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#goldGlow)"
                strokeDasharray="993"
                initial={{ strokeDashoffset: 993, opacity: 0 }}
                animate={{ strokeDashoffset: 0, opacity: [0, 1, 0.82] }}
                transition={{ duration: 1.8, ease: EASE }}
              />
              <motion.circle
                cx="210"
                cy="210"
                r="137"
                fill="none"
                stroke="rgba(214,168,75,.55)"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeDasharray="860"
                initial={{ strokeDashoffset: -860, opacity: 0 }}
                animate={{ strokeDashoffset: 0, opacity: [0, 0.85, 0.5] }}
                transition={{ delay: 0.18, duration: 1.9, ease: EASE }}
              />
              <motion.circle
                cx="210"
                cy="210"
                r="177"
                fill="none"
                stroke="rgba(255,219,128,.2)"
                strokeWidth="1"
                strokeDasharray="5 11"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.65, 0.22] }}
                transition={{ delay: 0.55, duration: 2.2, ease: "easeInOut" }}
              />
            </motion.svg>

            <motion.div
              className="absolute inset-[4%]"
              initial={{ rotate: -30, opacity: 0 }}
              animate={{ rotate: 360, opacity: 1 }}
              transition={{
                rotate: { duration: 4.2, ease: "easeInOut" },
                opacity: { delay: 0.55, duration: 0.4 },
              }}
            >
              <span className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#ffe08a] shadow-[0_0_22px_8px_rgba(255,201,86,.62)]" />
            </motion.div>

            <motion.div
              className="absolute inset-[11%]"
              animate={{ rotate: -360 }}
              transition={{ duration: 7.5, repeat: Infinity, ease: "linear" }}
            >
              <span className="absolute left-[16%] top-[4%] h-2 w-2 rounded-full bg-[#f0b94f] shadow-[0_0_10px_rgba(240,185,79,.8)]" />
              <span className="absolute bottom-[9%] right-[12%] h-1.5 w-1.5 rounded-full bg-[#ffe08a] shadow-[0_0_8px_rgba(255,224,138,.8)]" />
            </motion.div>

            {sparks.map((spark, index) => (
              <motion.span
                key={index}
                className="absolute rounded-full bg-[#ffd56f] shadow-[0_0_10px_rgba(255,213,111,.8)]"
                style={{ left: spark.left, top: spark.top, width: spark.size, height: spark.size }}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: [0, 1, 0.1], scale: [0.3, 1.6, 0.7], y: [0, -7, 0] }}
                transition={{
                  delay: spark.delay,
                  duration: 1.55,
                  repeat: 1,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            ))}

            <motion.div
              className="relative z-10 h-[55%] w-[55%] overflow-hidden rounded-full border border-[#e3b55b]/22 bg-[#471a0b] shadow-[0_22px_75px_rgba(0,0,0,.36),0_0_45px_rgba(219,165,68,.15)]"
              initial={{ opacity: 0, scale: 0.52, rotate: -7, filter: "blur(12px)" }}
              animate={{
                opacity: 1,
                scale: [0.52, 1.08, 0.98, 1],
                rotate: 0,
                filter: "blur(0px)",
              }}
              transition={{
                opacity: { delay: 0.34, duration: 0.55 },
                scale: { delay: 0.34, duration: 1.65, ease: EASE },
                rotate: { delay: 0.34, duration: 1.2, ease: EASE },
                filter: { delay: 0.34, duration: 0.72 },
              }}
            >
              <img
                src={submarkSrc}
                alt="Ayodhya Restaurant submark"
                className="h-full w-full object-cover"
                draggable={false}
              />
              <motion.span
                className="pointer-events-none absolute -inset-y-10 w-12 rotate-[20deg] bg-gradient-to-r from-transparent via-[#fff0b6]/42 to-transparent blur-md"
                initial={{ x: -140, opacity: 0 }}
                animate={{ x: 240, opacity: [0, 1, 0] }}
                transition={{ delay: 1.15, duration: 1.35, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.div
              className="absolute inset-[20%] rounded-full border border-[#f0bf62]/16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0.9, 1.32, 1.48] }}
              transition={{ delay: 2.25, duration: 1.25, ease: "easeOut" }}
            />
          </div>

          <motion.div
            className="absolute bottom-[8%] flex flex-col items-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.65, ease: EASE }}
          >
            <img
              src={wordmarkSrc}
              alt="Ayodhya Restaurant"
              className="h-16 w-auto object-contain opacity-90 sm:h-20"
              draggable={false}
            />
            <motion.div
              className="mt-3 h-px w-40 bg-gradient-to-r from-transparent via-[#d6a84b] to-transparent sm:w-56"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: [0, 0.9, 0.35], scaleX: [0, 1, 1.12] }}
              transition={{ delay: 1.25, duration: 1.05, ease: EASE }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export function RouteLoader() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const submarkSrc = `${basePath}/brand/ayodhya-submark-loader.webp`;
  const wordmarkSrc = `${basePath}/brand/ayodhya-hero-logo.webp`;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-[#2a0f07]"
      aria-label="Loading Ayodhya Restaurant"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,168,75,.13),transparent_30%)]" />
      <div className="relative flex h-52 w-52 items-center justify-center sm:h-60 sm:w-60">
        <motion.svg
          viewBox="0 0 240 240"
          className="absolute inset-0 h-full w-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        >
          <circle cx="120" cy="120" r="101" fill="none" stroke="rgba(214,168,75,.3)" strokeWidth="1.2" />
          <circle cx="120" cy="120" r="89" fill="none" stroke="rgba(245,197,98,.55)" strokeWidth="1.5" strokeDasharray="8 14" />
        </motion.svg>
        <motion.div
          className="absolute inset-[7%]"
          animate={{ rotate: 360 }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#ffe08a] shadow-[0_0_16px_5px_rgba(255,201,86,.55)]" />
        </motion.div>
        <motion.div
          className="relative z-10 h-32 w-32 overflow-hidden rounded-full border border-brass/20 bg-[#471a0b] shadow-[0_16px_50px_rgba(0,0,0,.32)] sm:h-36 sm:w-36"
          animate={{ scale: [0.95, 1.035, 0.95] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={submarkSrc} alt="Ayodhya Restaurant submark" className="h-full w-full object-cover" draggable={false} />
        </motion.div>
        <motion.img
          src={wordmarkSrc}
          alt="Ayodhya Restaurant"
          className="absolute -bottom-16 h-14 w-auto object-contain opacity-90 sm:-bottom-20 sm:h-16"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5, ease: EASE }}
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
