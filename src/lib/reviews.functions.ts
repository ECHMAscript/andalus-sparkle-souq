import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({ productId: z.string().trim().min(1).max(80) });

export const getProductReviews = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.rpc("get_product_reviews", {
      _product_id: data.productId,
    });
    if (error) throw new Error("Failed to load reviews");
    return { reviews: rows ?? [] };
  });
