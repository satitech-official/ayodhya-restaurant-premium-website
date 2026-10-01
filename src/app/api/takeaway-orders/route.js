import { pool } from "@/db";
import { FALLBACK_MENU_ITEMS } from "@/lib/fallback-data";
import {
  createOrderCode,
  ensureTakeawayOrdersTable,
  mapTakeawayOrder,
  normalizePhone,
} from "@/lib/takeaway-orders";

export const dynamic = "force-dynamic";

function priceOptions(item) {
  return String(item?.price || "")
    .split("/")
    .map((part) => Number(String(part).replace(/[^\d.]/g, "")))
    .filter((value) => Number.isFinite(value) && value > 0);
}

function normaliseItems(input) {
  if (!Array.isArray(input)) return [];
  const menuById = new Map(FALLBACK_MENU_ITEMS.map((item) => [String(item.id), item]));
  const menuByName = new Map(FALLBACK_MENU_ITEMS.map((item) => [String(item.name).toLowerCase(), item]));

  return input.slice(0, 40).flatMap((entry) => {
    const source =
      menuById.get(String(entry?.id || "")) ||
      menuByName.get(String(entry?.name || "").toLowerCase());
    if (!source) return [];

    const qty = Math.max(1, Math.min(20, Number(entry?.qty) || 1));
    const allowed = priceOptions(source);
    const requested = Number(entry?.price);
    const price = allowed.includes(requested) ? requested : allowed[0];
    if (!price) return [];

    return [{
      id: source.id,
      name: source.name,
      variant: String(entry?.variant || "").slice(0, 40),
      price,
      qty,
      lineTotal: price * qty,
    }];
  });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid order data." }, { status: 400 });
  }

  const name = String(body?.name || "").trim().slice(0, 100);
  const phone = String(body?.phone || "").trim().slice(0, 30);
  const phoneNormalized = normalizePhone(phone);
  const pickupTime = String(body?.pickupTime || "ASAP — restaurant to confirm").trim().slice(0, 100);
  const note = String(body?.note || "").trim().slice(0, 500);
  const items = normaliseItems(body?.items);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  if (name.length < 2) return Response.json({ error: "Please enter your name." }, { status: 400 });
  if (phoneNormalized.length < 10) return Response.json({ error: "Please enter a valid phone number." }, { status: 400 });
  if (!items.length) return Response.json({ error: "Please add at least one dish." }, { status: 400 });

  const fallbackOrder = {
    orderCode: createOrderCode(),
    name,
    phone,
    pickupTime,
    note,
    items,
    subtotal,
    status: "submitted",
    readyTime: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    persisted: false,
  };

  if (!pool) {
    return Response.json({ order: fallbackOrder, trackingAvailable: false }, { status: 201 });
  }

  try {
    await ensureTakeawayOrdersTable();
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const orderCode = createOrderCode();
      try {
        const result = await pool.query(
          `INSERT INTO takeaway_orders
            (order_code, name, phone, phone_normalized, pickup_time, note, items_json, subtotal, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,'submitted')
           RETURNING *`,
          [orderCode, name, phone, phoneNormalized, pickupTime, note, JSON.stringify(items), subtotal],
        );
        return Response.json({ order: mapTakeawayOrder(result.rows[0]), trackingAvailable: true }, { status: 201 });
      } catch (error) {
        if (error?.code !== "23505" || attempt === 2) throw error;
      }
    }
  } catch (error) {
    console.error("[Ayodhya] takeaway order save failed", error);
  }

  return Response.json({ order: fallbackOrder, trackingAvailable: false }, { status: 201 });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = String(searchParams.get("code") || "").trim().toUpperCase();
  const phoneNormalized = normalizePhone(searchParams.get("phone") || "");

  if (!code || phoneNormalized.length < 10) {
    return Response.json({ error: "Order code and phone number are required." }, { status: 400 });
  }
  if (!pool) return Response.json({ order: null, trackingAvailable: false });

  try {
    await ensureTakeawayOrdersTable();
    const result = await pool.query(
      `SELECT * FROM takeaway_orders WHERE order_code = $1 AND phone_normalized = $2 LIMIT 1`,
      [code, phoneNormalized],
    );
    return Response.json({
      order: result.rows[0] ? mapTakeawayOrder(result.rows[0]) : null,
      trackingAvailable: true,
    });
  } catch {
    return Response.json({ order: null, trackingAvailable: false });
  }
}
