import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getAllSlugs, getSalesPageData } from "@/data/mockSalesData";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Index() {
  const slugs = getAllSlugs();

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
            Demo landing pages — pilih salah satu profil di bawah
          </p>
        </motion.div>

        <div className="space-y-3">
          {slugs.map((slug, i) => {
            const data = getSalesPageData(slug)!;
            return (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              >
                <Link
                  to={`/${slug}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-secondary"
                >
                  <div>
                    <p className="font-semibold text-foreground">
                      {data.sales.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {data.products.length} produk tersedia
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
