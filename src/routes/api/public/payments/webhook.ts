import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

let _supabase: ReturnType<typeof createClient<Database>> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _supabase;
}

async function markOrderPaid(session: any, env: StripeEnv) {
  const orderId = session.metadata?.order_id;
  if (!orderId) {
    console.error("Webhook: session with no order_id metadata", session.id);
    return;
  }
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const { error } = await getSupabase()
    .from("orders")
    .update({
      payment_status: "paid",
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      environment: env,
    })
    .eq("id", orderId);

  if (error) {
    console.error("Webhook: failed to mark order paid", orderId, error.message);
    return;
  }

  // Decrement stock + clear the buyer's server-side cart atomically.
  const { error: rpcError } = await getSupabase().rpc("apply_paid_order", { _order_id: orderId });
  if (rpcError) console.error("Webhook: apply_paid_order failed", orderId, rpcError.message);
}

async function markOrderFailed(session: any) {
  const orderId = session.metadata?.order_id;
  if (!orderId) return;
  await getSupabase()
    .from("orders")
    .update({ payment_status: "failed" })
    .eq("id", orderId);
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook: invalid env", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        const env: StripeEnv = rawEnv;
        try {
          const event = await verifyWebhook(request, env);
          switch (event.type) {
            case "checkout.session.completed":
            case "checkout.session.async_payment_succeeded":
              await markOrderPaid(event.data.object, env);
              break;
            case "checkout.session.async_payment_failed":
            case "checkout.session.expired":
              await markOrderFailed(event.data.object);
              break;
            default:
              console.log("Webhook: unhandled event", event.type);
          }
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
