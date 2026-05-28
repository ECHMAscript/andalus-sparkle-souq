import { Link } from "@tanstack/react-router";
import { categoryTiles } from "@/lib/products";

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
            Shop by Category
          </div>
          <h2 className="font-display text-3xl md:text-4xl">Browse the Souq</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {categoryTiles.map((c) => (
          <Link
            key={c.name}
            to="/category/$category"
            params={{ category: c.name.toLowerCase() }}
            className="neo-pressable p-4 sm:p-5 flex flex-col items-center text-center gap-3"
          >
            <div className="neo-inset size-12 sm:size-14 grid place-items-center rounded-full">
              <span className="text-xl sm:text-2xl text-gold-gradient">{c.icon}</span>
            </div>
            <div>
              <div className="font-medium text-sm">{c.name}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                {c.blurb}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
