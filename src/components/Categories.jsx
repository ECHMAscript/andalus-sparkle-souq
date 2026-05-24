const cats = [
  { name: "Rings", count: 48, icon: "◈" },
  { name: "Necklaces", count: 62, icon: "❋" },
  { name: "Earrings", count: 35, icon: "✦" },
  { name: "Bracelets", count: 29, icon: "❉" },
  { name: "Bridal", count: 18, icon: "✺" },
  { name: "Anklets", count: 12, icon: "◇" },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
            Shop by Category
          </div>
          <h2 className="font-display text-3xl md:text-4xl">Browse the Souq</h2>
        </div>
        <a className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary cursor-pointer hidden md:block">
          View all →
        </a>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {cats.map((c) => (
          <button
            key={c.name}
            className="neo-pressable p-5 flex flex-col items-center text-center gap-3"
          >
            <div className="neo-inset size-14 grid place-items-center rounded-full">
              <span className="text-2xl text-gold-gradient">{c.icon}</span>
            </div>
            <div>
              <div className="font-medium text-sm">{c.name}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                {c.count} items
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
