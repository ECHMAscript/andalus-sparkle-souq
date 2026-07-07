-- Revoke anon EXECUTE on SECURITY DEFINER helpers; keep service_role only.
REVOKE EXECUTE ON FUNCTION public.check_email_available(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_username_available(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_email_available(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.check_username_available(text) TO service_role;

-- Tighten product_events to prevent garbage injection.
ALTER TABLE public.product_events
  DROP CONSTRAINT IF EXISTS product_events_event_type_check;
ALTER TABLE public.product_events
  ADD CONSTRAINT product_events_event_type_check
  CHECK (event_type IN ('view', 'cart', 'favorite'));

ALTER TABLE public.product_events
  DROP CONSTRAINT IF EXISTS product_events_product_id_len;
ALTER TABLE public.product_events
  ADD CONSTRAINT product_events_product_id_len
  CHECK (char_length(product_id) BETWEEN 1 AND 80);

ALTER TABLE public.product_events
  DROP CONSTRAINT IF EXISTS product_events_product_name_len;
ALTER TABLE public.product_events
  ADD CONSTRAINT product_events_product_name_len
  CHECK (char_length(product_name) BETWEEN 1 AND 160);
