import type { ServicePreview } from "@/types";
import { SERVICES } from "@/lib/demo-data";

/**
 * Rich per-service content for /services/[slug].
 * TEMPORARY demo content — maps to the `Service` model (data-models.md) and will
 * be replaced by DB reads later. Root Canal is fully authored (design source);
 * other services fall back to coherent generated content derived from the preview.
 */

export interface TreatmentStep {
  n: string;
  title: string;
  desc: string;
  painless: boolean;
}

export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface BeforeAfter {
  caption: string;
}

export interface ServiceDetail extends ServicePreview {
  tagline: string; // hero paragraph
  heroImage: string;
  symptomsIntro: string;
  symptoms: string[];
  stepsIntro: string;
  steps: TreatmentStep[];
  priceMin: number;
  priceMax: number;
  priceUnit: string;
  includes: string[];
  gallery: BeforeAfter[];
  faqs: ServiceFAQ[];
}

const ROOT_CANAL: Partial<ServiceDetail> = {
  tagline:
    "Save your natural tooth and end the pain — without extraction. Done gently, with modern anesthesia. Most patients feel nothing at all.",
  heroImage:
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&q=80",
  symptomsIntro:
    "If you notice one or more of these signs, your tooth may need a root canal. The sooner you act, the easier the treatment — and the more likely we can save your tooth.",
  symptoms: [
    "Sensitivity to hot or cold food and drinks",
    "Throbbing toothache that keeps you awake at night",
    "Swollen or tender gums around one tooth",
    "Pain when chewing or biting down",
    "A tooth that has turned dark or gray",
  ],
  stepsIntro:
    "Four simple steps, usually over 2–3 short visits. We explain everything before we begin.",
  steps: [
    {
      n: "1",
      title: "Gentle Examination & Digital X-ray",
      desc: "We look at the tooth and take a quick digital X-ray to see exactly what is happening inside.",
      painless: true,
    },
    {
      n: "2",
      title: "Painless Local Anesthesia",
      desc: "A tiny amount of numbing gel first, then anesthesia. You will not feel the treatment at all.",
      painless: true,
    },
    {
      n: "3",
      title: "Cleaning & Sealing the Tooth",
      desc: "We remove the infection from inside the tooth and seal it to stop the pain permanently.",
      painless: true,
    },
    {
      n: "4",
      title: "Crown Placement for Protection",
      desc: "A natural-looking crown protects the tooth so you can chew normally for years to come.",
      painless: false,
    },
  ],
  priceMin: 4000,
  priceMax: 8000,
  priceUnit: "per tooth",
  includes: [
    "Digital X-ray & full examination",
    "Local anesthesia",
    "All treatment visits (2–3)",
    "Final permanent filling",
  ],
  gallery: [
    { caption: "Molar saved with root canal + crown — no more night pain." },
    { caption: "Front tooth treated and restored in a single visit." },
    { caption: "Darkened tooth brought back to a natural, healthy look." },
  ],
  faqs: [
    {
      q: "Does a root canal hurt?",
      a: "No. With modern local anesthesia, the treatment itself is painless — most patients say it feels like getting a normal filling. In fact, a root canal removes the source of your pain. Mild soreness for a day or two afterward is normal and goes away with a simple painkiller.",
    },
    {
      q: "How many visits will it take?",
      a: "Usually 2–3 visits of 30–45 minutes each. Simple cases on front teeth can sometimes be finished in a single visit. We will tell you the exact plan after your first examination.",
    },
    {
      q: "How much does it cost?",
      a: "৳4,000 to ৳8,000 per tooth, depending on which tooth needs treatment. This includes the X-ray, anesthesia, all visits, and the final filling. A protective crown, if needed, is priced separately — and we tell you everything before starting.",
    },
    {
      q: "Can I eat normally afterward?",
      a: "Yes. Wait until the numbness wears off (2–3 hours), then eat soft food on the other side for the first day. Once your final filling or crown is placed, you can eat everything normally — including hard foods.",
    },
    {
      q: "Is it better to just remove the tooth?",
      a: "In most cases, no. Saving your natural tooth is almost always better — it keeps your bite strong and avoids the higher cost of an implant or bridge later. We only recommend extraction when a tooth truly cannot be saved, and we will always tell you honestly.",
    },
  ],
};

/** Fully-authored details keyed by slug. Others use the generated fallback. */
const AUTHORED: Record<string, Partial<ServiceDetail>> = {
  "root-canal": ROOT_CANAL,
};

/** Coherent generic detail derived from the preview — placeholder until DB. */
function fallbackDetail(s: ServicePreview): ServiceDetail {
  const name = s.name.toLowerCase();
  return {
    ...s,
    tagline: `${s.desc} Done gently by an experienced specialist, with clear pricing and no surprises.`,
    heroImage: s.image.replace("w=600", "w=1200"),
    symptomsIntro:
      "If any of the below sounds familiar, it may be time to see us. Early care is simpler, gentler, and more affordable.",
    symptoms: [
      "Pain, discomfort, or sensitivity that won't go away",
      "Trouble eating, chewing, or smiling with confidence",
      "A problem a friend or family member noticed",
      "You simply want a check-up and honest advice",
    ],
    stepsIntro:
      "A simple, comfortable process — we explain every step before we begin.",
    steps: [
      {
        n: "1",
        title: "Gentle Examination",
        desc: `We assess your ${name} carefully and explain exactly what's going on — in plain language.`,
        painless: true,
      },
      {
        n: "2",
        title: "Clear Treatment Plan",
        desc: "You get an honest plan and the full price before anything starts. No surprises.",
        painless: true,
      },
      {
        n: "3",
        title: "Comfortable Treatment",
        desc: "Modern equipment and a gentle approach keep you relaxed and pain-free throughout.",
        painless: true,
      },
      {
        n: "4",
        title: "Aftercare & Follow-up",
        desc: "Simple aftercare advice, and we're always a message away if you have questions.",
        painless: false,
      },
    ],
    priceMin: s.feeFrom,
    priceMax: Math.round(s.feeFrom * 2),
    priceUnit: "onwards",
    includes: [
      "Full examination & honest advice",
      "Modern, sterilised equipment",
      "Treatment by an experienced doctor",
      "Clear pricing before we start",
    ],
    gallery: [
      { caption: "A real result from one of our patients." },
      { caption: "Comfortable treatment, natural-looking result." },
      { caption: "Healthy, confident smiles — every day." },
    ],
    faqs: [
      {
        q: `Does ${s.name} hurt?`,
        a: "With modern anesthesia and a gentle approach, most patients feel little to nothing. Your comfort is our priority, and we go at your pace.",
      },
      {
        q: "How much will it cost?",
        a: "You'll know the exact price before treatment begins — no hidden costs, ever. The final fee depends on your specific case, which we'll explain clearly.",
      },
      {
        q: "How many visits will I need?",
        a: "It depends on your case, but we'll always tell you the plan up front after your first examination.",
      },
      {
        q: "Can I pay in installments?",
        a: "Yes — for larger treatments you can pay per visit rather than all at once. Ask us and we'll arrange it.",
      },
    ],
  };
}

export function getServiceDetail(slug: string): ServiceDetail | null {
  const preview = SERVICES.find((s) => s.slug === slug);
  if (!preview) return null;
  const authored = AUTHORED[slug];
  return authored
    ? ({ ...fallbackDetail(preview), ...authored } as ServiceDetail)
    : fallbackDetail(preview);
}

export function getAllServiceSlugs(): string[] {
  return SERVICES.map((s) => s.slug);
}
