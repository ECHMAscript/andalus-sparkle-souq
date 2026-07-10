// @ts-nocheck
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

// Reusable themed confirmation modal — matches the souq neomorphic palette.
export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  eyebrow = "Confirm action",
  confirmLabel = "Confirm",
  busyLabel = "Working…",
  busy = false,
  destructive = false,
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape" && !busy) onCancel?.(); };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, busy, onCancel]);

  if (!open || typeof document === "undefined") return null;

  const accent = destructive ? "oklch(0.55 0.19 27)" : "var(--primary)";

  return createPortal(
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] grid place-items-center px-4">
      <div
        onClick={busy ? undefined : onCancel}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        aria-hidden
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md neo p-7 rounded-2xl bg-card animate-in zoom-in-95 fade-in duration-200"
        style={{
          boxShadow: `0 30px 80px -20px color-mix(in oklab, black 55%, transparent), 0 0 0 1px color-mix(in oklab, ${accent} 20%, transparent)`,
        }}
      >
        <div className="flex items-start gap-4">
          <div className="neo-inset shrink-0 size-12 rounded-full grid place-items-center" style={{ color: accent }}>
            <AlertTriangle className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.3em] mb-1" style={{ color: accent }}>
              {eyebrow}
            </div>
            <h2 className="font-display text-2xl leading-tight">{title}</h2>
            {message && (
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{message}</p>
            )}
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
              background: destructive
                ? "linear-gradient(135deg, oklch(0.58 0.19 27), oklch(0.42 0.16 25))"
                : "linear-gradient(135deg, var(--gold), oklch(0.55 0.14 75))",
              boxShadow: `0 12px 28px -10px color-mix(in oklab, ${accent} 70%, transparent)`,
            }}
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : destructive ? <Trash2 className="size-3.5" /> : null}
            {busy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
