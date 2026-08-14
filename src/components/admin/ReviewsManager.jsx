"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Star, Check } from "lucide-react";
import { Card, Btn, inputCls, labelCls } from "@/components/admin/AdminKit";
import { cn } from "@/lib/utils";

const EMPTY = { name: "", rating: 5, review: "", source: "Google", date: "" };

export default function ReviewsManager() {
  const [reviews, setReviews] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = () => fetch("/api/reviews").then((r) => r.json()).then((d) => setReviews(d.reviews || []));
  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, approved: true, rating: Number(form.rating) }),
    });
    setForm(EMPTY);
    load();
  };

  const toggle = async (r) => {
    await fetch(`/api/reviews/${r.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approved: !r.approved }) });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    load();
  };

  if (!reviews) {
    return <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-terracotta" /></div>;
  }

  return (
    <Card className="mt-5">
      <h2 className="font-display text-xl font-semibold text-charcoal">Guest Reviews</h2>
      <p className="mt-1 text-xs text-walnut">Add only genuine reviews shared by your guests.</p>

      <form onSubmit={add} className="mt-4 grid gap-3 rounded-xl bg-cream p-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Customer Name</label>
          <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Rating (1–5)</label>
          <input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Review</label>
          <textarea required rows={2} value={form.review} onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Source</label>
          <input value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Date (optional)</label>
          <input value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={inputCls} placeholder="e.g. Jan 2026" />
        </div>
        <div className="sm:col-span-2">
          <Btn variant="dark"><Plus className="h-4 w-4" /> Add Review</Btn>
        </div>
      </form>

      <ul className="mt-4 divide-y divide-sand">
        {reviews.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-charcoal">{r.name}</p>
                <span className="flex items-center gap-0.5 text-xs text-brass">
                  {r.rating} <Star className="h-3.5 w-3.5 fill-brass text-brass" />
                </span>
                {!r.approved && <span className="rounded-full bg-terracotta/10 px-2 py-0.5 text-[10px] font-bold uppercase text-terracotta">Hidden</span>}
              </div>
              <p className="line-clamp-2 text-xs text-walnut">“{r.review}”</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button type="button" onClick={() => toggle(r)} className={cn("flex h-8 w-8 items-center justify-center rounded-full", r.approved ? "bg-[#2e7d32]/10 text-[#2e7d32]" : "bg-terracotta/10 text-terracotta")} aria-label="Toggle visibility">
                <Check className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => remove(r.id)} aria-label="Delete" className="flex h-8 w-8 items-center justify-center rounded-full text-terracotta hover:bg-terracotta/10"><Trash2 className="h-4 w-4" /></button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
