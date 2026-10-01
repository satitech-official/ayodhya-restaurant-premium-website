"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { RESTAURANT } from "@/lib/constants";

const EASE = [0.22, 1, 0.36, 1];

const PAGES = [
  {
    title: "Ayodhya",
    subtitle: "Redefining Fine Dining",
    cover: true,
    sections: [],
  },
  {
    title: "Beverages & Starters",
    note: "Prices do not include tax.",
    sections: [
      {
        title: "Beverages",
        items: [
          ["Butter Milk", "50"], ["Lassi", "60"], ["Lime Soda", "80"], ["Masala Soda", "80"],
          ["Pan Shot (2 Shots)", "80"], ["Jamun Shot (2 Shots)", "100"], ["Blue Lagoon", "120"],
          ["Mint Mojito", "120"], ["Green Apple", "120"], ["Vanilla Shake", "110"],
          ["Butterscotch Shake", "120"], ["Oreo Shake", "120"], ["Kit Kat Shake", "120"],
          ["Chocolate Shake", "120"], ["Strawberry Shake", "120"], ["Bubblegum Shake", "120"],
          ["Cold Coffee", "100"], ["Cold Coffee With Icecream", "120"],
        ],
      },
      {
        title: "Chef's Signature Starters",
        items: [
          ["Mushroom Spanish Fried Rice (with hot garlic sauce)", "240"],
          ["Pan Fried Noodles", "240"], ["Veg Coin In Hot Garlic Sauce", "200"],
          ["Paneer Corn Seekh Kebab", "250"],
        ],
      },
      {
        title: "Starters / Chinese",
        items: [
          ["Hara Bhara Kebab", "180"], ["Cheese Corn Kebab", "180"], ["Cheese Ball", "200"],
          ["Crispy Corn Salt & Pepper", "170"], ["Hakka Noodles", "150"], ["Veg Schezwan Noodles", "170"],
          ["Veg Chowmein", "150"], ["Chilli Garlic Noodles", "180"], ["French Fries", "150"],
          ["Peri Peri French Fries", "170"], ["Cheese French Fries", "180"],
          ["Veg Manchurian (Dry/Gravy)", "160"], ["Paneer Chilli (Dry/Gravy)", "200"],
          ["Paneer 65", "220"], ["Veg Fried Rice", "150"], ["Schezwan Fried Rice", "170"],
          ["Paneer Fried Rice", "180"], ["Veg Kothe", "170"], ["Veg Lollipop", "160"],
          ["Chilli Potato", "150"], ["Honey Chilli Potato", "180"], ["Chana Chilli", "160"],
          ["Corn Chaat", "150"], ["Crispy Veg", "170"], ["Paneer Finger", "200"],
          ["Paneer Sizzler", "320"], ["Chinese Sizzler Platter", "550"],
        ],
      },
    ],
  },
  {
    title: "Street Food & Tandoor",
    note: "Parcel charges extra.",
    sections: [
      {
        title: "Street Food",
        items: [
          ["Mix Pakode", "120"], ["Paneer Pakode", "140"], ["Pav Bhaji", "120"],
          ["Double Butter Pav Bhaji", "130"], ["Cheese Pav Bhaji", "140"], ["Paneer Pav Bhaji", "150"],
          ["Extra Pav", "30"], ["Chole Bhature", "120"], ["Extra Bhature", "30"],
          ["Green Club Sandwich", "100"], ["Masala Sandwich", "120"], ["Cheese Corn Sandwich", "130"],
          ["Veg Cheese Sandwich", "130"], ["Paneer Sandwich", "150"], ["Masala Cheese Sandwich", "140"],
          ["Paneer Tandoor Sandwich", "180"],
        ],
      },
      { title: "Pasta", items: [["White Sauce Pasta","180"],["Red Sauce Pasta","180"],["Pink Sauce Pasta","190"]] },
      { title: "Soup", items: [["Manchow Soup","90"],["Lemon Coriander Soup","100"],["Hot and Sour Soup","110"],["Tomato Soup","110"],["Sweet Corn Soup","110"]] },
      {
        title: "Tandoor - Tikka",
        items: [["Veg Seekh Kebab","230"],["Paneer Tikka","250"],["Paneer Afghani Tikka","260"],["Paneer Achari Tikka","260"],["Paneer Malai Tikka","260"],["Paneer Lahori Tikka","260"]],
      },
      {
        title: "Tandoor - Chaap",
        items: [["Soya Tikka Chaap","220"],["Malai Soya Chaap","220"],["Achari Soya Chaap","230"],["Firangi Soya Chaap","250"],["Pahadi Soya Chaap","250"],["Tandoor Platter","550"]],
      },
      {
        title: "Pizza",
        items: [["Plain Cheese Pizza","180"],["Onion Cheese Pizza","190"],["Corn Cheese Pizza","200"],["Veg Cheese Pizza","200"],["Paneer Pizza","210"],["Paneer Tikka Pizza","220"],["Farmhouse Pizza","220"],["Cheese Burst Pizza","230"]],
      },
      { title: "Raita", items: [["Boondi Raita","100"],["Veg Raita","100"],["Fruit Raita","110"],["Pineapple Raita","120"]] },
    ],
  },
  {
    title: "Main Course",
    note: "Prices do not include tax.",
    sections: [
      {
        title: "Indian",
        items: [
          ["Mix Veg (Half/Full)","110/180"],["Dum Aloo Punjabi","180"],["Aloo Gobi Matar","180"],
          ["Sev Tamatar (Half/Full)","110/180"],["Bhindi Masala","200"],["Bhindi Kurkuri","180"],
          ["Veg Kolhapuri","200"],["Veg Patiala","200"],["Veg Keema Rara","220"],["Matar Mushroom","240"],
          ["Methi Matar Malai","250"],["Kaju Curry","250"],["Lasooni Palak Paneer","260"],
          ["Veg Kofta Curry","200"],["Paneer Kofta","220"],["Veg Angoori Kofta","220"],["Malai Kofta","260"],
        ],
      },
      {
        title: "Chef's Signature",
        items: [
          ["Paneer Hyderabadi","250"],["Soya Tikka Masala","250"],["Bhuna Soya Chaap","250"],
          ["Firangi Soya Chaap","250"],["Lasooni Palak Paneer","280"],["Paneer Maharani","300"],
          ["Paneer Hungama","320"],["Paneer Tufani","320"],["Paneer Angara","350"],
          ["Afghani Paneer (White Gravy)","350"],["Paneer Long Lata","350"],
        ],
      },
      { title: "Papad", items: [["Papad Roast","25"],["Papad Fry","25"],["Masala Papad","50"]] },
      { title: "Salad", items: [["Onion Salad","50"],["Green Salad","80"],["Punjabi Salad","100"],["Kachumber Salad","100"],["Dahi Kachumber Salad","110"]] },
      {
        title: "Paneer",
        items: [
          ["Matar Paneer (Half at 130)","220"],["Paneer Masala","220"],["Paneer Bhuna Masala","220"],
          ["Palak Paneer","220"],["Paneer Do Pyaza","230"],["Kadai Paneer","240"],["Handi Paneer","250"],
          ["Paneer Tikka Masala","250"],["Paneer Kaju Masala","250"],["Paneer Butter Masala","260"],
          ["Shahi Paneer","260"],["Paneer Amritsari","260"],["Paneer Patiyala","260"],["Paneer Lababdar","260"],
          ["Paneer Kolhapuri","260"],["Paneer Rajwari","280"],["Amritsari Paneer Bhurji","280"],
          ["Paneer Pasanda","300"],["Palak Stuffed Paneer","350"],
        ],
      },
    ],
  },
  {
    title: "Dal, Rice & Breads",
    sections: [
      {
        title: "Dal",
        hint: "Half portion of Dal available at 70% of the full price.",
        items: [["Plain Dal","120"],["Dal Fry","130"],["Jeera Dal","130"],["Dal Tadka","160"],["Dal Roast","160"],["Dal Dhaba","160"],["Chilli Garlic Dal","170"]],
      },
      {
        title: "Rice",
        items: [
          ["Steamed Rice (Half/Full)","80/140"],["Jeera Rice (Half/Full)","90/150"],["Onion Tomato Rice","180"],
          ["Veg Pulao","170"],["Matar Pulao","180"],["Garlic Rice","190"],["Kashmiri Pulao","200"],
          ["Punjabi Pulao","200"],["Paneer Pulao","220"],["Veg Biryani","240"],["Butter Dal Khichdi","210"],["Masala Khichdi","210"],
        ],
      },
      { title: "Sweet", items: [["Rasgulla (1pcs / 2pcs)","30/50"],["Gulab Jamun (1pcs / 2pcs)","40/60"],["Vanilla Ice Cream","30"],["Butterscotch Ice Cream","40"]] },
      { title: "Tawa", items: [["Tawa Roti","15"],["Tawa Roti With Butter","20"]] },
      { title: "Tandoori", items: [["Tandoori Roti","20"],["Tandoori Roti With Butter","25"]] },
      { title: "Naan", items: [["Plain Naan","40"],["Butter Naan","50"],["Garlic Naan","60"],["Cheese Naan","70"],["Cheese Garlic Naan","80"]] },
      { title: "Paratha (with curd)", items: [["Tawa Paratha (Plain)","30"],["Laccha Paratha","70"],["Aloo Paratha","120"],["Onion Paratha","120"],["Paneer Paratha","150"]] },
      { title: "Kulcha (with curd)", items: [["Aloo Kulcha","120"],["Paneer Kulcha","150"]] },
    ],
  },
  {
    title: "South Indian",
    sections: [
      {
        title: "Dosa",
        items: [
          ["Butter Plain Dosa","80"],["Butter Masala Dosa","100"],["Mysore Masala Dosa","130"],["Paneer Dosa","140"],
          ["Chocolate Dosa","150"],["Jini Dosa","150"],["Jini Paneer Dosa","160"],["Corn Cheese Dosa","160"],
          ["Pizza Dosa","160"],["Cheese Paneer Mysore Masala Dosa","160"],["American Chopsuey Dosa","160"],
          ["Spring Roll Dosa","160"],["Cheese Burst Dosa","170"],["Sizzler Dosa","180"],["Chilli Paneer Dosa","180"],
          ["Mumbai Special Dosa","180"],["Open Cheese Mysore Dosa","180"],["Bahubali Dosa","190"],["AK 47 Dosa","200"],
          ["Matka Dosa","200"],["Maharaja Dosa","220"],["Burj Khalifa Dosa","350"],
        ],
      },
      { title: "Uttapam", items: [["Onion Uttapam","90"],["Mix Uttapam","100"],["Masala Uttapam","110"],["Tomato Uttapam","110"],["Mysore Uttapam","130"],["Mumbai Special Uttapam","150"]] },
      { title: "Idli", items: [["Idli Sambar","90"],["Ghee Fry Idli","100"],["Schezwan Fry Idli","110"],["Ghee Podi Idli","130"]] },
    ],
  },
  {
    title: "Tandoor Finale",
    note: "Thank you.",
    sections: [
      {
        title: "Tikka",
        items: [["Veg Seekh Kebab","230"],["Paneer Tikka","250"],["Paneer Afghani Tikka","260"],["Paneer Achari Tikka","260"],["Paneer Malai Tikka","260"],["Paneer Lahori Tikka","260"]],
      },
      {
        title: "Chaap",
        items: [["Soya Tikka Chaap","220"],["Malai Soya Chaap","220"],["Achari Soya Chaap","230"],["Firangi Soya Chaap","250"],["Pahadi Soya Chaap","250"],["Tandoor Platter","550"]],
      },
    ],
  },
];

