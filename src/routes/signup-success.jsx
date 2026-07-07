// @ts-nocheck
import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link, useSearch } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import { MailCheck, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/signup-success")({
  component: SignupSuccessPage,
  validateSearch: (s) => ({ email: typeof s.email === "string" ? s.email : "" }),
  head: () => ({
    meta: [
      { title: "Verify Your Email — Souq Al Andalus" },
      { name: "description", content: "Confirm your email address to activate your Souq Al Andalus account." },
    ],
  }),
});

function SignupSuccessPage() {
  const navigate = useNavigate();
  const { email } = useSearch({ from: "/signup-success" });
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session?.user?.email_confirmed_at) {
        setVerified(true);
        await supabase.auth.signOut();
        setTimeout(() => navigate({ to: "/auth" }), 1800);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <PageShell>
          <div className="max-w-xl mx-auto py-16 sm:py-24 text-center">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
              <Sparkles className="size-3" /> Souq Al Andalus
            </div>
            <div className="neo rounded-3xl p-8 sm:p-12 bg-card">
              <div className="mx-auto mb-6 size-16 rounded-full neo-inset flex items-center justify-center">
                {verified ? (
                  <Loader2 className="size-7 animate-spin" style={{ color: "oklch(0.55 0.14 75)" }} />
                ) : (
                  <MailCheck className="size-7" style={{ color: "oklch(0.55 0.14 75)" }} />
                )}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-gold-gradient mb-3">
                {verified ? "Email Verified" : "Check Your Inbox"}
              </h1>
              {verified ? (
                <p className="text-sm text-muted-foreground">
                  Redirecting you to the sign-in page…
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-2">
                    We've sent a verification link{email ? " to" : ""}{" "}
                    {email && <span className="text-foreground font-medium">{email}</span>}.
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Click the link in that email to activate your account. You won't be able to sign in until your email is verified.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Didn't get it? Check your spam folder, or{" "}
                    <Link to="/auth" className="underline underline-offset-2 hover:text-foreground">
                      return to sign in
                    </Link>
                    .
                  </div>
                </>
              )}
            </div>
          </div>
        </PageShell>
      </main>
      <Footer />
    </div>
  );
}
