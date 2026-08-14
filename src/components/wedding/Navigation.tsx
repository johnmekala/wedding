import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Menu, X, Music, VolumeX } from "lucide-react";
import { useWeddingAudio } from "@/lib/weddingAudio";
import { useWeddingData } from "@/lib/useWeddingData";

export function MusicToggle({ compact = false }: { compact?: boolean }) {
  const { isPlaying, toggleMusic } = useWeddingAudio();
  return (
    <button
      onClick={toggleMusic}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? "Turn background music off" : "Turn background music on"}
      title={isPlaying ? "Mute background music" : "Play background music"}
      className={`group relative flex items-center gap-2 transition-all duration-500 ${
        compact
          ? "border border-gold/40 px-2.5 py-1.5 text-gold-light hover:bg-gold/10"
          : "rounded-full border border-gold/45 bg-nearblack/75 px-3.5 py-1.5 text-gold-light backdrop-blur-md hover:bg-gold/15 hover:border-gold shadow-[0_0_15px_rgba(201,168,76,0.2)]"
      }`}
    >
      {isPlaying ? (
        <span className="relative flex items-center justify-center">
          <Music className="h-3.5 w-3.5 flex-shrink-0 text-gold animate-pulse" />
          <span className="absolute -inset-1 rounded-full bg-gold/20 animate-ping" />
        </span>
      ) : (
        <VolumeX className="h-3.5 w-3.5 flex-shrink-0 text-gold-light/60" />
      )}
      <span className="label-caps" style={{ fontSize: "0.58rem", letterSpacing: "0.25em" }}>
        {isPlaying ? "♫ Music On" : "♫ Music Off"}
      </span>
    </button>
  );
}

/** Floating Luxury Music Control fixed at bottom right */
export function FloatingMusicButton() {
  const { isPlaying, toggleMusic } = useWeddingAudio();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1 }}
      className="fixed bottom-6 right-6 z-[95] flex items-center justify-center"
    >
      <button
        onClick={toggleMusic}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Turn background music off" : "Turn background music on"}
        title={isPlaying ? "Click to mute background music" : "Click to play background music"}
        className="group relative flex items-center gap-2.5 rounded-full border border-gold/45 bg-nearblack/80 px-4 py-2.5 text-gold-light shadow-[0_4px_25px_rgba(0,0,0,0.5),0_0_20px_rgba(201,168,76,0.25)] backdrop-blur-md transition-all duration-500 hover:scale-105 hover:border-gold hover:bg-nearblack/90 active:scale-95"
      >
        {isPlaying ? (
          <>
            <span className="relative flex h-3.5 w-3.5 items-center justify-center">
              <Music className="h-3.5 w-3.5 flex-shrink-0 text-gold animate-pulse" />
              <span className="absolute -inset-1 rounded-full bg-gold/20 animate-ping" />
            </span>
            <span className="label-caps text-[0.62rem] tracking-[0.25em] text-gold-light">
              ♫ Music On
            </span>
          </>
        ) : (
          <>
            <VolumeX className="h-3.5 w-3.5 flex-shrink-0 text-gold-light/60" />
            <span className="label-caps text-[0.62rem] tracking-[0.25em] text-gold-light/70">
              ♫ Music Off
            </span>
          </>
        )}
      </button>
    </motion.div>
  );
}

