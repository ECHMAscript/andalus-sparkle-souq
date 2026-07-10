// @ts-nocheck
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { setProductSale } from "@/lib/custom-products";

// Admin modal — put a piece on sale by lowering its price. The original
// price is preserved on `was` so the strikethrough shows up storewide and
// the piece appears on /sale.
export default function SaleModal({ open, product, onClose }) {
  const originalPrice = product?.was ?? product?.price ?? 0;
  const [percent, setPercent] = useState(20);
  const [newPrice, setNewPrice] = useState(() => Math.max(1, Math.round(originalPrice * 0.8)));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    const base = product?.was ?? product?.price ?? 0;
    setPercent(20);
    setNewPrice(Math.max(1, Math.round(base * 0.8)));
  }, [open, product]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape" && !busy) onClose?.(); };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, busy, onClose]);

  if (!open || typeof document === "undefined" || !product) return null;

  const savings = Math.max(0, originalPrice - Number(newPrice || 0));
  const pct = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

  const updatePercent = (val) => {
    const clamped = Math.max(1, Math.min(90, Math.round(Number(val) || 0)));
    setPercent(clamped);
    setNewPrice(Math.max(1, Math.round(originalPrice * (1 - clamped / 100))));
  };
  const updatePrice = (val) => {
    const v = Math.max(1, Math.round(Number(val) || 0));
    setNewPrice(v);
    if (originalPrice > 0) setPercent(Math.max(1, Math.min(90, Math.round(((originalPrice - v) / originalPrice) * 100))));
  };

  const submit = async () => {
    if (newPrice >= originalPrice) {
      toast.error("Sale price must be lower than the original price.");
      return;
    }
    setBusy(true);
    try {
      await setProductSale(product.id, { was: originalPrice, price: Number(newPrice), tag: `-${pct}%` });
      toast.success(`${product.name} is now on sale (-${pct}%).`);
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Couldn't put this piece on sale.");
    } finally {
      setBusy(false);
    }
  };

  const removeSale = async () => {
    setBusy(true);
    try {
      await setProductSale(product.id, { was: null, price: originalPrice, tag: null });
      toast.success(`${product.name} removed from sale.`);
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Couldn't remove the sale.");
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] grid place-items-center px-4">
      <div
        onClick={busy ? undefined : onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        aria-hidden
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md neo p-7 rounded-2xl bg-card animate-in zoom-in-95 fade-in duration-200"
        style={{
          boxShadow:
            "0 30px 80px -20px color-mix(in oklab, black 55%, transparent), 0 0 0 1px color-mix(in oklab, var(--primary) 25%, transparent)",
        }}
      >
        <button
          onClick={busy ? undefined : onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-muted/60 text-muted-foreground"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="neo-inset shrink-0 size-12 rounded-full grid place-items-center text-primary">
            <Tag className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1">Admin action</div>
            <h2 className="font-display text-2xl leading-tight">Put on sale</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed truncate">
              <span className="text-foreground font-medium">{product.name}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <label className="neo-inset p-3 rounded-xl block">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Discount %</span>
            <input
              type="number"
              min={1}
              max={90}
              value={percent}
              onChange={(e) => updatePercent(e.target.value)}
              className="w-full bg-transparent text-lg font-semibold outline-none mt-1"
            />
          </label>
          <label className="neo-inset p-3 rounded-xl block">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">New price (€)</span>
            <input
              type="number"
              min={1}
              value={newPrice}
              onChange={(e) => updatePrice(e.target.value)}
              className="w-full bg-transparent text-lg font-semibold outline-none mt-1"
            />
          </label>
        </div>

        <div className="mt-4 neo-inset p-4 rounded-xl flex items-baseline justify-between">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Was</div>
          <div className="text-base line-through text-muted-foreground">€ {originalPrice.toLocaleString()}</div>
        </div>
        <div className="mt-2 neo-inset p-4 rounded-xl flex items-baseline justify-between">
          <div className="text-xs uppercase tracking-widest text-primary">Now</div>
          <div className="text-lg font-display text-foreground">€ {Number(newPrice).toLocaleString()}</div>
        </div>

        <div className="mt-7 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          {product.was != null && (
            <button
              type="button"
              onClick={removeSale}
              disabled={busy}
              className="neo-pressable px-5 py-3 text-[11px] uppercase tracking-widest font-semibold text-destructive disabled:opacity-50"
            >
              Remove sale
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="neo-pressable px-5 py-3 text-[11px] uppercase tracking-widest font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="btn-gold px-5 py-3 text-[11px] uppercase tracking-widest font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Tag className="size-3.5" />}
            {busy ? "Saving…" : `Apply -${pct}%`}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
