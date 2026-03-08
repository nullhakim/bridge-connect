
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Allow public to read sales profiles by slug (for catalog pages)
CREATE POLICY "Public can view sales profiles by slug"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (role = 'sales' AND slug IS NOT NULL);