function ItemRow({ item, addItem }) {
  const [name, price] = item;
  return (
    <div className="group flex items-center gap-3 border-b border-[#7c5a39]/10 py-2.5 last:border-0">
      <button
        type="button"
        onClick={() => addItem(name, price)}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#a97936]/25 bg-white/60 text-[#6f3d20] opacity-70 transition hover:scale-110 hover:border-[#a97936]/60 hover:bg-[#6f3d20] hover:text-white group-hover:opacity-100"
        aria-label={`Add ${name} to order`}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-0 flex-1 text-[13px] leading-5 text-[#4b3427] sm:text-sm">{name}</span>
      <span className="shrink-0 font-display text-sm text-[#8f5b28]">₹{price}</span>
    </div>
  );
}

export default function RoyalMenuBook() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [cart, setCart] = useState([]);
  const [note, setNote] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const current = PAGES[page];

  const addItem = (name, price) => {
    setCart((items) => {
      const found = items.find((x) => x.name === name);
      if (found) return items.map((x) => x.name === name ? { ...x, qty: x.qty + 1 } : x);
      return [...items, { name, price, qty: 1 }];
    });
  };

  const changeQty = (name, delta) => {
    setCart((items) =>
      items
        .map((x) => x.name === name ? { ...x, qty: x.qty + delta } : x)
        .filter((x) => x.qty > 0),
    );
  };

  const itemCount = useMemo(() => cart.reduce((sum, x) => sum + x.qty, 0), [cart]);

  const go = (next) => {
    const clamped = Math.max(0, Math.min(PAGES.length - 1, next));
    if (clamped === page) return;
    setDirection(clamped > page ? 1 : -1);
    setPage(clamped);
  };

  const orderWhatsApp = () => {
    if (!cart.length) return;
    const lines = cart.map((x) => `• ${x.qty} × ${x.name} — ₹${x.price}`).join("\n");
    const message = [
      "Hello Ayodhya Restaurant,",
      "I would like to place an order from the menu:",
      "",
      lines,
      note.trim() ? `\nNote: ${note.trim()}` : "",
      "",
      "Please confirm availability and final total.",
    ].filter(Boolean).join("\n");
    window.location.assign(`${RESTAURANT.whatsappHref}?text=${encodeURIComponent(message)}`);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#1e0d07] pb-32 pt-24 text-[#fff7e7] sm:pt-28">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(197,139,55,.14),transparent_30%),radial-gradient(circle_at_16%_64%,rgba(123,65,29,.2),transparent_34%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-[#c9933d]/20 pb-5 sm:gap-5 sm:pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d7a44b]">
              <Sparkles className="h-3.5 w-3.5" /> The Royal Menu Vault
            </p>
            <h1 className="mt-2 max-w-[12ch] font-display text-[2.35rem] leading-[0.98] text-[#fff7e7] sm:mt-3 sm:max-w-none sm:text-5xl">Original Menu. Reimagined.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#eadbc7]/60">
              Browse the restaurant's original menu as a digital book. Tap + beside any dish to build an order instantly.
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#c9933d]/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#eadbc7] transition hover:border-[#d7a44b] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Digital Menu
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-[150px_minmax(0,1fr)]">
          <aside className="order-1 lg:order-1">
            <div className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible">
              {PAGES.map((p, i) => (
                <button
                  key={p.title + i}
                  type="button"
                  onClick={() => go(i)}
                  className={`shrink-0 rounded-2xl border px-3 py-3 text-left transition lg:w-full ${
                    page === i
                      ? "border-[#d7a44b]/60 bg-[#d7a44b]/12 text-white"
                      : "border-white/8 bg-white/[0.025] text-[#eadbc7]/55 hover:border-[#d7a44b]/30 hover:text-[#eadbc7]"
                  }`}
                >
                  <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-[#d7a44b]">Page {i + 1}</span>
                  <span className="mt-1 block text-xs leading-4">{p.title}</span>
                </button>
              ))}
            </div>
          </aside>

          <main className="order-2 min-w-0 lg:order-2">
            <div className="relative mx-auto max-w-4xl [perspective:1600px]">
              <div className="absolute -inset-4 rounded-[2.4rem] bg-[#c9933d]/8 blur-3xl" />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.article
                  key={page}
                  custom={direction}
                  initial={{ opacity: 0, rotateY: direction > 0 ? 12 : -12, x: direction > 0 ? 35 : -35 }}
                  animate={{ opacity: 1, rotateY: 0, x: 0 }}
                  exit={{ opacity: 0, rotateY: direction > 0 ? -10 : 10, x: direction > 0 ? -25 : 25 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="relative min-h-[58vh] overflow-hidden rounded-[1.35rem] border border-[#c9933d]/30 bg-[#f7f0e5] text-[#3c291e] shadow-[0_34px_80px_-42px_rgba(0,0,0,.85)] sm:min-h-[70vh] sm:rounded-[2rem]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 10%,rgba(255,255,255,.85),transparent 25%),linear-gradient(135deg,rgba(255,255,255,.5),transparent 50%)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-[#6f3d20]/20 to-transparent" />
                  <div className="absolute right-8 top-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f5b28]/45">
                    {String(page + 1).padStart(2, "0")} / {String(PAGES.length).padStart(2, "0")}
                  </div>

                  {current.cover ? (
                    <div className="relative flex min-h-[58vh] flex-col items-center justify-center overflow-hidden px-5 text-center sm:min-h-[70vh] sm:px-8">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="relative"
                      >
                        <div className="absolute inset-0 rounded-full bg-[#c9933d]/18 blur-3xl" />
                        <img
                          src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/brand/ayodhya-hero-logo.webp`}
                          alt="Ayodhya Restaurant"
                          className="relative mx-auto w-[285px] max-w-[78vw] object-contain sm:w-[360px]"
                        />
                        <div className="mx-auto mt-5 h-px w-48 bg-gradient-to-r from-transparent via-[#9d6127] to-transparent" />
                      </motion.div>
                      <p className="mt-14 max-w-md text-sm leading-7 text-[#6f5140]/70">
                        Swipe through the original menu. On any page, tap the + beside a dish to add it to your order.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 sm:p-9 lg:p-12">
                      <div className="border-b border-[#8f5b28]/15 pb-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#9d6127]">Ayodhya Restaurant · Betul</p>
                        <h2 className="mt-2 font-display text-4xl text-[#2c1d15] sm:text-5xl">{current.title}</h2>
                      </div>

                      <div className="mt-5 grid gap-x-7 gap-y-6 sm:mt-7 md:grid-cols-2 md:gap-x-10 md:gap-y-8">
                        {current.sections.map((section) => (
                          <section key={section.title} className="break-inside-avoid">
                            <h3 className="font-display text-2xl italic text-[#6f3d20]">{section.title}</h3>
                            {section.hint && <p className="mt-1 text-[11px] italic leading-5 text-[#6f5140]/60">{section.hint}</p>}
                            <div className="mt-3">
                              {section.items.map((item) => (
                                <ItemRow key={item[0]} item={item} addItem={addItem} />
                              ))}
                            </div>
                          </section>
                        ))}
                      </div>

                      {current.note && (
                        <p className="mt-9 border-t border-[#8f5b28]/15 pt-5 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-[#6f5140]/55">
                          {current.note}
                        </p>
                      )}
                    </div>
                  )}
                </motion.article>
              </AnimatePresence>

              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:mt-5">
                <button
                  type="button"
                  onClick={() => go(page - 1)}
                  disabled={page === 0}
                  className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#c9933d]/25 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#eadbc7] transition enabled:hover:border-[#d7a44b] disabled:opacity-25 sm:gap-2 sm:px-4 sm:text-xs sm:tracking-[0.1em]"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </button>
                <span className="text-xs text-[#eadbc7]/45">Page {page + 1} of {PAGES.length}</span>
                <button
                  type="button"
                  onClick={() => go(page + 1)}
                  disabled={page === PAGES.length - 1}
                  className="ml-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-[#c9933d]/25 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#eadbc7] transition enabled:hover:border-[#d7a44b] disabled:opacity-25 sm:gap-2 sm:px-4 sm:text-xs sm:tracking-[0.1em]"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-3 rounded-full border border-[#e2b45b]/35 bg-[#3b1d0f]/95 px-5 py-3.5 text-sm font-bold text-white shadow-[0_20px_50px_-18px_rgba(0,0,0,.8)] backdrop-blur-xl transition hover:-translate-y-0.5 md:bottom-6 md:right-6"
      >
        <ShoppingBag className="h-5 w-5 text-[#e2b45b]" />
        Order Bag
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#c9933d] px-1.5 text-xs text-white">{itemCount}</span>
      </button>

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close order bag"
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: EASE }}
              className="fixed bottom-0 right-0 top-0 z-[60] w-full max-w-md overflow-y-auto border-l border-[#c9933d]/20 bg-[#241008] p-5 text-[#fff7e7] shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d7a44b]">Direct Order</p>
                  <h2 className="mt-1 font-display text-3xl">Your Order Bag</h2>
                </div>
                <button type="button" onClick={() => setCartOpen(false)} className="rounded-full border border-white/10 p-2 text-[#eadbc7] hover:border-[#d7a44b]/50">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-7 space-y-3">
                {!cart.length && (
                  <div className="rounded-2xl border border-dashed border-[#c9933d]/25 p-8 text-center text-sm leading-6 text-[#eadbc7]/55">
                    Tap + beside any dish in the menu book to add it here.
                  </div>
                )}

                {cart.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="mt-1 text-sm text-[#d7a44b]">₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-full border border-white/10 p-1">
                        <button type="button" onClick={() => changeQty(item.name, -1)} className="rounded-full p-1.5 hover:bg-white/10"><Minus className="h-3.5 w-3.5" /></button>
                        <span className="min-w-5 text-center text-sm">{item.qty}</span>
                        <button type="button" onClick={() => changeQty(item.name, 1)} className="rounded-full p-1.5 hover:bg-white/10"><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <label className="mt-6 block">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#eadbc7]/55">Order note</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Half/full, less spicy, special request…"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white outline-none placeholder:text-[#eadbc7]/30 focus:border-[#d7a44b]/60"
                />
              </label>

              <button
                type="button"
                onClick={orderWhatsApp}
                disabled={!cart.length}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#a66a2c] px-5 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#bd7b35] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <MessageCircle className="h-5 w-5" /> Order on WhatsApp
              </button>
              <p className="mt-3 text-center text-[11px] leading-5 text-[#eadbc7]/40">
                Availability, taxes and final amount are confirmed by the restaurant.
              </p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
