
-- Update all products with a dummy size_chart_url
UPDATE public.products SET size_chart_url = 'https://rxngbzitmzvvulrlgidn.supabase.co/storage/v1/object/public/photos/dummy-size-chart.png' WHERE size_chart_url IS NULL;

-- Insert dummy product_images for each product (3 extra images each)
INSERT INTO public.product_images (product_id, image_url, sort_order)
SELECT id, 'https://picsum.photos/seed/' || slug || '-1/600/400', 1 FROM public.products
UNION ALL
SELECT id, 'https://picsum.photos/seed/' || slug || '-2/600/400', 2 FROM public.products
UNION ALL
SELECT id, 'https://picsum.photos/seed/' || slug || '-3/600/400', 3 FROM public.products;
