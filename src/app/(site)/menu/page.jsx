import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Clock3,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import MenuExplorer from "@/components/MenuExplorer";
import { getMenuItems, getCategories } from "@/lib/data";

export const revalidate = 300;

export const metadata = {
  title: "Menu | Vegetarian Restaurant in Betul",
  description:
    "Explore Ayodhya Restaurant Betul's menu with North Indian, South Indian, Indo-Chinese, dosa, pizza, pasta, desserts, shakes and beverages near Lashkare Hospital, Ganj.",
  alternates: { canonical: "/menu/" },
  openGraph: {
    title: "Ayodhya Restaurant Betul Menu",
    description: "Browse the vegetarian menu at Ayodhya Restaurant near Lashkare Hospital, Ganj, Betul.",
    url: "/menu/",
  },
};

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;
  const [items, categories] = await Promise.all([getMenuItems(), getCategories()]);
  const requestedCategory = typeof params?.cat === "string" ? params.cat : "recommended";
  const validCategories = new Set(["recommended", "all", ...categories.map((c) => c.slug)]);
  const initialCategory = validCategories.has(requestedCategory) ? requestedCategory : "recommended";

  return (
    <div className="bg-cream pb-28 lg:pb-20">
      <section className="relative overflow-hidden bg-charcoal pb-10 pt-24 text-soft sm:pb-14 sm:pt-28 lg:pb-16">
        <div className="pattern-jaali-light absolute inset-0 opacity-[0.12]" aria-hidden="true" />
        <div className="absolute -right-28 top-10 h-80 w-80 rounded-full bg-brass/10 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-terracotta/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.24em] text-brass sm:text-[11px] sm:tracking-[0.28em]">
                <span className="h-px w-8 bg-current opacity-60" /> Ayodhya Digital Menu
              </p>
              <h1 className="mt-4 max-w-[14ch] font-display text-[2.7rem] font-semibold leading-[0.95] tracking-[-0.025em] sm:text-6xl lg:text-7xl">
                One Table. Many Cravings.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/72 sm:text-base sm:leading-7">
                Browse favourites from crispy dosas and creamy curries to pizzas, street food, desserts and chilled beverages.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="/takeaway" className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-burnt hover:text-charcoal">
                  <ShoppingBag className="h-4 w-4" /> Order Takeaway
                </Link>
                <Link href="/menu-book" className="inline-flex items-center gap-2 rounded-full border border-brass/35 bg-charcoal/35 px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-cream backdrop-blur-md transition hover:border-brass/70">
                  <BookOpenText className="h-4 w-4 text-brass" /> Original Menu Book
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center sm:max-w-xl lg:w-[330px]">
              {[
                [UtensilsCrossed, "Pure Veg"],
                [Sparkles, "Chef Picks"],
                [Clock3, "Freshly Made"],
              ].map(([Icon, label]) => (
                <div key={label} className="rounded-2xl border border-brass/20 bg-charcoal/38 px-3 py-4 backdrop-blur-md">
                  <Icon className="mx-auto h-4 w-4 text-brass" />
                  <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.08em] text-cream/75 sm:text-[10px]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10">
        <MenuExplorer key={initialCategory} items={items} categories={categories} initialCategory={initialCategory} />

        <div className="mt-10 rounded-[1.35rem] border border-sand/70 bg-soft px-5 py-5 sm:flex sm:items-center sm:justify-between sm:gap-5 sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-terracotta">Prefer pickup?</p>
            <p className="mt-1 font-display text-2xl text-charcoal">Build your takeaway order online.</p>
          </div>
          <Link href="/takeaway" className="mt-4 inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-soft sm:mt-0">
            Start Takeaway <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-8 text-center text-[11px] leading-5 text-walnut/65">
          Prices shown match the restaurant menu provided to us. Taxes, parcel charges and availability may vary.
        </p>
      </div>
    </div>
  );
}
