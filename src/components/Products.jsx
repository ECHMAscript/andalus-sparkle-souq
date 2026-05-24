import { Heart, Star } from "lucide-react";
import ring from "@/assets/product-ring.jpg";
import necklace from "@/assets/product-necklace.jpg";
import earrings from "@/assets/product-earrings.jpg";
import bracelet from "@/assets/product-bracelet.jpg";

const products = [
  { name: "Zahra Filigree Ring", price: 1240, was: null, img: ring, tag: "New", rating: 4.9, reviews: 124 },
  { name: "Granada Medallion", price: 2180, was: null, img: necklace, tag: "Bestseller", rating: 5.0, reviews: 312 },
  { name: "Cordoba Chandelier", price: 1490, was: 1860, img: earrings, tag: "-20%", rating: 4.8, reviews: 87 },
  { name: "Damascene Bangle", price: 3420, was: null, img: bracelet, tag: "Limited", rating: 4.9, reviews: 56 },
  { name: "Alhambra Pendant", price: 980, was: null, img: necklace, tag: null, rating: 4.7, reviews: 201 },
  { name: "Saffron Drop Earrings", price: 760, was: 950, img: earrings, tag: "-20%", rating: 4.8, reviews: 142 },
  { name: "Royal Andalus Ring", price: 1880, was: null, img: ring, tag: "New", rating: 5.0, reviews: 38 },
  { name: "Sultana Cuff", price: 2640, was: null, img: bracelet, tag: null, rating: 4.9, reviews: 91 },
];

const filters = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Under € 1,000"];

function tagClass(tag) {
  if (!tag) return "";
  if (tag.startsWith("-"))
    return "bg-destructive/10 text-destructive";
  if (tag === "New") return "bg-accent/30 text-foreground";
  if (tag === "Bestseller") return "bg-primary/15 text-primary";
  return "bg-secondary text-foreground/80";
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
              {p.tag && (
                <span
                  className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-widest font-semibold rounded-full ${tagClass(
                    p.tag,
                  )}`}
                >
                  {p.tag}
                </span>
              )}
              <button className="absolute top-3 right-3 neo-sm p-2 grid place-items-center bg-background/90">
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
