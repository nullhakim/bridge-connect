import { supabase } from "@/integrations/supabase/client";
import { getDeviceInfo } from "./metaPixel";

export async function insertLead({
  salesId,
  productId,
  utmSource,
  utmCampaign,
}: {
  salesId: string;
  productId?: string;
  utmSource?: string;
  utmCampaign?: string;
}) {
  const deviceInfo = getDeviceInfo();

  const { error } = await supabase.from("leads").insert({
    sales_id: salesId,
    product_id: productId || null,
    device_info: JSON.stringify(deviceInfo),
    utm_source: utmSource || null,
    utm_campaign: utmCampaign || null,
    fbp: getCookie("_fbp") || null,
    fbc: getCookie("_fbc") || null,
  });

  if (error) {
    console.error("[Lead Insert Error]", error);
  }
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}
