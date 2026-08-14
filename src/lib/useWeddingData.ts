import { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "./firebase";
import type { WeddingEvent } from "@/data/wedding";

const defaultPhotos = {
  heroPhotograph: "/images/hero_photograph.jpg",
  secondImage: "/images/second_image.jpg",
  awww: "/images/awww.jpg",
  yes: "/images/yes.jpg",
  yay: "/images/yay.jpg",
  hey: "/images/hey.jpg",
  aMoment: "/images/a_moment.jpg",
  mesmarizing: "/images/mesmarizing.jpg",
  ring: "/images/ring.jpg",
  wedding: "/images/wedding.jpg",
  fam: "/images/fam.jpg",
  ganesha: "/images/ganesha.png",
  monogram: "/images/monogram.png",
};

const defaultCouple = {
  bride: {
    name: "Hamsini Sriya Reddy",
    detail: "MIM London Business School, London",
  },
  groom: {
    name: "S. V. Janak Reddy",
    detail: "Landscape Architect, Colorado State University, USA",
  },
  invocation: "|| Shri Ganeshaya Namah ||",
  tagline: "A Celebration of Love, Tradition & Togetherness",
  weddingDateLabel: "27 August 2026",
  sumuhurtham: "Sumuhurtham · 11:07 AM",
  city: "Hyderabad",
  weddingISO: "2026-08-27T11:07:00+05:30",
};

const defaultFamilies = {
  hosts: ["Sri. Medapati Anil Kumar Reddy", "Smt. Sharmila Reddy"],
  hostsLine: "Cordially invite you and your family to grace the wedding of our beloved daughter",
  brideGrand: [
    "Grand D/o Late. Medapati Seetha Rama Reddy & Smt. Suseela Devi",
    "and Sri Velagala Manohara Reddy & Smt. Padmavathi",
  ],
  groomParents: "(Only S/o Sri S. V. Mohan Reddy & Smt. Vijaya Manohari)",
  groomGrand: ["(Grand S/o Sri S. V. Subha Reddy &", "Late Smt. S. V. Narayanamma)"],
  regards: [
    "Medapati Suseela,",
    "Medapati Anil Reddy",
    "Medapati Sharmila Reddy",
    "Medapati Abhinav Siddharth Reddy",
  ],
  closingMessage: [
    "We extend a warm & heartfelt invitation to you and your family to join us in celebrating a beautiful union.",
    "As two families come together in joy, your presence would add immeasurably to the happiness of this special occasion.",
  ],
};

const defaultEvents: WeddingEvent[] = [
  {
    index: "01",
    title: "Sundowner Affair",
    subtitle: "With Haldi & Henna",
    message: "You are invited to an evening of sunshine, traditions & togetherness",
    day: "Monday",
    dateNum: "24",
    month: "Aug",
    year: "2026",
    time: "03:00 PM onwards",
    timeNote: "Followed by High Tea & Dinner",
    venueName: "Ridhira Retreat",
    venueAddress: "Gandipet, Hyderabad",
    dresscode: "Pastels only",
    dresscodeDetail: "Peach · Baby Pink · Beige · Champagne · Ivory",
    image: "/images/ring.jpg",
    imagePosition: "50% 30%",
    mood: "sunset",
    mapQuery: "Ridhira Retreat Gandipet Hyderabad",
  },
  {
    index: "02",
    title: "Taal, Tequila & Tunes",
    subtitle: "Sync & Sip : Taal Se Taal Mila",
    message: "You are invited to a night of Rhythm, Revelry & Raised Glasses",
    day: "Tuesday",
    dateNum: "25",
    month: "Aug",
    year: "2026",
    time: "07:30 PM onwards",
    timeNote: "Followed by Dinner",
    venueName: "Neo Convention",
    venueAddress: "Shankarpalli Road, Janwada, Hyderabad",
    dresscode: "Glitter, shimmer & sparkle",
    dresscodeDetail: "in any colour",
    image: "/images/a_moment.jpg",
    imagePosition: "50% 35%",
    mood: "midnight",
    mapQuery: "Neo Convention Shankarpalli Road Janwada Hyderabad",
  },
  {
    index: "03",
    title: "Pellikuthuru",
    message: "You are invited to a day of love, laughter and golden traditions before the sacred journey unfolds",
    day: "Wednesday",
    dateNum: "26",
    month: "Aug",
    year: "2026",
    time: "11:00 AM onwards",
    timeNote: "Followed by Lunch & High-Tea",
    venueName: "Bhumi Farms",
    venueAddress: "Green Acres Farmlands, Near Chilkuri Balaji temple, Hyderabad",
    dresscode: "Vintage",
    image: "/images/yay.jpg",
    imagePosition: "50% 30%",
    mood: "heritage",
    mapQuery: "Green Acres Farmlands Chilkur Balaji Temple Hyderabad",
  },
  {
    index: "04",
    title: "Wedding",
    subtitle: "Sumuhurtham · 11:07 AM",
    message: "You are invited to an auspicious day of sacred vows & eternal love",
    day: "Thursday",
    dateNum: "27",
    month: "Aug",
    year: "2026",
    time: "Sumuhurtham 11:07 AM",
    venueName: "Neo Convention",
    venueAddress: "Shankarpalli Road, Janwada, Hyderabad",
    dresscode: "Traditional",
    tagline: "A Promise For A Lifetime",
    image: "/images/wedding.jpg",
    imagePosition: "50% 35%",
    mood: "sacred",
    mapQuery: "Neo Convention Shankarpalli Road Janwada Hyderabad",
  },
];

const defaultGallery: GalleryItem[] = [
  { src: "/images/awww.jpg", alt: "Sriya and Janak on the illuminated engagement stage", span: "tall" },
  { src: "/images/yes.jpg", alt: "The couple in a quiet golden moment", span: "wide" },
  { src: "/images/yay.jpg", alt: "Sriya seated among roses in a golden saree", span: "tall" },
  { src: "/images/hey.jpg", alt: "The couple beneath a marbled arch of light", span: "tall" },
  { src: "/images/a_moment.jpg", alt: "The ring ceremony on stage", span: "wide" },
  { src: "/images/mesmarizing.jpg", alt: "The couple silhouetted in golden light", span: "tall" },
  { src: "/images/wedding.jpg", alt: "The couple beneath a crystal chandelier", span: "tall" },
  { src: "/images/fam.jpg", alt: "Both families beneath a floral arch", span: "wide" },
  { src: "/images/ring.jpg", alt: "Sriya and Janak reaching for each other's hands", span: "tall" },
];

export interface WeddingSettings {
  invocation: string;
  tagline: string;
  weddingDateLabel: string;
  sumuhurtham: string;
  city: string;
  weddingISO: string;
}

export interface HeroData {
  layout?: "existing" | "media-trio";
  leftImage?: {
    url: string;
    alt?: string;
  };
  centerVideo?: {
    url?: string;
    poster?: string;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    playsInline?: boolean;
    objectFit?: "contain" | "cover";
  };
  rightImage?: {
    url: string;
    alt?: string;
  };
  blessingText?: string;
  welcomeText?: string;
  brideName: string;
  groomName: string;
  subheading: string;
  dateText: string;
  scrollText?: string;
  heroImage: string;
  heroMobileImage?: string;
  heroVideoUrl?: string;
  ganeshaImage: string;
}

export interface IntroData {
  title: string;
  subtitle: string;
  dateText: string;
  locationText: string;
  buttonText: string;
  openingText?: string;
  celebrationPrefix?: string;
  welcomeText?: string;
  ganeshaImage: string;
}

export interface CoupleData {
  sectionLabel?: string;
  sectionTitle?: string;
  monogramWord?: string;
  bride: {
    name: string;
    detail: string;
    photo: string;
  };
  groom: {
    name: string;
    detail: string;
    photo: string;
  };
  story: string;
}

export interface SpecialBlessingImageItem {
  id?: string | undefined;
  url: string;
  alt?: string | undefined;
  enabled?: boolean | undefined;
  order?: number | undefined;
}

export interface FamilySpecialBlessingsData {
  enabled?: boolean | undefined;
  sectionTitle?: string | undefined;
  items?: SpecialBlessingImageItem[] | undefined;
}

export interface FamilyData {
  sectionLabel?: string;
  sectionTitle?: string;
  hosts: string[];
  hostsLine: string;
  brideGrand: string[];
  groomParents: string;
  groomGrand: string[];
  regardsTitle?: string;
  regards: string[];
  closingMessage: string[];
  sacredPhrases?: string[];
  photo?: string;
  brideFamilyLabel?: string;
  groomFamilyLabel?: string;
  finalInvitationLabel?: string;
  finalInvitationTitle?: string;
  specialBlessingsImages?: FamilySpecialBlessingsData;
  specialBlessingsTopImage?: {
    enabled?: boolean;
    image?: string;
  };
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  visible: boolean;
}

export interface NavigationData {
  logo: string;
  links: NavigationItem[];
  ctaLabel: string;
  ctaUrl: string;
  ctaVisible: boolean;
}

export interface QuoteData {
  introQuote: string;
  mesmarizingQuote: string;
  mesmarizingImg: string;
  ringQuote: string;
  ringImg: string;
  aMomentQuote: string;
  aMomentImg: string;
  yesImg?: string;
  quoteRevealText: string;
  sacredMomentLines: string[];
}

export interface FooterData {
  logo: string;
  description: string;
  copyrightText: string;
  creditText: string;
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  revisitButtonText?: string;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  icon: string;
  active: boolean;
  order: number;
}

export interface SEOData {
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface SectionItem {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

export interface RSVPSettingsData {
  sectionLabel?: string;
  title: string;
  subtitle: string;
  gratitudeHeading?: string;
  nameLabel?: string;
  guestsLabel?: string;
  attendingLabel?: string;
  messageLabel?: string;
  submitButtonText?: string;
  successMessage: string;
}

export interface GalleryItem {
  id?: string;
  src: string;
  alt: string;
  span?: "tall" | "wide";
  category?: string;
  visible?: boolean;
}

export interface EventsSectionData {
  sectionLabel?: string;
  sectionTitle?: string;
  chapterPrefix?: string;
  viewLocationText?: string;
  addToCalendarText?: string;
}

export interface GallerySectionData {
  sectionLabel?: string;
  sectionTitle?: string;
}

export interface CountdownData {
  sectionLabel?: string;
  sectionTitle?: string;
  completedMessage?: string;
}

export interface SpecialBlessingItem {
  id?: string | undefined;
  name: string;
  relationship?: string | undefined;
  message: string;
  image?: string | undefined;
  additionalText?: string | undefined;
  enabled?: boolean | undefined;
  order?: number | undefined;
}

export interface SpecialBlessingsSectionData {
  enabled?: boolean | undefined;
  sectionLabel?: string | undefined;
  sectionTitle?: string | undefined;
  items?: SpecialBlessingItem[] | undefined;
}

export interface CelebrationReelItem {
  id?: string | undefined;
  type: "video" | "image";
  url: string;
  instagramUrl?: string | undefined;
  thumbnail?: string | undefined;
  title?: string | undefined;
  caption?: string | undefined;
  visible?: boolean | undefined;
  order?: number | undefined;
}

export interface ReelsSectionData {
  sectionLabel?: string;
  sectionTitle?: string;
  autoScrollSpeed?: "slow" | "medium" | "fast";
  direction?: "left" | "right";
  items?: CelebrationReelItem[];
}

// New separate Wedding Reels section (after "Until We Say I Do")
export interface WeddingReelsSectionData {
  enabled?: boolean;
  sectionLabel?: string;
  sectionTitle?: string;
  subtitle?: string;
  autoScrollSpeed?: "slow" | "medium" | "fast";
  items?: CelebrationReelItem[];
}


export interface DepartmentItem {
  id: string;
  name: string;
  headName: string;
  phone: string;
  teamMembersCount: number | string;
  whatsapp: string;
  active?: boolean;
  order?: number;
}

export interface DepartmentDetailsSectionData {
  enabled?: boolean;
  sectionLabel?: string;
  sectionTitle?: string;
  subtitle?: string;
  departments?: DepartmentItem[];
}

export interface HeroVideoData {
  enabled?: boolean;
  youtubeUrl?: string;
}

export interface DynamicWeddingData {
  settings: WeddingSettings;
  hero: HeroData;
  intro: IntroData;
  couple: CoupleData;
  events: WeddingEvent[];
  gallery: GalleryItem[];
  family: FamilyData;
  navigation: NavigationData;
  quotes: QuoteData;
  footer: FooterData;
  socialLinks: SocialLinkItem[];
  seo: SEOData;
  sections: SectionItem[];
  rsvpSettings: RSVPSettingsData;
  eventsSection?: EventsSectionData;
  gallerySection?: GallerySectionData;
  reelsSection?: ReelsSectionData;
  weddingReelsSection?: WeddingReelsSectionData;
  specialBlessingsSection?: SpecialBlessingsSectionData;
  departmentDetails?: DepartmentDetailsSectionData;
  departments?: DepartmentItem[];
  heroVideo?: HeroVideoData;
  countdown?: CountdownData;
  musicTrack: string;
  loading: boolean;
  isFromFirebase: boolean;
}

const defaultSections: SectionItem[] = [
  { id: "hero", name: "Cinematic Hero", enabled: true, order: 1 },
  { id: "intro", name: "Sacred Introduction", enabled: true, order: 2 },
  { id: "couple", name: "Couple & Love Story", enabled: true, order: 3 },
  { id: "family", name: "Family Blessings", enabled: true, order: 4 },
  { id: "specialBlessings", name: "Special Blessings From", enabled: true, order: 4.5 },
  { id: "events", name: "Celebration Events", enabled: true, order: 5 },
  { id: "reels", name: "Celebration Reels & Highlights", enabled: true, order: 6 },
  { id: "moment", name: "Sacred Moment & Countdown", enabled: true, order: 7 },
  { id: "weddingReels", name: "Wedding Reels", enabled: true, order: 7.5 },
  { id: "gallery", name: "Photo Gallery", enabled: true, order: 8 },
  { id: "finalInvitation", name: "Final Invitation", enabled: true, order: 10 },
  { id: "footer", name: "Footer Screen", enabled: true, order: 11 },
  { id: "departmentDetails", name: "Department Details", enabled: true, order: 12 },
];

const defaultNavigation: NavigationData = {
  logo: defaultPhotos.monogram,
  links: [
    { id: "1", label: "Home", href: "#home", visible: true },
    { id: "2", label: "The Couple", href: "#couple", visible: true },
    { id: "3", label: "Celebrations", href: "#celebrations", visible: true },
    { id: "4", label: "Moments", href: "#moments", visible: true },
    { id: "5", label: "The Wedding", href: "#wedding", visible: true },
    { id: "6", label: "Contact", href: "#departments", visible: true },
  ],
  ctaLabel: "THE WEDDING",
  ctaUrl: "#wedding",
  ctaVisible: false,
};

const defaultQuotes: QuoteData = {
  introQuote: "In the presence of the divine and surrounded by loved ones, two souls unite in eternal grace.",
  mesmarizingQuote: "Where tradition meets forever.",
  mesmarizingImg: defaultPhotos.mesmarizing,
  ringQuote: "Two families, one beautiful beginning.",
  ringImg: defaultPhotos.ring,
  aMomentQuote: "Some moments become memories. Some become forever.",
  aMomentImg: defaultPhotos.aMoment,
  yesImg: defaultPhotos.yes,
  quoteRevealText: "Love, celebrated in every tradition.",
  sacredMomentLines: [
    "Two hearts.",
    "Two families.",
    "One sacred promise.",
    "A promise for a lifetime.",
  ],
};

const defaultFooter: FooterData = {
  logo: defaultPhotos.ganesha,
  description: "We extend a warm & heartfelt invitation to you and your family to join us in celebrating a beautiful union.",
  copyrightText: "Sriya & Janak · 27 August 2026 · Hyderabad",
  creditText: "Made with love for Sriya & Janak",
  phone: "+91 98765 43210",
  email: "celebrate@sriyajanak.com",
  address: "Hyderabad, Telangana, India",
  mapUrl: "https://maps.google.com",
  revisitButtonText: "Revisit Our Celebration",
};

const defaultSocialLinks: SocialLinkItem[] = [
  { id: "1", platform: "Instagram", url: "https://instagram.com", icon: "Instagram", active: true, order: 1 },
  { id: "2", platform: "WhatsApp", url: "https://wa.me/919876543210", icon: "MessageCircle", active: true, order: 2 },
];

const defaultSEO: SEOData = {
  siteTitle: "Sriya & Janak — 27 August 2026, Hyderabad",
  metaDescription:
    "With the blessings of our families, Hamsini Sriya Reddy & S. V. Janak Reddy invite you to their wedding celebrations in Hyderabad, 24–27 August 2026.",
  keywords: "Sriya, Janak, Wedding, Hyderabad, Invitation, Indian Wedding",
  ogImage: defaultPhotos.heroPhotograph,
  canonicalUrl: "https://sriyajanak.com",
};

const defaultHeroVideo: HeroVideoData = {
  enabled: true,
  youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
};

const defaultHero: HeroData = {
  layout: "existing",
  leftImage: {
    url: defaultPhotos.yay,
    alt: "Bride Sriya",
  },
  centerVideo: {
    url: "",
    poster: defaultPhotos.heroPhotograph,
    autoplay: true,
    muted: true,
    loop: true,
    playsInline: true,
  },
  rightImage: {
    url: defaultPhotos.mesmarizing,
    alt: "Groom Janak",
  },
  blessingText: "With the blessings of Lord Ganesha",
  welcomeText: "Welcome to the Wedding Celebration of",
  brideName: defaultCouple.bride.name,
  groomName: defaultCouple.groom.name,
  subheading: "invite you to celebrate their journey of love, tradition and togetherness.",
  dateText: "27 AUGUST 2026",
  scrollText: "Scroll",
  heroImage: defaultPhotos.aMoment,
  ganeshaImage: defaultPhotos.ganesha,
};

const defaultIntro: IntroData = {
  title: "Sri. Medapati Anil Kumar Reddy & Smt. Sharmila Reddy",
  subtitle: "Cordially invite you to grace the wedding of their daughter",
  dateText: "27 August 2026 • Hyderabad",
  locationText: "Hyderabad",
  buttonText: "ENTER CELEBRATION",
  openingText: "Opening shortly…",
  celebrationPrefix: "A Celebration of",
  welcomeText: "Welcome to our celebration",
  ganeshaImage: defaultPhotos.ganesha,
};

const defaultCoupleData: CoupleData = {
  sectionLabel: "The Couple",
  sectionTitle: "Hamsini Sriya & S. V. Janak",
  monogramWord: "with",
  bride: {
    name: defaultCouple.bride.name,
    detail: defaultCouple.bride.detail,
    photo: defaultPhotos.yay,
  },
  groom: {
    name: defaultCouple.groom.name,
    detail: defaultCouple.groom.detail,
    photo: defaultPhotos.mesmarizing,
  },
  story: "Two journeys. One sacred union.",
};

const defaultFamilyData: FamilyData = {
  sectionLabel: "Family Blessings",
  sectionTitle: "Two Families, One Beginning",
  hosts: defaultFamilies.hosts,
  hostsLine: defaultFamilies.hostsLine,
  brideGrand: defaultFamilies.brideGrand,
  groomParents: defaultFamilies.groomParents,
  groomGrand: defaultFamilies.groomGrand,
  regardsTitle: "Warm Regards",
  regards: defaultFamilies.regards,
  closingMessage: defaultFamilies.closingMessage,
  sacredPhrases: ["Two families.", "Two journeys.", "One sacred union."],
  photo: defaultPhotos.fam,
  brideFamilyLabel: "The Bride's Family",
  groomFamilyLabel: "The Groom's Family",
  finalInvitationLabel: "Final Invitation",
  finalInvitationTitle: "Your Presence Is Our Blessing",
  specialBlessingsImages: {
    enabled: true,
    sectionTitle: "SPECIAL BLESSINGS",
    items: [
      {
        id: "sbi1",
        url: defaultPhotos.yay,
        alt: "Special Blessings Moment",
        enabled: true,
        order: 1,
      },
      {
        id: "sbi2",
        url: defaultPhotos.mesmarizing,
        alt: "Family Heritage Moment",
        enabled: true,
        order: 2,
      },
    ],
  },
};

const defaultRSVPSettings: RSVPSettingsData = {
  sectionLabel: "RSVP",
  title: "Kindly Respond",
  subtitle: "We look forward to celebrating with you. Please let us know your attendance.",
  gratitudeHeading: "With gratitude",
  nameLabel: "Name",
  guestsLabel: "Number of Guests",
  attendingLabel: "Will you be joining us?",
  messageLabel: "Optional Message",
  submitButtonText: "Kindly Respond",
  successMessage: "Thank you! Your RSVP response has been received with joy.",
};

const defaultEventsSection: EventsSectionData = {
  sectionLabel: "The Wedding Journey",
  sectionTitle: "Celebration Chapters",
  chapterPrefix: "Chapter",
  viewLocationText: "View Location",
  addToCalendarText: "Add to Calendar",
};

const defaultGallerySection: GallerySectionData = {
  sectionLabel: "Photographic Moments",
  sectionTitle: "Some Moments Become Forever",
};

const defaultCountdown: CountdownData = {
  sectionLabel: "The Awaited Day",
  sectionTitle: "Until We Say I Do",
  completedMessage: "The celebration has begun",
};

const defaultWeddingReelsSection: WeddingReelsSectionData = {
  enabled: true,
  sectionLabel: "Celebration Highlights",
  sectionTitle: "Reels",
  subtitle: "Memorable moments in motion as we count down to our special day",
  autoScrollSpeed: "medium",
  items: [
    {
      id: "wr1",
      type: "video",
      url: "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-in-a-field-41584-large.mp4",
      instagramUrl: "https://www.instagram.com/reel/C_sriya_janak_1/",
      thumbnail: defaultPhotos.heroPhotograph,
      title: "Golden Hour Stroll",
      caption: "Sriya & Janak amidst nature's quiet beauty",
      visible: true,
      order: 1,
    },
    {
      id: "wr2",
      type: "video",
      url: "https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-smiling-and-hugging-41588-large.mp4",
      instagramUrl: "https://www.instagram.com/reel/C_sriya_janak_2/",
      thumbnail: defaultPhotos.mesmarizing,
      title: "Laughter & Togetherness",
      caption: "Pre-wedding bliss and joyful smiles",
      visible: true,
      order: 2,
    },
    {
      id: "wr3",
      type: "video",
      url: "https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-41589-large.mp4",
      instagramUrl: "https://www.instagram.com/reel/C_sriya_janak_3/",
      thumbnail: defaultPhotos.ring,
      title: "Sacred Promises",
      caption: "Hand in hand towards a lifetime of love",
      visible: true,
      order: 3,
    },
    {
      id: "wr4",
      type: "video",
      url: "https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-dancing-at-their-wedding-reception-41590-large.mp4",
      instagramUrl: "https://www.instagram.com/reel/C_sriya_janak_4/",
      thumbnail: defaultPhotos.aMoment,
      title: "Celebration Dance",
      caption: "Cherishing every step of our journey",
      visible: true,
      order: 4,
    },
    {
      id: "wr5",
      type: "video",
      url: "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-posing-for-the-camera-41586-large.mp4",
      instagramUrl: "https://www.instagram.com/reel/C_sriya_janak_5/",
      thumbnail: defaultPhotos.yay,
      title: "Together Forever",
      caption: "A glimpse into our auspicious celebration",
      visible: true,
      order: 5,
    },
  ],
};


const defaultReelsSection: ReelsSectionData = {
  sectionLabel: "Celebration Highlights",
  sectionTitle: "Moments In Motion",
  autoScrollSpeed: "medium",
  direction: "left",
  items: [
    {
      id: "r1",
      type: "video",
      url: "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-in-a-field-41584-large.mp4",
      thumbnail: defaultPhotos.heroPhotograph,
      title: "Wedding Teaser",
      caption: "A sneak peek of Sriya & Janak's sacred union",
      visible: true,
      order: 1,
    },
    {
      id: "r2",
      type: "image",
      url: defaultPhotos.yay,
      title: "Joyful Beginnings",
      caption: "Sriya arriving at the ceremony",
      visible: true,
      order: 2,
    },
    {
      id: "r3",
      type: "video",
      url: "https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-smiling-and-hugging-41588-large.mp4",
      thumbnail: defaultPhotos.mesmarizing,
      title: "Haldi & Sangeet Vibe",
      caption: "Laughter, music & traditions",
      visible: true,
      order: 3,
    },
    {
      id: "r4",
      type: "image",
      url: defaultPhotos.ring,
      title: "Ring Ceremony",
      caption: "Exchanging vows of love & commitment",
      visible: true,
      order: 4,
    },
    {
      id: "r5",
      type: "image",
      url: defaultPhotos.aMoment,
      title: "Golden Hour Bliss",
      caption: "Forever starts today",
      visible: true,
      order: 5,
    },
  ],
};

const defaultSpecialBlessingsSection: SpecialBlessingsSectionData = {
  enabled: true,
  sectionLabel: "Sacred Wishes",
  sectionTitle: "Special Blessings From",
  items: [
    {
      id: "sb1",
      name: "His Holiness & Revered Elders",
      relationship: "Spiritual Guidance & Elders",
      message: "May your sacred union be blessed with eternal health, prosperity, and devotion. Walk together with grace and unwavering love through all of life's journeys.",
      image: defaultPhotos.yay,
      additionalText: "With heartfelt blessings",
      enabled: true,
      order: 1,
    },
    {
      id: "sb2",
      name: "Extended Family & Well-wishers",
      relationship: "Beloved Family & Kin",
      message: "Sending our warmest love and blessings to Sriya & Janak as two grand traditions unite into one beautiful, lifelong story.",
      image: defaultPhotos.mesmarizing,
      additionalText: "Always in our prayers",
      enabled: true,
      order: 2,
    },
    {
      id: "sb3",
      name: "Distinguished Mentors & Friends",
      relationship: "Cherished Mentors & Friends",
      message: "Wishing you a lifetime of joy, laughter, shared dreams, and divine protection on this auspicious celebration.",
      image: defaultPhotos.ring,
      additionalText: "Best wishes always",
      enabled: true,
      order: 3,
    },
  ],
};

export const defaultDepartments: DepartmentItem[] = [
  {
    id: "dept-1",
    name: "Camera",
    headName: "John",
    phone: "9876543210",
    teamMembersCount: 8,
    whatsapp: "9876543210",
    active: true,
    order: 1,
  },
  {
    id: "dept-2",
    name: "Live",
    headName: "Rahul",
    phone: "9876543211",
    teamMembersCount: 12,
    whatsapp: "9876543211",
    active: true,
    order: 2,
  },
  {
    id: "dept-3",
    name: "Sound",
    headName: "Alex",
    phone: "9876543212",
    teamMembersCount: 6,
    whatsapp: "9876543212",
    active: true,
    order: 3,
  },
  {
    id: "dept-4",
    name: "Lighting",
    headName: "David",
    phone: "9876543213",
    teamMembersCount: 10,
    whatsapp: "9876543213",
    active: true,
    order: 4,
  },
  {
    id: "dept-5",
    name: "Decoration",
    headName: "Suresh",
    phone: "9876543214",
    teamMembersCount: 15,
    whatsapp: "9876543214",
    active: true,
    order: 5,
  },
  {
    id: "dept-6",
    name: "Catering",
    headName: "Vikram",
    phone: "9876543215",
    teamMembersCount: 20,
    whatsapp: "9876543215",
    active: true,
    order: 6,
  },
  {
    id: "dept-7",
    name: "Transport",
    headName: "Ramesh",
    phone: "9876543216",
    teamMembersCount: 8,
    whatsapp: "9876543216",
    active: true,
    order: 7,
  },
];

export const defaultDepartmentDetails: DepartmentDetailsSectionData = {
  enabled: true,
  sectionLabel: "Event Operations & Coordination",
  sectionTitle: "Department Details",
  subtitle: "Key contacts and operational leads dedicated to orchestrating our celebration",
  departments: defaultDepartments,
};

const initialData: DynamicWeddingData = {
  settings: {
    invocation: defaultCouple.invocation,
    tagline: defaultCouple.tagline,
    weddingDateLabel: defaultCouple.weddingDateLabel,
    sumuhurtham: defaultCouple.sumuhurtham,
    city: defaultCouple.city,
    weddingISO: defaultCouple.weddingISO,
  },
  hero: defaultHero,
  intro: defaultIntro,
  couple: defaultCoupleData,
  events: defaultEvents as WeddingEvent[],
  gallery: defaultGallery as unknown as Array<{ id?: string; src: string; alt: string; span?: "tall" | "wide"; category?: string; visible?: boolean }>,
  family: defaultFamilyData,
  navigation: defaultNavigation,
  quotes: defaultQuotes,
  footer: defaultFooter,
  socialLinks: defaultSocialLinks,
  seo: defaultSEO,
  sections: defaultSections,
  rsvpSettings: defaultRSVPSettings,
  eventsSection: defaultEventsSection,
  gallerySection: defaultGallerySection,
  reelsSection: defaultReelsSection,
  weddingReelsSection: defaultWeddingReelsSection,
  specialBlessingsSection: defaultSpecialBlessingsSection,
  departmentDetails: defaultDepartmentDetails,
  departments: defaultDepartments,
  heroVideo: defaultHeroVideo,
  countdown: defaultCountdown,
  musicTrack: "/audio/wedding-song.mp3",
  loading: true,
  isFromFirebase: false,
};

export function useWeddingData(): DynamicWeddingData {
  const [data, setData] = useState<DynamicWeddingData>(initialData);

  useEffect(() => {
    const weddingRef = ref(db, "wedding");

    const unsubscribe = onValue(
      weddingRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          
          const rawEvents = val.events
            ? (Array.isArray(val.events) ? val.events : Object.values(val.events))
            : initialData.events;
            
          const rawGallery = val.gallery
            ? (Array.isArray(val.gallery) ? val.gallery : Object.values(val.gallery))
            : initialData.gallery;

          const rawSections = val.sections
            ? (Array.isArray(val.sections) ? val.sections : Object.values(val.sections))
            : initialData.sections;

          const rawSocialLinks = val.socialLinks
            ? (Array.isArray(val.socialLinks) ? val.socialLinks : Object.values(val.socialLinks))
            : initialData.socialLinks;

          // If reelsSection exists in Firebase but has no items, use [] not defaults
          const rawReels = val.reelsSection
            ? (val.reelsSection.items
                ? (Array.isArray(val.reelsSection.items) ? val.reelsSection.items : Object.values(val.reelsSection.items))
                : [])
            : initialData.reelsSection?.items;

          // Same for weddingReelsSection
          const rawWeddingReels = val.weddingReelsSection
            ? (val.weddingReelsSection.items
                ? (Array.isArray(val.weddingReelsSection.items) ? val.weddingReelsSection.items : Object.values(val.weddingReelsSection.items))
                : [])
            : initialData.weddingReelsSection?.items ?? [];

          // Same fix for specialBlessingsSection items
          const rawSpecialBlessings = val.specialBlessingsSection
            ? (val.specialBlessingsSection.items
                ? (Array.isArray(val.specialBlessingsSection.items) ? val.specialBlessingsSection.items : Object.values(val.specialBlessingsSection.items))
                : [])
            : initialData.specialBlessingsSection?.items;

          // Normalise family.specialBlessingsImages.items (Firebase stores arrays as objects)
          const rawFamilySBItems = val.family?.specialBlessingsImages?.items
            ? (Array.isArray(val.family.specialBlessingsImages.items)
                ? val.family.specialBlessingsImages.items
                : Object.values(val.family.specialBlessingsImages.items))
            : undefined;

          // Normalise departmentDetails.departments (Firebase stores arrays as objects)
          const rawDepartments = val.departmentDetails?.departments
            ? (Array.isArray(val.departmentDetails.departments)
                ? val.departmentDetails.departments
                : Object.values(val.departmentDetails.departments))
            : val.departments
            ? (Array.isArray(val.departments)
                ? val.departments
                : Object.values(val.departments))
            : initialData.departmentDetails?.departments || [];

          setData({
            settings: { ...initialData.settings, ...(val.settings || {}) },
            hero: { ...initialData.hero, ...(val.hero || {}) },
            intro: { ...initialData.intro, ...(val.intro || {}) },
            couple: {
              ...initialData.couple,
              ...(val.couple || {}),
              bride: { ...initialData.couple.bride, ...(val.couple?.bride || {}) },
              groom: { ...initialData.couple.groom, ...(val.couple?.groom || {}) },
              story: val.couple?.story || initialData.couple.story,
            },
            events: rawEvents as WeddingEvent[],
            gallery: rawGallery,
            family: {
              ...initialData.family,
              ...(val.family || {}),
              ...(val.family?.specialBlessingsImages
                ? {
                    specialBlessingsImages: {
                      ...val.family.specialBlessingsImages,
                      items: rawFamilySBItems,
                    },
                  }
                : {}),
            },
            navigation: {
              ...initialData.navigation,
              ...(val.navigation || {}),
              links: (() => {
                const rawLinks = val.navigation?.links
                  ? (Array.isArray(val.navigation.links) ? val.navigation.links : Object.values(val.navigation.links))
                  : initialData.navigation.links;
                const filtered = (rawLinks as NavigationItem[]).filter(
                  (l: NavigationItem) => l.id !== "rsvp" && l.href !== "#rsvp" && !l.label?.toUpperCase().includes("RSVP")
                );
                const hasContact = filtered.some((l) => l.label?.toUpperCase() === "CONTACT" || l.href === "#departments" || l.href === "#department-details");
                if (!hasContact) {
                  filtered.push({ id: "6", label: "Contact", href: "#departments", visible: true });
                }
                return filtered;
              })(),
            },
            quotes: { ...initialData.quotes, ...(val.quotes || {}) },
            footer: { ...initialData.footer, ...(val.footer || {}) },
            socialLinks: rawSocialLinks,
            seo: { ...initialData.seo, ...(val.seo || {}) },
            sections: rawSections
              .filter((s: SectionItem) => s.id !== "rsvp")
              .sort((a: SectionItem, b: SectionItem) => (a.order || 0) - (b.order || 0)),
            rsvpSettings: { ...initialData.rsvpSettings, ...(val.rsvpSettings || {}) },
            eventsSection: { ...initialData.eventsSection, ...(val.eventsSection || {}) },
            gallerySection: { ...initialData.gallerySection, ...(val.gallerySection || {}) },
            reelsSection: {
              ...initialData.reelsSection,
              ...(val.reelsSection || {}),
              items: rawReels as CelebrationReelItem[],
            },
            weddingReelsSection: {
              ...initialData.weddingReelsSection,
              ...(val.weddingReelsSection || {}),
              items: rawWeddingReels as CelebrationReelItem[],
            },
            specialBlessingsSection: {
              ...initialData.specialBlessingsSection,
              ...(val.specialBlessingsSection || {}),
              items: rawSpecialBlessings as SpecialBlessingItem[],
            },
            departmentDetails: {
              ...initialData.departmentDetails,
              ...(val.departmentDetails || {}),
              departments: (rawDepartments as DepartmentItem[]).sort((a, b) => (a.order || 0) - (b.order || 0)),
            },
            departments: (rawDepartments as DepartmentItem[]).sort((a, b) => (a.order || 0) - (b.order || 0)),
            heroVideo: { ...initialData.heroVideo, ...(val.heroVideo || {}) },
            countdown: { ...initialData.countdown, ...(val.countdown || {}) },
            musicTrack: val.musicTrack || initialData.musicTrack,
            loading: false,
            isFromFirebase: true,
          });
        } else {
          // Seed defaults to RTDB if completely empty
          set(weddingRef, {
            settings: initialData.settings,
            hero: initialData.hero,
            intro: initialData.intro,
            couple: initialData.couple,
            events: initialData.events,
            gallery: initialData.gallery,
            family: initialData.family,
            navigation: initialData.navigation,
            quotes: initialData.quotes,
            footer: initialData.footer,
            socialLinks: initialData.socialLinks,
            seo: initialData.seo,
            sections: initialData.sections,
            rsvpSettings: initialData.rsvpSettings,
            eventsSection: initialData.eventsSection,
            gallerySection: initialData.gallerySection,
            departmentDetails: initialData.departmentDetails,
            departments: initialData.departments,
            countdown: initialData.countdown,
            musicTrack: initialData.musicTrack,
          }).catch((e) => console.warn("Firebase RTDB seed error:", e));

          setData({ ...initialData, loading: false });
        }
      },
      (error) => {
        console.warn("Firebase RTDB read error (using fallback):", error);
        setData({ ...initialData, loading: false });
      }
    );

    return () => unsubscribe();
  }, []);

  return data;
}

/** Helper to update a specific path in Firebase RTDB */
export async function updateWeddingPath(path: string, payload: any): Promise<void> {
  const targetRef = ref(db, `wedding/${path}`);
  await set(targetRef, payload);
}


