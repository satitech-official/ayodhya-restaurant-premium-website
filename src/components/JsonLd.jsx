export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Ayodhya Restaurant",
    description:
      "Modern family restaurant in Ganj, Betul serving North Indian, South Indian, Indo-Chinese, pizzas, dosas, desserts, shakes and beverages.",
    url: "https://ayodhyarestaurant.in",
    telephone: "+91 70242 42488",
    priceRange: "₹₹",
    servesCuisine: [
      "North Indian",
      "South Indian",
      "Indo-Chinese",
      "Pizza",
      "Pasta",
      "Desserts",
      "Beverages",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "In front of Lashkare Hospital, Main Road / Housing Board Colony, Ganj",
      addressLocality: "Betul",
      addressRegion: "Madhya Pradesh",
      postalCode: "460001",
      addressCountry: "IN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "11:00",
        closes: "23:00",
      },
    ],
    sameAs: ["https://instagram.com/ayodhyarestaurantt"],
    hasMap: "https://www.google.com/maps/search/?api=1&query=Ayodhya%20Restaurant%20Ganj%20Betul",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
