// Persistent store for admin-added products, backed by public.products.
// Anyone can read (public catalog), only admins can insert/update/delete
// — RLS in the database enforces that regardless of client code.
import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

let state = [];
let loaded = false;
let loadingPromise = null;
const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

// Convert a DB row (snake-ish jsonb columns) to the shape the UI expects.
function rowToProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    style: row.style ?? "",
    material: row.material ?? "",
    occasion: row.occasion ?? "",
    price: Number(row.price) || 0,
    was: row.was == null ? null : Number(row.was),
    img: row.img ?? "",
    images: Array.isArray(row.images) ? row.images : [],
    tag: row.tag ?? null,
    stock: row.stock ?? 0,
    rating: Number(row.rating) || 5,
    reviews: row.reviews ?? 0,
    description: row.description ?? "",
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    createdAt: row.created_at,
  };
}

export async function loadCustomProducts() {
  if (loaded) return state;
  if (loadingPromise) return loadingPromise;
  loadingPromise = (async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && Array.isArray(data)) {
      state = data.map(rowToProduct);
      loaded = true;
      emit();
    }
    loadingPromise = null;
    return state;
  })();
  return loadingPromise;
}

export function getCustomProducts() {
  return state;
}

export function findCustomProduct(id) {
  return state.find((p) => p.id === id);
}

export async function addCustomProduct(product) {
  const row = {
    id: product.id,
    name: product.name,
    category: product.category,
    style: product.style || null,
    material: product.material || null,
    occasion: product.occasion || null,
    price: product.price,
    was: product.was ?? null,
    img: product.img || null,
    images: product.images ?? [],
    tag: product.tag ?? null,
    stock: product.stock ?? 0,
    rating: product.rating ?? 5,
    reviews: product.reviews ?? 0,
    description: product.description ?? "",
    sizes: product.sizes ?? [],
  };
  const { data, error } = await supabase
    .from("products")
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  const saved = rowToProduct(data);
  state = [saved, ...state.filter((p) => p.id !== saved.id)];
  emit();
  return saved;
}

export async function removeCustomProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  state = state.filter((p) => p.id !== id);
  emit();
}

// Update sale fields (was / price / tag) on a DB-backed product.
export async function setProductSale(id, { was, price, tag }) {
  const patch = { was, price, tag };
  const { data, error } = await supabase
    .from("products")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  const saved = rowToProduct(data);
  state = state.map((p) => (p.id === id ? saved : p));
  emit();
  return saved;
}


export function useCustomProducts() {
  const list = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => [],
  );
  useEffect(() => {
    if (!loaded) void loadCustomProducts();
  }, []);
  return list;
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

// Kick off an initial load in the browser so pages that don't mount the
// hook immediately (e.g. a hard refresh onto /product/:id) still see custom
// products quickly.
if (typeof window !== "undefined") {
  void loadCustomProducts();
}
