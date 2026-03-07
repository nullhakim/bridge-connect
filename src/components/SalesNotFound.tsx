import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export default function SalesNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <SearchX className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Link sales yang Anda cari tidak tersedia atau sudah tidak aktif.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Kembali ke Beranda
        </Link>
      </motion.div>
    </div>
  );
}
