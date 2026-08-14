import { db } from "@/db";
import { businessSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/lib/constants";

export const dynamic = "force-dynamic";
const PUBLIC_KEYS = new Set(["announcement", "phone", "email", "address", "instagram", "facebook", "zomato", "swiggy", "hours"]);

async function loadSettings() {
  if (!db) return { ...DEFAULT_SETTINGS };
  try {
    const rows = await db.select().from(businessSettings);
    const map = { ...DEFAULT_SETTINGS };
    for (const r of rows) {
      let value = r.value;
      if (r.key === "hours") { try { value = JSON.parse(value); } catch { value = DEFAULT_SETTINGS.hours; } }
      map[r.key] = value;
    }
    return map;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function GET() {
  const settings = await loadSettings();
  const publicSettings = {};
  for (const [k, v] of Object.entries(settings)) if (PUBLIC_KEYS.has(k)) publicSettings[k] = v;
  return Response.json({ settings: publicSettings, mode: db ? "database" : "fallback" });
}

export async function PUT(request) {
  if (!db) return Response.json({ error: "Database is not configured. Add DATABASE_URL before saving settings." }, { status: 503 });
  const admin = requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  const entries = {};
  for (const [k, v] of Object.entries(body || {})) if (PUBLIC_KEYS.has(k)) entries[k] = k === "hours" ? JSON.stringify(v) : String(v ?? "");
  for (const [key, value] of Object.entries(entries)) await db.insert(businessSettings).values({ key, value }).onConflictDoUpdate({ target: businessSettings.key, set: { value } });
  return Response.json({ settings: await loadSettings() });
}
