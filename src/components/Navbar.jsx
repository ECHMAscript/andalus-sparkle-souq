import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Heart, Menu } from "lucide-react";

const links = [
  "New Arrivals",
  "Rings",
  "Necklaces",
  "Earrings",
  "Bracelets",
  "Bridal",
  "Sale",
];

export default function Navbar() {
  return (
    <>
      {/* Promo bar */}
      <div className="bg-foreground text-background text-[11px] tracking-[0.2em] uppercase py-2 text-center">
        Complimentary shipping worldwide on orders over € 500 · Free returns
      </div>

      <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-6">
          <button className="lg:hidden neo-sm p-2.5">
            <Menu className="size-5" />
          </button>

          <Link to="/" className="flex items-center gap-3">
            <div className="neo-sm size-11 grid place-items-center">
              <span className="font-display text-2xl text-gold-gradient leading-none">س</span>
            </div>
            <div className="hidden sm:block leading-tight">
              <div
                className="font-display text-lg font-semibold"
                style={{ color: "oklch(0.55 0.14 75)" }}
              >
                Souq Al Andalus
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Fine Arabic Jewelry
              </div>
            </div>
          </Link>

          {/* Search bar — ecommerce centerpiece */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="neo-inset flex items-center gap-3 px-5 py-3 w-full rounded-full">
              <Search className="size-4 text-muted-foreground" />
              <input
                placeholder="Search rings, necklaces, bridal sets…"
                className="bg-transparent flex-1 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="neo-sm p-2.5 hidden sm:grid place-items-center">
              <User className="size-4" />
            </button>
            <button className="neo-sm p-2.5 hidden sm:grid place-items-center">
              <Heart className="size-4" />
            </button>
            <button className="neo-pressable px-4 py-2.5 flex items-center gap-2">
              <ShoppingBag className="size-4 text-primary" />
              <span className="text-xs font-semibold">2</span>
              <span className="hidden sm:inline text-xs text-muted-foreground">€ 3,420</span>
            </button>
          </div>
        </div>

        {/* Category nav */}
        <nav className="hidden lg:flex justify-center gap-1 pb-3 border-t border-border/40 pt-3">
          {links.map((l) => (
            <Link
              key={l}
              to="/"
              className="px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-foreground/70 hover:text-primary transition-colors"
            >
              {l}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
