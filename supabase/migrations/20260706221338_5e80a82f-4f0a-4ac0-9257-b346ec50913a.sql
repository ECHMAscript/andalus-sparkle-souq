
-- ============ nav_items ============
CREATE TABLE IF NOT EXISTS public.nav_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  path text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.nav_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.nav_items TO authenticated;
GRANT ALL ON public.nav_items TO service_role;

ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "nav_items readable by anyone" ON public.nav_items;
CREATE POLICY "nav_items readable by anyone"
  ON public.nav_items FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "nav_items insert admin" ON public.nav_items;
CREATE POLICY "nav_items insert admin"
  ON public.nav_items FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "nav_items update admin" ON public.nav_items;
CREATE POLICY "nav_items update admin"
  ON public.nav_items FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "nav_items delete admin" ON public.nav_items;
CREATE POLICY "nav_items delete admin"
  ON public.nav_items FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS touch_nav_items ON public.nav_items;
CREATE TRIGGER touch_nav_items BEFORE UPDATE ON public.nav_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed default nav (only if empty)
INSERT INTO public.nav_items (label, path, sort_order)
SELECT * FROM (VALUES
  ('New Arrivals', '/', 0),
  ('Rings', '/category/rings', 1),
  ('Necklaces', '/category/necklaces', 2),
  ('Earrings', '/category/earrings', 3),
  ('Bracelets', '/category/bracelets', 4),
  ('Bridal', '/category/bridal', 5),
  ('Anklets', '/category/anklets', 6),
  ('Crafting', '/crafting', 7),
  ('Sale', '/sale', 8)
) AS v(label, path, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.nav_items);

-- ============ product_events ============
CREATE TABLE IF NOT EXISTS public.product_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  product_name text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('view', 'cart', 'favorite')),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS product_events_product_id_idx ON public.product_events (product_id);
CREATE INDEX IF NOT EXISTS product_events_created_at_idx ON public.product_events (created_at DESC);

GRANT INSERT ON public.product_events TO anon, authenticated;
GRANT SELECT ON public.product_events TO authenticated;
GRANT ALL ON public.product_events TO service_role;

ALTER TABLE public.product_events ENABLE ROW LEVEL SECURITY;

-- Anyone can log an event, but only for themselves (or as anon).
DROP POLICY IF EXISTS "events insert anon" ON public.product_events;
CREATE POLICY "events insert anon"
  ON public.product_events FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);

DROP POLICY IF EXISTS "events insert authenticated" ON public.product_events;
CREATE POLICY "events insert authenticated"
  ON public.product_events FOR INSERT TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Only admins can read the raw event stream (analytics).
DROP POLICY IF EXISTS "events admin read" ON public.product_events;
CREATE POLICY "events admin read"
  ON public.product_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
