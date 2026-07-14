// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PlusCircle, Trash2, Plus, Star, Heart, Truck, ShieldCheck, RefreshCw, X, Upload, Image as ImageIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import SouqBag from "@/components/SouqBag";
import { categoryTiles, sizeGuides, filterOptions } from "@/lib/products";
import { addCustomProduct, slugify } from "@/lib/custom-products";
import { useRole } from "@/lib/use-role";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products/new")({
  component: AddProductPage,
  validateSearch: (s) => ({
    category: typeof s.category === "string" ? s.category : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Add Product — Admin · Souq Al Andalus" },
      { name: "description", content: "Publish a new piece to the catalog." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

// Downscale uploads before we store them. Full-resolution phone photos
// become multi-MB base64 strings that make the zoom lens re-decode a huge
// bitmap on every mousemove — visible as heavy lag on the product page.
// Re-encoding to a ~1400px JPEG at quality 0.85 keeps the piece looking
// crisp while shrinking each image by 10–50×.
const MAX_EDGE = 1400;
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        // JPEG for photos — dramatically smaller than PNG for jewelry shots.
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}


function AddProductPage() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useRole();
  const { category: initialCategory } = Route.useSearch();

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/" });
  }, [isAdmin, loading, navigate]);

  const categories = categoryTiles.map((c) => c.name);
  const [mainImg, setMainImg] = useState("");
  const [extraImgs, setExtraImgs] = useState([]); // data URLs
  const [name, setName] = useState("");
  const [category, setCategory] = useState(
    initialCategory && categories.includes(initialCategory) ? initialCategory : categories[0],
  );
  const [price, setPrice] = useState("");
  const [tag, setTag] = useState("");
  const [inStock, setInStock] = useState(true);
  const [stockCount, setStockCount] = useState("10");
  const [style, setStyle] = useState(filterOptions.Style[0]);
  const [material, setMaterial] = useState(filterOptions.Material[0]);
  const [description, setDescription] = useState("");

  // Sizes: defaults come from sizeGuides for the selected category. Admin
  // can delete any pill to remove it from the final product's size selector.
  // Earrings don't have sizes — skip the default S/M/L pills for that category.
  const defaultSizesFor = (cat) => (cat === "Earrings" ? [] : sizeGuides[cat] ?? []);
  const [sizes, setSizes] = useState(() => defaultSizesFor(category));
  useEffect(() => {
    setSizes(defaultSizesFor(category));
  }, [category]);

  const removeSize = (s) => setSizes((cur) => cur.filter((x) => x !== s));

  const onPickMain = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setMainImg(await fileToDataUrl(f));
    e.target.value = "";
  };
  const onPickExtras = async (e) => {
    const files = Array.from(e.target.files ?? []);
    const urls = await Promise.all(files.map(fileToDataUrl));
    setExtraImgs((cur) => [...cur, ...urls]);
    e.target.value = "";
  };
  const removeExtra = (i) => setExtraImgs((cur) => cur.filter((_, idx) => idx !== i));

  // Live preview product shape — mirrors the schema used by ProductCard and
  // the product detail page so the previews look pixel-accurate.
  const preview = useMemo(() => {
    const priceNum = Number(price) || 0;
    const stockNum = inStock ? Math.max(0, Math.floor(Number(stockCount) || 0)) : 0;
    return {
      id: slugify(name) || "new-piece",
      name: name || "Untitled Piece",
      category,
      style,
      material,
      occasion: "Everyday",
      price: priceNum,
      was: null,
      img: mainImg || "",
      images: mainImg ? [mainImg, ...extraImgs] : extraImgs,
      tag: tag || null,
      stock: stockNum,
      rating: 0,
      reviews: 0,
      description: description || "A newly-listed piece from the atelier.",
    };
  }, [name, category, style, material, price, mainImg, extraImgs, tag, description, inStock, stockCount]);

  const [publishing, setPublishing] = useState(false);
  const canPublish = mainImg && name.trim() && Number(price) > 0 && !publishing;

  const handlePublish = async () => {
    if (!canPublish) {
      toast.error("Please add an image, a name, and a price.");
      return;
    }
    const id = `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`;
    setPublishing(true);
    try {
      await addCustomProduct({ ...preview, id, sizes });
      toast.success(`${preview.name} added to ${category}.`);
      navigate({ to: "/category/$category", params: { category: category.toLowerCase() } });
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Couldn't publish the piece. Please try again.");
      setPublishing(false);
    }
  };


  return (
    <PageShell>
      <Navbar />
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="neo-sm size-11 grid place-items-center">
            <PlusCircle className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-gold-gradient leading-none">Add Product</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
              Everything you type appears instantly on the right
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* LEFT: form */}
          <section className="neo rounded-3xl bg-card p-5 sm:p-7 flex flex-col gap-6">
            {/* Images */}
            <Field label="Main image">
              <div className="flex gap-3 items-start">
                <label className="neo-inset aspect-square w-32 rounded-xl grid place-items-center overflow-hidden cursor-pointer group relative">
                  {mainImg ? (
                    <img src={mainImg} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <Upload className="size-5" />
                      <span className="text-[10px] uppercase tracking-widest">Upload</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={onPickMain} className="sr-only" />
                </label>
                <div className="flex-1 text-xs text-muted-foreground leading-relaxed">
                  Square images look best. This is the hero shot users see in the
                  card and at the top of the product page.
                </div>
              </div>
            </Field>

            <Field label="Gallery images (optional)" hint="Extra shots appear as thumbnails under the main image.">
              <div className="flex flex-wrap gap-3">
                {extraImgs.map((src, i) => (
                  <div key={i} className="relative neo-inset size-20 rounded-lg overflow-hidden group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExtra(i)}
                      className="absolute top-1 right-1 size-5 grid place-items-center rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                <label className="neo-sm size-20 rounded-lg grid place-items-center cursor-pointer text-muted-foreground hover:text-primary">
                  <Plus className="size-5" />
                  <input type="file" accept="image/*" multiple onChange={onPickExtras} className="sr-only" />
                </label>
              </div>
            </Field>

            <Field label="Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Zahra Filigree Ring"
                className="neo-inset px-4 py-3 rounded-xl bg-transparent w-full text-sm outline-none"
              />
            </Field>

            <Field label="Category">
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                      category === c ? "btn-gold font-semibold" : "neo-sm"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Price (€)">
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1240"
                  className="neo-inset px-4 py-3 rounded-xl bg-transparent w-full text-sm outline-none"
                />
              </Field>
              <Field label="Tag" hint="e.g. New, Bestseller, -20%, Limited">
                <input
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="khaleeji-bracelet"
                  className="neo-inset px-4 py-3 rounded-xl bg-transparent w-full text-sm outline-none"
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Style">
                <select value={style} onChange={(e) => setStyle(e.target.value)} className="neo-inset px-4 py-3 rounded-xl bg-transparent w-full text-sm outline-none">
                  {filterOptions.Style.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Material">
                <select value={material} onChange={(e) => setMaterial(e.target.value)} className="neo-inset px-4 py-3 rounded-xl bg-transparent w-full text-sm outline-none">
                  {filterOptions.Material.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="A short story behind the piece…"
                className="neo-inset px-4 py-3 rounded-xl bg-transparent w-full text-sm outline-none resize-none"
              />
            </Field>

            <Field
              label="Available sizes"
              hint={`Defaults for ${category}. Delete any you don't offer — they won't appear on the product page.`}
            >
              {sizes.length === 0 ? (
                <div className="text-xs text-muted-foreground italic">No sizes will be shown for this piece.</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <div key={s} className="relative neo-sm rounded-full pl-4 pr-8 py-2 text-sm">
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSize(s)}
                        aria-label={`Remove size ${s}`}
                        className="absolute top-1 right-1 size-5 grid place-items-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Field>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handlePublish}
                disabled={!canPublish}
                className="btn-gold flex-1 py-3.5 text-xs uppercase tracking-widest font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishing ? "Publishing…" : `Publish to ${category}`}
              </button>
              <Link
                to="/category/$category"
                params={{ category: category.toLowerCase() }}
                className="neo-pressable px-5 py-3.5 text-xs uppercase tracking-widest font-semibold"
              >
                Cancel
              </Link>
            </div>
          </section>

          {/* RIGHT: previews */}
          <section className="flex flex-col gap-6">
            <PreviewFrame label="Card preview" hint="How the piece looks in the catalog grid">
              <div className="max-w-[280px] mx-auto">
                <CardPreview p={preview} />
              </div>
            </PreviewFrame>

            <PreviewFrame label="Product page preview" hint="What buyers see when they open it">
              <DetailPreview p={preview} sizes={sizes} />
            </PreviewFrame>
          </section>
        </div>
      </main>
      <Footer />
    </PageShell>
  );
}

function Field({ label, hint, children }) {
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

function PreviewFrame({ label, hint, children }) {
  return (
    <div className="neo rounded-3xl bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] uppercase tracking-[0.25em] text-primary">{label}</div>
        <div className="text-[10px] text-muted-foreground">{hint}</div>
      </div>
      <div className="neo-inset rounded-2xl p-4 sm:p-5 bg-background/60">
        {children}
      </div>
    </div>
  );
}

// Simplified re-implementation of ProductCard so we can render it against a
// live in-progress product without hitting the router link.
function CardPreview({ p }) {
  return (
    <div className="neo-pressable p-3 group flex flex-col">
      <div className="relative neo-inset rounded-xl overflow-hidden aspect-square">
        {p.img ? (
          <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-muted-foreground">
            <ImageIcon className="size-8" />
          </div>
        )}
        {p.tag && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] font-bold rounded-full shadow-sm bg-foreground text-background">
              {p.tag}
            </span>
          </div>
        )}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-background/80" aria-hidden>
          <Heart className="size-3.5 text-foreground" />
        </button>
      </div>
      <div className="px-1 pt-4 pb-1 flex flex-col gap-1.5">
        <h3 className="text-sm font-medium leading-tight">{p.name}</h3>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Star className="size-3 fill-primary text-primary" />
          <span>{p.rating}</span>
          <span>·</span>
          <span>{p.reviews} reviews</span>
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-base font-semibold text-foreground">€ {p.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// Miniaturized detail page — echoes product.$id.jsx layout with the
// interactive bits stripped down.
function DetailPreview({ p, sizes }) {
  const gallery = p.images && p.images.length > 0 ? p.images : (p.img ? [p.img] : []);
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [gallery.length]);

  return (
    <div className="grid grid-cols-[1fr_1.2fr] gap-4">
      <div>
        <div className="neo-inset rounded-xl overflow-hidden aspect-square">
          {gallery[active] ? (
            <img src={gallery[active]} alt={p.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-muted-foreground">
              <ImageIcon className="size-6" />
            </div>
          )}
        </div>
        {gallery.length > 1 && (
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {gallery.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`aspect-square rounded-md overflow-hidden ${i === active ? "ring-2 ring-primary" : "neo-sm opacity-80"}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="text-[9px] uppercase tracking-[0.3em] text-primary">
          {p.style} · {p.material}
        </div>
        <h2 className="font-display text-lg leading-tight mt-1 truncate">{p.name}</h2>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
          <Star className="size-3 fill-primary text-primary" />
          <span className="text-foreground">{p.rating}</span>
          <span>· {p.reviews} reviews</span>
        </div>
        <div className="font-display text-xl mt-3">€ {p.price.toLocaleString()}</div>
        <p className="text-[11px] text-foreground/70 leading-relaxed mt-2 line-clamp-3">{p.description}</p>

        {sizes.length > 0 && (
          <div className="mt-3">
            <div className="text-[9px] uppercase tracking-[0.25em] text-foreground/80 mb-1.5">Sizes</div>
            <div className="flex flex-wrap gap-1">
              {sizes.map((s) => (
                <span key={s} className="neo-sm rounded-full px-2.5 py-1 text-[11px]">{s}</span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3 flex gap-2">
          <div className="btn-gold flex-1 py-2 text-[10px] uppercase tracking-widest font-semibold inline-flex items-center justify-center gap-1.5">
            <SouqBag className="size-3" />
            Add to Bag
          </div>
          <div className="neo-pressable px-3 py-2 grid place-items-center">
            <Heart className="size-3.5" />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {[Truck, ShieldCheck, RefreshCw].map((Icon, i) => (
            <div key={i} className="neo-sm p-1.5 grid place-items-center">
              <Icon className="size-3 text-primary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
