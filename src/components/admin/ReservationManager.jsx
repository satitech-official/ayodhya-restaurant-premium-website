"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, Trash2, Check, X, Flag } from "lucide-react";
import { Card, PageHead, Btn, inputCls } from "@/components/admin/AdminKit";
import { cn } from "@/lib/utils";

const STATUSES = ["all", "new", "confirmed", "completed", "cancelled"];
const STATUS_COLOR = {
  new: "bg-brass/15 text-brass",
  confirmed: "bg-[#2e7d32]/12 text-[#2e7d32]",
  completed: "bg-sand/40 text-walnut",
  cancelled: "bg-terracotta/12 text-terracotta",
};

export default function ReservationManager() {
  const [rows, setRows] = useState(null);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");

  const load = () => fetch("/api/reservations").then((r) => r.json()).then((d) => setRows(d.reservations || []));
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return [];
    let list = rows;
    if (status !== "all") list = list.filter((r) => r.status === status);
    if (q.trim()) {
      const n = q.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(n) || r.phone.includes(n));
    }
    return list;
  }, [rows, status, q]);

  const update = async (id, patch) => {
    await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this reservation?")) return;
    await fetch(`/api/reservations/${id}`, { method: "DELETE" });
    load();
  };

  if (!rows) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-terracotta" /></div>;
  }

  return (
    <div>
      <PageHead title="Reservations" subtitle={`${rows.length} total`} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-1.5 overflow-x-auto">
          {STATUSES.map((s) => (
            <button key={s} type="button" onClick={() => setStatus(s)} className={cn("shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide", status === s ? "bg-charcoal text-soft" : "bg-soft text-walnut ring-1 ring-sand/60")}>
              {s}
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-walnut/50" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name or phone…" className={cn(inputCls, "pl-10")} />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-charcoal">{r.name}</p>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide", STATUS_COLOR[r.status])}>{r.status}</span>
                </div>
                <p className="mt-1 text-sm text-walnut">
                  {r.date} · {r.time} · {r.guests} guests · {r.occasion}
                </p>
                <p className="mt-0.5 text-xs text-walnut/80">
                  <a href={`tel:${r.phone}`} className="font-semibold text-terracotta">{r.phone}</a>
                  {r.seating !== "No preference" ? ` · ${r.seating}` : ""}
                </p>
                {r.specialRequest && (
                  <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-cream px-3 py-2 text-xs text-walnut">
                    <Flag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" /> {r.specialRequest}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {r.status === "new" && (
                  <>
                    <Btn variant="dark" onClick={() => update(r.id, { status: "confirmed" })}><Check className="h-3.5 w-3.5" /> Confirm</Btn>
                    <Btn variant="danger" onClick={() => update(r.id, { status: "cancelled" })}><X className="h-3.5 w-3.5" /> Cancel</Btn>
                  </>
                )}
                {(r.status === "confirmed" || r.status === "new") && (
                  <Btn variant="outline" onClick={() => update(r.id, { status: "completed" })}>Complete</Btn>
                )}
                <Btn variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Btn>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <p className="rounded-2xl bg-soft p-8 text-center text-sm text-walnut">No reservations here.</p>}
      </div>
    </div>
  );
}
