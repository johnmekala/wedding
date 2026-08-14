import { motion } from "motion/react";
import { useWeddingData } from "@/lib/useWeddingData";
import { photos } from "@/data/wedding";
import { FloatingPetals, GoldenHaze } from "./Particles";
import {
  FloralCorner,
  GoldDivider,
  LuxuryButton,
  PremiumBorder,
  SectionHeading,
  TempleArch,
  WeddingMonogram,
} from "./Ornaments";
import { Phone, MessageCircle, Users as UsersIcon } from "lucide-react";

export function SacredMoment() {
  const { quotes } = useWeddingData();
  const lines = quotes?.sacredMomentLines || [
    "Two hearts.",
    "Two families.",
    "One sacred promise.",
    "A promise for a lifetime.",
  ];
  return (
    <section
      id="wedding"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-nearblack"
    >
      <motion.img
        src={quotes?.yesImg || photos.yes}
        alt="Sriya and Janak in a quiet golden moment"
        loading="lazy"
        initial={{ scale: 1.16 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 16, ease: "linear" }}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "55% 30%" }}
      />

      <div className="absolute inset-0 bg-nearblack/50" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, color-mix(in oklab, var(--nearblack) 30%, transparent) 0%, transparent 18%, transparent 82%, color-mix(in oklab, var(--nearblack) 30%, transparent) 100%)",
        }}
        aria-hidden="true"
      />
      <GoldenHaze />
      <FloatingPetals count={18} kinds={["jasmine", "gold", "akshata"]} />

      <TempleArch className="pointer-events-none absolute inset-x-2 top-2 bottom-2 text-gold/12 sm:inset-x-12" />

      <div className="relative z-10 px-6 py-28 text-center">
        {lines.map((l, i) => (
          <motion.p
            key={l + i}
            initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 2.2, delay: i * 1.2, ease: [0.16, 1, 0.3, 1] }}
            className={`font-display leading-tight ${
              i === lines.length - 1
                ? "mt-10 text-gold-foil text-[2.4rem] sm:text-5xl"
                : "text-2xl text-ivory sm:text-4xl"
            } ${i > 0 && i < lines.length - 1 ? "mt-6" : ""}`}
          >
            {l}
          </motion.p>
        ))}
      </div>
    </section>
  );
}

