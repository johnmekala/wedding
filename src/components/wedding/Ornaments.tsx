import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";


export function GaneshaEmblem({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 140"
      aria-label="Lord Ganesha — Shri Ganeshaya Namah"
      role="img"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Crown / Kireetam */}
      <path d="M60 6 L52 18 L60 14 L68 18 Z" strokeWidth="0.8" />
      <path d="M48 20 L38 14 L42 24" strokeWidth="0.8" />
      <path d="M72 20 L82 14 L78 24" strokeWidth="0.8" />
      <circle cx="60" cy="10" r="2.5" fill="currentColor" opacity="0.6" />
      <circle cx="46" cy="16" r="1.8" fill="currentColor" opacity="0.5" />
      <circle cx="74" cy="16" r="1.8" fill="currentColor" opacity="0.5" />

      {/* Ears */}
      <path d="M28 42 C14 36, 10 52, 18 60 C22 64, 32 62, 36 56" />
      <path d="M22 46 C18 44, 17 54, 22 56" strokeWidth="0.7" opacity="0.6" />
      <path d="M92 42 C106 36, 110 52, 102 60 C98 64, 88 62, 84 56" />
      <path d="M98 46 C102 44, 103 54, 98 56" strokeWidth="0.7" opacity="0.6" />

      {/* Head */}
      <path d="M36 56 C32 72, 36 84, 42 90 L44 96 Q60 104 76 96 L78 90 C84 84, 88 72, 84 56 C82 44, 74 32, 60 30 C46 32, 38 44, 36 56 Z" />

      {/* Eyes */}
      <ellipse cx="48" cy="52" rx="5" ry="4.5" />
      <ellipse cx="72" cy="52" rx="5" ry="4.5" />
      <circle cx="49.5" cy="51.5" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="73.5" cy="51.5" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="50.5" cy="50.5" r="0.8" fill="currentColor" />
      <circle cx="74.5" cy="50.5" r="0.8" fill="currentColor" />

      {/* Third eye / bindi */}
      <ellipse cx="60" cy="44" rx="3" ry="2" strokeWidth="0.8" opacity="0.7" />
      <circle cx="60" cy="44" r="0.9" fill="currentColor" opacity="0.6" />

      {/* Tilak */}
      <path d="M54 40 L60 37 L66 40" strokeWidth="0.7" opacity="0.6" />

      {/* Trunk — curved right */}
      <path d="M52 68 C50 74, 48 82, 52 90 C56 96, 66 96, 70 90 C74 84, 72 76, 68 70" strokeWidth="1.2" />
      <path d="M52 90 C50 94, 44 96, 42 94" strokeWidth="0.9" />

      {/* Modak in trunk tip */}
      <circle cx="41" cy="95" r="4" strokeWidth="0.8" opacity="0.7" />

      {/* Mouth / smile */}
      <path d="M50 72 Q60 78 70 72" strokeWidth="1" />

      {/* Necklace */}
      <path d="M40 84 Q60 92 80 84" strokeWidth="0.7" opacity="0.6" />
      <circle cx="52" cy="88" r="1.2" fill="currentColor" opacity="0.4" />
      <circle cx="60" cy="90" r="1.4" fill="currentColor" opacity="0.4" />
      <circle cx="68" cy="88" r="1.2" fill="currentColor" opacity="0.4" />

      {/* Body */}
      <path d="M44 96 C38 106, 36 118, 40 128 L44 132 L76 132 L80 128 C84 118, 82 106, 76 96" />

      {/* Belly button */}
      <circle cx="60" cy="114" r="3.5" strokeWidth="0.8" opacity="0.6" />

      {/* Dhoti / waist band */}
      <path d="M40 100 Q60 106 80 100" strokeWidth="0.7" opacity="0.6" />

      {/* Arms — 4 */}
      {/* Upper left — blessing/abhaya */}
      <path d="M40 90 C28 82, 20 70, 22 58 C24 50, 32 48, 36 52" strokeWidth="0.9" />
      <path d="M22 60 L18 64 M20 56 L16 58" strokeWidth="0.7" opacity="0.7" />
      {/* Upper right — holds trishul/ankusha */}
      <path d="M80 90 C92 82, 100 70, 98 58 C96 50, 88 48, 84 52" strokeWidth="0.9" />
      <path d="M100 62 L106 58 M100 56 L106 52 M100 50 L106 54" strokeWidth="0.7" opacity="0.7" />
      {/* Lower left — holds lotus */}
      <path d="M42 104 C32 108, 26 116, 28 124" strokeWidth="0.9" />
      <path d="M28 124 Q26 130, 30 132 M28 124 Q24 128, 26 134" strokeWidth="0.7" opacity="0.7" />
      {/* Lower right — holds modak */}
      <path d="M78 104 C88 108, 94 116, 92 124" strokeWidth="0.9" />
      <circle cx="93" cy="127" r="4" strokeWidth="0.8" opacity="0.7" />

      {/* Lotus base */}
      <path d="M44 132 Q60 138 76 132" />
      <path d="M40 133 Q60 142 80 133" strokeWidth="0.7" opacity="0.5" />
    </svg>
  );
}

