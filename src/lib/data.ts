// Single source of truth for The Creatives zm — taken from the 2026 Price Guide.
// Shared by the client UI and the /api/bookings route handler.

export const BRAND = {
  name: "The Creatives zm",
  pillars: "Class | Style | Elegance",
  tagline: "If the work isn't clean, then it wasn't our work.",
  location: "S.O.S Roundabout, Lusaka, Zambia",
  phoneDisplay: "+260 975 939 390",
  phoneE164: "+260975939390",
  whatsappNumber: "260975939390",
} as const;

export const PAYMENT_ACCOUNTS = [
  { id: "airtel", provider: "Airtel Money", number: "+260 975 939 390", name: "Joseph Lungu" },
  { id: "mtn", provider: "MTN Mobile Money", number: "+260 763 765 443", name: "Joseph Lungu" },
] as const;

export type PaymentMethodId = (typeof PAYMENT_ACCOUNTS)[number]["id"];

export const DEPOSIT_RATE = 0.5;
export const FREE_CANVAS_THRESHOLD = 1000;

export type CategoryId = "weddings" | "traditional" | "shoots" | "studio";

export const SERVICE_FILTERS: { id: "all" | CategoryId; label: string }[] = [
  { id: "all", label: "All Services" },
  { id: "weddings", label: "Weddings" },
  { id: "traditional", label: "Traditional Events" },
  { id: "shoots", label: "Shoots & Graduates" },
  { id: "studio", label: "Studio" },
];

export type TierId = "bronze" | "silver" | "gold";

export interface Tier {
  id: TierId;
  name: string;
  price: number; // ZMK per hour
  photos: number;
  stars: 1 | 2 | 3;
  extras?: string[];
}

export interface Service {
  id: string;
  category: CategoryId;
  title: string;
  subtitle?: string;
  image: string;
  coverage: string[];
  deliverables: string[];
  /** Flat package price (fixed packages). */
  price?: number;
  /** Hourly Bronze/Silver/Gold tiers. */
  tiers?: Tier[];
  hourly: boolean;
  note?: string;
  /** Canvas print is already part of the deliverables. */
  includesCanvas?: boolean;
  /** Calendar block length for fixed packages (hourly services use the booked hours). Estimate — adjust freely. */
  durationHours?: number;
}

const hourlyTiers = (bronze: number, silver: number, gold: number): Tier[] => [
  { id: "bronze", name: "Bronze", price: bronze, photos: 10, stars: 1 },
  { id: "silver", name: "Silver", price: silver, photos: 15, stars: 2 },
  { id: "gold", name: "Gold", price: gold, photos: 25, stars: 3, extras: ["Free canvas print"] },
];

export const SERVICES: Service[] = [
  {
    id: "wedding",
    category: "weddings",
    title: "Weddings Coverage",
    subtitle: "Your full wedding day, beautifully told",
    image: "/images/wedding-couple.jpg",
    coverage: ["Bride & Groom preparations", "Church services", "Photo session", "Reception"],
    deliverables: ["150 soft copy photos", "Hard copy photo magazine"],
    price: 5000,
    hourly: false,
    durationHours: 10,
  },
  {
    id: "traditional",
    category: "traditional",
    title: "Traditional & Event Coverage",
    subtitle: "Chilanga Mulilo · Kitchen Party · Bridal Shower · Marriage Blessing",
    image: "/images/traditional-pot.jpg",
    coverage: ["Bride preparations", "Photo session", "Groom's side (Chilanga Mulilo)"],
    deliverables: ["70 soft copy photos", "1 canvas print out"],
    price: 3500,
    hourly: false,
    includesCanvas: true,
    durationHours: 5,
  },
  {
    id: "birthday",
    category: "shoots",
    title: "Birthday / Outdoor / Ordinary Shoot",
    subtitle: "Birthdays, lifestyle, couples & outdoor portraits",
    image: "/images/birthday.jpg",
    coverage: ["On-location photo session", "Professional editing"],
    deliverables: ["Edited soft copy photos per tier"],
    tiers: hourlyTiers(700, 900, 1500),
    hourly: true,
    note: "Photo shoot is strictly per hour.",
  },
  {
    id: "graduation",
    category: "shoots",
    title: "Graduation Shoot / Coverage",
    subtitle: "Celebrate the milestone in style",
    image: "/images/graduate-gown.jpg",
    coverage: ["Family photo session", "Graduate's individual photo session"],
    deliverables: ["Edited soft copy photos per tier"],
    tiers: hourlyTiers(700, 900, 1500),
    hourly: true,
    note: "Photo shoot is strictly per hour.",
  },
  {
    id: "studio",
    category: "studio",
    title: "Studio Photo Shoot",
    subtitle: "Mobile studio — we bring the studio to you",
    image: "/images/studio-couple.jpg",
    coverage: ["Mobile studio set-up at your location", "Studio lighting & backdrop"],
    deliverables: ["Edited soft copy photos per tier"],
    tiers: hourlyTiers(750, 950, 1550),
    hourly: true,
    note: "We're currently only offering mobile studio services — we follow the client to their location. Photo shoot is strictly per hour.",
  },
];

