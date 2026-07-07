
-- Restrict SECURITY DEFINER functions that are internal-only
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Keep check_username_available / check_email_available callable by anon (needed for signup live validation)
-- but revoke authenticated (no reason for signed-in users to call these).
REVOKE ALL ON FUNCTION public.check_username_available(text) FROM PUBLIC, authenticated;
GRANT EXECUTE ON FUNCTION public.check_username_available(text) TO anon, service_role;

REVOKE ALL ON FUNCTION public.check_email_available(text) FROM PUBLIC, authenticated;
GRANT EXECUTE ON FUNCTION public.check_email_available(text) TO anon, service_role;

-- Admin-only role management policies on user_roles to prevent privilege escalation
CREATE POLICY "Admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
