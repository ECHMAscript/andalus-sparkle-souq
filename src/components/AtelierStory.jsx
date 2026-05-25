import heroImage from "@/assets/hero-jewelry.jpg";
import bracelet from "@/assets/product-bracelet.jpg";
import { ArrowRight } from "lucide-react";

export default function AtelierStory() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Tall image slide */}
        <div className="lg:col-span-5 neo p-3 rounded-[2rem] overflow-hidden relative group">
          <img
            src={heroImage}
            alt="Artisan hand-forging Arabic gold jewelry in the atelier"
            className="w-full h-full object-cover rounded-[1.5rem] aspect-[4/5] transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div
            className="absolute left-6 top-6 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-primary rounded-full bg-background/85 backdrop-blur-sm"
            style={{ boxShadow: "0 1px 4px color-mix(in oklab, black 10%, transparent)" }}
          >
            Chapter I
          </div>
        </div>

        {/* Green editorial slide */}
        <div
          className="lg:col-span-7 relative overflow-hidden rounded-[2rem] p-10 md:p-14 flex flex-col justify-between"
          style={{
            background:
              "linear-gradient(160deg, #09241c 0%, var(--emerald-deep) 60%, #0c2e22 100%)",
            boxShadow:
              "0 30px 70px -30px color-mix(in oklab, var(--emerald-deep) 80%, transparent)",
          }}
        >
          <div
            className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
          />

          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.4em] text-gold-gradient mb-4">
              The Atelier
            </div>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.05] text-[oklch(0.97_0.02_95)] mb-6">
              Where patience{" "}
              <span className="italic text-gold-gradient">becomes gold</span>
            </h2>
            <p className="text-[oklch(0.88_0.02_95)]/80 leading-relaxed max-w-lg mb-10">
              Each Souq Al Andalus piece passes through 14 sets of hands. We
              forge, granulate, and chase by lamp-light — the way it has been
              done for centuries along the silk roads.
            </p>
          </div>

          <div className="relative grid grid-cols-3 gap-4">
            {[
              { n: "14", l: "Artisan hands" },
              { n: "120h", l: "Average craft time" },
              { n: "12", l: "Generations" },
            ].map((s) => (
              <div key={s.l} className="neo-on-emerald-inset p-5 rounded-2xl">
                <div className="font-display text-3xl text-gold-gradient">{s.n}</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[oklch(0.88_0.02_95)]/70 mt-2">
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          <button className="btn-gold mt-10 self-start px-7 py-3.5 text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2">
            Walk the Atelier <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Wide horizontal feature slide */}
      <div className="mt-6 relative overflow-hidden rounded-[2rem] grid md:grid-cols-2 neo">
        <div className="p-10 md:p-14 flex flex-col justify-center bg-[var(--color-surface)]">
          <div className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3">
            Featured Edition
          </div>
          <h3 className="font-display text-3xl md:text-4xl leading-tight mb-4">
            The <span className="italic text-gold-gradient">Damascene</span> Cuff
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-6">
            Hand-engraved silver inlaid with 21k gold thread — a love letter
            to the smiths of old Damascus. Numbered edition of 24.
          </p>
          <div className="flex gap-3">
            <button className="btn-gold px-6 py-3 text-xs uppercase tracking-widest font-semibold">
              Shop the Edition — € 3,420
            </button>
          </div>
        </div>
        <div className="relative min-h-[320px]">
          <img
            src={bracelet}
            alt="Damascene gold and silver cuff bracelet"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
