import { useSyncExternalStore } from "react";

// Tiny external store helper
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

// ---------- Favorites ----------
const FAV_KEY = "souq:favorites";

function loadFavs() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const favStore = createStore([]);

if (typeof window !== "undefined") {
  favStore.set(loadFavs());
  favStore.subscribe(() => {
    try {
      window.localStorage.setItem(FAV_KEY, JSON.stringify(favStore.get()));
    } catch {
      // ignore
    }
  });
}

export function useFavorites() {
  return useSyncExternalStore(
    favStore.subscribe,
    favStore.get,
    () => [],
  );
}

export function toggleFavorite(id) {
  favStore.set((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
}

export function isFavorite(id) {
  return favStore.get().includes(id);
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
