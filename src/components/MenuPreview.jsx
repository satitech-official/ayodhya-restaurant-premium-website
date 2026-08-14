"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/primitives";
import DishCard from "@/components/DishCard";
import { cn } from "@/lib/utils";

export default function MenuPreview({ items, categories }) {
  const [cat, setCat] = useState("recommended");
  const safeCategories = Array.from(
    new Map(
      (categories || [])
        .filter((c) => c?.slug && c.slug !== "recommended" && c.slug !== "all")
        .map((c) => [c.slug, c]),
    ).values(),
  );
  const visible =
    cat === "recommended" ? items.filter((i) => i.recommended).slice(0, 8) : items.filter((i) => i.category === cat).slice(0, 8);

  return (
    <section className="relative overflow-hidden bg-soft py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="From the Menu"
            title="One Table. Many Cravings."
            description="A glimpse across our counters — North Indian, South Indian, Indo-Chinese, pizzas, shakes and more."
          />
          <Reveal>
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-charcoal transition hover:border-terracotta hover:text-terracotta"
            >
              Full Digital Menu <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[{ slug: "recommended", name: "⭐ Recommended" }, ...safeCategories].map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCat(c.slug)}
                aria-pressed={cat === c.slug}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition",
                  cat === c.slug
                    ? "border-charcoal bg-charcoal text-soft"
                    : "border-sand bg-cream text-walnut hover:border-walnut",
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
