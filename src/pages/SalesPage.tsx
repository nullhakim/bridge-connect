import { useParams } from "react-router-dom";
import { getSalesPageData } from "@/data/mockSalesData";
import SalesCard from "@/components/SalesCard";
import ProductCard from "@/components/ProductCard";
import SalesNotFound from "@/components/SalesNotFound";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackContact } from "@/lib/metaPixel";

export default function SalesPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? getSalesPageData(slug) : null;

  if (!data) {
    return <SalesNotFound />;
  }

  const handleWhatsApp = () => {
    trackContact(data.sales.slug);
  };

  const waUrl = buildWhatsAppUrl(data.sales.phone, data.sales.name, "katalog produk");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-6">
        <SalesCard sales={data.sales} />

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
