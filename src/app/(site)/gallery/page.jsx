import GalleryPage from "@/components/GalleryPage";
import VideoGallery from "@/components/VideoGallery";
import { getGallery } from "@/lib/data";

export const revalidate = 300;

export const metadata = {
  title: "Ayodhya Restaurant Betul Photos | Food, Dining & Celebrations",
  description:
    "See photos and videos from Ayodhya Restaurant in Ganj, Betul — dining ambience, signature dishes, celebrations and restaurant experiences.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Ayodhya Restaurant Betul Photos",
    description:
      "Explore Ayodhya Restaurant's dining ambience, food and celebrations in Ganj, Betul.",
    url: "/gallery",
  },
};

export default async function GalleryRoute() {
  const images = await getGallery();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  const videos = [
    { src: "https://gcdn.picsart.com/editing-temp/bcdefeb1-7fd1-4b04-afba-114e1836bb14.mp4", title: "From the Ayodhya Kitchen", label: "Live Preparation" },
    { src: "https://gcdn.picsart.com/editing-temp/570bdba7-8cb4-4797-b9e1-48e7b4ee0665.mp4", title: "A Signature Serve", label: "Food Story" },
    { src: "https://gcdn.picsart.com/editing-temp/06c99ee8-bb59-48de-8597-c51361a36796.mp4", title: "Inside Ayodhya", label: "Restaurant Experience" },
    { src: "https://gcdn.picsart.com/editing-temp/08f1ef2e-ba58-4ddd-9879-43766731d4a0.mp4", title: "The Ayodhya Ambience", label: "Walk Through" },
  ];

  const realPhotos = [
    {
      id: "ayodhya-real-1",
      image: `${basePath}/gallery/ayodhya-real-1.webp`,
      caption: "Window-side dining at Ayodhya",
      category: "Restaurant",
      sortOrder: -4,
    },
    {
      id: "ayodhya-real-2",
      image: `${basePath}/gallery/ayodhya-real-2.webp`,
      caption: "Birthday celebration setup at Ayodhya",
      category: "Events",
      sortOrder: -3,
    },
    {
      id: "ayodhya-real-3",
      image: `${basePath}/gallery/ayodhya-real-3.webp`,
      caption: "Ayodhya dining room, ready for guests",
      category: "Restaurant",
      sortOrder: -2,
    },
    {
      id: "ayodhya-real-4",
      image: `${basePath}/gallery/ayodhya-real-4.webp`,
      caption: "A bright corner overlooking Ganj, Betul",
      category: "Restaurant",
      sortOrder: -1,
    },
  ];

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
          <GalleryPage images={[...realPhotos, ...images]} />
          <VideoGallery videos={videos} />
        </div>
      </div>
    </div>
  );
}
