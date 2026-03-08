import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ShoppingBag, X, ChevronLeft, ChevronRight } from "lucide-react";
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
  const allImages: string[] = [];
  if (mainImage) allImages.push(mainImage);
  images
    .sort((a, b) => a.sort_order - b.sort_order)
    .forEach((img) => {
      if (img.image_url !== mainImage) allImages.push(img.image_url);
    });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const currentImage = allImages[selectedIndex] || null;

  const goNext = useCallback(() => {
    setSelectedIndex((i) => (i + 1) % allImages.length);
  }, [allImages.length]);

  const goPrev = useCallback(() => {
    setSelectedIndex((i) => (i - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const handleDragEnd = useCallback(
    (_: any, info: PanInfo) => {
      const threshold = 50;
      if (info.offset.x < -threshold) goNext();
      else if (info.offset.x > threshold) goPrev();
    },
    [goNext, goPrev]
  );

  if (allImages.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl bg-secondary">
        <div className="flex aspect-[4/3] w-full items-center justify-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
        </div>
      </div>
    );
  }

  const thumbCount = allImages.length;

  return (
    <>
      <div className="space-y-3">
        {/* Main Image */}
        <div
          className="relative cursor-zoom-in overflow-hidden rounded-2xl bg-secondary"
          onClick={() => setZoomed(true)}
        >
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
          {allImages.length > 1 && (
            <div className="absolute bottom-2 right-2 rounded-full bg-foreground/60 px-2 py-0.5 text-xs font-medium text-background">
              {selectedIndex + 1}/{allImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Strip — only if more than 1 image */}
        {thumbCount > 1 && (
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${thumbCount}, minmax(0, 1fr))`,
            }}
          >
            {allImages.map((url, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-all",
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

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={() => setZoomed(false)}
          >
            {/* Close button */}
            <button
              className="absolute right-4 top-4 z-10 rounded-full bg-foreground/20 p-2 text-background backdrop-blur-sm transition-colors hover:bg-foreground/40"
              onClick={() => setZoomed(false)}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev / Next */}
            {allImages.length > 1 && (
              <>
                <button
                  className="absolute left-3 z-10 rounded-full bg-foreground/20 p-2 text-background backdrop-blur-sm transition-colors hover:bg-foreground/40"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  className="absolute right-3 z-10 rounded-full bg-foreground/20 p-2 text-background backdrop-blur-sm transition-colors hover:bg-foreground/40"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <motion.img
              key={currentImage}
              src={currentImage!}
              alt={`${productName} - ${selectedIndex + 1}`}
              className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-6 rounded-full bg-foreground/30 px-3 py-1 text-sm font-medium text-background backdrop-blur-sm">
                {selectedIndex + 1} / {allImages.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
