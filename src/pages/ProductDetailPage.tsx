import { useParams, Link } from "react-router-dom";
import { useSalesProfile } from "@/hooks/useSalesProfile";
import { useProduct } from "@/hooks/useProducts";
import WhatsAppButton from "@/components/WhatsAppButton";
import SalesNotFound from "@/components/SalesNotFound";
import ProductImageGallery from "@/components/ProductImageGallery";
import { ArrowLeft, Loader2, Ruler } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const { slug, productId } = useParams<{ slug: string; productId: string }>();
  const { data: sales, isLoading: salesLoading } = useSalesProfile(slug);
  const { data: product, isLoading } = useProduct(productId);
  const [showSizeChart, setShowSizeChart] = useState(false);

  if (salesLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!sales) return <SalesNotFound />;
  if (!product) return <SalesNotFound />;

  const formattedPrice = product.price
    ? `Rp ${product.price.toLocaleString("id-ID")}`
    : null;

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-center px-4 py-3">
          <img src="/assets/logo-wift-hitam.png" alt="Wift Logo" className="h-8 w-auto" />
        </div>
      </header>
      <div className="mx-auto max-w-lg px-4 py-6">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to={`/${slug}`}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-5"
        >
          {/* Image Gallery */}
          <ProductImageGallery
            mainImage={product.image_url}
            images={product.images || []}
            productName={product.name}
          />

          {/* Price */}
          {formattedPrice && (
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-base font-bold text-primary">
              {formattedPrice}
            </div>
          )}

          {/* Title & Category */}
          <div>
            {product.category_name && (
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {product.category_name}
              </p>
            )}
            <h1 className="text-2xl font-bold leading-tight text-foreground">
              {product.name}
            </h1>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                Deskripsi Produk
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}

          {/* Size Chart */}
          {product.size_chart_url && (
            <div>
              <button
                onClick={() => setShowSizeChart(!showSizeChart)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent",
                )}
              >
                <Ruler className="h-4 w-4 text-muted-foreground" />
                Size Chart
                <span className="ml-auto text-xs text-muted-foreground">
                  {showSizeChart ? "Tutup" : "Lihat"}
                </span>
              </button>
              {showSizeChart && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 overflow-hidden rounded-xl border border-border"
                >
                  <img
                    src={product.size_chart_url}
                    alt={`Size chart - ${product.name}`}
                    className="w-full object-contain"
                  />
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <WhatsAppButton
        phone={sales.phone}
        salesName={sales.name}
        salesSlug={sales.slug}
        productName={product.name}
        productId={product.id}
      />
    </div>
  );
}
