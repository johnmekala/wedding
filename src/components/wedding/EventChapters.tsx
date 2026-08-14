import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { events, type WeddingEvent } from "@/data/wedding";
import { useWeddingData } from "@/lib/useWeddingData";
import { FloatingPetals } from "./Particles";
import { DiyaFlame, GoldDivider, LuxuryButton, SectionHeading, TempleArch } from "./Ornaments";

const MOODS: Record<WeddingEvent["mood"], { veil: string; glow: string }> = {
  sunset: {
    veil: "linear-gradient(to top, color-mix(in oklab, oklch(0.22 0.07 38) 94%, transparent) 0%, color-mix(in oklab, oklch(0.28 0.08 48) 50%, transparent) 52%, transparent 100%)",
    glow: "radial-gradient(ellipse at 70% 15%, color-mix(in oklab, var(--amber) 45%, transparent) 0%, transparent 55%), radial-gradient(ellipse at 30% 80%, color-mix(in oklab, var(--peach) 25%, transparent) 0%, transparent 45%)",
  },
  midnight: {
    veil: "linear-gradient(to top, color-mix(in oklab, var(--nearblack) 96%, transparent) 0%, color-mix(in oklab, var(--nearblack) 60%, transparent) 52%, color-mix(in oklab, var(--nearblack) 30%, transparent) 100%)",
    glow: "radial-gradient(ellipse at 30% 10%, color-mix(in oklab, var(--champagne) 28%, transparent) 0%, transparent 52%), radial-gradient(ellipse at 70% 90%, color-mix(in oklab, var(--gold) 15%, transparent) 0%, transparent 40%)",
  },
  heritage: {
    veil: "linear-gradient(to top, color-mix(in oklab, oklch(0.24 0.055 58) 94%, transparent) 0%, color-mix(in oklab, oklch(0.28 0.05 68) 44%, transparent) 58%, transparent 100%)",
    glow: "radial-gradient(ellipse at 50% 12%, color-mix(in oklab, var(--gold) 32%, transparent) 0%, transparent 58%)",
  },
  sacred: {
    veil: "linear-gradient(to top, color-mix(in oklab, var(--maroon-deep) 96%, transparent) 0%, color-mix(in oklab, var(--maroon-deep) 58%, transparent) 55%, transparent 100%)",
    glow: "radial-gradient(ellipse at 50% 5%, color-mix(in oklab, var(--gold) 38%, transparent) 0%, transparent 60%), radial-gradient(ellipse at 50% 60%, color-mix(in oklab, var(--amber) 20%, transparent) 0%, transparent 50%)",
  },
};

