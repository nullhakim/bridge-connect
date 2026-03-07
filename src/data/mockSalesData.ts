export interface SalesProfile {
  slug: string;
  name: string;
  phone: string; // WhatsApp number with country code
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
  price?: string;
}

export interface SalesPageData {
  sales: SalesProfile;
  product: Product;
}

const salesPages: Record<string, SalesPageData> = {
  "rina-cosmetics": {
    sales: {
      slug: "rina-cosmetics",
      name: "Rina Aulia",
      phone: "6281234567890",
      photo: "",
      bio: "Konsultan kecantikan berpengalaman 5 tahun. Siap membantu Anda menemukan produk terbaik untuk kulit Anda.",
      role: "Beauty Consultant",
    },
    product: {
      id: "glow-serum-01",
      name: "Glow Radiance Serum",
      headline: "Kulit Glowing dalam 14 Hari — Tanpa Efek Samping",
      description:
        "Serum wajah premium dengan kandungan Niacinamide 10% dan Hyaluronic Acid untuk mencerahkan dan melembapkan kulit secara intensif.",
      image: "",
      benefits: [
        "Mencerahkan kulit kusam dalam 2 minggu",
        "Mengecilkan pori-pori secara alami",
        "Formula ringan, cepat meresap",
        "Sudah teruji dermatologis & BPOM",
        "Cocok untuk semua jenis kulit",
      ],
      price: "Rp 189.000",
    },
  },
  "budi-tech": {
    sales: {
      slug: "budi-tech",
      name: "Budi Santoso",
      phone: "6289876543210",
      photo: "",
      bio: "Tech enthusiast & gadget specialist. Saya bantu carikan gadget terbaik sesuai budget Anda.",
      role: "Tech Specialist",
    },
    product: {
      id: "smart-watch-x1",
      name: "SmartFit Watch X1",
      headline: "Jam Tangan Pintar dengan Fitur Kesehatan Lengkap",
      description:
        "Smartwatch premium dengan monitor detak jantung, SpO2, GPS built-in, dan baterai tahan 7 hari.",
      image: "",
      benefits: [
        "Monitor detak jantung & SpO2 24/7",
        "GPS built-in untuk tracking olahraga",
        "Baterai tahan hingga 7 hari",
        "Water resistant 5ATM",
        "100+ watch faces tersedia",
      ],
      price: "Rp 899.000",
    },
  },
  "sarah-fashion": {
    sales: {
      slug: "sarah-fashion",
      name: "Sarah Putri",
      phone: "6281122334455",
      photo: "",
      bio: "Fashion stylist profesional. Bantu Anda tampil stylish setiap hari dengan koleksi terbaik kami.",
      role: "Fashion Stylist",
    },
    product: {
      id: "premium-bag-01",
      name: "Elara Premium Tote Bag",
      headline: "Tas Kulit Premium — Elegan untuk Setiap Kesempatan",
      description:
        "Tote bag dari kulit sintetis premium dengan desain minimalis dan kompartemen fungsional.",
      image: "",
      benefits: [
        "Bahan kulit sintetis premium grade A",
        "Desain timeless & minimalis",
        "Kompartemen laptop 14 inch",
        "Tali bahu adjustable",
        "Garansi 1 tahun",
      ],
      price: "Rp 459.000",
    },
  },
};

export function getSalesPageData(slug: string): SalesPageData | null {
  return salesPages[slug] || null;
}

export function getAllSlugs(): string[] {
  return Object.keys(salesPages);
}
