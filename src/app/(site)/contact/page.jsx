import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/icons";
import FeedbackForm from "@/components/FeedbackForm";
import OpenStatus from "@/components/OpenStatus";
import { getSettings } from "@/lib/data";
import { RESTAURANT } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact",
  description:
    "Contact Ayodhya Restaurant in Ganj, Betul — call us, find us on the map, follow us on Instagram or send a message.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="bg-cream pb-24 pt-28 lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-terracotta">
            <span className="h-px w-8 bg-current opacity-60" /> Contact
          </p>
          <h1 className="text-balance font-display text-5xl font-semibold leading-[1.02] text-charcoal sm:text-6xl">
            Say Hello.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-walnut">
            Questions, feedback or a special request? Reach us any way you like — we're quick to
            respond.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Info */}
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-[2rem] bg-soft p-7 ring-1 ring-sand/60">
              <h2 className="font-display text-2xl font-semibold text-charcoal">Ayodhya Restaurant</h2>
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

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <a href={RESTAURANT.phoneHref} className="flex items-center gap-3 rounded-[2rem] bg-soft p-5 ring-1 ring-sand/60 transition hover:ring-terracotta/40">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta text-soft">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-walnut/70">Call us</span>
                  <span className="font-semibold text-charcoal">{settings.phone || RESTAURANT.phoneDisplay}</span>
                </span>
              </a>
              <a href={settings.instagram || RESTAURANT.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-[2rem] bg-soft p-5 ring-1 ring-sand/60 transition hover:ring-terracotta/40">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-espresso text-soft">
                  <InstagramIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-walnut/70">Instagram</span>
                  <span className="font-semibold text-charcoal">{RESTAURANT.instagramHandle}</span>
                </span>
              </a>
              <a href={settings.facebook || RESTAURANT.facebookUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-[2rem] bg-soft p-5 ring-1 ring-sand/60 transition hover:ring-terracotta/40">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-espresso text-soft">
                  <FacebookIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-walnut/70">Facebook</span>
                  <span className="font-semibold text-charcoal">Ayodhya Restaurant</span>
                </span>
              </a>
              <div className="flex items-center gap-3 rounded-[2rem] bg-soft p-5 ring-1 ring-sand/60">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-espresso text-soft">
                  <Clock className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-walnut/70">Hours</span>
                  <OpenStatus hours={settings.hours} className="mt-1 border-0 p-0" />
                </span>
              </div>
            </div>

            <Link href="/reserve" className="block rounded-[2rem] bg-charcoal p-6 text-center font-display text-xl text-soft transition hover:bg-espresso">
              Prefer to book a table? <span className="text-burnt">Reserve here →</span>
            </Link>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <FeedbackForm />
          </div>
        </div>
      </div>
    </div>
  );
}
