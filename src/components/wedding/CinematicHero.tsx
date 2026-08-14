import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { photos } from "@/data/wedding";
import { useWeddingData } from "@/lib/useWeddingData";
import { FloatingPetals } from "./Particles";
import { GoldDivider } from "./Ornaments";

function CinematicBackground({
  heroImage,
  videoUrl,
  videoLoaded,
  onVideoLoad,
}: {
  heroImage: string;
  videoUrl?: string | undefined;
  videoLoaded: boolean;
  onVideoLoad: () => void;
}) {
  const currentHeroImage = heroImage || photos.heroPhotograph;
  return (
    <>
      {/* Video layer (if supplied and loaded) */}
      {videoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-contain"
          style={{ objectFit: "contain", objectPosition: "center center", display: videoLoaded ? "block" : "none" }}
          src={videoUrl}
          poster={currentHeroImage}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={onVideoLoad}
          aria-hidden="true"
        />
      ) : null}

      <img
        src={currentHeroImage}
        alt="Couple Hero Photograph"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition: "50% 36%",
          display: videoLoaded && videoUrl ? "none" : "block",
        }}
        fetchPriority="high"
      />
    </>
  );
}

function TrioMediaSection({ hero, settings }: { hero: ReturnType<typeof useWeddingData>["hero"]; settings: ReturnType<typeof useWeddingData>["settings"] }) {
  const leftUrl = hero.leftImage?.url || photos.yay;
  const leftAlt = hero.leftImage?.alt || hero.brideName || "Bride";
  const rightUrl = hero.rightImage?.url || photos.mesmarizing;
  const rightAlt = hero.rightImage?.alt || hero.groomName || "Groom";
  
  const videoUrl = hero.centerVideo?.url || hero.heroVideoUrl;
  const posterUrl = hero.centerVideo?.poster || hero.heroImage || photos.heroPhotograph;
  const autoplay = hero.centerVideo?.autoplay ?? true;
  const muted = hero.centerVideo?.muted ?? true;
  const loop = hero.centerVideo?.loop ?? true;
  const playsInline = hero.centerVideo?.playsInline ?? true;

  const [videoError, setVideoError] = useState(false);

  const objectFitClass = hero.centerVideo?.objectFit === "cover" ? "object-cover" : "object-contain";

  return (
    <div className="relative z-10 mx-auto w-full max-w-[96vw] px-2 pt-16 pb-20 sm:px-4 lg:pt-20 lg:pb-28">
      {/* Full Screen Media Trio Row */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 items-center justify-center gap-4 md:grid-cols-12 md:h-[72svh] md:min-h-[520px] lg:gap-6"
      >
        {/* Left Image (Desktop: 3 cols, Full Height) */}
        <motion.div
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.5 }}
          className="hidden h-full md:col-span-3 md:block"
        >
          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-gold/40 bg-black/40 p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-sm">
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <img
                src={leftUrl}
                alt={leftAlt}
                className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-nearblack/85 via-transparent to-transparent" />
              <div className="absolute bottom-4 inset-x-4 text-center">
                <p className="label-caps text-xs text-gold-light tracking-widest truncate">{leftAlt}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Center Focal Full-Height Video / Image (Desktop: 6 cols, Mobile: full) */}
        <div className="h-[50svh] min-h-[320px] md:h-full md:col-span-6">
          <div className="relative h-full w-full overflow-hidden rounded-3xl border-2 border-gold/60 bg-black/80 p-2 shadow-[0_0_60px_rgba(201,168,76,0.35)]">
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-nearblack">
              {videoUrl && !videoError ? (
                <video
                  src={videoUrl}
                  poster={posterUrl}
                  autoPlay={autoplay}
                  muted={muted}
                  loop={loop}
                  playsInline={playsInline}
                  onError={() => setVideoError(true)}
                  className={`h-full w-full object-center ${objectFitClass}`}
                />
              ) : (
                <img
                  src={posterUrl}
                  alt="Center Hero Focal Visual"
                  className={`h-full w-full object-center ${objectFitClass}`}
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-nearblack/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Right Image (Desktop: 3 cols, Full Height) */}
        <motion.div
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.5 }}
          className="hidden h-full md:col-span-3 md:block"
        >
          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-gold/40 bg-black/40 p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-sm">
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <img
                src={rightUrl}
                alt={rightAlt}
                className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-nearblack/85 via-transparent to-transparent" />
              <div className="absolute bottom-4 inset-x-4 text-center">
                <p className="label-caps text-xs text-gold-light tracking-widest truncate">{rightAlt}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile-only Left & Right Image cards side-by-side below video */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
        <div className="relative overflow-hidden rounded-xl border border-gold/30 bg-black/40 p-1">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
            <img src={leftUrl} alt={leftAlt} className="h-full w-full object-cover" />
            <div className="absolute bottom-2 inset-x-2 text-center">
              <p className="label-caps text-[0.65rem] text-gold-light truncate">{leftAlt}</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-gold/30 bg-black/40 p-1">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
            <img src={rightUrl} alt={rightAlt} className="h-full w-full object-cover" />
            <div className="absolute bottom-2 inset-x-2 text-center">
              <p className="label-caps text-[0.65rem] text-gold-light truncate">{rightAlt}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Typography & Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.3 }}
        className="mt-10 text-center"
      >
        <p className="label-caps text-white" style={{ color: "#FFFFFF" }}>
          {hero.blessingText || "With the blessings of Lord Ganesha"}
        </p>

        <p className="mt-2.5 font-display text-base tracking-[0.14em] text-white italic sm:text-lg" style={{ color: "#FFFFFF" }}>
          {hero.welcomeText || "Welcome to the Wedding Celebration of"}
        </p>

        <h1 className="mt-5 font-display text-[2.4rem] leading-[1.08] tracking-[0.02em] sm:text-5xl lg:text-6xl text-white font-bold" style={{ color: "#FFFFFF", fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>
          <span className="text-white inline-block font-bold" style={{ color: "#FFFFFF", fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>{hero.brideName || "Hamsini Sriya Reddy"}</span>
          <span className="mx-3 font-heading text-lg text-white/80 font-bold" style={{ color: "#FFFFFF", fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>&amp;</span>
          <span className="text-white inline-block font-bold" style={{ color: "#FFFFFF", fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>{hero.groomName || "S. V. Janak Reddy"}</span>
        </h1>

        {hero.subheading && (
          <p className="mx-auto mt-4 max-w-xl font-display text-sm leading-relaxed text-ivory/75 italic sm:text-base">
            {hero.subheading}
          </p>
        )}

        <GoldDivider className="mt-7" tone="ivory" />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-ivory">
          <p className="font-heading text-xl tracking-[0.22em] sm:text-2xl">
            {hero.dateText || "27 AUGUST 2026"}
          </p>
          <span className="hidden sm:inline text-gold/60">•</span>
          <p className="label-caps text-gold-light">{settings.sumuhurtham}</p>
          <span className="hidden sm:inline text-gold/60">•</span>
          <p className="label-caps text-ivory/60">{settings.city}</p>
        </div>
      </motion.div>
    </div>
  );
}

export function extractYouTubeId(url: string | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);

  if (match && match[1] && match[1].length === 11) {
    return match[1];
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function CinematicHero() {
  const ref = useRef<HTMLElement>(null);
  const { hero, settings, heroVideo } = useWeddingData();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const ytId = heroVideo?.enabled !== false ? extractYouTubeId(heroVideo?.youtubeUrl) : null;

  const line = {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  const isMediaTrio = hero.layout === "media-trio";

  return (
    <section
      ref={ref}
      id="home"
      className={`relative flex min-h-[100svh] items-end justify-center overflow-hidden bg-nearblack ${
        isMediaTrio ? "pt-24" : ""
      }`}
    >
      {/* If Media Trio Layout is selected */}
      {isMediaTrio ? (
        <>
          {/* Subtle warm background glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, color-mix(in oklab, var(--amber) 20%, transparent) 0%, transparent 65%)",
            }}
            aria-hidden="true"
          />
          <FloatingPetals count={14} kinds={["jasmine", "gold"]} />
          <TrioMediaSection hero={hero} settings={settings} />
        </>
      ) : (
        /* Existing Full-Frame Hero Layout (Preserved Exactly) */
        <>
          {/* Background video/photo layer */}
          <div className="absolute inset-0 overflow-hidden">
            {ytId ? (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1&playsinline=1&autohide=1`}
                  title="Hero Background Video"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220vw] h-[220vh] min-w-full min-h-full pointer-events-none aspect-video object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  style={{ border: 0 }}
                />
              </div>
            ) : (
              <CinematicBackground
                heroImage={hero.heroImage}
                videoUrl={hero.heroVideoUrl}
                videoLoaded={videoLoaded}
                onVideoLoad={() => setVideoLoaded(true)}
              />
            )}
          </div>

          {/* Subtle bottom gradient vignette only — keeps couple faces 100% bright and visible */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, color-mix(in oklab, var(--nearblack) 94%, transparent) 0%, color-mix(in oklab, var(--nearblack) 65%, transparent) 25%, transparent 55%)",
            }}
          />

          {/* Atmospheric golden warm light at center */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, color-mix(in oklab, var(--amber) 16%, transparent) 0%, transparent 55%)",
              animation: "hazeDrift 28s ease-in-out infinite",
            }}
            aria-hidden="true"
          />

          {/* Left/right cinematic edge vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, color-mix(in oklab, var(--nearblack) 35%, transparent) 0%, transparent 20%, transparent 80%, color-mix(in oklab, var(--nearblack) 35%, transparent) 100%)",
            }}
            aria-hidden="true"
          />

          {/* Light rays */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute top-0 h-full"
                style={{
                  left: `${22 + i * 26}%`,
                  width: "8%",
                  background:
                    "linear-gradient(to bottom, color-mix(in oklab, var(--gold-light) 40%, transparent), transparent 60%)",
                  filter: "blur(24px)",
                  transformOrigin: "top center",
                  animation: `rayDrift ${22 + i * 6}s ease-in-out ${i * 3}s infinite`,
                  opacity: 0.06,
                }}
              />
            ))}
          </div>

          {/* Floating petals */}
          <FloatingPetals count={14} kinds={["jasmine", "gold"]} />

          {/* Hero text */}
          <motion.div
            style={{ opacity: fade, y: textY }}
            className="relative z-10 mx-auto w-full max-w-3xl px-6 pt-24 pb-32 text-center sm:pb-40"
          >
            <motion.div
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.35, delayChildren: 0.3 }}
            >
              <motion.p
                variants={line}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="label-caps text-white"
                style={{ color: "#FFFFFF" }}
              >
                {hero.blessingText || "With the blessings of Lord Ganesha"}
              </motion.p>

              <motion.p
                variants={line}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="mt-3 font-display text-lg tracking-[0.14em] text-white italic sm:text-xl"
                style={{ color: "#FFFFFF" }}
              >
                {hero.welcomeText || "Welcome to the Wedding Celebration of"}
              </motion.p>

              <motion.h1
                variants={line}
                transition={{ duration: 1.7, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 font-display text-[2.6rem] leading-[1.06] tracking-[0.02em] sm:text-6xl lg:text-7xl text-white font-bold"
                style={{ color: "#FFFFFF", fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}
              >
                <span className="text-white block font-bold" style={{ color: "#FFFFFF", fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>{hero.brideName || "Hamsini Sriya Reddy"}</span>
                <span className="my-2 block font-heading text-xl text-white/80 font-bold" style={{ color: "#FFFFFF", fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>&amp;</span>
                <span className="text-white block font-bold" style={{ color: "#FFFFFF", fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>{hero.groomName || "S. V. Janak Reddy"}</span>
              </motion.h1>

              <motion.div variants={line} transition={{ duration: 1.4 }}>
                <GoldDivider className="mt-8" tone="ivory" />
              </motion.div>

              <motion.div
                variants={line}
                transition={{ duration: 1.5 }}
                className="mt-8 flex flex-col items-center gap-2.5 text-ivory"
              >
                <p className="font-heading text-2xl tracking-[0.25em] sm:text-3xl">
                  {hero.dateText || "27 AUGUST 2026"}
                </p>
                <p className="label-caps text-gold-light">{settings.sumuhurtham}</p>
                <p className="label-caps mt-0.5 text-ivory/55">{settings.city}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}

      {/* Animated scroll indicator */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center"
      >
        <p className="label-caps mb-3 text-ivory/45">{hero.scrollText || "Scroll"}</p>
        <motion.div
          animate={{ scaleY: [0.2, 1, 0.2], originY: 0 }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto h-16 w-px bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}
