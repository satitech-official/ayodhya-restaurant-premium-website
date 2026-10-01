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
    image: "https://ayodhyarestaurant.com/og.png",
    logo: "https://ayodhyarestaurant.com/brand/ayodhya-hero-logo.webp",
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
      streetAddress: "In front of Lashkare Hospital, Main Road, Housing Board Colony, Ganj",
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
    hasMap: "https://www.google.com/maps/search/?api=1&query=Ayodhya%20Restaurant%20Ganj%20Betul%20Madhya%20Pradesh",
    identifier: {
      "@type": "PropertyValue",
      name: "Google Place ID",
      value: "ChIJf0OCHBcJ1jsRfx8E9DDfavw",
    },
    potentialAction: [
      {
        "@type": "ReserveAction",
        target: "https://ayodhyarestaurant.com/reserve/",
        result: { "@type": "FoodEstablishmentReservation" },
      },
      {
        "@type": "OrderAction",
        target: "https://ayodhyarestaurant.com/takeaway/",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
