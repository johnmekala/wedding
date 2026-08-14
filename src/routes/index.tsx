import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Toaster } from "sonner";
import { photos } from "@/data/wedding";
import { useWeddingData } from "@/lib/useWeddingData";
import { TempleDoorIntro } from "@/components/wedding/TempleDoorIntro";
import { CinematicHero } from "@/components/wedding/CinematicHero";
import {
  CoupleReveal,
  FamilyBlessing,
  SacredIntroduction,
} from "@/components/wedding/StorySections";
import { SpecialBlessings } from "@/components/wedding/SpecialBlessings";
import { CinematicPhoto, QuoteReveal } from "@/components/wedding/CinematicPhoto";
import { EventChapters } from "@/components/wedding/EventChapters";
import { CelebrationReels } from "@/components/wedding/CelebrationReels";
import { Countdown } from "@/components/wedding/Countdown";
import { Gallery } from "@/components/wedding/Gallery";
import {
  ClosingScreen,
  FinalInvitation,
  SacredMoment,
} from "@/components/wedding/ClosingSections";
import { DepartmentDetailsSection } from "@/components/wedding/DepartmentDetailsSection";
import { WeddingReelsSection } from "@/components/wedding/WeddingReelsSection";
import { FloatingMusicButton, Navigation } from "@/components/wedding/Navigation";

const DEFAULT_TITLE = "Sriya & Janak — 27 August 2026, Hyderabad";
const DEFAULT_DESC =
  "With the blessings of our families, Hamsini Sriya Reddy & S. V. Janak Reddy invite you to their wedding celebrations in Hyderabad, 24–27 August 2026.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: DEFAULT_TITLE },
      { name: "description", content: DEFAULT_DESC },
      { property: "og:title", content: DEFAULT_TITLE },
      { property: "og:description", content: DEFAULT_DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

function Invitation() {
  const [entered, setEntered] = useState(false);
  const data = useWeddingData();

  const enabledSections = (data.sections || [])
    .filter((sec) => sec.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const hasDepartmentSection = enabledSections.some((sec) => sec.id === "departmentDetails");

  const renderSection = (id: string) => {
    switch (id) {
      case "hero":
        return <CinematicHero key="hero" />;
      case "intro":
        return (
          <div key="intro">
            <SacredIntroduction />
            <CinematicPhoto
              src={data.quotes.mesmarizingImg || photos.mesmarizing}
              alt="The couple silhouetted against golden light"
              quote={data.quotes.mesmarizingQuote || "Where tradition meets forever."}
              objectPosition="50% 35%"
            />
          </div>
        );
      case "couple":
        return <CoupleReveal key="couple" />;
      case "family":
        return (
          <div key="family">
            <FamilyBlessing />
            <div className="py-10 sm:py-16 bg-ivory" />
            <CinematicPhoto
              src={data.quotes.ringImg || photos.ring}
              alt="Sriya and Janak reaching for each other's hands"
              quote={data.quotes.ringQuote || "Two families, one beautiful beginning."}
              objectPosition="50% 30%"
            />
          </div>
        );
      case "specialBlessings":
        return <SpecialBlessings key="specialBlessings" />;
      case "events":
        return (
          <div key="events">
            <EventChapters />
            <QuoteReveal quote={data.quotes.quoteRevealText || "Love, celebrated in every tradition."} />
          </div>
        );
      case "reels":
        return <CelebrationReels key="reels" />;
      case "moment":
        return (
          <div key="moment">
            <SacredMoment />
            <Countdown />
            <WeddingReelsSection key="weddingReelsInline" />
            <CinematicPhoto
              src={data.quotes.aMomentImg || photos.aMoment}
              alt="The ring ceremony on the illuminated stage"
              quote={data.quotes.aMomentQuote || "Some moments become memories. Some become forever."}
              objectPosition="50% 32%"
              petals
            />
          </div>
        );
      case "weddingReels":
        return null;

      case "gallery":
        return <Gallery key="gallery" />;
      case "finalInvitation":
        return <FinalInvitation key="finalInvitation" />;
      case "footer":
        return (
          <div key="footer-group">
            <ClosingScreen key="footer" />
            {!hasDepartmentSection && <DepartmentDetailsSection key="departmentDetails" />}
          </div>
        );
      case "departmentDetails":
        return <DepartmentDetailsSection key="departmentDetails" />;
      default:
        return null;
    }
  };

  return (
    <>
      <TempleDoorIntro onEnter={() => setEntered(true)} />
      <Toaster position="top-center" />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: entered ? 1 : 0 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      >
        <Navigation />
        <FloatingMusicButton />
        {enabledSections.map((sec) => renderSection(sec.id))}
      </motion.main>
    </>
  );
}

