"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  UtensilsCrossed,
  Users,
  Leaf,
} from "lucide-react";
import { Img, Reveal } from "@/components/primitives";
import { InstagramIcon } from "@/components/icons";
import { RESTAURANT, IMAGES, img } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import GoogleReviewForm from "@/components/GoogleReviewForm";

const EASE = [0.22, 1, 0.36, 1];

const FEATURES = [
  { icon: Leaf, title: "Pure Veg", text: "100% vegetarian kitchen" },
  { icon: UtensilsCrossed, title: "Multiple Cuisines", text: "North • South • Indo-Chinese" },
  { icon: Sparkles, title: "Authentic Taste", text: "Freshly prepared favourites" },
  { icon: Users, title: "Family Friendly", text: "Made for every occasion" },
];

const OCCASIONS = [
  { title: "Family Dining", text: "Create beautiful moments around one table.", image: IMAGES.family1 },
  { title: "Group Dining", text: "Spacious seating for friends and family.", image: IMAGES.family2 },
  { title: "Birthday Celebrations", text: "A warm setting for memorable celebrations.", image: IMAGES.family3 },
  { title: "Couple Dining", text: "A relaxed corner for slow evenings.", image: IMAGES.interior4 },
];

function Rating({ value = 5 }) {
  return (
    <div className="flex gap-1 text-brass">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`h-4 w-4 ${n <= value ? "fill-current" : "opacity-30"}`} />
      ))}
    </div>
  );
}

