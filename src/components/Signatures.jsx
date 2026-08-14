"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, SectionHeading, Img, VegDot, Spicy } from "@/components/primitives";
import { formatPrice, cn } from "@/lib/utils";

const SHAPES = [
  "rounded-[2rem] rounded-t-[9rem]",
  "rounded-[2rem] rounded-br-[6rem]",
  "rounded-[2rem] rounded-tl-[6rem] rounded-tr-[2.5rem]",
  "rounded-[2rem] rounded-t-[9rem] rounded-br-[5rem]",
  "rounded-[2rem]",
  "rounded-[2rem] rounded-tl-[7rem]",
  "rounded-[2rem] rounded-tr-[7rem] rounded-bl-[5rem]",
  "rounded-[2rem] rounded-t-[8rem]",
];

function SignatureCard({ item, index }) {
  return (
    <Reveal delay={(index % 3) * 0.08} className="h-full">
      <Link
        href="/menu"
        className={cn(
          "group relative flex h-full flex-col overflow-hidden bg-soft shadow-soft ring-1 ring-sand/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-premium",
          SHAPES[index % SHAPES.length],
        )}
      >
        <div className="relative h-52 overflow-hidden sm:h-60">
          <Img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
            sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <VegDot />
            {item.bestseller && (
              <span className="rounded-full bg-burnt px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-soft">
                Bestseller
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brass">
            {item.cuisine || "House Favourite"}
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-charcoal">{item.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-walnut/90">
            {item.description}
          </p>

          <div className="mt-auto flex items-end justify-between pt-5">
            <div className="flex flex-col gap-1.5">
              <Spicy level={item.spicyLevel} />
              <span className="font-display text-2xl font-semibold text-terracotta">
                {formatPrice(item.price)}
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-charcoal/70 transition-colors group-hover:text-terracotta">
              View Menu <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export default function Signatures({ items }) {
  return (
    <section className="relative overflow-hidden bg-soft py-20 lg:py-28">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-terracotta/5 blur-3xl" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="House Favourites"
            title="Ayodhya Signatures"
            description="The dishes our regulars talk about — from loaded dosas and royal paneer gravies to stone-baked pizzas and chilled favourites."
          />
          <Reveal>
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-charcoal transition hover:border-terracotta hover:text-terracotta"
            >
              View Full Menu
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <SignatureCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
