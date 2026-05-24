export default function Heritage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="neo p-8 md:p-14 rounded-3xl">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">
              Since 1986
            </div>
            <h2 className="font-display text-3xl md:text-4xl leading-tight mb-5">
              A legacy poured <span className="italic text-gold-gradient">in 21 karats</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-7 max-w-md text-sm">
              From the souqs of Damascus to the workshops of Fez, our master artisans inherit
              techniques passed through twelve generations. Every motif tells a story carved by
              patient hands.
            </p>
            <button className="btn-gold px-6 py-3 text-xs uppercase tracking-widest font-semibold">
              Discover Our Story
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "Hand Forged", v: "Every piece, no exceptions" },
              { k: "Ethically Sourced", v: "Conflict-free gold" },
              { k: "Lifetime Care", v: "Free polishing & repair" },
              { k: "Bespoke", v: "Custom commissions" },
            ].map((item) => (
              <div key={item.k} className="neo-inset p-5 rounded-2xl">
                <div className="font-display text-lg text-foreground">{item.k}</div>
                <div className="text-xs text-muted-foreground mt-2 leading-relaxed">{item.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
