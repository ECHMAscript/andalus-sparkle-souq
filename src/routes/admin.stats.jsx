// @ts-nocheck
import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BarChart3, Eye, ShoppingBag, Heart, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/lib/use-role";

export const Route = createFileRoute("/admin/stats")({
  component: StatsPage,
  head: () => ({
    meta: [
      { title: "Hot Items — Admin · Souq Al Andalus" },
      { name: "description", content: "Track which pieces customers browse, save, and add to their bag." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function StatsPage() {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useRole();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d"); // '24h' | '7d' | '30d' | 'all'

  useEffect(() => {
    if (!roleLoading && !isAdmin) navigate({ to: "/" });
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      let q = supabase.from("product_events").select("product_id, product_name, event_type, created_at");
      if (range !== "all") {
        const hours = range === "24h" ? 24 : range === "7d" ? 24 * 7 : 24 * 30;
        const since = new Date(Date.now() - hours * 3600 * 1000).toISOString();
        q = q.gte("created_at", since);
      }
      const { data } = await q.limit(5000);
      if (!cancelled) { setEvents(data || []); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [isAdmin, range]);

  // Aggregate by product
  const byProduct = {};
  for (const e of events) {
    const key = e.product_id;
    if (!byProduct[key]) byProduct[key] = { id: key, name: e.product_name, view: 0, cart: 0, favorite: 0 };
    byProduct[key][e.event_type] = (byProduct[key][e.event_type] || 0) + 1;
  }
  const rows = Object.values(byProduct)
    .map((r) => ({ ...r, total: r.view + r.cart * 3 + r.favorite * 2 }))
    .sort((a, b) => b.total - a.total);

  const maxViews = Math.max(1, ...rows.map((r) => r.view));
  const totals = rows.reduce(
    (a, r) => ({ view: a.view + r.view, cart: a.cart + r.cart, favorite: a.favorite + r.favorite }),
    { view: 0, cart: 0, favorite: 0 },
  );

  return (
    <PageShell>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="neo-sm size-11 grid place-items-center">
            <BarChart3 className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-gold-gradient leading-none">Hot Items</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
              What the souq is browsing right now
            </p>
          </div>
        </div>

        {/* Range selector */}
        <div className="neo rounded-full p-1 inline-flex gap-1 mb-6">
          {[
            { k: "24h", l: "24 hours" },
            { k: "7d", l: "7 days" },
            { k: "30d", l: "30 days" },
            { k: "all", l: "All time" },
          ].map((o) => (
            <button
              key={o.k}
              onClick={() => setRange(o.k)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                range === o.k ? "neo-pressable text-foreground font-semibold" : "text-muted-foreground"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>

        {/* Totals */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          {[
            { icon: Eye, label: "Views (>10s)", value: totals.view, color: "text-primary" },
            { icon: ShoppingBag, label: "Added to bag", value: totals.cart, color: "text-foreground" },
            { icon: Heart, label: "Favorited", value: totals.favorite, color: "text-destructive" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="neo rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <Icon className={`size-3.5 ${color}`} /> {label}
              </div>
              <div className="font-display text-3xl mt-2">{value.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="neo rounded-3xl p-4 sm:p-6 bg-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">Interest by piece</h2>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Ranked by weighted score (view + 2×fav + 3×cart)
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              <Loader2 className="size-5 animate-spin mx-auto mb-2" /> Loading…
            </div>
          ) : rows.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No interest tracked in this range yet. Browse a few products for 10+ seconds and check back.
            </div>
          ) : (
            <div className="space-y-3">
              {rows.slice(0, 20).map((r) => (
                <div key={r.id} className="grid grid-cols-[1fr_auto] gap-3 items-center">
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <Link
                        to="/product/$id"
                        params={{ id: r.id }}
                        className="text-sm font-medium truncate hover:text-primary"
                      >
                        {r.name}
                      </Link>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">
                        {r.id}
                      </span>
                    </div>
                    <div className="neo-inset rounded-full h-3 overflow-hidden relative">
                      {/* views bar */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: `${(r.view / maxViews) * 100}%`,
                          background: "linear-gradient(90deg, oklch(0.75 0.14 75), oklch(0.55 0.14 75))",
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Eye className="size-3 text-primary" /> {r.view}</span>
                      <span className="inline-flex items-center gap-1"><ShoppingBag className="size-3" /> {r.cart}</span>
                      <span className="inline-flex items-center gap-1"><Heart className="size-3 text-destructive" /> {r.favorite}</span>
                    </div>
                  </div>
                  <div className="font-display text-lg text-gold-gradient w-14 text-right">{r.total}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </PageShell>
  );
}
