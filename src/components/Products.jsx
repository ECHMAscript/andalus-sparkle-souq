import { Heart, Star } from "lucide-react";
import ring from "@/assets/product-ring.jpg";
import necklace from "@/assets/product-necklace.jpg";
import earrings from "@/assets/product-earrings.jpg";
import bracelet from "@/assets/product-bracelet.jpg";

const products = [
  { name: "Zahra Filigree Ring", price: 1240, was: null, img: ring, tag: "New", stock: 24, rating: 4.9, reviews: 124 },
  { name: "Granada Medallion", price: 2180, was: null, img: necklace, tag: "Bestseller", stock: 18, rating: 5.0, reviews: 312 },
  { name: "Cordoba Chandelier", price: 1490, was: 1860, img: earrings, tag: "-20%", stock: 6, rating: 4.8, reviews: 87 },
  { name: "Damascene Bangle", price: 3420, was: null, img: bracelet, tag: "Limited", stock: 3, rating: 4.9, reviews: 56 },
  { name: "Alhambra Pendant", price: 980, was: null, img: necklace, tag: null, stock: 42, rating: 4.7, reviews: 201 },
  { name: "Saffron Drop Earrings", price: 760, was: 950, img: earrings, tag: "-20%", stock: 9, rating: 4.8, reviews: 142 },
  { name: "Royal Andalus Ring", price: 1880, was: null, img: ring, tag: "New", stock: 15, rating: 5.0, reviews: 38 },
  { name: "Sultana Cuff", price: 2640, was: null, img: bracelet, tag: null, stock: 21, rating: 4.9, reviews: 91 },
];

const filters = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Under € 1,000"];

// Tag is shown over the image only for: discount (starts with "-"), "New",
// or low-stock (≤10 left). Other tags stay subtle.
function ImageTag({ tag, stock }) {
  const badges = [];

  if (tag && tag.startsWith("-")) {
    badges.push({
      key: "discount",
      label: tag + " OFF",
      cls: "bg-destructive text-white",
    });
  } else if (tag === "New") {
    badges.push({
      key: "new",
      label: "NEW",
      cls: "bg-foreground text-background",
    });
  }

  if (typeof stock === "number" && stock <= 10) {
    badges.push({
      key: "stock",
      label: `Only ${stock} left`,
      cls: "bg-[oklch(0.55_0.14_75)] text-white",
    });
  }

  if (!badges.length) return null;

  return (
    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
      {badges.map((b) => (
        <span
          key={b.key}
          className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] font-bold rounded-full shadow-sm ${b.cls}`}
        >
          {b.label}
        </span>
      ))}
    </div>
  );
}

export default function Products() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
            Featured
          </div>
          <h2 className="font-display text-3xl md:text-4xl">
            Trending <span className="italic text-gold-gradient">Now</span>
          </h2>
        </div>

        {/* Filter pills */}
        <div className="neo-inset p-1.5 rounded-full flex gap-1 overflow-x-auto">
          {filters.map((f, i) => (
            <button
              key={f}
              className={`px-4 py-2 text-[11px] uppercase tracking-widest whitespace-nowrap rounded-full transition-all ${
                i === 0
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((p) => (
          <article key={p.name} className="neo-pressable p-3 group flex flex-col">
            <div className="relative neo-inset rounded-xl overflow-hidden aspect-square">
              <img
                src={p.img}
                alt={p.name}
                width={800}
                height={800}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <ImageTag tag={p.tag} stock={p.stock} />
              <button
                className="absolute top-3 right-3 p-2 grid place-items-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                style={{
                  boxShadow:
                    "0 1px 3px color-mix(in oklab, black 12%, transparent)",
                }}
                aria-label="Add to wishlist"
              >
                <Heart className="size-3.5" />
              </button>
              <button className="absolute bottom-3 left-3 right-3 btn-gold py-2.5 text-[10px] uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Add to Bag
              </button>
            </div>
            <div className="px-1 pt-4 pb-1 flex flex-col gap-1.5 flex-1">
              <h3 className="text-sm font-medium leading-tight">{p.name}</h3>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Star className="size-3 fill-primary text-primary" />
                <span>{p.rating}</span>
                <span>·</span>
                <span>{p.reviews} reviews</span>
              </div>
              <div className="flex items-baseline gap-2 mt-auto pt-1">
                <span className="text-base font-semibold text-foreground">
                  € {p.price.toLocaleString()}
                </span>
                {p.was && (
                  <span className="text-xs text-muted-foreground line-through">
                    € {p.was.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button className="neo-pressable px-8 py-3.5 text-xs uppercase tracking-widest font-semibold">
          Load More
        </button>
      </div>
    </section>
  );
}
