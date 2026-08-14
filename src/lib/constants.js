// ─────────────────────────────────────────────────────────────────────────────
// Central brand data for Ayodhya Restaurant, Betul.
// Everything the site displays (except DB-managed content) lives here so it is
// easy to audit and keep consistent.
// ─────────────────────────────────────────────────────────────────────────────

export const RESTAURANT = {
  name: "Ayodhya Restaurant",
  shortName: "Ayodhya",
  tagline: "Flavours That Bring People Together.",
  phoneDisplay: "+91 70242 42488",
  phoneHref: "tel:+917024242488",
  whatsappHref: "https://wa.me/917024242488",
  addressLines: [
    "In front of Lashkare Hospital",
    "Main Road / Housing Board Colony",
    "Ganj, Betul, Madhya Pradesh 460001",
  ],
  addressShort: "Ganj, Betul, Madhya Pradesh 460001",
  city: "Betul",
  instagramHandle: "@ayodhyarestaurantt",
  instagramUrl: "https://instagram.com/ayodhyarestaurantt",
  facebookUrl: "https://www.facebook.com/search/top?q=Ayodhya%20Restaurant%20Betul",
  mapsQuery: "Ayodhya Restaurant, Ganj, Betul, Madhya Pradesh 460001",
  mapsDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Ayodhya%20Restaurant%2C%20Ganj%2C%20Betul%2C%20Madhya%20Pradesh%20460001",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=" +
    encodeURIComponent("Ayodhya Restaurant, Ganj, Betul, Madhya Pradesh 460001") +
    "&t=&z=15&ie=UTF8&iwloc=&output=embed",
  orderLinks: {
    zomato: "https://www.zomato.com/search?q=Ayodhya+Restaurant+Betul",
    swiggy: "https://www.swiggy.com/search?query=Ayodhya+Restaurant+Betul",
  },
  email: "hello@ayodhyarestaurant.in",
};

export const CUISINES = [
  "North Indian",
  "South Indian",
  "Indo-Chinese",
  "Pizza",
  "Pasta",
  "Sandwiches",
  "Chaat",
  "Desserts",
  "Shakes & Beverages",
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Experience", href: "/#experience" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const MENU_CATEGORIES = [
  { slug: "recommended", name: "Recommended", icon: "⭐" },
  { slug: "starters", name: "Starters", icon: "🥟" },
  { slug: "pizza", name: "Pizza", icon: "🍕" },
  { slug: "kebabs", name: "Kebabs", icon: "🍢" },
  { slug: "chinese", name: "Chinese", icon: "🥢" },
  { slug: "soups-salads", name: "Soups & Salads", icon: "🍲" },
  { slug: "north-indian", name: "North Indian", icon: "🍛" },
  { slug: "paneer-specials", name: "Paneer Specials", icon: "🧀" },
  { slug: "rice-biryani", name: "Rice & Biryani", icon: "🍚" },
  { slug: "breads", name: "Breads", icon: "🫓" },
  { slug: "south-indian", name: "South Indian", icon: "🥞" },
  { slug: "dosa-specials", name: "Dosa Specials", icon: "🌯" },
  { slug: "delhi-chaat", name: "Delhi Chaat", icon: "🫕" },
  { slug: "pasta", name: "Pasta", icon: "🍝" },
  { slug: "noodles", name: "Noodles", icon: "🍜" },
  { slug: "sandwiches", name: "Sandwiches", icon: "🥪" },
  { slug: "maggi", name: "Maggi", icon: "🍥" },
  { slug: "desserts", name: "Desserts", icon: "🍨" },
  { slug: "shakes", name: "Shakes", icon: "🥤" },
  { slug: "beverages", name: "Beverages", icon: "🍹" },
  { slug: "combos", name: "Combos", icon: "🎁" },
];

export const MENU_FILTERS = [
  { id: "veg", label: "Veg" },
  { id: "spicy", label: "Spicy" },
  { id: "popular", label: "Popular" },
  { id: "south-indian", label: "South Indian" },
  { id: "north-indian", label: "North Indian" },
  { id: "chinese", label: "Chinese" },
  { id: "quick-bites", label: "Quick Bites" },
  { id: "beverages", label: "Beverages" },
];