function getMapUrl(q: string, customUrl?: string) {
  if (customUrl && customUrl.trim()) return customUrl.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function calendarUrl(e: WeddingEvent) {
  const day = `2026082${e.dateNum.slice(-1)}`;
  const start =
    e.index === "01" ? "093000" : e.index === "02" ? "140000" : e.index === "03" ? "053000" : "053700";
  const end =
    e.index === "01" ? "160000" : e.index === "02" ? "180000" : e.index === "03" ? "120000" : "090000";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Sriya & Janak — ${e.title}`,
    dates: `${day}T${start}Z/${day}T${end}Z`,
    details: e.message,
    location: `${e.venueName}, ${e.venueAddress}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function Chapter({ event }: { event: WeddingEvent }) {
  const { eventsSection } = useWeddingData();
  const mood = MOODS[event.mood] || MOODS.sacred;
  const isSacred = event.mood === "sacred" || !event.mood;
  const isMidnight = event.mood === "midnight";

  return (
    <motion.article
      key={event.index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.1, ease: "easeInOut" }}
      className="relative overflow-hidden"
    >
      {/* Background image with Ken Burns pan */}
      <div className="absolute inset-0">
        <motion.img
          key={event.image}
          src={event.image}
          alt={`${event.title} at ${event.venueName}`}
          loading="lazy"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 14, ease: "linear" }}
          className="h-full w-full object-cover"
          style={{ objectPosition: event.imagePosition }}
        />
        <div className="absolute inset-0" style={{ background: mood.veil }} />
        <div className="absolute inset-0" style={{ background: mood.glow }} />

        {/* Edge cinematic vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, color-mix(in oklab, var(--nearblack) 28%, transparent) 0%, transparent 15%, transparent 85%, color-mix(in oklab, var(--nearblack) 28%, transparent) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Sacred: floating petals + diya atmosphere */}
      {isSacred && <FloatingPetals count={18} kinds={["jasmine", "gold", "akshata"]} />}

      {/* Midnight: light beam sweeps */}
      {isMidnight && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute top-[-30%] h-[160%] w-32"
              style={{
                left: `${18 + i * 26}%`,
                background:
                  "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--champagne) 55%, transparent), transparent)",
                filter: "blur(22px)",
                animation: `beam ${16 + i * 5}s ease-in-out ${i * 2}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Heritage/sunset: warm light ray */}
      {(event.mood === "heritage" || event.mood === "sunset") && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="absolute top-0 h-full"
              style={{
                left: `${28 + i * 32}%`,
                width: "10%",
                background:
                  "linear-gradient(to bottom, color-mix(in oklab, var(--amber) 50%, transparent), transparent 60%)",
                filter: "blur(28px)",
                transformOrigin: "top center",
                animation: `rayDrift ${20 + i * 7}s ease-in-out ${i * 4}s infinite`,
                opacity: 0.1,
              }}
            />
          ))}
        </div>
      )}

      {/* Sacred diya flames top corners */}
      {isSacred && (
        <>
          <div className="pointer-events-none absolute top-6 left-6 z-10 h-14 w-11 text-amber opacity-70" aria-hidden="true">
            <DiyaFlame className="h-full w-full" />
          </div>
          <div className="pointer-events-none absolute top-6 right-6 z-10 h-14 w-11 text-amber opacity-70" aria-hidden="true">
            <DiyaFlame className="h-full w-full" />
          </div>
        </>
      )}

      {/* Content */}
      <div className="relative mx-auto grid min-h-[92svh] max-w-5xl place-items-center px-6 py-24">
        <TempleArch className="pointer-events-none absolute inset-x-4 top-6 bottom-6 text-gold/14 sm:inset-x-16" />

        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.16, delayChildren: 0.2 }}
          className="relative rounded-[2rem] px-6 py-12 text-center sm:px-14"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, color-mix(in oklab, var(--nearblack) 75%, transparent) 0%, color-mix(in oklab, var(--nearblack) 55%, transparent) 58%, transparent 100%)",
            backdropFilter: "blur(3px)",
          }}
        >
          {[
            <p key="d" className="label-caps text-gold-light">
              {eventsSection?.chapterPrefix || "Chapter"} {event.index}
            </p>,
            <p key="m" className="mx-auto mt-8 max-w-lg font-display text-lg leading-relaxed text-ivory/85 italic sm:text-xl">
              {event.message}
            </p>,
            <h3 key="t" className="mt-6 font-display text-[2.5rem] leading-tight sm:text-6xl">
              <span className="text-gold-foil">{event.title}</span>
            </h3>,
            event.subtitle ? (
              <p key="s" className="label-caps mt-5 text-ivory/80">
                {event.subtitle}
              </p>
            ) : null,
            <div key="date" className="mt-9 flex items-center justify-center gap-5 text-ivory">
              <span className="font-heading text-lg tracking-[0.28em]">{event.month.toUpperCase()}</span>
              <span className="h-10 w-px bg-gold/60" />
              <span className="font-display text-5xl leading-none sm:text-6xl">{event.dateNum}</span>
              <span className="h-10 w-px bg-gold/60" />
              <span className="font-heading text-lg tracking-[0.28em]">{event.year}</span>
            </div>,
            <p key="day" className="label-caps mt-4 text-ivory/70">
              {event.day}
            </p>,
            <div key="div">
              <GoldDivider className="my-10" tone="ivory" />
            </div>,
            <div key="grid" className="mx-auto grid max-w-2xl gap-9 text-ivory sm:grid-cols-3 sm:gap-6">
              <div>
                <p className="label-caps text-gold-light">Time</p>
                <p className="mt-3 font-display text-xl">{event.time}</p>
                {event.timeNote ? (
                  <p className="mt-1 font-body text-xs tracking-[0.1em] text-ivory/60">
                    {event.timeNote}
                  </p>
                ) : null}
              </div>
              <div>
                <p className="label-caps text-gold-light">Venue</p>
                <p className="mt-3 font-display text-xl uppercase">{event.venueName}</p>
                <p className="mt-1 font-body text-xs leading-relaxed tracking-[0.08em] text-ivory/60">
                  {event.venueAddress}
                </p>
              </div>
              <div>
                <p className="label-caps text-gold-light">Dresscode</p>
                <p className="mt-3 font-display text-xl">{event.dresscode}</p>
                {event.dresscodeDetail ? (
                  <p className="mt-1 font-body text-xs tracking-[0.14em] text-ivory/60 uppercase">
                    {event.dresscodeDetail}
                  </p>
                ) : null}
              </div>
            </div>,
            event.tagline ? (
              <p
                key="tag"
                className="label-caps mt-12 text-gold-light"
                style={{ letterSpacing: "0.5em" }}
              >
                {event.tagline}
              </p>
            ) : null,
            <div key="cta" className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <LuxuryButton href={getMapUrl(event.mapQuery, event.mapUrl)} variant="outline">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {eventsSection?.viewLocationText || "View Location"}
              </LuxuryButton>
            </div>,
          ]
            .filter(Boolean)
            .map((node, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {node}
              </motion.div>
            ))}
        </motion.div>
      </div>
    </motion.article>
  );
}

export function EventChapters() {
  const { events: dynamicEvents, eventsSection } = useWeddingData();
  const eventsList = dynamicEvents && dynamicEvents.length > 0 ? dynamicEvents : events;
  const [active, setActive] = useState(0);
  const current = eventsList[active] || eventsList[0] || events[0];

  return (
    <section id="celebrations" className="relative bg-nearblack">
      {/* Chapter navigation */}
      <div className="parchment-grain pt-24 pb-4 sm:pt-36">
        <SectionHeading label={eventsSection?.sectionLabel || "The Wedding Journey"} title={eventsSection?.sectionTitle || "Celebration Chapters"} />
        <nav
          aria-label="Celebration chapters"
          className="mx-auto mt-14 flex max-w-5xl flex-col gap-3 px-6 sm:flex-row sm:gap-0"
        >
          {eventsList.map((e, i) => {
            const on = i === active;
            return (
              <button
                key={e.index}
                onClick={() => setActive(i)}
                aria-current={on ? "true" : undefined}
                className={`group relative flex-1 border-t px-4 py-6 text-left transition-colors duration-700 sm:text-center ${
                  on ? "border-gold" : "border-border hover:border-gold/60"
                }`}
              >
                <span
                  className={`label-caps block transition-colors duration-700 ${on ? "text-gold-deep" : "text-muted-foreground"}`}
                >
                  {e.index}
                </span>
                <span
                  className={`mt-3 block font-display text-xl transition-colors duration-700 sm:text-2xl ${
                    on ? "text-maroon" : "text-charcoal/60 group-hover:text-maroon/80"
                  }`}
                >
                  {e.title}
                </span>
                <span className="label-caps mt-2 block text-temple/70">
                  {e.month} {e.dateNum}
                </span>
                {on ? (
                  <motion.span
                    layoutId="chapter-underline"
                    className="absolute inset-x-0 -top-px h-px"
                    style={{ background: "var(--gradient-gold)" }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {current && (
        <AnimatePresence mode="wait">
          <Chapter key={current.index} event={current} />
        </AnimatePresence>
      )}
    </section>
  );
}
