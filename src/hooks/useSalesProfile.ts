import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SalesProfile {
  id: string;
  slug: string;
  name: string;
  phone: string;
  photo: string;
  bio: string;
  role: string;
  metaPixelId: string | null;
}

const DEFAULT_AVATAR = "https://api.dicebear.com/9.x/initials/svg?seed=";

export function useSalesProfile(slug: string | undefined) {
  return useQuery({
    queryKey: ["salesProfile", slug],
    queryFn: async (): Promise<SalesProfile | null> => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, slug, full_name, phone_number, image_url, bio, position, role, meta_pixel_id")
        .eq("slug", slug)
        .eq("role", "sales")
        .maybeSingle();

      if (error) {
        console.error("[useSalesProfile]", error);
        return null;
      }
      if (!data) return null;

      const name = data.full_name || "Sales";

      return {
        id: data.id,
        slug: data.slug!,
        name,
        phone: data.phone_number || "",
        photo: data.image_url || `${DEFAULT_AVATAR}${encodeURIComponent(name)}`,
        bio: data.bio || "",
        role: data.position || "Sales",
        metaPixelId: data.meta_pixel_id,
      };
    },
    enabled: !!slug,
  });
}
