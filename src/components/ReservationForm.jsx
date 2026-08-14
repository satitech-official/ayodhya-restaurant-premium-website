"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Phone } from "lucide-react";
import { OCCASIONS, SEATING_PREFERENCES, RESTAURANT } from "@/lib/constants";

const inputCls =
  "w-full rounded-xl border border-sand bg-soft px-4 py-3 text-sm text-espresso placeholder:text-walnut/50 transition focus:border-terracotta focus:outline-none";

const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-walnut";

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export default function ReservationForm({ compact = false }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "19:00",
    guests: 2,
    occasion: "Regular Dining",
    seating: "No preference",
    specialRequest: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [ref, setRef] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setRef(data.reservation);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Could not submit your request.");
    }
  };

  if (status === "success" && ref) {
    return (
      <div className="rounded-[2rem] bg-soft p-8 text-center shadow-soft ring-1 ring-sand/60">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[#2e7d32]" />
        <h3 className="mt-4 font-display text-3xl font-semibold text-charcoal">
          Request received, {ref.name?.split(" ")[0]}!
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-walnut">
          We've noted your table for <strong>{ref.date}</strong> at <strong>{ref.time}</strong> for{" "}
          <strong>{ref.guests} guest(s)</strong>. Our team will confirm on{" "}
          <a href={RESTAURANT.phoneHref} className="font-semibold text-terracotta">
            {RESTAURANT.phoneDisplay}
          </a>
          . Booking reference: <strong>#{String(ref.id).padStart(4, "0")}</strong>
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setRef(null);
            setForm((f) => ({ ...f, name: "", phone: "", date: "", specialRequest: "" }));
          }}
          className="mt-6 rounded-full border border-charcoal/20 px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-charcoal transition hover:border-terracotta hover:text-terracotta"
        >
          Make Another Reservation
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[2rem] bg-soft p-6 shadow-soft ring-1 ring-sand/60 sm:p-8">
      <div className={compact ? "grid gap-4 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2"}>
        <div className={compact ? "" : "sm:col-span-2"}>
          <label htmlFor="res-name" className={labelCls}>
            Full Name
          </label>
          <input
            id="res-name"
            required
            value={form.name}
            onChange={set("name")}
            placeholder="Your name"
            className={inputCls}
          />
        </div>

        <div className={compact ? "" : "sm:col-span-2"}>
          <label htmlFor="res-phone" className={labelCls}>
            Phone Number
          </label>
          <input
            id="res-phone"
            required
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+91 …"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="res-date" className={labelCls}>
            Date
          </label>
          <input
            id="res-date"
            required
            type="date"
            min={todayISO()}
            value={form.date}
            onChange={set("date")}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="res-time" className={labelCls}>
            Time
          </label>
          <input
            id="res-time"
            required
            type="time"
            value={form.time}
            onChange={set("time")}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="res-guests" className={labelCls}>
            Number of Guests
          </label>
          <select id="res-guests" value={form.guests} onChange={set("guests")} className={inputCls}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="res-occasion" className={labelCls}>
            Occasion
          </label>
          <select id="res-occasion" value={form.occasion} onChange={set("occasion")} className={inputCls}>
            {OCCASIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="res-seating" className={labelCls}>
            Seating Preference
          </label>
          <select id="res-seating" value={form.seating} onChange={set("seating")} className={inputCls}>
            {SEATING_PREFERENCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="res-request" className={labelCls}>
            Special Request <span className="font-normal normal-case text-walnut/60">(optional)</span>
          </label>
          <textarea
            id="res-request"
            rows={3}
            value={form.specialRequest}
            onChange={set("specialRequest")}
            placeholder="Birthday cake, window seat, allergen note…"
            className={inputCls}
          />
        </div>
      </div>

      {error && <p className="mt-4 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-soft transition hover:bg-burnt disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
          </>
        ) : (
          <>
            <Phone className="h-4 w-4" /> Request Reservation
          </>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-walnut/70">
        We'll confirm your table by phone or WhatsApp.
      </p>
    </form>
  );
}
