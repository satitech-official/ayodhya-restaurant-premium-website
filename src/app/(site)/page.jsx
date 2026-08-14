import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Signatures from "@/components/Signatures";
import DosaExperience from "@/components/DosaExperience";
import CravingSelector from "@/components/CravingSelector";
import MenuPreview from "@/components/MenuPreview";
import FamilyDining from "@/components/FamilyDining";
import ComboSection from "@/components/ComboSection";
import ExperienceGallery from "@/components/ExperienceGallery";
import OffersSection from "@/components/OffersSection";
import SocialFeed from "@/components/SocialFeed";
import ReviewsSection from "@/components/ReviewsSection";
import ReservationCTA from "@/components/ReservationCTA";
import LocationMap from "@/components/LocationMap";
import {
  getSettings,
  getMenuItems,
  getActiveOffers,
  getGallery,
  getApprovedReviews,
  getCategories,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, items, offers, gallery, reviews, categories] = await Promise.all([
    getSettings(),
    getMenuItems(),
    getActiveOffers(),
    getGallery(),
    getApprovedReviews(),
    getCategories(),
  ]);

  const signatures = items.filter((i) => i.signature).slice(0, 8);
  const social = gallery
    .filter((g) => ["Food", "Dosa Specials", "Beverages", "Restaurant"].includes(g.category))
    .slice(0, 6);

  return (
    <>
      <Hero settings={settings} />
      <Story />
      <Signatures items={signatures} />
      <DosaExperience />
      <CravingSelector items={items} />
      <MenuPreview items={items} categories={categories} />
      <FamilyDining />
      <ComboSection />
      <ExperienceGallery images={gallery} />
      <OffersSection offers={offers} />
      <SocialFeed images={social} />
      <ReviewsSection reviews={reviews} />
      <ReservationCTA />
      <LocationMap settings={settings} />
    </>
  );
}
