"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import DishCard from "@/components/DishCard";
import { MENU_FILTERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const GROUPS = {
  veg: (i) => i.vegetarian,
  spicy: (i) => (i.spicyLevel || 0) >= 3,
  popular: (i) => i.bestseller || i.recommended,
  "south-indian": (i) => ["south-indian", "dosa-specials"].includes(i.category),
  "north-indian": (i) =>
    ["north-indian", "paneer-specials", "rice-biryani", "breads"].includes(i.category),
  chinese: (i) => ["chinese", "noodles", "soups-salads"].includes(i.category),
  "quick-bites": (i) =>
    ["sandwiches", "maggi", "starters", "delhi-chaat", "noodles", "pasta"].includes(i.category),
  beverages: (i) => ["beverages", "shakes"].includes(i.category),
};

export default function MenuExplorer({ items, categories, initialCategory = "recommended" }) {
  const [cat, setCat] = useState(initialCategory);
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState([]);
  const safeCategories = useMemo(
    () =>
      Array.from(
        new Map(
          (categories || [])
            .filter((c) => c?.slug && c.slug !== "recommended" && c.slug !== "all")
            .map((c) => [c.slug, c]),
        ).values(),
      ),
    [categories],
  );

  const toggleFilter = (id) =>
    setFilters((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const visible = useMemo(() => {
    let list = items;
    if (cat === "recommended") list = list.filter((i) => i.recommended);
    else if (cat !== "all") list = list.filter((i) => i.category === cat);

    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(needle) ||
          (i.description || "").toLowerCase().includes(needle) ||
          (i.cuisine || "").toLowerCase().includes(needle),
      );
    }

    for (const f of filters) {
      const fn = GROUPS[f];
      if (fn) list = list.filter(fn);
    }
    return list;
  }, [items, cat, q, filters]);

  return (
    <div>
      {/* search + filters */}
      <div className="rounded-[2rem] bg-soft p-5 shadow-soft ring-1 ring-sand/60">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-walnut/60" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search your craving…"
              className="w-full rounded-full border border-sand bg-cream py-3 pl-11 pr-4 text-sm text-espresso placeholder:text-walnut/50 transition focus:border-terracotta focus:outline-none"
            />
          </label>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-walnut">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {MENU_FILTERS.map((f) => {
            const active = filters.includes(f.id);
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => toggleFilter(f.id)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                  active
                    ? "border-terracotta bg-terracotta text-soft"
                    : "border-sand bg-cream text-walnut hover:border-terracotta/50",
                )}
              >
                {f.label}
              </button>
            );
          })}
          {filters.length > 0 && (
            <button
              type="button"
              onClick={() => setFilters([])}
              className="rounded-full px-2 py-1.5 text-xs font-semibold text-terracotta underline-offset-2 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* category tabs */}
      <div className="sticky top-[71px] z-30 -mx-4 mt-8 bg-cream/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[{ slug: "recommended", name: "⭐ Recommended" }, ...safeCategories, { slug: "all", name: "Everything" }].map(
            (c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCat(c.slug)}
                aria-pressed={cat === c.slug}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition",
                  cat === c.slug
                    ? "border-charcoal bg-charcoal text-soft"
                    : "border-sand bg-soft text-walnut hover:border-walnut",
                )}
              >
                {c.name}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-walnut">
        <span>
          {visible.length} {visible.length === 1 ? "dish" : "dishes"}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cat + q + filters.join(",")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {visible.map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
        </motion.div>
      </AnimatePresence>

      {visible.length === 0 && (
        <div className="mt-10 rounded-[2rem] border border-dashed border-sand bg-soft/60 p-12 text-center">
          <p className="font-display text-2xl text-charcoal">No dishes match that craving.</p>
          <p className="mt-2 text-sm text-walnut">Try a different search or clear your filters.</p>
        </div>
      )}
    </div>
  );
}
