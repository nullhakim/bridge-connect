import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  mainImage: string | null;
  images: { id: string; image_url: string; sort_order: number }[];
  productName: string;
}

export default function ProductImageGallery({
  mainImage,
  images,
  productName,
}: ProductImageGalleryProps) {
  // Build full image list: main image first, then additional images
  const allImages: string[] = [];
  if (mainImage) allImages.push(mainImage);
  images
    .sort((a, b) => a.sort_order - b.sort_order)
    .forEach((img) => {
      if (img.image_url !== mainImage) allImages.push(img.image_url);
    });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentImage = allImages[selectedIndex] || null;

  if (allImages.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl bg-secondary">
        <div className="flex aspect-[4/3] w-full items-center justify-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-2xl bg-secondary">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={currentImage!}
            alt={`${productName} - ${selectedIndex + 1}`}
            className="aspect-[4/3] w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>
      </div>

      {/* Thumbnail Strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {allImages.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                i === selectedIndex
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <img
                src={url}
                alt={`${productName} thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
