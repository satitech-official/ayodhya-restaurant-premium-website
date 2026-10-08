export default function JsonLd() {
  const restaurantId = "https://ayodhyarestaurant.com/#restaurant";
  const websiteId = "https://ayodhyarestaurant.com/#website";
  const menuId = "https://ayodhyarestaurant.com/menu#menu";

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: "https://ayodhyarestaurant.com/",
        name: "Ayodhya Restaurant Betul",
        alternateName: "Ayodhya Restaurant",
        description:
          "Official website of Ayodhya Restaurant, a pure vegetarian family restaurant in Ganj, Betul, Madhya Pradesh.",
        inLanguage: "en-IN",
        publisher: { "@id": restaurantId },
      },
      {
        "@type": "Restaurant",
        "@id": restaurantId,
        name: "Ayodhya Restaurant",
        legalName: "Rakesh Malviya",
        owner: { "@type": "Person", name: "Rakesh Malviya" },
        alternateName: ["Ayodhya Restaurant Betul", "Ayodhya Family Restaurant Betul"],
        slogan: "Where Taste Meets Tradition",
        description:
          "Pure vegetarian family restaurant in Civil Lines, Ganj, Betul near Lashkare Hospital serving North Indian, South Indian, Chinese, pizza, pasta, dosa, desserts, shakes and beverages.",
        url: "https://ayodhyarestaurant.com/",
        mainEntityOfPage: { "@id": websiteId },
        menu: "https://ayodhyarestaurant.com/menu",
        hasMenu: {
          "@type": "Menu",
          "@id": menuId,
          name: "Ayodhya Restaurant Betul Menu",
          url: "https://ayodhyarestaurant.com/menu",
        },
        image: [
          "https://ayodhyarestaurant.com/og.png",
          "https://ayodhyarestaurant.com/brand/ayodhya-full-logo.jpg",
        ],
        logo: "https://ayodhyarestaurant.com/brand/ayodhya-full-logo.jpg",
        telephone: "+917024242488",
        publicAccess: true,
        isAccessibleForFree: true,
        priceRange: "₹₹",
        paymentAccepted: "Cash, UPI, Cards",
        currenciesAccepted: "INR",
        acceptsReservations: true,
        servesCuisine: [
          "North Indian",
          "South Indian",
          "Chinese",
          "Indo-Chinese",
          "Dosa",
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
        areaServed: [
          { "@type": "City", name: "Betul" },
          { "@type": "Place", name: "Ganj, Betul" },
          { "@type": "Place", name: "Civil Lines, Betul" },
        ],
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
          "https://www.swiggy.com/city/betul/ayodhya-restaurant-betul-town-rest951062",
        ],
        hasMap:
          "https://www.google.com/maps/search/?api=1&query=Ayodhya%20Restaurant%20Ganj%20Betul%20Madhya%20Pradesh",
        identifier: {
          "@type": "PropertyValue",
          name: "Google Place ID",
          value: "ChIJf0OCHBcJ1jsRfx8E9DDfavw",
        },
        potentialAction: [
          {
            "@type": "ReserveAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://ayodhyarestaurant.com/reserve",
            },
            result: { "@type": "FoodEstablishmentReservation" },
          },
          {
            "@type": "OrderAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://ayodhyarestaurant.com/takeaway",
            },
          },
        ],
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
