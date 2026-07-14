
-- Remove public raw access; expose sanitized public view without user_id
DROP POLICY IF EXISTS "Reviews public read" ON public.product_reviews;

-- Owners can read their own review row (to detect "mine" and manage it)
CREATE POLICY "Users read own review" ON public.product_reviews
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins can read all
CREATE POLICY "Admins read all reviews" ON public.product_reviews
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Public sanitized view (no user_id)
CREATE OR REPLACE VIEW public.product_reviews_public
WITH (security_invoker = true) AS
SELECT
  id,
  product_id,
  rating,
  title,
  body,
  created_at
FROM public.product_reviews;

GRANT SELECT ON public.product_reviews_public TO anon, authenticated;

-- Allow view's underlying SELECT to succeed for anyone by adding a
-- column-limited policy that hides user_id. Since RLS applies per-row not
-- per-column, use a SECURITY DEFINER function-backed approach via view:
-- Recreate the view as SECURITY DEFINER wrapper by using a function.
DROP VIEW IF EXISTS public.product_reviews_public;

CREATE OR REPLACE FUNCTION public.get_product_reviews(_product_id text)
RETURNS TABLE (
  id uuid,
  product_id text,
  rating integer,
  title text,
  body text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, product_id, rating, title, body, created_at
  FROM public.product_reviews
  WHERE product_id = _product_id
  ORDER BY created_at DESC
$$;

GRANT EXECUTE ON FUNCTION public.get_product_reviews(text) TO anon, authenticated;
