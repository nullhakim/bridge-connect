import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_AVATAR = "https://api.dicebear.com/9.x/initials/svg?seed=";

export default function Index() {
  const { data: salesList, isLoading } = useQuery({
    queryKey: ["salesList"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, slug, full_name, image_url, position")
        .eq("role", "sales")
        .not("slug", "is", null)
        .order("full_name");

      if (error) {
        console.error("[salesList]", error);
        return [];
      }
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp/10">
            <Sparkles className="h-5 w-5 text-whatsapp" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Sales Bridge Pages
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pilih salah satu profil sales di bawah
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : salesList && salesList.length > 0 ? (
          <div className="space-y-3">
            {salesList.map((s, i) => {
              const name = s.full_name || "Sales";
              const photo = s.image_url || `${DEFAULT_AVATAR}${encodeURIComponent(name)}`;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                >
                  <Link
                    to={`/${s.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-secondary"
                  >
                    <img
                      src={photo}
                      alt={name}
                      className="h-10 w-10 shrink-0 rounded-full object-cover bg-muted"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground">{s.position || "Sales"}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">Belum ada sales terdaftar.</p>
        )}
      </div>
    </div>
  );
}
