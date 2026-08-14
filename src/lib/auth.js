import crypto from "node:crypto";

export const AUTH_COOKIE = "ayodhya_admin";
const SECRET = process.env.AUTH_SECRET || "ayodhya-restaurant-demo-secret-change-me";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  if (!stored || typeof stored !== "string") return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(String(password), salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(test, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function sign(value) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("base64url");
}

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

export function createToken(email) {
  const expires = Date.now() + TTL_MS;
  const payload = `${email}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token) {
  if (!token) return null;
  const parts = String(token).split(".");
  if (parts.length !== 3) return null;
  const [email, exp, sig] = parts;
  const payload = `${email}.${exp}`;
  if (!safeEqual(sig, sign(payload))) return null;
  if (!exp || Number.isNaN(Number(exp)) || Date.now() > Number(exp)) return null;
  return { email };
}

export function serializeAuthCookie(token, maxAge) {
  const parts = [
    `${AUTH_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge || Math.floor(TTL_MS / 1000)}`,
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

export function readCookie(cookieHeader, name) {
  if (!cookieHeader) return "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  if (!match) return "";
  return decodeURIComponent(match.slice(name.length + 1));
}

/** Returns { email } when the incoming request carries a valid admin session. */
export function requireAdmin(request) {
  const cookie = request.headers.get("cookie") || "";
  const token = readCookie(cookie, AUTH_COOKIE);
  return verifyToken(token);
}
