// @ts-nocheck
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import SouqBag from "@/components/SouqBag";
import { useBag, updateBagItem, removeFromBag, clearBag } from "@/lib/store";
import { findProductById } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/bag")({
  component: BagPage,
  head: () => ({
    meta: [
      { title: "Your Bag — Souq Al Andalus" },
      { name: "description", content: "Review the pieces in your bag before checkout." },
    ],
  }),
});

// Decorative Andalusi geometric border — repeating SVG star
function GeometricBorder() {
  return (
    <div
      aria-hidden
      className="h-3 w-full opacity-40"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, color-mix(in oklab, var(--gold) 60%, transparent) 0 1px, transparent 1px 12px)",
      }}
    />
  );
}

function BagPage() {
  const { user } = useAuth();
  const bag = useBag();
  const lines = bag
    .map((i) => ({ ...i, product: findProductById(i.id) }))
    .filter((i) => i.product);

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 35;
  const total = subtotal + shipping;

  const [stage, setStage] = useState("bag"); // "bag" | "checkout" | "confirmed"
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "United Arab Emirates",
    zip: "",
  });

  const onPlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to place an order.");
      return;
    }
    setPlacing(true);
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        full_name: form.name,
        email: form.email,
        address: form.address,
        city: form.city,
        country: form.country,
        postal_code: form.zip || null,
        subtotal,
        shipping,
        total,
        status: "pending",
      })
      .select("id")
      .single();
    if (error || !order) {
      setPlacing(false);
      toast.error(error?.message || "Couldn't place order.");
      return;
    }
    const items = lines.map((l) => ({
      order_id: order.id,
      product_id: String(l.id),
      product_name: l.product.name,
      size: l.size || null,
      qty: l.qty,
      unit_price: l.product.price,
    }));
    const { error: itemsErr } = await supabase.from("order_items").insert(items);
    setPlacing(false);
    if (itemsErr) {
      toast.error(itemsErr.message);
      return;
    }
    setStage("confirmed");
    clearBag();
  };

  return (
    <PageShell>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 min-h-[60vh]">
        <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Bag</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl mb-2">
          {stage === "confirmed" ? (
            <>Shukran <span className="italic text-gold-gradient">~</span></>
          ) : stage === "checkout" ? (
            <>Andalusi <span className="italic text-gold-gradient">Checkout</span></>
          ) : (
            <>Your <span className="italic text-gold-gradient">Bag</span></>
          )}
        </h1>
        <GeometricBorder />

        {/* CONFIRMED */}
        {stage === "confirmed" && (
          <div className="neo mt-10 p-10 sm:p-16 text-center max-w-2xl mx-auto">
            <div className="neo-inset size-16 rounded-full grid place-items-center mx-auto mb-5">
              <SouqBag className="size-7 text-primary" />
            </div>
            <h2 className="font-display text-3xl mb-3">Your order is on its way</h2>
            <p className="text-sm text-muted-foreground mb-6">
              A confirmation has been sent to <span className="text-foreground">{form.email || "your inbox"}</span>.
              Each piece is hand-checked at our atelier before it ships.
            </p>
            <Link to="/" className="btn-gold inline-block px-6 py-3 text-xs uppercase tracking-widest font-semibold">
              Continue browsing
            </Link>
          </div>
        )}

        {/* EMPTY */}
        {stage !== "confirmed" && lines.length === 0 && (
          <div className="neo mt-10 p-10 sm:p-16 text-center max-w-xl mx-auto">
            <div className="neo-inset size-16 rounded-full grid place-items-center mx-auto mb-5">
              <SouqBag className="size-7 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl mb-2">Your bag is empty</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Wander the souq and add a piece that speaks to you.
            </p>
            <Link to="/" className="btn-gold inline-block px-6 py-3 text-xs uppercase tracking-widest font-semibold">
              Browse the Souq
            </Link>
          </div>
        )}

        {/* BAG / CHECKOUT */}
        {stage !== "confirmed" && lines.length > 0 && (
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-8">
            <div className="space-y-4">
              {stage === "bag" &&
                lines.map((l) => (
                  <article
                    key={`${l.id}-${l.size}`}
                    className="neo p-4 sm:p-5 flex flex-col sm:flex-row gap-4"
                  >
                    <Link
                      to="/product/$id"
                      params={{ id: l.id }}
                      className="neo-inset rounded-xl overflow-hidden size-full sm:size-28 shrink-0 aspect-square sm:aspect-auto"
                    >
                      <img src={l.product.img} alt={l.product.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link to="/product/$id" params={{ id: l.id }} className="font-display text-lg hover:text-primary">
                            {l.product.name}
                          </Link>
                          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
                            {l.product.category} · Size {l.size}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromBag(l.id, l.size)}
                          aria-label="Remove"
                          className="neo-sm p-2 hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                        <div className="neo-inset rounded-full flex items-center">
                          <button
                            onClick={() => updateBagItem(l.id, l.size, l.qty - 1)}
                            className="p-2.5 hover:text-primary"
                            aria-label="Decrease"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{l.qty}</span>
                          <button
                            onClick={() => updateBagItem(l.id, l.size, l.qty + 1)}
                            className="p-2.5 hover:text-primary"
                            aria-label="Increase"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <div className="text-lg font-semibold">€ {(l.product.price * l.qty).toLocaleString()}</div>
                      </div>
                    </div>
                  </article>
                ))}

              {stage === "checkout" && (
                <form onSubmit={onPlaceOrder} className="neo p-6 sm:p-8 space-y-5">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1">Step 1</div>
                    <h2 className="font-display text-2xl">Shipping details</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { k: "name", label: "Full name", type: "text", full: true },
                      { k: "email", label: "Email", type: "email", full: true },
                      { k: "address", label: "Address", type: "text", full: true },
                      { k: "city", label: "City", type: "text" },
                      { k: "zip", label: "Postal code", type: "text" },
                      { k: "country", label: "Country", type: "text", full: true },
                    ].map((f) => (
                      <label key={f.k} className={`block ${f.full ? "sm:col-span-2" : ""}`}>
                        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                          {f.label}
                        </span>
                        <input
                          required
                          type={f.type}
                          value={form[f.k]}
                          onChange={(e) => setForm((s) => ({ ...s, [f.k]: e.target.value }))}
                          className="mt-1.5 neo-inset rounded-full px-5 py-3 w-full text-sm bg-transparent outline-none"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border/60">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1">Step 2</div>
                    <h2 className="font-display text-2xl mb-4">Payment</h2>
                    <div className="neo-inset rounded-2xl p-5 text-sm text-muted-foreground">
                      A secure payment link will be emailed to you once your order is placed.
                      No card details are collected on this site.
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStage("bag")}
                      className="neo-pressable px-6 py-3.5 text-xs uppercase tracking-widest font-semibold"
                    >
                      ← Back to bag
                    </button>
                    <button
                      type="submit"
                      disabled={placing}
                      className="btn-gold flex-1 py-3.5 text-xs uppercase tracking-widest font-semibold disabled:opacity-60"
                    >
                      {placing ? "Placing…" : `Place order · € ${total.toLocaleString()}`}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Summary */}
            <aside className="neo p-6 self-start lg:sticky lg:top-32">
              <h2 className="font-display text-2xl mb-1">Summary</h2>
              <GeometricBorder />
              <dl className="text-sm space-y-3 mt-4">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium">€ {subtotal.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-medium">{shipping === 0 ? "Free" : `€ ${shipping}`}</dd>
                </div>
                <div className="flex justify-between pt-3 border-t border-border/60">
                  <dt className="font-display text-lg">Total</dt>
                  <dd className="font-display text-xl text-primary">€ {total.toLocaleString()}</dd>
                </div>
              </dl>

              {stage === "bag" && (
                <button
                  onClick={() => setStage("checkout")}
                  className="btn-gold w-full mt-6 py-3.5 text-xs uppercase tracking-widest font-semibold inline-flex items-center justify-center gap-2"
                >
                  <SouqBag className="size-4" /> Checkout
                </button>
              )}

              <div className="mt-6 space-y-2.5 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2"><Truck className="size-3.5 text-primary" /> Free worldwide over € 500</div>
                <div className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-primary" /> Insured & tracked shipping</div>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </PageShell>
  );
}
