import { motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import type { Product } from "@/data/mockSalesData";

interface ProductShowcaseProps {
  product: Product;
}

export default function ProductShowcase({ product }: ProductShowcaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="space-y-5"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-2xl bg-secondary">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
          </div>
        )}
        {product.price && (
          <div className="absolute bottom-3 right-3 rounded-full bg-card/90 px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur-sm">
            {product.price}
          </div>
        )}
      </div>

      {/* Headline */}
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.name}
        </p>
        <h1 className="text-2xl font-bold leading-tight text-foreground">
          {product.headline}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </div>

      {/* Benefits */}
      <ul className="space-y-3">
        {product.benefits.map((benefit, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
            className="flex items-start gap-3"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-whatsapp">
              <Check className="h-3 w-3 text-whatsapp-foreground" />
            </span>
            <span className="text-sm text-foreground">{benefit}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
