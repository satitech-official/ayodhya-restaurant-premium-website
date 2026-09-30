import "./globals.css";
import { StartupIntro, CustomCursor, BackToTop } from "@/components/GlobalEffects";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  metadataBase: new URL("https://ayodhyarestaurant.com"),
  title: {
    default: "Ayodhya Restaurant Betul | Great Food, Great Moments",
    template: "%s | Ayodhya Restaurant Betul",
  },
  description:
    "Discover Ayodhya Restaurant in Ganj, Betul — serving North Indian, South Indian, Indo-Chinese, pizzas, dosas, beverages and much more. Explore the menu, reserve a table and find us easily.",
  keywords: [
    "Ayodhya Restaurant Betul",
    "restaurant in Betul",
    "best restaurant in Betul",
    "family restaurant Betul",
    "dosa in Betul",
    "South Indian restaurant Betul",
    "North Indian restaurant Betul",
    "vegetarian food Betul",
    "restaurant near Ganj Betul",
    "restaurant near Lashkare Hospital Betul",
    "restaurant Civil Lines Betul",
    "pure veg restaurant Betul",
    "best family dining Betul",
    "Ayodhya Restaurant Ganj Betul",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ayodhya Restaurant Betul | Great Food, Great Moments",
    description:
      "North Indian, South Indian, Indo-Chinese, pizzas, dosas and beverages — in the heart of Ganj, Betul. Reserve a table or order today.",
    url: "https://ayodhyarestaurant.com",
    siteName: "Ayodhya Restaurant",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Ayodhya Restaurant, Betul" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayodhya Restaurant Betul | Great Food, Great Moments",
    description:
      "North Indian, South Indian, Indo-Chinese, pizzas, dosas and beverages — in the heart of Ganj, Betul.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  themeColor: "#32170c",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-cream font-sans text-espresso antialiased">
        <JsonLd />
        <StartupIntro />
        <CustomCursor />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
