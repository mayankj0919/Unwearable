-- Run these commands in your Supabase SQL Editor

-- 1. Create the orders table
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT, -- Clerk user IDs are strings
    stripe_session_id TEXT UNIQUE,
    qikink_order_id TEXT,
    total_amount INTEGER NOT NULL, -- Stored in cents
    status TEXT NOT NULL DEFAULT 'pending_payment', -- pending_payment, paid, processing, fulfilled, failed
    customer_details JSONB NOT NULL, -- name, email, phone, address, city, state, pincode
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own orders (assuming user_id is set)
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT
    USING (auth.uid()::text = user_id);

-- 2. Create the order_items table
CREATE TABLE public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_slug TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase INTEGER NOT NULL, -- Stored in cents
    selected_size TEXT,
    selected_color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own order items
CREATE POLICY "Users can view their own order items" ON public.order_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()::text
        )
    );