export function Navigation() {
  const data = useWeddingData();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 80));

  const visibleLinks = (data.navigation?.links || [])
    .filter((l) => l.visible !== false)
    .filter((l) => l.href !== "#rsvp" && !l.label.toUpperCase().includes("RSVP") && l.id !== "rsvp");
  const midIndex = Math.ceil(visibleLinks.length / 2);
  const leftLinks = visibleLinks.slice(0, midIndex);
  const rightLinks = visibleLinks.slice(midIndex);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className={`fixed inset-x-0 top-0 z-[90] transition-all duration-700 ${
          scrolled
            ? "border-b border-gold/18 bg-nearblack/88 py-3 backdrop-blur-lg"
            : "border-b border-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between lg:justify-center gap-6 sm:gap-8 lg:gap-10 px-5">
          {/* Left nav links */}
          <nav className="hidden items-center justify-end gap-6 sm:gap-8 lg:flex" aria-label="Primary">
            {leftLinks.map((l) => (
              <a
                key={l.id || l.href}
                href={l.href}
                className="label-caps text-ivory/65 transition-colors duration-500 hover:text-gold-light"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Center logo — custom monogram */}
          <a href="#home" aria-label="Home — Sriya & Janak" className="flex items-center gap-3 shrink-0 mx-2">
            <img
              src={data.navigation?.logo || "/images/monogram.png"}
              alt="S & J Wedding Monogram"
              className="h-9 w-9 rounded-full object-cover object-center overflow-hidden border border-gold/40 shadow-sm"
              style={{ filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--gold) 45%, transparent))" }}
            />
          </a>

          {/* Right nav links */}
          <nav className="hidden items-center justify-start gap-6 sm:gap-8 lg:flex" aria-label="Secondary">
            {rightLinks.map((l) => (
              <a
                key={l.id || l.href}
                href={l.href}
                className="label-caps text-ivory/65 transition-colors duration-500 hover:text-gold-light"
              >
                {l.label}
              </a>
            ))}
            {data.navigation?.ctaVisible &&
              data.navigation?.ctaUrl !== "#rsvp" &&
              !data.navigation?.ctaLabel?.toUpperCase().includes("RSVP") && (
                <a
                  href={data.navigation.ctaUrl}
                  className="rounded border border-gold/45 bg-gold/15 px-4 py-1.5 label-caps text-[0.65rem] text-gold-light hover:bg-gold hover:text-nearblack transition-all shadow-[0_0_12px_rgba(201,168,76,0.2)]"
                >
                  {data.navigation.ctaLabel}
                </a>
              )}
          </nav>

          {/* Mobile: music toggle + hamburger button */}
          <div className="flex items-center gap-3 lg:hidden">
            <MusicToggle compact />
            <button
              onClick={() => setMenu(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center border border-gold/40 text-gold-light transition-colors hover:bg-gold/10"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      {menu && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[110] lg:hidden overflow-y-auto"
          style={{ background: "var(--maroon-deep)" }}
        >
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-12 pointer-events-none">
            <svg
              viewBox="0 0 300 300"
              aria-hidden="true"
              className="h-full w-full text-gold"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            >
              {Array.from({ length: 14 }).map((_, i) => (
                <circle key={i} cx="150" cy="150" r={10 + i * 10} />
              ))}
              <path d="M150 10 L290 150 L150 290 L10 150 Z" />
            </svg>
          </div>

          <button
            onClick={() => setMenu(false)}
            aria-label="Close menu"
            className="absolute top-5 right-5 z-20 grid h-11 w-11 place-items-center border border-gold/45 text-gold-light transition-colors hover:bg-gold/12"
          >
            <X className="h-4 w-4" />
          </button>

          <nav className="relative flex min-h-full flex-col items-center justify-center gap-6 py-12 px-6 text-center">
            <img
              src={data.navigation?.logo || "/images/monogram.png"}
              alt="Monogram"
              className="h-16 w-16 rounded-full object-cover object-center overflow-hidden mb-1 border border-gold/40 shadow-md"
            />
            <p className="font-heading text-xs tracking-[0.35em] text-gold-light/70 uppercase">
              {data.settings.weddingDateLabel || "27 August 2026"}
            </p>
            <MusicToggle />
            {visibleLinks.map((l, i) => (
              <motion.a
                key={l.id || l.href}
                href={l.href}
                onClick={() => setMenu(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 + i * 0.05 }}
                className="font-display text-2xl tracking-[0.08em] text-ivory transition-colors hover:text-gold-light"
              >
                {l.label}
              </motion.a>
            ))}
          </nav>
        </motion.div>
      )}
    </>
  );
}