export function GopuramSilhouette({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 400 600"
      aria-hidden="true"
      className={className}
      style={style}

      fill="currentColor"
      stroke="none"
      preserveAspectRatio="xMidYMax meet"
    >
      {/* Base platform */}
      <rect x="0" y="560" width="400" height="40" opacity="0.9" />
      <rect x="20" y="548" width="360" height="16" opacity="0.85" />

      {/* Main temple body */}
      <rect x="60" y="480" width="280" height="80" opacity="0.9" />
      <rect x="40" y="468" width="320" height="16" opacity="0.8" />

      {/* Gopuram tiers — widening toward bottom */}
      <polygon points="170,30 230,30 260,90 280,90 290,140 295,140 300,190 298,190 295,240 285,240 280,280 290,280 300,320 295,320 290,360 280,360 270,400 280,400 290,440 280,440 275,468 125,468 120,440 110,440 120,400 110,400 100,360 110,360 100,320 105,320 100,280 120,280 110,240 115,240 105,190 110,190 105,140 110,140 120,90 140,90 Z"
        opacity="0.9" />

      {/* Tier decorative bands */}
      <rect x="150" y="88" width="100" height="4" opacity="0.7" />
      <rect x="140" y="138" width="120" height="4" opacity="0.7" />
      <rect x="128" y="188" width="144" height="4" opacity="0.7" />
      <rect x="118" y="238" width="164" height="4" opacity="0.7" />
      <rect x="112" y="278" width="176" height="4" opacity="0.7" />
      <rect x="108" y="318" width="184" height="4" opacity="0.7" />
      <rect x="108" y="358" width="184" height="4" opacity="0.7" />
      <rect x="110" y="398" width="180" height="4" opacity="0.7" />
      <rect x="112" y="438" width="176" height="4" opacity="0.7" />

      {/* Finial / Kalasam */}
      <ellipse cx="200" cy="18" rx="10" ry="15" opacity="0.95" />
      <circle cx="200" cy="5" r="5" opacity="0.95" />
      <rect x="196" y="28" width="8" height="6" opacity="0.9" />

      {/* Flanking towers */}
      <polygon points="60,150 90,150 100,190 104,190 108,240 104,240 100,280 96,280 90,320 94,320 90,360 80,360 70,320 66,320 60,280 56,280 52,240 56,240 52,190 56,190 Z"
        opacity="0.75" />
      <ellipse cx="75" cy="140" rx="6" ry="10" opacity="0.8" />

      <polygon points="340,150 310,150 300,190 296,190 292,240 296,240 300,280 304,280 310,320 306,320 310,360 320,360 330,320 334,320 340,280 344,280 348,240 344,240 348,190 344,190 Z"
        opacity="0.75" />
      <ellipse cx="325" cy="140" rx="6" ry="10" opacity="0.8" />

      {/* Gopuram figure relief silhouettes (devotional) */}
      {[170, 192, 214, 236].map((x, i) => (
        <ellipse key={i} cx={x} cy={60} rx="4" ry="6" opacity="0.3" />
      ))}
      {[160, 185, 200, 215, 240].map((x, i) => (
        <ellipse key={i} cx={x} cy={110} rx="3.5" ry="5" opacity="0.25" />
      ))}
    </svg>
  );
}

export function DiyaFlame({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 40 60"
      aria-hidden="true"
      className={className}
      style={style}
      fill="none"
    >
      {/* Diya bowl */}
      <path
        d="M8 42 Q7 50 10 54 Q20 58 30 54 Q33 50 32 42 Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M12 42 Q20 44 28 42"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.5"
      />
      {/* Wick */}
      <line x1="20" y1="28" x2="20" y2="42" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />

      {/* Flame — outer */}
      <path
        d="M20 28 C16 22, 13 16, 16 10 C18 5, 22 4, 24 10 C26 16, 24 22, 20 28 Z"
        fill="var(--diya-warm, oklch(0.78 0.15 55))"
        style={{ animation: "diyaFlicker 2.8s ease-in-out infinite", transformOrigin: "20px 28px" }}
        opacity="0.95"
      />
      {/* Flame — inner glow */}
      <path
        d="M20 26 C18 22, 16 18, 18 13 C19 10, 22 9, 23 13 C25 18, 22 23, 20 26 Z"
        fill="oklch(0.96 0.12 82)"
        style={{ animation: "diyaFlicker 2.1s ease-in-out 0.3s infinite", transformOrigin: "20px 26px" }}
        opacity="0.9"
      />
      {/* Flame tip */}
      <path
        d="M20 22 C19 18, 20 12, 20 9 C21 12, 21 18, 20 22 Z"
        fill="white"
        style={{ animation: "diyaFlicker 1.6s ease-in-out 0.6s infinite", transformOrigin: "20px 22px" }}
        opacity="0.8"
      />

      {/* Glow halo */}
      <ellipse
        cx="20"
        cy="18"
        rx="12"
        ry="16"
        fill="var(--amber, oklch(0.732 0.132 62))"
        opacity="0.12"
        style={{ animation: "diyaFlicker 3.2s ease-in-out 0.2s infinite", transformOrigin: "20px 18px" }}
      />
    </svg>
  );
}

