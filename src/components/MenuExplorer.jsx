"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import DishCard from "@/components/DishCard";
import { MENU_FILTERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const GROUPS = {
  veg: (i) => i.vegetarian,
  spicy: (i) => (i.spicyLevel || 0) >= 3,
  popular: (i) => i.bestseller || i.recommended,
  "south-indian": (i) => ["south-indian", "dosa-specials"].includes(i.category),
  "north-indian": (i) =>
    ["north-indian", "signature-main", "paneer-specials", "dal", "rice-biryani", "breads", "papad-salad", "raita"].includes(i.category),
  chinese: (i) => ["chinese", "signature-starters", "soups"].includes(i.category),
  "quick-bites": (i) => ["street-food", "signature-starters", "chinese", "pasta"].includes(i.category),
  beverages: (i) => i.category === "beverages",
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

  const categoryOptions = useMemo(
    () => [
      { slug: "recommended", name: "Recommended", icon: "★" },
      ...safeCategories,
      { slug: "all", name: "Everything", icon: "✦" },
    ],
    [safeCategories],
  );

  const activeCategory = categoryOptions.find((c) => c.slug === cat) || categoryOptions[0];

  const toggleFilter = (id) =>
    setFilters((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );

  const clearAll = () => {
    setQ("");
    setFilters([]);
    setCat("recommended");
  };

  const visible = useMemo(() => {
    let list = items || [];

    if (cat === "recommended") list = list.filter((item) => item.recommended);
    else if (cat !== "all") list = list.filter((item) => item.category === cat);

    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(needle) ||
          (item.description || "").toLowerCase().includes(needle) ||
          (item.cuisine || "").toLowerCase().includes(needle),
      );
    }

    for (const filter of filters) {
      const matcher = GROUPS[filter];
      if (matcher) list = list.filter(matcher);
    }

    return list;
  }, [items, cat, q, filters]);

  const hasActiveSearch = Boolean(q.trim() || filters.length || cat !== "recommended");

  return (
    <div>
      <div className="rounded-[1.5rem] border border-sand/70 bg-soft p-4 shadow-soft sm:p-5 lg:p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-walnut/55" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search dosa, paneer, pizza, shakes…"
              className="w-full rounded-2xl border border-sand bg-cream px-11 py-3.5 text-[16px] text-espresso outline-none transition placeholder:text-walnut/45 focus:border-terracotta sm:text-sm"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-walnut/60 transition hover:bg-sand/25 hover:text-charcoal"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>

          <div className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-walnut/70 lg:flex">
            <SlidersHorizontal className="h-4 w-4 text-terracotta" />
            Quick filters
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible">
          {MENU_FILTERS.map((filter) => {
            const active = filters.includes(filter.id);
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => toggleFilter(filter.id)}
                aria-pressed={active}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.08em] transition sm:text-xs",
                  active
                    ? "border-terracotta bg-terracotta text-soft"
                    : "border-sand bg-cream text-walnut hover:border-terracotta/50 hover:text-charcoal",
                )}
              >
                {active && <Check className="h-3.5 w-3.5" />}
                {filter.label}
              </button>
            );
          })}

          {hasActiveSearch && (
            <button
              type="button"
              onClick={clearAll}
              className="shrink-0 rounded-full px-3 py-2 text-xs font-bold text-terracotta transition hover:bg-terracotta/5"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="sticky top-[71px] z-30 -mx-4 mt-5 border-y border-sand/60 bg-cream/95 px-4 py-3 shadow-[0_12px_24px_-24px_rgba(43,25,14,.5)] backdrop-blur-md lg:hidden">
        <div className="flex snap-x gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categoryOptions.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setCat(category.slug)}
              aria-pressed={cat === category.slug}
              className={cn(
                "snap-start shrink-0 rounded-full border px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.08em] transition",
                cat === category.slug
                  ? "border-charcoal bg-charcoal text-soft"
                  : "border-sand bg-soft text-walnut",
              )}
            >
              {category.icon ? category.icon + " " : ""}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 overflow-hidden rounded-[1.4rem] border border-sand/70 bg-soft shadow-soft">
            <div className="border-b border-sand/60 px-5 py-4">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-terracotta">
                <Sparkles className="h-3.5 w-3.5" /> Explore Menu
              </p>
              <h2 className="mt-1 font-display text-2xl text-charcoal">Categories</h2>
            </div>

            <div className="max-h-[calc(100vh-180px)] overflow-y-auto p-2 [scrollbar-width:thin]">
              {categoryOptions.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setCat(category.slug)}
                  aria-pressed={cat === category.slug}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition",
                    cat === category.slug
                      ? "bg-charcoal text-soft"
                      : "text-walnut hover:bg-cream hover:text-charcoal",
                  )}
                >
                  <span className="min-w-0 truncate">
                    {category.icon ? category.icon + " " : ""}
                    {category.name}
                  </span>
                  {cat === category.slug && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-sand/60 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-terracotta">Now showing</p>
              <h2 className="mt-1 font-display text-3xl leading-none text-charcoal sm:text-4xl">
                {activeCategory.name}
              </h2>
            </div>
            <p className="rounded-full border border-sand/70 bg-soft px-3 py-1.5 text-xs font-semibold text-walnut">
              {visible.length} {visible.length === 1 ? "dish" : "dishes"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={cat + q + filters.join(",")}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3"
            >
              {visible.map((item) => (
                <DishCard key={item.id || item.slug || item.name} item={item} />
              ))}
            </motion.div>
          </AnimatePresence>

          {visible.length === 0 && (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-sand bg-soft/70 px-6 py-12 text-center">
              <p className="font-display text-2xl text-charcoal">No dishes match that craving.</p>
              <p className="mt-2 text-sm text-walnut">Try another category, search term or clear the filters.</p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-5 rounded-full bg-charcoal px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-soft"
              >
                Show recommended
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
