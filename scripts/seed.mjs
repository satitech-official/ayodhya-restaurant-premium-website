// Seed script for Ayodhya Restaurant (idempotent).
// Usage: node scripts/seed.mjs
import dotenv from "dotenv";
import pg from "pg";
import crypto from "node:crypto";

const { Pool } = pg;

dotenv.config({ path: ".env.local" });
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("Seed aborted: DATABASE_URL is not set. Copy .env.example to .env.local and add your PostgreSQL connection string.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const px = (id, w = 1000, h = 750) =>
  id
    ? `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`
    : "";

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

const CATEGORIES = [
  { name: "Recommended", slug: "recommended", icon: "⭐", sortOrder: 1 },
  { name: "Starters", slug: "starters", icon: "🥟", sortOrder: 2 },
  { name: "Pizza", slug: "pizza", icon: "🍕", sortOrder: 3 },
  { name: "Kebabs", slug: "kebabs", icon: "🍢", sortOrder: 4 },
  { name: "Chinese", slug: "chinese", icon: "🥢", sortOrder: 5 },
  { name: "Soups & Salads", slug: "soups-salads", icon: "🍲", sortOrder: 6 },
  { name: "North Indian", slug: "north-indian", icon: "🍛", sortOrder: 7 },
  { name: "Paneer Specials", slug: "paneer-specials", icon: "🧀", sortOrder: 8 },
  { name: "Rice & Biryani", slug: "rice-biryani", icon: "🍚", sortOrder: 9 },
  { name: "Breads", slug: "breads", icon: "🫓", sortOrder: 10 },
  { name: "South Indian", slug: "south-indian", icon: "🥞", sortOrder: 11 },
  { name: "Dosa Specials", slug: "dosa-specials", icon: "🌯", sortOrder: 12 },
  { name: "Delhi Chaat", slug: "delhi-chaat", icon: "🫕", sortOrder: 13 },
  { name: "Pasta", slug: "pasta", icon: "🍝", sortOrder: 14 },
  { name: "Noodles", slug: "noodles", icon: "🍜", sortOrder: 15 },
  { name: "Sandwiches", slug: "sandwiches", icon: "🥪", sortOrder: 16 },
  { name: "Maggi", slug: "maggi", icon: "🍥", sortOrder: 17 },
  { name: "Desserts", slug: "desserts", icon: "🍨", sortOrder: 18 },
  { name: "Shakes", slug: "shakes", icon: "🥤", sortOrder: 19 },
  { name: "Beverages", slug: "beverages", icon: "🍹", sortOrder: 20 },
  { name: "Combos", slug: "combos", icon: "🎁", sortOrder: 21 },
];

// name, category slug, cuisine, price, image id, spicy, recommended, bestseller, signature, description
const ITEMS = [
  // Starters
  ["Pav Bhaji", "starters", "Street Favourite", 150, 34507155, 2, 1, 1, 1, "Mumbai-style buttery mashed vegetable bhaji with toasted, buttered pav."],
  ["Paneer Tikka", "kebabs", "North Indian", 210, 20395267, 2, 1, 1, 0, "Char-grilled paneer cubes in a smoky tandoori marinade, finished with lemon."],
  ["Hara Bhara Kebab", "kebabs", "North Indian", 160, 29173093, 0, 0, 0, 0, "Golden spinach-and-potato patties, crisp outside, soft inside, with mint chutney."],
  ["Chilli Paneer", "chinese", "Indo-Chinese", 220, 30604608, 3, 0, 1, 0, "Wok-tossed paneer, peppers and onion in a glossy, fiery soy-chilli glaze."],
  ["Veg Manchurian Dry", "chinese", "Indo-Chinese", 170, 35066808, 2, 0, 0, 0, "Crisp vegetable dumplings tossed with soy, garlic and a hint of chilli."],
  ["Crispy Corn", "starters", "Quick Bites", 180, 35066808, 1, 0, 0, 0, "Golden-fried sweet corn dusted with tangy chaat masala."],
  ["Veg Spring Rolls", "starters", "Indo-Chinese", 160, 5031949, 1, 0, 0, 0, "Hand-rolled crispy rolls stuffed with crunchy vegetables, served hot."],
  ["Paneer 65", "starters", "South Indian", 210, 30604608, 3, 0, 0, 0, "South-Indian style fried paneer with curry leaves, green chilli and yogurt."],

  // Soups & Salads
  ["Hot & Sour Soup", "soups-salads", "Indo-Chinese", 130, 12737816, 2, 0, 0, 0, "Peppery, tangy broth with crunchy vegetables — a warming start."],
  ["Sweet Corn Soup", "soups-salads", "Indo-Chinese", 120, 11188417, 0, 0, 0, 0, "Silky, comforting corn soup with delicate seasoning."],
  ["Manchow Soup", "soups-salads", "Indo-Chinese", 130, 30604608, 2, 0, 0, 0, "Spicy Indo-Chinese soup topped with crispy noodles."],
  ["Veg Clear Soup", "soups-salads", "Indo-Chinese", 120, 12737816, 0, 0, 0, 0, "Light, aromatic vegetable broth with garden vegetables."],
  ["Green Salad", "soups-salads", "Fresh", 90, 8845416, 0, 0, 0, 0, "Crisp cucumber, onion, tomato and carrot with a lemon dressing."],

  // Chinese
  ["Veg Fried Rice", "chinese", "Indo-Chinese", 150, 7593267, 1, 0, 0, 0, "Wok-tossed rice with vegetables and a whisper of soy."],
  ["Schezwan Fried Rice", "chinese", "Indo-Chinese", 170, 12669168, 3, 0, 0, 0, "Fiery schezwan rice with crunchy vegetables."],
  ["Veg Manchurian Gravy", "chinese", "Indo-Chinese", 180, 35066808, 2, 1, 1, 0, "Veg dumplings simmered in a rich, garlicky soy gravy."],
  ["Chilli Mushroom", "chinese", "Indo-Chinese", 210, 30604608, 3, 0, 0, 0, "Button mushrooms in a sticky, spicy chilli sauce."],

  // Noodles
  ["Hakka Noodles", "noodles", "Indo-Chinese", 140, 2347311, 1, 0, 1, 0, "Smoky wok-fried noodles with crisp vegetables."],
  ["Schezwan Noodles", "noodles", "Indo-Chinese", 170, 2456435, 3, 0, 0, 0, "Noodles tossed in a bold, spicy schezwan sauce."],
  ["Chilli Garlic Noodles", "noodles", "Indo-Chinese", 160, 2456434, 2, 0, 0, 0, "Garlic-forward noodles with a warm chilli kick."],
  ["Singapore Noodles", "noodles", "Indo-Chinese", 180, 28895977, 2, 0, 0, 0, "Curried, lightly spiced noodles with colourful vegetables."],

  // North Indian
  ["Dal Tadka", "north-indian", "North Indian", 170, 11188417, 1, 0, 0, 0, "Slow-simmered lentils tempered with ghee, garlic and cumin."],
  ["Dal Makhani", "north-indian", "North Indian", 190, 11188417, 0, 1, 1, 0, "Creamy black lentils cooked low and slow with butter."],
  ["Kadhai Paneer", "north-indian", "North Indian", 230, 12737816, 2, 0, 0, 0, "Paneer and peppers tossed in a robust kadhai masala."],
  ["Shahi Paneer", "north-indian", "North Indian", 240, 11188417, 0, 0, 0, 0, "Soft paneer in a rich, mildly sweet cashew-cream gravy."],
  ["Veg Kolhapuri", "north-indian", "North Indian", 200, 12737816, 3, 0, 0, 0, "Bold, spicy mixed-vegetable curry from the Kolhapur kitchen."],
  ["Malai Kofta", "north-indian", "North Indian", 230, 11188417, 0, 1, 0, 0, "Melt-in-the-mouth kofta in a silky tomato-cashew gravy."],
  ["Chana Masala", "north-indian", "North Indian", 170, 11188417, 1, 0, 0, 0, "Punjabi-style chickpeas in a tangy, spiced tomato gravy."],
  ["Mix Veg", "north-indian", "North Indian", 180, 12737816, 1, 0, 0, 0, "Seasonal vegetables in a homely onion-tomato masala."],
  ["Aloo Gobhi", "north-indian", "North Indian", 170, 12737816, 1, 0, 0, 0, "A classic of potatoes and cauliflower, dry-spiced and fragrant."],

  // Paneer Specials
  ["Paneer Rajwadi", "paneer-specials", "North Indian", 240, 35993886, 2, 1, 1, 1, "Paneer simmered in a royal, richly spiced rajwadi gravy."],
  ["Paneer Maharani", "paneer-specials", "North Indian", 250, 11188417, 1, 1, 1, 1, "A regal cashew-and-saffron gravy with tender paneer."],
  ["Paneer Butter Masala", "paneer-specials", "North Indian", 230, 11188417, 1, 1, 1, 1, "The crowd favourite — silky tomato-butter gravy with paneer."],
  ["Paneer Tikka Masala", "paneer-specials", "North Indian", 240, 30858420, 2, 0, 0, 0, "Smoked paneer tikka folded into a creamy onion masala."],
  ["Paneer Lababdar", "paneer-specials", "North Indian", 240, 28674541, 1, 0, 0, 0, "Paneer in a deep, tangy tomato-onion gravy with cream."],
  ["Paneer Bhurji", "paneer-specials", "North Indian", 200, 12737816, 1, 0, 0, 0, "Scrambled paneer cooked with onion, tomato and spices."],

  // Rice & Biryani
  ["Veg Biryani", "rice-biryani", "North Indian", 190, 12669168, 1, 1, 1, 1, "Fragrant basmati layered with vegetables, mint and whole spices."],
  ["Paneer Biryani", "rice-biryani", "North Indian", 210, 35287417, 1, 0, 0, 0, "Aromatic biryani with soft paneer and saffron-kissed rice."],
  ["Jeera Rice", "rice-biryani", "North Indian", 140, 7593267, 0, 0, 0, 0, "Basmati tempered with roasted cumin."],
  ["Steamed Rice", "rice-biryani", "North Indian", 110, 7593267, 0, 0, 0, 0, "Plain steamed basmati."],
  ["Veg Pulao", "rice-biryani", "North Indian", 150, 12669168, 0, 0, 0, 0, "Lightly spiced basmati with garden vegetables."],

  // Breads
  ["Butter Naan", "breads", "North Indian", 45, 28125427, 0, 0, 0, 0, "Soft tandoor naan brushed with butter."],
  ["Garlic Naan", "breads", "North Indian", 55, 28125427, 0, 0, 0, 0, "Naan topped with garlic and fresh coriander."],
  ["Cheese Naan", "breads", "North Indian", 75, 20446413, 0, 0, 0, 0, "Stuffed naan with molten cheese."],
  ["Tandoori Roti", "breads", "North Indian", 20, 6183640, 0, 0, 0, 0, "Whole-wheat flatbread from the tandoor."],
  ["Butter Roti", "breads", "North Indian", 25, 6183640, 0, 0, 0, 0, "Tandoori roti with a touch of butter."],
  ["Laccha Paratha", "breads", "North Indian", 45, 20446402, 0, 0, 0, 0, "Flaky, layered whole-wheat paratha."],

  // South Indian
  ["Idli Sambar", "south-indian", "South Indian", 110, 20422128, 0, 0, 1, 0, "Steamed rice cakes with sambar and chutneys."],
  ["Medu Vada", "south-indian", "South Indian", 120, 20422132, 1, 0, 0, 0, "Crisp golden lentil vadas with sambar."],
  ["Plain Dosa", "south-indian", "South Indian", 100, 20422129, 0, 0, 0, 0, "Crisp golden dosa with sambar and chutneys."],
  ["Uttapam", "south-indian", "South Indian", 140, 20408455, 1, 0, 0, 0, "Thick, soft rice-lentil pancake with onion and tomato."],
  ["Onion Rava Dosa", "south-indian", "South Indian", 150, 20422133, 1, 0, 0, 0, "Lacy, crisp rava dosa with onion."],

  // Dosa Specials
  ["Masala Dosa", "dosa-specials", "South Indian", 130, 20422138, 1, 1, 1, 1, "Crisp golden dosa with spiced potato masala, sambar and chutneys."],
  ["Mysore Masala Dosa", "dosa-specials", "South Indian", 160, 20422133, 3, 0, 0, 0, "Dosa spread with fiery mysore chutney and potato masala."],
  ["Jini Dosa", "dosa-specials", "South Indian", 190, 20422121, 2, 1, 1, 1, "Street-famous loaded dosa with cheese, veggies and tangy house sauces."],
  ["Jini Paneer Dosa", "dosa-specials", "South Indian", 210, 20422121, 2, 1, 0, 1, "Jini dosa loaded with extra paneer and cheese."],
  ["Cheese Burst Dosa", "dosa-specials", "South Indian", 200, 20422133, 1, 1, 1, 1, "A molten, pull-apart cheese core inside a crackling dosa."],
  ["Paneer Rajwadi Dosa", "dosa-specials", "South Indian", 210, 20422123, 3, 0, 0, 0, "Dosa stuffed with rajwadi-style spicy paneer."],
  ["AK-47 Dosa", "dosa-specials", "South Indian", 220, 20422129, 4, 1, 0, 1, "Fiery schezwan-loaded dosa for serious heat lovers."],
  ["Bhurj Khalifa Dosa", "dosa-specials", "South Indian", 230, 20422123, 3, 1, 1, 1, "Our tallest loaded dosa with paneer bhurji and cheese."],
  ["Schezwan Dosa", "dosa-specials", "South Indian", 170, 20422133, 3, 0, 0, 0, "Dosa with a bold schezwan punch."],
  ["Butter Masala Dosa", "dosa-specials", "South Indian", 140, 20422138, 1, 0, 0, 0, "Classic dosa with a generous butter finish."],

  // Delhi Chaat
  ["Pani Puri", "delhi-chaat", "Chaat", 70, 9738980, 2, 0, 0, 0, "Crisp puris with tangy, spicy pani."],
  ["Sev Puri", "delhi-chaat", "Chaat", 80, 9738980, 1, 0, 0, 0, "Crisp puris topped with chutneys, sev and onion."],
  ["Bhel Puri", "delhi-chaat", "Chaat", 80, 9738980, 1, 0, 0, 0, "Puffed rice tossed with chutneys and crunchy sev."],
  ["Dahi Puri", "delhi-chaat", "Chaat", 90, 9738980, 0, 0, 0, 0, "Puri cups filled with cool yogurt and chutneys."],
  ["Samosa Chaat", "delhi-chaat", "Chaat", 90, 5031949, 1, 0, 1, 0, "Crushed samosa with yogurt, chutneys and sev."],
  ["Papdi Chaat", "delhi-chaat", "Chaat", 90, 9738980, 1, 0, 0, 0, "Crisp papdi with yogurt, chutneys and spices."],

  // Pizza
  ["Margherita", "pizza", "Italian", 180, 1552635, 0, 0, 0, 0, "Classic tomato, mozzarella and basil."],
  ["Paneer Tikka Pizza", "pizza", "Italian", 230, 11975887, 2, 1, 1, 1, "Tandoori paneer, onion and capsicum on a cheesy base."],
  ["Cheese Burst Pizza", "pizza", "Italian", 220, 29173086, 0, 0, 1, 0, "A molten cheese-stuffed crust."],
  ["Farmhouse", "pizza", "Italian", 240, 1552635, 0, 0, 0, 0, "Loaded with onion, capsicum, corn and tomato."],
  ["Tandoori Paneer Pizza", "pizza", "Italian", 240, 11975887, 2, 0, 0, 0, "Smoky tandoori paneer with a spicy drizzle."],
  ["Corn & Cheese", "pizza", "Italian", 200, 29173086, 0, 0, 0, 0, "Sweet corn and a blanket of mozzarella."],

  // Pasta
  ["White Sauce Pasta", "pasta", "Italian", 180, 1438672, 0, 0, 1, 0, "Creamy béchamel pasta with herbs."],
  ["Red Sauce Pasta", "pasta", "Italian", 180, 15813476, 1, 0, 0, 0, "Tangy tomato-basil pasta."],
  ["Mix Sauce Pasta", "pasta", "Italian", 190, 3214160, 1, 0, 0, 0, "The best of both — creamy and tangy."],
  ["Alfredo Pasta", "pasta", "Italian", 200, 29173118, 0, 0, 0, 0, "Rich, cheesy alfredo with garlic bread."],

  // Sandwiches
  ["Grilled Veg Sandwich", "sandwiches", "Quick Bites", 120, 8023677, 0, 0, 0, 0, "Toasted sandwich with garden vegetables."],
  ["Cheese Corn Sandwich", "sandwiches", "Quick Bites", 140, 30346820, 0, 0, 0, 0, "Gooey cheese and sweet corn, toasted."],
  ["Paneer Tikka Sandwich", "sandwiches", "Quick Bites", 160, 20422166, 2, 0, 0, 0, "Spiced paneer tikka filling, grilled."],
  ["Club Sandwich", "sandwiches", "Quick Bites", 150, 8023677, 0, 0, 0, 0, "A triple-decker loaded with veggies."],

  // Maggi
  ["Classic Maggi", "maggi", "Quick Bites", 60, 2347311, 0, 0, 1, 0, "Everyone's favourite, cooked just right."],
  ["Masala Maggi", "maggi", "Quick Bites", 70, 2456435, 1, 0, 0, 0, "Extra masala, extra comfort."],
  ["Cheese Maggi", "maggi", "Quick Bites", 90, 2456434, 0, 0, 0, 0, "Creamy, cheesy twist on classic Maggi."],
  ["Butter Maggi", "maggi", "Quick Bites", 70, 2347311, 0, 0, 0, 0, "Tossed with butter and a sprinkle of pepper."],

  // Desserts
  ["Chocolate Brownie", "desserts", "Desserts", 120, 33312980, 0, 1, 1, 0, "Warm, fudgy brownie, baked fresh daily."],
  ["Brownie with Ice Cream", "desserts", "Desserts", 160, 16785689, 0, 1, 0, 0, "Warm brownie with a scoop of vanilla ice cream."],
  ["Gulab Jamun (2 pc)", "desserts", "Desserts", 60, 16785689, 0, 0, 0, 0, "Soft, syrup-soaked classic."],
  ["Hot Chocolate Fudge", "desserts", "Desserts", 140, 14753356, 0, 0, 0, 0, "Molten chocolate fudge with nuts."],
  ["Ice Cream Scoop", "desserts", "Desserts", 80, 14753356, 0, 0, 0, 0, "Choice of vanilla, chocolate or strawberry."],

  // Shakes
  ["Chocolate Shake", "shakes", "Beverages", 130, 18142621, 0, 1, 0, 0, "Thick, cold chocolate shake."],
  ["Oreo Shake", "shakes", "Beverages", 140, 18142622, 0, 1, 0, 0, "Cookies-and-cream blended shake."],
  ["Strawberry Shake", "shakes", "Beverages", 130, 5005919, 0, 0, 0, 0, "Fruity, creamy strawberry shake."],
  ["Mango Shake", "shakes", "Beverages", 120, 5005919, 0, 0, 0, 0, "Seasonal mango shake, blended thick."],

  // Beverages
  ["Cold Coffee", "beverages", "Beverages", 110, 2789328, 0, 1, 1, 1, "Frothy, chilled coffee — the house classic."],
  ["Mint Mojito", "beverages", "Beverages", 120, 4051265, 0, 1, 1, 1, "Fresh mint, lime and crushed ice."],
  ["Virgin Mojito", "beverages", "Beverages", 110, 2698886, 0, 0, 0, 0, "Cool, sparkling mint-lime refresher."],
  ["Fresh Lime Soda", "beverages", "Beverages", 80, 5370563, 0, 0, 0, 0, "Sweet or salted lime with soda."],
  ["Masala Chaas", "beverages", "Beverages", 50, 5370563, 0, 0, 0, 0, "Spiced buttermilk with roasted cumin."],
  ["Sweet Lassi", "beverages", "Beverages", 80, 5005919, 0, 0, 0, 0, "Thick, chilled sweet yogurt lassi."],
  ["Hot Coffee", "beverages", "Beverages", 60, 36662612, 0, 0, 0, 0, "A warm cup, brewed fresh."],
  ["Hot Tea", "beverages", "Beverages", 40, 36662612, 0, 0, 0, 0, "Indian masala chai."],

  // Combos
  ["Couple Combo", "combos", "Combos", 499, 11188417, 1, 1, 0, 0, "Two mains, breads and beverages for two."],
  ["Combo for 2", "combos", "Combos", 399, 7593267, 1, 1, 0, 0, "A quick, satisfying meal for two."],
  ["Combo for 4", "combos", "Combos", 799, 34507155, 1, 1, 0, 0, "Family-style spread for four."],
  ["Combo for 6", "combos", "Combos", 1199, 4262169, 1, 1, 0, 0, "A full spread for bigger tables."],
];

const now = new Date();
const dstr = (offsetDays) =>
  new Date(now.getTime() + offsetDays * 86400000).toISOString().slice(0, 10);

const OFFERS = [
  {
    slug: "festive-combo-season",
    title: "Festive Combo Season",
    description:
      "Celebrate in good company with our curated family combos — built for sharing and made for memories.",
    image: px(4262169, 1200, 800),
    badge: "Seasonal",
    ctaLabel: "Reserve a Table",
    ctaLink: "/reserve",
    validFrom: dstr(-30),
    validUntil: dstr(120),
    active: true,
  },
  {
    slug: "dosa-nights",
    title: "Dosa Nights",
    description:
      "Craving something crispy? From classic Masala to the loaded Bhurj Khalifa, our dosa counter never sleeps.",
    image: px(20422123, 1200, 800),
    badge: "House Special",
    ctaLabel: "View Dosa Menu",
    ctaLink: "/menu?cat=dosa-specials",
    validFrom: dstr(-60),
    validUntil: dstr(200),
    active: true,
  },
  {
    slug: "weekday-lunch-combo",
    title: "Weekday Lunch Combo",
    description:
      "A quick, satisfying thali-style combo for your weekday lunch rush — hearty, fast and affordable.",
    image: px(7593267, 1200, 800),
    badge: "Weekdays",
    ctaLabel: "See Combo",
    ctaLink: "/menu?cat=combos",
    validFrom: dstr(-10),
    validUntil: dstr(90),
    active: true,
  },
  {
    slug: "chocolate-lovers",
    title: "For the Chocolate Lovers",
    description:
      "Warm brownie with a scoop of vanilla, baked fresh daily. End your meal the Ayodhya way.",
    image: px(33312980, 1200, 800),
    badge: "Desserts",
    ctaLabel: "View Menu",
    ctaLink: "/menu?cat=desserts",
    validFrom: dstr(-20),
    validUntil: dstr(60),
    active: true,
  },
];

const GALLERY = [
  { image: px(26729397, 1200, 800), caption: "Warm, wood-toned dining room", category: "Restaurant" },
  { image: px(20422138, 1200, 800), caption: "Golden masala dosa with sambar and chutneys", category: "Food" },
  { image: px(20422121, 1200, 800), caption: "Jini dosa, loaded and tossed", category: "Dosa Specials" },
  { image: px(11188417, 1200, 800), caption: "Paneer butter masala, straight from the kitchen", category: "Food" },
  { image: px(29309717, 1200, 800), caption: "Soft lighting and patterned walls", category: "Restaurant" },
  { image: px(1552635, 1200, 800), caption: "Fresh from the pizza oven", category: "Food" },
  { image: px(34507155, 1200, 800), caption: "Pav bhaji, buttered and bold", category: "Food" },
  { image: px(20422123, 1200, 800), caption: "Bhurj Khalifa — our showstopper", category: "Dosa Specials" },
  { image: px(4051265, 1200, 800), caption: "Mint mojito over crushed ice", category: "Beverages" },
  { image: px(12669168, 1200, 800), caption: "Fragrant veg biryani", category: "Food" },
  { image: px(17109124, 1200, 800), caption: "Table settings and wooden panels", category: "Restaurant" },
  { image: px(1438672, 1200, 800), caption: "Creamy white-sauce pasta", category: "Food" },
  { image: px(33312980, 1200, 800), caption: "Warm brownie with ice cream", category: "Food" },
  { image: px(18142621, 1200, 800), caption: "Thick chocolate shake", category: "Beverages" },
  { image: px(3184177, 1200, 800), caption: "Tables made for sharing", category: "Guests" },
  { image: px(4262169, 1200, 800), caption: "Family dinners at Ayodhya", category: "Guests" },
  { image: px(20422133, 1200, 800), caption: "Cheese burst dosa, pulled apart", category: "Dosa Specials" },
  { image: px(36662612, 1200, 800), caption: "Masala chai in clay cups", category: "Beverages" },
  { image: px(6876621, 1200, 800), caption: "A quiet corner for a long meal", category: "Restaurant" },
  { image: px(3184184, 1200, 800), caption: "Celebrations, done warm", category: "Events" },
];

const SETTINGS = {
  announcement: "",
  phone: "+91 70242 42488",
  email: "hello@ayodhyarestaurant.in",
  address:
    "In front of Lashkare Hospital, Main Road / Housing Board Colony, Ganj, Betul, Madhya Pradesh 460001",
  instagram: "https://instagram.com/ayodhyarestaurantt",
  facebook: "https://www.facebook.com/search/top?q=Ayodhya%20Restaurant%20Betul",
  zomato: "https://www.zomato.com/search?q=Ayodhya+Restaurant+Betul",
  swiggy: "https://www.swiggy.com/search?query=Ayodhya+Restaurant+Betul",
  hours: JSON.stringify({
    monday: { open: "11:00", close: "23:00", closed: false },
    tuesday: { open: "11:00", close: "23:00", closed: false },
    wednesday: { open: "11:00", close: "23:00", closed: false },
    thursday: { open: "11:00", close: "23:00", closed: false },
    friday: { open: "11:00", close: "23:00", closed: false },
    saturday: { open: "11:00", close: "23:00", closed: false },
    sunday: { open: "11:00", close: "23:00", closed: false },
  }),
};

async function run() {
  const client = await pool.connect();
  try {
    // 1) Categories
    for (const c of CATEGORIES) {
      await client.query(
        `INSERT INTO menu_categories (name, slug, icon, sort_order)
         VALUES ($1,$2,$3,$4) ON CONFLICT (slug) DO NOTHING`,
        [c.name, c.slug, c.icon, c.sortOrder],
      );
    }

    // 2) Menu items
    for (const it of ITEMS) {
      const [name, cat, cuisine, price, imgId, spicy, rec, best, sig, desc] = it;
      await client.query(
        `INSERT INTO menu_items
           (name, slug, description, category, cuisine, price, image, vegetarian, spicy_level, recommended, bestseller, signature, available)
         VALUES ($1,$2,$3,$4,$5,$6,$7,true,$8,$9,$10,$11,true)
         ON CONFLICT (slug) DO NOTHING`,
        [name, slugify(name), desc, cat, cuisine, price, px(imgId), spicy, rec ? 1 : 0, best ? 1 : 0, sig ? 1 : 0],
      );
    }

    // 3) Offers
    for (const o of OFFERS) {
      await client.query(
        `INSERT INTO offers (slug, title, description, image, badge, cta_label, cta_link, valid_from, valid_until, active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (slug) DO NOTHING`,
        [o.slug, o.title, o.description, o.image, o.badge, o.ctaLabel, o.ctaLink, o.validFrom, o.validUntil, o.active],
      );
    }

    // 4) Gallery (only when empty so admin reordering is preserved)
    const g = await client.query(`SELECT count(*)::int AS n FROM gallery`);
    if (Number(g.rows[0].n) === 0) {
      for (let i = 0; i < GALLERY.length; i++) {
        const item = GALLERY[i];
        await client.query(
          `INSERT INTO gallery (image, caption, category, sort_order) VALUES ($1,$2,$3,$4)`,
          [item.image, item.caption, item.category, i],
        );
      }
    }

    // 5) Business settings
    for (const [key, value] of Object.entries(SETTINGS)) {
      await client.query(
        `INSERT INTO business_settings (key, value) VALUES ($1,$2) ON CONFLICT (key) DO NOTHING`,
        [key, value],
      );
    }

    // 6) Admin account (only when none exists)
    const a = await client.query(`SELECT count(*)::int AS n FROM admins`);
    if (Number(a.rows[0].n) === 0) {
      const email = process.env.ADMIN_EMAIL || "admin@ayodhyarestaurant.in";
      const password = process.env.ADMIN_PASSWORD;
      if (!password) {
        throw new Error("ADMIN_PASSWORD is required before creating the first admin account.");
      }
      await client.query(`INSERT INTO admins (email, password_hash) VALUES ($1,$2)`, [
        email,
        hashPassword(password),
      ]);
      console.log(`✔ Admin created: ${email}`);
    }

    console.log(`✔ Seeded ${ITEMS.length} menu items, ${OFFERS.length} offers, ${GALLERY.length} gallery images.`);
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
