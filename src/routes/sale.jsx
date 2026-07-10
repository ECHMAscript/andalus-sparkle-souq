// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Tag, Sparkles, Heart, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import { products, categoryTiles } from "@/lib/products";
import { useCustomProducts } from "@/lib/custom-products";
import { useFavorites, toggleFavorite } from "@/lib/store";

export const Route = createFileRoute("/sale")({
  component: SalePage,
  head: () => ({
    meta: [
      { title: "Sale — Souq Al Andalus" },
      {
        name: "description",
        content:
          "Hand-forged 21k gold jewelry from Souq Al Andalus — limited markdowns on rings, necklaces, earrings and bridal pieces.",
      },
      { property: "og:title", content: "Sale — Souq Al Andalus" },
      {
        property: "og:description",
        content: "Limited markdowns on heirloom Arabic gold jewelry.",
      },
    ],
  }),
});

// Derive sale items from the catalogue (price drop OR discount tag).
function isOnSale(p) {
  return p.was != null || (p.tag && p.tag.startsWith("-"));
}
function getSaleItems(all) {
  return all.filter(isOnSale);
}

// Group sale items into collections keyed by category. Only categories with
// at least one sale item are returned, in catalogue-tile order.
function getSaleCollections(all) {
  const sale = getSaleItems(all);
  return categoryTiles
    .map((c) => ({
      ...c,
      items: sale.filter((p) => p.category === c.name),
    }))
    .filter((c) => c.items.length > 0);
}


/* ---------------- Sale Card (top image / bottom white) ---------------- */

