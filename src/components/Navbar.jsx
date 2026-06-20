import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, User, Heart, Menu, X } from "lucide-react";
import { products, categoryTiles } from "@/lib/products";
import {
  useFavorites,
  useBagCount,
  useMobileNavOpen,
  setMobileNavOpen,
  toggleMobileNav,
} from "@/lib/store";
import SouqBag from "@/components/SouqBag";

const links = [
  { label: "New Arrivals", to: "/" },
  ...categoryTiles.map((c) => ({ label: c.name, to: "/category/$category", params: { category: c.name.toLowerCase() } })),
  { label: "Crafting", to: "/crafting" },
  { label: "Sale", to: "/sale" },

];

function SearchBox({ className = "" }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term),
      )
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
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
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
                    onClick={() => {
                      setOpen(false);
                      setQ("");
                    }}
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

export default function Navbar() {
  const favs = useFavorites();
  const favCount = favs.length;
  const bagCount = useBagCount();
  const navOpen = useMobileNavOpen();

  return (
    <>
      <div className="bg-foreground text-background text-[10px] sm:text-[11px] tracking-[0.2em] uppercase py-2 text-center px-2">
        <span className="hidden sm:inline">Complimentary shipping worldwide on orders over € 500 · Free returns</span>
        <span className="sm:hidden">Free shipping over € 500</span>
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
            <Link to="/account/settings" className="neo-sm p-2.5 hidden sm:grid place-items-center" aria-label="Account settings">
              <User className="size-4" />
            </Link>
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

        <nav className="hidden lg:flex justify-center gap-1 pb-3 border-t border-border/40 pt-3">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              params={l.params}
              className="px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-foreground/70 hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
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
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              params={l.params}
              onClick={() => setMobileNavOpen(false)}
              className="px-4 py-3 text-sm uppercase tracking-[0.15em] text-foreground/80 hover:bg-muted rounded-lg transition-colors"
            >
              {l.label}
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
