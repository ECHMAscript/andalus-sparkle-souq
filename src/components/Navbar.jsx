// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, User, Heart, Menu, X, LogOut, Plus, Pencil, Check, Trash2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { useRole } from "@/lib/use-role";
import { useAdminMode, toggleAdminMode } from "@/lib/admin-mode";
import { useNavItems } from "@/lib/use-nav-items";
import { products } from "@/lib/products";
import {
  useFavorites,
  useBagCount,
  useMobileNavOpen,
  setMobileNavOpen,
  toggleMobileNav,
} from "@/lib/store";
import { toast } from "sonner";
import SouqBag from "@/components/SouqBag";
import ConfirmModal from "@/components/ConfirmModal";


function SearchBox({ className = "" }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term))
      .slice(0, 6);
  }, [q]);

  useEffect(() => {
    function onClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div className="neo-inset flex items-center gap-3 px-5 py-3 w-full rounded-full">
        <Search className="size-4 text-muted-foreground shrink-0" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search rings, necklaces, bridal sets…"
          className="bg-transparent flex-1 text-sm outline-none placeholder:text-muted-foreground min-w-0"
        />
        {q && (
          <button onClick={() => setQ("")} aria-label="Clear search" className="text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {open && q && (
        <div className="absolute left-0 right-0 top-full mt-2 neo rounded-2xl overflow-hidden z-50 bg-card">
          {results.length === 0 ? (
            <div className="p-5 text-sm text-muted-foreground text-center">No items match "{q}"</div>
          ) : (
            <ul className="max-h-80 overflow-auto py-2">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/product/$id"
                    params={{ id: p.id }}
                    onClick={() => { setOpen(false); setQ(""); }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/60 transition-colors text-left"
                  >
                    <div className="size-12 rounded-lg overflow-hidden neo-sm shrink-0">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{p.category}</div>
                    </div>
                    <div className="text-sm font-semibold text-primary shrink-0">€ {p.price.toLocaleString()}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// A single nav link. In admin mode it becomes editable in place.
function NavLinkItem({ item, editing, onSaved, onDeleted }) {
  const [label, setLabel] = useState(item.label);
  const [path, setPath] = useState(item.path);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function save() {
    const trimmed = label.trim();
    const p = path.trim();
    if (!trimmed || !p) { toast.error("Label and path are required"); return; }
    setSaving(true);
    const { error } = await supabase
      .from("nav_items")
      .update({ label: trimmed, path: p })
      .eq("id", item.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    onSaved?.();
  }

  async function confirmRemove() {
    setRemoving(true);
    const { error } = await supabase.from("nav_items").delete().eq("id", item.id);
    setRemoving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Removed");
    setConfirmOpen(false);
    onDeleted?.();
  }

  if (editing) {
    return (
      <>
        <div className="flex items-center gap-1 neo-inset rounded-full pl-3 pr-1 py-1">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="bg-transparent text-xs uppercase tracking-[0.15em] w-24 outline-none"
            placeholder="Label"
          />
          <span className="text-muted-foreground text-[10px]">→</span>
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="bg-transparent text-xs w-32 outline-none"
            placeholder="/path"
          />
          <button onClick={save} disabled={saving} aria-label="Save" className="neo-sm p-1.5 text-primary">
            <Check className="size-3.5" />
          </button>
          <button onClick={() => setConfirmOpen(true)} aria-label="Delete" className="neo-sm p-1.5 text-destructive">
            <Trash2 className="size-3.5" />
          </button>
        </div>
        <ConfirmModal
          open={confirmOpen}
          eyebrow="Admin action"
          title="Remove nav link?"
          message={`"${item.label}" will be removed from the site navigation. You can add it back later.`}
          confirmLabel="Remove link"
          busyLabel="Removing…"
          destructive
          busy={removing}
          onCancel={() => (removing ? null : setConfirmOpen(false))}
          onConfirm={confirmRemove}
        />
      </>
    );
  }

  return (
    <Link
      to={item.path}
      className="px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-foreground/70 hover:text-primary transition-colors"
    >
      {item.label}
    </Link>
  );
}


export default function Navbar() {
  const favs = useFavorites();
  const favCount = favs.length;
  const bagCount = useBagCount();
  const navOpen = useMobileNavOpen();
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const adminMode = useAdminMode();
  const { items: navItems, refresh } = useNavItems();
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newPath, setNewPath] = useState("/");

  const editable = isAdmin && adminMode;

  async function addItem() {
    const label = newLabel.trim();
    const path = newPath.trim();
    if (!label || !path) { toast.error("Label and path required"); return; }
    const sort_order = (navItems[navItems.length - 1]?.sort_order ?? 0) + 1;
    const { error } = await supabase.from("nav_items").insert({ label, path, sort_order });
    if (error) { toast.error(error.message); return; }
    toast.success("Added");
    setAdding(false); setNewLabel(""); setNewPath("/");
    refresh();
  }

  return (
    <>
      <div className="bg-foreground text-background text-[10px] sm:text-[11px] tracking-[0.2em] uppercase py-2 text-center px-2">
        <span className="hidden sm:inline">Complimentary shipping worldwide on orders over € 500 · Free returns</span>
        <span className="sm:hidden">Free shipping over € 500</span>
      </div>

      <div className="bg-background border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
          <span className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-muted-foreground truncate">
            Complimentary shipping worldwide on orders over € 500
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <button
                onClick={toggleAdminMode}
                className={`text-[10px] sm:text-[11px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 transition-all ${
                  adminMode ? "neo-pressable text-white" : "neo-sm text-foreground/80 hover:text-foreground"
                }`}
                style={adminMode ? { background: "linear-gradient(135deg, oklch(0.55 0.14 75), oklch(0.35 0.10 60))" } : undefined}
                title="Toggle admin mode"
              >
                <ShieldCheck className="size-3" />
                {adminMode ? "Admin On" : "Admin Off"}
              </button>
            )}
            {user ? (
              <Link to="/account/settings" className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full neo-sm hover:bg-muted/60 transition-colors">
                My Account
              </Link>
            ) : (
              <>
                <Link to="/auth" className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full neo-sm hover:bg-muted/60 transition-colors">
                  Log In
                </Link>
                <Link
                  to="/auth"
                  className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full neo-pressable text-white transition-all"
                  style={{ background: "linear-gradient(135deg, oklch(0.55 0.14 75), oklch(0.45 0.12 65))" }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-6">
          <button
            onClick={toggleMobileNav}
            aria-label={navOpen ? "Close menu" : "Open menu"}
            aria-expanded={navOpen}
            className="lg:hidden neo-sm p-2.5 shrink-0"
          >
            {navOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="neo-sm size-10 sm:size-11 grid place-items-center">
              <span className="font-display text-xl sm:text-2xl text-gold-gradient leading-none">س</span>
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-display text-base lg:text-lg font-semibold" style={{ color: "oklch(0.55 0.14 75)" }}>
                Souq Al Andalus
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Fine Arabic Jewelry</div>
            </div>
          </Link>

          <SearchBox className="hidden md:flex flex-1 max-w-md mx-2 lg:mx-4" />

          <div className="flex items-center gap-1.5 sm:gap-2">
            {user ? (
              <>
                <Link to="/account/settings" className="neo-sm p-2.5 hidden sm:grid place-items-center" aria-label="Account settings">
                  <User className="size-4" />
                </Link>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="neo-sm p-2.5 hidden sm:grid place-items-center"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut className="size-4" />
                </button>
              </>
            ) : (
              <Link to="/auth" className="neo-sm p-2.5 hidden sm:grid place-items-center" aria-label="Sign in or register">
                <User className="size-4" />
              </Link>
            )}
            <Link
              to="/favorites"
              className="neo-sm p-2.5 grid place-items-center relative"
              aria-label={`Favorites (${favCount})`}
            >
              <Heart className={`size-4 ${favCount > 0 ? "text-destructive fill-destructive" : ""}`} />
              {favCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-destructive text-white text-[10px] font-bold rounded-full size-5 grid place-items-center shadow-sm">
                  {favCount}
                </span>
              )}
            </Link>
            <Link
              to="/bag"
              className="neo-pressable px-3 sm:px-4 py-2.5 flex items-center gap-1.5 sm:gap-2 relative"
              aria-label={`Bag (${bagCount} items)`}
            >
              <SouqBag className="size-5 text-primary" />
              <span className="hidden md:inline text-xs uppercase tracking-widest font-semibold">Bag</span>
              {bagCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[10px] font-bold rounded-full size-5 grid place-items-center shadow-sm">
                  {bagCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="md:hidden px-4 pb-3">
          <SearchBox />
        </div>

        <nav className="hidden lg:flex justify-center items-center flex-wrap gap-1 pb-3 border-t border-border/40 pt-3 px-4">
          {navItems.map((item) => (
            <NavLinkItem
              key={item.id}
              item={item}
              editing={editable && editing}
              onSaved={refresh}
              onDeleted={refresh}
            />
          ))}

          {editable && adding && (
            <div className="flex items-center gap-1 neo-inset rounded-full pl-3 pr-1 py-1">
              <input
                autoFocus
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Label"
                className="bg-transparent text-xs uppercase tracking-[0.15em] w-24 outline-none"
              />
              <span className="text-muted-foreground text-[10px]">→</span>
              <input
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                placeholder="/path"
                className="bg-transparent text-xs w-32 outline-none"
              />
              <button onClick={addItem} aria-label="Save" className="neo-sm p-1.5 text-primary"><Check className="size-3.5" /></button>
              <button onClick={() => setAdding(false)} aria-label="Cancel" className="neo-sm p-1.5"><X className="size-3.5" /></button>
            </div>
          )}

          {editable && (
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border/40">
              <button
                onClick={() => setEditing((v) => !v)}
                aria-label={editing ? "Stop editing" : "Edit nav"}
                className={`neo-sm p-1.5 ${editing ? "text-primary" : ""}`}
                title={editing ? "Done" : "Edit nav items"}
              >
                {editing ? <Check className="size-3.5" /> : <Pencil className="size-3.5" />}
              </button>
              {!adding && (
                <button
                  onClick={() => setAdding(true)}
                  aria-label="Add nav item"
                  className="neo-sm p-1.5 text-primary"
                  title="Add a new nav item"
                >
                  <Plus className="size-3.5" />
                </button>
              )}
            </div>
          )}
        </nav>
      </header>

      <div
        onClick={() => setMobileNavOpen(false)}
        className={`fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          navOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden
      />

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-[280px] bg-background shadow-2xl lg:hidden transition-transform duration-300 ease-out ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!navOpen}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <div className="font-display text-lg font-semibold" style={{ color: "oklch(0.55 0.14 75)" }}>
            Souq Al Andalus
          </div>
          <button onClick={() => setMobileNavOpen(false)} aria-label="Close menu" className="neo-sm p-2">
            <X className="size-4" />
          </button>
        </div>
        <nav className="p-3 flex flex-col">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setMobileNavOpen(false)}
              className="px-4 py-3 text-sm uppercase tracking-[0.15em] text-foreground/80 hover:bg-muted rounded-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t border-border/60 my-3" />
          <Link
            to="/favorites"
            onClick={() => setMobileNavOpen(false)}
            className="px-4 py-3 text-sm uppercase tracking-[0.15em] flex items-center gap-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Heart className="size-4" /> Favorites
            {favCount > 0 && (
              <span className="ml-auto bg-destructive text-white text-[10px] font-bold rounded-full size-5 grid place-items-center">
                {favCount}
              </span>
            )}
          </Link>
          <Link
            to="/bag"
            onClick={() => setMobileNavOpen(false)}
            className="px-4 py-3 text-sm uppercase tracking-[0.15em] flex items-center gap-2 hover:bg-muted rounded-lg transition-colors"
          >
            <SouqBag className="size-4" /> Bag
            {bagCount > 0 && (
              <span className="ml-auto bg-foreground text-background text-[10px] font-bold rounded-full size-5 grid place-items-center">
                {bagCount}
              </span>
            )}
          </Link>
        </nav>
      </aside>
    </>
  );
}
