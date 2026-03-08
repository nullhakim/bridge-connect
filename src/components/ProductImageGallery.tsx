import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ShoppingBag, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  mainImage: string | null;
  images: { id: string; image_url: string; sort_order: number }[];
  productName: string;
}

function getDistance(t1: React.Touch, t2: React.Touch) {
  return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
}

function getMidpoint(t1: React.Touch, t2: React.Touch) {
  return {
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  };
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

  // Pinch-to-zoom state
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const pinchRef = useRef<{
    startDist: number;
    startScale: number;
    startMid: { x: number; y: number };
    startTranslate: { x: number; y: number };
  } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const resetZoomState = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    pinchRef.current = null;
  }, []);

  const goNext = useCallback(() => {
    resetZoomState();
    setSelectedIndex((i) => (i + 1) % allImages.length);
  }, [allImages.length, resetZoomState]);

  const goPrev = useCallback(() => {
    resetZoomState();
    setSelectedIndex((i) => (i - 1 + allImages.length) % allImages.length);
  }, [allImages.length, resetZoomState]);

  const handleDragEnd = useCallback(
    (_: any, info: PanInfo) => {
      if (scale > 1.1) return; // don't swipe when zoomed in
      const threshold = 50;
      if (info.offset.x < -threshold) goNext();
      else if (info.offset.x > threshold) goPrev();
    },
    [goNext, goPrev, scale]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = getDistance(e.touches[0], e.touches[1]);
      const mid = getMidpoint(e.touches[0], e.touches[1]);
      pinchRef.current = {
        startDist: dist,
        startScale: scale,
        startMid: mid,
        startTranslate: { ...translate },
      };
    }
  }, [scale, translate]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const dist = getDistance(e.touches[0], e.touches[1]);
      const mid = getMidpoint(e.touches[0], e.touches[1]);
      const newScale = Math.min(
        5,
        Math.max(1, pinchRef.current.startScale * (dist / pinchRef.current.startDist))
      );
      const dx = mid.x - pinchRef.current.startMid.x;
      const dy = mid.y - pinchRef.current.startMid.y;
      setScale(newScale);
      setTranslate({
        x: pinchRef.current.startTranslate.x + dx,
        y: pinchRef.current.startTranslate.y + dy,
      });
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    pinchRef.current = null;
    if (scale <= 1.05) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [scale]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (scale > 1.1) {
      resetZoomState();
    } else {
      setScale(2.5);
      if (imgRef.current) {
        const rect = imgRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        setTranslate({
          x: (cx - e.clientX) * 1.5,
          y: (cy - e.clientY) * 1.5,
        });
      }
    }
  }, [scale, resetZoomState]);

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

        {/* Thumbnail Strip */}
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

      {/* Zoom Modal with Pinch-to-Zoom */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={() => {
              if (scale <= 1.1) {
                resetZoomState();
                setZoomed(false);
              }
            }}
          >
            {/* Close button */}
            <button
              className="absolute right-4 top-4 z-10 rounded-full bg-foreground/20 p-2 text-background backdrop-blur-sm transition-colors hover:bg-foreground/40"
              onClick={() => {
                resetZoomState();
                setZoomed(false);
              }}
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
              ref={imgRef}
              key={currentImage}
              src={currentImage!}
              alt={`${productName} - ${selectedIndex + 1}`}
              className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain touch-none select-none"
              style={{
                transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                transition: pinchRef.current ? "none" : "transform 0.2s ease-out",
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              drag={scale <= 1.1 && allImages.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={handleDragEnd}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={handleDoubleClick}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
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
