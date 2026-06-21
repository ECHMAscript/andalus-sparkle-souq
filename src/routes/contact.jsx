// @ts-nocheck
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, ChevronRight, Send, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Reach Out — Souq Al Andalus" },
      {
        name: "description",
        content:
          "Contact Souq Al Andalus or explore answers to the most asked questions about our handmade Arabic jewelry.",
      },
      { property: "og:title", content: "Reach Out — Souq Al Andalus" },
      {
        property: "og:description",
        content:
          "Speak with our atelier or browse our FAQ — crafted answers for every question about heritage jewelry.",
      },
    ],
  }),
});

const FAQS = [
  {
    id: "how-made",
    q: "How is your jewelry made?",
    a: [
      "Every Souq Al Andalus piece begins as a sketch on parchment in our Andalusi atelier. Master artisans translate that drawing into a hand-carved wax model, which is then cast in solid gold using the centuries-old lost-wax method preserved across the bazaars of Damascus, Fez and Granada.",
      "Once cast, the piece passes through the hands of a filigree specialist who twists hair-thin gold threads into the geometric arabesques that define our house. Stones are set last — always by eye, never by machine — so the light catches each facet the way the artisan intended.",
      "From the first sketch to the final polish, a single piece can take between forty and one hundred and twenty hours of focused craftsmanship. We refuse to rush what was meant to be slow.",
    ],
  },
  {
    id: "materials",
    q: "What metals and stones do you use?",
    a: [
      "Our jewelry is forged exclusively in solid 18-karat and 22-karat gold sourced from the Dubai Gold Souk, where each ingot carries a verifiable assay certificate. We do not work in gold-plate or gold-fill — every piece you receive is gold through and through.",
      "Our gemstones are natural and untreated wherever possible: emeralds from the Swat Valley, rubies from Mogok, sapphires from Ceylon, and freshwater pearls hand-selected in the Arabian Gulf. Each stone arrives with documentation noting its origin, weight and clarity.",
      "If you would like a piece in platinum or with a specific stone we do not stock, our bespoke atelier can source it on your behalf.",
    ],
  },
  {
    id: "authenticity",
    q: "Is the gold real, and how do I verify it?",
    a: [
      "Yes. Every Souq Al Andalus piece is stamped with its karat hallmark, our maker's mark, and a unique serial number engraved discreetly on the inner band or clasp. These three marks together form our guarantee of authenticity.",
      "Each order ships with a notarized Certificate of Authenticity describing the metal purity, gemstone origin, total weight and the name of the artisan who completed the final setting. You may also bring any piece to an independent assayer — we welcome the verification.",
      "Should the hallmark ever be questioned, our atelier will re-test the piece free of charge and reissue documentation.",
    ],
  },
  {
    id: "ethics",
    q: "Are your materials ethically sourced?",
    a: [
      "We work only with refiners certified by the Responsible Jewellery Council and the London Bullion Market Association. Our gold is fully traceable from mine to bench, and we publish an annual sourcing report for any client who wishes to read it.",
      "Our coloured stones are purchased directly from cutting houses in Jaipur, Bangkok and Colombo that we have visited in person. We do not buy from auction lots of unknown provenance, and we refuse stones from conflict regions regardless of price.",
      "Sustainability, for us, is not a marketing line. It is the only way a heritage house can honestly call itself one.",
    ],
  },
  {
    id: "care",
    q: "How should I care for my jewelry?",
    a: [
      "Treat each piece as you would a small heirloom: remove it before swimming, exercising, or applying perfume and lotions. Chlorine, salt water and alcohol-based sprays are the most common causes of dulled gold and loosened settings.",
      "To clean gold and most hard stones at home, soak the piece for ten minutes in warm water with a drop of mild dish soap, then brush gently with a soft toothbrush and rinse. Avoid this method for pearls, opals, emeralds and turquoise — for these, wipe only with a soft, dry cloth.",
      "We offer complimentary professional cleaning and re-polishing for the lifetime of every piece. Simply send it back to our atelier once a year and we will return it as it left us.",
    ],
  },
  {
    id: "custom",
    q: "Do you accept custom and bespoke commissions?",
    a: [
      "We do. Roughly a third of our annual output is bespoke — engagement rings, family heirloom restorations, wedding sets and one-of-a-kind statement pieces commissioned by collectors across the Gulf, Europe and North America.",
      "A bespoke commission begins with a conversation, either at our Dubai atelier or by video consultation. We then prepare hand-drawn renderings for your approval before any metal is cut. Most commissions take between eight and sixteen weeks from approval to delivery.",
      "To begin, send us a note through the form on this page describing the piece you have in mind, and a member of our atelier will respond within two working days.",
    ],
  },
  {
    id: "sizing",
    q: "How do I find my correct ring size?",
    a: [
      "The most accurate method is to visit any local jeweller and ask for a sizing using a steel mandrel — the measurement is free almost everywhere in the world and takes less than a minute.",
      "If that is not possible, we will gladly mail you a complimentary plastic sizing strip. Place your order through our contact form and request a sizer; it typically arrives within five working days. Measure in the late afternoon when fingers are at their natural size, and never when your hands are cold.",
      "Every Souq Al Andalus ring is eligible for one complimentary resize within the first ninety days of delivery, provided the design permits it.",
    ],
  },
  {
    id: "shipping",
    q: "How long does shipping take, and is it insured?",
    a: [
      "In-stock pieces ship within two working days from our Dubai atelier. Made-to-order and bespoke pieces ship on the timeline quoted at the start of your commission, typically four to sixteen weeks.",
      "All international shipments travel by fully insured courier — Brinks, Malca-Amit or FedEx Priority depending on destination — and require an adult signature on delivery. Transit times average two to five working days worldwide.",
      "Duties and taxes for destinations outside the GCC are calculated at checkout and prepaid on your behalf, so there are no surprises when your piece arrives at your door.",
    ],
  },
  {
    id: "returns",
    q: "What is your return and warranty policy?",
    a: [
      "Stock pieces may be returned for a full refund within thirty days of delivery, provided they arrive in original condition with all documentation. Bespoke and engraved pieces, by their nature, are final sale.",
      "Every piece is covered by a lifetime warranty against defects in materials and workmanship. If a prong loosens, a clasp fails, or a hallmark wears prematurely, we will repair or replace the piece at no cost to you — for as long as you own it.",
      "Damage from accidents, alteration by a third-party jeweller, or normal wear of plated finishes (which we do not sell) is not covered, but we offer fair-priced repair on those cases as well.",
    ],
  },
];

