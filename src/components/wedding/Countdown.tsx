import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { couple } from "@/data/wedding";
import { useWeddingData } from "@/lib/useWeddingData";
import { DiyaFlame, FloralCorner, GoldDivider, SectionHeading } from "./Ornaments";

function getDiff(targetIso?: string) {
  const target = new Date(targetIso || couple.weddingISO).getTime();
  const ms = target - Date.now();
  if (ms <= 0) return null;
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

export function Countdown() {
  const { settings, countdown } = useWeddingData();
  const [t, setT] = useState<ReturnType<typeof getDiff>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setT(getDiff(settings.weddingISO));
    const id = window.setInterval(() => setT(getDiff(settings.weddingISO)), 1000);
    return () => window.clearInterval(id);
  }, [settings.weddingISO]);

  const cells = t
    ? [
        { label: "Days", value: t.days },
        { label: "Hours", value: t.hours },
        { label: "Minutes", value: t.minutes },
        { label: "Seconds", value: t.seconds },
      ]
    : [];

  return (
    <section className="relative overflow-hidden py-14 sm:py-24">
      {/* Parchment background */}
      <div className="parchment-rich absolute inset-0" />

      {/* Subtle center gold glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, color-mix(in oklab, var(--champagne) 50%, transparent) 0%, transparent 60%)",
        }}
      />

      {/* Decorative corner ornaments */}
      <FloralCorner className="absolute top-0 left-0 h-32 w-32 text-temple/20 sm:h-52 sm:w-52" />
      <FloralCorner flip className="absolute top-0 right-0 h-32 w-32 text-temple/20 sm:h-52 sm:w-52" />

      {/* Diya pair flanking the section */}
      <div className="pointer-events-none absolute top-1/2 left-6 -translate-y-1/2 h-20 w-16 text-amber opacity-50 hidden sm:block" aria-hidden="true">
        <DiyaFlame className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute top-1/2 right-6 -translate-y-1/2 h-20 w-16 text-amber opacity-50 hidden sm:block" aria-hidden="true">
        <DiyaFlame className="h-full w-full" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6">
        <SectionHeading label={countdown?.sectionLabel || "The Awaited Day"} title={countdown?.sectionTitle || "Until We Say I Do"} />

        {mounted && !t ? (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4 }}
            className="mt-16 text-center font-display text-3xl text-maroon sm:text-4xl"
          >
            {countdown?.completedMessage || "The celebration has begun"}
          </motion.p>
        ) : (
          <div className="mt-16 grid grid-cols-2 gap-y-12 sm:grid-cols-4">
            {cells.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: i * 0.14 }}
                className="relative px-2 text-center"
              >
                {i > 0 ? (
                  <span className="absolute top-2 bottom-2 left-0 hidden w-px bg-gold/30 sm:block" />
                ) : null}
                <p className="font-display text-5xl leading-none text-maroon tabular-nums sm:text-7xl">
                  {String(c.value).padStart(2, "0")}
                </p>
                <p className="label-caps mt-4 text-temple">{c.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        <GoldDivider className="mt-16" />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, delay: 0.3 }}
          className="mt-8 text-center font-heading text-base tracking-[0.24em] text-maroon/78 uppercase sm:text-lg"
        >
          {settings.weddingDateLabel} · {settings.sumuhurtham}
        </motion.p>
      </div>
    </section>
  );
}
