"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Img } from "@/components/primitives";

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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!cartOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [cartOpen]);

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

  const submitOrder = (event) => {
    event?.preventDefault?.();
    if (submitting) return;
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

    const orderUrl = RESTAURANT.whatsappHref + "?text=" + encodeURIComponent(message);
    setError("");
    setSubmitting(true);
    window.location.href = orderUrl;
    window.setTimeout(() => setSubmitting(false), 1500);
  };

  const OrderPanel = ({ mobile = false }) => (
    <div className={mobile ? "flex h-full min-h-0 flex-col" : ""}>
      <div className={mobile ? "flex shrink-0 items-start justify-between gap-3 border-b border-brass/15 pb-4" : "flex items-start justify-between gap-3 border-b border-brass/15 pb-4"}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-terracotta">Your Pickup Order</p>
          <h2 className="mt-1 font-display text-2xl text-charcoal sm:text-3xl">Takeaway Cart</h2>
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

      <form
        onSubmit={submitOrder}
        className={mobile ? "min-h-0 flex-1 overflow-y-auto overscroll-contain py-4 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "py-5"}
      >
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
              required
              type="text"
              autoComplete="name"
              enterKeyHint="next"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-2 w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3.5 text-[16px] text-charcoal outline-none transition focus:border-terracotta sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor={mobile ? "pickup-phone-mobile" : "pickup-phone"} className="text-xs font-bold uppercase tracking-[0.14em] text-walnut">
              Phone
            </label>
            <input
              id={mobile ? "pickup-phone-mobile" : "pickup-phone"}
              required
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              enterKeyHint="next"
              maxLength={15}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className="mt-2 w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3.5 text-[16px] text-charcoal outline-none transition focus:border-terracotta sm:text-sm"
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
              className="mt-2 w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3.5 text-[16px] text-charcoal outline-none transition focus:border-terracotta sm:text-sm"
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
              className="mt-2 w-full resize-none rounded-xl border border-charcoal/10 bg-white px-4 py-3.5 text-[16px] text-charcoal outline-none transition focus:border-terracotta sm:text-sm"
            />
          </div>
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-5 py-4 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-burnt disabled:cursor-wait disabled:opacity-60"
        >
          <MessageCircle className="h-4 w-4" /> {submitting ? "Opening WhatsApp…" : "Send Takeaway Order"}
        </button>

        <p className="mt-3 text-center text-[11px] leading-5 text-walnut/70">
          Your order opens in WhatsApp for restaurant confirmation. Final amount and pickup-ready time are confirmed by Ayodhya.
        </p>
      </form>
    </div>
  );

  return (
    <>
      <section className="relative overflow-hidden bg-charcoal pb-9 pt-24 text-soft sm:pb-14 sm:pt-28">
        <Img
          src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1800&h=1000"
          alt="Fresh Indian takeaway dishes"
          fallbackSrc="/images/hero-food.webp"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          eager
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/98 via-charcoal/86 to-charcoal/52" />
        <div className="pattern-jaali-light absolute inset-0 opacity-[0.1]" aria-hidden="true" />
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-brass/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-brass sm:text-[11px] sm:tracking-[0.28em]">
            <span className="h-px w-8 bg-current opacity-60" /> Takeaway · Self Pickup
          </p>
          <div className="mt-4 grid gap-6 sm:mt-5 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-8">
            <div className="max-w-3xl">
              <h1 className="max-w-[18ch] font-display text-[2.55rem] font-semibold leading-[0.95] tracking-[-0.025em] sm:text-6xl lg:text-7xl">
                Order Ahead. Pick Up Fresh.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/68 sm:mt-5 sm:text-lg sm:leading-7">
                Choose your favourites, send your pickup order to Ayodhya, and collect it yourself from the restaurant once the team confirms it is ready.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-cream/65 sm:text-sm sm:normal-case sm:tracking-normal lg:grid-cols-1">
              <span className="flex min-w-0 flex-col items-center gap-1.5 rounded-xl border border-brass/15 bg-white/[0.035] px-2 py-3 text-center sm:flex-row sm:justify-center lg:justify-start lg:border-0 lg:bg-transparent lg:p-0 lg:text-left">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brass" /> Choose dishes
              </span>
              <span className="flex min-w-0 flex-col items-center gap-1.5 rounded-xl border border-brass/15 bg-white/[0.035] px-2 py-3 text-center sm:flex-row sm:justify-center lg:justify-start lg:border-0 lg:bg-transparent lg:p-0 lg:text-left">
                <Clock3 className="h-4 w-4 shrink-0 text-brass" /> Pick a time
              </span>
              <span className="flex min-w-0 flex-col items-center gap-1.5 rounded-xl border border-brass/15 bg-white/[0.035] px-2 py-3 text-center sm:flex-row sm:justify-center lg:justify-start lg:border-0 lg:bg-transparent lg:p-0 lg:text-left">
                <MapPin className="h-4 w-4 shrink-0 text-brass" /> Self pickup
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-x-clip bg-cream pb-40 pt-5 text-charcoal sm:pt-8 md:pb-20 lg:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
            <div>
              <div className="sticky top-[72px] z-20 -mx-4 border-y border-sand bg-cream/95 px-4 py-3 shadow-[0_12px_28px_-24px_rgba(60,27,12,.45)] backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:py-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-walnut/55" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search takeaway menu…"
                    className="w-full rounded-xl border border-charcoal/10 bg-white py-3.5 pl-11 pr-4 text-base outline-none transition focus:border-terracotta sm:text-sm"
                  />
                </div>
                <div className="-mx-1 mt-2.5 flex snap-x gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-3">
                  <button
                    type="button"
                    onClick={() => setCategory("all")}
                    className={
                      "snap-start whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.08em] transition sm:px-4 sm:text-xs sm:tracking-[0.1em] " +
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
                        "snap-start whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.08em] transition sm:px-4 sm:text-xs sm:tracking-[0.1em] " +
                        (category === cat.slug ? "bg-charcoal text-soft" : "border border-charcoal/10 bg-white text-walnut hover:border-terracotta")
                      }
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
                {visibleItems.map((item) => {
                  const options = getPriceOptions(item);
                  return (
                    <article key={item.id || item.slug || item.name} className="flex min-h-[138px] overflow-hidden rounded-[1.15rem] border border-sand bg-white shadow-[0_14px_38px_-34px_rgba(64,36,20,.5)] sm:block sm:min-h-0 sm:rounded-[1.35rem] sm:shadow-[0_18px_50px_-38px_rgba(64,36,20,.45)]">
                      {item.image && (
                        <div className="w-28 shrink-0 self-stretch overflow-hidden bg-sand/30 sm:aspect-[16/10] sm:w-full">
                          <Img
                            src={item.image}
                            alt={item.name}
                            fallbackSrc="/images/hero-food.webp"
                            className="h-full min-h-[138px] w-full object-cover sm:min-h-0"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1 p-3.5 sm:p-5">
                        <p className="truncate text-[8px] font-bold uppercase tracking-[0.16em] text-terracotta sm:text-[9px] sm:tracking-[0.2em]">
                          {item.cuisine || "Vegetarian"}
                        </p>
                        <h2 className="mt-1 font-display text-[1.22rem] leading-[1.08] text-charcoal sm:mt-1.5 sm:text-2xl sm:leading-tight">{item.name}</h2>
                        {item.description && <p className="mt-2 hidden line-clamp-2 text-sm leading-6 text-walnut/75 sm:block">{item.description}</p>}

                        <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                          {options.map((option) => (
                            <button
                              key={(option.label || "standard") + option.price}
                              type="button"
                              onClick={() => addItem(item, option)}
                              className="inline-flex min-h-9 items-center gap-1 rounded-full border border-terracotta/25 bg-terracotta/5 px-2.5 py-1.5 text-[11px] font-bold text-terracotta transition active:scale-[.98] active:bg-terracotta active:text-soft sm:min-h-0 sm:gap-1.5 sm:px-3.5 sm:py-2 sm:text-xs sm:hover:border-terracotta sm:hover:bg-terracotta sm:hover:text-soft"
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
              <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-[1.5rem] border border-sand bg-[#fffaf0] p-5 shadow-[0_24px_70px_-42px_rgba(64,36,20,.55)] [scrollbar-width:thin]">
                <OrderPanel />
              </div>
            </aside>
          </div>

          <div className="mt-7 rounded-[1.2rem] border border-sand bg-white/60 p-4 sm:mt-10 sm:rounded-[1.4rem] sm:p-6">
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
        className="fixed bottom-[76px] left-3 right-3 z-40 flex min-h-14 items-center justify-between rounded-2xl border border-white/10 bg-terracotta px-4 py-3.5 text-soft shadow-[0_16px_45px_rgba(60,27,12,.34)] active:scale-[.995] md:bottom-4 md:left-5 md:right-5 lg:hidden"
      >
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.07em] sm:text-sm">
          <ShoppingBag className="h-4 w-4" /> Pickup Cart ({itemCount})
        </span>
        <span className="font-display text-lg">{money(subtotal)}</span>
      </button>

      {cartOpen && (
        <div className="fixed inset-0 z-[120] bg-[#fffaf0] lg:hidden">
          <div className="mx-auto flex h-[100dvh] max-w-lg flex-col px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-[calc(0.75rem+env(safe-area-inset-top))] sm:px-5">
            <OrderPanel mobile />
          </div>
        </div>
      )}
    </>
  );
}
