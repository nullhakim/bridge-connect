import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackContact } from "@/lib/metaPixel";
import { insertLead } from "@/lib/leads";

interface WhatsAppButtonProps {
  phone: string;
  salesName: string;
  salesSlug: string;
  productName: string;
  productId?: string;
}

export default function WhatsAppButton({
  phone,
  salesName,
  salesSlug,
  productName,
  productId,
}: WhatsAppButtonProps) {
  const url = buildWhatsAppUrl(phone, salesName, productName);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    trackContact(salesSlug);

    insertLead({
      salesId: salesSlug,
      productId,
    });

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 px-4 pb-[env(safe-area-inset-bottom,8px)] pt-3 backdrop-blur-md"
    >
      <div className="mx-auto max-w-lg">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-whatsapp px-6 py-3.5 text-base font-semibold text-whatsapp-foreground shadow-lg transition-colors hover:bg-whatsapp-hover active:scale-[0.98]"
        >
          <MessageCircle className="h-5 w-5" />
          Hubungi via WhatsApp
        </a>
        <p className="mt-2 pb-1 text-center text-xs text-muted-foreground">
          Chat langsung dengan {salesName}
        </p>
      </div>
    </motion.div>
  );
}
