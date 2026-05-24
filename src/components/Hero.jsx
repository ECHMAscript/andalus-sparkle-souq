import heroImage from "@/assets/hero-jewelry.jpg";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-12 pb-24">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-8">
          <div className="neo-sm inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary">
            <Sparkles className="size-3.5" />
            Heritage Collection · 2026
          </div>

          <h1 className="font-display text-5xl md:text-7xl leading-[0.95]">
            Treasures of
            <br />
            <span className="text-gold-gradient italic">Al Andalus</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed">
            Hand-forged in 21k gold, each piece carries the geometry of Granada,
            the patience of Damascene craft, and the warmth of a thousand years
            of Arabic artistry.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="neo-pressable px-7 py-4 flex items-center gap-3 group">
              <span className="text-sm font-medium tracking-wide text-primary">
                Shop the Collection
              </span>
              <ArrowRight className="size-4 text-primary group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-7 py-4 text-sm tracking-wide text-foreground/80 hover:text-primary transition-colors">
              Our Heritage →
            </button>
          </div>

          <div className="flex gap-8 pt-6">
            {[
              { k: "21k", v: "Pure Gold" },
              { k: "1200+", v: "Artisans" },
              { k: "40yr", v: "Tradition" },
            ].map((s) => (
              <div key={s.k}>
                <div className="font-display text-3xl text-gold-gradient">{s.k}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="neo p-4 rounded-3xl">
            <img
              src={heroImage}
              alt="Hand-crafted Arabic gold necklace and earrings set"
              width={1600}
              height={1200}
              className="w-full rounded-2xl object-cover aspect-[4/5]"
            />
          </div>
          <div className="neo absolute -bottom-8 -left-8 p-5 max-w-[220px] hidden md:block">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Featured
            </div>
            <div className="font-display text-lg mt-1">Alhambra Necklace</div>
            <div className="text-primary font-medium mt-2">€ 2,480</div>
          </div>
          <div className="neo-sm absolute -top-6 -right-6 p-4 hidden md:flex items-center gap-3">
            <div className="size-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs uppercase tracking-widest">In Atelier</span>
          </div>
        </div>
      </div>
    </section>
  );
}
