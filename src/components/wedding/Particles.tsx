import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";

type Kind = "jasmine" | "blush" | "marigold" | "gold" | "akshata";

const TONES: Record<Kind, string> = {
  jasmine: "oklch(0.97 0.02 92)",
  blush: "oklch(0.86 0.05 12)",
  marigold: "oklch(0.78 0.13 62)",
  gold: "oklch(0.8 0.09 82)",
  akshata: "oklch(0.95 0.01 88)",
};

type Particle = {
  id: number;
  kind: Kind;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  spin: number;
  opacity: number;
};

/** Slow, GPU-friendly petal / akshata fall. Purely decorative. */
export function FloatingPetals({
  count = 18,
  kinds = ["jasmine", "blush", "marigold", "gold"],
  className = "",
}: {
  count?: number;
  kinds?: Kind[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const particles = useMemo<Particle[]>(() => {
    const rand = (seed: number) => {
      const x = Math.sin(seed * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      kind: kinds[i % kinds.length] as Kind,
      left: rand(i + 1) * 100,
      size: 5 + rand(i + 9) * 9,
      delay: rand(i + 21) * 16,
      duration: 16 + rand(i + 33) * 16,
      drift: (rand(i + 45) - 0.5) * 140,
      spin: 180 + rand(i + 57) * 420,
      opacity: 0.3 + rand(i + 69) * 0.45,
    }));
  }, [count, kinds]);

  if (reduce || !ready) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <style>{`
        @keyframes petalFall {
          0% { transform: translate3d(0,-12vh,0) rotate(0deg); opacity: 0; }
          12% { opacity: var(--o); }
          88% { opacity: var(--o); }
          100% { transform: translate3d(var(--dx),108vh,0) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>
      {particles.map((p) => {
        const isGrain = p.kind === "gold" || p.kind === "akshata";
        return (
          <span
            key={p.id}
            style={{
              position: "absolute",
              top: 0,
              left: `${p.left}%`,
              width: isGrain ? p.size * 0.42 : p.size,
              height: isGrain ? p.size * 0.72 : p.size * 0.68,
              background: TONES[p.kind],
              borderRadius: isGrain ? "999px" : "60% 8% 60% 8%",
              filter: p.kind === "gold" ? "blur(0.3px)" : "blur(0.2px)",
              boxShadow: p.kind === "gold" ? `0 0 6px ${TONES.gold}` : undefined,
              ["--dx" as string]: `${p.drift}px`,
              ["--rot" as string]: `${p.spin}deg`,
              ["--o" as string]: String(p.opacity),
              animation: `petalFall ${p.duration}s linear ${p.delay}s infinite`,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </div>
  );
}

export function GoldenHaze({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <style>{`
        @keyframes hazeDrift {
          0%,100% { transform: translate3d(-4%,0,0) scale(1.05); opacity: .38; }
          50% { transform: translate3d(5%,-3%,0) scale(1.18); opacity: .6; }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          inset: "-20%",
          background:
            "radial-gradient(ellipse at 50% 62%, color-mix(in oklab, var(--amber) 30%, transparent) 0%, transparent 62%)",
          animation: "hazeDrift 22s ease-in-out infinite",
        }}
      />
    </div>
  );
}
