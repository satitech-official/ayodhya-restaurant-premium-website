import crypto from "node:crypto";

const COOKIE = "ayodhya_qr_staff";
const HOUR = 60 * 60 * 1000;
const TTL = 8 * HOUR;

function sign(payload) {
  const secret = process.env.QR_STAFF_SECRET;
  if (!secret || secret.length < 32) throw new Error("QR_STAFF_SECRET not configured");
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}
function same(a, b) {
  const left = Buffer.from(String(a || ""));
  const right = Buffer.from(String(b || ""));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
export function checkStaffPassword(password) {
  const expected = process.env.QR_STAFF_PASSWORD;
  if (!expected || expected.length < 16 || !password || String(password).length > 256) return false;
  const a = crypto.createHash("sha256").update(String(password)).digest("hex");
  const b = crypto.createHash("sha256").update(expected).digest("hex");
  return same(a, b);
}
export function makeQrStaffToken() {
  const payload = (Date.now() + TTL).toString(36) + "." + crypto.randomBytes(16).toString("hex");
  return payload + "." + sign(payload);
}
export function verifyQrStaffToken(value) {
  try {
    if (!value || typeof value !== "string" || value.length > 300) return false;
    const parts = value.split(".");
    if (parts.length !== 3) return false;
    const [expiry, nonce, sig] = parts;
    if (!/^[0-9a-z]+$/.test(expiry) || !/^[a-f0-9]{32}$/.test(nonce)) return false;
    const expires = parseInt(expiry, 36);
    if (!Number.isFinite(expires) || Date.now() > expires || expires > Date.now() + TTL) return false;
    return same(sign(expiry + "." + nonce), sig);
  } catch { return false; }
}
export function hasQrStaffSession(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)ayodhya_qr_staff=([^;]+)/);
  return verifyQrStaffToken(match ? decodeURIComponent(match[1]) : "");
}
export function staffCookie(token) {
  const prod = process.env.NODE_ENV === "production";
  return COOKIE + "=" + encodeURIComponent(token) + "; Path=/; HttpOnly; SameSite=Lax; Max-Age=" + String(Math.floor(TTL / 1000)) + (prod ? "; Secure" : "");
}
export function clearStaffCookie() {
  return COOKIE + "=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0" + (process.env.NODE_ENV === "production" ? "; Secure" : "");
}
