// @ts-nocheck
import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Lock, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/reset")({
  component: ResetPage,
  head: () => ({
    meta: [
      { title: "Reset password — Souq Al Andalus" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function ResetPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Supabase parses the recovery token from the URL fragment and emits
    // a PASSWORD_RECOVERY event once a session is established.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (pw.length < 9) { toast.error("Password must be at least 9 characters."); return; }
    if (pw !== confirm) { toast.error("Passwords don't match."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated. You're signed in.");
    navigate({ to: "/account/settings" });
  }

  return (
    <PageShell>
      <Navbar />
      <main className="mx-auto max-w-md px-4 sm:px-6 py-16 min-h-[60vh]">
        <div className="neo p-8">
          <h1 className="font-display text-3xl mb-2">
            Set a new <span className="italic text-gold-gradient">password</span>
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {ready
              ? "Choose a strong password of 9+ characters."
              : "Verifying your reset link…"}
          </p>
          {ready && (
            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                  New password
                </span>
                <div className="neo-inset flex items-center gap-2 px-4 py-2.5 rounded-xl">
                  <Lock className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </div>
              </label>
              <label className="block">
                <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                  Confirm password
                </span>
                <div className="neo-inset flex items-center gap-2 px-4 py-2.5 rounded-xl">
                  <Lock className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </div>
              </label>
              <button
                type="submit"
                disabled={busy}
                className="neo-pressable w-full py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, oklch(0.55 0.14 75), oklch(0.45 0.12 65))", color: "white" }}
              >
                {busy && <Loader2 className="size-4 animate-spin" />}
                Update password
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </PageShell>
  );
}
