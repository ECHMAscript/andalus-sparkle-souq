import { supabase } from "@/integrations/supabase/client";

/**
 * Log a product interaction event. RLS restricts admins-only for reads.
 * user_id is attached if signed in; otherwise recorded as anonymous.
 */
export async function trackProductEvent({ productId, productName, eventType }) {
  if (!productId || !productName || !eventType) return;
  try {
    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id ?? null;
    await supabase.from("product_events").insert({
      product_id: productId,
      product_name: productName,
      event_type: eventType,
      user_id: userId,
    });
  } catch (err) {
    // Never let analytics break the UI.
    console.warn("[track] failed", err);
  }
}