export function LotusMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 46"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <path d="M60 42c0-12 6-22 14-27-1 12-5 21-14 27Z" />
      <path d="M60 42c0-12-6-22-14-27 1 12 5 21 14 27Z" />
      <path d="M60 42c4-10 13-17 23-19-4 10-12 17-23 19Z" />
      <path d="M60 42c-4-10-13-17-23-19 4 10 12 17 23 19Z" />
      <path d="M60 42c7-6 18-9 29-8-8 6-19 9-29 8Z" />
      <path d="M60 42c-7-6-18-9-29-8 8 6 19 9 29 8Z" />
      <path d="M2 42h30M88 42h30" />
    </svg>
  );
}

export function GoldDivider({
  className = "",
  tone = "gold",
}: {
  className?: string;
  tone?: "gold" | "ivory";
}) {
  return (
    <div
      className={`flex items-center justify-center gap-4 ${tone === "gold" ? "text-gold-deep" : "text-gold-light"} ${className}`}
    >
      <span className="gold-rule w-16 sm:w-28" />
      <LotusMark className="h-4 w-24 opacity-80 sm:h-5 sm:w-32" />
      <span className="gold-rule w-16 sm:w-28" />
    </div>
  );
}

export function TempleArch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M8 500V190C8 90 94 8 200 8s192 82 192 182v310" />
      <path d="M22 500V192C22 100 102 22 200 22s178 78 178 170v308" />
      {/* Ornamental torana at top */}
      <path d="M200 8v-6M186 30h28" />
      <path d="M170 32 Q160 24 152 28 Q148 34 156 38" strokeWidth="0.8" opacity="0.7" />
      <path d="M230 32 Q240 24 248 28 Q252 34 244 38" strokeWidth="0.8" opacity="0.7" />
      {/* Side kolam dots */}
      <circle cx="8" cy="260" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="392" cy="260" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="12" cy="320" r="1.5" fill="currentColor" opacity="0.3" />
      <circle cx="388" cy="320" r="1.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function PremiumBorder({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    >
      {/* Outer frame */}
      <rect x="4" y="4" width="792" height="592" strokeWidth="1.2" opacity="0.6" />
      <rect x="14" y="14" width="772" height="572" strokeWidth="0.8" opacity="0.45" />
      <rect x="24" y="24" width="752" height="552" strokeWidth="1" opacity="0.7" />

      {/* Corner ornaments */}
      {/* Top-left */}
      <path d="M4 80 L4 4 L80 4" strokeWidth="2" opacity="0.9" />
      <path d="M24 60 Q36 36 60 24" opacity="0.5" />
      <circle cx="44" cy="44" r="6" opacity="0.4" />
      <path d="M38 38 Q44 32 50 38 Q44 44 38 38" opacity="0.35" />

      {/* Top-right */}
      <path d="M796 80 L796 4 L720 4" strokeWidth="2" opacity="0.9" />
      <path d="M776 60 Q764 36 740 24" opacity="0.5" />
      <circle cx="756" cy="44" r="6" opacity="0.4" />
      <path d="M762 38 Q756 32 750 38 Q756 44 762 38" opacity="0.35" />

      {/* Bottom-left */}
      <path d="M4 520 L4 596 L80 596" strokeWidth="2" opacity="0.9" />
      <path d="M24 540 Q36 564 60 576" opacity="0.5" />
      <circle cx="44" cy="556" r="6" opacity="0.4" />

      {/* Bottom-right */}
      <path d="M796 520 L796 596 L720 596" strokeWidth="2" opacity="0.9" />
      <path d="M776 540 Q764 564 740 576" opacity="0.5" />
      <circle cx="756" cy="556" r="6" opacity="0.4" />

      {/* Top center ornament */}
      <path d="M360 4 L400 20 L440 4" opacity="0.5" />
      <path d="M380 4 Q400 14 420 4" opacity="0.4" />
      <circle cx="400" cy="18" r="4" fill="currentColor" opacity="0.3" />

      {/* Bottom center ornament */}
      <path d="M360 596 L400 580 L440 596" opacity="0.5" />
      <circle cx="400" cy="582" r="4" fill="currentColor" opacity="0.3" />

      {/* Left center ornament */}
      <path d="M4 260 L20 300 L4 340" opacity="0.5" />
      <circle cx="18" cy="300" r="4" fill="currentColor" opacity="0.3" />

      {/* Right center ornament */}
      <path d="M796 260 L780 300 L796 340" opacity="0.5" />
      <circle cx="782" cy="300" r="4" fill="currentColor" opacity="0.3" />

      {/* Lotus at center top/bottom */}
      <path d="M390 8 C388 12, 388 18, 390 22 C392 18, 392 12, 390 8 Z M400 6 C398 10, 398 16, 400 20 C402 16, 402 10, 400 6 Z M410 8 C408 12, 408 18, 410 22 C412 18, 412 12, 410 8 Z" opacity="0.3" />
    </svg>
  );
}

