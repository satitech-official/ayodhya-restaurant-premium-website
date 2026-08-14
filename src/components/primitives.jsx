"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1];

export function Reveal({ children, className, delay = 0, y = 28, once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "dark",
  align = "left",
  className,
}) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <div
            className={cn(
              "mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em]",
              align === "center" && "justify-center",
              dark ? "text-terracotta" : "text-burnt",
            )}
          >
            <span className="h-px w-8 bg-current opacity-60" />
            {eyebrow}
            {align === "center" && <span className="h-px w-8 bg-current opacity-60" />}
          </div>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2
          className={cn(
            "text-balance text-4xl leading-[1.05] sm:text-5xl lg:text-6xl",
            dark ? "text-charcoal" : "text-soft",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "mt-5 text-base leading-relaxed sm:text-lg",
              dark ? "text-walnut/90" : "text-cream/70",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

function fallbackForAlt(alt = "") {
  return /restaurant|interior|dining|ambience|table|guest|family|room/i.test(String(alt))
    ? "/images/fallback-restaurant.svg"
    : "/images/fallback-food.svg";
}

export function Img({ src, alt, className, width, height, eager = false, sizes, fallbackSrc }) {
  const fallback = fallbackSrc || fallbackForAlt(alt);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || fallback}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      width={width}
      height={height}
      sizes={sizes}
      referrerPolicy="no-referrer"
      onError={(event) => {
        const node = event.currentTarget;
        if (node.dataset.fallbackApplied === "1") return;
        node.dataset.fallbackApplied = "1";
        node.src = fallback;
      }}
      className={className}
    />
  );
}

export function ArchImage({
  src,
  alt,
  className,
  imgClassName,
  variant = "arch",
  ratio = "aspect-[4/5]",
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-espresso",
        ratio,
        variant === "arch" && "clip-arch",
        variant === "arch-round" && "clip-arch-round",
        variant === "window" && "clip-window",
        className,
      )}
    >
      <Img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105",
          imgClassName,
        )}
        sizes="(min-width: 1024px) 40vw, 90vw"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
    </div>
  );
}

export function VegDot({ className }) {
  return (
    <span
      title="Vegetarian"
      aria-label="Vegetarian"
      className={cn(
        "inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border-[2px] border-[#2e7d32] bg-white",
        className,
      )}
    >
      <span className="h-[7px] w-[7px] rounded-full bg-[#2e7d32]" />
    </span>
  );
}

export function Spicy({ level = 0, className }) {
  if (!level || level < 1) return null;
  const labels = { 1: "Mild", 2: "Medium", 3: "Spicy", 4: "Fiery" };
  return (
    <span
      className={cn("inline-flex items-center gap-1 text-[11px] font-semibold text-terracotta", className)}
      title={`Spice level: ${labels[level] || "Spicy"}`}
    >
      <span className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: Math.min(4, level) }).map((_, i) => (
          <Flame key={i} className="h-3 w-3 fill-current" />
        ))}
      </span>
      <span>{labels[level] || "Spicy"}</span>
    </span>
  );
}

export function Tag({ children, tone = "brass", className }) {
  const tones = {
    brass: "border-brass/40 bg-brass/10 text-brass",
    terracotta: "border-terracotta/40 bg-terracotta/10 text-terracotta",
    cream: "border-cream/25 bg-cream/10 text-cream",
    green: "border-[#2e7d32]/40 bg-[#2e7d32]/10 text-[#2e7d32]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function BrassDivider({ className, center = true }) {
  return (
    <div className={cn("flex items-center gap-3", center && "justify-center", className)}>
      <span className="h-px w-14 bg-brass/50" />
      <span className="h-1.5 w-1.5 rotate-45 bg-brass" />
      <span className="h-px w-14 bg-brass/50" />
    </div>
  );
}
