export function buildWhatsAppUrl(
  phone: string,
  salesName: string,
  productName: string
): string {
  const message = `Halo ${salesName}, saya ingin tanya tentang produk ${productName}. Bisa dibantu?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
