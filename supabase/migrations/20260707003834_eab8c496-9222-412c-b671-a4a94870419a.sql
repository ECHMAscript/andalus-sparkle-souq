-- has_role is a SECURITY DEFINER helper used inside RLS policies (admin
-- checks on products, user_roles, product_events). It must be executable
-- by authenticated users, otherwise every policy that calls it silently
-- filters out all rows and mutations become no-ops.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
