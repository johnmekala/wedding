import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useWeddingData } from "@/lib/useWeddingData";
import { SectionHeading } from "./Ornaments";
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

export function WeddingReelsSection() {
  const { weddingReelsSection } = useWeddingData();
  const rawItems = weddingReelsSection?.items || [];
  const items = rawItems.filter((item: any) => item.visible !== false && item.enabled !== false);

  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleInteractionStart = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setIsPaused(true);
  };

  const handleInteractionEnd = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  if (weddingReelsSection?.enabled === false) return null;
  if (items.length === 0) return null;

  // DYNAMIC REPETITION CALCULATION FOR ANY NUMBER OF REELS (1, 2, 3, 4, 5, etc.)
  // Guarantee unitTrack has at least 12 cards so it overflows any viewport width
  const K = Math.max(1, Math.ceil(12 / items.length));
  const unitTrack: typeof items = [];
  for (let i = 0; i < K; i++) {
    unitTrack.push(...items);
  }
  // Duplicate unitTrack twice so set 2 (50% to 100%) is 100% identical to set 1 (0% to 50%)
  const marqueeItems = [...unitTrack, ...unitTrack];

  // Dynamic duration based on unitTrack card count for steady scrolling speed
  const speed = weddingReelsSection?.autoScrollSpeed || "medium";
  const speedPerCardMap = { slow: 9, medium: 6, fast: 3.5 };
  const perCardDuration = speedPerCardMap[speed as keyof typeof speedPerCardMap] || 6;
  const duration = unitTrack.length * perCardDuration;

  const activeMedia = selectedItem !== null ? items[selectedItem] : null;

  return (
    <section id="wedding-reels" className="relative overflow-hidden bg-nearblack py-14 sm:py-24">
      {/* Dynamic Keyframe for Seamless Infinite Marquee Loop */}
      <style>{`
        @keyframes weddingReelsLoop {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>

      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, color-mix(in oklab, var(--gold) 12%, transparent) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          label={weddingReelsSection?.sectionLabel || "Celebration Highlights"}
          title={weddingReelsSection?.sectionTitle || "Reels"}
          tone="light"
        />
        {weddingReelsSection?.subtitle && (
          <p className="mt-3 text-center font-body text-sm text-ivory/70 italic max-w-xl mx-auto">
            {weddingReelsSection.subtitle}
          </p>
        )}
      </div>

      {/* Infinite Auto-Scroll Marquee Container */}
      <div
        className="group relative mt-14 overflow-hidden py-4"
        onMouseEnter={handleInteractionStart}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
      >
        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-nearblack to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-nearblack to-transparent sm:w-32" />

        {/* Seamless Scrolling Marquee Track */}
        <div
          className="flex w-max gap-5 sm:gap-7"
          style={{
            animationName: "weddingReelsLoop",
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationPlayState: isPaused ? "paused" : "running",
            willChange: "transform",
          }}
        >
          {marqueeItems.map((item, idx) => {
            const originalIndex = idx % items.length;
            const isVideo = item.type === "video";
            const displayImg = isVideo ? item.thumbnail || item.url : item.url;

            const handleCardClick = () => {
              if (item.instagramUrl && item.instagramUrl.trim() !== "") {
                window.open(item.instagramUrl, "_blank", "noopener,noreferrer");
              } else {
                setSelectedItem(originalIndex);
              }
            };

            return (
              <div
                key={`wr-${item.id}-${idx}`}
                onClick={handleCardClick}
                className="relative cursor-pointer overflow-hidden rounded-2xl border border-gold/30 bg-black/60 shadow-[0_10px_25px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:border-gold hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] flex-none w-56 sm:w-64 md:w-72 select-none"
              >
                {/* 9:16 Aspect Reel Container */}
                <div className="relative aspect-[9/16] w-full overflow-hidden bg-nearblack">
                  {isVideo ? (
                    <video
                      src={item.url}
                      poster={displayImg}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={displayImg}
                      alt={item.title || "Wedding reel"}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  )}

                  {/* Dark Gradient Overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-nearblack via-nearblack/20 to-transparent opacity-85" />

                  {/* Bottom Captions (NO Play/Pause overlays) */}
                  <div className="absolute bottom-4 inset-x-4 pointer-events-none">
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
              </div>
            );
          })}
        </div>
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
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-gold/20 px-6 py-4">
                <div>
                  <h3 className="font-display text-lg text-gold-light">
                    {activeMedia.title || "Wedding Reel"}
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

              {/* Player Body */}
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
                    alt={activeMedia.title || "Wedding Moment"}
                    className="h-full max-h-[70vh] w-full object-contain"
                  />
                )}

                {/* Previous / Next Stepper */}
                <button
                  onClick={(e) => { e.stopPropagation(); stepLightbox(-1); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-gold/40 bg-black/60 p-3 text-gold hover:bg-gold hover:text-nearblack transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); stepLightbox(1); }}
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
