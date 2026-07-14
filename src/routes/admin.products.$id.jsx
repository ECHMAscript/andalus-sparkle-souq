// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Boxes,
  ArrowLeft,
  Save,
  Loader2,
  ShoppingBag,
  Eye,
  Image as ImageIcon,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { findProductById } from "@/lib/products";
import { useCustomProducts, updateCustomProduct } from "@/lib/custom-products";
import { useRole } from "@/lib/use-role";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products/$id")({
  component: ProductAdminPage,
  head: () => ({
    meta: [
      { title: "Product Details — Admin · Souq Al Andalus" },
      { name: "description", content: "Live product stats, purchase history, and editable details." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function ProductAdminPage() {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useRole();
  const { id } = Route.useParams();
  const custom = useCustomProducts();
  const p = findProductById(id);
  const isCustomPiece = custom.some((x) => x.id === id);

  const [range, setRange] = useState("30d"); // 7d | 30d | 90d | all
  const [purchases, setPurchases] = useState([]);
  const [views, setViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastBought, setLastBought] = useState(null);
  const [totalSold, setTotalSold] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    if (!roleLoading && !isAdmin) navigate({ to: "/" });
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (!isAdmin || !p) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const since =
        range === "all"
          ? null
          : new Date(
              Date.now() - (range === "7d" ? 7 : range === "30d" ? 30 : 90) * 86_400_000,
            ).toISOString();

      let itemsQ = supabase
        .from("order_items")
        .select("qty, created_at")
        .eq("product_id", p.id)
        .order("created_at", { ascending: true });
      if (since) itemsQ = itemsQ.gte("created_at", since);

      let viewsQ = supabase
        .from("product_events")
        .select("created_at")
        .eq("product_id", p.id)
        .eq("event_type", "view")
        .order("created_at", { ascending: true });
      if (since) viewsQ = viewsQ.gte("created_at", since);

      const [{ data: itemsData }, { data: viewsData }] = await Promise.all([itemsQ, viewsQ]);
      if (cancelled) return;

      const items = itemsData || [];
      const vs = viewsData || [];
      setTotalSold(items.reduce((a, r) => a + (r.qty || 0), 0));
      setTotalViews(vs.length);
      setLastBought(items.length ? items[items.length - 1].created_at : null);

      // Bucket by day (YYYY-MM-DD)
      const bucket = (rows, valueOf) => {
        const map = new Map();
        for (const r of rows) {
          const day = r.created_at.slice(0, 10);
          map.set(day, (map.get(day) || 0) + valueOf(r));
        }
        return Array.from(map.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, value]) => ({ date, value }));
      };
      setPurchases(bucket(items, (r) => r.qty || 0));
      setViews(bucket(vs, () => 1));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, p?.id, range]);

  if (!p) {
    return (
      <PageShell>
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="font-display text-3xl text-gold-gradient">Piece not found</h1>
          <Link to="/admin/products" className="btn-gold inline-flex mt-6 px-5 py-2.5 text-xs uppercase tracking-widest font-semibold">
            Back to store products
          </Link>
        </main>
        <Footer />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary mb-4"
        >
          <ArrowLeft className="size-3.5" /> Store Products
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="neo-sm size-11 grid place-items-center">
            <Boxes className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-gold-gradient leading-none">{p.name}</h1>
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mt-1">{p.id}</p>
          </div>
        </div>

        {/* Top: image + stats */}
        <section className="grid md:grid-cols-[240px_1fr] gap-6 mb-8">
          <div className="neo-inset rounded-2xl overflow-hidden aspect-square bg-background/40 grid place-items-center">
            {p.img ? (
              <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="size-8 text-muted-foreground" />
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Price" value={`€ ${Number(p.price).toLocaleString()}`} />
            <Stat
              label="In stock"
              value={p.stock === 0 ? "Out" : p.stock}
              tone={p.stock === 0 ? "bad" : p.stock <= 5 ? "warn" : "ok"}
            />
            <Stat label="Sold (range)" value={totalSold} icon={ShoppingBag} />
            <Stat label="Views (range)" value={totalViews} icon={Eye} />
            <Stat label="Rating" value={`${Number(p.rating || 0).toFixed(1)} ★`} />
            <Stat label="Reviews" value={p.reviews || 0} />
            <Stat label="Category" value={p.category} />
            <Stat
              label="Last bought"
              value={lastBought ? new Date(lastBought).toLocaleDateString() : "—"}
            />
          </div>
        </section>

        {/* Range selector */}
        <div className="neo rounded-full p-1 inline-flex gap-1 mb-4">
          {[
            { k: "7d", l: "7 days" },
            { k: "30d", l: "30 days" },
            { k: "90d", l: "90 days" },
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

        {/* Charts */}
        <section className="grid md:grid-cols-2 gap-4 mb-8">
          <ChartCard
            title="Purchases over time"
            hint="Units bought per day (from order history)"
            data={purchases}
            color="oklch(0.55 0.14 75)"
            loading={loading}
            emptyLabel="No purchases in this range yet."
          />
          <ChartCard
            title="Views over time"
            hint="Unique 10-second dwell events per day"
            data={views}
            color="oklch(0.45 0.12 160)"
            loading={loading}
            emptyLabel="No views tracked in this range yet."
          />
        </section>

        {/* Editable fields */}
        <EditPanel product={p} canEdit={isCustomPiece} />
      </main>
      <Footer />
    </PageShell>
  );
}

function Stat({ label, value, icon: Icon, tone }) {
  const toneCls =
    tone === "bad" ? "text-destructive" : tone === "warn" ? "text-primary" : "text-foreground";
  return (
    <div className="neo rounded-2xl p-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {Icon ? <Icon className="size-3.5" /> : null}
        {label}
      </div>
      <div className={`font-display text-2xl mt-1 ${toneCls}`}>{value}</div>
    </div>
  );
}

function ChartCard({ title, hint, data, color, loading, emptyLabel }) {
  return (
    <div className="neo rounded-3xl p-4 sm:p-5 bg-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg">{title}</h3>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{hint}</span>
      </div>
      <div className="neo-inset rounded-2xl p-3 h-64">
        {loading ? (
          <div className="h-full grid place-items-center text-muted-foreground text-sm">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-full grid place-items-center text-muted-foreground text-xs">
            {emptyLabel}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.02 75 / 0.15)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "oklch(0.15 0.02 75)", border: "none", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "oklch(0.9 0.02 75)" }}
              />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function EditPanel({ product, canEdit }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price ?? ""));
  const [wasVal, setWasVal] = useState(product.was != null ? String(product.was) : "");
  const [tag, setTag] = useState(product.tag ?? "");
  const [inStock, setInStock] = useState((product.stock ?? 0) > 0);
  const [stockCount, setStockCount] = useState(String(Math.max(product.stock ?? 0, 1)));
  const [description, setDescription] = useState(product.description ?? "");
  const [saving, setSaving] = useState(false);

  // Re-sync when the product changes (e.g. after save).
  useEffect(() => {
    setName(product.name);
    setPrice(String(product.price ?? ""));
    setWasVal(product.was != null ? String(product.was) : "");
    setTag(product.tag ?? "");
    setInStock((product.stock ?? 0) > 0);
    setStockCount(String(Math.max(product.stock ?? 0, 1)));
    setDescription(product.description ?? "");
  }, [product.id, product.name, product.price, product.was, product.tag, product.stock, product.description]);

  const onSale = wasVal !== "" && Number(wasVal) > Number(price);

  const save = async () => {
    if (!canEdit) return;
    const priceNum = Number(price);
    if (!name.trim() || !(priceNum > 0)) {
      toast.error("Name and a valid price are required.");
      return;
    }
    setSaving(true);
    try {
      const stockNum = inStock ? Math.max(0, Math.floor(Number(stockCount) || 0)) : 0;
      const wasNum = wasVal === "" ? null : Number(wasVal);
      await updateCustomProduct(product.id, {
        name: name.trim(),
        price: priceNum,
        was: wasNum,
        tag: tag.trim() || null,
        stock: stockNum,
        description,
      });
      toast.success("Product updated.");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="neo rounded-3xl p-5 sm:p-7 bg-card">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl">Edit details</h2>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">
            Changes go live immediately across the store
          </p>
        </div>
        {onSale && canEdit && (
          <span className="px-3 py-1 rounded-full bg-destructive text-white text-[11px] uppercase tracking-widest font-semibold">
            On sale
          </span>
        )}
      </div>

      {!canEdit && (
        <div className="neo-inset rounded-2xl p-4 mb-5 flex items-start gap-3 text-xs text-muted-foreground">
          <Info className="size-4 text-primary shrink-0 mt-0.5" />
          <div>
            This is a showcase piece bundled with the app and can't be edited from here.
            Pieces added via <span className="font-semibold text-foreground">Add Product</span> are fully editable.
          </div>
        </div>
      )}

      <fieldset disabled={!canEdit || saving} className="grid gap-5 disabled:opacity-70">
        <FieldRow label="Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="neo-inset px-4 py-3 rounded-xl bg-transparent w-full text-sm outline-none"
          />
        </FieldRow>

        <div className="grid sm:grid-cols-3 gap-4">
          <FieldRow label="Price (€)">
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="neo-inset px-4 py-3 rounded-xl bg-transparent w-full text-sm outline-none"
            />
          </FieldRow>
          <FieldRow label="Was (for sale)" hint="Leave blank if not on sale">
            <input
              type="number"
              min="0"
              value={wasVal}
              onChange={(e) => setWasVal(e.target.value)}
              placeholder="—"
              className="neo-inset px-4 py-3 rounded-xl bg-transparent w-full text-sm outline-none"
            />
          </FieldRow>
          <FieldRow label="Tag" hint="e.g. New, Bestseller, -20%">
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="—"
              className="neo-inset px-4 py-3 rounded-xl bg-transparent w-full text-sm outline-none"
            />
          </FieldRow>
        </div>

        <FieldRow label="Availability">
          <div className="flex flex-wrap items-center gap-3">
            <label className="neo-sm inline-flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="accent-primary"
              />
              <span>In stock</span>
            </label>
            {inStock ? (
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Quantity</span>
                <input
                  type="number"
                  min="1"
                  value={stockCount}
                  onChange={(e) => setStockCount(e.target.value)}
                  className="neo-inset px-4 py-2 rounded-xl bg-transparent w-28 text-sm outline-none"
                />
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic">Will show as sold out.</span>
            )}
          </div>
        </FieldRow>

        <FieldRow label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="neo-inset px-4 py-3 rounded-xl bg-transparent w-full text-sm outline-none resize-none"
          />
        </FieldRow>

        <div>
          <button
            type="button"
            onClick={save}
            disabled={!canEdit || saving}
            className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </fieldset>
    </section>
  );
}

function FieldRow({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-primary">{label}</div>
        {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
      </div>
      {children}
    </div>
  );
}
