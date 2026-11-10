import crypto from "node:crypto";
import { pool } from "@/db";
import { getMenuItems } from "@/lib/data";

// Isolated dine-in pilot. No existing site menu, takeaway, booking or schema is modified.
export function pilotEnabled() {
  return process.env.QR_PILOT_ENABLED === "true";
}
export function tableCount() {
  const n = Number(process.env.QR_TABLE_COUNT || 12);
  return Number.isInteger(n) && n >= 1 && n <= 50 ? n : 12;
}
export function validTable(code) {
  const match = /^T(\d{2})$/.exec(String(code || ""));
  return Boolean(match && Number(match[1]) >= 1 && Number(match[1]) <= tableCount());
}
export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
export function priceOptions(item) {
  return String(item?.price || "").split("/").map((part) =>
    Number(String(part).replace(/[^\d.]/g, ""))
  ).filter((n) => Number.isFinite(n) && n > 0 && Number.isInteger(n * 100));
}
export function publicOrder(row) {
  return {
    code: row.order_code, table: row.table_code,
    items: row.items_json, subtotal: Number(row.subtotal),
    status: row.status, paymentStatus: row.payment_status,
    createdAt: row.created_at, updatedAt: row.updated_at,
    trackingToken: row.tracking_token,
  };
}
let ensured;
export async function ensureQrTables() {
  if (!pool) throw new Error("DATABASE_URL must be configured for QR orders.");
  if (!ensured) {
    ensured = (async () => {
      await pool.query([
        "CREATE TABLE IF NOT EXISTS qr_dinein_orders (",
        "id BIGSERIAL PRIMARY KEY,",
        "order_code TEXT NOT NULL UNIQUE,",
        "tracking_token TEXT NOT NULL UNIQUE,",
        "client_request_id UUID NOT NULL UNIQUE,",
        "table_code TEXT NOT NULL,",
        "items_json JSONB NOT NULL,",
        "subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal > 0),",
        "notes TEXT NOT NULL DEFAULT '',",
        "status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','accepted','preparing','ready','served','completed','cancelled')),",
        "payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid')),",
        "created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),",
        "updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()",
        ")"
      ].join(" "));
      await pool.query("CREATE INDEX IF NOT EXISTS qr_dinein_orders_time_idx ON qr_dinein_orders(created_at DESC)");
      await pool.query([
        "CREATE TABLE IF NOT EXISTS qr_dinein_requests (",
        "id BIGSERIAL PRIMARY KEY, table_code TEXT NOT NULL,",
        "kind TEXT NOT NULL CHECK (kind IN ('water','waiter','bill')),",
        "resolved BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()",
        ")"
      ].join(" "));
    })().catch((error) => { ensured = null; throw error; });
  }
  await ensured;
}
export async function prepareLines(input) {
  if (!Array.isArray(input) || input.length < 1 || input.length > 30) {
    throw new Error("Select between 1 and 30 dishes.");
  }
  const menu = await getMenuItems();
  const byId = new Map(menu.map((item) => [String(item.id), item]));
  const seen = new Set();
  const lines = [];
  let totalPaise = 0;
  for (const entry of input) {
    const dish = byId.get(String(entry?.id));
    if (!dish || dish.available === false) throw new Error("An item is unavailable or not on the official menu.");
    const quantity = Number(entry.qty);
    const optionIndex = Number(entry.optionIndex || 0);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) throw new Error("Quantity must be from 1 to 20.");
    const prices = priceOptions(dish);
    if (!Number.isInteger(optionIndex) || !prices[optionIndex]) throw new Error("Select a valid menu price option.");
    const key = String(dish.id) + ":" + optionIndex;
    if (seen.has(key)) throw new Error("Duplicate dish selection. Combine its quantity.");
    seen.add(key);
    const paise = Math.round(prices[optionIndex] * 100);
    totalPaise += paise * quantity;
    if (totalPaise > 3000000) throw new Error("Order exceeds pilot limit.");
    lines.push({
      id: dish.id, name: dish.name, optionIndex,
      option: prices.length > 1 ? "Option " + (optionIndex + 1) : "",
      quantity, unitPrice: prices[optionIndex],
      lineTotal: Number((paise * quantity / 100).toFixed(2))
    });
  }
  return { items: lines, subtotal: Number((totalPaise / 100).toFixed(2)) };
}
export function createOrderIdentifiers() {
  return {
    code: "AYQ-" + crypto.randomBytes(4).toString("hex").toUpperCase(),
    token: crypto.randomBytes(32).toString("hex"),
  };
}
