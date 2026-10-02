import { Phone, MapPin, Clock, Sparkles } from "lucide-react";
import ReservationForm from "@/components/ReservationForm";
import OpenStatus from "@/components/OpenStatus";
import { getSettings } from "@/lib/data";
import { RESTAURANT } from "@/lib/constants";

export const revalidate = 300;

export const metadata = {
  title: "Table Booking at Ayodhya Restaurant Betul | Reserve Online",
  description:
    "Reserve a table at Ayodhya Restaurant in Ganj, Betul near Lashkare Hospital for family dinners, birthdays, celebrations and group dining.",
  alternates: { canonical: "/reserve" },
  openGraph: {
    title: "Reserve a Table at Ayodhya Restaurant Betul",
    description:
      "Book a table online at Ayodhya Restaurant in Ganj, Betul for family dinners, birthdays and group meals.",
    url: "/reserve",
  },
};

export default async function ReservePage() {
  const settings = await getSettings();

  return (
    <div className="bg-cream pb-24 lg:pb-16">
      <section className="relative overflow-hidden bg-charcoal pb-10 pt-24 text-soft sm:pb-14 sm:pt-28">
        <div className="pattern-jaali-light absolute inset-0 opacity-[0.1]" />
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-brass/10 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-terracotta/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brass sm:text-[11px]">
            <span className="h-px w-8 bg-current opacity-60" /> Reservations
          </p>
          <h1 className="mt-4 max-w-xl font-display text-[2.7rem] font-semibold leading-[0.95] sm:text-6xl lg:text-7xl">
            Your Table, Ready for the Moment.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-cream/72 sm:text-base sm:leading-7">
            Family dinner, birthday or a relaxed evening — tell us when you're coming and we'll take care of the table.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-3">
            <h2 className="font-display text-3xl text-charcoal sm:text-4xl">Reservation details</h2>
            <div className="mt-6"><ReservationForm /></div>
          </div>

          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-[1.5rem] bg-soft p-6 ring-1 ring-sand/60 sm:p-7">
              <h2 className="font-display text-2xl font-semibold text-charcoal">Good to know</h2>
              <ul className="mt-4 space-y-4 text-sm text-walnut">
                <li className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />We confirm every request by phone or WhatsApp.</li>
                <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" /><OpenStatus hours={settings.hours} className="border-0 p-0" /></li>
                <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />In front of Lashkare Hospital, Main Road, Ganj, Betul.</li>
                <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" /><a href={RESTAURANT.phoneHref} className="font-semibold text-terracotta">{settings.phone || RESTAURANT.phoneDisplay}</a></li>
              </ul>
            </div>

            <div className="rounded-[1.5rem] bg-charcoal p-6 text-soft sm:p-7">
              <p className="font-display text-2xl italic leading-snug text-cream/85">“Great food deserves great memories — start with a table that's ready for you.”</p>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-brass">Ayodhya Restaurant · Betul</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
