"use client";

import { MapPin, Phone, Navigation, ExternalLink } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/primitives";
import { RESTAURANT } from "@/lib/constants";

export default function LocationMap({ settings }) {
  const phone = settings.phone || RESTAURANT.phoneDisplay;
  const zomato = settings.zomato || RESTAURANT.orderLinks.zomato;
  const swiggy = settings.swiggy || RESTAURANT.orderLinks.swiggy;

  return (
    <section id="location" className="relative overflow-hidden bg-soft py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Find Us"
          title="In the Heart of Betul"
          description="Right in front of Lashkare Hospital on Main Road, Ganj — easy to reach and easy to find."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="overflow-hidden rounded-[2rem] ring-1 ring-sand/60">
              <iframe
                title="Ayodhya Restaurant location on Google Maps"
                src={RESTAURANT.mapsEmbedUrl}
                className="h-[380px] w-full border-0 grayscale-[20%] lg:h-[480px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-2">
            <div className="flex h-full flex-col gap-6 rounded-[2rem] bg-cream p-7 ring-1 ring-sand/60">
              <div>
                <h3 className="font-display text-2xl font-semibold text-charcoal">Ayodhya Restaurant</h3>
                <address className="mt-3 flex gap-3 text-sm not-italic leading-relaxed text-walnut">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  <span>
                    In front of Lashkare Hospital
                    <br />
                    Main Road / Housing Board Colony
                    <br />
                    Ganj, Betul, Madhya Pradesh 460001
                  </span>
                </address>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={RESTAURANT.mapsDirectionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-espresso"
                >
                  <Navigation className="h-4 w-4" /> Get Directions
                </a>
                <a
                  href={RESTAURANT.phoneHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/20 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-charcoal transition hover:border-terracotta hover:text-terracotta"
                >
                  <Phone className="h-4 w-4" /> Call {phone}
                </a>
              </div>

              <div className="mt-auto border-t border-sand pt-5" id="order">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brass">
                  Ayodhya, Delivered.
                </h4>
                <p className="mt-2 text-sm text-walnut">
                  Prefer it at home? Find us on your favourite delivery apps.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={zomato}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#e23744] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:opacity-90"
                  >
                    Zomato <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={swiggy}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#fc8019] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:opacity-90"
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
