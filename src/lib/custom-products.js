// Client-side store for admin-created products. Persists to localStorage so
// items survive refresh. Each entry follows the same shape as the seeded
// products in src/lib/products.js so all consumers can render them identically.
import { useSyncExternalStore } from "react";

const KEY = "souq:custom-products";

function read() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

let state = read();
const listeners = new Set();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* quota, ignore */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function getCustomProducts() {
  return state;
}

export function findCustomProduct(id) {
  return state.find((p) => p.id === id);
}

export function addCustomProduct(product) {
  state = [product, ...state];
  persist();
  emit();
}

export function removeCustomProduct(id) {
  state = state.filter((p) => p.id !== id);
  persist();
  emit();
}

export function useCustomProducts() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => [],
  );
}

// Turn a free-text name into a URL-safe slug id.
export function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}
