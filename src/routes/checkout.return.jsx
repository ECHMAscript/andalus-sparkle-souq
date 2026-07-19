// @ts-nocheck
import { useEffect, useState } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import SouqBag from "@/components/SouqBag";
import { getOrderPaymentStatus } from "@/lib/payments.functions";
import { clearBag } from "@/lib/store";

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (s) => ({
    order_id: typeof s.order_id === "string" ? s.order_id : undefined,
  }),
  component: ReturnPage,
  head: () => ({
    meta: [
      { title: "Order confirmed — Souq Al Andalus" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function ReturnPage() {
  const { order_id } = useSearch({ from: "/checkout/return" });
  const [status, setStatus] = useState("checking"); // checking | paid | pending | failed
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (!order_id) {
      setStatus("failed");
      return;
    }
    let cancelled = false;
    async function check() {
      const res = await getOrderPaymentStatus({ data: { orderId: order_id } });
      if (cancelled) return;
      if ("error" in res) {
        setStatus("failed");
        return;
      }
      if (res.status === "paid") {
        clearBag();
        setStatus("paid");
        return;
      }
      if (tries >= 8) {
        setStatus("pending");
        return;
      }
      setTimeout(() => setTries((t) => t + 1), 1500);
    }
    check();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order_id, tries]);

  return (
    <PageShell>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24 min-h-[60vh]">
        <div className="neo p-10 sm:p-16 text-center">
          <div className="neo-inset size-16 rounded-full grid place-items-center mx-auto mb-5">
            <SouqBag className="size-7 text-primary" />
          </div>

          {status === "checking" && (
            <>
              <h1 className="font-display text-3xl mb-3">Confirming your payment…</h1>
              <p className="text-sm text-muted-foreground">Just a moment.</p>
            </>
          )}

          {status === "paid" && (
            <>
              <h1 className="font-display text-4xl mb-3">
                Shukran <span className="italic text-gold-gradient">~</span>
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                Your payment succeeded and your order is confirmed. A receipt has been emailed to you.
                Each piece is hand-checked at our atelier before it ships.
              </p>
              <Link
                to="/"
                className="btn-gold inline-block px-6 py-3 text-xs uppercase tracking-widest font-semibold"
              >
                Continue browsing
              </Link>
            </>
          )}

          {status === "pending" && (
            <>
              <h1 className="font-display text-3xl mb-3">Payment received — finalising</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Your bank is still confirming. You'll get an email as soon as it's cleared. No need to pay again.
              </p>
              <Link
                to="/"
                className="btn-gold inline-block px-6 py-3 text-xs uppercase tracking-widest font-semibold"
              >
                Back to the souq
              </Link>
            </>
          )}

          {status === "failed" && (
            <>
              <h1 className="font-display text-3xl mb-3">We couldn't confirm this order</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Something went wrong. If your card was charged, please contact us and we'll sort it out.
              </p>
              <Link
                to="/bag"
                className="btn-gold inline-block px-6 py-3 text-xs uppercase tracking-widest font-semibold"
              >
                Back to bag
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </PageShell>
  );
}
