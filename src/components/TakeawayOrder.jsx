"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { RESTAURANT } from "@/lib/constants";

function getPriceOptions(item) {
  const values = String(item.price || "")
    .split("/")
    .map((part) => Number(String(part).replace(/[^\d.]/g, "")))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!values.length) return [];
  if (values.length === 1) return [{ label: "", price: values[0] }];

  const text = (String(item.name || "") + " " + String(item.description || "")).toLowerCase();
  let labels = values.map((_, index) => "Option " + (index + 1));

  if (text.includes("half") && text.includes("full")) {
    labels = ["Half", "Full"];
  } else if (
    text.includes("1pcs") ||
    text.includes("1 pcs") ||
    text.includes("1 pc") ||
    text.includes("2pcs") ||
    text.includes("2 pcs")
  ) {
    labels = ["1 pc", "2 pcs"];
  }

  return values.map((price, index) => ({ label: labels[index] || "Option " + (index + 1), price }));
}

function money(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN");
}

export default function TakeawayOrder({ items = [], categories = [] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("ASAP — restaurant to confirm");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const visibleItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (item.available === false) return false;
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      return [item.name, item.cuisine, item.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [items, category, search]);

  const cartItems = Object.values(cart);
  const itemCount = cartItems.reduce((sum, entry) => sum + entry.qty, 0);
  const subtotal = cartItems.reduce((sum, entry) => sum + entry.price * entry.qty, 0);

  const addItem = (item, option) => {
    const key = [item.id || item.slug || item.name, option.label || "standard", option.price].join("::");
    setCart((current) => {
      const existing = current[key];
      return {
        ...current,
        [key]: existing
          ? { ...existing, qty: existing.qty + 1 }
          : {
              key,
              id: item.id,
              name: item.name,
              variant: option.label,
              price: option.price,
              qty: 1,
            },
      };
    });
    setError("");
  };

  const changeQty = (key, delta) => {
    setCart((current) => {
      const existing = current[key];
      if (!existing) return current;
      const nextQty = existing.qty + delta;
      if (nextQty <= 0) {
        const next = { ...current };
        delete next[key];
        return next;
      }
      return { ...current, [key]: { ...existing, qty: nextQty } };
    });
  };

  const submitOrder = () => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cartItems.length) {
      setError("Please add at least one item to your takeaway order.");
      setCartOpen(true);
      return;
    }
    if (!name.trim()) {
      setError("Please enter your name.");
      setCartOpen(true);
      return;
    }
    if (cleanPhone.length < 10) {
      setError("Please enter a valid phone number.");
      setCartOpen(true);
      return;
    }

    const lines = cartItems.map((entry, index) => {
      const variant = entry.variant ? " (" + entry.variant + ")" : "";
      return (
        (index + 1) +
        ". " +
        entry.name +
        variant +
        " × " +
        entry.qty +
        " — " +
        money(entry.price * entry.qty)
      );
    });

    const message = [
      "*AYODHYA RESTAURANT — TAKEAWAY / SELF PICKUP*",
      "",
      "*Customer:* " + name.trim(),
      "*Phone:* " + phone.trim(),
      "*Preferred pickup:* " + pickupTime,
      "",
      "*Order:*",
      ...lines,
      "",
      "*Menu subtotal:* " + money(subtotal),
      note.trim() ? "*Special note:* " + note.trim() : "",
      "",
      "*Pickup location:* " + RESTAURANT.addressShort,
      "",
      "Please confirm item availability, final payable amount (including applicable taxes/parcel charges) and pickup-ready time.",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(RESTAURANT.whatsappHref + "?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
    setError("");
  };

  const OrderPanel = ({ mobile = false }) => (
    <div className={mobile ? "flex max-h-[86vh] flex-col" : ""}>
      <div className="flex items-start justify-between gap-4 border-b border-brass/15 pb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-terracotta">Your Pickup Order</p>
          <h2 className="mt-1 font-display text-3xl text-charcoal">Takeaway Cart</h2>
        </div>
        {mobile && (
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/10 text-charcoal"
            aria-label="Close takeaway cart"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className={mobile ? "overflow-y-auto py-5" : "py-5"}>
        {!cartItems.length ? (
          <div className="rounded-2xl border border-dashed border-charcoal/15 bg-white/45 p-6 text-center">
            <ShoppingBag className="mx-auto h-7 w-7 text-terracotta" />
            <p className="mt-3 font-semibold text-charcoal">Your cart is empty.</p>
            <p className="mt-1 text-sm leading-6 text-walnut">Choose dishes below, then send your pickup order to Ayodhya.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map((entry) => (
              <div key={entry.key} className="rounded-2xl border border-sand bg-white/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold leading-5 text-charcoal">{entry.name}</p>
                    {entry.variant && <p className="mt-1 text-xs text-walnut">{entry.variant}</p>}
                  </div>
                  <p className="whitespace-nowrap font-display text-lg text-terracotta">
                    {money(entry.price * entry.qty)}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-walnut">{money(entry.price)} each</span>
                  <div className="flex items-center rounded-full border border-charcoal/10 bg-cream">
                    <button
                      type="button"
                      onClick={() => changeQty(entry.key, -1)}
                      className="flex h-8 w-8 items-center justify-center"
                      aria-label={"Remove one " + entry.name}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-7 text-center text-sm font-bold">{entry.qty}</span>
                    <button
                      type="button"
                      onClick={() => changeQty(entry.key, 1)}
                      className="flex h-8 w-8 items-center justify-center"
                      aria-label={"Add one " + entry.name}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-y border-charcoal/10 py-4">
          <span className="text-sm font-semibold text-walnut">Menu subtotal</span>
          <span className="font-display text-2xl text-charcoal">{money(subtotal)}</span>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor={mobile ? "pickup-name-mobile" : "pickup-name"} className="text-xs font-bold uppercase tracking-[0.14em] text-walnut">
              Name
            </label>
            <input
              id={mobile ? "pickup-name-mobile" : "pickup-name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-2 w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-terracotta"
            />
          </div>

          <div>
            <label htmlFor={mobile ? "pickup-phone-mobile" : "pickup-phone"} className="text-xs font-bold uppercase tracking-[0.14em] text-walnut">
              Phone
            </label>
            <input
              id={mobile ? "pickup-phone-mobile" : "pickup-phone"}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              placeholder="10-digit mobile number"
              className="mt-2 w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-terracotta"
            />
          </div>

          <div>
            <label htmlFor={mobile ? "pickup-time-mobile" : "pickup-time"} className="text-xs font-bold uppercase tracking-[0.14em] text-walnut">
              Preferred pickup time
            </label>
            <select
              id={mobile ? "pickup-time-mobile" : "pickup-time"}
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="mt-2 w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-terracotta"
            >
              <option>ASAP — restaurant to confirm</option>
              <option>In about 30 minutes</option>
              <option>In about 45 minutes</option>
              <option>In about 60 minutes</option>
              <option>In about 90 minutes</option>
            </select>
          </div>

          <div>
            <label htmlFor={mobile ? "pickup-note-mobile" : "pickup-note"} className="text-xs font-bold uppercase tracking-[0.14em] text-walnut">
              Special note
            </label>
            <textarea
              id={mobile ? "pickup-note-mobile" : "pickup-note"}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Less spicy, no onion, packing note…"
              className="mt-2 w-full resize-none rounded-xl border border-charcoal/10 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-terracotta"
            />
          </div>
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

        <button
          type="button"
          onClick={submitOrder}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-5 py-4 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-burnt"
        >
          <MessageCircle className="h-4 w-4" /> Send Takeaway Order
        </button>

        <p className="mt-3 text-center text-[11px] leading-5 text-walnut/70">
          Your order opens in WhatsApp for restaurant confirmation. Final amount and pickup-ready time are confirmed by Ayodhya.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <section className="relative overflow-hidden bg-charcoal pb-14 pt-28 text-soft sm:pb-16">
        <div className="pattern-jaali-light absolute inset-0 opacity-[0.1]" aria-hidden="true" />
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-brass/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-brass">
            <span className="h-px w-8 bg-current opacity-60" /> Takeaway · Self Pickup
          </p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <h1 className="font-display text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-7xl">
                Order Ahead. Pick Up Fresh.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-cream/68 sm:text-lg">
                Choose your favourites, send your pickup order to Ayodhya, and collect it yourself from the restaurant once the team confirms it is ready.
              </p>
            </div>
            <div className="grid gap-2 text-sm text-cream/65 sm:grid-cols-3 lg:grid-cols-1">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brass" /> Choose dishes</span>
              <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-brass" /> Pick a time</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-brass" /> Collect at Ayodhya</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream pb-32 pt-10 text-charcoal md:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
            <div>
              <div className="sticky top-[72px] z-20 -mx-4 border-y border-sand bg-cream/95 px-4 py-4 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-walnut/55" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search takeaway menu…"
                    className="w-full rounded-xl border border-charcoal/10 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-terracotta"
                  />
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setCategory("all")}
                    className={
                      "whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition " +
                      (category === "all" ? "bg-charcoal text-soft" : "border border-charcoal/10 bg-white text-walnut hover:border-terracotta")
                    }
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => setCategory(cat.slug)}
                      className={
                        "whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition " +
                        (category === cat.slug ? "bg-charcoal text-soft" : "border border-charcoal/10 bg-white text-walnut hover:border-terracotta")
                      }
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {visibleItems.map((item) => {
                  const options = getPriceOptions(item);
                  return (
                    <article key={item.id || item.slug || item.name} className="overflow-hidden rounded-[1.35rem] border border-sand bg-white shadow-[0_18px_50px_-38px_rgba(64,36,20,.45)]">
                      {item.image && (
                        <div className="aspect-[16/10] overflow-hidden bg-sand/30">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                        </div>
                      )}
                      <div className="p-4 sm:p-5">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-terracotta">
                          {item.cuisine || "Vegetarian"}
                        </p>
                        <h2 className="mt-1.5 font-display text-2xl leading-tight text-charcoal">{item.name}</h2>
                        {item.description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-walnut/75">{item.description}</p>}

                        <div className="mt-4 flex flex-wrap gap-2">
                          {options.map((option) => (
                            <button
                              key={(option.label || "standard") + option.price}
                              type="button"
                              onClick={() => addItem(item, option)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-terracotta/25 bg-terracotta/5 px-3.5 py-2 text-xs font-bold text-terracotta transition hover:border-terracotta hover:bg-terracotta hover:text-soft"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              {option.label ? option.label + " · " : ""}
                              {money(option.price)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {!visibleItems.length && (
                <div className="mt-8 rounded-2xl border border-dashed border-charcoal/15 p-10 text-center text-walnut">
                  No matching dishes found. Try another search or category.
                </div>
              )}
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-[1.5rem] border border-sand bg-[#fffaf0] p-5 shadow-[0_24px_70px_-42px_rgba(64,36,20,.55)]">
                <OrderPanel />
              </div>
            </aside>
          </div>

          <div className="mt-10 rounded-[1.4rem] border border-sand bg-white/60 p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-terracotta" />
                <div>
                  <p className="font-semibold">Pickup from Ayodhya Restaurant</p>
                  <p className="mt-1 text-sm leading-6 text-walnut">{RESTAURANT.addressShort}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-terracotta" />
                <div>
                  <p className="font-semibold">Please wait for confirmation</p>
                  <p className="mt-1 text-sm leading-6 text-walnut">
                    Availability, parcel charges, taxes and exact pickup-ready time are confirmed by the restaurant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="fixed bottom-[76px] left-4 right-4 z-40 flex items-center justify-between rounded-2xl bg-terracotta px-5 py-4 text-soft shadow-[0_16px_45px_rgba(60,27,12,.32)] lg:hidden"
      >
        <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em]">
          <ShoppingBag className="h-4 w-4" /> Pickup Cart ({itemCount})
        </span>
        <span className="font-display text-lg">{money(subtotal)}</span>
      </button>

      {cartOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
            aria-label="Close takeaway cart"
            onClick={() => setCartOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[1.75rem] bg-[#fffaf0] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl">
            <OrderPanel mobile />
          </div>
        </div>
      )}
    </>
  );
}
