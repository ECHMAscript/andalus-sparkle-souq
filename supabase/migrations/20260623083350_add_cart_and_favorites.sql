


CREATE TABLE public.favorites (
    /*Create a unique ID that is generated randomly */
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    /* */
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.cart_items (
    id UUID PRIMARY KEY DEFAULT get_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    size TEXT,
    qty INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE UNIQUE INDEX cart_items_user_product_size_inx ON public.cart_items(user_id, product_id, size)