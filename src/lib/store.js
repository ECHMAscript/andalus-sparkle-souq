import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

function createStore(initial) {
  let state = initial;
  const listeners = new Set();
  return {
    get: () => state,
    set: (updater) => {
      state = typeof updater === "function" ? updater(state) : updater;
      listeners.forEach((l) => l());
    },
    subscribe: (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

function persisted(key, store) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) store.set(JSON.parse(raw));
  } catch {
    /* ignore */
  }
  store.subscribe(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(store.get()));
    } catch {
      /* ignore */
    }
  });
}

// ---------- Favorites ----------
const favStore = createStore([]);
persisted("souq:favorites", favStore);

export function useFavorites() {
  return useSyncExternalStore(favStore.subscribe, favStore.get, () => []);
}
export function toggleFavorite(id) {
  const cur = favStore.get();
  const isFav = cur.includes(id);
  favStore.set(isFav ? cur.filter((x) => x !== id) : [...cur, id]);
  // Mirror to DB when signed in.
  if (currentUserId) {
    if (isFav) {
      supabase.from("user_favorites").delete().match({ user_id: currentUserId, product_id: id })
        .then(({ error }) => { if (error) console.warn("fav delete", error.message); });
    } else {
      supabase.from("user_favorites").insert({ user_id: currentUserId, product_id: id })
        .then(({ error }) => { if (error && !/duplicate/i.test(error.message)) console.warn("fav insert", error.message); });
    }
  }
}
export function isFavorite(id) {
  return favStore.get().includes(id);
}

// ---------- Bag (shopping cart) ----------
// items: [{ id, size, qty }]
const bagStore = createStore([]);
persisted("souq:bag", bagStore);

export function useBag() {
  return useSyncExternalStore(bagStore.subscribe, bagStore.get, () => []);
}
export function bagCount() {
  return bagStore.get().reduce((n, i) => n + i.qty, 0);
}
export function useBagCount() {
  const bag = useBag();
  return bag.reduce((n, i) => n + i.qty, 0);
}
export function addToBag({ id, size, qty = 1 }) {
  bagStore.set((cur) => {
    const idx = cur.findIndex((i) => i.id === id && i.size === size);
    if (idx >= 0) {
      const next = cur.slice();
      next[idx] = { ...next[idx], qty: next[idx].qty + qty };
      return next;
    }
    return [...cur, { id, size, qty }];
  });
  syncBagRow(id, size);
}
export function updateBagItem(id, size, qty) {
  bagStore.set((cur) =>
    cur
      .map((i) => (i.id === id && i.size === size ? { ...i, qty } : i))
      .filter((i) => i.qty > 0),
  );
  if (qty <= 0) syncBagDelete(id, size);
  else syncBagRow(id, size);
}
export function removeFromBag(id, size) {
  bagStore.set((cur) => cur.filter((i) => !(i.id === id && i.size === size)));
  syncBagDelete(id, size);
}
export function clearBag() {
  bagStore.set([]);
  if (currentUserId) {
    supabase.from("user_cart_items").delete().eq("user_id", currentUserId)
      .then(({ error }) => { if (error) console.warn("bag clear", error.message); });
  }
}

// ---------- DB sync ----------
let currentUserId = null;

function syncBagRow(id, size) {
  if (!currentUserId) return;
  const row = bagStore.get().find((i) => i.id === id && i.size === (size ?? ""));
  const found = bagStore.get().find((i) => i.id === id && i.size === size);
  const qty = found?.qty;
  if (!qty) { syncBagDelete(id, size); return; }
  supabase.from("user_cart_items").upsert(
    { user_id: currentUserId, product_id: id, size: size ?? "", qty },
    { onConflict: "user_id,product_id,size" },
  ).then(({ error }) => { if (error) console.warn("bag upsert", error.message); });
}
function syncBagDelete(id, size) {
  if (!currentUserId) return;
  supabase.from("user_cart_items").delete()
    .match({ user_id: currentUserId, product_id: id, size: size ?? "" })
    .then(({ error }) => { if (error) console.warn("bag del", error.message); });
}

async function hydrateFromDb(userId) {
  // Merge local + remote favorites (union), then persist both sides.
  const localFavs = favStore.get();
  const localBag = bagStore.get();

  const [favRes, bagRes] = await Promise.all([
    supabase.from("user_favorites").select("product_id").eq("user_id", userId),
    supabase.from("user_cart_items").select("product_id, size, qty").eq("user_id", userId),
  ]);

  const remoteFavs = (favRes.data ?? []).map((r) => r.product_id);
  const mergedFavs = Array.from(new Set([...remoteFavs, ...localFavs]));
  favStore.set(mergedFavs);

  // Push any local-only favorites up.
  const toInsert = localFavs.filter((id) => !remoteFavs.includes(id));
  if (toInsert.length) {
    await supabase.from("user_favorites").insert(
      toInsert.map((product_id) => ({ user_id: userId, product_id })),
    );
  }

  // Merge bag: prefer max(qty) per (id,size).
  const bagMap = new Map();
  for (const r of bagRes.data ?? []) {
    bagMap.set(`${r.product_id}||${r.size ?? ""}`, { id: r.product_id, size: r.size ?? "", qty: r.qty });
  }
  for (const l of localBag) {
    const k = `${l.id}||${l.size ?? ""}`;
    const cur = bagMap.get(k);
    bagMap.set(k, { id: l.id, size: l.size ?? "", qty: Math.max(l.qty, cur?.qty ?? 0) });
  }
  const merged = [...bagMap.values()];
  bagStore.set(merged);
  // Push merged bag up.
  if (merged.length) {
    await supabase.from("user_cart_items").upsert(
      merged.map((i) => ({ user_id: userId, product_id: i.id, size: i.size ?? "", qty: i.qty })),
      { onConflict: "user_id,product_id,size" },
    );
  }
}

if (typeof window !== "undefined") {
  supabase.auth.getSession().then(({ data }) => {
    const uid = data.session?.user?.id ?? null;
    currentUserId = uid;
    if (uid) hydrateFromDb(uid).catch((e) => console.warn("hydrate", e));
  });
  supabase.auth.onAuthStateChange((event, session) => {
    const uid = session?.user?.id ?? null;
    if (uid && uid !== currentUserId) {
      currentUserId = uid;
      hydrateFromDb(uid).catch((e) => console.warn("hydrate", e));
    } else if (!uid && event === "SIGNED_OUT") {
      currentUserId = null;
    }
  });
}

// ---------- Mobile nav drawer ----------
const navStore = createStore(false);
export function useMobileNavOpen() {
  return useSyncExternalStore(navStore.subscribe, navStore.get, () => false);
}
export function setMobileNavOpen(open) {
  navStore.set(!!open);
}
export function toggleMobileNav() {
  navStore.set((v) => !v);
}
