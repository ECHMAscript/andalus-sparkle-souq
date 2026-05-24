import { Heart } from "lucide-react";
import ring from "@/assets/product-ring.jpg";
import necklace from "@/assets/product-necklace.jpg";
import earrings from "@/assets/product-earrings.jpg";
import bracelet from "@/assets/product-bracelet.jpg";

const products = [
  { name: "Zahra Filigree Ring", price: "€ 1,240", img: ring, tag: "New" },
  { name: "Granada Medallion", price: "€ 2,180", img: necklace, tag: "Bestseller" },
  { name: "Cordoba Chandelier", price: "€ 1,860", img: earrings, tag: null },
  { name: "Damascene Bangle", price: "€ 3,420", img: bracelet, tag: "Limited" },
];

export default function Products() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            Featured Pieces
          </div>
          <h2 className="font-display text-4xl md:text-5xl">
            From the <span className="italic text-gold-gradient">Atelier</span>
          </h2>
        </div>
        <button className="neo-sm px-5 py-3 text-xs uppercase tracking-widest hidden md:block">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <article key={p.name} className="neo-pressable p-4 group">
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
                <span className="absolute top-3 left-3 neo-sm px-3 py-1 text-[10px] uppercase tracking-widest text-primary">
                  {p.tag}
                </span>
              )}
              <button className="absolute top-3 right-3 neo-sm p-2 grid place-items-center">
                <Heart className="size-3.5 text-foreground/70" />
              </button>
            </div>
            <div className="px-2 pt-5 pb-2 flex items-end justify-between">
              <div>
                <h3 className="font-display text-lg leading-tight">{p.name}</h3>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                  21k Gold
                </div>
              </div>
              <div className="text-primary font-medium">{p.price}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
