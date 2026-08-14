"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Loader2, AlertCircle } from "lucide-react";
import { StatCard, Card, PageHead } from "@/components/admin/AdminKit";

const STAT_LINKS = [
  ["menuItemCount", "Menu Items", "/admin/menu"],
  ["reservationsToday", "Reservations Today", "/admin/reservations"],
  ["activeOffers", "Active Offers", "/admin/offers"],
  ["galleryImages", "Gallery Images", "/admin/gallery"],
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([fetch("/api/dashboard"), fetch("/api/reservations")])
      .then(async ([statsRes, reservationsRes]) => {
        const statsData = await statsRes.json().catch(() => ({}));
        const reservationsData = await reservationsRes.json().catch(() => ({}));
        if (!statsRes.ok) throw new Error(statsData.error || "Could not load dashboard data.");
        if (!reservationsRes.ok) throw new Error(reservationsData.error || "Could not load reservations.");
        if (!active) return;
        setStats(statsData.stats || {});
        setRecent((reservationsData.reservations || []).slice(0, 5));
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Could not load the admin dashboard.");
        setStats({});
      });
    return () => { active = false; };
  }, []);

  if (!stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-terracotta" />
      </div>
    );
  }

  return (
    <div>
      <PageHead title="Dashboard" subtitle="A quick look at your restaurant today." />

      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-terracotta/20 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_LINKS.map(([key, label, href]) => (
          <Link key={key} href={href} className="group">
            <StatCard
              label={label}
              value={stats[key] ?? "—"}
              accent={key === "reservationsToday" ? "text-terracotta" : "text-charcoal"}
            />
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Available Dishes" value={stats.availableDishes ?? "—"} />
        <StatCard label="Sold Out" value={stats.unavailableDishes ?? "—"} accent="text-terracotta" />
        <StatCard label="Upcoming Reservations" value={stats.upcomingReservations ?? "—"} />
        <StatCard label="Unread Messages" value={stats.messages ?? "—"} accent="text-terracotta" />
      </div>

      <Card className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-charcoal">Recent Reservations</h2>
          <Link href="/admin/reservations" className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-terracotta">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-walnut">No reservations yet today.</p>
        ) : (
          <ul className="mt-4 divide-y divide-sand">
            {recent.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-espresso text-soft">
                    <CalendarDays className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-charcoal">{r.name}</p>
                    <p className="text-xs text-walnut">
                      {r.date} · {r.time} · {r.guests} guests
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-brass/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brass">
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
