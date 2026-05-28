import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { products, categories } from "@/lib/products";
import { useFavorites, toggleFavorite } from "@/lib/store";

function ImageTag({ tag, stock }) {
  const badges = [];
  if (tag && tag.startsWith("-")) {
    badges.push({ key: "discount", label: tag + " OFF", cls: "bg-destructive text-white" });
  } else if (tag === "New") {
    badges.push({ key: "new", label: "NEW", cls: "bg-foreground text-background" });
  }
  if (typeof stock === "number" && stock <= 10) {
    badges.push({ key: "stock", label: `Only ${stock} left`, cls: "bg-[oklch(0.55_0.14_75)] text-white" });
  }
  if (!badges.length) return null;
  return (
    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
      {badges.map((b) => (
        <span key={b.key} className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] font-bold rounded-full shadow-sm ${b.cls}`}>
          {b.label}
        </span>
      ))}
    </div>
  );
}

export function ProductCard({ p, favorited }) {
  const handleFav = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(p.id);
  };
  return (
    <Link
      to="/product/$id"
      params={{ id: p.id }}
      className="neo-pressable p-3 group flex flex-col"
    >
      <div className="relative neo-inset rounded-xl overflow-hidden aspect-square">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <ImageTag tag={p.tag} stock={p.stock} />
        <button
          onClick={handleFav}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorited}
          className={`absolute top-3 right-3 p-2 grid place-items-center rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
            favorited ? "bg-destructive hover:bg-destructive/90" : "bg-background/80 hover:bg-background"
          }`}
          style={{
            boxShadow: favorited
              ? "0 4px 12px color-mix(in oklab, var(--destructive) 50%, transparent)"
              : "0 1px 3px color-mix(in oklab, black 12%, transparent)",
          }}
        >
          <Heart className={`size-3.5 transition-colors ${favorited ? "text-white fill-white" : "text-foreground"}`} />
        </button>
        <span className="absolute bottom-3 left-3 right-3 btn-gold py-2.5 text-[10px] uppercase tracking-widest font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity">
          View Piece
        </span>
      </div>
      <div className="px-1 pt-4 pb-1 flex flex-col gap-1.5 flex-1">
        <h3 className="text-sm font-medium leading-tight">{p.name}</h3>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Star className="size-3 fill-primary text-primary" />
          <span>{p.rating}</span>
          <span>·</span>
          <span>{p.reviews} reviews</span>
        </div>
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base font-semibold text-foreground">€ {p.price.toLocaleString()}</span>
          {p.was && <span className="text-xs text-muted-foreground line-through">€ {p.was.toLocaleString()}</span>}
        </div>
      </div>
    </Link>
  );
}

export default function Products() {
  const [active, setActive] = useState(0);
  const favs = useFavorites();

  const panels = useMemo(
    () =>
      categories.map((cat) => ({
        cat,
        items: cat === "All" ? products : products.filter((p) => p.category === cat),
      })),
    [],
  );

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">Featured</div>
          <h2 className="font-display text-3xl md:text-4xl">
            Trending <span className="italic text-gold-gradient">Now</span>
          </h2>
        </div>

        <div className="neo-inset p-1.5 rounded-full flex gap-1 overflow-x-auto relative max-w-full" role="tablist">
          {categories.map((f, i) => (
            <button
              key={f}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`relative z-10 px-4 py-2 text-[11px] uppercase tracking-widest whitespace-nowrap rounded-full transition-colors duration-300 ${
                i === active ? "text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {i === active && (
                <span aria-hidden className="absolute inset-0 bg-foreground rounded-full -z-10" />
              )}
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(-${active * 100}%)`,
            transition: "transform 500ms cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        >
          {panels.map((panel) => (
            <div key={panel.cat} className="w-full shrink-0">
              {panel.items.length === 0 ? (
                <div className="py-16 text-center text-sm text-muted-foreground">
                  No items in {panel.cat} yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  {panel.items.map((p) => (
                    <ProductCard key={p.id} p={p} favorited={favs.includes(p.id)} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
