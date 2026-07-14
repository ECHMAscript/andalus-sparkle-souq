// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Boxes, Search, PlusCircle, Image as ImageIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import { getAllProducts } from "@/lib/products";
import { useCustomProducts } from "@/lib/custom-products";
import { useRole } from "@/lib/use-role";

export const Route = createFileRoute("/admin/products/")({
  component: StoreProductsPage,
  head: () => ({
    meta: [
      { title: "Store Products — Admin · Souq Al Andalus" },
      { name: "description", content: "Every piece in the catalog with live stats and edit controls." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function StoreProductsPage() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useRole();
  // Subscribe so the list reflects DB-backed products immediately.
  useCustomProducts();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/" });
  }, [isAdmin, loading, navigate]);

  const all = getAllProducts();
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return all;
    return all.filter(
      (p) =>
        p.id.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term),
    );
  }, [q, all]);

  return (
    <PageShell>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="neo-sm size-11 grid place-items-center">
              <Boxes className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl text-gold-gradient leading-none">Store Products</h1>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
                Click a piece to view stats and edit its details
              </p>
            </div>
          </div>
          <Link
            to="/admin/products/new"
            className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest font-semibold"
          >
            <PlusCircle className="size-4" /> Add Product
          </Link>
        </div>

        <div className="neo-inset flex items-center gap-3 px-5 py-3 rounded-full mb-6">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, id, or category…"
            className="bg-transparent flex-1 text-sm outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
            {results.length} / {all.length}
          </span>
        </div>

        <div className="neo rounded-3xl overflow-hidden bg-card">
          <div className="grid grid-cols-[72px_1fr_120px_100px_100px] gap-3 px-4 py-3 border-b border-border/60 text-[10px] uppercase tracking-widest text-muted-foreground">
            <div></div>
            <div>Name / ID</div>
            <div>Category</div>
            <div className="text-right">Price (€)</div>
            <div className="text-right">Stock</div>
          </div>
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No pieces match "{q}"</div>
          ) : (
            <ul className="divide-y divide-border/40">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/admin/products/$id"
                    params={{ id: p.id }}
                    className="grid grid-cols-[72px_1fr_120px_100px_100px] gap-3 px-4 py-3 items-center hover:bg-muted/40 transition-colors"
                  >
                    <div className="size-16 rounded-lg overflow-hidden neo-sm grid place-items-center bg-background/40">
                      {p.img ? (
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="size-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-[11px] font-mono text-muted-foreground truncate">{p.id}</div>
                    </div>
                    <div className="text-xs">{p.category}</div>
                    <div className="text-sm font-semibold text-right">{Number(p.price).toLocaleString()}</div>
                    <div
                      className={`text-xs text-right font-semibold ${
                        p.stock === 0
                          ? "text-destructive"
                          : p.stock <= 5
                            ? "text-primary"
                            : "text-muted-foreground"
                      }`}
                    >
                      {p.stock === 0 ? "Out" : p.stock}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </PageShell>
  );
}
