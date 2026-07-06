// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Minus, Plus, Star, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import SouqBag from "@/components/SouqBag";
import { findProductById, sizeGuides, products } from "@/lib/products";
import { addToBag, useFavorites, toggleFavorite } from "@/lib/store";
import { ProductCard } from "@/components/Products";
import SizeGuide from "@/components/SizeGuide";
import { trackProductEvent } from "@/lib/track";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  loader: ({ params }) => {
    const p = findProductById(params.id);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product?.name ?? "Piece"} — Souq Al Andalus` },
      { name: "description", content: loaderData?.product?.description ?? "" },
      { property: "og:image", content: loaderData?.product?.img ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <PageShell>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl mb-3">Piece not found</h1>
        <Link to="/" className="btn-gold px-6 py-3 text-xs uppercase tracking-widest font-semibold inline-block">
          Back home
        </Link>
      </main>
      <Footer />
    </PageShell>
  ),
});

// Real magnifying-glass: the lens itself shows an enlarged crop of the
// image, positioned to follow the cursor — exactly like a physical loupe.
function ZoomImage({ src, alt }) {
  const wrapRef = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [visible, setVisible] = useState(false);

  const onMove = (e) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    setSize({ w: r.width, h: r.height });
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const LENS = 180; // px
  const ZOOM = 2.5;

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={onMove}
      className="relative neo-inset rounded-2xl overflow-hidden aspect-square cursor-zoom-in"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover select-none"
        draggable={false}
      />
      {visible && size.w > 0 && (
        <div
          aria-hidden
          className="hidden md:block absolute pointer-events-none rounded-full ring-2 ring-primary/80 shadow-2xl"
          style={{
            width: LENS,
            height: LENS,
            left: `calc(${pos.x}% - ${LENS / 2}px)`,
            top: `calc(${pos.y}% - ${LENS / 2}px)`,
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${size.w * ZOOM}px ${size.h * ZOOM}px`,
            backgroundPosition: `${pos.x}% ${pos.y}%`,
          }}
        />
      )}
    </div>
  );
}

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const favs = useFavorites();
  const favored = favs.includes(p.id);

  // Gallery: use p.images if provided; otherwise fall back to the main image
  // plus a few same-category siblings as placeholder alternate shots.
  const gallery = useMemo(() => {
    if (Array.isArray(p.images) && p.images.length > 0) return p.images;
    const siblings = products
      .filter((x) => x.category === p.category && x.id !== p.id)
      .slice(0, 3)
      .map((x) => x.img);
    return [p.img, ...siblings];
  }, [p]);
  const [activeImg, setActiveImg] = useState(0);
  useEffect(() => setActiveImg(0), [p.id]);

  const sizes = sizeGuides[p.category] ?? [];
  const [size, setSize] = useState(sizes[Math.floor(sizes.length / 2)] ?? "");
  const [customSize, setCustomSize] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const finalSize = isCustom ? `Custom: ${customSize.trim()}` : size;
  const canAdd = isCustom ? customSize.trim().length > 0 : !!size;

  const handleAdd = () => {
    if (!canAdd) return;
    addToBag({ id: p.id, size: finalSize, qty });
    trackProductEvent({ productId: p.id, productName: p.name, eventType: "cart" });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleFavorite = () => {
    const wasFav = favored;
    toggleFavorite(p.id);
    if (!wasFav) trackProductEvent({ productId: p.id, productName: p.name, eventType: "favorite" });
  };

  // Track a "view" event once the user dwells on the product for 10+ seconds.
  useEffect(() => {
    const timer = setTimeout(() => {
      trackProductEvent({ productId: p.id, productName: p.name, eventType: "view" });
    }, 10_000);
    return () => clearTimeout(timer);
  }, [p.id, p.name]);

  const related = useMemo(
    () => products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4),
    [p],
  );

  return (
    <PageShell>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/category/$category" params={{ category: p.category.toLowerCase() }} className="hover:text-primary">
            {p.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{p.name}</span>
        </div>

        {/* Row on lg+; column on smaller screens, image on top */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <ZoomImage src={gallery[activeImg] ?? p.img} alt={p.name} />
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
                {gallery.map((src, i) => {
                  const isActive = i === activeImg;
                  return (
                    <button
                      key={`${src}-${i}`}
                      onClick={() => setActiveImg(i)}
                      aria-label={`View image ${i + 1} of ${p.name}`}
                      aria-current={isActive}
                      className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                        isActive
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background -translate-y-0.5"
                          : "neo-sm hover:-translate-y-0.5 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={src}
                        alt={`${p.name} view ${i + 1}`}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </button>
                  );
                })}
              </div>
            )}
            <p className="hidden md:block text-[11px] uppercase tracking-[0.25em] text-muted-foreground mt-3 text-center">
              Hover the image to zoom in
            </p>
          </div>

          <div className="relative overflow-hidden">
            <div
              aria-hidden={showGuide}
              className={`flex flex-col transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                showGuide ? "-translate-x-[110%] opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
              }`}
            >
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
              {p.style} · {p.material}
            </div>
            <h1 className="font-display text-3xl md:text-4xl leading-tight">{p.name}</h1>

            <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-primary text-primary" />
                <span className="text-foreground font-medium">{p.rating}</span>
              </div>
              <span>·</span>
              <span>{p.reviews} reviews</span>
            </div>

            <div className="flex items-baseline gap-3 mt-5">
              <span className="font-display text-3xl text-foreground">€ {p.price.toLocaleString()}</span>
              {p.was && (
                <span className="text-base text-muted-foreground line-through">€ {p.was.toLocaleString()}</span>
              )}
            </div>

            <p className="text-sm text-foreground/75 leading-relaxed mt-5">{p.description}</p>

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="mt-7">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs uppercase tracking-[0.25em] text-foreground/80">
                    Select your size
                  </div>
                  <button
                    onClick={() => setShowGuide(true)}
                    className="text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                  >
                    Size guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setIsCustom(false);
                        setSize(s);
                      }}
                      className={`min-w-[56px] px-4 py-2.5 text-sm rounded-full transition-all ${
                        !isCustom && size === s ? "btn-gold font-semibold" : "neo-sm hover:-translate-y-0.5"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  <button
                    onClick={() => setIsCustom(true)}
                    className={`px-4 py-2.5 text-sm rounded-full transition-all ${
                      isCustom ? "btn-gold font-semibold" : "neo-sm hover:-translate-y-0.5"
                    }`}
                  >
                    Custom Size
                  </button>
                </div>
                {isCustom && (
                  <div className="mt-3 neo-inset rounded-full px-5 py-3 flex items-center gap-3">
                    <input
                      autoFocus
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                      placeholder={
                        p.category === "Rings"
                          ? "e.g. 54mm circumference"
                          : p.category === "Necklaces"
                          ? 'e.g. 19" length'
                          : "Enter your measurement"
                      }
                      className="bg-transparent flex-1 text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
              <div className="text-xs uppercase tracking-[0.25em] text-foreground/80">Quantity</div>
              <div className="neo-inset rounded-full flex items-center">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-3 hover:text-primary"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => (p.stock === 0 ? q + 1 : Math.min(p.stock, q + 1)))}
                  className="p-3 hover:text-primary"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
              {p.stock === 0 ? (
                <span className="text-xs text-[oklch(0.45_0.12_160)] font-semibold uppercase tracking-widest">
                  {p.tag === "New" ? "Pre-order · ships next season" : "Out of stock · pre-order"}
                </span>
              ) : p.stock <= 10 ? (
                <span className="text-xs text-[oklch(0.55_0.14_75)] font-semibold uppercase tracking-widest">
                  Only {p.stock} left
                </span>
              ) : null}
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                disabled={!canAdd}
                className={`flex-1 py-4 text-xs uppercase tracking-widest font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                  p.stock === 0
                    ? "neo-pressable text-[oklch(0.35_0.12_160)]"
                    : "btn-gold"
                }`}
                style={
                  p.stock === 0
                    ? { boxShadow: "0 10px 24px -10px color-mix(in oklab, oklch(0.55 0.14 160) 60%, transparent)" }
                    : undefined
                }
              >
                <SouqBag className="size-4" />
                {p.stock === 0
                  ? added
                    ? "Pre-order Placed ✓"
                    : "Place an Order"
                  : added
                  ? "Added to Bag ✓"
                  : "Add to Bag"}
              </button>
              <button
                onClick={handleFavorite}
                aria-label={favored ? "Remove from favorites" : "Add to favorites"}
                className={`neo-pressable px-5 py-4 inline-flex items-center justify-center cursor-pointer ${
                  favored ? "text-destructive" : ""
                }`}
              >
                <Heart className={`size-5 ${favored ? "fill-destructive" : ""}`} />
              </button>
            </div>

            {/* Trust strip */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { Icon: Truck, t: "Free shipping" },
                { Icon: ShieldCheck, t: "Certified 21k" },
                { Icon: RefreshCw, t: "30-day returns" },
              ].map(({ Icon, t }) => (
                <div key={t} className="neo-sm p-3 flex flex-col items-center gap-1.5 text-center">
                  <Icon className="size-4 text-primary" />
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t}</div>
                </div>
              ))}
            </div>
            </div>

            {/* Size guide panel — slides in from the right when toggled */}
            <div
              aria-hidden={!showGuide}
              className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                showGuide ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0 pointer-events-none"
              }`}
            >
              <SizeGuide category={p.category} onClose={() => setShowGuide(false)} />
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl md:text-3xl mb-6">
              You may also <span className="italic text-gold-gradient">love</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {related.map((rp) => (
                <ProductCard key={rp.id} p={rp} favorited={favs.includes(rp.id)} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </PageShell>
  );
}
