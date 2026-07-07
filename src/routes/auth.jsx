// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import { Loader2, User, Lock, Mail, MapPin, Phone, Sparkles, Check, X } from "lucide-react";
import { checkUsernameAvailable, checkEmailAvailable } from "@/lib/availability.functions";


export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign In or Register — Souq Al Andalus" },
      { name: "description", content: "Create your account or sign in to manage orders, favorites, and shipping details." },
    ],
  }),
});

const usernameRule = z.string().trim()
  .min(5, "Username must be at least 5 characters")
  .max(40, "Username must be less than 40 characters")
  .regex(/[0-9]/, "Username must contain at least one number");

const passwordRule = z.string()
  .min(9, "Password must be over 8 characters")
  .max(72, "Password must be less than 72 characters")
  .regex(/[A-Z]/, "Password must contain a capital letter")
  .regex(/[^A-Za-z0-9]/, "Password must contain a symbol (e.g. ! @ = -)");

const signupSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: passwordRule,
  username: usernameRule,
  full_name: z.string().trim().min(2, "Enter your full name").max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  address_line1: z.string().trim().min(2, "Street address is required").max(200),
  address_line2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  postal_code: z.string().trim().min(1, "Postal code is required").max(40),
  country: z.string().trim().min(2, "Country is required").max(100),
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Enter your password").max(72),
});


function Field({ icon: Icon, label, error, hint, status, children }) {
  const errored = !!error;
  const ok = status === "ok";
  const checking = status === "checking";
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">{label}</span>
      <div
        className={`neo-inset flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
          errored ? "border border-destructive ring-1 ring-destructive/60" : "border border-transparent"
        }`}
      >
        {Icon ? <Icon className={`size-4 shrink-0 ${errored ? "text-destructive" : "text-muted-foreground"}`} /> : null}
        {children}
        {checking && <Loader2 className="size-3.5 animate-spin text-muted-foreground shrink-0" />}
        {ok && !errored && <Check className="size-4 text-emerald-500 shrink-0" />}
        {errored && <X className="size-4 text-destructive shrink-0" />}
      </div>
      {error ? (
        <span className="block text-xs text-destructive mt-1">{error}</span>
      ) : hint ? (
        <span className="block text-xs text-muted-foreground mt-1">{hint}</span>
      ) : null}
    </label>
  );
}

function useAvailability(value, kind, minLen = 3) {
  const [state, setState] = useState({ status: "idle", error: null });
  const timer = useRef();
  useEffect(() => {
    clearTimeout(timer.current);
    const v = (value || "").trim();
    if (v.length < minLen) { setState({ status: "idle", error: null }); return; }
    setState({ status: "checking", error: null });
    timer.current = setTimeout(async () => {
      try {
        const res = kind === "username"
          ? await checkUsernameAvailable({ data: { username: v } })
          : await checkEmailAvailable({ data: { email: v } });
        setState(res.available
          ? { status: "ok", error: null }
          : { status: "taken", error: kind === "username" ? "Username already taken" : "Email already registered" });
      } catch {
        setState({ status: "idle", error: null });
      }
    }, 400);
    return () => clearTimeout(timer.current);
  }, [value, kind, minLen]);
  return state;
}


function validateField(field, value, all) {
  try {
    const shape = { username: usernameRule, password: passwordRule, email: signupSchema.shape.email }[field];
    if (!shape) return null;
    shape.parse(value);
    return null;
  } catch (err) {
    return err?.issues?.[0]?.message || "Invalid value";
  }
}


