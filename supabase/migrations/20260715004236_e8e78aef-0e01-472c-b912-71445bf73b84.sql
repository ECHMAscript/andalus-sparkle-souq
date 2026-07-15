
-- Add owner-scoped SELECT policy on product_events so users can see their own analytics
CREATE POLICY "events select own" ON public.product_events
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Lock down SECURITY DEFINER helpers so anonymous callers can't execute them directly
REVOKE EXECUTE ON FUNCTION public.check_username_available(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_email_available(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_product_reviews(text) FROM PUBLIC, anon, authenticated;
-- check_* are only invoked through server functions using the service role; get_product_reviews now goes through a server fn too.
-- has_role stays granted to authenticated (required by RLS policies).
