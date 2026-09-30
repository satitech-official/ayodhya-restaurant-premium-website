export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": "https://ayodhyarestaurant.com/#restaurant",
    name: "Ayodhya Restaurant",
    alternateName: "Ayodhya Restaurant Betul",
    description:
      "Family vegetarian restaurant in Civil Lines, Ganj, Betul serving North Indian, South Indian, Indo-Chinese, pizza, pasta, desserts, shakes and beverages.",
    url: "https://ayodhyarestaurant.com/",
    menu: "https://ayodhyarestaurant.com/menu/",
    telephone: "+917024242488",
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    acceptsReservations: true,
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
      streetAddress: "Civil Lines, Near Lashkare Hospital, Ganj",
      addressLocality: "Betul",
      addressRegion: "Madhya Pradesh",
      postalCode: "460001",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "City",
      name: "Betul",
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
    sameAs: [
      "https://instagram.com/ayodhyarestaurantt",
      "https://www.zomato.com/betul/ayodhya-restaurant-betul-locality",
      "https://www.swiggy.com/city/betul/ayodhya-restaurant-betul-town-rest951062"
    ],
    hasMap: "https://www.google.com/maps/search/?api=1&query=Ayodhya%20Restaurant%20Civil%20Lines%20Ganj%20Betul",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
