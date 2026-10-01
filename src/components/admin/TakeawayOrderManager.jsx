"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock3,
  Loader2,
  PackageCheck,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Card, PageHead, Btn, inputCls } from "@/components/admin/AdminKit";
import { cn } from "@/lib/utils";

const STATUSES = ["all", "submitted", "confirmed", "ready", "completed", "cancelled"];
const STATUS_COLOR = {
  submitted: "bg-brass/15 text-brass",
  confirmed: "bg-[#2e7d32]/12 text-[#2e7d32]",
  ready: "bg-[#1565c0]/12 text-[#1565c0]",
  completed: "bg-sand/40 text-walnut",
  cancelled: "bg-terracotta/12 text-terracotta",
};

const money = (value) => "₹" + Number(value || 0).toLocaleString("en-IN");

export default function TakeawayOrderManager() {
  const [rows, setRows] = useState(null);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/admin/takeaway-orders", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load takeaway orders.");
      setRows(data.orders || []);
      setError("");
    } catch (err) {
      setRows([]);
      setError(err.message || "Could not load takeaway orders.");
    }
  };

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return [];
    let list = rows;
    if (status !== "all") list = list.filter((row) => row.status === status);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (row) =>
          row.name.toLowerCase().includes(needle) ||
          row.phone.includes(needle) ||
          row.orderCode.toLowerCase().includes(needle),
      );
    }
    return list;
  }, [rows, status, q]);

  const update = async (id, patch) => {
    const res = await fetch(`/api/admin/takeaway-orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Could not update order.");
      return;
    }
    setRows((current) => current.map((row) => (row.id === id ? data.order : row)));
  };

  const remove = async (id) => {
    if (!confirm("Delete this takeaway order?")) return;
    await fetch(`/api/admin/takeaway-orders/${id}`, { method: "DELETE" });
    setRows((current) => current.filter((row) => row.id !== id));
  };

  if (!rows) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-terracotta" /></div>;
  }

  return (
    <div>
      <PageHead title="Takeaway Orders" subtitle={`${rows.length} orders · status updates sync to customer history`} />

      {error && (
        <div className="mb-4 rounded-xl border border-terracotta/20 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {STATUSES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatus(value)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide",
                status === value ? "bg-charcoal text-soft" : "bg-soft text-walnut ring-1 ring-sand/60",
              )}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-walnut/50" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order ID, name or phone…" className={cn(inputCls, "pl-10")} />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((order) => (
          <Card key={order.id} className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-xl font-semibold text-charcoal">{order.orderCode}</p>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide", STATUS_COLOR[order.status] || STATUS_COLOR.submitted)}>
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-charcoal">{order.name} · <a className="text-terracotta" href={`tel:${order.phone}`}>{order.phone}</a></p>
                <p className="mt-1 text-xs text-walnut">
                  {new Date(order.createdAt).toLocaleString("en-IN")} · Pickup: {order.pickupTime}
                </p>

                <div className="mt-3 rounded-xl bg-cream p-3">
                  <div className="space-y-1.5">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between gap-3 text-sm">
                        <span className="text-walnut">{item.name}{item.variant ? ` (${item.variant})` : ""} × {item.qty}</span>
                        <span className="font-semibold text-charcoal">{money(item.lineTotal || item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between border-t border-sand pt-3 text-sm font-bold">
                    <span>Subtotal</span><span>{money(order.subtotal)}</span>
                  </div>
                </div>
                {order.note && <p className="mt-2 text-xs text-walnut"><strong>Note:</strong> {order.note}</p>}
              </div>

              <div className="w-full space-y-2 xl:w-72">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-walnut">Ready / pickup note</label>
                <input
                  defaultValue={order.readyTime || ""}
                  placeholder="e.g. Ready by 7:30 PM"
                  className={inputCls}
                  onBlur={(e) => {
                    const value = e.target.value.trim();
                    if (value !== (order.readyTime || "")) update(order.id, { readyTime: value });
                  }}
                />
                <div className="flex flex-wrap gap-1.5">
                  {order.status === "submitted" && (
                    <Btn variant="dark" onClick={() => update(order.id, { status: "confirmed" })}><Check className="h-3.5 w-3.5" /> Confirm</Btn>
                  )}
                  {(order.status === "submitted" || order.status === "confirmed") && (
                    <Btn variant="outline" onClick={() => update(order.id, { status: "ready" })}><PackageCheck className="h-3.5 w-3.5" /> Ready</Btn>
                  )}
                  {order.status !== "completed" && order.status !== "cancelled" && (
                    <Btn variant="outline" onClick={() => update(order.id, { status: "completed" })}><CheckCircle2 className="h-3.5 w-3.5" /> Complete</Btn>
                  )}
                  {order.status !== "cancelled" && order.status !== "completed" && (
                    <Btn variant="danger" onClick={() => update(order.id, { status: "cancelled" })}><X className="h-3.5 w-3.5" /> Cancel</Btn>
                  )}
                  <Btn variant="ghost" onClick={() => remove(order.id)}><Trash2 className="h-4 w-4" /></Btn>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl bg-soft p-10 text-center text-sm text-walnut">
            <Clock3 className="mx-auto mb-3 h-6 w-6 text-brass" />
            No takeaway orders in this view.
          </div>
        )}
      </div>
    </div>
  );
}
