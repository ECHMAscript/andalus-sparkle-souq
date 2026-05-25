import heroImage from "@/assets/hero-jewelry.jpg";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Award } from "lucide-react";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-10 pb-12">
      <div className="grid lg:grid-cols-5 gap-8 items-stretch">
        {/* Hero image card */}
        <div className="lg:col-span-3 neo p-3 relative overflow-hidden rounded-3xl">
          <img
            src={heroImage}
            alt="Hand-crafted Arabic gold necklace and earrings set"
            width={1600}
            height={1200}
            className="w-full h-full rounded-2xl object-cover aspect-[16/10] lg:aspect-auto"
          />
          <div
            className="absolute bottom-8 left-8 right-8 md:right-auto md:max-w-sm backdrop-blur-md p-6 rounded-2xl"
            style={{
              background:
                "linear-gradient(155deg, color-mix(in oklab, var(--emerald-deep) 92%, black) 0%, color-mix(in oklab, var(--emerald) 88%, black) 100%)",
              boxShadow:
                "0 20px 50px -20px color-mix(in oklab, var(--emerald-deep) 80%, transparent), inset 0 0 0 1px color-mix(in oklab, var(--gold) 22%, transparent)",
            }}
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold-gradient mb-2">
              Heritage Collection
            </div>
            <h1 className="font-display text-3xl md:text-4xl leading-tight mb-3 text-[oklch(0.97_0.02_95)]">
              Treasures of <span className="italic text-gold-gradient">Al Andalus</span>
            </h1>
            <p className="text-sm text-[oklch(0.88_0.02_95)]/80 mb-4">
              21k hand-forged gold. From € 480.
            </p>
            <button className="btn-gold px-5 py-2.5 text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2">
              Shop Collection <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Side promo tiles */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="neo-pressable p-5 col-span-2 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-primary">Limited</div>
              <div className="font-display text-2xl mt-1">Bridal Sets</div>
              <div className="text-xs text-muted-foreground mt-1">From € 4,200</div>
            </div>
            <button className="neo-sm px-4 py-2 text-[10px] uppercase tracking-widest">
              Shop →
            </button>
          </div>
          <div className="neo-pressable p-5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/60">New</div>
            <div className="font-display text-lg mt-1">Cordoba Rings</div>
            <div className="text-xs text-primary mt-2 font-medium">€ 1,240+</div>
          </div>
          <div className="neo-pressable p-5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-destructive">-20%</div>
            <div className="font-display text-lg mt-1">Earrings</div>
            <div className="text-xs text-primary mt-2 font-medium">From € 380</div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="neo mt-8 px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { Icon: Truck, t: "Free Shipping", s: "Orders over € 500" },
          { Icon: ShieldCheck, t: "Certified 21k", s: "Hallmarked & assayed" },
          { Icon: RefreshCw, t: "30-Day Returns", s: "No questions asked" },
          { Icon: Award, t: "Lifetime Care", s: "Free polishing" },
        ].map(({ Icon, t, s }) => (
          <div key={t} className="flex items-center gap-3">
            <div className="neo-sm size-10 grid place-items-center shrink-0">
              <Icon className="size-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold">{t}</div>
              <div className="text-[11px] text-muted-foreground truncate">{s}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
