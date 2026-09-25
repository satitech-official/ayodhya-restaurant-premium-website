import LuxuryHome from "@/components/LuxuryHome";
import LocationMap from "@/components/LocationMap";
import {
  getSettings,
  getMenuItems,
  getGallery,
  getApprovedReviews,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, items, gallery, reviews] = await Promise.all([
    getSettings(),
    getMenuItems(),
    getGallery(),
    getApprovedReviews(),
  ]);

  const signatures = items.filter((item) => item.signature || item.bestseller).slice(0, 8);

  return (
    <>
      <LuxuryHome
        settings={settings}
        signatures={signatures}
        gallery={gallery}
        reviews={reviews}
      />
      <LocationMap settings={settings} />
    </>
  );
}
