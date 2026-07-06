// @ts-nocheck
import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronDown, SlidersHorizontal, X, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import { ProductCard } from "@/components/Products";
import { products, categoryTiles, filterOptions } from "@/lib/products";
import { useCustomProducts } from "@/lib/custom-products";
import { useFavorites } from "@/lib/store";
import { useRole } from "@/lib/use-role";
import { useAdminMode } from "@/lib/admin-mode";


export const Route = createFileRoute("/category/$category")({
  component: CategoryPage,
  loader: ({ params }) => {
    const match = categoryTiles.find(
      (c) => c.name.toLowerCase() === params.category.toLowerCase(),
    );
    if (!match) throw notFound();
    return { categoryName: match.name, blurb: match.blurb };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.categoryName ?? "Category"} — Souq Al Andalus` },
      {
        name: "description",
        content: `Browse our ${loaderData?.categoryName ?? ""} collection at Souq Al Andalus.`,
      },
    ],
  }),
  notFoundComponent: () => (
    <PageShell>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl mb-3">Category not found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn&apos;t find that section of the souq.
        </p>
        <Link to="/" className="btn-gold px-6 py-3 text-xs uppercase tracking-widest font-semibold inline-block">
          Back home
        </Link>
      </main>
      <Footer />
    </PageShell>
  ),
});

const priceBands = [
  { label: "Under € 1,000", min: 0, max: 1000 },
  { label: "€ 1,000 – 2,500", min: 1000, max: 2500 },
  { label: "€ 2,500 – 5,000", min: 2500, max: 5000 },
  { label: "€ 5,000+", min: 5000, max: Infinity },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price · Low to high" },
  { value: "price-desc", label: "Price · High to low" },
  { value: "rating", label: "Top rated" },
];

function FilterGroup({ title, options, selected, onToggle }) {
  return (
    <div className="border-b border-border/60 last:border-0 py-4">
      <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-3">{title}</div>
      <div className="flex flex-col gap-2">
        {options.map((o) => {
          const checked = selected.includes(o);
          return (
            <label key={o} className="flex items-center gap-2.5 text-sm cursor-pointer group">
              <span
                className={`size-4 rounded grid place-items-center transition-colors ${
                  checked ? "bg-foreground" : "neo-inset"
                }`}
              >
                {checked && <span className="size-1.5 bg-background rounded-sm" />}
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => onToggle(o)}
              />
              <span className="text-foreground/80 group-hover:text-foreground">{o}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function CategoryPage() {
  const { categoryName, blurb } = Route.useLoaderData();
  const favs = useFavorites();
  const custom = useCustomProducts();
  const { isAdmin } = useRole();
  const adminMode = useAdminMode();

  const base = useMemo(
    () => [...custom, ...products].filter((p) => p.category === categoryName),
    [categoryName, custom],
  );


  const [styleSel, setStyleSel] = useState([]);
  const [materialSel, setMaterialSel] = useState([]);
  const [occasionSel, setOccasionSel] = useState([]);
  const [priceSel, setPriceSel] = useState([]);
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggle = (setter) => (val) =>
    setter((cur) => (cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val]));

  const filtered = useMemo(() => {
    let list = base;
    if (styleSel.length) list = list.filter((p) => styleSel.includes(p.style));
    if (materialSel.length) list = list.filter((p) => materialSel.includes(p.material));
    if (occasionSel.length) list = list.filter((p) => occasionSel.includes(p.occasion));
    if (priceSel.length) {
      const bands = priceBands.filter((b) => priceSel.includes(b.label));
      list = list.filter((p) => bands.some((b) => p.price >= b.min && p.price < b.max));
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [base, styleSel, materialSel, occasionSel, priceSel, sort]);

  const activeCount =
    styleSel.length + materialSel.length + occasionSel.length + priceSel.length;

  const clearAll = () => {
    setStyleSel([]);
    setMaterialSel([]);
    setOccasionSel([]);
    setPriceSel([]);
  };

  const FilterPanel = (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="font-display text-lg">Filters</div>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
            Clear ({activeCount})
          </button>
        )}
      </div>
      <FilterGroup title="Style" options={filterOptions.Style} selected={styleSel} onToggle={toggle(setStyleSel)} />
      <FilterGroup title="Material" options={filterOptions.Material} selected={materialSel} onToggle={toggle(setMaterialSel)} />
      <FilterGroup title="Occasion" options={filterOptions.Occasion} selected={occasionSel} onToggle={toggle(setOccasionSel)} />
      <FilterGroup title="Price" options={priceBands.map((b) => b.label)} selected={priceSel} onToggle={toggle(setPriceSel)} />
    </div>
  );

  return (
    <PageShell>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 min-h-[60vh]">
        {/* Breadcrumb + heading */}
        <div className="mb-6 sm:mb-10">
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{categoryName}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl">
            <span className="italic text-gold-gradient">{categoryName}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">{blurb}</p>
        </div>

        {/* Toolbar — mobile filter trigger + sort */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden neo-pressable px-4 py-2.5 text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
          >
            <SlidersHorizontal className="size-3.5" />
            Filters {activeCount > 0 && <span className="bg-foreground text-background rounded-full px-1.5 text-[10px]">{activeCount}</span>}
          </button>
          <div className="text-xs text-muted-foreground hidden lg:block">
            {filtered.length} of {base.length} pieces
          </div>
          <div className="relative ml-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="neo-inset appearance-none pl-4 pr-9 py-2.5 text-xs uppercase tracking-widest rounded-full bg-transparent cursor-pointer focus:outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Desktop filters */}
          <aside className="hidden lg:block neo p-6 self-start sticky top-32">
            {FilterPanel}
          </aside>

          {/* Grid */}
          <div>
            {filtered.length === 0 ? (
              <div className="neo p-12 text-center">
                <h3 className="font-display text-2xl mb-2">No matches</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try clearing a filter to widen your search.
                </p>
                {activeCount > 0 && (
                  <button onClick={clearAll} className="btn-gold px-5 py-2.5 text-xs uppercase tracking-widest font-semibold">
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filtered.map((p) => (
                  <ProductCard key={p.id} p={p} favorited={favs.includes(p.id)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile filter drawer */}
      <div
        onClick={() => setFiltersOpen(false)}
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity ${
          filtersOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[320px] max-w-[85vw] bg-background shadow-2xl lg:hidden transition-transform duration-300 overflow-y-auto ${
          filtersOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 sticky top-0 bg-background">
          <div className="font-display text-lg">Filters</div>
          <button onClick={() => setFiltersOpen(false)} className="neo-sm p-2" aria-label="Close filters">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-5">{FilterPanel}</div>
        <div className="p-5 sticky bottom-0 bg-background border-t border-border/60">
          <button onClick={() => setFiltersOpen(false)} className="btn-gold w-full py-3 text-xs uppercase tracking-widest font-semibold">
            Show {filtered.length} pieces
          </button>
        </div>
      </aside>

      <Footer />
    </PageShell>
  );
}
