import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/icons";
import { LogoLockup } from "@/components/Logo";
import { RESTAURANT } from "@/lib/constants";

const DAY_ORDER = [
  ["monday", "Mon"],
  ["tuesday", "Tue"],
  ["wednesday", "Wed"],
  ["thursday", "Thu"],
  ["friday", "Fri"],
  ["saturday", "Sat"],
  ["sunday", "Sun"],
];

function fmtHours(entry) {
  if (!entry || entry.closed) return "Closed";
  const f = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":").map((x) => parseInt(x, 10));
    const ampm = h >= 12 ? "PM" : "AM";
    const hh = h % 12 === 0 ? 12 : h % 12;
    return m > 0 ? `${hh}:${String(m).padStart(2, "0")} ${ampm}` : `${hh} ${ampm}`;
  };
  return `${f(entry.open)} – ${f(entry.close)}`;
}

export default function Footer({ settings }) {
  const hours = settings.hours || {};
  const today = new Intl.DateTimeFormat("en-US", { weekday: "long" })
    .format(new Date())
    .toLowerCase();
  const instagram = settings.instagram || RESTAURANT.instagramUrl;
  const facebook = settings.facebook || RESTAURANT.facebookUrl;
  const phone = settings.phone || RESTAURANT.phoneDisplay;

  return (
    <footer className="relative overflow-hidden bg-charcoal text-cream">
      <div className="pattern-jaali-light absolute inset-0 opacity-[0.15]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex text-terracotta">
              <LogoLockup dark />
            </Link>
            <p className="mt-5 max-w-xs font-display text-2xl italic leading-snug text-cream/80">
              Flavours That Bring People Together.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition hover:border-burnt hover:text-burnt"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition hover:border-burnt hover:text-burnt"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-brass">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                ["Menu", "/menu"],
                ["About", "/about"],
                ["Gallery", "/gallery"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="link-underline text-cream/75 transition hover:text-cream">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-brass">Restaurant</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                ["Reservations", "/reserve"],
                ["Get Directions", RESTAURANT.mapsDirectionsUrl],
                ["Order Online", "/#order"],
                ["Reviews", "/#reviews"],
              ].map(([label, href]) => (
                <li key={label}>
                  {href.startsWith("/") ? (
                    <Link href={href} className="link-underline text-cream/75 transition hover:text-cream">
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline text-cream/75 transition hover:text-cream"
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-brass">Visit Us</h3>
            <ul className="mt-5 space-y-4 text-sm text-cream/75">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-burnt" />
                <span>
                  In front of Lashkare Hospital
                  <br />
                  Main Road / Housing Board Colony
                  <br />
                  Ganj, Betul, Madhya Pradesh 460001
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-burnt" />
                <a href={RESTAURANT.phoneHref} className="transition hover:text-cream">
                  {phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-burnt" />
                <span className="flex flex-col gap-1">
                  {DAY_ORDER.map(([key, label]) => (
                    <span
                      key={key}
                      className={key === today ? "font-semibold text-cream" : ""}
                    >
                      <span className="inline-block w-9 text-cream/50">{label}</span>
                      {fmtHours(hours[key])}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-7 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Ayodhya Restaurant, Betul. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition hover:text-cream">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-cream">
              Terms
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-[11px] text-cream/35">
          Menu prices are indicative — please confirm current rates and availability with the restaurant.
        </p>
      </div>
    </footer>
  );
}
