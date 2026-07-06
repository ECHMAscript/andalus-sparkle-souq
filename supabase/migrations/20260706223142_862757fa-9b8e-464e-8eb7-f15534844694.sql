
CREATE OR REPLACE FUNCTION public.check_username_available(_username text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles WHERE lower(username) = lower(_username));
$$;

CREATE OR REPLACE FUNCTION public.check_email_available(_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE lower(email) = lower(_email)
    UNION ALL
    SELECT 1 FROM auth.users WHERE lower(email) = lower(_email)
  );
$$;

REVOKE ALL ON FUNCTION public.check_username_available(text) FROM public;
REVOKE ALL ON FUNCTION public.check_email_available(text) FROM public;
GRANT EXECUTE ON FUNCTION public.check_username_available(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_email_available(text) TO anon, authenticated;
