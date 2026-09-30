"use client";

import { Img, VegDot, Spicy } from "@/components/primitives";
import { MENU_CATEGORIES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

const CATEGORY_META = Object.fromEntries(
  MENU_CATEGORIES.map((category) => [category.slug, category]),
);

export default function DishCard({ item }) {
  const meta = CATEGORY_META[item.category] || { icon: "🍽️", name: "Ayodhya Special" };
  const soldOut = item.available === false;

  return (
    <article className="group relative flex min-h-[132px] overflow-hidden rounded-[1.15rem] border border-sand/65 bg-soft shadow-[0_16px_42px_-38px_rgba(43,25,14,.55)] transition duration-300 sm:block sm:min-h-0 sm:rounded-[1.35rem] sm:hover:-translate-y-1 sm:hover:shadow-lift">
      <div className="relative w-[112px] shrink-0 self-stretch overflow-hidden bg-espresso sm:aspect-[4/3] sm:w-full">
        {item.image ? (
          <Img
            src={item.image}
            alt={item.name}
            className="h-full min-h-[132px] w-full object-cover transition-transform duration-700 sm:min-h-0 sm:group-hover:scale-105"
            sizes="(min-width:1280px) 25vw, (min-width:640px) 45vw, 112px"
          />
        ) : (
          <div className="pattern-jaali-light flex h-full min-h-[132px] w-full items-center justify-center bg-espresso text-3xl sm:min-h-0 sm:text-4xl">
            <span aria-hidden="true">{meta.icon}</span>
          </div>
        )}

        <div className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3">
          <VegDot className="h-4 w-4 border-[1.5px] [&>span]:h-1.5 [&>span]:w-1.5" />
        </div>

        {item.bestseller && (
          <span className="absolute bottom-2.5 left-2.5 rounded-full bg-burnt px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-charcoal sm:bottom-auto sm:left-auto sm:right-3 sm:top-3 sm:text-[9px]">
            Bestseller
          </span>
        )}

        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/72">
            <span className="rounded-full bg-terracotta px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-soft">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3.5 sm:p-4">
        <p className="truncate text-[8px] font-bold uppercase tracking-[0.14em] text-terracotta sm:text-[9px]">
          {meta.icon} {meta.name}
        </p>

        <div className="mt-1 flex items-start justify-between gap-2 sm:mt-1.5">
          <h3 className="min-w-0 font-display text-[1.22rem] font-semibold leading-[1.08] text-charcoal sm:text-xl">
            {item.name}
          </h3>
          <span className="shrink-0 font-display text-lg font-semibold leading-none text-terracotta sm:text-xl">
            {formatPrice(item.price)}
          </span>
        </div>

        {item.description && (
          <p className="mt-2 hidden line-clamp-2 text-xs leading-5 text-walnut/80 sm:block">
            {item.description}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3">
          <Spicy level={item.spicyLevel} />
          {item.recommended && (
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-brass sm:text-[10px]">
              ★ Recommended
            </span>
          )}
          {soldOut && (
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-walnut/55">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
