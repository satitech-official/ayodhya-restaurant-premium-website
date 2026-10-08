import "./globals.css";
import { StartupIntro, CustomCursor, BackToTop } from "@/components/GlobalEffects";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  metadataBase: new URL("https://ayodhyarestaurant.com"),
  title: {
    default: "Ayodhya Restaurant Betul | Pure Veg Family Restaurant",
    template: "%s | Ayodhya Restaurant Betul",
  },
  description:
    "Ayodhya Restaurant in Ganj, Betul is a pure vegetarian family restaurant near Lashkare Hospital serving North Indian, South Indian, Chinese, dosa, pizza and more. View the menu, order takeaway or reserve a table.",
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
    "veg restaurant near Lashkare Hospital",
    "family dinner in Betul",
    "vegetarian restaurant Civil Lines Betul",
  ],
  alternates: {
    canonical: "/",
  },
  applicationName: "Ayodhya Restaurant Betul",
  authors: [{ name: "Ayodhya Restaurant" }],
  creator: "Ayodhya Restaurant",
  publisher: "Ayodhya Restaurant",
  category: "Restaurant",
  icons: {
    icon: [{ url: "/brand/ayodhya-favicon.jpg", type: "image/jpeg", sizes: "192x192" }],
    shortcut: ["/brand/ayodhya-favicon.jpg"],
    apple: [{ url: "/brand/ayodhya-favicon.jpg", type: "image/jpeg", sizes: "192x192" }],
  },
  other: {
    "geo.region": "IN-MP",
    "geo.placename": "Betul, Madhya Pradesh",
    "business:contact_data:locality": "Betul",
    "business:contact_data:street_address": "Civil Lines, Near Lashkare Hospital, Ganj",
    "business:contact_data:phone_number": "+917024242488",
    "business:contact_data:region": "Madhya Pradesh",
    "business:contact_data:postal_code": "460001",
    "business:contact_data:country_name": "India",
  },
  openGraph: {
    title: "Ayodhya Restaurant Betul | Pure Veg Family Restaurant",
    description:
      "Pure vegetarian family dining in Ganj, Betul near Lashkare Hospital. Explore North Indian, South Indian, Chinese, dosa, pizza and more.",
    url: "https://ayodhyarestaurant.com",
    siteName: "Ayodhya Restaurant",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Ayodhya Restaurant, Betul" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayodhya Restaurant Betul | Pure Veg Family Restaurant",
    description:
      "Pure vegetarian family restaurant in Ganj, Betul near Lashkare Hospital serving North Indian, South Indian, Chinese, dosa, pizza and more.",
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
    <html lang="en-IN">
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
