import { useParams } from "react-router-dom";
import { getSalesPageData } from "@/data/mockSalesData";
import SalesCard from "@/components/SalesCard";
import ProductShowcase from "@/components/ProductShowcase";
import WhatsAppButton from "@/components/WhatsAppButton";
import SalesNotFound from "@/components/SalesNotFound";

export default function SalesPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? getSalesPageData(slug) : null;

  if (!data) {
    return <SalesNotFound />;
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-lg px-4 py-6">
        <SalesCard sales={data.sales} />
        <div className="mt-6">
          <ProductShowcase product={data.product} />
        </div>
      </div>
      <WhatsAppButton
        phone={data.sales.phone}
        salesName={data.sales.name}
        salesSlug={data.sales.slug}
        productName={data.product.name}
      />
    </div>
  );
}
