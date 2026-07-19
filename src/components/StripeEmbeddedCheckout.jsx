// @ts-nocheck
import { useMemo } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createOrderCheckoutSession } from "@/lib/payments.functions";

export default function StripeEmbeddedCheckoutWidget({ orderId, returnUrl }) {
  const options = useMemo(
    () => ({
      fetchClientSecret: async () => {
        const result = await createOrderCheckoutSession({
          data: {
            orderId,
            returnUrl,
            environment: getStripeEnvironment(),
          },
        });
        if ("error" in result) throw new Error(result.error);
        if (!result.clientSecret) throw new Error("Payment session failed to start.");
        return result.clientSecret;
      },
    }),
    [orderId, returnUrl],
  );

  return (
    <div id="checkout" className="min-h-[500px]">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
