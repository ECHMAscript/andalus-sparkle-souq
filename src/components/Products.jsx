import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { Heart, Star, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { products, categories } from "@/lib/products";
import { useFavorites, toggleFavorite } from "@/lib/store";
import { useCustomProducts, removeCustomProduct } from "@/lib/custom-products";
import { useRole } from "@/lib/use-role";
import { useAdminMode } from "@/lib/admin-mode";

// Themed confirmation modal — matches the souq neomorphic + gold palette
// and replaces the browser's default window.confirm() dialog.
function ConfirmDeleteModal({ open, name, busy, onCancel, onConfirm }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape" && !busy) onCancel(); };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, busy, onCancel]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      className="fixed inset-0 z-[100] grid place-items-center px-4"
    >
      <div
        onClick={busy ? undefined : onCancel}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        aria-hidden
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md neo p-7 rounded-2xl bg-card animate-in zoom-in-95 fade-in duration-200"
        style={{
          boxShadow:
            "0 30px 80px -20px color-mix(in oklab, black 55%, transparent), 0 0 0 1px color-mix(in oklab, var(--primary) 20%, transparent)",
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="neo-inset shrink-0 size-12 rounded-full grid place-items-center"
            style={{ color: "oklch(0.55 0.19 27)" }}
          >
            <AlertTriangle className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1">
              Admin action
            </div>
            <h2 id="confirm-delete-title" className="font-display text-2xl leading-tight">
              Delete this piece?
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              <span className="text-foreground font-medium">{name}</span> will be
              removed from the storefront and permanently deleted from the
              database. This cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="neo-pressable px-5 py-3 text-[11px] uppercase tracking-widest font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="px-5 py-3 rounded-full text-[11px] uppercase tracking-widest font-semibold text-white inline-flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, oklch(0.58 0.19 27), oklch(0.42 0.16 25))",
              boxShadow: "0 12px 28px -10px color-mix(in oklab, oklch(0.55 0.19 27) 70%, transparent)",
            }}
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
            {busy ? "Deleting…" : "Delete piece"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}




function ImageTag({ tag, stock }) {
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
  const { isAdmin } = useRole();
  const adminMode = useAdminMode();
  const custom = useCustomProducts();
  const isCustomPiece = custom.some((x) => x.id === p.id);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const canDelete = isAdmin && adminMode;

  const handleFav = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(p.id);
  };

  const askDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCustomPiece) {
      toast.error("Seeded pieces can't be deleted from the storefront.");
      return;
    }
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await removeCustomProduct(p.id);
      toast.success(`${p.name} was removed from the store.`);
      setConfirmOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Couldn't delete the piece. Please try again.");
    } finally {
      setDeleting(false);
    }
  };


  return (
    <>
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
          {canDelete && (
            <button
              onClick={askDelete}
              disabled={deleting}
              aria-label={`Delete ${p.name} permanently`}
              className="absolute top-3 right-14 p-2 grid place-items-center rounded-full bg-destructive hover:bg-destructive/90 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
              style={{ boxShadow: "0 4px 12px color-mix(in oklab, var(--destructive) 50%, transparent)" }}
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
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
      <ConfirmDeleteModal
        open={confirmOpen}
        name={p.name}
        busy={deleting}
        onCancel={() => (deleting ? null : setConfirmOpen(false))}
        onConfirm={confirmDelete}
      />
    </>
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
