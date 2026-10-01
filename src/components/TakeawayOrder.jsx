"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  History,
  MapPin,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { RESTAURANT } from "@/lib/constants";

const HISTORY_KEY = "ayodhya_takeaway_history_v1";

function getPriceOptions(item) {
  const values = String(item.price || "")
    .split("/")
    .map((part) => Number(String(part).replace(/[^\d.]/g, "")))
    .filter((value) => Number.isFinite(value) && value > 0);
  if (!values.length) return [];
  if (values.length === 1) return [{ label: "", price: values[0] }];

  const text = (String(item.name || "") + " " + String(item.description || "")).toLowerCase();
  let labels = values.map((_, index) => "Option " + (index + 1));
  if (text.includes("half") && text.includes("full")) labels = ["Half", "Full"];
  else if (text.includes("1pcs") || text.includes("1 pcs") || text.includes("1 pc")) labels = ["1 pc", "2 pcs"];
  return values.map((price, index) => ({ label: labels[index] || "Option " + (index + 1), price }));
}

function money(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN");
}

function statusInfo(status) {
  if (status === "confirmed") return { label: "Confirmed", className: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 };
  if (status === "ready") return { label: "Ready for pickup", className: "bg-blue-50 text-blue-700", icon: PackageCheck };
  if (status === "completed") return { label: "Completed", className: "bg-stone-100 text-stone-700", icon: CheckCircle2 };
  if (status === "cancelled") return { label: "Cancelled", className: "bg-red-50 text-red-700", icon: X };
  return { label: "Awaiting confirmation", className: "bg-amber-50 text-amber-800", icon: Clock3 };
}

