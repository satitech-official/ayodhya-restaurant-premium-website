export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return "";
  // Indian locale formatting, e.g. 1,230
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: n % 1 === 0 ? 0 : 2 })}`;
}

export function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function toMinutes(hhmm) {
  if (!hhmm || typeof hhmm !== "string") return null;
  const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function formatMinutes(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return m > 0 ? `${hh}:${String(m).padStart(2, "0")} ${ampm}` : `${hh} ${ampm}`;
}

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/**
 * Compute open/closed state using the restaurant's timezone (Asia/Kolkata)
 * against admin-managed weekly hours. Returns { isOpen, label, detail }.
 */
export function computeOpenStatus(hours) {
  const schedule = hours && typeof hours === "object" ? hours : {};
  let dayKey = "monday";
  let nowMin = 12 * 60;

  try {
    const parts = {};
    for (const p of new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date())) {
      parts[p.type] = p.value;
    }
    dayKey = (parts.weekday || "monday").toLowerCase();
    const hour = parseInt(parts.hour || "12", 10);
    const minute = parseInt(parts.minute || "0", 10);
    if (!Number.isNaN(hour) && !Number.isNaN(minute)) nowMin = hour * 60 + minute;
  } catch {
    // fall back to default schedule if Intl fails
  }

  const dayIndex = Math.max(0, DAY_KEYS.indexOf(dayKey));
  const normalize = (entry) => {
    if (!entry || entry.closed) return null;
    const open = toMinutes(entry.open);
    const close = toMinutes(entry.close);
    if (open == null || close == null) return null;
    return { open, close };
  };

  for (let i = 0; i < 7; i += 1) {
    const d = DAY_KEYS[(dayIndex + i) % 7];
    const h = normalize(schedule[d]);
    if (!h) continue;
    if (i === 0) {
      if (nowMin >= h.open && nowMin < h.close) {
        return {
          isOpen: true,
          label: "Open Now",
          detail: `Closes at ${formatMinutes(h.close)}`,
        };
      }
      if (nowMin < h.open) {
        return {
          isOpen: false,
          label: "Closed",
          detail: `Opens at ${formatMinutes(h.open)}`,
        };
      }
    } else {
      const dayLabel = i === 1 ? "tomorrow" : cap(d);
      return {
        isOpen: false,
        label: "Closed",
        detail: `Opens ${dayLabel} at ${formatMinutes(h.open)}`,
      };
    }
  }

  return { isOpen: false, label: "Closed", detail: "Closed today" };
}

/** Derive playful "craving" tags from a menu item without extra DB columns. */
export function getCravings(item) {
  const s =
    `${item?.name || ""} ${item?.description || ""} ${item?.category || ""} ${item?.cuisine || ""}`
      .toLowerCase();
  const tags = [];
  if (
    /crisp|dosa|spring roll|samosa|manchur|fry|fried|tikka|kebab|roast|noodle|chilli|toast|grilled/.test(
      s,
    )
  ) tags.push("crispy");
  if (
    /cheese|cheesy|burst|cream|malai|shahi|alfredo|white sauce|makhani|kofta|butter|shake/.test(
      s,
    )
  ) tags.push("creamy");
  if (/cheese|cheesy|burst/.test(s)) tags.push("cheesy");
  if (
    (item?.spicyLevel || 0) >= 3 ||
    /spicy|chilli|schezwan|kolhapuri|ak-47|hot|tandoori|manchur|pepper/.test(s)
  ) tags.push("spicy");
  if (
    /mojito|lime|lassi|chaas|cold coffee|juice|soda|shake|refresh|mint|lemon/.test(s)
  ) tags.push("refreshing");
  if (
    /dal|rajwadi|maharani|chaat|pav bhaji|north|pulao|biryani|thali|roti|naan|samosa|pani puri|gulab|masala|jeera/.test(
      s,
    )
  ) tags.push("desi");
  if (/soup|salad|idli|chaas|lime|plain|steam|rice|roti|curd|tea|coffee/.test(s))
    tags.push("light");
  return tags;
}
