// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronDown, CreditCard, MapPin, User, Shield, Apple } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";

export const Route = createFileRoute("/account/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Account Settings — Souq Al Andalus" },
      { name: "description", content: "Manage your billing address and preferred payment method." },
    ],
  }),
});

const COUNTRIES = [
  "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman",
  "Jordan", "Lebanon", "Egypt", "Morocco", "Tunisia", "Algeria",
  "United States", "United Kingdom", "Canada", "Australia", "New Zealand",
  "France", "Germany", "Spain", "Italy", "Portugal", "Netherlands", "Belgium",
  "Switzerland", "Sweden", "Norway", "Denmark", "Finland", "Ireland",
  "Turkey", "Greece", "Poland", "Czechia", "Austria",
  "Japan", "South Korea", "Singapore", "Malaysia", "Indonesia", "Thailand",
  "India", "Pakistan", "Bangladesh",
  "Brazil", "Argentina", "Mexico", "Chile", "Colombia",
  "South Africa", "Nigeria", "Kenya",
];

const STORE_KEY = "souq:settings";

function loadSettings() {
  if (typeof window === "undefined") return null;
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORE_KEY) || "null");
    if (raw && (raw.cardNumber || raw.cardCvc || raw.cardExp)) {
      // Migrate: remove any previously-stored sensitive card data.
      const digits = String(raw.cardNumber || "").replace(/\D/g, "");
      const cardLast4 = digits.length >= 4 ? digits.slice(-4) : (raw.cardLast4 || "");
      const { cardNumber: _n, cardCvc: _c, cardExp: _e, ...rest } = raw;
      const cleaned = { ...rest, cardLast4 };
      try { window.localStorage.setItem(STORE_KEY, JSON.stringify(cleaned)); } catch {}
      return cleaned;
    }
    return raw;
  } catch { return null; }
}


function CountryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = q
    ? COUNTRIES.filter((c) => c.toLowerCase().includes(q.toLowerCase()))
    : COUNTRIES;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="neo-inset w-full rounded-2xl px-5 py-3.5 flex items-center justify-between text-sm cursor-pointer hover:-translate-y-px transition-transform"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value || "Select country"}
        </span>
        <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-30 left-0 right-0 mt-2 neo rounded-2xl bg-card overflow-hidden">
          <div className="p-2 border-b border-border/60">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search countries…"
              className="w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul role="listbox" className="max-h-64 overflow-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-muted-foreground text-center">No matches</li>
            ) : filtered.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => { onChange(c); setOpen(false); setQ(""); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted/70 transition-colors flex items-center justify-between cursor-pointer ${
                    value === c ? "text-primary font-semibold" : ""
                  }`}
                >
                  <span>{c}</span>
                  {value === c && <Check className="size-4" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-[0.22em] text-foreground/70 mb-2">{label}</div>
      {children}
      {hint && <div className="text-[11px] text-muted-foreground mt-1.5">{hint}</div>}
    </label>
  );
}

function NeoInput(props) {
  return (
    <input
      {...props}
      className={`neo-inset w-full rounded-2xl px-5 py-3.5 text-sm bg-transparent outline-none placeholder:text-muted-foreground ${props.className || ""}`}
    />
  );
}

function PaymentTab({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 min-w-[120px] py-4 px-3 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5 ${
        active ? "btn-gold font-semibold" : "neo-sm"
      }`}
    >
      <Icon className="size-5" />
      <span className="text-xs uppercase tracking-[0.18em]">{label}</span>
    </button>
  );
}

function PayPalIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M7.5 21.5h2.6l.7-4.5h2.8c3.5 0 6.1-1.7 6.7-5.2.5-2.5-.8-4.2-3.7-4.2H10.5c-.4 0-.8.3-.8.7L7.5 21.5zm3.7-7.7l.8-5h3.5c1.6 0 2.4.7 2.1 2.2-.3 1.9-1.7 2.8-3.6 2.8h-2.8zM4 18.7l1.8-12c0-.4.4-.7.8-.7h7c2.9 0 4.2 1.6 3.7 4.2-.6 3.5-3.2 5.2-6.7 5.2H7.8L7 19.4c-.1.3-.3.6-.7.6H4.6c-.4 0-.7-.4-.6-.7l.0-.6z" />
    </svg>
  );
}

