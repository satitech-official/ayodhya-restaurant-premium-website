import Link from "next/link";
import { ArrowRight, HeartHandshake, Sparkles, UtensilsCrossed } from "lucide-react";
import { Reveal, Img } from "@/components/primitives";
import { LogoMark } from "@/components/Logo";
import { IMAGES, img } from "@/lib/constants";

export const dynamic = "force-static";

export const metadata = {
  title: "Founders",
  description: "The vision and people-first hospitality philosophy behind Ayodhya Restaurant, Betul.",
};

const VALUES = [
  {
    icon: HeartHandshake,
    title: "Hospitality First",
    text: "A warm, welcoming dining experience for families, friends and celebrations.",
  },
  {
    icon: UtensilsCrossed,
    title: "Food With Variety",
    text: "A broad vegetarian menu designed so every person at the table can find a favourite.",
  },
  {
    icon: Sparkles,
    title: "Memorable Moments",
    text: "Thoughtful food, ambience and service built around the moments guests share together.",
  },
];

export default function FoundersPage() {
  return (
    <div className="bg-charcoal pb-24 pt-28 text-soft lg:pb-16">
      <section className="relative overflow-hidden">
        <div className="pattern-jaali-light absolute inset-0 opacity-[0.08]" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-brass/10 blur-[120px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-brass">Founders & Vision</p>
            <h1 className="mt-4 text-balance font-display text-5xl leading-[.98] text-soft sm:text-6xl lg:text-7xl">
              The People Behind Ayodhya.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-cream/65">
              Ayodhya Restaurant is built around a simple idea: bring people together over satisfying
              vegetarian food, warm service and a comfortable place to create memories in Betul.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-cream/45">
              Founder names, portraits and individual biographies will be added here after final
              approval from the restaurant team, so no unverified personal details are published.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brass px-6 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-charcoal transition hover:bg-burnt"
            >
              Explore Our Story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <Reveal>
            <div className="relative mx-auto max-w-[470px]">
              <div className="absolute -inset-5 rounded-[2rem] border border-brass/15" />
              <div className="relative overflow-hidden rounded-[2rem] border border-brass/25 bg-espresso">
                <Img
                  src={img(IMAGES.interior2, 1000, 1100)}
                  alt="Ayodhya Restaurant dining ambience"
                  className="aspect-[5/6] h-full w-full object-cover"
                  eager
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brass/30 bg-charcoal/70 backdrop-blur">
                    <LogoMark className="h-9 w-9" />
                  </div>
                  <div>
                    <p className="font-display text-2xl text-soft">Ayodhya Restaurant</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brass">Betul · Madhya Pradesh</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-brass/15 bg-espresso/55 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brass">The Vision</p>
            <h2 className="mt-3 font-display text-4xl text-soft sm:text-5xl">What Guides the Restaurant</h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} delay={index * 0.06}>
                <div className="h-full rounded-[1.4rem] border border-brass/15 bg-charcoal/55 p-6">
                  <Icon className="h-6 w-6 text-brass" />
                  <h3 className="mt-4 font-display text-2xl text-soft">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-cream/55">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-brass/20 bg-gradient-to-br from-espresso to-charcoal p-8 sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brass">From Vision to Table</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl text-soft sm:text-5xl">
              A Restaurant Designed Around Togetherness.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-cream/60">
              From everyday meals to birthdays and family gatherings, the goal is to make every visit
              feel easy, generous and worth remembering.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
