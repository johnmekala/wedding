import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useWeddingData } from "@/lib/useWeddingData";
import { FloatingPetals, GoldenHaze } from "./Particles";
import { DiyaFlame, GoldDivider, LuxuryButton, TempleArch } from "./Ornaments";

import { startMusicOnEntry } from "@/lib/weddingAudio";

function LightRays() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute top-0 h-full"
          style={{
            left: `${12 + i * 18}%`,
            width: "6%",
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--gold-light) 55%, transparent), color-mix(in oklab, var(--amber) 18%, transparent) 40%, transparent 80%)",
            filter: "blur(18px)",
            transformOrigin: "top center",
            animation: `rayDrift ${18 + i * 4}s ease-in-out ${i * 1.8}s infinite`,
            opacity: 0.08,
          }}
        />
      ))}
    </div>
  );
}

function DoorPanel({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div className="wood-grain relative h-full w-full overflow-hidden">
      {/* Deep shadow gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: isLeft
            ? "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.75) 100%)"
            : "linear-gradient(270deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Outer carved border */}
      <div className="absolute inset-4 border border-gold/30 sm:inset-7">
        <div className="absolute inset-2 border border-gold/18" />
        <div className="absolute inset-4 border border-gold/12" />

        {/* Panel carvings */}
        <div className="grid h-full grid-rows-4 gap-2 p-3">
          {[0, 1, 2, 3].map((r) => (
            <div key={r} className="relative border border-gold/20">
              <svg
                viewBox="0 0 120 100"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full text-gold/30"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.65"
              >
                <path d="M60 10c12 15 26 22 44 24-18 7-32 18-44 34-12-16-26-27-44-34 18-2 32-9 44-24Z" />
                <circle cx="60" cy="68" r="14" />
                <path d="M60 54v28M46 68h28" />
                <circle cx="22" cy="22" r="2" fill="currentColor" opacity="0.5" />
                <circle cx="98" cy="22" r="2" fill="currentColor" opacity="0.5" />
                <circle cx="22" cy="86" r="2" fill="currentColor" opacity="0.5" />
                <circle cx="98" cy="86" r="2" fill="currentColor" opacity="0.5" />
                <path d="M18 90h84M24 96h72" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Brass studs along center seam */}
      <div
        className={`absolute inset-y-0 ${isLeft ? "right-1" : "left-1"} flex w-3.5 flex-col items-center justify-around py-8`}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-full"
            style={{
              background: "var(--gradient-gold)",
              boxShadow: "0 0 8px color-mix(in oklab, var(--gold) 70%, transparent), 0 0 2px var(--gold-light)",
            }}
          />
        ))}
      </div>

      {/* Jasmine garland */}
      <div className={`absolute top-0 ${isLeft ? "right-0" : "left-0"} h-48 w-20 opacity-90`}>
        <svg viewBox="0 0 50 180" aria-hidden="true" className="h-full w-full" fill="none">
          <path
            d={isLeft ? "M40 0 Q38 90 35 180" : "M10 0 Q12 90 15 180"}
            stroke="var(--gold-deep)"
            strokeWidth="0.5"
            opacity="0.4"
          />
          {Array.from({ length: 16 }).map((_, i) => {
            const x = isLeft ? 40 - (i % 3) * 4 : 10 + (i % 3) * 4;
            const y = 6 + i * 11;
            const isJasmine = i % 3 !== 2;
            return isJasmine ? (
              <circle key={i} cx={x} cy={y} r="3.5" fill="oklch(0.97 0.02 92)" opacity="0.85" />
            ) : (
              <ellipse key={i} cx={x} cy={y} rx="4" ry="3" fill="oklch(0.78 0.13 62)" opacity="0.8" />
            );
          })}
        </svg>
      </div>

      {/* Diya on ledge */}
      <div className={`absolute bottom-12 ${isLeft ? "right-4" : "left-4"} h-10 w-8`}>
        <DiyaFlame className="h-full w-full text-amber" />
      </div>
    </div>
  );
}

