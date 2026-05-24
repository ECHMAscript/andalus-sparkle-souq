import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu } from "lucide-react";

const links = [
  { label: "Collections", to: "/" },
  { label: "Rings", to: "/" },
  { label: "Necklaces", to: "/" },
  { label: "Earrings", to: "/" },
  { label: "Heritage", to: "/" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <button className="lg:hidden neo-sm p-2.5">
          <Menu className="size-5 text-foreground" />
        </button>

        <Link to="/" className="flex items-center gap-3">
          <div className="neo-sm size-11 grid place-items-center">
            <span className="font-display text-xl text-gold-gradient">س</span>
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-display text-lg text-gold-gradient">Souq Al Andalus</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Fine Arabic Jewelry
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="px-4 py-2 text-sm text-foreground/80 hover:text-primary transition-colors rounded-full"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="neo-sm p-2.5 hidden sm:grid place-items-center">
            <Search className="size-4 text-foreground/80" />
          </button>
          <button className="neo-sm p-2.5 hidden sm:grid place-items-center">
            <User className="size-4 text-foreground/80" />
          </button>
          <button className="neo-pressable px-3 py-2.5 flex items-center gap-2">
            <ShoppingBag className="size-4 text-primary" />
            <span className="text-xs font-medium">2</span>
          </button>
        </div>
      </div>
    </header>
  );
}
