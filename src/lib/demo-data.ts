import type {
  ServicePreview,
  TrustItem,
  WhyCard,
  Review,
  ProblemSolution,
  MythFact,
} from "@/types";

/**
 * Demo/fixture content for the marketing pages.
 * TEMPORARY — replaced by DB reads (Service, Testimonial) in a later phase.
 * Kept here so no page hardcodes its own copy.
 */

export const TRUST_ITEMS: TrustItem[] = [
  { glyph: "10+", big: "10+ Years", small: "of Experience" },
  { glyph: "5K", big: "5,000+", small: "Happy Patients" },
  { glyph: "✓", big: "Painless", small: "Treatment" },
  { glyph: "★", big: "Modern", small: "Equipment" },
];

export const WHY_CARDS: WhyCard[] = [
  {
    glyph: "1",
    title: "Painless Treatment",
    desc: "Modern anesthesia and a gentle approach. Most patients feel nothing at all.",
  },
  {
    glyph: "2",
    title: "Transparent Fees",
    desc: "Know the full cost before treatment starts. No hidden costs, ever.",
  },
  {
    glyph: "3",
    title: "Modern Equipment & Sterilization",
    desc: "Digital X-ray and international-standard sterilization for every patient.",
  },
  {
    glyph: "4",
    title: "Experienced Specialist Doctor",
    desc: "BDS and FCPS qualified, BMDC registered. 10+ years of care.",
  },
];

/** Single source of truth for services (Home shows first 6, Services page all). */
export const SERVICES: ServicePreview[] = [
  {
    slug: "scaling-polishing",
    glyph: "Sc",
    name: "Scaling & Polishing",
    desc: "A fresh, clean smile and healthy gums in one short visit.",
    feeFrom: 1000,
    image:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80",
  },
  {
    slug: "root-canal",
    glyph: "RC",
    name: "Root Canal Treatment",
    desc: "Save your natural tooth and end the pain — without extraction.",
    feeFrom: 4000,
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80",
  },
  {
    slug: "crown-bridge",
    glyph: "Cr",
    name: "Dental Crown & Bridge",
    desc: "Restore broken teeth so they look and feel completely natural.",
    feeFrom: 5000,
    image:
      "https://images.unsplash.com/photo-1445527815219-ecbfec67492e?w=600&q=80",
  },
  {
    slug: "braces-orthodontics",
    glyph: "Br",
    name: "Braces & Orthodontics",
    desc: "Straighten your teeth comfortably — at any age.",
    feeFrom: 30000,
    image:
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=600&q=80",
  },
  {
    slug: "tooth-extraction",
    glyph: "Ex",
    name: "Tooth Extraction",
    desc: "Gentle, painless removal when a tooth truly cannot be saved.",
    feeFrom: 500,
    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80",
  },
  {
    slug: "teeth-whitening",
    glyph: "Wh",
    name: "Teeth Whitening",
    desc: "A visibly brighter smile in a single safe session.",
    feeFrom: 6000,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    slug: "dental-implants",
    glyph: "Im",
    name: "Dental Implants",
    desc: "A permanent replacement that works just like a real tooth.",
    feeFrom: 50000,
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=80",
  },
  {
    slug: "kids-dentistry",
    glyph: "Kd",
    name: "Kids' Dentistry",
    desc: "Friendly, fear-free care that makes children smile at the dentist.",
    feeFrom: 500,
    image:
      "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=600&q=80",
  },
  {
    slug: "gum-treatment",
    glyph: "Gu",
    name: "Gum Treatment",
    desc: "Stop bleeding gums and bad breath before they get worse.",
    feeFrom: 1500,
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80",
  },
  {
    slug: "dentures",
    glyph: "Dn",
    name: "Dentures",
    desc: "Comfortable, natural-looking teeth so you can eat and smile freely.",
    feeFrom: 8000,
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80",
  },
];

export const REVIEWS: Review[] = [
  {
    name: "Rahima A.",
    area: "Mirpur",
    text: "I was scared of my root canal, but I felt no pain at all. The doctor explained every step. Highly recommended.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&fit=crop&crop=faces",
  },
  {
    name: "Kamrul I.",
    area: "Uttara",
    text: "They told me the full price before starting. No extra charges later. The clinic is very clean and modern.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80&fit=crop&crop=faces",
  },
  {
    name: "Nusrat J.",
    area: "Dhanmondi",
    text: "The doctor was so kind with my daughter. She is not afraid of the dentist anymore. Thank you!",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80&fit=crop&crop=faces",
  },
];

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1800&q=80";
export const DOCTOR_IMAGE =
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1000&q=80";
export const PROBLEMS_HERO_IMAGE =
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&q=80";

// ── Problems We Solve page ──────────────────────────────────────────
export const PROBLEMS: ProblemSolution[] = [
  {
    pain: "Severe toothache — I can't sleep at night",
    treatment: "Root Canal Treatment",
    reassure: "Ends the pain permanently and saves your tooth.",
    feeFrom: 4000,
    slug: "root-canal",
  },
  {
    pain: "Bad breath — I feel embarrassed talking to people",
    treatment: "Scaling & Gum Care",
    reassure: "One short visit removes the cause, not just the smell.",
    feeFrom: 1000,
    slug: "scaling-polishing",
  },
  {
    pain: "My teeth have turned yellow",
    treatment: "Teeth Whitening",
    reassure: "A visibly brighter smile in a single safe session.",
    feeFrom: 6000,
    slug: "teeth-whitening",
  },
  {
    pain: "My child cries at the mention of a dentist",
    treatment: "Kids' Dentistry",
    reassure: "Gentle, play-first visits — most kids leave smiling.",
    feeFrom: 500,
    slug: "kids-dentistry",
  },
  {
    pain: "My gums bleed when I brush",
    treatment: "Gum Treatment",
    reassure: "Early treatment stops bleeding and protects your teeth.",
    feeFrom: 1500,
    slug: "gum-treatment",
  },
  {
    pain: "I'm too self-conscious to smile because of crooked teeth",
    treatment: "Braces & Orthodontics",
    reassure: "Comfortable modern braces — at any age.",
    feeFrom: 30000,
    slug: "braces-orthodontics",
  },
];

export const MYTHS: MythFact[] = [
  {
    myth: "Removing a tooth damages your eyes.",
    fact: "This is scientifically false. Tooth extraction has no connection to eyesight.",
  },
  {
    myth: "Scaling makes teeth loose.",
    fact: "Scaling removes harmful tartar — it actually protects teeth from becoming loose.",
  },
  {
    myth: "Root canal is extremely painful.",
    fact: "With modern anesthesia, most patients feel no pain at all.",
  },
  {
    myth: "Baby teeth don't need treatment — they'll fall out anyway.",
    fact: "Untreated baby teeth cause infection and damage the permanent teeth underneath.",
  },
];
