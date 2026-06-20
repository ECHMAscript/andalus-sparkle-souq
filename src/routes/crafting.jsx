// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import dubai from "@/assets/craft-dubai.jpg";
import india from "@/assets/craft-india.jpg";
import design from "@/assets/craft-design.jpg";
import carving from "@/assets/craft-carving.jpg";
import casting from "@/assets/craft-casting.jpg";
import filigree from "@/assets/craft-filigree.jpg";
import setting from "@/assets/craft-setting.jpg";
import finish from "@/assets/craft-finish.jpg";

export const Route = createFileRoute("/crafting")({
  component: CraftingPage,
  head: () => ({
    meta: [
      { title: "Our Craftsmanship — Souq Al Andalus" },
      {
        name: "description",
        content:
          "From Dubai gold to Indian artisans — every Souq Al Andalus piece is forged through eight steps of heritage craftsmanship.",
      },
      { property: "og:title", content: "Our Craftsmanship — Souq Al Andalus" },
      {
        property: "og:description",
        content:
          "The eight-step journey behind every Souq Al Andalus piece — sourced, sketched, cast and finished by hand.",
      },
    ],
  }),
});

const STEPS = [
  {
    kw: "01 · Origin",
    title: "Gold from the Dubai Souk",
    img: dubai,
    body:
      "Our journey begins in the gold-laden corridors of the Deira Souk in Dubai — the world's most exacting marketplace for 21k and 22k bullion. Our buyers hand-select each ingot, weighing for purity against the strict UAE assay standard before it ever leaves the Gulf.",
  },
  {
    kw: "02 · Origin",
    title: "Treasures of Rich India",
    img: india,
    body:
      "From Jaipur and the goldsmith lanes of Hyderabad, we source the warmest, most malleable gold on earth — the same alloy that has crowned Mughal queens for five centuries. Each bar arrives wrapped in marigold-silk and a hand-signed certificate of origin.",
  },
  {
    kw: "03 · Atelier",
    title: "Sketched by Master Designers",
    img: design,
    body:
      "Inside our Damascus atelier, designers translate Andalusi tilework and Khaleeji heritage into pencil studies on parchment. Each motif is measured with brass calipers passed down three generations before a single gram of gold is touched.",
  },
  {
    kw: "04 · Atelier",
    title: "Hand-Carved in Wax",
    img: carving,
    body:
      "A master model-maker carves the design into hard jeweler's wax — every arabesque scroll cut by hand under a loupe. A single bridal medallion can take twenty hours of carving before the wax is ready for the foundry.",
  },
  {
    kw: "05 · Foundry",
    title: "Cast in 21k Gold",
    img: casting,
    body:
      "The wax is encased in plaster and burned away, leaving a hollow the molten gold rushes in to fill. We pour at 1,064°C using the lost-wax method perfected in Cordoba — the only way to capture the finest filigree detail without losing a single thread.",
  },
  {
    kw: "06 · Artisanry",
    title: "Filigree & Engraving",
    img: filigree,
    body:
      "Skilled artisans from Yemen, Morocco and Rajasthan twist hair-fine gold wire onto the cast body, soldering each spiral into the openwork lattice that defines Souq Al Andalus. The engraver then signs the back of the piece in a hidden hand.",
  },
  {
    kw: "07 · Setting",
    title: "Stone Setting by Hand",
    img: setting,
    body:
      "Certified diamonds, emeralds and Burmese rubies are tension-set beneath a microscope. Each prong is raised, burnished and tested with a pull-gauge — only stones that hold to 1.2 newtons leave the bench.",
  },
  {
    kw: "08 · Finish",
    title: "Polished, Hallmarked, Sealed",
    img: finish,
    body:
      "Every finished piece is rouge-polished, ultrasonically cleaned and struck with the 21k Damascus hallmark. It is then nested in cream silk with a hand-numbered certificate of authenticity — yours, and only yours, from this point onward.",
  },
];

/* ---------- Reveal-on-scroll (one-shot) ---------- */

function useInViewOnce(threshold = 0.18) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current || shown) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [shown, threshold]);
  return [ref, shown];
}

/* ---------- Curved connector arrow between steps ---------- */

function Connector({ from, to }) {
  // from/to are 'left' | 'right' — sides of the previous and next image.
  const leftToRight = from === "left" && to === "right";
  const path = leftToRight
    ? "M40 10 C 40 70, 260 30, 260 110"
    : "M260 10 C 260 70, 40 30, 40 110";
  const arrowX = leftToRight ? 260 : 40;
  return (
    <div className="relative h-28 sm:h-36 lg:h-40 my-2" aria-hidden>
      <svg
        viewBox="0 0 300 120"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full text-primary/60"
      >
        <defs>
          <marker
            id={`arr-${from}-${to}`}
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
          </marker>
        </defs>
        <path
          d={path}
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5 6"
          fill="none"
          strokeLinecap="round"
          markerEnd={`url(#arr-${from}-${to})`}
        />
        <circle cx={leftToRight ? 40 : 260} cy="10" r="4" fill="currentColor" />
      </svg>
    </div>
  );
}