function ContactPage() {
  const [active, setActive] = useState("form");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const select = (id) => setActive(id);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSent(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <PageShell>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pt-10 pb-20">
        {/* Page heading */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.35em] text-primary mb-3">
            <span className="h-px w-10 bg-primary/40" />
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Majlis</span>
            <Sparkles className="w-3.5 h-3.5" />
            <span className="h-px w-10 bg-primary/40" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold" style={{ color: "oklch(0.35 0.08 75)" }}>
            Reach Out to the Atelier
          </h1>
          <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Whether you seek an answer, a bespoke commission, or simply a conversation — our doors are open like a desert tent at dusk.
          </p>
          <div className="gold-divider mt-8 max-w-md mx-auto" />
        </header>

        <div className="grid md:grid-cols-[260px_1fr] gap-10">
          {/* Aside nav */}
          <aside className="md:sticky md:top-24 self-start">
            <div className="rounded-2xl border border-primary/15 bg-card/60 backdrop-blur p-5"
                 style={{ boxShadow: "8px 8px 20px rgba(140,110,60,0.08), -8px -8px 20px rgba(255,255,255,0.6)" }}>
              <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rotate-45 bg-primary/60" />
                Index
              </div>
              <NavBtn active={active === "form"} onClick={() => select("form")} label="Contact form" />
              <div className="mt-4 mb-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                <span className="h-px flex-1 bg-primary/20" />
                FAQs
                <span className="h-px flex-1 bg-primary/20" />
              </div>
              <div className="space-y-1">
                {FAQS.map((f) => (
                  <NavBtn key={f.id} active={active === f.id} onClick={() => select(f.id)} label={f.q} />
                ))}
              </div>
            </div>
          </aside>

          {/* Main panel with swipe transition */}
          <section className="relative overflow-hidden min-h-[600px]">
            {/* Form panel */}
            <Panel visible={active === "form"} direction={active === "form" ? "in" : "out-right"}>
              <ContactForm form={form} setForm={setForm} onSubmit={onSubmit} sent={sent} />
            </Panel>
            {/* FAQ panels */}
            {FAQS.map((f) => (
              <Panel key={f.id} visible={active === f.id} direction={active === f.id ? "in" : "out-right"}>
                <FaqArticle faq={f} />
              </Panel>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </PageShell>
  );
}

function NavBtn({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left text-sm px-3 py-2 rounded-lg flex items-center justify-between gap-2 transition-all ${
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-foreground/75 hover:bg-primary/5 hover:text-primary"
      }`}
    >
      <span className="leading-snug">{label}</span>
      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${active ? "translate-x-0.5" : "opacity-40"}`} />
    </button>
  );
}

function Panel({ visible, children }) {
  return (
    <div
      aria-hidden={!visible}
      className="absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{
        transform: visible ? "translateX(0)" : "translateX(110%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
}

function ContactForm({ form, setForm, onSubmit, sent }) {
  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <div className="rounded-3xl border border-primary/15 bg-card p-8 md:p-10"
         style={{ boxShadow: "12px 12px 30px rgba(140,110,60,0.10), -12px -12px 30px rgba(255,255,255,0.7)" }}>
      <div className="flex items-center gap-3 mb-1">
        <Mail className="w-4 h-4 text-primary" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-primary">Send a Message</span>
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2" style={{ color: "oklch(0.35 0.08 75)" }}>
        We read every letter ourselves
      </h2>
      <p className="text-sm text-muted-foreground mb-7">
        Expect a thoughtful reply within two working days, from a person — never a machine.
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        <Field label="Full name" required>
          <input required maxLength={100} value={form.name} onChange={upd("name")} className={inputCls} placeholder="As it should appear on correspondence" />
        </Field>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Email" required>
            <input required type="email" maxLength={255} value={form.email} onChange={upd("email")} className={inputCls} placeholder="you@example.com" />
          </Field>
          <Field label="Phone" hint="Optional">
            <input type="tel" maxLength={30} value={form.phone} onChange={upd("phone")} className={inputCls} placeholder="+971 ..." />
          </Field>
        </div>
        <Field label="Your message" required>
          <textarea required maxLength={2000} rows={6} value={form.message} onChange={upd("message")} className={`${inputCls} resize-none`} placeholder="Tell us what you have in mind — a question, a commission, a thought." />
        </Field>

        <div className="flex items-center justify-between pt-2">
          <span className={`text-xs transition-opacity ${sent ? "opacity-100 text-primary" : "opacity-0"}`}>
            ✦ Your message has been received. Shukran.
          </span>
          <button
            type="submit"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all hover:gap-3"
            style={{ background: "linear-gradient(135deg, oklch(0.55 0.14 75), oklch(0.45 0.12 60))" }}
          >
            Send message
            <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-background/60 border border-primary/15 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all";

function Field({ label, required, hint, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.22em] text-foreground/70 mb-2">
        {label} {required && <span className="text-primary">*</span>}
        {hint && <span className="ml-2 normal-case tracking-normal text-muted-foreground">— {hint}</span>}
      </span>
      {children}
    </label>
  );
}

function FaqArticle({ faq }) {
  return (
    <article className="rounded-3xl border border-primary/15 bg-card p-8 md:p-12"
             style={{ boxShadow: "12px 12px 30px rgba(140,110,60,0.10), -12px -12px 30px rgba(255,255,255,0.7)" }}>
      {/* Arabesque ornament */}
      <div className="flex items-center justify-center gap-3 text-primary/60 mb-6">
        <span className="h-px w-12 bg-primary/30" />
        <Ornament />
        <span className="h-px w-12 bg-primary/30" />
      </div>

      <h2 className="font-display text-3xl md:text-4xl font-semibold text-center mb-3" style={{ color: "oklch(0.35 0.08 75)" }}>
        {faq.q}
      </h2>
      <div className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
        From the Atelier · Souq Al Andalus
      </div>
      <div className="gold-divider mb-8 max-w-xs mx-auto" />

      <div className="max-w-2xl mx-auto">
        {faq.a.map((p, i) => (
          <p
            key={i}
            className="text-foreground/85 text-[15px] mb-6 first-letter:font-display first-letter:text-5xl first-letter:font-semibold first-letter:mr-2 first-letter:float-left first-letter:leading-[0.9] first-letter:text-primary"
            style={{ lineHeight: 2, textIndent: i === 0 ? 0 : "2em", textAlign: "justify" }}
          >
            {p}
          </p>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 text-primary/60 mt-8">
        <span className="h-px w-12 bg-primary/30" />
        <Ornament />
        <span className="h-px w-12 bg-primary/30" />
      </div>
    </article>
  );
}

function Ornament() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-primary">
      <path
        d="M14 2 L17 11 L26 14 L17 17 L14 26 L11 17 L2 14 L11 11 Z"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <circle cx="14" cy="14" r="2" fill="currentColor" />
    </svg>
  );
}