export function SectionHeading({
  label,
  title,
  tone = "dark",
  className = "",
}: {
  label?: string;
  title: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={`text-center ${className}`}>
      {label ? (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className={`label-caps ${tone === "dark" ? "text-temple" : "text-gold-light/80"}`}
        >
          {label}
        </motion.p>
      ) : null}
      <motion.h2
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.3, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className={`mt-5 font-display text-[2.4rem] leading-[1.05] tracking-[0.02em] sm:text-6xl ${
          tone === "dark" ? "text-maroon" : "text-ivory"
        }`}
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, scaleX: 0.4 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <GoldDivider className="mt-7" tone={tone === "dark" ? "gold" : "ivory"} />
      </motion.div>
    </div>
  );
}

export function WeddingMonogram({
  className = "",
  animate = true,
}: {
  className?: string;
  animate?: boolean;
}) {
  const reduce = useReducedMotion();
  const draw = animate && !reduce;
  return (
    <svg viewBox="0 0 200 220" aria-label="S & J monogram" role="img" className={className}>
      <defs>
        <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--gold-deep)" />
          <stop offset="45%" stopColor="var(--gold-light)" />
          <stop offset="100%" stopColor="var(--gold-deep)" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#mg)" strokeWidth="1.6" strokeLinecap="round">
        {[
          "M100 30c-38 0-68 30-68 68s30 68 68 68 68-30 68-68-30-68-68-68",
          "M92 76c-4-6-12-8-19-5-8 3-11 12-6 18 5 7 18 7 22 15 4 7-1 15-9 17-7 2-15-2-18-8",
          "M108 72v42c0 10-7 17-16 17-6 0-12-3-15-8",
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            initial={draw ? { pathLength: 0, opacity: 0 } : false}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 2.1, delay: 0.3 * i, ease: "easeInOut" }}
          />
        ))}
      </g>

      <text
        x="100"
        y="216"
        textAnchor="middle"
        className="label-caps"
        fill="var(--gold-deep)"
        style={{ fontSize: 9, letterSpacing: "0.3em" }}
      >
        SRIYA &amp; JANAK
      </text>
    </svg>
  );
}

export function LuxuryButton({
  children,
  onClick,
  href,
  variant = "gold",
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "gold" | "outline";
  className?: string;
  type?: "button" | "submit";
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-3 px-8 py-4 label-caps transition-all duration-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";
  const skin =
    variant === "gold"
      ? "text-maroon-deep [background:var(--gradient-gold)] shadow-[var(--shadow-gold)] hover:brightness-108"
      : "border border-gold/50 text-gold-light hover:border-gold hover:bg-gold/10";
  const inner = (
    <>
      <span className="pointer-events-none absolute inset-[3px] border border-current/25" />
      <span className="relative">{children}</span>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={`${base} ${skin} ${className}`}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={`${base} ${skin} ${className}`}>
      {inner}
    </button>
  );
}

export function FloralCorner({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <path d="M4 4c40 6 70 26 88 54M4 4c6 42 26 72 56 90" />
      <path d="M30 22c10-4 20 2 20 12s-10 16-19 12" />
      <path d="M22 30c-4 10 2 20 12 20s16-10 12-19" />
      <path d="M62 52c12-6 24 0 26 12M52 62c-6 12 0 24 12 26" />
      <path d="M96 76c14 2 22 12 24 26M76 96c2 14 12 22 26 24" />
      <path d="M120 116c10 6 16 16 16 30M116 120c6 10 16 16 30 16" />
      <circle cx="40" cy="34" r="2.5" />
      <circle cx="74" cy="68" r="2" />
      <circle cx="108" cy="102" r="2" />
      {/* Extra jasmine buds */}
      <circle cx="58" cy="18" r="1.5" opacity="0.5" />
      <circle cx="18" cy="58" r="1.5" opacity="0.5" />
    </svg>
  );
}
