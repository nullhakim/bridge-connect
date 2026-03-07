export interface SalesProfile {
  slug: string;
  name: string;
  phone: string;
  photo: string;
  bio: string;
  role: string;
}

export interface Product {
  id: string;
  name: string;
  headline: string;
  description: string;
  image: string;
  benefits: string[];
  price: string;
  badge?: string; // e.g. "New", "Best Seller", "Limited"
  category: string;
}

export interface SalesPageData {
  sales: SalesProfile;
  products: Product[];
}

// Shared product catalog
const productCatalog: Product[] = [
  {
    id: "kemeja-oxford-01",
    name: "Kemeja Oxford Slim Fit",
    headline: "Kemeja Oxford Premium — Tampil Rapi Setiap Hari",
    description:
      "Kemeja oxford dengan bahan katun premium yang breathable dan nyaman dipakai seharian. Potongan slim fit modern cocok untuk formal maupun semi-casual.",
    image: "",
    benefits: [
      "Bahan 100% katun oxford premium",
      "Potongan slim fit modern",
      "Jahitan rapi double stitch",
      "Tersedia 6 pilihan warna",
      "Perawatan mudah, anti kusut",
    ],
    price: "Rp 289.000",
    badge: "Best Seller",
    category: "Kemeja",
  },
  {
    id: "celana-chino-01",
    name: "Celana Chino Stretch",
    headline: "Chino Stretch Premium — Nyaman Sepanjang Hari",
    description:
      "Celana chino dengan teknologi stretch 4-way yang memberikan kebebasan bergerak tanpa mengorbankan tampilan rapi.",
    image: "",
    benefits: [
      "Bahan stretch 4-way premium",
      "Slim fit dengan sedikit taper",
      "Waistband dengan hook clasp",
      "Tersedia 5 warna netral",
      "Cocok untuk kerja & hangout",
    ],
    price: "Rp 329.000",
    badge: "New",
    category: "Celana",
  },
  {
    id: "rompi-formal-01",
    name: "Rompi Formal Classic",
    headline: "Rompi Classic — Elevate Your Style",
    description:
      "Rompi formal dengan cutting presisi dan bahan wool blend yang memberikan kesan elegan dan profesional.",
    image: "",
    benefits: [
      "Bahan wool blend premium",
      "Cutting presisi dan rapi",
      "Lining satin halus",
      "Adjustable back strap",
      "Cocok untuk acara formal & semi-formal",
    ],
    price: "Rp 399.000",
    category: "Rompi",
  },
  {
    id: "kaos-essential-01",
    name: "Kaos Essential Cotton",
    headline: "Kaos Premium — Basic yang Tidak Biasa",
    description:
      "Kaos dengan bahan combed cotton 30s yang super lembut dan adem. Potongan regular fit yang flattering untuk semua body type.",
    image: "",
    benefits: [
      "Combed cotton 30s ultra soft",
      "Regular fit flattering",
      "Pre-shrunk, tidak menyusut",
      "Jahitan rantai di leher",
      "Tersedia 10+ warna",
    ],
    price: "Rp 149.000",
    badge: "Best Seller",
    category: "Kaos",
  },
  {
    id: "kemeja-flannel-01",
    name: "Kemeja Flannel Premium",
    headline: "Flannel Premium — Hangat & Stylish",
    description:
      "Kemeja flannel dengan bahan brushed cotton yang lembut dan hangat. Pattern klasik yang timeless untuk gaya casual.",
    image: "",
    benefits: [
      "Bahan brushed cotton lembut",
      "Pattern klasik timeless",
      "Double pocket design",
      "Regular fit comfortable",
      "Cocok untuk layering",
    ],
    price: "Rp 259.000",
    badge: "New",
    category: "Kemeja",
  },
  {
    id: "celana-jogger-01",
    name: "Jogger Pants Premium",
    headline: "Jogger Premium — Santai Tapi Tetap Keren",
    description:
      "Jogger pants dengan bahan french terry yang nyaman dan elastis. Desain modern dengan detail zipper pocket.",
    image: "",
    benefits: [
      "Bahan french terry premium",
      "Elastic waistband dengan drawstring",
      "Zipper side pocket",
      "Ribbed ankle cuff",
      "Versatile untuk berbagai occasion",
    ],
    price: "Rp 279.000",
    category: "Celana",
  },
];

const salesProfiles: Record<string, SalesProfile> = {
  "rina-fashion": {
    slug: "rina-fashion",
    name: "Rina Aulia",
    phone: "6281234567890",
    photo: "",
    bio: "Fashion consultant berpengalaman 5 tahun. Siap membantu Anda menemukan style terbaik.",
    role: "Fashion Consultant",
  },
  "budi-style": {
    slug: "budi-style",
    name: "Budi Santoso",
    phone: "6289876543210",
    photo: "",
    bio: "Men's fashion specialist. Saya bantu carikan outfit terbaik sesuai kebutuhan Anda.",
    role: "Style Specialist",
  },
  "sarah-collection": {
    slug: "sarah-collection",
    name: "Sarah Putri",
    phone: "6281122334455",
    photo: "",
    bio: "Fashion stylist profesional. Bantu Anda tampil stylish setiap hari dengan koleksi terbaik kami.",
    role: "Fashion Stylist",
  },
};

export function getSalesPageData(slug: string): SalesPageData | null {
  const sales = salesProfiles[slug];
  if (!sales) return null;
  return { sales, products: productCatalog };
}

export function getProductById(productId: string): Product | null {
  return productCatalog.find((p) => p.id === productId) || null;
}

export function getSalesProfile(slug: string): SalesProfile | null {
  return salesProfiles[slug] || null;
}

export function getAllSlugs(): string[] {
  return Object.keys(salesProfiles);
}
