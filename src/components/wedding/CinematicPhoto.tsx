import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { FloatingPetals } from "./Particles";
import { GoldDivider } from "./Ornaments";

export function CinematicPhoto({
  src,
  alt,
  quote,
  objectPosition = "50% 40%",
  petals = false,
}: {
  src: string;
  alt: string;
  quote: string;
  objectPosition?: string;
  petals?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <div
      ref={ref}
      className="relative flex min-h-[80svh] items-center justify-center overflow-hidden bg-nearblack"
    >
      {/* Parallax image */}
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ objectPosition }}
        />
      </motion.div>

      {/* Layered vignettes */}
      <div className="absolute inset-0 bg-nearblack/42" />
      <div className="absolute inset-0 bg-[var(--gradient-veil)] opacity-65" />

      {/* Left/right edge darkening */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, color-mix(in oklab, var(--nearblack) 30%, transparent) 0%, transparent 20%, transparent 80%, color-mix(in oklab, var(--nearblack) 30%, transparent) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Warm amber light center */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, color-mix(in oklab, var(--amber) 14%, transparent) 0%, transparent 55%)",
        }}
      />

      {petals && <FloatingPetals count={12} kinds={["jasmine", "gold"]} />}

      {/* Quote text */}
      <motion.p
        initial={{ opacity: 0, y: 32, letterSpacing: "0.3em", filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, letterSpacing: "0.06em", filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-2xl px-8 text-center font-display text-3xl leading-snug text-ivory sm:text-4xl lg:text-5xl"
      >
        {quote}
      </motion.p>
    </div>
  );
}

export function QuoteReveal({ quote, author }: { quote: string; author?: string }) {
  return (
    <section className="parchment-rich relative overflow-hidden py-12 sm:py-20">
      {/* Subtle center warm glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, color-mix(in oklab, var(--champagne) 45%, transparent) 0%, transparent 62%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-3xl leading-snug text-maroon italic sm:text-4xl"
        >
          &ldquo;{quote}&rdquo;
        </motion.p>
        {author ? <p className="label-caps mt-8 text-temple">{author}</p> : null}
        <GoldDivider className="mt-10" />
      </div>
    </section>
  );
}