/* ---------- A single step row ---------- */

function StepRow({ step, side, index }) {
  const [ref, shown] = useInViewOnce();
  const isLeft = side === "left";
  const offClass = isLeft ? "-translate-x-[40%]" : "translate-x-[40%]";
  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center ${
        isLeft ? "" : "md:[direction:rtl]"
      }`}
    >
      {/* Image */}
      <div
        className="md:[direction:ltr] will-change-transform"
        style={{
          transform: shown
            ? "translateX(0)"
            : isLeft
              ? "translateX(-40%)"
              : "translateX(40%)",
          opacity: shown ? 1 : 0,
          transition:
            "transform 1000ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 700ms ease-out",
        }}
      >
        <div
          className="relative rounded-3xl overflow-hidden bg-card"
          style={{
            boxShadow:
              "0 30px 60px -20px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)",
          }}
        >
          <img
            src={step.img}
            alt={step.title}
            loading="lazy"
            width={1024}
            height={768}
            className="w-full aspect-[4/3] object-cover"
          />
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.25em] font-bold px-3 py-1.5 rounded-full bg-foreground/85 text-background backdrop-blur-sm">
            Step {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>


      {/* Text */}
      <div
        className="md:[direction:ltr] will-change-transform"
        style={{
          transform: shown
            ? "translateX(0)"
            : isLeft
              ? "translateX(30%)"
              : "translateX(-30%)",
          opacity: shown ? 1 : 0,
          transition:
            "transform 1000ms cubic-bezier(0.34, 1.56, 0.64, 1) 120ms, opacity 700ms ease-out 120ms",
        }}
      >
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3 flex items-center gap-2">
          <Sparkles className="size-3.5" />
          {step.kw}
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl leading-[1.1] mb-4">
          {step.title}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-prose">
          {step.body}
        </p>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

function CraftingPage() {
  return (
    <PageShell>
      <Navbar />
      <main>
        {/* Banner */}
        <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-8 sm:pt-12">
          <div
            className="relative overflow-hidden rounded-3xl px-6 sm:px-12 py-14 sm:py-20 text-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.22 0.05 165) 0%, oklch(0.32 0.06 165) 55%, oklch(0.42 0.07 165) 100%)",
            }}
          >
            <svg
              aria-hidden
              className="absolute inset-0 w-full h-full opacity-[0.08] text-[oklch(0.95_0.16_105)]"
              viewBox="0 0 600 400"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern id="andalus-craft" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path
                    d="M30 0 L60 30 L30 60 L0 30 Z M30 12 L48 30 L30 48 L12 30 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.6"
                  />
                </pattern>
              </defs>
              <rect width="600" height="400" fill="url(#andalus-craft)" />
            </svg>
            <div className="relative">
              <div className="text-[10px] uppercase tracking-[0.4em] text-[oklch(0.95_0.16_105)] mb-4 flex items-center justify-center gap-2">
                <Sparkles className="size-3.5" /> Souq Al Andalus
              </div>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-white leading-[1.02] mb-5">
                Our <span className="italic" style={{ color: "oklch(0.85 0.14 90)" }}>Craftsmanship</span>
              </h1>
              <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Eight steps. Three continents. A single piece of 21k gold. Scroll
                slowly — every stop on this journey lives in the jewelry you wear.
              </p>
              <div className="mt-7 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/60 animate-pulse">
                <span>Scroll to begin</span>
                <ArrowRight className="size-3.5 rotate-90" />
              </div>
            </div>
          </div>
        </section>

        {/* Step pipeline */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
          {STEPS.map((step, i) => {
            const side = i % 2 === 0 ? "left" : "right";
            const next = i < STEPS.length - 1 ? (i % 2 === 0 ? "right" : "left") : null;
            return (
              <div key={step.title}>
                <StepRow step={step} side={side} index={i} />
                {next && <Connector from={side} to={next} />}
              </div>
            );
          })}
        </section>

        {/* Closing CTA */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-20">
          <div className="neo p-8 sm:p-12 rounded-3xl text-center">
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">
              The final step is yours
            </div>
            <h2 className="font-display text-2xl sm:text-4xl mb-4">
              Wear the <span className="italic text-gold-gradient">heritage</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-6">
              Every piece in our collection passes through these eight hands
              before it reaches yours. Browse the atelier today.
            </p>
            <Link
              to="/"
              className="inline-block btn-gold px-8 py-3 text-[11px] uppercase tracking-widest font-semibold"
            >
              Explore the collection
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </PageShell>
  );
}
