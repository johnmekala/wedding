// All images are served from /public/images/ — no CDN dependency on localhost.
// Original Lovable asset IDs are preserved as comments for reference.

export const photos = {
  heroPhotograph: "/images/hero_photograph.jpg", // Exact uploaded photograph of couple holding hands under SJ monogram
  secondImage: "/images/second_image.jpg", // WhatsApp Image 2026-08-11 at 7.55.21 PM.jpeg (exact 2nd uploaded image)
  awww:        "/images/awww.jpg",        // 3c99d2fb — couple on engagement stage
  yes:         "/images/yes.jpg",         // 424ac38d — quiet golden moment
  yay:         "/images/yay.jpg",         // 08b73981 — Sriya in golden saree
  hey:         "/images/hey.jpg",         // 900655d0 — couple beneath arch
  aMoment:     "/images/a_moment.jpg",    // 6aeb0c51 — ring ceremony on stage
  mesmarizing: "/images/mesmarizing.jpg", // c4889dff — couple in golden light
  ring:        "/images/ring.jpg",        // 14b28a05 — reaching for each other
  wedding:     "/images/wedding.jpg",     // ddd47eff — chandelier wedding
  fam:         "/images/fam.jpg",         // bd4ba1bd — both families
  ganesha:     "/images/ganesha.png",     // generated — sacred Ganesha idol
  monogram:    "/images/monogram.png",    // generated — S & J monogram
};

export const couple = {
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

export const families = {
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

export type WeddingEvent = {
  index: string;
  title: string;
  subtitle?: string;
  message: string;
  day: string;
  dateNum: string;
  month: string;
  year: string;
  time: string;
  timeNote?: string;
  venueName: string;
  venueAddress: string;
  dresscode: string;
  dresscodeDetail?: string;
  tagline?: string;
  image: string;
  imagePosition: string;
  mood: "sunset" | "midnight" | "heritage" | "sacred";
  mapQuery: string;
  mapUrl?: string;
};

export const events: WeddingEvent[] = [
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
    image: photos.ring,
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
    image: photos.aMoment,
    imagePosition: "50% 35%",
    mood: "midnight",
    mapQuery: "Neo Convention Shankarpalli Road Janwada Hyderabad",
  },
  {
    index: "03",
    title: "Pellikuthuru",
    message:
      "You are invited to a day of love, laughter and golden traditions before the sacred journey unfolds",
    day: "Wednesday",
    dateNum: "26",
    month: "Aug",
    year: "2026",
    time: "11:00 AM onwards",
    timeNote: "Followed by Lunch & High-Tea",
    venueName: "Bhumi Farms",
    venueAddress: "Green Acres Farmlands, Near Chilkuri Balaji temple, Hyderabad",
    dresscode: "Vintage",
    image: photos.yay,
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
    image: photos.wedding,
    imagePosition: "50% 35%",
    mood: "sacred",
    mapQuery: "Neo Convention Shankarpalli Road Janwada Hyderabad",
  },
];

export const gallery = [
  { src: photos.awww, alt: "Sriya and Janak on the illuminated engagement stage", span: "tall" },
  { src: photos.yes, alt: "The couple in a quiet golden moment", span: "wide" },
  { src: photos.yay, alt: "Sriya seated among roses in a golden saree", span: "tall" },
  { src: photos.hey, alt: "The couple beneath a marbled arch of light", span: "tall" },
  { src: photos.aMoment, alt: "The ring ceremony on stage", span: "wide" },
  { src: photos.mesmarizing, alt: "The couple silhouetted in golden light", span: "tall" },
  { src: photos.wedding, alt: "The couple beneath a crystal chandelier", span: "tall" },
  { src: photos.fam, alt: "Both families beneath a floral arch", span: "wide" },
  { src: photos.ring, alt: "Sriya and Janak reaching for each other's hands", span: "tall" },
] as const;
