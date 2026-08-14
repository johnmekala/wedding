import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { gallery } from "@/data/wedding";
import { useWeddingData, type GalleryItem } from "@/lib/useWeddingData";
import { GoldDivider, SectionHeading } from "./Ornaments";

export function Gallery() {
  const { gallery: dynamicGallery, gallerySection } = useWeddingData();
  const galleryList = (dynamicGallery && dynamicGallery.length > 0 ? dynamicGallery : gallery).filter((g: GalleryItem) => g.visible !== false);
  const [open, setOpen] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + galleryList.length) % galleryList.length)),
    [galleryList.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  return (
    <section id="moments" className="relative overflow-hidden bg-ivory py-12 sm:py-20">
      {/* Subtle parchment warm overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, color-mix(in oklab, var(--champagne) 45%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading label={gallerySection?.sectionLabel || "Photographic Moments"} title={gallerySection?.sectionTitle || "Some Moments Become Forever"} />

        {/* Masonry grid */}
        <div className="mt-16 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {galleryList.map((g, i) => (
            <motion.button
              key={g.src + i}
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.4, delay: (i % 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative block w-full cursor-zoom-in overflow-hidden focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
              aria-label={`Open photograph: ${g.alt}`}
            >
              <img
                src={g.src}
                alt={g.alt}
                loading="lazy"
                decoding="async"
                className={`w-full object-cover transition-transform duration-[1600ms] ease-[var(--ease-silk)] group-hover:scale-[1.05] ${
                  g.span === "wide" ? "aspect-[4/3]" : "aspect-[3/4]"
                }`}
              />
              {/* Hover overlays */}
              <span className="pointer-events-none absolute inset-0 bg-nearblack/0 transition-colors duration-1000 group-hover:bg-nearblack/20" />
              {/* Animated gold border on hover */}
              <span className="pointer-events-none absolute inset-0 border border-gold/0 transition-all duration-700 group-hover:inset-2 group-hover:border-gold/60" />
              {/* Subtle bottom caption veil */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-0 overflow-hidden transition-all duration-700 group-hover:h-20"
                style={{
                  background: "linear-gradient(to top, color-mix(in oklab, var(--maroon-deep) 75%, transparent) 0%, transparent 100%)",
                }}
              />
              {/* Zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="rounded-full border border-gold/50 bg-nearblack/60 p-3 backdrop-blur-sm">
                  <ZoomIn className="h-4 w-4 text-gold-light" aria-hidden="true" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
        >
          <GoldDivider className="mt-16" />
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && galleryList[open] && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photograph viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-16"
            style={{ background: "color-mix(in oklab, var(--nearblack) 97%, transparent)" }}
            onTouchStart={(e) => {
              touchX.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              const start = touchX.current;
              const end = e.changedTouches[0]?.clientX;
              if (start != null && end != null && Math.abs(end - start) > 50) step(end < start ? 1 : -1);
              touchX.current = null;
            }}
          >
            {/* Frosted glass backdrop blur effect */}
            <div className="absolute inset-0 backdrop-blur-sm" />

            {/* Gold decorative lines at top/bottom */}
            <div className="absolute inset-x-0 top-0 h-px" style={{ background: "var(--gradient-gold)", opacity: 0.4 }} />
            <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "var(--gradient-gold)", opacity: 0.4 }} />

            {/* Controls */}
            <button
              onClick={close}
              aria-label="Close photograph"
              className="absolute top-4 right-4 z-10 grid h-11 w-11 place-items-center border border-gold/40 text-gold-light transition-colors hover:bg-gold/12 sm:top-6 sm:right-6"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={() => step(-1)}
              aria-label="Previous photograph"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 grid h-12 w-12 place-items-center border border-gold/35 text-gold-light transition-colors hover:bg-gold/12 sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Next photograph"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 grid h-12 w-12 place-items-center border border-gold/35 text-gold-light transition-colors hover:bg-gold/12 sm:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Image */}
            <motion.figure
              key={open}
              initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex max-h-full flex-col items-center"
            >
              <div className="relative">
                <img
                  src={galleryList[open]!.src}
                  alt={galleryList[open]!.alt}
                  className="max-h-[76svh] w-auto max-w-full object-contain"
                />
                {/* Gold frame in lightbox */}
                <span className="pointer-events-none absolute inset-2 border border-gold/30" />
              </div>
              <figcaption className="label-caps mt-6 max-w-md text-center text-ivory/55">
                {galleryList[open]!.alt}
              </figcaption>
              {/* Pagination dots */}
              <div className="mt-4 flex gap-1.5">
                {galleryList.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setOpen(i)}
                    aria-label={`Go to photograph ${i + 1}`}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: i === open ? "20px" : "6px",
                      background: i === open ? "var(--gold)" : "color-mix(in oklab, var(--ivory) 30%, transparent)",
                    }}
                  />
                ))}
              </div>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
