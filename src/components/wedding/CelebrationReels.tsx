import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useWeddingData } from "@/lib/useWeddingData";
import { SectionHeading } from "./Ornaments";
import { Play, Image as ImageIcon, X, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

export function CelebrationReels() {
  const { reelsSection } = useWeddingData();
  const rawItems = reelsSection?.items || [];
  const items = rawItems.filter((item: any) => item.visible !== false);

  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const speed = reelsSection?.autoScrollSpeed || "medium";
  const speedDurationMap = {
    slow: 55,
    medium: 35,
    fast: 20,
  };
  const duration = speedDurationMap[speed as keyof typeof speedDurationMap] || 35;

  const closeLightbox = useCallback(() => setSelectedItem(null), []);

  const stepLightbox = useCallback(
    (dir: number) => {
      setSelectedItem((curr) => {
        if (curr === null || items.length === 0) return null;
        return (curr + dir + items.length) % items.length;
      });
    },
    [items.length]
  );

  useEffect(() => {
    if (selectedItem === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") stepLightbox(1);
      if (e.key === "ArrowLeft") stepLightbox(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedItem, closeLightbox, stepLightbox]);

  if (items.length === 0) return null;

  // Duplicate items array for seamless infinite marquee loop
  const marqueeItems = [...items, ...items, ...items];

  const activeMedia = selectedItem !== null ? items[selectedItem] : null;

  return (
    <section id="reels" className="relative overflow-hidden bg-nearblack py-12 sm:py-20">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, color-mix(in oklab, var(--amber) 12%, transparent) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          label={reelsSection?.sectionLabel || "Celebration Highlights"}
          title={reelsSection?.sectionTitle || "Moments In Motion"}
        />
      </div>

      {/* Infinite Auto-Scroll Marquee Container */}
      <div className="group relative mt-16 overflow-hidden py-4">
        {/* Left & Right Edge Gradient Fade Mask */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-nearblack to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-nearblack to-transparent sm:w-32" />

        {/* Scrolling Track */}
        <motion.div
          className="flex w-max gap-5 sm:gap-7"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{
            ease: "linear",
            duration: duration,
            repeat: Infinity,
          }}
          style={{ willChange: "transform" }}
        >
          {marqueeItems.map((item, idx) => {
            const originalIndex = idx % items.length;
            const isVideo = item.type === "video";
            const displayImg = isVideo ? item.thumbnail || item.url : item.url;

            return (
              <motion.div
                key={`${item.id}-${idx}`}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedItem(originalIndex)}
                className="relative cursor-pointer overflow-hidden rounded-2xl border border-gold/30 bg-black/60 shadow-[0_10px_25px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-all hover:border-gold hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] flex-none w-56 sm:w-64 md:w-72"
              >
                {/* Media Container */}
                <div className="relative aspect-[9/16] w-full overflow-hidden bg-nearblack">
                  {isVideo ? (
                    <video
                      src={item.url}
                      poster={displayImg}
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={displayImg}
                      alt={item.title || "Celebration photo"}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-nearblack via-nearblack/20 to-transparent opacity-85" />

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-gold/40 bg-black/60 px-2.5 py-1 backdrop-blur-md">
                    {isVideo ? (
                      <>
                        <Play className="h-3 w-3 text-gold fill-gold" />
                        <span className="label-caps text-[0.65rem] text-gold-light">Reel</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-3 w-3 text-gold-light" />
                        <span className="label-caps text-[0.65rem] text-gold-light">Photo</span>
                      </>
                    )}
                  </div>

                  {/* Center Play Button Overlay for Videos */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 bg-black/50 text-gold shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110">
                        <Play className="h-5 w-5 fill-gold ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Bottom Captions */}
                  <div className="absolute bottom-4 inset-x-4">
                    {item.title && (
                      <h4 className="font-display text-base font-semibold text-ivory line-clamp-1">
                        {item.title}
                      </h4>
                    )}
                    {item.caption && (
                      <p className="mt-1 font-body text-xs text-ivory/70 line-clamp-2 leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Lightbox / Video Player Modal */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-gold/40 bg-nearblack shadow-[0_0_50px_rgba(201,168,76,0.3)]"
            >
              {/* Top Controls Header */}
              <div className="flex items-center justify-between border-b border-gold/20 px-6 py-4">
                <div>
                  <h3 className="font-display text-lg text-gold-light">
                    {activeMedia.title || "Celebration Highlight"}
                  </h3>
                  {activeMedia.caption && (
                    <p className="text-xs text-ivory/60 mt-0.5">{activeMedia.caption}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {activeMedia.type === "video" && (
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="rounded-full border border-gold/30 p-2 text-gold hover:bg-gold/10 transition-colors"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                  )}
                  <button
                    onClick={closeLightbox}
                    className="rounded-full border border-gold/30 p-2 text-gold hover:bg-gold/10 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Media Content Body */}
              <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center min-h-[450px]">
                {activeMedia.type === "video" ? (
                  <video
                    src={activeMedia.url}
                    poster={activeMedia.thumbnail}
                    autoPlay
                    controls
                    muted={isMuted}
                    loop
                    playsInline
                    className="h-full max-h-[70vh] w-full object-contain"
                  />
                ) : (
                  <img
                    src={activeMedia.url}
                    alt={activeMedia.title || "Celebration Photo"}
                    className="h-full max-h-[70vh] w-full object-contain"
                  />
                )}

                {/* Left & Right Stepper Arrows */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    stepLightbox(-1);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-gold/40 bg-black/60 p-3 text-gold hover:bg-gold hover:text-nearblack transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    stepLightbox(1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-gold/40 bg-black/60 p-3 text-gold hover:bg-gold hover:text-nearblack transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
