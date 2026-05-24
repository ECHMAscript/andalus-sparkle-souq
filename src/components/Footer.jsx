export default function Footer() {
  const cols = [
    { title: "Shop", items: ["All Jewelry", "Rings", "Necklaces", "Earrings", "Bridal"] },
    { title: "Atelier", items: ["Our Story", "Craftsmanship", "Sustainability", "Press"] },
    { title: "Service", items: ["Care Guide", "Shipping", "Returns", "Contact"] },
  ];
  return (
    <footer className="mx-auto max-w-7xl px-6 pt-16 pb-10">
      <div className="gold-divider mb-12" />
      <div className="grid md:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="font-display text-2xl text-gold-gradient mb-3">
            Souq Al Andalus
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Fine Arabic jewelry, hand-forged in the spirit of Al Andalus.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-4">
              {c.title}
            </div>
            <ul className="space-y-2.5">
              {c.items.map((i) => (
                <li key={i}>
                  <a className="text-sm text-foreground/70 hover:text-primary transition-colors cursor-pointer">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="gold-divider mb-6" />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <div>© 2026 Souq Al Andalus · Crafted with patience</div>
        <div className="flex gap-6">
          <a className="hover:text-primary cursor-pointer">Privacy</a>
          <a className="hover:text-primary cursor-pointer">Terms</a>
          <a className="hover:text-primary cursor-pointer">Imprint</a>
        </div>
      </div>
    </footer>
  );
}
