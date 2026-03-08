
-- Add description and size_chart_url to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size_chart_url text;

-- Create product_images table for multiple images
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product images: public can read"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "Product images: admin can manage"
  ON public.product_images FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
