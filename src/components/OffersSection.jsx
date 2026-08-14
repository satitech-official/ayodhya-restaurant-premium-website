"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Reveal, SectionHeading, Img } from "@/components/primitives";

function fmtDate(d) {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function OffersSection({ offers }) {
  if (!offers || offers.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Offers & Events"
          title="What's Cooking at Ayodhya"
          description="Seasonal specials, new dishes and announcements — fresh from our kitchen to your table."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {offers.slice(0, 4).map((o, i) => {
            const valid =
              o.validUntil
                ? `${fmtDate(o.validFrom) ? fmtDate(o.validFrom) + " – " : ""}${fmtDate(o.validUntil)}`
                : "";
            return (
              <Reveal key={o.id} delay={i * 0.06} className="h-full">
                <div className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-soft shadow-soft ring-1 ring-sand/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-premium">
                  <div className="relative h-44 overflow-hidden">
                    <Img
                      src={o.image}
                      alt={o.title}
                      className="h-full w-full object-cover transition-transform duration-[1.1s] group-hover:scale-110"
                      sizes="(min-width:1024px) 25vw, (min-width:640px) 45vw, 90vw"
                    />
                    {o.badge && (
                      <span className="absolute left-3 top-3 rounded-full bg-terracotta px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-soft">
                        {o.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-xl font-semibold text-charcoal">{o.title}</h3>
                    {valid && (
                      <span className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brass">
                        <CalendarDays className="h-3.5 w-3.5" /> Valid till {valid}
                      </span>
                    )}
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-walnut/90">
                      {o.description}
                    </p>
                    {o.ctaLabel && (
                      <Link
                        href={o.ctaLink || "/menu"}
                        className="group/cta mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold uppercase tracking-[0.14em] text-terracotta"
                      >
                        {o.ctaLabel}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
