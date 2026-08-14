import { motion } from "motion/react";
import { couple, families, photos } from "@/data/wedding";
import { FloralCorner, GoldDivider, PremiumBorder, SectionHeading, WeddingMonogram } from "./Ornaments";
import { useWeddingData } from "@/lib/useWeddingData";

// Shared reveal variant
const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const blurReveal = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function SacredIntroduction() {
  const { hero, settings, family } = useWeddingData();
  const hosts = family.hosts || families.hosts;
  const hostsLine = family.hostsLine || families.hostsLine;
  const sacredPhrases = family.sacredPhrases || ["Two families.", "Two journeys.", "One sacred union."];

  return (
    <section id="blessings" className="parchment-rich relative overflow-hidden py-14 sm:py-24">
      {/* Premium corner ornaments */}
      <FloralCorner className="absolute top-0 left-0 h-40 w-40 text-temple/22 sm:h-72 sm:w-72" />
      <FloralCorner flip className="absolute top-0 right-0 h-40 w-40 text-temple/22 sm:h-72 sm:w-72" />
      <FloralCorner className="absolute bottom-0 left-0 h-40 w-40 rotate-[-90deg] text-terracotta/18 sm:h-60 sm:w-60" />
      <FloralCorner flip className="absolute right-0 bottom-0 h-40 w-40 rotate-90 text-terracotta/18 sm:h-60 sm:w-60" />

      {/* Premium border frame overlay */}
      <PremiumBorder className="pointer-events-none absolute inset-4 text-gold/20 sm:inset-8" />

      {/* Subtle center glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, color-mix(in oklab, var(--champagne) 35%, transparent) 0%, transparent 65%)",
        }}
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ staggerChildren: 0.42 }}
        className="relative mx-auto max-w-2xl px-6 text-center"
      >
        <motion.div variants={reveal} transition={{ duration: 1.5 }}>
          <div className="relative mx-auto w-fit">
            <div
              className="absolute inset-[-20%] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, color-mix(in oklab, var(--amber) 40%, transparent) 0%, transparent 70%)",
                filter: "blur(12px)",
              }}
              aria-hidden="true"
            />
            <img
              src={hero.ganeshaImage || photos.ganesha}
              alt="Lord Ganesha"
              className="relative mx-auto h-20 w-20 rounded-full object-cover object-top sm:h-24 sm:w-24 shadow-[0_0_25px_rgba(201,168,76,0.3)] border border-gold/40"
            />
          </div>
          <p className="mt-7 font-heading text-sm tracking-[0.34em] text-maroon sm:text-base">
            {settings.invocation || couple.invocation}
          </p>
        </motion.div>

        <motion.div variants={reveal} transition={{ duration: 1.4 }}>
          <GoldDivider className="my-14" />
        </motion.div>

        <motion.p
          variants={reveal}
          transition={{ duration: 1.4 }}
          className="font-heading text-base tracking-[0.16em] text-maroon uppercase sm:text-lg"
        >
          {hosts[0] || "Sri. Medapati Anil Kumar Reddy"}
          {hosts[1] && (
            <>
              <span className="mx-3 text-gold-deep">&amp;</span>
              <br className="sm:hidden" />
              {hosts[1]}
            </>
          )}
        </motion.p>

        <motion.p
          variants={reveal}
          transition={{ duration: 1.4 }}
          className="mx-auto mt-9 max-w-lg font-display text-xl leading-relaxed text-temple italic sm:text-2xl"
        >
          {hostsLine}
        </motion.p>

        <motion.div variants={reveal} transition={{ duration: 1.4 }}>
          <GoldDivider className="mt-12" />
        </motion.div>

        <motion.p
          variants={reveal}
          transition={{ duration: 1.6 }}
          className="mt-10 font-display text-2xl leading-relaxed text-maroon italic sm:text-3xl"
        >
          {settings.tagline || couple.tagline}
        </motion.p>
      </motion.div>
    </section>
  );
}

export function CoupleReveal() {
  const { couple: dynamicCouple, family, settings } = useWeddingData();
  const bride = dynamicCouple.bride || couple.bride;
  const groom = dynamicCouple.groom || couple.groom;
  const storyText = dynamicCouple.story || "Two journeys. One sacred union.";
  const brideGrand = family?.brideGrand || families.brideGrand;
  const groomParents = family?.groomParents || families.groomParents;
  const groomGrand = family?.groomGrand || families.groomGrand;

  return (
    <section id="couple" className="relative overflow-hidden bg-ivory pt-10 sm:pt-14 pb-16 sm:pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading label={dynamicCouple.sectionLabel || "The Couple"} title={dynamicCouple.sectionTitle || `${bride.name.split(" ")[0]} & ${groom.name.split(" ")[0]}`} />

        {/* Cinematic storytelling — appears first */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 text-center"
        >
          <p className="font-display text-xl leading-relaxed text-temple italic sm:text-2xl">
            {storyText}
          </p>
        </motion.div>

        {/* Couple portraits */}
        <div className="relative mt-20 grid gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-4">

          {/* Bride — Sriya */}
          <motion.figure
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <motion.div
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              whileInView={{ clipPath: "inset(0 0 0% 0)" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden shadow-[var(--shadow-frame)]"
            >
              <img
                src={bride.photo || photos.yay}
                alt={bride.name}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover transition-transform duration-[2s] ease-[var(--ease-silk)] hover:scale-[1.03]"
                style={{ objectPosition: "50% 22%" }}
              />
              {/* Gold frame border */}
              <span className="pointer-events-none absolute inset-2 border border-gold/40" />
              <span className="pointer-events-none absolute inset-5 border border-gold/20" />
              {/* Warm overlay */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in oklab, var(--maroon-deep) 30%, transparent) 0%, transparent 40%)",
                }}
              />
            </motion.div>
            <figcaption className="mt-7 text-center lg:text-right">
              <motion.h3
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.3 }}
                className="font-display text-3xl text-maroon sm:text-4xl"
              >
                {bride.name}
              </motion.h3>
              <p className="mt-2 font-body text-sm tracking-[0.1em] text-temple">
                {bride.detail}
              </p>
              <p className="mx-auto mt-4 max-w-xs font-body text-xs leading-relaxed tracking-[0.06em] text-muted-foreground lg:ml-auto lg:mr-0">
                {brideGrand[0]}<br />{brideGrand[1]}
              </p>
            </figcaption>
          </motion.figure>

          {/* Center monogram */}
          <div className="flex flex-col items-center gap-5 py-4">
            <span className="hidden h-28 w-px bg-gradient-to-b from-transparent via-gold to-transparent lg:block" />
            <WeddingMonogram className="h-44 w-40 sm:h-56 sm:w-48" />
            <p className="font-display text-xl text-temple italic">{dynamicCouple.monogramWord || "with"}</p>
            <span className="hidden h-28 w-px bg-gradient-to-b from-transparent via-gold to-transparent lg:block" />
          </div>

          {/* Groom — Janak */}
          <motion.figure
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:mt-24"
          >
            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              whileInView={{ clipPath: "inset(0% 0 0 0)" }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden shadow-[var(--shadow-frame)]"
            >
              <img
                src={groom.photo || photos.mesmarizing}
                alt={groom.name}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover transition-transform duration-[2s] ease-[var(--ease-silk)] hover:scale-[1.03]"
                style={{ objectPosition: "42% 40%" }}
              />
              <span className="pointer-events-none absolute inset-2 border border-gold/40" />
              <span className="pointer-events-none absolute inset-5 border border-gold/20" />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in oklab, var(--maroon-deep) 30%, transparent) 0%, transparent 40%)",
                }}
              />
            </motion.div>
            <figcaption className="mt-7 text-center lg:text-left">
              <motion.h3
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.4 }}
                className="font-display text-3xl text-maroon sm:text-4xl"
              >
                {groom.name}
              </motion.h3>
              <p className="mt-2 font-body text-sm tracking-[0.1em] text-temple">
                {groom.detail}
              </p>
              <p className="mx-auto mt-4 max-w-xs font-body text-xs leading-relaxed tracking-[0.06em] text-muted-foreground lg:mr-auto lg:ml-0">
                {groomParents}<br />{groomGrand[0]} {groomGrand[1]}
              </p>
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}

