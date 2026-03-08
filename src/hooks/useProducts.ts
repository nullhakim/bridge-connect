import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SupabaseProduct {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  image_url: string | null;
  category_id: string | null;
  category_name?: string;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<SupabaseProduct[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        image_url: p.image_url,
        category_id: p.category_id,
        category_name: p.categories?.name || null,
      }));
    },
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async (): Promise<SupabaseProduct | null> => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        price: data.price,
        image_url: data.image_url,
        category_id: data.category_id,
        category_name: (data as any).categories?.name || null,
      };
    },
    enabled: !!slug,
  });
}
