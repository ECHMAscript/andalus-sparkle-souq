const cats = [
  { name: "Rings", count: "48 pieces", icon: "◈" },
  { name: "Necklaces", count: "62 pieces", icon: "❋" },
  { name: "Earrings", count: "35 pieces", icon: "✦" },
  { name: "Bracelets", count: "29 pieces", icon: "❉" },
  { name: "Bridal Sets", count: "18 sets", icon: "✺" },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            Browse by Craft
          </div>
          <h2 className="font-display text-4xl md:text-5xl">Categories</h2>
        </div>
        <div className="gold-divider flex-1 mx-8 hidden md:block" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {cats.map((c) => (
          <button
            key={c.name}
            className="neo-pressable p-6 text-left aspect-square flex flex-col justify-between"
          >
            <div className="neo-inset size-14 grid place-items-center rounded-full">
              <span className="text-2xl text-gold-gradient">{c.icon}</span>
            </div>
            <div>
              <div className="font-display text-xl">{c.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.count}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
