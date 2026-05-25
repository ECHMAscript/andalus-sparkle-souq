import { ArrowRight } from "lucide-react";

export default function Heritage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div
        className="relative overflow-hidden rounded-[2rem] p-10 md:p-16"
        style={{
          background:
            "radial-gradient(120% 90% at 0% 0%, color-mix(in oklab, var(--emerald-soft) 60%, transparent), transparent 60%), linear-gradient(135deg, var(--emerald-deep) 0%, var(--emerald) 55%, #09241c 100%)",
          boxShadow:
            "0 30px 80px -30px color-mix(in oklab, var(--emerald-deep) 80%, transparent), inset 0 0 0 1px color-mix(in oklab, var(--gold) 18%, transparent)",
        }}
      >
        {/* arabesque ornaments */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--emerald-soft), transparent 70%)" }}
        />

        <div className="relative grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-gold-gradient mb-4">
              Since 1986 · Maison Andalus
            </div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6 text-[oklch(0.97_0.02_95)]">
              A legacy poured{" "}
              <span className="italic text-gold-gradient">in 21 karats</span>
            </h2>
            <p className="text-[oklch(0.88_0.02_95)]/85 leading-relaxed mb-8 max-w-md">
              From the souqs of Damascus to the workshops of Fez, our master artisans
              inherit techniques passed through twelve generations. Every motif tells
              a story carved by patient hands.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-gold px-7 py-3.5 text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2">
                Discover Our Story <ArrowRight className="size-3.5" />
              </button>
              <button className="btn-emerald px-7 py-3.5 text-xs uppercase tracking-widest font-semibold">
                Visit the Atelier
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "Hand Forged", v: "Every piece, no exceptions" },
              { k: "Ethically Sourced", v: "Conflict-free gold" },
              { k: "Lifetime Care", v: "Free polishing & repair" },
              { k: "Bespoke", v: "Custom commissions" },
            ].map((item) => (
              <div key={item.k} className="neo-on-emerald-inset p-5 rounded-2xl">
                <div className="font-display text-lg text-gold-gradient">{item.k}</div>
                <div className="text-xs text-[oklch(0.88_0.02_95)]/75 mt-2 leading-relaxed">
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
