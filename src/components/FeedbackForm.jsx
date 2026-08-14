"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { RESTAURANT } from "@/lib/constants";

const inputCls =
  "w-full rounded-xl border border-sand bg-soft px-4 py-3 text-sm text-espresso placeholder:text-walnut/50 transition focus:border-terracotta focus:outline-none";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-walnut";

function feedbackWhatsAppUrl(form) {
  const phone = RESTAURANT.whatsappHref.replace(/\/$/, "");
  const message = [
    "Hello Ayodhya Restaurant, I am contacting you from your website.",
    "",
    `Name: ${form.name}`,
    form.phone ? `Phone: ${form.phone}` : "",
    form.email ? `Email: ${form.email}` : "",
    form.subject ? `Subject: ${form.subject}` : "",
    `Message: ${form.message}`,
  ]
    .filter(Boolean)
    .join("\n");
  return `${phone}?text=${encodeURIComponent(message)}`;
}

export default function FeedbackForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "", website: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
      window.open(feedbackWhatsAppUrl(form), "_blank", "noopener,noreferrer");
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Could not send your message.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-[2rem] bg-soft p-10 text-center shadow-soft ring-1 ring-sand/60">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[#2e7d32]" />
        <h3 className="mt-4 font-display text-3xl font-semibold text-charcoal">Message sent!</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm text-walnut">
          Thank you for reaching out. We'll get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setForm({ name: "", phone: "", email: "", subject: "", message: "", website: "" });
          }}
          className="mt-6 rounded-full border border-charcoal/20 px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-charcoal transition hover:border-terracotta hover:text-terracotta"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[2rem] bg-soft p-6 shadow-soft ring-1 ring-sand/60 sm:p-8">
      <input type="text" name="website" value={form.website} onChange={set("website")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fb-name" className={labelCls}>Name</label>
          <input id="fb-name" required value={form.name} onChange={set("name")} className={inputCls} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="fb-phone" className={labelCls}>Phone</label>
          <input id="fb-phone" type="tel" value={form.phone} onChange={set("phone")} className={inputCls} placeholder="+91 …" />
        </div>
        <div>
          <label htmlFor="fb-email" className={labelCls}>Email</label>
          <input id="fb-email" type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder="you@email.com" />
        </div>
        <div>
          <label htmlFor="fb-subject" className={labelCls}>Subject</label>
          <input id="fb-subject" value={form.subject} onChange={set("subject")} className={inputCls} placeholder="How can we help?" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="fb-message" className={labelCls}>Message</label>
          <textarea id="fb-message" required rows={5} value={form.message} onChange={set("message")} className={inputCls} placeholder="Write your message…" />
        </div>
      </div>

      {error && <p className="mt-4 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">{error}</p>}

      <button type="submit" disabled={status === "loading"} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-soft transition hover:bg-espresso disabled:opacity-60">
        {status === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <><Send className="h-4 w-4" /> Send Message</>}
      </button>
    </form>
  );
}
