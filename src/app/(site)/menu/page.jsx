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

        <div className="mt-10">
          <MenuExplorer key={initialCategory} items={items} categories={categories} initialCategory={initialCategory} />
        </div>

        <p className="mt-10 text-center text-xs text-walnut/70">
          Menu prices are indicative — please confirm current rates and availability with the restaurant.
        </p>
      </div>
    </div>
  );
}
