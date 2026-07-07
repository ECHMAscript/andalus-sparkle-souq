import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const usernameSchema = z.object({
  username: z.string().trim().min(3).max(64),
});
const emailSchema = z.object({
  email: z.string().trim().email().max(320),
});

export const checkUsernameAvailable = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => usernameSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: available, error } = await supabaseAdmin.rpc(
      "check_username_available",
      { _username: data.username },
    );
    if (error) throw new Error("Availability check failed");
    return { available: !!available };
  });

export const checkEmailAvailable = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => emailSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: available, error } = await supabaseAdmin.rpc(
      "check_email_available",
      { _email: data.email },
    );
    if (error) throw new Error("Availability check failed");
    return { available: !!available };
  });
