import { useParams } from "react-router-dom";
import { getSalesPageData } from "@/data/mockSalesData";
import SalesCard from "@/components/SalesCard";
import ProductCard from "@/components/ProductCard";
import SalesNotFound from "@/components/SalesNotFound";

export default function SalesPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? getSalesPageData(slug) : null;

  if (!data) {
    return <SalesNotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-6">
        <SalesCard sales={data.sales} />

        <div className="mt-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">Koleksi Produk</h2>
          <div className="grid grid-cols-2 gap-3">
            {data.products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                salesSlug={data.sales.slug}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
