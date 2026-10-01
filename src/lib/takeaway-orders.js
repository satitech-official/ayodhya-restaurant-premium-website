import crypto from "node:crypto";
import { pool } from "@/db";

export function normalizePhone(value = "") {
  return String(value).replace(/\D/g, "").slice(-15);
}

export function createOrderCode() {
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const token = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `AYD-${day}-${token}`;
}

export async function ensureTakeawayOrdersTable() {
  if (!pool) return false;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS takeaway_orders (
      id SERIAL PRIMARY KEY,
      order_code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      phone_normalized TEXT NOT NULL,
      pickup_time TEXT NOT NULL,
      note TEXT DEFAULT '',
      items_json JSONB NOT NULL DEFAULT '[]'::jsonb,
      subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'submitted',
      ready_time TEXT DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS takeaway_orders_phone_idx ON takeaway_orders(phone_normalized)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS takeaway_orders_created_idx ON takeaway_orders(created_at DESC)`);
  return true;
}

export function mapTakeawayOrder(row) {
  if (!row) return null;
  return {
    id: row.id,
    orderCode: row.order_code,
    name: row.name,
    phone: row.phone,
    pickupTime: row.pickup_time,
    note: row.note || "",
    items: Array.isArray(row.items_json) ? row.items_json : [],
    subtotal: Number(row.subtotal || 0),
    status: row.status || "submitted",
    readyTime: row.ready_time || "",
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    persisted: true,
  };
}
