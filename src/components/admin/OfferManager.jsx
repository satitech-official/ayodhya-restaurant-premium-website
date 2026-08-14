"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { Card, PageHead, Btn, inputCls, labelCls } from "@/components/admin/AdminKit";
import { cn } from "@/lib/utils";

const EMPTY = {
  title: "",
  description: "",
  image: "",
  badge: "",
  ctaLabel: "",
  ctaLink: "",
  validFrom: "",
  validUntil: "",
  active: true,
};

function OfferForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/60 backdrop-blur-sm sm:items-center sm:p-4">
      <form onSubmit={(e) => { e.preventDefault(); onSave(f); }} className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-cream p-6 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold text-charcoal">{initial.id ? "Edit Offer" : "New Offer"}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-sand text-walnut"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className={labelCls}>Title</label>
            <input required value={f.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={2} value={f.description} onChange={(e) => set("description", e.target.value)} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Badge</label>
              <input value={f.badge} onChange={(e) => set("badge", e.target.value)} className={inputCls} placeholder="Seasonal" />
            </div>
            <div>
              <label className={labelCls}>Image URL</label>
              <input value={f.image} onChange={(e) => set("image", e.target.value)} className={inputCls} placeholder="https://…" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>CTA Label</label>
              <input value={f.ctaLabel} onChange={(e) => set("ctaLabel", e.target.value)} className={inputCls} placeholder="View Menu" />
            </div>
            <div>
              <label className={labelCls}>CTA Link</label>
              <input value={f.ctaLink} onChange={(e) => set("ctaLink", e.target.value)} className={inputCls} placeholder="/menu" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Valid From</label>
              <input type="date" value={f.validFrom} onChange={(e) => set("validFrom", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Valid Until</label>
              <input type="date" value={f.validUntil} onChange={(e) => set("validUntil", e.target.value)} className={inputCls} />
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-walnut">
            <input type="checkbox" checked={f.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 accent-[#b84f2f]" /> Active
          </label>
        </div>

        <Btn variant="primary" className="mt-5 w-full">Save Offer</Btn>
      </form>
    </div>
  );
}

export default function OfferManager() {
  const [offers, setOffers] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = () => fetch("/api/offers?all=1").then((r) => r.json()).then((d) => setOffers(d.offers || []));
  useEffect(() => {
    load();
  }, []);

  const save = async (payload) => {
    const isEdit = Boolean(payload.id);
    await fetch(isEdit ? `/api/offers/${payload.id}` : "/api/offers", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setEditing(null);
    load();
  };

  const toggle = async (o) => {
    await fetch(`/api/offers/${o.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !o.active }) });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this offer?")) return;
    await fetch(`/api/offers/${id}`, { method: "DELETE" });
    load();
  };

  if (!offers) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-terracotta" /></div>;
  }

  return (
    <div>
      <PageHead
        title="Offers & Events"
        subtitle={`${offers.length} offers`}
        action={<Btn onClick={() => setEditing({ ...EMPTY })}><Plus className="h-4 w-4" /> New Offer</Btn>}
      />

      <div className="space-y-3">
        {offers.map((o) => (
          <Card key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-charcoal">{o.title}</p>
                {o.badge && <span className="rounded-full bg-terracotta/10 px-2 py-0.5 text-[10px] font-bold uppercase text-terracotta">{o.badge}</span>}
              </div>
              <p className="mt-0.5 line-clamp-1 text-xs text-walnut">{o.description}</p>
              <p className="mt-0.5 text-[11px] text-walnut/70">
                {o.validFrom || "—"} → {o.validUntil || "—"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button type="button" onClick={() => toggle(o)} className={cn("rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide", o.active ? "bg-[#2e7d32]/10 text-[#2e7d32]" : "bg-terracotta/10 text-terracotta")}>
                {o.active ? "Active" : "Hidden"}
              </button>
              <button type="button" onClick={() => setEditing({ ...o })} aria-label="Edit" className="flex h-8 w-8 items-center justify-center rounded-full text-walnut hover:bg-sand/50"><Pencil className="h-4 w-4" /></button>
              <button type="button" onClick={() => remove(o.id)} aria-label="Delete" className="flex h-8 w-8 items-center justify-center rounded-full text-terracotta hover:bg-terracotta/10"><Trash2 className="h-4 w-4" /></button>
            </div>
          </Card>
        ))}
      </div>

      {editing && <OfferForm initial={editing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}