export interface AddOn {
  id: string;
  label: string;
  description: string;
  price: number;
  /** Services the add-on can't be combined with (already included, etc.). */
  excludes?: string[];
}

// NOTE: The 2026 price guide does not list add-on prices.
// These are PLACEHOLDER prices — confirm them with The Creatives before going live.
export const ADD_ONS: AddOn[] = [
  {
    id: "extra-canvas",
    label: "Extra canvas print",
    description: "An additional framed canvas of your favourite shot.",
    price: 350,
  },
  {
    id: "photo-magazine",
    label: "Hard copy photo magazine",
    description: "A printed magazine-style album of your session.",
    price: 1000,
    excludes: ["wedding"],
  },
  {
    id: "express-edit",
    label: "Express editing",
    description: "Priority editing with delivery within 72 hours.",
    price: 300,
  },
];

export const MAX_HOURS = 8;

export const TERMS = [
  {
    icon: "alert" as const,
    title: "50% Down Payment",
    body: "A 50% down payment is required to secure your slot. The deposit is non-refundable.",
  },
  {
    icon: "truck" as const,
    title: "Transport",
    body: "The client provides transport (to and from) depending on the shoot location.",
  },
  {
    icon: "image" as const,
    title: "Free Canvas Bonus",
    body: "Packages from ZMK 1,000 automatically come with a free canvas print.",
  },
];

export type PortfolioCategory = "weddings" | "engagement" | "traditional" | "graduation" | "shoots" | "studio";

export interface Photo {
  src: string;
  alt: string;
  category: PortfolioCategory;
  w: number;
  h: number;
}

export const PORTFOLIO_FILTERS: { id: "all" | PortfolioCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "weddings", label: "Weddings" },
  { id: "engagement", label: "Engagements" },
  { id: "traditional", label: "Traditional & Showers" },
  { id: "graduation", label: "Graduation" },
  { id: "shoots", label: "Shoots" },
  { id: "studio", label: "Studio" },
];