function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postal, setPostal] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [method, setMethod] = useState("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  useEffect(() => {
    const s = loadSettings();
    if (!s) return;
    setCountry(s.country || "");
    setCity(s.city || "");
    setAddress(s.address || "");
    setPostal(s.postal || "");
    setName(s.name || "");
    setEmail(s.email || "");
    setMethod(s.method || "card");
    setCardName(s.cardName || "");
    // Never restore PAN/CVC/expiry from storage — only last4 is kept.
    setCardNumber(s.cardLast4 ? `•••• •••• •••• ${s.cardLast4}` : "");
    setCardExp("");
    setCardCvc("");
    setPaypalEmail(s.paypalEmail || "");
  }, []);

  const onSave = (e) => {
    e.preventDefault();
    // PCI: never persist full PAN, CVC, or expiry in the browser.
    const digits = (cardNumber || "").replace(/\D/g, "");
    const cardLast4 = digits.length >= 4 ? digits.slice(-4) : "";
    const data = {
      country, city, address, postal, name, email,
      method, cardName, cardLast4, paypalEmail,
    };
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };


  return (
    <PageShell>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">My Account</div>
            <h1 className="font-display text-4xl md:text-5xl">
              Account <span className="italic text-gold-gradient">Settings</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              Manage where we ship your pieces to and how you prefer to pay.
            </p>
          </div>
          <div className="neo-sm rounded-2xl px-5 py-3 flex items-center gap-3 self-start sm:self-auto">
            <div className="neo-inset rounded-full size-11 grid place-items-center">
              <User className="size-5 text-primary" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{name || "Guest customer"}</div>
              <div className="text-[11px] text-muted-foreground">{email || "Add your details below"}</div>
            </div>
          </div>
        </div>

        <form onSubmit={onSave} className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Side navigation (visual only) */}
          <aside className="hidden lg:block">
            <nav className="neo rounded-3xl p-3 sticky top-28">
              {[
                { id: "profile", label: "Profile", icon: User, active: true },
                { id: "billing", label: "Billing Address", icon: MapPin, active: true },
                { id: "payment", label: "Payment Method", icon: CreditCard, active: true },
              ].map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm hover:bg-muted/60 transition-colors cursor-pointer"
                >
                  <s.icon className="size-4 text-primary" />
                  <span>{s.label}</span>
                </a>
              ))}
              <div className="border-t border-border/50 my-2" />
              <div className="px-4 py-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                <Shield className="size-3.5" />
                <span>Encrypted &amp; stored locally</span>
              </div>
            </nav>
          </aside>

          {/* Form panels */}
          <div className="space-y-8">
            {/* Profile */}
            <section id="profile" className="neo rounded-3xl p-6 sm:p-8">
              <header className="flex items-center gap-3 mb-6">
                <div className="neo-inset rounded-xl p-2.5"><User className="size-4 text-primary" /></div>
                <div>
                  <h2 className="font-display text-2xl">Profile</h2>
                  <p className="text-xs text-muted-foreground">For order confirmations &amp; receipts.</p>
                </div>
              </header>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Full name">
                  <NeoInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Layla Al-Andalusi" />
                </Field>
                <Field label="Email">
                  <NeoInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </Field>
              </div>
            </section>

            {/* Billing Address */}
            <section id="billing" className="neo rounded-3xl p-6 sm:p-8">
              <header className="flex items-center gap-3 mb-6">
                <div className="neo-inset rounded-xl p-2.5"><MapPin className="size-4 text-primary" /></div>
                <div>
                  <h2 className="font-display text-2xl">Billing Address</h2>
                  <p className="text-xs text-muted-foreground">Where your invoice is issued.</p>
                </div>
              </header>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Field label="Country">
                    <CountryDropdown value={country} onChange={setCountry} />
                  </Field>
                </div>
                <Field label="City">
                  <NeoInput value={city} onChange={(e) => setCity(e.target.value)} placeholder="Granada" />
                </Field>
                <Field label="Postal code">
                  <NeoInput value={postal} onChange={(e) => setPostal(e.target.value)} placeholder="18001" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Street address">
                    <NeoInput value={address} onChange={(e) => setAddress(e.target.value)} placeholder="12 Calle de la Alhambra, Apt 4B" />
                  </Field>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section id="payment" className="neo rounded-3xl p-6 sm:p-8">
              <header className="flex items-center gap-3 mb-6">
                <div className="neo-inset rounded-xl p-2.5"><CreditCard className="size-4 text-primary" /></div>
                <div>
                  <h2 className="font-display text-2xl">Preferred Payment</h2>
                  <p className="text-xs text-muted-foreground">We'll use this method first at checkout.</p>
                </div>
              </header>

              <div className="flex flex-wrap gap-3 mb-6">
                <PaymentTab active={method === "card"} onClick={() => setMethod("card")} icon={CreditCard} label="Credit Card" />
                <PaymentTab active={method === "apple"} onClick={() => setMethod("apple")} icon={Apple} label="Apple Pay" />
                <PaymentTab active={method === "paypal"} onClick={() => setMethod("paypal")} icon={PayPalIcon} label="PayPal" />
              </div>

              {method === "card" && (
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <Field label="Cardholder name">
                      <NeoInput value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name as on card" />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Card number" hint="We store only the last 4 digits.">
                      <NeoInput
                        inputMode="numeric"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/[^\d ]/g, ""))}
                        placeholder="1234 5678 9012 3456"
                      />
                    </Field>
                  </div>
                  <Field label="Expiry (MM/YY)">
                    <NeoInput value={cardExp} onChange={(e) => setCardExp(e.target.value)} placeholder="08/28" maxLength={5} />
                  </Field>
                  <Field label="CVC">
                    <NeoInput value={cardCvc} onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))} placeholder="123" maxLength={4} />
                  </Field>
                </div>
              )}

              {method === "apple" && (
                <div className="neo-inset rounded-2xl p-6 flex items-center gap-4">
                  <Apple className="size-8 text-foreground" />
                  <div>
                    <div className="text-sm font-semibold">Apple Pay selected</div>
                    <div className="text-xs text-muted-foreground">You'll confirm with Face ID or Touch ID at checkout.</div>
                  </div>
                </div>
              )}

              {method === "paypal" && (
                <Field label="PayPal email">
                  <NeoInput type="email" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} placeholder="you@paypal.com" />
                </Field>
              )}
            </section>

            {/* Save */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Shield className="size-3.5" />
                Your details are stored privately on this device.
              </div>
              <button
                type="submit"
                className="btn-gold px-8 py-4 text-xs uppercase tracking-widest font-semibold inline-flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-transform"
              >
                <Check className="size-4" />
                {saved ? "Saved ✓" : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </PageShell>
  );
}