export function FamilyBlessing() {
  const { family } = useWeddingData();
  const hosts = family?.hosts || families.hosts;
  const brideGrand = family?.brideGrand || families.brideGrand;
  const groomParents = family?.groomParents || families.groomParents;
  const groomGrand = family?.groomGrand || families.groomGrand;
  const familyPhoto = family?.photo || photos.fam;

  return (
    <section className="relative overflow-hidden bg-maroon-deep pt-16 sm:pt-24 pb-24 sm:pb-32">
      {/* Faded family photo as background texture */}
      <div className="absolute inset-0 opacity-25">
        <img
          src={familyPhoto}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ objectPosition: "50% 30%", filter: "sepia(30%)" }}
        />
      </div>
      <div className="absolute inset-0 bg-maroon-deep/82" />

      {/* ── Continuous decorative border — CSS-based, auto-grows with content ── */}
      {/* Outer border line */}
      <div className="pointer-events-none absolute inset-2 sm:inset-4 border border-gold/60" aria-hidden="true">
        {/* Second inner line */}
        <div className="absolute inset-[10px] sm:inset-[12px] border border-gold/40" />
        {/* Third inner line (innermost) */}
        <div className="absolute inset-[22px] sm:inset-[26px] border border-gold/65" />

        {/* ── Corner L-brackets ── */}
        {/* Top-left */}
        <span className="pointer-events-none absolute top-0 left-0 h-16 w-16 sm:h-20 sm:w-20 border-t-[2px] border-l-[2px] border-gold/90" />
        {/* Top-right */}
        <span className="pointer-events-none absolute top-0 right-0 h-16 w-16 sm:h-20 sm:w-20 border-t-[2px] border-r-[2px] border-gold/90" />
        {/* Bottom-left */}
        <span className="pointer-events-none absolute bottom-0 left-0 h-16 w-16 sm:h-20 sm:w-20 border-b-[2px] border-l-[2px] border-gold/90" />
        {/* Bottom-right */}
        <span className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 sm:h-20 sm:w-20 border-b-[2px] border-r-[2px] border-gold/90" />

        {/* ── Top center ornament ── */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0">
          <svg width="48" height="22" viewBox="0 0 80 36" fill="none" className="text-gold/50" aria-hidden="true">
            <path d="M0 2 L40 20 L80 2" stroke="currentColor" strokeWidth="1" />
            <path d="M24 2 Q40 14 56 2" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            <circle cx="40" cy="18" r="4" fill="currentColor" opacity="0.3" />
          </svg>
        </div>

        {/* ── Bottom center ornament ── */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <svg width="48" height="22" viewBox="0 0 80 36" fill="none" className="text-gold/50" aria-hidden="true">
            <path d="M0 34 L40 16 L80 34" stroke="currentColor" strokeWidth="1" />
            <circle cx="40" cy="18" r="4" fill="currentColor" opacity="0.3" />
          </svg>
        </div>
      </div>
      {/* ──────────────────────────────────────────────────────────────────────── */}

      {/* Gold corner diyas */}
      <div className="pointer-events-none absolute top-8 left-8 h-12 w-10 text-amber opacity-60">
        <svg viewBox="0 0 40 60" fill="none" aria-hidden="true" className="h-full w-full">
          <path d="M8 42 Q7 50 10 54 Q20 58 30 54 Q33 50 32 42 Z" fill="currentColor" opacity="0.6" />
          <ellipse cx="20" cy="16" rx="6" ry="10" fill="oklch(0.78 0.15 55)" opacity="0.9" style={{ animation: "diyaFlicker 2.4s ease-in-out infinite", transformOrigin: "20px 22px" }} />
          <ellipse cx="20" cy="14" rx="3.5" ry="7" fill="oklch(0.96 0.12 82)" opacity="0.85" style={{ animation: "diyaFlicker 1.9s ease-in-out 0.3s infinite", transformOrigin: "20px 18px" }} />
        </svg>
      </div>
      <div className="pointer-events-none absolute top-8 right-8 h-12 w-10 text-amber opacity-60">
        <svg viewBox="0 0 40 60" fill="none" aria-hidden="true" className="h-full w-full">
          <path d="M8 42 Q7 50 10 54 Q20 58 30 54 Q33 50 32 42 Z" fill="currentColor" opacity="0.6" />
          <ellipse cx="20" cy="16" rx="6" ry="10" fill="oklch(0.78 0.15 55)" opacity="0.9" style={{ animation: "diyaFlicker 2.1s ease-in-out 0.5s infinite", transformOrigin: "20px 22px" }} />
          <ellipse cx="20" cy="14" rx="3.5" ry="7" fill="oklch(0.96 0.12 82)" opacity="0.85" style={{ animation: "diyaFlicker 1.7s ease-in-out 0.2s infinite", transformOrigin: "20px 18px" }} />
        </svg>
      </div>

      {/* Golden top glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, color-mix(in oklab, var(--gold) 18%, transparent) 0%, transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6">

        {/* ── 1. FAMILY BLESSINGS label (small caps) ─────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="label-caps text-gold-light/80 text-center"
        >
          {family?.sectionLabel || "Family Blessings"}
        </motion.p>

        {/* ── 2. SPECIAL BLESSINGS TOP IMAGE (above heading title) ── */}
        {family?.specialBlessingsTopImage?.enabled !== false &&
          family?.specialBlessingsTopImage?.image && (
            <motion.figure
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto mt-8 w-full max-w-3xl"
            >
              <div className="relative overflow-hidden rounded-2xl border-2 border-gold/40 shadow-[0_30px_70px_rgba(0,0,0,0.7)]">
                <img
                  src={family.specialBlessingsTopImage.image}
                  alt="Special Blessings"
                  loading="lazy"
                  className="w-full object-contain max-h-[600px]"
                  style={{ display: "block" }}
                />
                <span className="pointer-events-none absolute inset-3 border border-gold/40 rounded-xl" />
                <span className="pointer-events-none absolute inset-6 border border-gold/20 rounded-lg" />
              </div>
            </motion.figure>
          )}

        {/* ── 3. "Two Families, One Beginning" title + divider ───── */}
        <div className="text-center mt-10">
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.3, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[2.4rem] leading-[1.05] tracking-[0.02em] sm:text-6xl text-ivory"
          >
            {family?.sectionTitle || "Two Families, One Beginning"}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0.4 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <GoldDivider className="mt-7" tone="ivory" />
          </motion.div>
        </div>

        {/* ── 4. Family photograph ────────────────────────────────── */}
        <motion.figure
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-16 max-w-2xl"
        >
          <div className="relative overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
            <img
              src={familyPhoto}
              alt="Both families gathered beneath a floral arch"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
              style={{ objectPosition: "50% 55%" }}
            />
            <span className="pointer-events-none absolute inset-2 border border-gold/50" />
            <span className="pointer-events-none absolute inset-5 border border-gold/25" />
            {/* Bottom caption veil */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
              style={{
                background: "linear-gradient(to top, color-mix(in oklab, var(--maroon-deep) 80%, transparent) 0%, transparent 100%)",
              }}
            />
          </div>
        </motion.figure>

        {/* ── 5. Family details (Bride / Groom cards) ────────────── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.3 }}
          className="mt-16 grid gap-12 text-center sm:grid-cols-2"
        >
          <motion.div variants={reveal} transition={{ duration: 1.4 }}>
            <p className="label-caps text-gold-light">{family?.brideFamilyLabel || "The Bride's Family"}</p>
            <div className="mt-1 mx-auto w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <p className="mt-5 font-display text-2xl text-ivory">
              {hosts[0]}{hosts[1] ? ` & ${hosts[1]}` : ""}
            </p>
            <p className="mt-5 font-body text-sm leading-relaxed text-ivory/68">
              {brideGrand[0]}
              <br />
              {brideGrand[1]}
            </p>
          </motion.div>
          <motion.div variants={reveal} transition={{ duration: 1.4 }}>
            <p className="label-caps text-gold-light">{family?.groomFamilyLabel || "The Groom's Family"}</p>
            <div className="mt-1 mx-auto w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <p className="mt-5 font-display text-2xl text-ivory">
              {groomParents}
            </p>
            <p className="mt-5 font-body text-sm leading-relaxed text-ivory/68">
              {groomGrand[0]}
              <br />
              {groomGrand[1]}
            </p>
          </motion.div>
        </motion.div>

        {/* ── 6. Special Blessings full-width cinematic images ───── */}
        {family?.specialBlessingsImages?.enabled !== false && (family?.specialBlessingsImages?.items || []).filter((it) => it.enabled !== false).length > 0 && (
          <div className="mt-14 space-y-8">
            <div className="text-center">
              <GoldDivider className="mb-8" tone="gold" />
              <p className="label-caps text-gold-light tracking-[0.22em] text-sm sm:text-base">
                {family?.specialBlessingsImages?.sectionTitle || "SPECIAL BLESSINGS"}
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {(family?.specialBlessingsImages?.items || [])
                .filter((it) => it.enabled !== false)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((imgItem, idx) => (
                  <motion.figure
                    key={imgItem.id || idx}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mx-auto w-full max-w-5xl"
                  >
                    <div className="relative overflow-hidden rounded-2xl border-2 border-gold/40 bg-nearblack shadow-[0_30px_70px_rgba(0,0,0,0.85)]">
                      <img
                        src={imgItem.url}
                        alt={imgItem.alt || "Special Blessing Visual"}
                        loading="lazy"
                        className="w-full aspect-[16/9] sm:aspect-[21/9] object-cover transition-transform duration-1000 hover:scale-[1.02]"
                      />
                      <span className="pointer-events-none absolute inset-3 border border-gold/40 rounded-xl" />
                      <span className="pointer-events-none absolute inset-6 border border-gold/20 rounded-lg" />
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, color-mix(in oklab, var(--maroon-deep) 40%, transparent) 0%, transparent 50%)",
                        }}
                      />
                    </div>
                  </motion.figure>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
