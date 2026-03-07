import { useParams, Link } from "react-router-dom";
import { getSalesProfile, getProductById } from "@/data/mockSalesData";
import ProductShowcase from "@/components/ProductShowcase";
import WhatsAppButton from "@/components/WhatsAppButton";
import SalesNotFound from "@/components/SalesNotFound";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const { slug, productId } = useParams<{ slug: string; productId: string }>();
  const sales = slug ? getSalesProfile(slug) : null;
  const product = productId ? getProductById(productId) : null;

  if (!sales || !product) {
    return <SalesNotFound />;
  }

  return (
    <div className="min-h-screen bg-background pb-28">
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

        <ProductShowcase product={product} />
      </div>
      <WhatsAppButton
        phone={sales.phone}
        salesName={sales.name}
        salesSlug={sales.slug}
        productName={product.name}
      />
    </div>
  );
}
