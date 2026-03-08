import { useState, useCallback, useRef, useEffect } from "react";
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

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const imgRef = useRef<HTMLImageElement>(null);
  const zoomContainerRef = useRef<HTMLDivElement>(null);
  const pinchRef = useRef<{
    startDist: number;
    startScale: number;
    startMid: { x: number; y: number };
    startTranslate: { x: number; y: number };
  } | null>(null);

  const scaleRef = useRef(1);
  const translateRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    scaleRef.current = scale;
    translateRef.current = translate;
  }, [scale, translate]);

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
      if (scale > 1.1) return;
      const threshold = 50;
      if (info.offset.x < -threshold) goNext();
      else if (info.offset.x > threshold) goPrev();
    },
    [goNext, goPrev, scale]
  );

  useEffect(() => {
    const container = zoomContainerRef.current;
    if (!container || !zoomed) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;

      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const mid = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };

      pinchRef.current = {
        startDist: dist,
        startScale: scaleRef.current,
        startMid: mid,
        startTranslate: { ...translateRef.current },
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      const pinch = pinchRef.current;
      if (e.touches.length !== 2 || !pinch) return;

      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const mid = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };

      const nextScale = Math.min(5, Math.max(1, pinch.startScale * (dist / pinch.startDist)));
      const dx = mid.x - pinch.startMid.x;
      const dy = mid.y - pinch.startMid.y;

      setScale(nextScale);
      setTranslate({
        x: pinch.startTranslate.x + dx,
        y: pinch.startTranslate.y + dy,
      });
    };

    const onTouchEnd = () => {
      pinchRef.current = null;
      setScale((currentScale) => {
        if (currentScale <= 1.05) {
          setTranslate({ x: 0, y: 0 });
          return 1;
        }
        return currentScale;
      });
    };

    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [zoomed]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
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
    },
    [scale, resetZoomState]
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

      <AnimatePresence>
        {zoomed && (
          <motion.div
            ref={zoomContainerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 touch-none"
            onClick={() => {
              if (scale <= 1.1) {
                resetZoomState();
                setZoomed(false);
              }
            }}
          >
            <button
              className="absolute right-4 top-4 z-10 rounded-full bg-foreground/20 p-2 text-background backdrop-blur-sm transition-colors hover:bg-foreground/40"
              onClick={() => {
                resetZoomState();
                setZoomed(false);
              }}
            >
              <X className="h-5 w-5" />
            </button>

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
              className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain select-none"
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
            />

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
