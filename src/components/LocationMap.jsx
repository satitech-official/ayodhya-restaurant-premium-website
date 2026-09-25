"use client";

import { MapPin, Phone, Navigation, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/primitives";
import { RESTAURANT } from "@/lib/constants";

export default function LocationMap({ settings }) {
  const phone = settings.phone || RESTAURANT.phoneDisplay;
  const zomato = settings.zomato || RESTAURANT.orderLinks.zomato;
  const swiggy = settings.swiggy || RESTAURANT.orderLinks.swiggy;

  return (
    <section id="location" className="relative overflow-hidden border-t border-brass/15 bg-charcoal py-20 text-soft lg:py-28">
      <div className="pattern-jaali-light absolute inset-0 opacity-[0.08]" aria-hidden="true" />
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-terracotta/10 blur-[100px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-burnt">Visit Ayodhya</p>
          <h2 className="mt-3 font-display text-4xl text-soft sm:text-5xl lg:text-6xl">In the Heart of Betul</h2>
          <p className="mt-4 text-base leading-7 text-cream/60">
            Right in front of Lashkare Hospital, Ganj — easy to reach for family dinners,
            celebrations and everyday cravings.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="overflow-hidden rounded-[1.5rem] border border-brass/20 bg-espresso/40 p-2 shadow-[0_30px_90px_-50px_rgba(0,0,0,.95)]">
              <iframe
                title="Ayodhya Restaurant location on Google Maps"
                src={RESTAURANT.mapsEmbedUrl}
                className="h-[380px] w-full rounded-[1.1rem] border-0 grayscale-[18%] contrast-[1.04] lg:h-[480px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-[1.5rem] border border-brass/20 bg-espresso/45 p-7 backdrop-blur-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brass">Ayodhya Restaurant</p>
                <h3 className="mt-2 font-display text-3xl text-soft">Come Dine With Us</h3>
                <address className="mt-5 flex gap-3 text-sm not-italic leading-7 text-cream/65">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-burnt" />
                  <span>
                    In front of Lashkare Hospital
                    <br />
                    Main Road / Housing Board Colony
                    <br />
                    Ganj, Betul, Madhya Pradesh 460001
                  </span>
                </address>
              </div>

              <div className="mt-7 flex flex-col gap-3">
                <a
                  href={RESTAURANT.mapsDirectionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-terracotta px-6 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-burnt"
                >
                  <Navigation className="h-4 w-4" /> Get Directions
                </a>
                <a
                  href={RESTAURANT.phoneHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-brass/30 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-cream transition hover:border-brass hover:bg-brass/10"
                >
                  <Phone className="h-4 w-4" /> Call {phone}
                </a>
              </div>

              <div className="mt-auto border-t border-brass/15 pt-6" id="order">
                <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-brass">Ayodhya, Delivered.</h4>
                <p className="mt-2 text-sm leading-6 text-cream/55">
                  Prefer it at home? Find Ayodhya Restaurant on your favourite delivery platforms.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href={zomato}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-terracotta/40 bg-terracotta/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-burnt transition hover:bg-terracotta hover:text-soft"
                  >
                    Zomato <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={swiggy}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-brass/35 bg-brass/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-brass transition hover:bg-brass hover:text-charcoal"
                  >
                    Swiggy <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
