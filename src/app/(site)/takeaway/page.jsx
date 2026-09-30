import TakeawayOrder from "@/components/TakeawayOrder";
import { getCategories, getMenuItems } from "@/lib/data";

export const revalidate = 300;

export const metadata = {
  title: "Takeaway & Self Pickup | Ayodhya Restaurant Betul",
  description:
    "Order takeaway from Ayodhya Restaurant Betul. Choose dishes online, send your self-pickup order and collect it fresh from Civil Lines, Ganj, Betul.",
  alternates: {
    canonical: "/takeaway/",
  },
  openGraph: {
    title: "Takeaway & Self Pickup | Ayodhya Restaurant Betul",
    description:
      "Choose your favourites, send a pickup order and collect it fresh from Ayodhya Restaurant in Betul.",
    url: "/takeaway/",
  },
};

export default async function TakeawayPage() {
  const [items, categories] = await Promise.all([getMenuItems(), getCategories()]);

  return <TakeawayOrder items={items} categories={categories} />;
}
