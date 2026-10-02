import RoyalMenuBook from "@/components/RoyalMenuBook";

export const metadata = {
  title: "Ayodhya Restaurant Betul Menu Book | Full Vegetarian Menu",
  description:
    "Browse the full Ayodhya Restaurant Betul menu book with vegetarian starters, dosa, North Indian, South Indian, Chinese, pizza, rice, desserts and beverages.",
  alternates: { canonical: "/menu-book" },
  openGraph: {
    title: "Ayodhya Restaurant Betul Menu Book",
    description: "Browse the full vegetarian menu at Ayodhya Restaurant in Ganj, Betul.",
    url: "/menu-book",
  },
};

export default function MenuBookPage() {
  return <RoyalMenuBook />;
}
