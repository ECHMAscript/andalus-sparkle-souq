// @ts-nocheck
import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ClipboardList, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/lib/use-role";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersPage,
  head: () => ({
    meta: [
      { title: "Orders — Admin · Souq Al Andalus" },
      { name: "description", content: "Track customer orders." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

function OrdersPage() {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useRole();
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState({}); // order_id -> items[]
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!roleLoading && !isAdmin) navigate({ to: "/" });
  }, [isAdmin, roleLoading, navigate]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) toast.error(error.message);
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const toggle = async (id) => {
    setExpanded(expanded === id ? null : id);
    if (!items[id]) {
      const { data } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", id);
      setItems((s) => ({ ...s, [id]: data || [] }));
    }
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setOrders((s) => s.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success("Status updated.");
  };

  return (
    <PageShell>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="neo-sm size-11 grid place-items-center">
            <ClipboardList className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-gold-gradient leading-none">Orders</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
              {orders.length} order{orders.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            <Loader2 className="size-5 animate-spin mx-auto mb-2" /> Loading orders…
          </div>
        ) : orders.length === 0 ? (
          <div className="neo rounded-3xl p-10 text-center text-muted-foreground">No orders yet.</div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="neo rounded-2xl bg-card overflow-hidden">
                <button
                  onClick={() => toggle(o.id)}
                  className="w-full p-4 sm:p-5 flex items-center gap-4 text-left hover:bg-muted/30"
                >
                  {expanded === o.id ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{o.full_name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {o.email} · {new Date(o.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-display text-lg text-gold-gradient">€ {Number(o.total).toLocaleString()}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">#{o.id.slice(0, 8)}</div>
                  </div>
                  <select
                    value={o.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="neo-inset rounded-full px-3 py-1.5 text-[11px] uppercase tracking-widest bg-transparent outline-none"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </button>
                {expanded === o.id && (
                  <div className="border-t border-border/60 p-4 sm:p-5 space-y-3">
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Ship to</div>
                    <div className="text-sm">
                      {o.address}, {o.city} {o.postal_code || ""}, {o.country}
                    </div>
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground pt-2">Items</div>
                    <div className="space-y-2">
                      {(items[o.id] || []).map((it) => (
                        <div key={it.id} className="flex items-center justify-between text-sm neo-inset rounded-xl px-3 py-2">
                          <div>
                            <span className="font-medium">{it.product_name}</span>
                            {it.size && <span className="text-muted-foreground"> · Size {it.size}</span>}
                            <span className="text-muted-foreground"> · × {it.qty}</span>
                          </div>
                          <div>€ {Number(it.unit_price * it.qty).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-border/40">
                      <span className="text-muted-foreground">Subtotal / Shipping</span>
                      <span>€ {Number(o.subtotal).toLocaleString()} / € {Number(o.shipping).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </PageShell>
  );
}