export default function LuxuryHome({ settings, signatures = [], gallery = [], reviews = [] }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const heroPoster = `${basePath}/images/hero-restaurant.webp`;

  return (
    <div className="bg-charcoal text-soft">
      <section className="relative min-h-[100svh] overflow-hidden bg-charcoal">
        <div className="absolute inset-0">
          <motion.img
            src={heroPoster}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: 1.02 }}
            animate={{ scale: 1.07 }}
            transition={{ duration: 16, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={heroPoster}
            aria-label="Cinematic aesthetic restaurant interior showcase"
          >
            <source
              src="https://videos.pexels.com/video-files/31631562/13476222_3840_2160_25fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/82 to-charcoal/28" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/35" />
          <div className="pattern-jaali-light absolute inset-0 opacity-[0.08]" />
        </div>

        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl items-center px-4 pb-24 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mb-5 flex flex-wrap items-center gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-brass/35 bg-charcoal/45 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-brass backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" /> Fine Dining • Pure Veg • Family Restaurant
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
              className="mb-3 text-xs font-bold uppercase tracking-[0.34em] text-burnt"
            >
              Ayodhya Restaurant · Betul
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
              className="text-balance font-display text-[clamp(3.2rem,8.5vw,7.6rem)] font-semibold uppercase leading-[0.82] tracking-[-0.035em] text-soft"
            >
              A Royal Dining
              <span className="mt-2 block text-brass">Experience</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.22, ease: EASE }}
              className="mt-7 max-w-2xl font-display text-xl leading-relaxed text-cream/85 sm:text-2xl"
            >
              Where authentic taste meets warm Ayodhya hospitality.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.32 }}
              className="mt-4 max-w-xl text-sm leading-7 text-cream/65 sm:text-base"
            >
              From signature dosas and rich North Indian classics to Indo-Chinese favourites, pizzas,
              shakes and more — discover a family dining experience in the heart of Betul.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.38, ease: EASE }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link
                href="/reserve"
                className="group inline-flex items-center gap-2 rounded-xl bg-terracotta px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-soft shadow-[0_18px_50px_-18px_rgba(138,90,43,.82)] transition hover:-translate-y-0.5 hover:bg-burnt"
              >
                <CalendarDays className="h-4 w-4" /> Book a Table
              </Link>
              <Link
                href="/menu"
                className="group inline-flex items-center gap-2 rounded-xl border border-brass/45 bg-charcoal/35 px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-cream backdrop-blur-md transition hover:border-brass hover:bg-brass/10"
              >
                View Menu <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.48 }}
              className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-cream/75"
            >
              <a href={RESTAURANT.mapsDirectionsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-soft">
                <MapPin className="h-4 w-4 text-burnt" /> In front of Lashkare Hospital, Ganj, Betul
              </a>
              <a href={RESTAURANT.phoneHref} className="inline-flex items-center gap-2 hover:text-soft">
                <Phone className="h-4 w-4 text-burnt" /> {RESTAURANT.phoneDisplay}
              </a>
            </motion.div>
          </div>
        </div>

        <div className="relative border-y border-brass/15 bg-charcoal/88 backdrop-blur-xl">
          <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="group border-brass/15 p-5 text-center even:border-l md:border-l first:md:border-l-0 sm:p-7">
                <Icon className="mx-auto h-6 w-6 text-brass transition-transform duration-500 group-hover:-translate-y-1" />
                <h2 className="mt-3 font-display text-xl text-soft">{title}</h2>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-cream/45">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-charcoal py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(201,147,60,.13),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-burnt">Our Specialities</p>
              <h2 className="mt-3 font-display text-4xl text-soft sm:text-5xl lg:text-6xl">Signature Dishes</h2>
              <p className="mt-4 text-base leading-7 text-cream/60">The favourites guests return for — served with rich flavours and premium presentation.</p>
            </div>
            <Link href="/menu" className="inline-flex w-fit items-center gap-2 rounded-xl bg-terracotta px-6 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-burnt">
              Explore Full Menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {signatures.slice(0, 8).map((item, i) => (
              <Reveal key={item.id || item.name} delay={(i % 4) * 0.05}>
                <Link
                  href="/menu"
                  className="group block overflow-hidden rounded-[1.4rem] border border-brass/15 bg-espresso/50 shadow-[0_24px_70px_-40px_rgba(0,0,0,.9)] transition duration-500 hover:-translate-y-1 hover:border-brass/45"
                >
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <Img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-transparent to-transparent" />
                    {item.bestseller && (
                      <span className="absolute left-4 top-4 rounded-full bg-terracotta px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-soft">Bestseller</span>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brass">{item.cuisine || "House Favourite"}</p>
                    <div className="mt-2 flex items-start justify-between gap-4">
                      <h3 className="font-display text-2xl leading-tight text-soft">{item.name}</h3>
                      <span className="font-display text-xl text-burnt">{formatPrice(item.price)}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-cream/55">{item.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-brass/15 bg-espresso">
        <div className="absolute inset-0">
          <Img src={img(IMAGES.dosa1, 1800, 1000)} alt="Ayodhya dosa special" className="h-full w-full object-cover opacity-55" eager />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/88 to-charcoal/35" />
        </div>
        <div className="relative mx-auto grid min-h-[540px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-burnt">Speciality Section</p>
            <h2 className="mt-3 font-display text-5xl text-soft sm:text-6xl">The Dosa Counter</h2>
            <p className="mt-4 max-w-xl font-display text-2xl text-brass">Crispy. Flavourful. Unforgettable.</p>
            <p className="mt-4 max-w-lg text-base leading-7 text-cream/65">From classic Masala Dosa to loaded Jini Paneer and signature creations, explore one of Ayodhya Restaurant's most loved counters.</p>
            <Link href="/menu?cat=dosa-specials" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-terracotta px-6 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-burnt">
              Explore Dosa Menu <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="hidden lg:flex lg:justify-end">
            <div className="rounded-full border border-brass/35 bg-charcoal/55 p-8 text-center backdrop-blur-md">
              <p className="font-display text-5xl text-brass">20+</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-cream/60">Dosa Varieties</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-charcoal py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-burnt">Made For Moments</p>
            <h2 className="mt-3 font-display text-4xl text-soft sm:text-5xl lg:text-6xl">A Perfect Place for Every Occasion</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {OCCASIONS.map((o, i) => (
              <Reveal key={o.title} delay={i * 0.06}>
                <div className="group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-brass/15">
                  <Img src={img(o.image, 800, 1000)} alt={o.title} className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-2xl text-soft">{o.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-cream/65">{o.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="relative overflow-hidden bg-cream py-20 text-charcoal lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta">Gallery</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl">A Glimpse of Ayodhya</h2>
              <p className="mt-4 text-base leading-7 text-walnut">Food, ambience and moments worth coming back for.</p>
            </div>
            <Link href="/gallery" className="inline-flex w-fit items-center gap-2 rounded-xl border border-charcoal/15 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.1em] transition hover:border-terracotta hover:text-terracotta">
              View Full Gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {gallery.slice(0, 8).map((g, i) => (
              <Reveal key={g.id || i} delay={(i % 4) * 0.04} className={i === 0 || i === 5 ? "md:col-span-2" : ""}>
                <div className="group relative h-56 overflow-hidden rounded-[1.25rem] border border-sand/70 sm:h-64">
                  <Img src={g.image} alt={g.caption || "Ayodhya Restaurant"} className="h-full w-full object-cover transition-transform duration-[1.1s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-transparent to-transparent opacity-70" />
                  {g.caption && <p className="absolute inset-x-0 bottom-0 p-4 text-sm font-semibold text-soft">{g.caption}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="relative overflow-hidden bg-charcoal py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_50%,rgba(201,147,60,.13),transparent_32%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-burnt">Guest Love</p>
            <h2 className="mt-3 font-display text-4xl text-soft sm:text-5xl">What Our Guests Say</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {(reviews.length ? reviews : [
              { id: 1, name: "Ayodhya Guest", rating: 5, review: "Great food, warm ambience and a memorable family dining experience." },
              { id: 2, name: "Local Diner", rating: 5, review: "Loved the variety on the menu, especially the dosa and paneer favourites." },
              { id: 3, name: "Betul Food Lover", rating: 5, review: "A comfortable place for family dinners and celebrations in Betul." },
            ]).slice(0, 3).map((r, i) => (
              <Reveal key={r.id || i} delay={i * 0.06}>
                <figure className="h-full rounded-[1.4rem] border border-brass/15 bg-espresso/45 p-6">
                  <div className="flex items-center justify-between">
                    <Rating value={r.rating || 5} />
                    <Quote className="h-7 w-7 text-brass/30" />
                  </div>
                  <blockquote className="mt-5 text-sm leading-7 text-cream/75">“{r.review}”</blockquote>
                  <figcaption className="mt-6 border-t border-brass/10 pt-4">
                    <p className="font-semibold text-soft">{r.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-cream/35">{r.source || "Guest Review"}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <GoogleReviewForm />
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-brass/15 bg-espresso py-20 lg:py-24">
        <div className="pattern-jaali-light absolute inset-0 opacity-[0.08]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-[1.4fr_.6fr] md:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-burnt">Reserve Your Table</p>
            <h2 className="mt-3 font-display text-4xl text-soft sm:text-5xl">Great Food Deserves Great Moments.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-cream/65">Plan a family dinner, birthday, group meal or a relaxed evening with the people you love.</p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Link href="/reserve" className="inline-flex w-fit items-center gap-2 rounded-xl bg-terracotta px-7 py-4 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-burnt">
              Book a Table <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={RESTAURANT.phoneHref} className="inline-flex items-center gap-2 text-sm text-cream/70 hover:text-soft">
              <Phone className="h-4 w-4 text-burnt" /> {RESTAURANT.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <a href={RESTAURANT.mapsDirectionsUrl} target="_blank" rel="noreferrer" className="group rounded-[1.2rem] border border-brass/15 bg-espresso/35 p-5 transition hover:border-brass/40">
            <MapPin className="h-5 w-5 text-burnt" />
            <h3 className="mt-3 font-display text-xl text-soft">Visit Us</h3>
            <p className="mt-2 text-sm leading-6 text-cream/55">In front of Lashkare Hospital, Ganj, Betul, Madhya Pradesh 460001</p>
          </a>
          <a href={RESTAURANT.phoneHref} className="group rounded-[1.2rem] border border-brass/15 bg-espresso/35 p-5 transition hover:border-brass/40">
            <Phone className="h-5 w-5 text-burnt" />
            <h3 className="mt-3 font-display text-xl text-soft">Call Ayodhya</h3>
            <p className="mt-2 text-sm text-cream/55">{RESTAURANT.phoneDisplay}</p>
          </a>
          <a href={settings?.instagram || RESTAURANT.instagramUrl} target="_blank" rel="noreferrer" className="group rounded-[1.2rem] border border-brass/15 bg-espresso/35 p-5 transition hover:border-brass/40">
            <InstagramIcon className="h-5 w-5 text-burnt" />
            <h3 className="mt-3 font-display text-xl text-soft">Follow the Food</h3>
            <p className="mt-2 text-sm text-cream/55">{RESTAURANT.instagramHandle}</p>
          </a>
        </div>
      </section>
    </div>
  );
}
