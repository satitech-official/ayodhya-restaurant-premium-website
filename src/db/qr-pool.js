import { Pool } from "pg";

// Dedicated QR-only database. Never reuse DATABASE_URL, because the original
// Ayodhya website has its own tables and independent admin/takeaway features.
const connectionString = process.env.QR_DATABASE_URL?.trim();
const globalDb = globalThis;
export const qrPool = connectionString
  ? globalDb.__ayodhyaQrPool ??
    new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 25000,
      connectionTimeoutMillis: 8000,
    })
  : null;
if (qrPool && process.env.NODE_ENV !== "production") globalDb.__ayodhyaQrPool = qrPool;
