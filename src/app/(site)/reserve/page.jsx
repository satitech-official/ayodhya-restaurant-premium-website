import { Phone, MapPin, Clock, Sparkles } from "lucide-react";
import ReservationForm from "@/components/ReservationForm";
import OpenStatus from "@/components/OpenStatus";
import { getSettings } from "@/lib/data";
import { RESTAURANT } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reserve a Table",
  description:
    "Reserve a table at Ayodhya Restaurant, Ganj Betul — book online for family dinners, birthdays and group meals.",
};

export default async function ReservePage() {
  const settings = await getSettings();

  return (
    <div className="bg-cream pb-24 pt-28 lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-terracotta">
              <span className="h-px w-8 bg-current opacity-60" /> Reservations
            </p>
            <h1 className="text-balance font-display text-5xl font-semibold leading-[1.02] text-charcoal sm:text-6xl">
              Reserve a Table.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-walnut">
              Tell us when you're coming and we'll keep a table ready. Perfect for family dinners,
              birthdays and group meals.
            </p>

            <div className="mt-8">
              <ReservationForm />
            </div>
          </div>

          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-[2rem] bg-soft p-7 ring-1 ring-sand/60">
              <h2 className="font-display text-2xl font-semibold text-charcoal">Good to know</h2>
              <ul className="mt-4 space-y-4 text-sm text-walnut">
                <li className="flex gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  We confirm every request by phone or WhatsApp.
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  <OpenStatus hours={settings.hours} className="border-0 p-0" />
                </li>
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  In front of Lashkare Hospital, Main Road, Ganj, Betul.
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  <a href={RESTAURANT.phoneHref} className="font-semibold text-terracotta">
                    {settings.phone || RESTAURANT.phoneDisplay}
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-[2rem] bg-charcoal p-7 text-soft">
              <p className="font-display text-2xl italic leading-snug text-cream/85">
                “Great food deserves great memories — start with a table that's ready for you.”
              </p>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-brass">
                Ayodhya Restaurant · Betul
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