function OrderPanel({
  mobile,
  cartItems,
  subtotal,
  name,
  setName,
  phone,
  setPhone,
  pickupTime,
  setPickupTime,
  note,
  setNote,
  error,
  submitting,
  onSubmit,
  onClose,
  onChangeQty,
}) {
  return (
    <div className={mobile ? "flex h-full min-h-0 flex-col" : ""}>
      <div className={mobile ? "flex shrink-0 items-start justify-between gap-3 border-b border-brass/15 pb-4" : "flex items-start justify-between gap-3 border-b border-brass/15 pb-4"}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-terracotta">Your Pickup Order</p>
          <h2 className="mt-1 font-display text-2xl text-charcoal sm:text-3xl">Takeaway Cart</h2>
        </div>
        {mobile && (
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/10 text-charcoal" aria-label="Close takeaway cart">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className={mobile ? "min-h-0 flex-1 overflow-y-auto overscroll-contain py-4 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "py-5"}
      >
        {!cartItems.length ? (
          <div className="rounded-2xl border border-dashed border-charcoal/15 bg-white/45 p-6 text-center">
            <ShoppingBag className="mx-auto h-7 w-7 text-terracotta" />
            <p className="mt-3 font-semibold text-charcoal">Your cart is empty.</p>
            <p className="mt-1 text-sm leading-6 text-walnut">Choose dishes below to start a new pickup order.</p>
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
                  <p className="whitespace-nowrap font-display text-lg text-terracotta">{money(entry.price * entry.qty)}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-walnut">{money(entry.price)} each</span>
                  <div className="flex items-center rounded-full border border-charcoal/10 bg-cream">
                    <button type="button" onClick={() => onChangeQty(entry.key, -1)} className="flex h-8 w-8 items-center justify-center" aria-label={"Remove one " + entry.name}>
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-7 text-center text-sm font-bold">{entry.qty}</span>
                    <button type="button" onClick={() => onChangeQty(entry.key, 1)} className="flex h-8 w-8 items-center justify-center" aria-label={"Add one " + entry.name}>
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
            <label htmlFor={mobile ? "pickup-name-mobile" : "pickup-name"} className="text-xs font-bold uppercase tracking-[0.14em] text-walnut">Name</label>
            <input
              id={mobile ? "pickup-name-mobile" : "pickup-name"}
              required
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-2 w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3.5 text-[16px] text-charcoal outline-none transition focus:border-terracotta sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor={mobile ? "pickup-phone-mobile" : "pickup-phone"} className="text-xs font-bold uppercase tracking-[0.14em] text-walnut">Phone</label>
            <input
              id={mobile ? "pickup-phone-mobile" : "pickup-phone"}
              required
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              maxLength={15}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className="mt-2 w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3.5 text-[16px] text-charcoal outline-none transition focus:border-terracotta sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor={mobile ? "pickup-time-mobile" : "pickup-time"} className="text-xs font-bold uppercase tracking-[0.14em] text-walnut">Preferred pickup time</label>
            <select id={mobile ? "pickup-time-mobile" : "pickup-time"} value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="mt-2 w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3.5 text-[16px] text-charcoal outline-none transition focus:border-terracotta sm:text-sm">
              <option>ASAP — restaurant to confirm</option>
              <option>In about 30 minutes</option>
              <option>In about 45 minutes</option>
              <option>In about 60 minutes</option>
              <option>In about 90 minutes</option>
            </select>
          </div>

          <div>
            <label htmlFor={mobile ? "pickup-note-mobile" : "pickup-note"} className="text-xs font-bold uppercase tracking-[0.14em] text-walnut">Special note</label>
            <textarea id={mobile ? "pickup-note-mobile" : "pickup-note"} value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Less spicy, no onion, packing note…" className="mt-2 w-full resize-none rounded-xl border border-charcoal/10 bg-white px-4 py-3.5 text-[16px] text-charcoal outline-none transition focus:border-terracotta sm:text-sm" />
          </div>
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

        <button type="submit" disabled={submitting || !cartItems.length} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-5 py-4 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-burnt disabled:cursor-not-allowed disabled:opacity-50">
          <MessageCircle className="h-4 w-4" /> {submitting ? "Saving order…" : "Place Order & Open WhatsApp"}
        </button>

        <p className="mt-3 text-center text-[11px] leading-5 text-walnut/70">
          Your order is saved first, then WhatsApp opens for restaurant confirmation. The bag clears automatically after submission.
        </p>
      </form>
    </div>
  );
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
  const [history, setHistory] = useState([]);
  const [historyReady, setHistoryReady] = useState(false);
  const [notice, setNotice] = useState(null);
  const historyRef = useRef([]);

  useEffect(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(HISTORY_KEY) || "[]");
      const safe = Array.isArray(parsed) ? parsed.slice(0, 12) : [];
      setHistory(safe);
      historyRef.current = safe;
    } catch {
      setHistory([]);
    }
    setHistoryReady(true);
  }, []);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    if (!cartOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [cartOpen]);

  const persistHistory = (next) => {
    const trimmed = next.slice(0, 12);
    setHistory(trimmed);
    historyRef.current = trimmed;
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    } catch {}
  };

  const syncStatuses = async () => {
    const current = historyRef.current;
    if (!current.length) return;

    const refreshed = await Promise.all(
      current.map(async (order) => {
        if (!order.persisted || !order.orderCode || !order.phone) return order;
        try {
          const res = await fetch(`/api/takeaway-orders?code=${encodeURIComponent(order.orderCode)}&phone=${encodeURIComponent(order.phone)}`, { cache: "no-store" });
          const data = await res.json();
          if (!res.ok || !data.order) return order;
          if (data.order.status !== order.status && ["confirmed", "ready"].includes(data.order.status)) {
            setNotice(data.order);
          }
          return { ...order, ...data.order };
        } catch {
          return order;
        }
      }),
    );

    persistHistory(refreshed);
  };

  useEffect(() => {
    if (!historyReady) return undefined;
    const timer = window.setInterval(syncStatuses, 20000);
    return () => window.clearInterval(timer);
  }, [historyReady]);

  const visibleItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (item.available === false) return false;
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      return [item.name, item.cuisine, item.description].filter(Boolean).join(" ").toLowerCase().includes(q);
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
          : { key, id: item.id, name: item.name, variant: option.label, price: option.price, qty: 1 },
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

  const submitOrder = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cartItems.length) return setError("Please add at least one item to your takeaway order.");
    if (!name.trim()) return setError("Please enter your name.");
    if (cleanPhone.length < 10) return setError("Please enter a valid phone number.");

    setSubmitting(true);
    setError("");

    const popup = window.open("", "_blank");
    const payload = { name: name.trim(), phone: phone.trim(), pickupTime, note: note.trim(), items: cartItems };

    try {
      const res = await fetch("/api/takeaway-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.order) throw new Error(data.error || "Could not save your order.");

      const order = { ...data.order, persisted: Boolean(data.order.persisted ?? data.trackingAvailable) };
      persistHistory([order, ...historyRef.current.filter((item) => item.orderCode !== order.orderCode)]);
      setCart({});
      setNote("");
      setPickupTime("ASAP — restaurant to confirm");
      setCartOpen(false);
      setNotice(order);

      const lines = order.items.map((entry, index) => {
        const variant = entry.variant ? " (" + entry.variant + ")" : "";
        return `${index + 1}. ${entry.name}${variant} × ${entry.qty} — ${money(entry.lineTotal || entry.price * entry.qty)}`;
      });
      const message = [
        "*AYODHYA RESTAURANT — TAKEAWAY / SELF PICKUP*",
        "",
        "*Order ID:* " + order.orderCode,
        "*Customer:* " + order.name,
        "*Phone:* " + order.phone,
        "*Preferred pickup:* " + order.pickupTime,
        "",
        "*Order:*",
        ...lines,
        "",
        "*Menu subtotal:* " + money(order.subtotal),
        order.note ? "*Special note:* " + order.note : "",
        "",
        "*Pickup location:* " + RESTAURANT.addressShort,
        "",
        "Please confirm item availability, final payable amount and pickup-ready time.",
      ].filter(Boolean).join("\n");

      const orderUrl = RESTAURANT.whatsappHref + "?text=" + encodeURIComponent(message);
      if (popup) popup.location.href = orderUrl;
      else window.location.href = orderUrl;
    } catch (err) {
      if (popup) popup.close();
      setError(err.message || "Could not place your order. Please try again.");
      setCartOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="relative overflow-hidden bg-charcoal pb-9 pt-24 text-soft sm:pb-14 sm:pt-28">
        <div className="pattern-jaali-light absolute inset-0 opacity-[0.1]" aria-hidden="true" />
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-brass/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-brass sm:text-[11px] sm:tracking-[0.28em]"><span className="h-px w-8 bg-current opacity-60" /> Takeaway · Self Pickup</p>
          <div className="mt-4 grid gap-6 sm:mt-5 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-8">
            <div className="max-w-3xl">
              <h1 className="max-w-[18ch] font-display text-[2.55rem] font-semibold leading-[0.95] tracking-[-0.025em] sm:text-6xl lg:text-7xl">Order Ahead. Pick Up Fresh.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/68 sm:mt-5 sm:text-lg sm:leading-7">Choose your favourites, send your pickup order to Ayodhya, and track its confirmation here.</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-cream/65 sm:text-sm sm:normal-case sm:tracking-normal lg:grid-cols-1">
              <span className="flex min-w-0 flex-col items-center gap-1.5 rounded-xl border border-brass/15 bg-white/[0.035] px-2 py-3 text-center sm:flex-row sm:justify-center lg:justify-start lg:border-0 lg:bg-transparent lg:p-0"><CheckCircle2 className="h-4 w-4 text-brass" /> Choose dishes</span>
              <span className="flex min-w-0 flex-col items-center gap-1.5 rounded-xl border border-brass/15 bg-white/[0.035] px-2 py-3 text-center sm:flex-row sm:justify-center lg:justify-start lg:border-0 lg:bg-transparent lg:p-0"><Clock3 className="h-4 w-4 text-brass" /> Restaurant confirms</span>
              <span className="flex min-w-0 flex-col items-center gap-1.5 rounded-xl border border-brass/15 bg-white/[0.035] px-2 py-3 text-center sm:flex-row sm:justify-center lg:justify-start lg:border-0 lg:bg-transparent lg:p-0"><MapPin className="h-4 w-4 text-brass" /> Self pickup</span>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-x-clip bg-cream pb-40 pt-5 text-charcoal sm:pt-8 md:pb-20 lg:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {notice && (
            <div className="mb-5 flex items-start justify-between gap-4 rounded-[1.25rem] border border-brass/25 bg-soft p-4 shadow-soft sm:p-5">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-terracotta" />
                <div>
                  <p className="font-semibold text-charcoal">
                    {notice.status === "confirmed" ? "Your order is confirmed." : notice.status === "ready" ? "Your order is ready for pickup." : "Order request saved successfully."}
                  </p>
                  <p className="mt-1 text-sm text-walnut">{notice.orderCode}{notice.readyTime ? " · " + notice.readyTime : " · Awaiting restaurant confirmation"}</p>
                </div>
              </div>
              <button type="button" onClick={() => setNotice(null)} className="text-walnut/60"><X className="h-4 w-4" /></button>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
            <div>
              <div className="sticky top-[72px] z-20 -mx-4 border-y border-sand bg-cream/95 px-4 py-3 shadow-[0_12px_28px_-24px_rgba(60,27,12,.45)] backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:py-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-walnut/55" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search takeaway menu…" className="w-full rounded-xl border border-charcoal/10 bg-white py-3.5 pl-11 pr-4 text-base outline-none transition focus:border-terracotta sm:text-sm" />
                </div>
                <div className="-mx-1 mt-2.5 flex snap-x gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-3">
                  <button type="button" onClick={() => setCategory("all")} className={"snap-start whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.08em] transition sm:px-4 sm:text-xs " + (category === "all" ? "bg-charcoal text-soft" : "border border-charcoal/10 bg-white text-walnut")}>All</button>
                  {categories.map((cat) => (
                    <button key={cat.slug} type="button" onClick={() => setCategory(cat.slug)} className={"snap-start whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.08em] transition sm:px-4 sm:text-xs " + (category === cat.slug ? "bg-charcoal text-soft" : "border border-charcoal/10 bg-white text-walnut")}>{cat.name}</button>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
                {visibleItems.map((item) => {
                  const options = getPriceOptions(item);
                  return (
                    <article key={item.id || item.slug || item.name} className="flex min-h-[138px] overflow-hidden rounded-[1.15rem] border border-sand bg-white shadow-[0_14px_38px_-34px_rgba(64,36,20,.5)] sm:block sm:min-h-0 sm:rounded-[1.35rem]">
                      {item.image && (
                        <div className="w-28 shrink-0 self-stretch overflow-hidden bg-sand/30 sm:aspect-[16/10] sm:w-full">
                          <img src={item.image} alt={item.name} className="h-full min-h-[138px] w-full object-cover sm:min-h-0" loading="lazy" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1 p-3.5 sm:p-5">
                        <p className="truncate text-[8px] font-bold uppercase tracking-[0.16em] text-terracotta sm:text-[9px]">{item.cuisine || "Vegetarian"}</p>
                        <h2 className="mt-1 font-display text-[1.22rem] leading-[1.08] text-charcoal sm:text-2xl">{item.name}</h2>
                        {item.description && <p className="mt-2 hidden line-clamp-2 text-sm leading-6 text-walnut/75 sm:block">{item.description}</p>}
                        <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                          {options.map((option) => (
                            <button key={option.label + option.price} type="button" onClick={() => addItem(item, option)} className="inline-flex min-h-9 items-center gap-1 rounded-full border border-terracotta/25 bg-terracotta/5 px-2.5 py-1.5 text-[11px] font-bold text-terracotta transition active:scale-[.98] sm:px-3.5 sm:text-xs">
                              <Plus className="h-3.5 w-3.5" /> {option.label ? option.label + " · " : ""}{money(option.price)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {!visibleItems.length && <div className="mt-6 rounded-2xl border border-dashed border-charcoal/15 bg-white/40 p-8 text-center text-sm text-walnut">No dishes match this search.</div>}
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-[1.5rem] border border-sand bg-[#fffaf0] p-5 shadow-[0_24px_70px_-42px_rgba(64,36,20,.55)] [scrollbar-width:thin]">
                <OrderPanel mobile={false} cartItems={cartItems} subtotal={subtotal} name={name} setName={setName} phone={phone} setPhone={setPhone} pickupTime={pickupTime} setPickupTime={setPickupTime} note={note} setNote={setNote} error={error} submitting={submitting} onSubmit={submitOrder} onClose={() => setCartOpen(false)} onChangeQty={changeQty} />
              </div>
            </aside>
          </div>

          {history.length > 0 && (
            <section className="mt-10 rounded-[1.5rem] border border-sand bg-soft p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-terracotta"><History className="h-4 w-4" /> Your order history</p>
                  <h2 className="mt-1 font-display text-2xl text-charcoal">Recent Pickup Orders</h2>
                </div>
                <button type="button" onClick={syncStatuses} className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white px-4 py-2 text-xs font-bold text-walnut">
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh status
                </button>
              </div>

              <div className="mt-5 grid gap-3 lg:grid-cols-2">
                {history.map((order) => {
                  const meta = statusInfo(order.status);
                  const StatusIcon = meta.icon;
                  return (
                    <article key={order.orderCode} className="rounded-2xl border border-sand/70 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-lg font-semibold text-charcoal">{order.orderCode}</p>
                          <p className="mt-1 text-xs text-walnut">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
                        </div>
                        <span className={"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase " + meta.className}><StatusIcon className="h-3.5 w-3.5" /> {meta.label}</span>
                      </div>
                      <div className="mt-3 space-y-1 text-sm text-walnut">
                        {order.items.slice(0, 4).map((item, index) => <p key={index}>{item.name}{item.variant ? " (" + item.variant + ")" : ""} × {item.qty}</p>)}
                        {order.items.length > 4 && <p className="text-xs">+ {order.items.length - 4} more items</p>}
                      </div>
                      <div className="mt-3 flex items-end justify-between border-t border-sand pt-3">
                        <div>
                          <p className="text-xs text-walnut">Pickup</p>
                          <p className="text-sm font-semibold text-charcoal">{order.readyTime || order.pickupTime}</p>
                        </div>
                        <p className="font-display text-xl text-terracotta">{money(order.subtotal)}</p>
                      </div>
                      {!order.persisted && <p className="mt-3 text-[11px] text-walnut/70">Saved on this device. Restaurant confirmation continues on WhatsApp.</p>}
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </section>

      {itemCount > 0 && (
        <button type="button" onClick={() => setCartOpen(true)} className="fixed bottom-[76px] left-3 right-3 z-40 flex min-h-14 items-center justify-between rounded-2xl border border-white/10 bg-terracotta px-4 py-3.5 text-soft shadow-[0_16px_45px_rgba(60,27,12,.34)] lg:hidden">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.07em]"><ShoppingBag className="h-4 w-4" /> Pickup Cart · {itemCount}</span>
          <span className="font-display text-xl">{money(subtotal)}</span>
        </button>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-[120] bg-[#fffaf0] lg:hidden">
          <div className="mx-auto flex h-[100dvh] max-w-lg flex-col px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-[calc(0.75rem+env(safe-area-inset-top))] sm:px-5">
            <OrderPanel mobile cartItems={cartItems} subtotal={subtotal} name={name} setName={setName} phone={phone} setPhone={setPhone} pickupTime={pickupTime} setPickupTime={setPickupTime} note={note} setNote={setNote} error={error} submitting={submitting} onSubmit={submitOrder} onClose={() => setCartOpen(false)} onChangeQty={changeQty} />
          </div>
        </div>
      )}
    </>
  );
}
