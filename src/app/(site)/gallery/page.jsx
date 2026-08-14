import GalleryPage from "@/components/GalleryPage";
import { getGallery } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery",
  description:
    "Explore Ayodhya Restaurant in pictures — our dining room, signature dosas, beverages, celebrations and more in Ganj, Betul.",
};

export default async function GalleryRoute() {
  const images = await getGallery();

  return (
    <div className="bg-cream pb-24 pt-28 lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-terracotta">
            <span className="h-px w-8 bg-current opacity-60" /> Gallery
          </p>
          <h1 className="text-balance font-display text-5xl font-semibold leading-[1.02] text-charcoal sm:text-6xl">
            More Than a Meal.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-walnut">
            A look inside our dining room, our counters and the plates that make Betul talk. Tap any
            photo to view it fullscreen.
          </p>
        </div>

        <div className="mt-10">
          <GalleryPage images={images} />
        </div>
      </div>
    </div>
  );
}