export const OCCASIONS = [
  "Regular Dining",
  "Family Dinner",
  "Couple Dinner",
  "Birthday",
  "Group Dinner",
  "Other",
];

export const SEATING_PREFERENCES = [
  "No preference",
  "Window side",
  "Family section",
  "Quiet corner",
  "Garden / Outdoor",
  "Near the counter",
];

export const CRAVINGS = [
  { id: "crispy", label: "Crispy", emoji: "✨" },
  { id: "cheesy", label: "Cheesy", emoji: "🧀" },
  { id: "spicy", label: "Spicy", emoji: "🌶️" },
  { id: "creamy", label: "Creamy", emoji: "🥛" },
  { id: "refreshing", label: "Refreshing", emoji: "🍋" },
  { id: "desi", label: "Desi", emoji: "🪔" },
  { id: "light", label: "Light", emoji: "🌿" },
];

export const COMBOS = [
  {
    id: "couple-combo",
    people: 2,
    title: "Couple Combo",
    price: 499,
    image: "paneer2",
    note: "Two mains, two breads, two beverages.",
    items: ["Choice of 2 North Indian mains", "4 Butter Naan", "2 Cold Beverages"],
  },
  {
    id: "combo-2",
    people: 2,
    title: "Combo for 2",
    price: 399,
    image: "biryani2",
    note: "A quick, satisfying meal for two.",
    items: ["2 Dosas or 2 Rice bowls", "1 shared starter", "2 Beverages"],
  },
  {
    id: "combo-4",
    people: 4,
    title: "Combo for 4",
    price: 799,
    image: "pav2",
    note: "Built for family-style sharing.",
    items: ["2 Starters", "3 Mains + Breads", "4 Beverages", "1 Dessert"],
  },
  {
    id: "combo-6",
    people: 6,
    title: "Combo for 6",
    price: 1199,
    image: "family2",
    note: "A full spread for bigger tables.",
    items: ["3 Starters", "4 Mains + Breads", "6 Beverages", "2 Desserts"],
  },
];

export const DOSA_EXPERIENCE = [
  {
    name: "Masala Dosa",
    tag: "Classic",
    spice: 1,
    description:
      "Crisp golden crepe folded around a spiced potato masala, served with sambar and coconut chutney.",
    ingredients: ["Fermented rice batter", "Spiced potato masala", "Sambar", "Coconut chutney"],
    image: "dosa1",
    price: 130,
  },
  {
    name: "Jini Paneer Dosa",
    tag: "Loaded",
    spice: 2,
    description:
      "A street-famous loaded dosa tossed with cheese, paneer, capsicum and tangy house sauces.",
    ingredients: ["Cheese", "Paneer", "Capsicum", "House sauces"],
    image: "dosa3",
    price: 210,
  },
  {
    name: "Cheese Burst Dosa",
    tag: "Cheesy",
    spice: 1,
    description:
      "A molten, pull-apart cheese core inside a crackling dosa — pure comfort in every bite.",
    ingredients: ["Mozzarella blend", "Butter", "Masala base"],
    image: "dosa4",
    price: 200,
  },
  {
    name: "AK-47 Dosa",
    tag: "Fiery",
    spice: 4,
    description:
      "Not for the faint-hearted — a fiery schezwan-loaded dosa that lives up to its name.",
    ingredients: ["Schezwan chutney", "Chilli masala", "Crunchy veggies"],
    image: "dosa5",
    price: 220,
  },
  {
    name: "Bhurj Khalifa Dosa",
    tag: "Showstopper",
    spice: 3,
    description:
      "Our tallest, most loaded dosa — stacked with bhurji-style paneer, veggies and cheese.",
    ingredients: ["Paneer bhurji", "Cheese", "Capsicum", "Special spices"],
    image: "dosa2",
    price: 230,
  },
];

