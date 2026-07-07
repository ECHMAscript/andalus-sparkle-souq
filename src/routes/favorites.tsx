import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Star, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import { products } from "@/lib/products";
import { useCustomProducts } from "@/lib/custom-products";
import { useFavorites, toggleFavorite } from "@/lib/store";


export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
  head: () => ({
    meta: [
      { title: "Your Favorites — Souq Al Andalus" },
      {
        name: "description",
        content: "The Souq Al Andalus pieces you've saved to your favorites.",
      },
    ],
  }),
});

function FavoritesPage() {
  const favs = useFavorites();
  const custom = useCustomProducts();
  const items = [...custom, ...products].filter((p) => favs.includes(p.id));


  return (
    <PageShell>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16 min-h-[60vh]">
        <div className="mb-8 sm:mb-12">
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
            Saved for you
          </div>
          <h1 className="font-display text-3xl md:text-5xl">
            Your <span className="italic text-gold-gradient">Favorites</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {items.length} {items.length === 1 ? "piece" : "pieces"} saved
          </p>
        </div>

        {items.length === 0 ? (
          <div className="neo p-10 sm:p-16 text-center max-w-xl mx-auto">
            <div className="neo-inset size-16 rounded-full grid place-items-center mx-auto mb-5">
              <Heart className="size-7 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl mb-2">No favorites yet</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Tap the heart on any piece to save it here for later.
            </p>
            <Link to="/" className="btn-gold inline-block px-6 py-3 text-xs uppercase tracking-widest font-semibold">
              Browse the Souq
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {items.map((p) => (
              <article key={p.id} className="neo-pressable p-3 group flex flex-col">
                <div className="relative neo-inset rounded-xl overflow-hidden aspect-square">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <button
                    onClick={() => toggleFavorite(p.id)}
                    aria-label="Remove from favorites"
                    className="absolute top-3 right-3 p-2 grid place-items-center rounded-full bg-destructive hover:bg-destructive/90 transition-all duration-200 hover:scale-110"
                    style={{
                      boxShadow:
                        "0 4px 12px color-mix(in oklab, var(--destructive) 50%, transparent)",
                    }}
                  >
                    <X className="size-3.5 text-white" />
                  </button>
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
                    <span className="text-base font-semibold text-foreground">
                      € {p.price.toLocaleString()}
                    </span>
                    {p.was && (
                      <span className="text-xs text-muted-foreground line-through">
                        € {p.was.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </PageShell>
  );
}
