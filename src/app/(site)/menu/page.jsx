import Link from "next/link";
import { ArrowUpRight, BookOpenText, Sparkles } from "lucide-react";
import MenuExplorer from "@/components/MenuExplorer";
import { getMenuItems, getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Menu",
  description:
    "Explore the full Ayodhya Restaurant menu — North Indian, South Indian, Indo-Chinese, pizzas, dosas, pasta, desserts, shakes and more in Ganj, Betul.",
};

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;
  const [items, categories] = await Promise.all([getMenuItems(), getCategories()]);
  const requestedCategory = typeof params?.cat === "string" ? params.cat : "recommended";
  const validCategories = new Set(["recommended", "all", ...categories.map((c) => c.slug)]);
  const initialCategory = validCategories.has(requestedCategory) ? requestedCategory : "recommended";

  return (
    <div className="bg-cream pb-24 pt-28 lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-terracotta">
            <span className="h-px w-8 bg-current opacity-60" /> The Digital Menu
          </p>
          <h1 className="text-balance font-display text-5xl font-semibold leading-[1.02] text-charcoal sm:text-6xl">
            One Table. Many Cravings.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-walnut">
            Search, filter and explore everything we cook — from crispy dosas and creamy curries to
            stone-baked pizzas and chilled shakes.
          </p>
        </div>

        <Link
          href="/menu-book"
          className="group relative mt-9 block overflow-hidden rounded-[1.8rem] border border-[#9b652f]/25 bg-[#2e140b] p-1 shadow-[0_24px_60px_-35px_rgba(68,30,14,.72)] transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_30px_70px_-34px_rgba(68,30,14,.88)]"
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#d7a44b]/12 blur-3xl transition duration-700 group-hover:scale-125" />
          <div className="pointer-events-none absolute inset-y-0 left-[44%] hidden w-px bg-gradient-to-b from-transparent via-[#d7a44b]/20 to-transparent md:block" />
          <div className="relative grid gap-5 rounded-[1.55rem] border border-[#d7a44b]/15 bg-[linear-gradient(135deg,rgba(255,255,255,.035),transparent_50%)] px-5 py-6 sm:px-7 md:grid-cols-[1fr_auto] md:items-center md:py-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#d7a44b]/25 bg-[#d7a44b]/10 text-[#e0b560]">
                <BookOpenText className="h-6 w-6" />
              </div>
              <div>
                <p className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.26em] text-[#d7a44b]">
                  <Sparkles className="h-3 w-3" /> Original Menu Book
                </p>
                <h2 className="mt-1.5 font-display text-2xl text-[#fff7e7] sm:text-3xl">
                  Open the original menu — now interactive.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#eadbc7]/55">
                  Turn through the restaurant menu like a digital book, tap dishes to build your order,
                  then send it directly to Ayodhya on WhatsApp.
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d7a44b]/30 bg-[#d7a44b]/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#fff7e7] transition group-hover:border-[#d7a44b]/60 group-hover:bg-[#d7a44b]/18">
              Enter Menu Vault <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>

        <div className="mt-10">
          <MenuExplorer key={initialCategory} items={items} categories={categories} initialCategory={initialCategory} />
        </div>

        <p className="mt-10 text-center text-xs text-walnut/70">
          Prices shown match the restaurant menu provided to us. Taxes are not included; availability may vary.
        </p>
      </div>
    </div>
  );
}
