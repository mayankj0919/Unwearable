-- Run these commands in your Supabase SQL Editor
-- ============================================================

-- 1. Templates table
CREATE TABLE public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,           -- matches products.slug
  name TEXT NOT NULL,
  base_image_url TEXT NOT NULL,       -- Supabase Storage URL (designs bucket)
  placements JSONB NOT NULL DEFAULT '[]'::jsonb,
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Designs table
CREATE TABLE public.designs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,              -- Clerk user ID (string)
  template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  selected_color JSONB NOT NULL,      -- { id, hex, label }
  selected_placement JSONB NOT NULL,  -- { id, x, y, width, height, type, label }
  design_config JSONB NOT NULL,       -- { template_id, color, placement }
  preview_image_url TEXT,             -- Supabase Storage URL of rendered PNG
  status TEXT DEFAULT 'draft',        -- draft | confirmed | ordered
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;

-- 4. Templates: anyone can read active templates (public catalog)
CREATE POLICY "Public can view active templates" ON public.templates
  FOR SELECT USING (is_active = TRUE);

-- 5. Templates: all authenticated users can read all (for admin)
-- Note: restrict to admin role in middleware, not RLS, for simplicity
CREATE POLICY "Authenticated users read all templates" ON public.templates
  FOR SELECT TO authenticated USING (TRUE);

-- 6. Templates: service role can write (used by admin API routes)
-- The admin form uses the anon key client — grant insert/update/delete to anon for now
-- TODO: Restrict to admin role in production using Clerk metadata + custom JWT
CREATE POLICY "Anon can manage templates" ON public.templates
  FOR ALL USING (TRUE);

-- 7. Designs: users can manage their own designs
CREATE POLICY "Users manage own designs" ON public.designs
  FOR ALL USING (TRUE);
  -- Note: In production, use: USING (auth.uid()::text = user_id)
  -- Clerk + Supabase RLS requires JWT integration setup first

-- ============================================================
-- STORAGE: Run in Supabase Dashboard → Storage
-- ============================================================
-- 1. Create a bucket named "designs" and set it to PUBLIC
-- 2. Add these CORS headers to allow html2canvas cross-origin access:
--
-- Allowed Origins: http://localhost:3000, https://your-production-domain.com
-- Allowed Methods: GET, POST, PUT
-- Allowed Headers: *
--
-- ============================================================
-- EXAMPLE DATA: Insert a test template (replace product_id with your slug)
-- ============================================================
-- INSERT INTO public.templates (product_id, name, base_image_url, placements, colors, is_active)
-- VALUES (
--   '404-not-found-tee',
--   'Front Print — Classic',
--   'https://your-supabase-url.supabase.co/storage/v1/object/public/designs/templates/base-tee.png',
--   '[{"id":"front_center","x":140,"y":120,"width":200,"height":180,"type":"image","label":"Front Center"}]',
--   '[{"id":"void_black","hex":"#0A0A0A","label":"Void Black"},{"id":"ghost_white","hex":"#F5F0E8","label":"Ghost White"}]',
--   true
-- );
