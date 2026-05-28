import { useSyncExternalStore } from "react";

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
  favStore.set((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
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
}
export function updateBagItem(id, size, qty) {
  bagStore.set((cur) =>
    cur
      .map((i) => (i.id === id && i.size === size ? { ...i, qty } : i))
      .filter((i) => i.qty > 0),
  );
}
export function removeFromBag(id, size) {
  bagStore.set((cur) => cur.filter((i) => !(i.id === id && i.size === size)));
}
export function clearBag() {
  bagStore.set([]);
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
