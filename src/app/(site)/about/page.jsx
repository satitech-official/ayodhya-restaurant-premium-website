import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { Reveal, SectionHeading, ArchImage, Img } from "@/components/primitives";
import { img, IMAGES, RESTAURANT } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About",
  description:
    "About Ayodhya Restaurant, Betul — a modern family dining destination serving North Indian, South Indian, Indo-Chinese, pizzas and more under one roof.",
};

const PHILOSOPHY = [
  "Good food, made with care",
  "Real variety under one roof",
  "Dining that feels like belonging",
];

export default function AboutPage() {
  return (
    <div className="bg-cream pb-24 pt-28 lg:pb-16">
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-terracotta">
              <span className="h-px w-8 bg-current opacity-60" /> About Us
            </p>
            <h1 className="text-balance font-display text-5xl font-semibold leading-[1.02] text-charcoal sm:text-6xl">
              A Modern Table in the Heart of Betul.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-walnut">
              Ayodhya Restaurant brings many food cultures to one warm, wood-toned dining room —
              built for families, friends and anyone with an appetite for a good meal.
            </p>
          </div>
          <Reveal>
            <ArchImage
              src={img(IMAGES.interior2, 1000, 1200)}
              alt="The warm, patterned interior of Ayodhya Restaurant"
              variant="arch"
              ratio="aspect-[5/6]"
            />
          </Reveal>
        </div>
      </div>

      {/* Philosophy */}
      <section className="mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Our Philosophy"
              title="Good Food, Variety & Memorable Dining"
              description="We believe a great restaurant is measured in the small things — a dosa that cracks just right, a gravy simmered patiently, and a table that's always ready for one more chair. That's what we work toward every single day."
            />
            <Reveal delay={0.1}>
              <ul className="space-y-3">
                {PHILOSOPHY.map((p, i) => (
                  <li
                    key={p}
                    className="flex items-center gap-4 rounded-2xl bg-soft p-5 ring-1 ring-sand/60"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta font-display text-lg text-soft">
                      {i + 1}
                    </span>
                    <span className="font-display text-xl text-charcoal">{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="mt-24 bg-espresso py-20 text-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tone="light"
            eyebrow="The Ayodhya Experience"
            title="Warm Wood, Soft Light & Long Tables"
            description="Our dining room is designed around comfort — terracotta and wood tones, geometric arches and a relaxed buzz that makes every visit feel easy."
          />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[IMAGES.interior1, IMAGES.interior3, IMAGES.interior4, IMAGES.interior6].map((id, i) => (
              <Reveal key={id} delay={i * 0.05}>
                <div className="overflow-hidden rounded-2xl ring-1 ring-cream/10">
                  <Img src={img(id, 600, 700)} alt="Ayodhya Restaurant interior" className="h-56 w-full object-cover" sizes="(min-width:768px) 25vw, 50vw" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Kitchen + Menu philosophy */}
      <section className="mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-[2rem] bg-soft p-8 ring-1 ring-sand/60">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-terracotta">Our Kitchen</p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal">
                  Prepared Fresh, Plated Hot.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-walnut">
                  Every dosa, curry, pizza and shake is prepared to order in our kitchen — so your
                  food arrives hot, fresh and just the way you like it. We keep the menu wide and the
                  cooking honest.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-[2rem] bg-soft p-8 ring-1 ring-sand/60">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-terracotta">Our Menu Philosophy</p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-charcoal">
                  Many Food Cultures, One Roof.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-walnut">
                  From South Indian dosas and North Indian curries to Indo-Chinese, pizza, pasta and
                  desserts — the idea is simple: nobody at the table should have to compromise on
                  their craving.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Find us */}
      <section className="mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-charcoal p-8 text-soft sm:p-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-burnt">Find Us in Betul</p>
                <h2 className="mt-3 font-display text-4xl font-semibold">Ganj's Neighbourhood Table</h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/75">
                  Right in front of Lashkare Hospital on Main Road, Ganj — we're easy to find and
                  always happy to see you.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/reserve" className="group inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-burnt">
                    Reserve a Table <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <a href={RESTAURANT.phoneHref} className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-cream transition hover:border-burnt hover:text-burnt">
                    <Phone className="h-4 w-4" /> {RESTAURANT.phoneDisplay}
                  </a>
                </div>
              </div>
              <Reveal>
                <div className="rounded-2xl bg-espresso/60 p-6 ring-1 ring-cream/10">
                  <p className="flex items-start gap-3 text-sm leading-relaxed text-cream/80">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-burnt" />
                    <span>
                      In front of Lashkare Hospital
                      <br />
                      Main Road / Housing Board Colony
                      <br />
                      Ganj, Betul, Madhya Pradesh 460001
                    </span>
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