export const HERO_SLIDES = [
  { image: "interior1", kicker: "Welcome to Ayodhya", title: "Great Food Deserves Great Memories." },
  { image: "dosa1", kicker: "From the Dosa Counter", title: "Dosa Worth Talking About." },
  { image: "paneer2", kicker: "From the North Indian Kitchen", title: "From Crispy Dosas to Creamy Curries." },
  { image: "pizza1", kicker: "Fresh From the Oven", title: "One Table. Many Cravings." },
  { image: "mojito1", kicker: "From the Beverage Bar", title: "Sip, Share & Stay A While." },
];

// Pexels image ids — used with the img() helper for responsive, cached URLs.
export const IMAGES = {
  // interior & ambience
  interior1: 26729397,
  interior2: 29309717,
  interior3: 17109124,
  interior4: 6876621,
  interior5: 26729400,
  interior6: 33234706,
  // dosa
  dosa1: 20422138,
  dosa2: 20422123,
  dosa3: 20422121,
  dosa4: 20422133,
  dosa5: 20422129,
  // paneer / north indian
  paneer1: 35993886,
  paneer2: 11188417,
  paneer3: 30858420,
  paneer4: 12737816,
  // pizza
  pizza1: 1552635,
  pizza2: 11975887,
  pizza3: 29173086,
  // pav bhaji
  pav1: 166654,
  pav2: 34507155,
  pav3: 17223838,
  // biryani / rice
  biryani1: 12669168,
  biryani2: 7593267,
  biryani3: 35287417,
  biryani4: 15058974,
  // beverages
  mojito1: 4051265,
  mojito2: 2698886,
  mojito3: 5370563,
  mojito4: 2789328,
  drink1: 35667645,
  // pasta
  pasta1: 1438672,
  pasta2: 29173118,
  pasta3: 15813476,
  pasta4: 3214160,
  // desserts
  dessert1: 33312980,
  dessert2: 16785689,
  dessert3: 14753356,
  // sandwiches
  sand1: 8023677,
  sand2: 20422166,
  sand3: 30346820,
  // noodles
  noodle1: 2347311,
  noodle2: 2456435,
  noodle3: 2456434,
  // manchurian / chinese
  manch1: 35066808,
  manch2: 30604608,
  manch3: 28674541,
  // shakes
  shake1: 18142621,
  shake2: 5005919,
  shake3: 18142622,
  // samosa / chaat
  samosa1: 5031949,
  samosa2: 36170557,
  samosa3: 9738980,
  // paneer tikka / kebab
  tikka1: 29173093,
  tikka2: 20395267,
  tikka3: 8414639,
  // people / groups
  family1: 3184177,
  family2: 4262169,
  family3: 3184184,
  family4: 20488466,
  // breads
  naan1: 28125427,
  naan2: 6183640,
  naan3: 20446402,
  // idli / south indian breakfast
  idli1: 20422128,
  idli2: 20422132,
  idli3: 20408455,
  // salads
  salad1: 8845416,
  salad2: 6129267,
  salad3: 2531197,
  // chai
  chai1: 36662612,
};

/** Build a responsive, auto-compressed Pexels image URL for a given id. */
export function img(id, w = 1200, h = 800) {
  if (!id) return "";
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;
}

export const DEFAULT_HOURS = {
  monday: { open: "11:00", close: "23:00", closed: false },
  tuesday: { open: "11:00", close: "23:00", closed: false },
  wednesday: { open: "11:00", close: "23:00", closed: false },
  thursday: { open: "11:00", close: "23:00", closed: false },
  friday: { open: "11:00", close: "23:00", closed: false },
  saturday: { open: "11:00", close: "23:00", closed: false },
  sunday: { open: "11:00", close: "23:00", closed: false },
};

export const DEFAULT_SETTINGS = {
  announcement: "",
  phone: RESTAURANT.phoneDisplay,
  email: RESTAURANT.email,
  address: RESTAURANT.addressLines.join(", "),
  instagram: RESTAURANT.instagramUrl,
  facebook: RESTAURANT.facebookUrl,
  zomato: RESTAURANT.orderLinks.zomato,
  swiggy: RESTAURANT.orderLinks.swiggy,
  hours: DEFAULT_HOURS,
};

