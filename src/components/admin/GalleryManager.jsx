"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { PageHead, Btn, inputCls, labelCls } from "@/components/admin/AdminKit";

const CATS = ["Food", "Restaurant", "Dosa Specials", "Beverages", "Guests", "Events"];

async function requestJson(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
}

export default function GalleryManager() {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState({ image: "", caption: "", category: "Food" });
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await requestJson("/api/gallery");
      setItems(data.gallery || []);
      setError("");
    } catch (err) {
      setItems([]);
      setError(err.message || "Could not load gallery.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (e) => {
    e.preventDefault();
    if (!form.image) return;
    setError("");
    const max = (items || []).reduce((m, i) => Math.max(m, Number(i.sortOrder) || 0), -1);
    try {
      await requestJson("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sortOrder: max + 1 }),
      });
      setForm({ image: "", caption: "", category: "Food" });
      await load();
    } catch (err) {
      setError(err.message || "Could not add image.");
    }
  };

  const remove = async (id) => {
    if (!confirm("Remove this image?")) return;
    setError("");
    try {
      await requestJson(`/api/gallery/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err.message || "Could not remove image.");
    }
  };

  const patchLocal = (id, patch) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const persist = async (id, patch) => {
    setSavingId(id);
    setError("");
    try {
      await requestJson(`/api/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch (err) {
      setError(err.message || "Could not save gallery changes.");
      await load();
    } finally {
      setSavingId(null);
    }
  };

  const move = async (index, dir) => {
    const current = items[index];
    const target = items[index + dir];
    if (!current || !target) return;

    const currentOrder = Number(current.sortOrder) || index;
    const targetOrder = Number(target.sortOrder) || index + dir;
    const next = [...items];
    next[index] = { ...target, sortOrder: currentOrder };
    next[index + dir] = { ...current, sortOrder: targetOrder };
    setItems(next);

    try {
      await Promise.all([
        persist(current.id, { sortOrder: targetOrder }),
        persist(target.id, { sortOrder: currentOrder }),
      ]);
      await load();
    } catch {
      await load();
    }
  };

  if (!items) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-terracotta" /></div>;
  }

  return (
    <div>
      <PageHead title="Gallery Manager" subtitle={`${items.length} images`} />

      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-terracotta/20 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={add} className="mb-6 rounded-2xl bg-soft p-5 ring-1 ring-sand/60">
        <p className="mb-3 text-sm font-semibold text-charcoal">Add image</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <label className={labelCls}>Image URL</label>
            <input required value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} className={inputCls} placeholder="https://…" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Caption</label>
            <input value={form.caption} onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))} className={inputCls} placeholder="Short caption" />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inputCls}>
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <Btn variant="primary" className="mt-4"><Plus className="h-4 w-4" /> Add Image</Btn>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((g, i) => (
          <div key={g.id} className="overflow-hidden rounded-2xl bg-soft ring-1 ring-sand/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.image || "/images/fallback-restaurant.svg"}
              alt={g.caption || "Gallery"}
              className="h-40 w-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (e.currentTarget.dataset.fallbackApplied === "1") return;
                e.currentTarget.dataset.fallbackApplied = "1";
                e.currentTarget.src = "/images/fallback-restaurant.svg";
              }}
            />
            <div className="space-y-2 p-3">
              <input
                value={g.caption || ""}
                onChange={(e) => patchLocal(g.id, { caption: e.target.value })}
                onBlur={(e) => persist(g.id, { caption: e.target.value })}
                className={inputCls}
                placeholder="Caption"
              />
              <div className="flex items-center gap-1.5">
                <select
                  value={g.category}
                  onChange={(e) => {
                    patchLocal(g.id, { category: e.target.value });
                    persist(g.id, { category: e.target.value });
                  }}
                  className={inputCls}
                >
                  {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0 || savingId === g.id} aria-label="Move up" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sand text-walnut disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1 || savingId === g.id} aria-label="Move down" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sand text-walnut disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
                <button type="button" onClick={() => remove(g.id)} aria-label="Delete" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-terracotta hover:bg-terracotta/10"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