function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [login, setLogin] = useState({ email: "", password: "" });
  const [signup, setSignup] = useState({
    email: "", password: "", username: "", full_name: "", phone: "",
    address_line1: "", address_line2: "", city: "", state: "", postal_code: "", country: "",
  });

  async function handleLogin(e) {
    e.preventDefault();
    setErrors({});
    const parsed = loginSchema.safeParse(login);
    if (!parsed.success) {
      const fe = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0]] = i.message));
      setErrors(fe);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back");
    navigate({ to: "/account/settings" });
  }

  // Live validation state for signup
  const usernameAvail = useAvailability(mode === "signup" ? signup.username : "", "username", 5);
  const emailAvail = useAvailability(mode === "signup" ? signup.email : "", "email", 5);


  const localUsernameErr = signup.username ? validateField("username", signup.username) : null;
  const localEmailErr = signup.email ? validateField("email", signup.email) : null;
  const localPasswordErr = signup.password ? validateField("password", signup.password) : null;

  const usernameError = errors.username || localUsernameErr || (usernameAvail.status === "taken" ? usernameAvail.error : null);
  const emailError = errors.email || localEmailErr || (emailAvail.status === "taken" ? emailAvail.error : null);
  const passwordError = errors.password || localPasswordErr;

  const usernameStatus = localUsernameErr ? "error" : usernameAvail.status === "checking" ? "checking" : usernameAvail.status === "ok" ? "ok" : "idle";
  const emailStatus = localEmailErr ? "error" : emailAvail.status === "checking" ? "checking" : emailAvail.status === "ok" ? "ok" : "idle";
  const passwordStatus = signup.password ? (localPasswordErr ? "error" : "ok") : "idle";

  async function handleSignup(e) {
    e.preventDefault();
    setErrors({});
    const parsed = signupSchema.safeParse(signup);
    if (!parsed.success) {
      const fe = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0]] = i.message));
      setErrors(fe);
      return;
    }
    if (usernameAvail.status === "taken") { setErrors({ username: "Username already taken" }); return; }
    if (emailAvail.status === "taken") { setErrors({ email: "Email already registered" }); return; }
    setSubmitting(true);
    const { email, password, ...meta } = parsed.data;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/signup-success?email=${encodeURIComponent(email)}`,
        data: meta,
      },
    });
    setSubmitting(false);
    if (error) {
      const msg = (error.message || "").toLowerCase();
      if (msg.includes("registered") || msg.includes("already")) {
        setErrors({ email: "Email already registered" });
      } else {
        toast.error(error.message);
      }
      return;
    }
    if (data.session) {
      await supabase.auth.signOut();
    }
    navigate({ to: "/signup-success", search: { email } });
  }


  const inputCls = "bg-transparent flex-1 text-sm outline-none placeholder:text-muted-foreground min-w-0";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <PageShell>
          <div className="max-w-2xl mx-auto py-10 sm:py-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                <Sparkles className="size-3" /> Souq Al Andalus
              </div>
              <h1 className="font-display text-4xl sm:text-5xl text-gold-gradient mb-2">
                {mode === "login" ? "Ahlan wa Sahlan" : "Join the Souq"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mode === "login"
                  ? "Sign in to view your collection, favorites, and orders."
                  : "Create an account so we can craft and ship your jewelry."}
              </p>
            </div>

            <div className="neo rounded-3xl p-1 mb-6 grid grid-cols-2 gap-1 max-w-sm mx-auto">
              <button
                onClick={() => { setMode("login"); setErrors({}); }}
                className={`py-2.5 rounded-2xl text-sm font-medium transition-all ${mode === "login" ? "neo-pressable text-foreground" : "text-muted-foreground"}`}
              >Sign In</button>
              <button
                onClick={() => { setMode("signup"); setErrors({}); }}
                className={`py-2.5 rounded-2xl text-sm font-medium transition-all ${mode === "signup" ? "neo-pressable text-foreground" : "text-muted-foreground"}`}
              >Register</button>
            </div>

            <div className="neo rounded-3xl p-6 sm:p-8 bg-card">
              {mode === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <Field icon={Mail} label="Email" error={errors.email}>
                    <input type="email" autoComplete="email" className={inputCls}
                      value={login.email}
                      onChange={(e) => setLogin({ ...login, email: e.target.value })}
                      placeholder="you@example.com" />
                  </Field>
                  <Field icon={Lock} label="Password" error={errors.password}>
                    <input type="password" autoComplete="current-password" className={inputCls}
                      value={login.password}
                      onChange={(e) => setLogin({ ...login, password: e.target.value })}
                      placeholder="••••••••" />
                  </Field>
                  <button type="submit" disabled={submitting}
                    className="neo-pressable w-full py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, oklch(0.55 0.14 75), oklch(0.45 0.12 65))", color: "white" }}>
                    {submitting && <Loader2 className="size-4 animate-spin" />} Sign In
                  </button>
                  <p className="text-xs text-center text-muted-foreground">
                    New here?{" "}
                    <button type="button" onClick={() => setMode("signup")} className="underline underline-offset-2 hover:text-foreground">
                      Create an account
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4" noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field icon={User} label="Username" error={usernameError}
                      hint="At least 5 characters and must include a number"
                      status={usernameStatus}>
                      <input className={inputCls} value={signup.username}
                        onChange={(e) => { setErrors((p) => ({ ...p, username: undefined })); setSignup({ ...signup, username: e.target.value }); }}
                        placeholder="aisha_jewels1" />
                    </Field>
                    <Field icon={User} label="Full Name" error={errors.full_name}>
                      <input autoComplete="name" className={inputCls} value={signup.full_name}
                        onChange={(e) => setSignup({ ...signup, full_name: e.target.value })}
                        placeholder="Aisha Al-Mansouri" />
                    </Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field icon={Mail} label="Email" error={emailError} status={emailStatus}>
                      <input type="email" autoComplete="email" className={inputCls} value={signup.email}
                        onChange={(e) => { setErrors((p) => ({ ...p, email: undefined })); setSignup({ ...signup, email: e.target.value }); }}
                        placeholder="you@example.com" />
                    </Field>
                    <Field icon={Phone} label="Phone (optional)" error={errors.phone}>
                      <input type="tel" autoComplete="tel" className={inputCls} value={signup.phone}
                        onChange={(e) => setSignup({ ...signup, phone: e.target.value })}
                        placeholder="+971 5x xxx xxxx" />
                    </Field>
                  </div>
                  <Field icon={Lock} label="Password" error={passwordError}
                    hint="Over 8 characters, one capital letter, and a symbol"
                    status={passwordStatus}>
                    <input type="password" autoComplete="new-password" className={inputCls} value={signup.password}
                      onChange={(e) => { setErrors((p) => ({ ...p, password: undefined })); setSignup({ ...signup, password: e.target.value }); }}
                      placeholder="At least 9 characters" />

                  </Field>

                  <div className="pt-2">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2">
                      <MapPin className="size-3.5" /> Shipping Address
                    </div>
                    <div className="space-y-4">
                      <Field label="Address Line 1" error={errors.address_line1}>
                        <input className={inputCls} value={signup.address_line1}
                          onChange={(e) => setSignup({ ...signup, address_line1: e.target.value })}
                          placeholder="Street and number" />
                      </Field>
                      <Field label="Address Line 2 (optional)" error={errors.address_line2}>
                        <input className={inputCls} value={signup.address_line2}
                          onChange={(e) => setSignup({ ...signup, address_line2: e.target.value })}
                          placeholder="Apt, suite, building" />
                      </Field>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="City" error={errors.city}>
                          <input className={inputCls} value={signup.city}
                            onChange={(e) => setSignup({ ...signup, city: e.target.value })} placeholder="Dubai" />
                        </Field>
                        <Field label="State / Emirate (optional)" error={errors.state}>
                          <input className={inputCls} value={signup.state}
                            onChange={(e) => setSignup({ ...signup, state: e.target.value })} placeholder="" />
                        </Field>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Postal Code" error={errors.postal_code}>
                          <input className={inputCls} value={signup.postal_code}
                            onChange={(e) => setSignup({ ...signup, postal_code: e.target.value })} placeholder="00000" />
                        </Field>
                        <Field label="Country" error={errors.country}>
                          <input className={inputCls} value={signup.country}
                            onChange={(e) => setSignup({ ...signup, country: e.target.value })} placeholder="United Arab Emirates" />
                        </Field>
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={submitting}
                    className="neo-pressable w-full py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                    style={{ background: "linear-gradient(135deg, oklch(0.55 0.14 75), oklch(0.45 0.12 65))", color: "white" }}>
                    {submitting && <Loader2 className="size-4 animate-spin" />} Create Account
                  </button>
                  <p className="text-xs text-center text-muted-foreground">
                    Already a member?{" "}
                    <button type="button" onClick={() => setMode("login")} className="underline underline-offset-2 hover:text-foreground">
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </div>

            <p className="text-[11px] text-center text-muted-foreground mt-6">
              <Link to="/" className="hover:text-foreground">Continue browsing</Link>
            </p>
          </div>
        </PageShell>
      </main>
      <Footer />
    </div>
  );
}
