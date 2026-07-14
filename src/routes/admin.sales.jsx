// @ts-nocheck
import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TrendingUp, Loader2, DollarSign, ShoppingBag, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/lib/use-role";

export const Route = createFileRoute("/admin/sales")({
  component: SalesPage,
  head: () => ({
    meta: [
      { title: "Sales — Admin · Souq Al Andalus" },
      { name: "description", content: "Track revenue and top-selling pieces." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function SalesPage() {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useRole();
  const [range, setRange] = useState("30d");
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && !isAdmin) navigate({ to: "/" });
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      let oq = supabase.from("orders").select("id, total, subtotal, shipping, created_at, status").neq("status", "cancelled");
      if (range !== "all") {
        const hours = range === "24h" ? 24 : range === "7d" ? 24 * 7 : 24 * 30;
        const since = new Date(Date.now() - hours * 3600 * 1000).toISOString();
        oq = oq.gte("created_at", since);
      }
      const { data: os } = await oq.limit(2000);
      const ids = (os || []).map((o) => o.id);
      let its = [];
      if (ids.length) {
        const { data } = await supabase.from("order_items").select("product_id, product_name, qty, unit_price, order_id").in("order_id", ids);
        its = data || [];
      }
      if (!cancelled) { setOrders(os || []); setItems(its); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [isAdmin, range]);

  const revenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const unitsSold = items.reduce((s, i) => s + i.qty, 0);

  const byProduct = {};
  for (const it of items) {
    const k = it.product_id;
    if (!byProduct[k]) byProduct[k] = { id: k, name: it.product_name, qty: 0, revenue: 0 };
    byProduct[k].qty += it.qty;
    byProduct[k].revenue += Number(it.unit_price) * it.qty;
  }
  const topProducts = Object.values(byProduct).sort((a, b) => b.revenue - a.revenue).slice(0, 20);
  const maxRev = Math.max(1, ...topProducts.map((p) => p.revenue));

  return (
    <PageShell>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="neo-sm size-11 grid place-items-center">
            <TrendingUp className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-gold-gradient leading-none">Sales</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">Revenue & top pieces</p>
          </div>
        </div>

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
            >{o.l}</button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          {[
            { icon: DollarSign, label: "Revenue", value: `€ ${revenue.toLocaleString()}` },
            { icon: ShoppingBag, label: "Orders", value: orders.length.toLocaleString() },
            { icon: Package, label: "Units sold", value: unitsSold.toLocaleString() },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="neo rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <Icon className="size-3.5 text-primary" /> {label}
              </div>
              <div className="font-display text-2xl sm:text-3xl mt-2">{value}</div>
            </div>
          ))}
        </div>

        <div className="neo rounded-3xl p-4 sm:p-6 bg-card">
          <h2 className="font-display text-xl mb-4">Top sellers</h2>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              <Loader2 className="size-5 animate-spin mx-auto mb-2" /> Loading…
            </div>
          ) : topProducts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">No sales in this range yet.</div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p) => (
                <div key={p.id} className="grid grid-cols-[1fr_auto] gap-3 items-center">
                  <div className="min-w-0">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="truncate font-medium">{p.name}</span>
                      <span className="text-muted-foreground shrink-0">× {p.qty}</span>
                    </div>
                    <div className="neo-inset rounded-full h-3 overflow-hidden relative">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: `${(p.revenue / maxRev) * 100}%`,
                          background: "linear-gradient(90deg, oklch(0.75 0.14 75), oklch(0.55 0.14 75))",
                        }}
                      />
                    </div>
                  </div>
                  <div className="font-display text-lg text-gold-gradient w-24 text-right">€ {p.revenue.toLocaleString()}</div>
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
