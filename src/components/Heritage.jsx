export default function Heritage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="neo p-10 md:p-16 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, var(--gold) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--accent) 0, transparent 35%)",
          }}
        />
        <div className="relative grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              Since 1986
            </div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
              A legacy poured
              <br />
              <span className="italic text-gold-gradient">in 21 karats</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
              From the souqs of Damascus to the workshops of Fez, our master
              artisans inherit techniques passed through twelve generations.
              Every motif tells a story carved by patient hands.
            </p>
            <button className="neo-pressable px-6 py-3 text-sm tracking-wide text-primary">
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
                <div className="font-display text-lg text-primary">{item.k}</div>
                <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {item.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