/** Stage 0: Ganesha blessing. Stage 1: Doors closed. Stage 2: Doors open → gone. */
export function TempleDoorIntro({ onEnter }: { onEnter: () => void }) {
  const data = useWeddingData();
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<"ganesha" | "door" | "opening" | "gone">("ganesha");

  useEffect(() => {
    document.body.style.overflow = stage === "gone" ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [stage]);

  // Auto-advance from Ganesha blessing to door
  useEffect(() => {
    if (stage !== "ganesha") return;
    const t = window.setTimeout(() => setStage("door"), reduce ? 500 : 3400);
    return () => window.clearTimeout(t);
  }, [stage, reduce]);

  const handleEnter = () => {
    if (stage !== "door") return;
    startMusicOnEntry();
    setStage("opening");
    const wait = reduce ? 200 : 2800;
    window.setTimeout(() => {
      setStage("gone");
      onEnter();
    }, wait);
  };

  const ganeshaImg = data.intro?.ganeshaImage || data.hero?.ganeshaImage;

  return (
    <AnimatePresence>
      {stage !== "gone" && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-nearblack"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        >
          {/* ===== GANESHA BLESSING SCREEN ===== */}
          <AnimatePresence mode="wait">
            {stage === "ganesha" && (
              <motion.div
                key="ganesha"
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 1.2 }}
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 42%, oklch(0.18 0.04 30) 0%, var(--nearblack) 70%)",
                }}
              >
                {/* Warm diya glow at base */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "var(--gradient-diya)", opacity: 0.55 }}
                  aria-hidden="true"
                />
                <LightRays />

                {/* Animated diya pair + Ganesha photo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex flex-col items-center gap-0"
                >
                  {/* Diya pair flanking Ganesha */}
                  <div className="flex items-end justify-center gap-8 sm:gap-14">
                    <DiyaFlame className="mb-1 h-12 w-10 text-amber opacity-85" />

                    {/* Ganesha photograph */}
                    <div className="relative">
                      <div
                        className="absolute inset-[-20%] rounded-full"
                        style={{
                          background:
                            "radial-gradient(ellipse, color-mix(in oklab, var(--amber) 50%, transparent) 0%, transparent 70%)",
                          filter: "blur(20px)",
                          animation: "diyaFlicker 3.5s ease-in-out infinite",
                        }}
                        aria-hidden="true"
                      />
                      <img
                        src={ganeshaImg}
                        alt="Lord Ganesha"
                        className="relative h-36 w-36 rounded-full object-cover object-top sm:h-44 sm:w-44"
                        style={{
                          boxShadow:
                            "0 0 0 2px color-mix(in oklab, var(--gold) 50%, transparent), 0 0 40px 8px color-mix(in oklab, var(--amber) 35%, transparent)",
                        }}
                      />
                    </div>

                    <DiyaFlame className="mb-1 h-12 w-10 text-amber opacity-85" />
                  </div>

                  {/* Invocation text */}
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.4, delay: 0.7 }}
                    className="mt-8 text-center"
                  >
                    <p className="font-heading text-sm tracking-[0.42em] text-gold sm:text-base">
                      {data.settings.invocation}
                    </p>
                    <p className="mt-3 font-display text-base tracking-[0.14em] text-ivory/65 italic sm:text-lg">
                      {data.intro?.subtitle || "We begin with His blessings"}
                    </p>
                  </motion.div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2 }}
                  className="absolute bottom-10 label-caps text-gold-light/40"
                  aria-hidden="true"
                >
                  {data.intro?.openingText || "Opening shortly…"}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===== GOPURAM + DOOR SCREEN ===== */}
          {(stage === "door" || stage === "opening") && (
            <>
              {/* Background: couple photo covering whole screen */}
              <div className="absolute inset-0">
                <img
                  src={data.hero.heroImage}
                  alt="Sriya and Janak"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "50% 36%" }}
                />
                <div className="absolute inset-0 bg-[var(--gradient-veil)]" />
                <GoldenHaze />
                {stage === "opening" && <FloatingPetals count={24} />}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: stage === "opening" ? 1 : 0 }}
                  transition={{ duration: 3, delay: 0.4 }}
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 55%, color-mix(in oklab, var(--amber) 40%, transparent) 0%, transparent 60%)",
                  }}
                />
                {stage === "opening" && (
                  <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.8, delay: 1.4 }}
                    className="absolute inset-x-0 bottom-16 text-center font-display text-2xl tracking-[0.18em] text-ivory sm:text-3xl"
                  >
                    {data.intro?.welcomeText || "Welcome to our celebration"}
                  </motion.p>
                )}
              </div>

              <LightRays />

              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-40"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in oklab, var(--nearblack) 90%, transparent) 0%, transparent 100%)",
                }}
              />

              {/* The two doors */}
              {(["left", "right"] as const).map((side, i) => (
                <motion.div
                  key={side}
                  className="absolute inset-y-0 z-[10] w-1/2 origin-top"
                  style={{
                    [side]: 0,
                    transformStyle: "preserve-3d",
                    transformOrigin: side === "left" ? "left center" : "right center",
                    perspective: 1800,
                  }}
                  initial={{ rotateY: 0 }}
                  animate={
                    stage === "opening" ? { rotateY: side === "left" ? -105 : 105 } : { rotateY: 0 }
                  }
                  transition={{ duration: reduce ? 0.3 : 3, ease: [0.65, 0, 0.35, 1], delay: i * 0.06 }}
                >
                  <DoorPanel side={side} />
                </motion.div>
              ))}

              {/* Torana + content overlay */}
              <motion.div
                className="absolute inset-0 z-[20] flex flex-col items-center justify-center px-6 text-center"
                animate={{ opacity: stage === "opening" ? 0 : 1, scale: stage === "opening" ? 1.06 : 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              >
                <TempleArch className="pointer-events-none absolute inset-x-2 top-2 bottom-2 text-gold/20 sm:inset-x-10" />

                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.8, delay: 0.3 }}
                  className="relative flex flex-col items-center"
                >
                  <div className="relative">
                    <div
                      className="absolute inset-[-30%] rounded-full"
                      style={{
                        background: "radial-gradient(ellipse, color-mix(in oklab, var(--amber) 45%, transparent) 0%, transparent 70%)",
                        filter: "blur(14px)",
                        animation: "diyaFlicker 4s ease-in-out infinite",
                      }}
                      aria-hidden="true"
                    />
                    <img
                      src={ganeshaImg}
                      alt="Lord Ganesha"
                      className="relative h-14 w-14 rounded-full object-cover object-top sm:h-16 sm:w-16"
                      style={{
                        boxShadow: "0 0 0 1px color-mix(in oklab, var(--gold) 55%, transparent), 0 0 20px 4px color-mix(in oklab, var(--amber) 30%, transparent)",
                      }}
                    />
                  </div>
                  <p className="mt-4 font-heading text-xs tracking-[0.32em] text-gold-light sm:text-sm">
                    {data.settings.invocation}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.8, delay: 0.9 }}
                  className="mt-6"
                >
                  <p className="label-caps text-ivory/55">{data.intro?.celebrationPrefix || "A Celebration of"}</p>
                  <p className="mt-3 font-display text-xl tracking-[0.12em] text-ivory/88 sm:text-2xl">
                    {data.settings.tagline || "Love, Tradition & Togetherness"}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.8, delay: 1.4 }}
                  className="mt-8"
                >
                  <h1 className="font-display text-[2.1rem] leading-tight tracking-[0.03em] sm:text-5xl">
                    <span className="text-gold-foil block">{data.hero.brideName}</span>
                    <span className="my-2 block font-heading text-lg text-ivory/60 sm:text-xl">&amp;</span>
                    <span className="text-gold-foil block">{data.hero.groomName}</span>
                  </h1>
                  <GoldDivider className="mt-7" tone="ivory" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.6, delay: 2.0 }}
                  className="mt-10"
                >
                  <button
                    onClick={handleEnter}
                    className="group relative grid h-40 w-40 place-items-center rounded-full sm:h-48 sm:w-48"
                    aria-label="Enter our celebration"
                  >
                    <span
                      className="absolute inset-0 rounded-full transition-transform duration-1000 group-hover:scale-105"
                      style={{ background: "var(--gradient-gold)" }}
                    />
                    <span className="absolute inset-2 rounded-full border border-maroon-deep/30" />
                    <span className="absolute inset-4 rounded-full border border-maroon-deep/18" />
                    <span
                      className="absolute -inset-3 rounded-full border border-gold/30 transition-all duration-1000 group-hover:-inset-5"
                      aria-hidden="true"
                    />
                    <span
                      className="absolute -inset-6 rounded-full border border-gold/15"
                      style={{ animation: "slowZoom 4s ease-in-out infinite alternate" }}
                      aria-hidden="true"
                    />
                    <span className="relative px-6 font-heading text-[0.66rem] leading-relaxed tracking-[0.28em] text-maroon-deep uppercase sm:text-xs">
                      {data.intro?.buttonText || "Enter Our Celebration"}
                    </span>
                  </button>
                </motion.div>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { LuxuryButton };

