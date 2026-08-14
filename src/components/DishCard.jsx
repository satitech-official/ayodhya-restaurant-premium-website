"use client";

import { Img, VegDot, Spicy } from "@/components/primitives";
import { MENU_CATEGORIES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

const CAT_EMOJI = Object.fromEntries(MENU_CATEGORIES.map((c) => [c.slug, c.icon]));

export default function DishCard({ item }) {
  const emoji = CAT_EMOJI[item.category] || "🍽️";
  const soldOut = item.available === false;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-soft ring-1 ring-sand/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative h-40 overflow-hidden bg-espresso">
        {item.image ? (
          <Img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(min-width:1024px) 25vw, (min-width:640px) 45vw, 50vw"
          />
        ) : (
          <div className="pattern-jaali-light flex h-full w-full items-center justify-center bg-espresso text-4xl">
            <span aria-hidden="true">{emoji}</span>
          </div>
        )}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/70">
            <span className="rounded-full bg-terracotta px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-soft">
              Sold Out
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <VegDot className="h-4 w-4 border-[1.5px] [&>span]:h-1.5 [&>span]:w-1.5" />
        </div>
        {item.bestseller && (
          <span className="absolute right-3 top-3 rounded-full bg-burnt px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-soft">
            Bestseller
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight text-charcoal">
            {item.name}
          </h3>
          <span className="shrink-0 font-display text-lg font-semibold text-terracotta">
            {formatPrice(item.price)}
          </span>
        </div>
        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-walnut/85">
            {item.description}
          </p>
        )}
        <div className="mt-auto flex items-center gap-3 pt-3">
          <Spicy level={item.spicyLevel} />
          {item.recommended && (
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brass">
              ★ Recommended
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
