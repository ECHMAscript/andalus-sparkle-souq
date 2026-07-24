
CREATE OR REPLACE FUNCTION public.apply_paid_order(_order_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
BEGIN
  SELECT user_id INTO _user_id FROM public.orders WHERE id = _order_id;
  IF _user_id IS NULL THEN
    RETURN;
  END IF;

  -- Decrement stock for each line (never below zero).
  UPDATE public.products p
  SET stock = GREATEST(0, p.stock - oi.qty),
      updated_at = now()
  FROM public.order_items oi
  WHERE oi.order_id = _order_id
    AND oi.product_id = p.id;

  -- Clear the buyer's server-side cart.
  DELETE FROM public.user_cart_items WHERE user_id = _user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.apply_paid_order(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_paid_order(uuid) TO service_role;
