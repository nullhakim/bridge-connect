import { useParams, Link } from "react-router-dom";
import { getSalesProfile } from "@/data/mockSalesData";
import { useProduct } from "@/hooks/useProducts";
import WhatsAppButton from "@/components/WhatsAppButton";
import SalesNotFound from "@/components/SalesNotFound";
import { ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const { slug, productId } = useParams<{ slug: string; productId: string }>();
  const sales = slug ? getSalesProfile(slug) : null;
  const { data: product, isLoading } = useProduct(productId);

  if (!sales) {
    return <SalesNotFound />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return <SalesNotFound />;
  }

  const formattedPrice = product.price
    ? `Rp ${product.price.toLocaleString("id-ID")}`
    : null;

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-lg px-4 py-6">
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
          {/* Product Image */}
          <div className="relative overflow-hidden rounded-2xl bg-secondary">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
              </div>
            )}
            {formattedPrice && (
              <div className="absolute bottom-3 right-3 rounded-full bg-card/90 px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur-sm">
                {formattedPrice}
              </div>
            )}
          </div>

          {/* Info */}
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
