"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VegDot, Spicy } from "@/components/primitives";
import { MENU_CATEGORIES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

const CAT_EMOJI = Object.fromEntries(MENU_CATEGORIES.map((c) => [c.slug, c.icon]));
const USED_MEDIA_IDS = new Set();
const ITEM_PHOTO_CACHE = new Map();
const SEARCH_CACHE = new Map();
let searchChain = Promise.resolve();

const CATEGORY_QUERY = {
  beverages: "Indian beverage drink restaurant",
  "signature-starters": "Indian vegetarian starter restaurant food",
  chinese: "Indo Chinese vegetarian restaurant food",
  "street-food": "Indian street food vegetarian",
  pasta: "vegetarian pasta restaurant",
  soups: "vegetarian soup restaurant",
  tandoor: "Indian tandoori vegetarian starter",
  pizza: "vegetarian pizza restaurant",
  raita: "Indian raita food",
  "north-indian": "North Indian vegetarian curry restaurant",
  "signature-main": "Indian paneer curry restaurant",
  "papad-salad": "Indian salad papad food",
  "paneer-specials": "Indian paneer curry restaurant",
  dal: "Indian dal lentil curry",
  "rice-biryani": "Indian vegetarian rice biryani",
  desserts: "Indian dessert sweet",
  breads: "Indian naan roti paratha",
  "dosa-specials": "South Indian dosa restaurant",
  "south-indian": "South Indian idli uttapam restaurant",
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

function canonicalDishQuery(item) {
  const name = cleanDishName(item?.name);
  const n = name.toLowerCase();

  const aliases = [
    [/paneer hyderabadi/, "Hyderabadi paneer curry"],
    [/soya tikka masala/, "soya chaap tikka masala"],
    [/bhuna soya chaap/, "bhuna soya chaap curry"],
    [/firangi soya chaap/, "soya chaap curry"],
    [/lasooni palak paneer/, "lasooni palak paneer"],
    [/paneer maharani/, "paneer maharani curry"],
    [/paneer hungama/, "paneer hungama curry"],
    [/paneer tufani|paneer toofani/, "paneer toofani curry"],
    [/paneer angara/, "paneer angara curry"],
    [/afghani paneer/, "afghani paneer white gravy"],
    [/paneer long lata/, "paneer curry Indian restaurant"],
    [/paneer rajwari/, "paneer rajwadi curry"],
    [/paneer lababdar/, "paneer lababdar"],
    [/paneer kolhapuri/, "paneer kolhapuri"],
    [/paneer pasanda/, "paneer pasanda"],
    [/paneer amritsari/, "amritsari paneer curry"],
    [/paneer patiyala|paneer patiala/, "paneer patiala curry"],
    [/paneer kaju masala/, "kaju paneer masala"],
    [/paneer bhuna masala/, "bhuna paneer masala"],
    [/paneer do pyaza/, "paneer do pyaza"],
    [/matar paneer/, "matar paneer"],
    [/palak stuffed paneer/, "stuffed paneer spinach"],
    [/amritsari paneer bhurji/, "paneer bhurji"],
    [/paneer butter masala/, "paneer butter masala"],
    [/paneer tikka masala/, "paneer tikka masala"],
    [/kadai paneer/, "kadai paneer"],
    [/shahi paneer/, "shahi paneer"],
    [/palak paneer/, "palak paneer"],
    [/paneer 65/, "paneer 65"],
    [/paneer chilli|chilli paneer/, "chilli paneer"],
    [/paneer finger/, "paneer fingers starter"],
    [/paneer sizzler/, "paneer sizzler"],
    [/paneer corn seekh kebab/, "paneer corn seekh kebab"],
    [/mushroom spanish fried rice/, "mushroom fried rice"],
    [/pan fried noodles/, "pan fried noodles"],
    [/veg coin in hot garlic sauce/, "vegetable balls hot garlic sauce"],
    [/hara bhara kebab/, "hara bhara kebab"],
    [/cheese corn kebab/, "corn cheese kebab"],
    [/crispy corn/, "crispy corn salt pepper"],
    [/veg manchurian/, "veg manchurian"],
    [/veg kothe/, "veg kothe"],
    [/veg lollipop/, "vegetable lollipop"],
    [/honey chilli potato/, "honey chilli potato"],
    [/chilli potato/, "chilli potato"],
    [/chana chilli/, "chilli chana"],
    [/corn chaat/, "corn chaat"],
    [/crispy veg/, "crispy vegetables Indo Chinese"],
    [/chinese sizzler platter/, "Chinese vegetarian sizzler platter"],
    [/hakka noodles/, "veg hakka noodles"],
    [/schezwan noodles/, "veg schezwan noodles"],
    [/chowmein/, "veg chow mein"],
    [/chilli garlic noodles/, "chilli garlic noodles"],
    [/fried rice/, `${name} fried rice`],
    [/pav bhaji/, `${name} pav bhaji`],
    [/chole bhature/, "chole bhature"],
    [/pakode|pakora/, `${name} pakora Indian snack`],
    [/sandwich/, `${name} vegetarian sandwich`],
    [/white sauce pasta/, "white sauce pasta"],
    [/red sauce pasta/, "red sauce pasta"],
    [/pink sauce pasta/, "pink sauce pasta"],
    [/manchow soup/, "veg manchow soup"],
    [/lemon coriander soup/, "lemon coriander soup"],
    [/hot and sour soup/, "vegetable hot and sour soup"],
    [/tomato soup/, "tomato soup"],
    [/sweet corn soup/, "sweet corn soup"],
    [/veg seekh kebab/, "vegetable seekh kebab"],
    [/paneer tikka/, `${name} paneer tikka`],
    [/soya.*chaap/, `${name} soya chaap`],
    [/tandoor platter/, "vegetarian tandoori platter"],
    [/pizza/, `${name} vegetarian pizza`],
    [/raita/, `${name} Indian raita`],
    [/dum aloo/, "dum aloo Punjabi"],
    [/aloo gobi matar/, "aloo gobi matar"],
    [/sev tamatar/, "sev tamatar sabzi"],
    [/bhindi masala/, "bhindi masala"],
    [/bhindi kurkuri/, "kurkuri bhindi"],
    [/veg kolhapuri/, "veg kolhapuri curry"],
    [/veg patiala/, "veg patiala curry"],
    [/veg keema rara/, "vegetarian keema curry"],
    [/matar mushroom/, "matar mushroom curry"],
    [/methi matar malai/, "methi matar malai"],
    [/kaju curry/, "cashew curry Indian"],
    [/veg kofta curry/, "vegetable kofta curry"],
    [/paneer kofta/, "paneer kofta curry"],
    [/angoori kofta/, "angoori kofta curry"],
    [/malai kofta/, "malai kofta"],
    [/dal tadka/, "dal tadka"],
    [/dal fry/, "dal fry"],
    [/jeera dal/, "jeera dal"],
    [/dal dhaba/, "dhaba dal"],
    [/dal roast/, "Indian dal curry"],
    [/chilli garlic dal/, "garlic dal tadka"],
    [/steamed rice/, "steamed basmati rice"],
    [/jeera rice/, "jeera rice"],
    [/pulao/, `${name} Indian pulao`],
    [/biryani/, `${name} vegetarian biryani`],
    [/khichdi/, `${name} khichdi`],
    [/rasgulla/, "rasgulla Indian sweet"],
    [/gulab jamun/, "gulab jamun"],
    [/ice cream/, `${name} ice cream`],
    [/naan/, `${name} naan Indian bread`],
    [/roti/, `${name} roti Indian bread`],
    [/paratha/, `${name} paratha Indian bread`],
    [/kulcha/, `${name} kulcha Indian bread`],
    [/dosa/, `${name} South Indian dosa`],
    [/uttapam/, `${name} South Indian uttapam`],
    [/idli/, `${name} South Indian idli`],
    [/cold coffee/, `${name} cold coffee`],
    [/shake/, `${name} milkshake`],
    [/mojito/, `${name} mojito drink`],
    [/lassi/, `${name} lassi Indian drink`],
    [/butter milk|buttermilk/, "Indian buttermilk chaas"],
    [/lime soda|masala soda/, `${name} Indian soda drink`],
    [/blue lagoon/, "blue lagoon mocktail"],
    [/green apple/, "green apple mocktail"],
    [/jamun shot/, "jamun drink shot"],
    [/pan shot/, "paan shot drink"],
    [/salad/, `${name} Indian salad`],
    [/papad/, `${name} Indian papad`],
    [/fries/, `${name} french fries`],
  ];

  const matched = aliases.find(([rx]) => rx.test(n));
  return matched ? matched[1] : `${name} ${CATEGORY_QUERY[item?.category] || "Indian vegetarian restaurant food"}`;
}

function visualFamilyQuery(item) {
  const name = cleanDishName(item?.name);
  const n = name.toLowerCase();

  const specialFamilies = [
    [/paneer hyderabadi/, "paneer hyderabadi green gravy spinach coriander"],
    [/paneer maharani/, "rich creamy paneer curry Indian restaurant"],
    [/paneer hungama/, "rich paneer masala curry Indian restaurant"],
    [/paneer tufani|paneer toofani/, "spicy red paneer curry Indian restaurant"],
    [/paneer angara/, "smoky spicy paneer angara curry"],
    [/paneer long lata/, "premium paneer curry Indian restaurant"],
    [/paneer rajwari|paneer rajwadi/, "rich paneer rajwadi curry"],
    [/afghani paneer/, "creamy white gravy paneer curry"],
    [/lasooni palak paneer/, "garlic palak paneer green curry"],
    [/firangi soya chaap/, "creamy soya chaap Indian restaurant"],
    [/bhuna soya chaap/, "bhuna soya chaap spicy curry"],
    [/soya tikka masala/, "soya tikka masala curry"],
    [/veg keema rara/, "vegetarian soya keema curry"],
    [/paneer kaju masala/, "cashew paneer curry"],
    [/palak stuffed paneer/, "stuffed paneer spinach curry"],
    [/amritsari paneer bhurji/, "paneer bhurji Indian restaurant"],
    [/chinese sizzler platter/, "vegetarian Chinese sizzler platter"],
    [/tandoor platter/, "vegetarian tandoori platter paneer mushroom"],
    [/mushroom spanish fried rice/, "mushroom fried rice restaurant"],
    [/veg coin in hot garlic sauce/, "vegetable balls hot garlic sauce Indo Chinese"],
    [/veg kothe/, "veg kothe Indo Chinese dumplings"],
    [/veg lollipop/, "vegetable lollipop Indo Chinese"],
    [/bahubali dosa/, "giant long South Indian dosa"],
    [/ak 47 dosa/, "giant long South Indian dosa"],
    [/burj khalifa dosa/, "giant tower dosa South Indian"],
    [/maharaja dosa/, "giant stuffed dosa South Indian"],
    [/matka dosa/, "matka dosa South Indian"],
    [/mumbai special dosa/, "Mumbai street style dosa"],
    [/open cheese mysore dosa/, "open cheese Mysore masala dosa"],
    [/sizzler dosa/, "dosa sizzler South Indian"],
    [/chilli paneer dosa/, "chilli paneer dosa fusion"],
    [/american chopsuey dosa/, "fusion dosa South Indian"],
    [/spring roll dosa/, "spring roll dosa South Indian"],
    [/jini paneer dosa/, "Jini dosa paneer cheese"],
    [/jini dosa/, "Jini dosa cheese vegetables"],
    [/pizza dosa/, "pizza dosa South Indian"],
    [/cheese burst dosa/, "cheese dosa South Indian"],
    [/chocolate dosa/, "chocolate dosa dessert"],
    [/mumbai special uttapam/, "vegetable uttapam South Indian"],
  ];

  const special = specialFamilies.find(([rx]) => rx.test(n));
  if (special) return special[1];

  const families = [
    [/paneer/, "premium Indian paneer curry restaurant food"],
    [/soya.*chaap|chaap/, "Indian soya chaap restaurant food"],
    [/dosa/, "South Indian dosa restaurant food"],
    [/idli/, "South Indian idli sambar restaurant food"],
    [/uttapam/, "South Indian uttapam restaurant food"],
    [/biryani/, "vegetarian biryani Indian restaurant food"],
    [/pulao|rice|khichdi/, "Indian rice pulao restaurant food"],
    [/dal/, "Indian dal tadka restaurant food"],
    [/naan|roti|paratha|kulcha/, "Indian bread naan paratha restaurant food"],
    [/pizza/, "vegetarian pizza restaurant food"],
    [/pasta/, "vegetarian pasta restaurant food"],
    [/soup/, "vegetarian soup restaurant food"],
    [/sandwich/, "vegetarian sandwich restaurant food"],
    [/fries|potato/, "crispy potato fries restaurant food"],
    [/coffee/, "premium cold coffee cafe drink"],
    [/shake/, "premium milkshake cafe drink"],
    [/mojito|lagoon|soda|lassi|butter milk|buttermilk|green apple|jamun|pan shot/, "premium cold mocktail beverage"],
    [/kebab|tikka|tandoor/, "Indian vegetarian tandoori starter restaurant food"],
    [/manchurian|noodles|chowmein|schezwan|chilli/, "Indo Chinese vegetarian restaurant food"],
    [/pav bhaji|chole bhature|pakode|pakora|chaat/, "Indian street food restaurant"],
    [/kofta/, "Indian kofta curry restaurant food"],
    [/mushroom/, "Indian mushroom curry restaurant food"],
    [/salad|raita/, "Indian salad raita restaurant food"],
    [/gulab jamun|rasgulla|ice cream/, "Indian dessert restaurant food"],
  ];

  const matched = families.find(([rx]) => rx.test(n));
  return matched ? matched[1] : (CATEGORY_QUERY[item?.category] || "Indian vegetarian restaurant food");
}

function tokenise(value = "") {
  return cleanDishName(value)
    .toLowerCase()
    .split(/\s+/)
    .filter((x) => x.length > 2 && !["with", "and", "the", "veg", "special", "plain", "extra"].includes(x));
}

function resultScore(result, item) {
  const haystack = [
    result?.title || "",
    ...(result?.tags || []).map((tag) => tag?.name || ""),
  ].join(" ").toLowerCase();

  const nameTokens = tokenise(item?.name);
  const queryTokens = tokenise(canonicalDishQuery(item));
  let score = 0;

  for (const token of nameTokens) {
    if (haystack.includes(token)) score += 10;
  }
  for (const token of queryTokens) {
    if (haystack.includes(token)) score += 4;
  }

  if (/food|dish|curry|paneer|dosa|rice|bread|drink|soup|pizza|pasta|dessert|noodle|kebab|chaap|biryani|dal|idli|uttapam/.test(haystack)) {
    score += 3;
  }

  if (/person|people|restaurant interior|building|menu|logo|poster|packaging|storefront|signboard/.test(haystack)) {
    score -= 16;
  }

  const width = Number(result?.width || 0);
  const height = Number(result?.height || 0);
  const longEdge = Math.max(width, height);
  const shortEdge = Math.min(width, height);

  if (longEdge >= 1800 && shortEdge >= 1000) score += 8;
  else if (longEdge >= 1400 && shortEdge >= 800) score += 5;
  else if (longEdge >= 1200 && shortEdge >= 700) score += 2;
  else if (width && height) score -= 8;

  return score;
}

function queueSearch(task) {
  const run = () => new Promise((resolve) => {
    window.setTimeout(() => task().then(resolve).catch(() => resolve([])), 75);
  });
  searchChain = searchChain.then(run, run);
  return searchChain;
}

async function openverseSearch(query, pageSize = 40) {
  const key = `ov:${query}:${pageSize}`;
  if (SEARCH_CACHE.has(key)) return SEARCH_CACHE.get(key);

  const promise = queueSearch(async () => {
    const params = new URLSearchParams({
      q: query,
      page_size: String(pageSize),
      mature: "false",
    });

    const res = await fetch(`https://api.openverse.org/v1/images/?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.results || [])
      .filter((result) => {
        if (result?.watermarked || !(result?.thumbnail || result?.url)) return false;
        const width = Number(result?.width || 0);
        const height = Number(result?.height || 0);
        if (width && height && (Math.max(width, height) < 1200 || Math.min(width, height) < 700)) return false;
        return true;
      })
      .map((result) => ({
        id: result.id || result.url,
        url: result.url || result.thumbnail,
        backupUrl: result.thumbnail || "",
        title: result.title || "",
        tags: result.tags || [],
        width: Number(result.width || 0),
        height: Number(result.height || 0),
      }));
  });

  SEARCH_CACHE.set(key, promise);
  return promise;
}

async function commonsSearch(query, limit = 40) {
  const key = `wc:${query}:${limit}`;
  if (SEARCH_CACHE.has(key)) return SEARCH_CACHE.get(key);

  const promise = queueSearch(async () => {
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: query,
      gsrnamespace: "6",
      gsrlimit: String(limit),
      prop: "imageinfo",
      iiprop: "url|size",
      iiurlwidth: "1600",
      format: "json",
      origin: "*",
    });

    const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();

    return Object.values(data?.query?.pages || {}).map((page) => {
      const info = page?.imageinfo?.[0] || {};
      return {
        id: `commons:${page.pageid}`,
        url: info.thumburl || info.url || "",
        backupUrl: info.url || "",
        title: page?.title || "",
        tags: [],
        width: Number(info.thumbwidth || info.width || 0),
        height: Number(info.thumbheight || info.height || 0),
      };
    }).filter((result) => {
      if (!result.url) return false;
      if (result.width && result.height && (Math.max(result.width, result.height) < 1200 || Math.min(result.width, result.height) < 700)) return false;
      return true;
    });
  });

  SEARCH_CACHE.set(key, promise);
  return promise;
}

function pickUnique(results, item, minScore = 10) {
  const sorted = [...results]
    .map((result) => ({ ...result, _score: resultScore(result, item) }))
    .filter((result) => result._score >= minScore)
    .sort((a, b) => b._score - a._score);

  for (const result of sorted) {
    const key = result.id || result.url;
    const urlKey = String(result.url || "")
      .replace(/([?&])(width|w|height|h)=\d+/gi, "$1")
      .replace(/[?&]+$/g, "");
    if (!key || !urlKey || USED_MEDIA_IDS.has(key) || USED_MEDIA_IDS.has(urlKey)) continue;
    USED_MEDIA_IDS.add(key);
    USED_MEDIA_IDS.add(urlKey);
    return { src: result.url, fallback: result.backupUrl || "" };
  }

  return null;
}

async function resolveDishPhoto(item) {
  const cacheKey = `${item?.id || ""}|${item?.name || ""}|${item?.category || ""}`;
  if (ITEM_PHOTO_CACHE.has(cacheKey)) return ITEM_PHOTO_CACHE.get(cacheKey);

  const task = (async () => {
    const exactQuery = canonicalDishQuery(item);
    const exactOpenverse = await openverseSearch(exactQuery, 40);
    let photo = pickUnique(exactOpenverse, item, 14);
    if (photo) return photo;

    const exactCommons = await commonsSearch(exactQuery, 40);
    photo = pickUnique(exactCommons, item, 14);
    if (photo) return photo;

    const rawName = cleanDishName(item?.name);
    if (rawName && rawName.toLowerCase() !== exactQuery.toLowerCase()) {
      const rawOpenverse = await openverseSearch(rawName, 40);
      photo = pickUnique(rawOpenverse, item, 12);
      if (photo) return photo;
    }

    const familyQuery = visualFamilyQuery(item);
    const familyOpenverse = await openverseSearch(familyQuery, 90);
    photo = pickUnique(familyOpenverse, item, 6);
    if (photo) return photo;

    const familyCommons = await commonsSearch(familyQuery, 90);
    photo = pickUnique(familyCommons, item, 6);
    if (photo) return photo;

    const categoryQuery = CATEGORY_QUERY[item?.category] || "Indian vegetarian restaurant food";
    const categoryOpenverse = await openverseSearch(categoryQuery, 100);
    photo = pickUnique(categoryOpenverse, item, 5);
    if (photo) return photo;

    const categoryCommons = await commonsSearch(categoryQuery, 100);
    photo = pickUnique(categoryCommons, item, 5);
    if (photo) return photo;

    return null;
  })();

  ITEM_PHOTO_CACHE.set(cacheKey, task);
  return task;
}

function DishPhoto({ item, emoji }) {
  const holderRef = useRef(null);
  const [photo, setPhoto] = useState(null);
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
      if (!cancelled) {
        setFailed(false);
        setPhoto(resolved);
      }
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            load();
          }
        },
        { rootMargin: "650px 0px" },
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
      {photo?.src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo.src}
          alt={item.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(event) => {
            if (photo.fallback && event.currentTarget.src !== photo.fallback) {
              event.currentTarget.src = photo.fallback;
              return;
            }
            setFailed(true);
          }}
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