function SaleImageTag({ tag, stock }) {
  const badges = [];
  const isNew = tag === "New";
  const outOfStock = stock === 0;
  if (outOfStock && isNew) {
    badges.push({ key: "coming", label: "Coming Soon", cls: "bg-[oklch(0.45_0.12_160)] text-white" });
  } else if (outOfStock) {
    badges.push({ key: "sold", label: "Sold Out", cls: "bg-foreground/85 text-background" });
  } else if (tag && tag.startsWith("-")) {
    badges.push({ key: "discount", label: tag + " OFF", cls: "bg-destructive text-white" });
  } else if (isNew) {
    badges.push({ key: "new", label: "NEW", cls: "bg-foreground text-background" });
  }
  if (!outOfStock && typeof stock === "number" && stock <= 10) {
    badges.push({ key: "stock", label: `${stock} left`, cls: "bg-[oklch(0.55_0.14_75)] text-white" });
  }
  if (!badges.length) return null;
  return (
    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
      {badges.map((b) => (
        <span key={b.key} className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] font-bold rounded-full shadow-sm ${b.cls}`}>
          {b.label}
        </span>
      ))}
    </div>
  );
}

function SaleCard({ p, favorited }) {
  const handleFav = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(p.id);
  };
  return (
    <Link
      to="/product/$id"
      params={{ id: p.id }}
      className="group flex flex-col rounded-2xl overflow-hidden bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)]"
      style={{
        boxShadow: "0 8px 24px -8px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)",
      }}
    >
      {/* Top half — image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <SaleImageTag tag={p.tag} stock={p.stock} />
        <button
          onClick={handleFav}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorited}
          className={`absolute top-2.5 right-2.5 p-1.5 grid place-items-center rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
            favorited ? "bg-destructive hover:bg-destructive/90" : "bg-white/85 hover:bg-white"
          }`}
          style={{
            boxShadow: favorited
              ? "0 3px 10px color-mix(in oklab, var(--destructive) 45%, transparent)"
              : "0 1px 4px rgba(0,0,0,0.12)",
          }}
        >
          <Heart className={`size-3.5 transition-colors ${favorited ? "text-white fill-white" : "text-foreground"}`} />
        </button>
      </div>

      {/* Bottom half — white info panel */}
      <div className="flex flex-col gap-2 p-4 flex-1 bg-card">
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {p.category}
        </div>
        <h3 className="text-sm font-medium leading-tight line-clamp-2 min-h-[2.5em]">
          {p.name}
        </h3>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Star className="size-3 fill-primary text-primary" />
          <span>{p.rating}</span>
          <span>·</span>
          <span>{p.reviews} reviews</span>
        </div>
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base font-semibold text-foreground">€ {p.price.toLocaleString()}</span>
          {p.was && (
            <>
              <span className="text-xs text-muted-foreground line-through">€ {p.was.toLocaleString()}</span>
              <span className="ml-auto text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-destructive text-white">
                {p.tag} OFF
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ---------------- Jumbotron (image 1) ---------------- */

function Jumbotron({ heroItems }) {
  const [a, b, c] = heroItems;
  const cta = heroItems[0]?.category?.toLowerCase() ?? "rings";
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 sm:pt-10">
      <div
        className="relative overflow-hidden rounded-3xl px-6 sm:px-12 py-12 sm:py-16"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.05 165) 0%, oklch(0.32 0.06 165) 55%, oklch(0.42 0.07 165) 100%)",
        }}
      >
        {/* Andalusi geometric tracery */}
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full opacity-[0.08] text-[oklch(0.95_0.16_105)]"
          viewBox="0 0 600 400"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="andalus" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M30 0 L60 30 L30 60 L0 30 Z M30 12 L48 30 L30 48 L12 30 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>
          <rect width="600" height="400" fill="url(#andalus)" />
        </svg>

        <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          {/* Stacked tilted cards — image top, white info panel bottom */}
          <div className="relative h-[360px] sm:h-[440px] mx-auto w-full max-w-md">
            {[
              { p: b, rot: -10, tx: "-42%", ty: "-2%", z: 10, scale: 0.82 },
              { p: c, rot: 10, tx: "16%", ty: "-6%", z: 20, scale: 0.86 },
              { p: a, rot: -2, tx: "-8%", ty: "8%", z: 30, scale: 1 },
            ].map((card, i) =>
              card.p ? (
                <Link
                  key={card.p.id + i}
                  to="/product/$id"
                  params={{ id: card.p.id }}
                  className="absolute top-1/2 left-1/2 flex flex-col w-[58%] rounded-2xl overflow-hidden bg-card transition-transform duration-500 hover:scale-[1.03]"
                  style={{
                    transform: `translate(calc(-50% + ${card.tx}), calc(-50% + ${card.ty})) rotate(${card.rot}deg) scale(${card.scale})`,
                    zIndex: card.z,
                    boxShadow:
                      "0 24px 50px -10px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={card.p.img}
                      alt={card.p.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-full bg-destructive text-white">
                      {card.p.tag && card.p.tag.startsWith("-")
                        ? card.p.tag + " OFF"
                        : "Sale"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-3 bg-card">
                    <div className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                      {card.p.category}
                    </div>
                    <div className="text-xs font-medium leading-tight line-clamp-1 text-foreground">
                      {card.p.name}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-semibold text-foreground">
                        € {card.p.price.toLocaleString()}
                      </span>
                      {card.p.was && (
                        <span className="text-[10px] text-muted-foreground line-through">
                          € {card.p.was.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="mt-1 text-center text-[9px] uppercase tracking-widest font-bold px-2 py-1.5 rounded-full bg-foreground text-background">
                      Check it out
                    </span>
                  </div>
                </Link>
              ) : null,
            )}
          </div>


          {/* Message panel */}
          <div className="rounded-2xl border border-white/15 p-6 sm:p-8 bg-white/[0.04] backdrop-blur-sm">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[oklch(0.95_0.16_105)] mb-3 flex items-center gap-2">
              <Sparkles className="size-3.5" /> Souq Al Andalus · Seasonal Markdowns
            </div>
            <h1 className="font-display text-3xl sm:text-5xl text-white leading-[1.05] mb-4">
              The <span className="italic" style={{ color: "oklch(0.85 0.14 90)" }}>Mawsim</span> Sale
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
              A small selection of our atelier's hand-forged pieces — rings,
              chandelier earrings and bridal bangles — released at up to{" "}
              <span className="text-[oklch(0.95_0.16_105)] font-semibold">20% off</span>{" "}
              while stocks last. Each piece is still struck by hand in 21k gold.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/category/$category"
                params={{ category: cta }}
                className="btn-gold px-6 py-3 text-[11px] uppercase tracking-widest font-semibold"
              >
                Shop {cta} on sale
              </Link>
              <a
                href="#sale-grid"
                className="px-6 py-3 text-[11px] uppercase tracking-widest font-semibold rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                Browse all
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Card-deck carousel (image 2) ---------------- */

function DeckCarousel({ items }) {
  const deck = items.slice(0, 10);
  const [order, setOrder] = useState(() => deck.map((_, i) => i));
  const [animating, setAnimating] = useState(null); // 'next' | 'prev' | null
  const timer = useRef(null);

  const next = () => {
    if (animating) return;
    setAnimating("next");
    setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setAnimating(null);
    }, 520);
  };
  const prev = () => {
    if (animating) return;
    setAnimating("prev");
    setTimeout(() => {
      setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
      setAnimating(null);
    }, 520);
  };

  // Auto-advance every 4.5s, reset whenever user interacts.
  useEffect(() => {
    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(next, 4500);
    return () => timer.current && clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, animating]);

  if (deck.length === 0) return null;

  const VISIBLE = Math.min(5, deck.length);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2 flex items-center gap-2">
            <Tag className="size-3" /> Just Reduced
          </div>
          <h2 className="font-display text-2xl md:text-3xl">
            New on <span className="italic text-gold-gradient">sale</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            aria-label="Previous"
            className="neo-pressable size-10 grid place-items-center rounded-full"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="neo-pressable size-10 grid place-items-center rounded-full"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Deck stage */}
      <div
        className="relative mx-auto w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[480px] h-[min(70vw,320px)] sm:h-[400px] lg:h-[480px]"
        style={{ perspective: "1200px" }}
      >

        {order.slice(0, VISIBLE).map((idx, pos) => {
          const item = deck[idx];
          const isTop = pos === 0;
          const fly = isTop && animating;
          const baseY = pos * 8;
          const baseScale = 1 - pos * 0.05;
          const baseRot = pos * -1.2;
          let transform = `translate(-50%, calc(-50% + ${baseY}px)) scale(${baseScale}) rotate(${baseRot}deg)`;
          let opacity = 1 - pos * 0.08;
          if (fly === "next") {
            transform = `translate(calc(-50% + 130%), -50%) scale(0.9) rotate(18deg)`;
            opacity = 0;
          } else if (fly === "prev") {
            transform = `translate(calc(-50% - 130%), -50%) scale(0.9) rotate(-18deg)`;
            opacity = 0;
          }
          return (
            <Link
              key={item.id}
              to="/product/$id"
              params={{ id: item.id }}
              className="absolute top-1/2 left-1/2 w-[72%] sm:w-[68%] lg:w-[64%] aspect-[3/4] rounded-2xl overflow-hidden bg-card"
              style={{
                transform,
                opacity,
                zIndex: 50 - pos,
                transition:
                  "transform 520ms cubic-bezier(0.65,0,0.35,1), opacity 520ms ease",
                boxShadow:
                  "0 20px 48px -16px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)",
                pointerEvents: isTop ? "auto" : "none",
              }}
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-x-0 bottom-0 p-4 text-white"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)",
                }}
              >
                <div className="text-[10px] uppercase tracking-[0.25em] text-[oklch(0.95_0.16_105)] mb-0.5">
                  {item.category}
                </div>
                <div className="font-display text-lg sm:text-xl mb-0.5 leading-tight">
                  {item.name}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-semibold">
                    € {item.price.toLocaleString()}
                  </span>
                  {item.was && (
                    <span className="text-sm text-white/60 line-through">
                      € {item.was.toLocaleString()}
                    </span>
                  )}
                  {item.tag && item.tag.startsWith("-") && (
                    <span className="ml-auto text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-destructive">
                      {item.tag} OFF
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-5">
        {deck.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === 0 ? "bg-primary w-6" : "bg-muted-foreground/30 w-1.5"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

/* ---------------- Collections strip ---------------- */

function CollectionsStrip({ collections }) {
  if (!collections.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
          Shop the sale by
        </div>
        <h2 className="font-display text-2xl sm:text-3xl">Collections</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {collections.map((c) => (
          <Link
            key={c.name}
            to="/category/$category"
            params={{ category: c.name.toLowerCase() }}
            className="neo-pressable p-5 flex flex-col items-center text-center gap-2"
          >
            <span className="text-2xl text-gold-gradient">{c.icon}</span>
            <div className="text-sm font-semibold">{c.name}</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {c.items.length} on sale
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */

function SalePage() {
  const sale = useMemo(() => getSaleItems(), []);
  const collections = useMemo(() => getSaleCollections(), []);
  const favs = useFavorites();

  const heroItems =
    sale.length >= 3
      ? sale.slice(0, 3)
      : [...sale, ...products.filter((p) => !sale.includes(p))].slice(0, 3);

  const carouselItems =
    sale.length >= 4
      ? sale
      : [...sale, ...products.filter((p) => !sale.includes(p))].slice(0, 6);

  return (
    <PageShell>
      <Navbar />
      <main>
        <Jumbotron heroItems={heroItems} />
        <DeckCarousel items={carouselItems} />
        <CollectionsStrip collections={collections} />

        {/* Sale grid */}
        <section id="sale-grid" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
                Everything on
              </div>
              <h2 className="font-display text-3xl md:text-4xl">
                Sale <span className="italic text-gold-gradient">pieces</span>
              </h2>
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {sale.length} {sale.length === 1 ? "piece" : "pieces"} · final markdowns
            </div>
          </div>

          {sale.length === 0 ? (
            <div className="neo p-12 text-center text-muted-foreground">
              No pieces on sale at the moment. Check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {sale.map((p) => (
                <SaleCard key={p.id} p={p} favorited={favs.includes(p.id)} />
              ))}
            </div>
          )}
        </section>

        {/* Service strip */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { t: "Complimentary shipping", s: "Worldwide on every sale order" },
              { t: "30-day returns", s: "Even on discounted pieces" },
              { t: "Atelier guarantee", s: "Every piece is hallmarked 21k" },
            ].map((b) => (
              <div key={b.t} className="neo-sm p-5">
                <div className="text-sm font-semibold">{b.t}</div>
                <div className="text-xs text-muted-foreground mt-1">{b.s}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </PageShell>
  );
}