/** Every photo on the site, grouped by shoot type. Add new photos here (files go in /public/images). */
export const PHOTOS: Photo[] = [
  // Weddings
  { src: "/images/wedding-couple.jpg", alt: "Bride with bouquet and groom in a garden", category: "weddings", w: 1080, h: 1350 },
  { src: "/images/wedding-kiss.jpg", alt: "Groom kissing the bride's hand", category: "weddings", w: 1400, h: 931 },
  { src: "/images/wedding-bride-car.jpg", alt: "Bride seated in the wedding car", category: "weddings", w: 933, h: 1400 },
  { src: "/images/wedding-prep.jpg", alt: "Bride's hair and make-up preparations", category: "weddings", w: 1400, h: 931 },
  // Engagements & couples
  { src: "/images/engagement-couple.jpg", alt: "Engaged couple embracing beside an art-filled wall", category: "engagement", w: 864, h: 1080 },
  { src: "/images/engagement-ring-kiss.jpg", alt: "Fiancé kissing his partner's hand to show the engagement ring", category: "engagement", w: 772, h: 1080 },
  { src: "/images/engagement-stairs.jpg", alt: "Couple resting together on a rustic wooden staircase", category: "engagement", w: 864, h: 1080 },
  { src: "/images/engagement-bouquet.jpg", alt: "Smiling fiancée holding a red rose 'Engaged' bouquet", category: "engagement", w: 864, h: 1080 },
  { src: "/images/engagement-red-dress.jpg", alt: "Woman in a red halter dress posing by a vintage dresser", category: "engagement", w: 864, h: 1080 },
  { src: "/images/couple-outdoor.jpg", alt: "Intimate outdoor couple portrait", category: "engagement", w: 699, h: 1049 },
  // Traditional ceremonies, kitchen parties & bridal showers
  { src: "/images/bridal-shower-gown.jpg", alt: "Bride-to-be in a beaded pink gown at her bridal shower", category: "traditional", w: 1000, h: 1400 },
  { src: "/images/bridal-shower-sofa-smile.jpg", alt: "Bride-to-be smiling on a white sofa beside a floral arrangement", category: "traditional", w: 1080, h: 720 },
  { src: "/images/bridal-shower-portrait.jpg", alt: "Playful bridal shower portrait in a pink off-shoulder gown", category: "traditional", w: 1080, h: 1350 },
  { src: "/images/bridal-shower-sofa.jpg", alt: "Bride-to-be seated on a white sofa at her 'Becoming Mrs' shower", category: "traditional", w: 1080, h: 720 },
  { src: "/images/traditional-cooking.jpg", alt: "Women stirring nshima at a traditional ceremony", category: "traditional", w: 718, h: 1080 },
  { src: "/images/traditional-pot.jpg", alt: "Bride-to-be at a traditional cooking ceremony", category: "traditional", w: 931, h: 1400 },
  { src: "/images/traditional-celebration.jpg", alt: "Guests celebrating at a kitchen party", category: "traditional", w: 1080, h: 718 },
  // Graduations
  { src: "/images/graduate-smile.jpg", alt: "Smiling graduate wearing her academic sash", category: "graduation", w: 677, h: 1016 },
  { src: "/images/graduate-portrait.jpg", alt: "Graduate portrait at a heritage doorway", category: "graduation", w: 1080, h: 1350 },
  { src: "/images/graduate-gown.jpg", alt: "Graduate holding her mortarboard on campus", category: "graduation", w: 933, h: 1400 },
  // Birthdays & outdoor shoots
  { src: "/images/birthday.jpg", alt: "Toddler at a themed birthday celebration", category: "shoots", w: 933, h: 1400 },
  { src: "/images/outdoor-portrait.jpg", alt: "Outdoor lifestyle portrait in natural light", category: "shoots", w: 714, h: 1071 },
  // Mobile studio
  { src: "/images/studio-couple-play.jpg", alt: "Playful couple portrait in the mobile studio", category: "studio", w: 1080, h: 1350 },
  { src: "/images/studio-rose.jpg", alt: "Studio portrait of a woman holding a red rose", category: "studio", w: 660, h: 989 },
  { src: "/images/studio-graduate.jpg", alt: "Graduate in gown and cap in the studio", category: "studio", w: 933, h: 1400 },
  { src: "/images/studio-couple.jpg", alt: "Couple seated back to back in the studio", category: "studio", w: 1080, h: 1350 },
];

/** Curated mix for the home page; the full set lives on /gallery. */
const FEATURED = [
  "wedding-couple", "engagement-couple", "traditional-cooking", "graduate-smile", "studio-couple-play",
  "bridal-shower-gown", "wedding-kiss", "birthday", "engagement-ring-kiss", "wedding-bride-car",
  "studio-rose", "traditional-celebration", "graduate-portrait", "engagement-stairs", "studio-graduate",
  "outdoor-portrait", "bridal-shower-sofa-smile",
];
export const PORTFOLIO: Photo[] = FEATURED.map((name) => PHOTOS.find((p) => p.src === `/images/${name}.jpg`)!);

export interface GallerySection {
  id: PortfolioCategory;
  title: string;
  blurb: string;
  /** Service pre-selected when booking from this section. */
  serviceId: string;
  bookLabel: string;
}

export const GALLERY_SECTIONS: GallerySection[] = [
  {
    id: "weddings",
    title: "Weddings",
    blurb: "From bridal preparations and the church aisle to the last dance at the reception.",
    serviceId: "wedding",
    bookLabel: "Book wedding coverage",
  },
  {
    id: "engagement",
    title: "Engagements & Couples",
    blurb: "Proposals, pre-wedding sessions and couple portraits full of chemistry.",
    serviceId: "birthday",
    bookLabel: "Book a couple shoot",
  },
  {
    id: "traditional",
    title: "Bridal Showers, Kitchen Parties & Traditional Ceremonies",
    blurb: "Chilanga Mulilo, kitchen parties, bridal showers and marriage blessings — every custom and every smile.",
    serviceId: "traditional",
    bookLabel: "Book event coverage",
  },
  {
    id: "graduation",
    title: "Graduations",
    blurb: "Celebrating the milestone with family portraits and the graduate's own session.",
    serviceId: "graduation",
    bookLabel: "Book a graduation shoot",
  },
  {
    id: "shoots",
    title: "Birthdays & Outdoor Shoots",
    blurb: "Birthday celebrations and relaxed lifestyle portraits in natural light.",
    serviceId: "birthday",
    bookLabel: "Book a birthday / outdoor shoot",
  },
  {
    id: "studio",
    title: "Mobile Studio",
    blurb: "Studio lighting and backdrops, set up wherever you are.",
    serviceId: "studio",
    bookLabel: "Book a studio shoot",
  },
];
