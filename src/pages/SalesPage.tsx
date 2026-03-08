import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSalesProfile } from "@/hooks/useSalesProfile";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import SalesCard from "@/components/SalesCard";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import SalesNotFound from "@/components/SalesNotFound";
import { MessageCircle, Loader2 } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackContact } from "@/lib/metaPixel";

export default function SalesPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: sales, isLoading: salesLoading } = useSalesProfile(slug);
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (salesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!sales) {
    return <SalesNotFound />;
  }

  const filteredProducts = selectedCategory
    ? (products || []).filter((p) => p.category_id === selectedCategory)
    : products || [];

  const handleWhatsApp = () => {
    trackContact(sales.slug);
  };

  const waUrl = buildWhatsAppUrl(sales.phone, sales.name, "katalog produk");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-center px-4 py-3">
          <img src="/assets/logo-wift-hitam.png" alt="Wift Logo" className="h-8 w-auto" />
        </div>
      </header>
      <div className="mx-auto max-w-lg px-4 py-6">
        <SalesCard sales={sales} />

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsApp}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-5 py-3 text-sm font-semibold text-whatsapp-foreground shadow-sm transition-colors hover:bg-whatsapp-hover active:scale-[0.98]"
        >
          <MessageCircle className="h-4 w-4" />
          Hubungi via WhatsApp
        </a>

        <div className="mt-6">
          <h2 className="mb-3 text-lg font-bold text-foreground">Koleksi Produk</h2>

          {categories && categories.length > 0 && (
            <div className="mb-4">
              <CategoryFilter
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>
          )}

          {productsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada produk tersedia.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  salesSlug={sales.slug}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
