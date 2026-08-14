import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useWeddingData } from "@/lib/useWeddingData";
import { SectionHeading, GoldDivider } from "./Ornaments";
import { HeartHandshake, Sparkles, Quote } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export function SpecialBlessings() {
  const { specialBlessingsSection } = useWeddingData();
  const shouldReduceMotion = useReducedMotion();

  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);

  // Check section visibility toggle
  if (specialBlessingsSection?.enabled === false) {
    return null;
  }

  const rawItems = specialBlessingsSection?.items || [];
  const items = rawItems
    .filter((item) => item.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (items.length === 0) {
    return null;
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (shouldReduceMotion) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });

      // Spawn a subtle sparkle particle occasionally on mouse movement
      if (Math.random() < 0.25) {
        const newParticle: Particle = {
          id: particleIdRef.current++,
          x: x + (Math.random() * 24 - 12),
          y: y + (Math.random() * 24 - 12),
          size: Math.random() * 3.5 + 2,
          opacity: 0.85,
        };

        setParticles((prev) => [...prev.slice(-14), newParticle]);
      }
    },
    [shouldReduceMotion]
  );

  useEffect(() => {
    if (particles.length === 0 || shouldReduceMotion) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, opacity: p.opacity - 0.08, y: p.y - 0.8 }))
          .filter((p) => p.opacity > 0)
      );
    }, 45);
    return () => clearInterval(interval);
  }, [particles.length, shouldReduceMotion]);

  return (
    <section
      id="special-blessings"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: -1000, y: -1000 });
      }}
      className="relative overflow-hidden bg-[#121012] py-14 sm:py-20"
    >
      {/* Interactive Cursor Spotlight Glow */}
      {!shouldReduceMotion && isHovered && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500 z-0"
          style={{
            background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(201, 168, 76, 0.16), transparent 75%)`,
          }}
        />
      )}

      {/* Floating Sparkle Light Particles following Cursor */}
      {!shouldReduceMotion &&
        particles.map((p) => (
          <div
            key={p.id}
            className="pointer-events-none absolute rounded-full bg-gold-light shadow-[0_0_10px_#f5d77f] z-10"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, color-mix(in oklab, var(--amber) 10%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label={specialBlessingsSection?.sectionLabel || "Sacred Wishes"}
          title={specialBlessingsSection?.sectionTitle || "Special Blessings From"}
        />

        {/* Blessings Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className={`mt-16 grid gap-6 sm:gap-8 ${
            items.length === 1
              ? "grid-cols-1 max-w-2xl mx-auto"
              : items.length === 2
              ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {items.map((blessing, idx) => (
            <motion.div
              key={blessing.id || idx}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.4 }}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gold/30 bg-black/60 p-7 sm:p-8 shadow-[0_12px_35px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all hover:border-gold hover:shadow-[0_0_35px_rgba(201,168,76,0.28)] group"
            >
              {/* Top Accent Icon & Photo */}
              <div className="flex items-start justify-between gap-4">
                {blessing.image ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-gold/50 shadow-md flex-none">
                    <img
                      src={blessing.image}
                      alt={blessing.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold shadow-sm flex-none">
                    <HeartHandshake className="h-6 w-6" />
                  </div>
                )}

                <div className="flex items-center gap-1 text-gold/40 group-hover:text-gold transition-colors">
                  <Quote className="h-6 w-6 rotate-180" />
                </div>
              </div>

              {/* Message Body */}
              <div className="mt-6 flex-1">
                <p className="font-display text-base leading-relaxed text-ivory/90 italic sm:text-lg">
                  &ldquo;{blessing.message}&rdquo;
                </p>
              </div>

              {/* Divider & Person Metadata Footer */}
              <div className="mt-6 pt-5 border-t border-gold/20">
                <h3 className="font-display text-lg font-semibold text-gold-foil">
                  {blessing.name}
                </h3>
                {blessing.relationship && (
                  <p className="mt-1 label-caps text-xs text-gold-light/80 tracking-widest">
                    {blessing.relationship}
                  </p>
                )}
                {blessing.additionalText && (
                  <p className="mt-2 font-body text-xs text-ivory/60 italic">
                    {blessing.additionalText}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 flex justify-center">
          <GoldDivider tone="gold" />
        </div>
      </div>
    </section>
  );
}
