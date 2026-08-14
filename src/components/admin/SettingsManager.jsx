"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, PageHead, Btn, inputCls, labelCls } from "@/components/admin/AdminKit";

const DAYS = [
  ["monday", "Monday"],
  ["tuesday", "Tuesday"],
  ["wednesday", "Wednesday"],
  ["thursday", "Thursday"],
  ["friday", "Friday"],
  ["saturday", "Saturday"],
  ["sunday", "Sunday"],
];

export default function SettingsManager() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/settings")
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error || "Could not load settings.");
        if (active) setSettings(data.settings || {});
      })
      .catch((err) => {
        if (!active) return;
        setSettings({ hours: {} });
        setError(err.message || "Could not load settings.");
      });
    return () => { active = false; };
  }, []);

  if (!settings) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-terracotta" /></div>;
  }

  const set = (k, v) => setSettings((s) => ({ ...s, [k]: v }));
  const setHour = (day, field, v) =>
    setSettings((s) => ({
      ...s,
      hours: { ...s.hours, [day]: { ...s.hours[day], [field]: v } },
    }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save settings.");
      if (data.settings) setSettings(data.settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHead
        title="Business Information"
        subtitle="Update your contact details, links and hours."
        action={
          <Btn variant="primary" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved" : "Save Changes"}
          </Btn>
        }
      />

      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-terracotta/20 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card>
        <h2 className="mb-4 font-display text-xl font-semibold text-charcoal">Contact & Social</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Phone</label>
            <input value={settings.phone || ""} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input value={settings.email || ""} onChange={(e) => set("email", e.target.value)} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Address</label>
            <input value={settings.address || ""} onChange={(e) => set("address", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Instagram URL</label>
            <input value={settings.instagram || ""} onChange={(e) => set("instagram", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Facebook URL</label>
            <input value={settings.facebook || ""} onChange={(e) => set("facebook", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Zomato Link</label>
            <input value={settings.zomato || ""} onChange={(e) => set("zomato", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Swiggy Link</label>
            <input value={settings.swiggy || ""} onChange={(e) => set("swiggy", e.target.value)} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Site Announcement (shown as a banner)</label>
            <input value={settings.announcement || ""} onChange={(e) => set("announcement", e.target.value)} className={inputCls} placeholder="e.g. Now open — festive combos available" />
          </div>
        </div>
      </Card>

      <Card className="mt-5">
        <h2 className="mb-4 font-display text-xl font-semibold text-charcoal">Opening Hours</h2>
        <div className="space-y-3">
          {DAYS.map(([key, label]) => {
            const day = settings.hours?.[key] || { open: "11:00", close: "23:00", closed: false };
            return (
              <div key={key} className="flex flex-wrap items-center gap-3">
                <span className="w-24 text-sm font-semibold capitalize text-charcoal">{label}</span>
                <label className="flex items-center gap-1.5 text-xs text-walnut">
                  <input type="checkbox" checked={Boolean(day.closed)} onChange={(e) => setHour(key, "closed", e.target.checked)} className="h-4 w-4 accent-[#b84f2f]" />
                  Closed
                </label>
                {!day.closed && (
                  <>
                    <input type="time" value={day.open} onChange={(e) => setHour(key, "open", e.target.value)} className={inputCls + " !w-32"} />
                    <span className="text-walnut">to</span>
                    <input type="time" value={day.close} onChange={(e) => setHour(key, "close", e.target.value)} className={inputCls + " !w-32"} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
