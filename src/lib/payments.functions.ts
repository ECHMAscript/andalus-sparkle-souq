import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  type StripeEnv,
  createStripeClient,
  getStripeErrorMessage,
} from "@/lib/stripe.server";

type CheckoutInput = {
  orderId: string;
  returnUrl: string;
  environment: StripeEnv;
};

type CheckoutResult = { clientSecret: string } | { error: string };

export const createOrderCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: CheckoutInput) => {
    if (!/^[0-9a-f-]{36}$/i.test(data.orderId)) throw new Error("Invalid orderId");
    if (data.environment !== "sandbox" && data.environment !== "live")
      throw new Error("Invalid environment");
    return data;
  })
  .handler(async ({ data, context }): Promise<CheckoutResult> => {
    try {
      const { supabase, userId } = context;

      // Load order + its items, scoped to the caller via RLS.
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .select(
          "id, user_id, email, subtotal, shipping, total, payment_status, stripe_session_id",
        )
        .eq("id", data.orderId)
        .maybeSingle();
      if (orderErr) throw new Error(orderErr.message);
      if (!order) throw new Error("Order not found");
      if (order.user_id !== userId) throw new Error("Not authorized for this order");
      if (order.payment_status === "paid") throw new Error("Order already paid");

      const { data: items, error: itemsErr } = await supabase
        .from("order_items")
        .select("product_id, product_name, size, qty, unit_price")
        .eq("order_id", order.id);
      if (itemsErr) throw new Error(itemsErr.message);
      if (!items?.length) throw new Error("Order has no items");

      // Stock guard: for any item that exists in the DB catalog, ensure enough stock.
      const productIds = items.map((i) => i.product_id);
      const { data: stockRows } = await supabase
        .from("products")
        .select("id, name, stock")
        .in("id", productIds);
      const stockMap = new Map((stockRows ?? []).map((r) => [r.id, r]));
      for (const it of items) {
        const row = stockMap.get(it.product_id);
        if (row && row.stock < it.qty) {
          throw new Error(
            `Sorry — "${row.name}" only has ${row.stock} left in stock.`,
          );
        }
      }

      const stripe = createStripeClient(data.environment);

      // Build inline line items from the order (physical goods, EUR).
      const line_items = items.map((it) => ({
        quantity: it.qty,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(Number(it.unit_price) * 100),
          product_data: {
            name: it.size ? `${it.product_name} — Size ${it.size}` : it.product_name,
          },
        },
      }));

      // Shipping as a separate line item when > 0.
      if (Number(order.shipping) > 0) {
        line_items.push({
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(Number(order.shipping) * 100),
            product_data: { name: "Shipping (insured & tracked)" },
          },
        });
      }

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer_email: order.email,
        payment_intent_data: {
          description: `Souq Al Andalus order ${order.id.slice(0, 8)}`,
          metadata: { order_id: order.id, user_id: userId },
        },
        metadata: { order_id: order.id, user_id: userId },
      });

      // Save the session id on the order so the webhook can look it up.
      await supabase
        .from("orders")
        .update({
          stripe_session_id: session.id,
          environment: data.environment,
        })
        .eq("id", order.id);

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

type StatusResult =
  | { status: "paid" | "unpaid" | "processing"; orderId: string }
  | { error: string };

export const getOrderPaymentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { orderId: string }) => {
    if (!/^[0-9a-f-]{36}$/i.test(data.orderId)) throw new Error("Invalid orderId");
    return data;
  })
  .handler(async ({ data, context }): Promise<StatusResult> => {
    const { supabase } = context;
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, payment_status")
      .eq("id", data.orderId)
      .maybeSingle();
    if (error) return { error: error.message };
    if (!order) return { error: "Order not found" };
    return {
      orderId: order.id,
      status: (order.payment_status as "paid" | "unpaid" | "processing") ?? "unpaid",
    };
  });
