import { useSyncExternalStore } from "react";

const KEY = "souq:admin-mode";
let state = false;
if (typeof window !== "undefined") {
  try { state = window.localStorage.getItem(KEY) === "1"; } catch { /* ignore */ }
}
const listeners = new Set();

export function useAdminMode() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => state,
    () => false,
  );
}
export function setAdminMode(on) {
  state = !!on;
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(KEY, state ? "1" : "0"); } catch { /* ignore */ }
  }
  listeners.forEach((l) => l());
}
export function toggleAdminMode() { setAdminMode(!state); }

// Sidebar drawer state
let sidebarOpen = false;
const sidebarListeners = new Set();
export function useAdminSidebarOpen() {
  return useSyncExternalStore(
    (l) => { sidebarListeners.add(l); return () => sidebarListeners.delete(l); },
    () => sidebarOpen,
    () => false,
  );
}
export function setAdminSidebarOpen(open) {
  sidebarOpen = !!open;
  sidebarListeners.forEach((l) => l());
}
export function toggleAdminSidebar() { setAdminSidebarOpen(!sidebarOpen); }