export function FinalInvitation() {
  const { family, quotes } = useWeddingData();
  const closingMessage = family?.closingMessage || [
    "We extend a warm & heartfelt invitation to you and your family to join us in celebrating a beautiful union.",
    "As two families come together in joy, your presence would add immeasurably to the happiness of this special occasion.",
  ];
  const regards = family?.regards || [
    "Medapati Suseela",
    "Medapati Anil Reddy",
    "Medapati Sharmila Reddy",
    "Medapati Abhinav Siddharth Reddy",
  ];

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <img
        src={quotes?.ringImg || photos.ring}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        style={{ objectPosition: "50% 30%", filter: "sepia(20%)" }}
      />
      <div className="parchment-rich absolute inset-0 opacity-92" />

      <FloralCorner className="absolute top-0 left-0 h-44 w-44 text-temple/28 sm:h-72 sm:w-72" />
      <FloralCorner flip className="absolute top-0 right-0 h-44 w-44 text-temple/28 sm:h-72 sm:w-72" />
      <FloralCorner className="absolute bottom-0 left-0 h-36 w-36 rotate-[-90deg] text-maroon/15 sm:h-56 sm:w-56" />
      <FloralCorner flip className="absolute right-0 bottom-0 h-36 w-36 rotate-90 text-maroon/15 sm:h-56 sm:w-56" />

      <PremiumBorder className="pointer-events-none absolute inset-4 text-gold/22 sm:inset-10" />

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, color-mix(in oklab, var(--champagne) 40%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <SectionHeading label={family?.finalInvitationLabel || "Final Invitation"} title={family?.finalInvitationTitle || "Your Presence Is Our Blessing"} />

        <div className="mt-16 space-y-9">
          {closingMessage.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.8, delay: i * 0.35 }}
              className="font-display text-xl leading-relaxed text-charcoal/85 sm:text-2xl"
            >
              {p}
            </motion.p>
          ))}
        </div>

        <WeddingMonogram className="mx-auto mt-20 h-48 w-44" />

        <GoldDivider className="mt-10" />

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="mt-12"
        >
          <p className="font-display text-4xl text-maroon italic sm:text-5xl">{family?.regardsTitle || "Warm Regards"}</p>
          <div className="mt-9 space-y-2.5">
            {regards.map((n) => (
              <p
                key={n}
                className="font-heading text-sm tracking-[0.22em] text-maroon-deep uppercase sm:text-base"
              >
                {n}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function ClosingScreen() {
  const { hero, settings, footer, socialLinks } = useWeddingData();
  const activeSocials = (socialLinks || []).filter((s) => s.active !== false);

  return (
    <footer className="relative overflow-hidden bg-maroon-deep py-16 text-center sm:py-24">
      <FloatingPetals count={14} kinds={["jasmine", "gold"]} />

      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 28%, color-mix(in oklab, var(--gold) 16%, transparent) 0%, transparent 60%)",
        }}
      />

      <FloralCorner className="absolute top-0 left-0 h-28 w-28 text-gold/15 sm:h-44 sm:w-44" />
      <FloralCorner flip className="absolute top-0 right-0 h-28 w-28 text-gold/15 sm:h-44 sm:w-44" />

      <div className="relative mx-auto max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8 }}
        >
          <div className="relative mx-auto w-fit">
            <div
              className="absolute inset-[-20%] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, color-mix(in oklab, var(--amber) 40%, transparent) 0%, transparent 70%)",
                filter: "blur(10px)",
              }}
              aria-hidden="true"
            />
            <img
              src={footer?.logo || photos.ganesha}
              alt="Logo"
              className="relative mx-auto h-16 w-16 rounded-full object-cover object-top sm:h-18 sm:w-18 border border-gold/40 shadow-[0_0_20px_rgba(201,168,76,0.3)]"
            />
          </div>
          <p className="mt-6 font-heading text-xs tracking-[0.36em] text-gold-light">
            {settings?.invocation || "|| Shri Ganeshaya Namah ||"}
          </p>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.2 }}
          className="mt-12 font-display text-[2rem] leading-tight sm:text-5xl"
        >
          <span className="text-gold-foil block">{hero?.brideName || "Hamsini Sriya Reddy"}</span>
          <span className="my-3 block font-heading text-lg text-ivory/55">&amp;</span>
          <span className="text-gold-foil block">{hero?.groomName || "S. V. Janak Reddy"}</span>
        </motion.h2>

        <p className="mt-9 font-heading text-lg tracking-[0.3em] text-ivory/80">
          {settings?.weddingDateLabel || "27 · 08 · 2026"}
        </p>

        {/* Social Links */}
        {activeSocials.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            {activeSocials.map((s) => (
              <a
                key={s.id || s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gold/30 bg-black/30 px-4 py-1.5 label-caps text-xs text-gold-light hover:bg-gold hover:text-nearblack transition-colors"
              >
                {s.platform}
              </a>
            ))}
          </div>
        )}

        <GoldDivider className="mt-10" tone="ivory" />

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.4 }}
          className="mt-10 font-display text-xl text-ivory/78 italic"
        >
          {footer?.description || "Thank you for being part of our celebration."}
        </motion.p>

        {footer?.copyrightText && (
          <p className="mt-4 font-body text-xs text-ivory/40">
            {footer.copyrightText}
          </p>
        )}

        {footer?.creditText && (
          <p className="mt-2 font-body text-[0.7rem] text-gold/60">
            {footer.creditText}
          </p>
        )}

        <div className="mt-12">
          <LuxuryButton
            variant="outline"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {footer?.revisitButtonText || "Revisit Our Celebration"}
          </LuxuryButton>
        </div>
      </div>
    </footer>
  );
}

