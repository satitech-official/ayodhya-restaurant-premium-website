"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VegDot, Spicy } from "@/components/primitives";
import { MENU_CATEGORIES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

const CAT_EMOJI = Object.fromEntries(MENU_CATEGORIES.map((c) => [c.slug, c.icon]));
const USED_PHOTOS = new Set();
const PHOTO_RESULT_CACHE = new Map();
const ITEM_PHOTO_CACHE = new Map();

const CATEGORY_SEARCH = {
  beverages: "Indian beverage drink",
  "signature-starters": "Indian vegetarian starter",
  chinese: "Indo Chinese vegetarian food",
  "street-food": "Indian street food vegetarian",
  pasta: "vegetarian pasta",
  soups: "vegetarian soup",
  tandoor: "Indian tandoori vegetarian food",
  pizza: "vegetarian pizza",
  raita: "Indian raita",
  "north-indian": "North Indian vegetarian curry",
  "signature-main": "Indian paneer curry restaurant",
  "papad-salad": "Indian salad papad",
  "paneer-specials": "Indian paneer curry",
  dal: "Indian dal lentil curry",
  "rice-biryani": "Indian vegetarian rice biryani",
  desserts: "Indian dessert sweet",
  breads: "Indian naan roti paratha",
  "dosa-specials": "South Indian dosa",
  "south-indian": "South Indian idli uttapam",
};

function hashValue(value = "") {
  let hash = 2166136261;
  for (const ch of String(value)) {
    hash ^= ch.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function cleanDishName(value = "") {
  return String(value)
    .replace(/\([^)]*\)/g, " ")
    .replace(/\bhalf\b|\bfull\b|\bpcs?\b/gi, " ")
    .replace(/[^a-zA-Z0-9\s&-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function searchPhrase(item) {
  const name = cleanDishName(item?.name);
  const n = name.toLowerCase();

  const rules = [
    [/paneer butter masala/, "paneer butter masala Indian food"],
    [/palak paneer|lasooni palak paneer/, "palak paneer Indian food"],
    [/kadai paneer/, "kadai paneer Indian food"],
    [/shahi paneer/, "shahi paneer Indian food"],
    [/matar paneer/, "matar paneer Indian food"],
    [/paneer tikka/, "paneer tikka Indian food"],
    [/paneer/, `${name} paneer Indian food`],
    [/dosa/, `${name} dosa South Indian food`],
    [/idli/, `${name} idli South Indian food`],
    [/uttapam/, `${name} uttapam South Indian food`],
    [/biryani/, `${name} vegetarian biryani`],
    [/pulao|rice|khichdi/, `${name} Indian rice dish`],
    [/dal/, `${name} Indian dal`],
    [/naan|roti|paratha|kulcha/, `${name} Indian bread`],
    [/pizza/, `${name} vegetarian pizza`],
    [/pasta/, `${name} vegetarian pasta`],
    [/soup/, `${name} vegetarian soup`],
    [/sandwich/, `${name} vegetarian sandwich`],
    [/fries|potato/, `${name} food`],
    [/coffee/, `${name} coffee drink`],
    [/shake/, `${name} milkshake`],
    [/mojito|lagoon|soda|lassi|butter milk|buttermilk/, `${name} drink`],
    [/kebab|tikka|chaap|tandoor/, `${name} Indian vegetarian starter`],
    [/manchurian|noodles|chowmein|schezwan|chilli/, `${name} Indo Chinese vegetarian food`],
    [/pav bhaji/, `${name} Indian street food`],
    [/pakode|pakora/, `${name} Indian snack`],
    [/kofta/, `${name} Indian kofta curry`],
    [/mushroom/, `${name} mushroom Indian food`],
    [/salad/, `${name} salad`],
    [/raita/, `${name} Indian raita`],
    [/gulab jamun|rasgulla/, `${name} Indian dessert`],
    [/ice cream/, `${name} ice cream`],
  ];

  const matched = rules.find(([rx]) => rx.test(n));
  return matched ? matched[1] : `${name} ${CATEGORY_SEARCH[item?.category] || "Indian vegetarian food"}`;
}

async function commonsSearch(query, limit = 36) {
  const key = `${query}|${limit}`;
  if (PHOTO_RESULT_CACHE.has(key)) return PHOTO_RESULT_CACHE.get(key);

  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: String(limit),
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "900",
    format: "json",
    origin: "*",
  });

  const promise = fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`)
    .then((res) => {
      if (!res.ok) throw new Error("Commons image search failed");
      return res.json();
    })
    .then((data) =>
      Object.values(data?.query?.pages || {})
        .sort((a, b) => (a.index || 0) - (b.index || 0))
        .map((page) => page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url)
        .filter((url) => /^https:\/\//i.test(url || "")),
    )
    .catch(() => []);

  PHOTO_RESULT_CACHE.set(key, promise);
  return promise;
}

function chooseUnique(urls, seed) {
  if (!urls?.length) return "";
  const start = seed % urls.length;

  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[(start + i) % urls.length];
    if (!USED_PHOTOS.has(url)) {
      USED_PHOTOS.add(url);
      return url;
    }
  }

  return "";
}

async function resolveDishPhoto(item) {
  const cacheKey = `${item?.id || ""}|${item?.name || ""}|${item?.category || ""}`;
  if (ITEM_PHOTO_CACHE.has(cacheKey)) return ITEM_PHOTO_CACHE.get(cacheKey);

  const task = (async () => {
    const seed = hashValue(cacheKey);

    const exact = await commonsSearch(searchPhrase(item), 24);
    let picked = chooseUnique(exact, seed);
    if (picked) return picked;

    const category = await commonsSearch(CATEGORY_SEARCH[item?.category] || "Indian vegetarian food", 64);
    picked = chooseUnique(category, seed + 17);
    if (picked) return picked;

    const general = await commonsSearch("Indian vegetarian restaurant food", 100);
    picked = chooseUnique(general, seed + 37);
    if (picked) return picked;

    return item?.image || "";
  })();

  ITEM_PHOTO_CACHE.set(cacheKey, task);
  return task;
}

function DishPhoto({ item, emoji }) {
  const holderRef = useRef(null);
  const [src, setSrc] = useState("");
  const [failed, setFailed] = useState(false);
  const itemKey = useMemo(
    () => `${item?.id || ""}|${item?.name || ""}|${item?.category || ""}`,
    [item?.id, item?.name, item?.category],
  );

  useEffect(() => {
    const node = holderRef.current;
    if (!node) return undefined;

    let cancelled = false;
    let observer;

    const load = async () => {
      const resolved = await resolveDishPhoto(item);
      if (!cancelled) setSrc(resolved);
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            load();
          }
        },
        { rootMargin: "500px 0px" },
      );
      observer.observe(node);
    } else {
      load();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [itemKey]);

  return (
    <div ref={holderRef} className="h-full w-full">
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={item.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="pattern-jaali-light flex h-full w-full items-center justify-center bg-espresso text-4xl">
          <span aria-hidden="true">{emoji}</span>
        </div>
      )}
    </div>
  );
}

export default function DishCard({ item }) {
  const emoji = CAT_EMOJI[item.category] || "🍽️";
  const soldOut = item.available === false;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-soft ring-1 ring-sand/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative h-40 overflow-hidden bg-espresso">
        <DishPhoto item={item} emoji={emoji} />

        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/70">
            <span className="rounded-full bg-terracotta px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-soft">
              Sold Out
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <VegDot className="h-4 w-4 border-[1.5px] [&>span]:h-1.5 [&>span]:w-1.5" />
        </div>
        {item.bestseller && (
          <span className="absolute right-3 top-3 rounded-full bg-burnt px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-soft">
            Bestseller
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight text-charcoal">
            {item.name}
          </h3>
          <span className="shrink-0 font-display text-lg font-semibold text-terracotta">
            {formatPrice(item.price)}
          </span>
        </div>
        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-walnut/85">
            {item.description}
          </p>
        )}
        <div className="mt-auto flex items-center gap-3 pt-3">
          <Spicy level={item.spicyLevel} />
          {item.recommended && (
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brass">
              ★ Recommended
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
