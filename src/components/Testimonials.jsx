import { Star } from "lucide-react";

const quotes = [
  {
    q: "The ring arrived nestled in silk. It feels less like jewelry and more like an heirloom that already knew our family.",
    n: "Layla R.",
    c: "Granada Medallion",
  },
  {
    q: "I've worn fine gold for thirty years. Nothing has the weight, the warmth, the soul of a Souq Al Andalus piece.",
    n: "Marwan K.",
    c: "Cordoba Ring",
  },
  {
    q: "We commissioned a bridal set. They sketched, called, sketched again. Four months later — perfection.",
    n: "Yasmin & Adam",
    c: "Bespoke Bridal",
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div
        className="relative overflow-hidden rounded-[2rem] px-8 md:px-16 py-16 md:py-20"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 0%, color-mix(in oklab, var(--emerald-soft) 55%, transparent), transparent 70%), linear-gradient(180deg, var(--emerald-deep) 0%, #09241c 100%)",
          boxShadow:
            "0 30px 80px -30px color-mix(in oklab, var(--emerald-deep) 80%, transparent)",
        }}
      >
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
        />

        <div className="relative text-center mb-12">
          <div className="text-[10px] uppercase tracking-[0.4em] text-gold-gradient mb-3">
            Voices from the Souq
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-[oklch(0.97_0.02_95)]">
            Worn, treasured, <span className="italic text-gold-gradient">passed down</span>
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-5">
          {quotes.map((t, i) => (
            <figure
              key={i}
              className="neo-on-emerald-inset p-7 rounded-[1.5rem] flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="size-3.5 fill-[var(--gold)] text-[var(--gold)]" />
                ))}
              </div>
              <blockquote className="font-display text-lg leading-snug text-[oklch(0.97_0.02_95)] mb-5">
                “{t.q}”
              </blockquote>
              <figcaption className="mt-auto pt-4 border-t border-[oklch(1_0_0/0.08)]">
                <div className="text-sm text-gold-gradient font-medium">{t.n}</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[oklch(0.88_0.02_95)]/60 mt-1">
                  {t.c}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
