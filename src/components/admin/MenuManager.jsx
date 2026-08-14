"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, Loader2, X } from "lucide-react";
import { Card, PageHead, Btn, inputCls, labelCls } from "@/components/admin/AdminKit";
import { MENU_CATEGORIES } from "@/lib/constants";
import { formatPrice, cn } from "@/lib/utils";

const EMPTY = {
  name: "",
  description: "",
  category: "starters",
  cuisine: "",
  price: "",
  image: "",
  vegetarian: true,
  spicyLevel: 0,
  recommended: false,
  bestseller: false,
  signature: false,
  available: true,
};

function DishForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      ...f,
      price: Number(f.price),
      spicyLevel: Number(f.spicyLevel),
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <form onSubmit={save} className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-cream p-6 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold text-charcoal">
            {initial.id ? "Edit Dish" : "Add Dish"}
          </h3>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-sand text-walnut">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>Dish Name</label>
            <input required value={f.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Description</label>
            <textarea rows={2} value={f.description} onChange={(e) => set("description", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select value={f.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
              {MENU_CATEGORIES.filter((c) => c.slug !== "recommended").map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Cuisine</label>
            <input value={f.cuisine} onChange={(e) => set("cuisine", e.target.value)} className={inputCls} placeholder="e.g. South Indian" />
          </div>
          <div>
            <label className={labelCls}>Price (₹)</label>
            <input required type="number" min="0" step="1" value={f.price} onChange={(e) => set("price", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Spice Level (0–4)</label>
            <input type="number" min="0" max="4" value={f.spicyLevel} onChange={(e) => set("spicyLevel", e.target.value)} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Image URL</label>
            <input value={f.image} onChange={(e) => set("image", e.target.value)} className={inputCls} placeholder="https://… (Cloudinary / uploaded image)" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            ["vegetarian", "Vegetarian"],
            ["available", "Available"],
            ["recommended", "Recommended"],
            ["bestseller", "Bestseller"],
            ["signature", "Signature"],
          ].map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center gap-2 rounded-xl border border-sand bg-white px-3 py-2 text-xs font-semibold text-walnut">
              <input type="checkbox" checked={f[key]} onChange={(e) => set(key, e.target.checked)} className="h-4 w-4 accent-[#b84f2f]" />
              {label}
            </label>
          ))}
        </div>

        <div className="mt-5 flex gap-2">
          <Btn variant="primary" className="w-full" disabled={saving}>
            {saving ? "Saving…" : "Save Dish"}
          </Btn>
          <Btn variant="outline" className="w-full" onClick={onClose}>Cancel</Btn>
        </div>
      </form>
    </div>
  );
}

export default function MenuManager() {
  const [items, setItems] = useState(null);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);

  const load = () => fetch("/api/menu").then((r) => r.json()).then((d) => setItems(d.items));
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!items) return [];
    if (!q.trim()) return items;
    const n = q.toLowerCase();
    return items.filter((i) => (i.name || "").toLowerCase().includes(n));
  }, [items, q]);

  const save = async (payload) => {
    const isEdit = Boolean(payload.id);
    const res = await fetch(isEdit ? `/api/menu/${payload.id}` : "/api/menu", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setEditing(null);
      load();
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this dish?")) return;
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    load();
  };

  const toggleAvailable = async (item) => {
    await fetch(`/api/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !item.available }),
    });
    load();
  };

  if (!items) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-terracotta" /></div>;
  }

  return (
    <div>
      <PageHead
        title="Menu Manager"
        subtitle={`${items.length} dishes`}
        action={<Btn onClick={() => setEditing({ ...EMPTY })}><Plus className="h-4 w-4" /> Add Dish</Btn>}
      />

      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-walnut/50" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes…" className={cn(inputCls, "pl-10")} />
      </div>

      <Card className="overflow-hidden p-0">
        <ul className="divide-y divide-sand">
          {filtered.map((item) => (
            <li key={item.id} className="flex items-center gap-3 p-3.5">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" loading="lazy" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.src = "/images/fallback-food.svg"; }} />
              ) : (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-espresso text-lg">🍽️</span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-charcoal">
                  {item.name}
                  {!item.available && <span className="ml-2 rounded-full bg-terracotta/10 px-2 py-0.5 text-[10px] font-bold uppercase text-terracotta">Sold out</span>}
                </p>
                <p className="truncate text-xs text-walnut">
                  {item.category} · {formatPrice(item.price)}
                  {item.recommended ? " · ⭐" : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleAvailable(item)}
                  className={cn("rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide", item.available ? "bg-[#2e7d32]/10 text-[#2e7d32]" : "bg-terracotta/10 text-terracotta")}
                >
                  {item.available ? "Live" : "Off"}
                </button>
                <button type="button" onClick={() => setEditing({ ...item })} aria-label="Edit" className="flex h-8 w-8 items-center justify-center rounded-full text-walnut hover:bg-sand/50"><Pencil className="h-4 w-4" /></button>
                <button type="button" onClick={() => remove(item.id)} aria-label="Delete" className="flex h-8 w-8 items-center justify-center rounded-full text-terracotta hover:bg-terracotta/10"><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {editing && <DishForm initial={editing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}
