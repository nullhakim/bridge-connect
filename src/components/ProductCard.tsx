import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import type { SupabaseProduct } from "@/hooks/useProducts";

interface ProductCardProps {
  product: SupabaseProduct;
  salesSlug: string;
  index: number;
}

function formatPrice(price: number | null): string {
  if (price === null) return "";
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export default function ProductCard({ product, salesSlug, index }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 + index * 0.06 }}
    >
      <Link
        to={`/${salesSlug}/${product.slug}`}
        className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
      >
        {/* Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          {product.category_name && (
            <p className="truncate text-xs text-muted-foreground">{product.category_name}</p>
          )}
          <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
            {product.name}
          </p>
          {product.price !== null && (
            <p className="mt-1 text-sm font-bold text-foreground">{formatPrice(product.price)}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
