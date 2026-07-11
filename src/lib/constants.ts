/**
 * Single source of truth for constants, enums and clinic info.
 * Imported by BOTH Zod validators and Mongoose schemas (DRY).
 * NEVER hardcode statuses, fees, hours or contact details in components.
 */

// ── Enums / statuses ────────────────────────────────────────────────
export const APPOINTMENT_STATUS = [
  "waiting",
  "in_chamber",
  "completed",
  "no_show",
  "cancelled",
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUS)[number];

export const APPOINTMENT_SOURCE = ["online", "walk_in", "phone"] as const;
export type AppointmentSource = (typeof APPOINTMENT_SOURCE)[number];

export const PAYMENT_STATUS = ["paid", "partial", "due"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const PAYMENT_METHOD = ["bkash", "nagad", "cash", "card"] as const;
export type PaymentMethod = (typeof PAYMENT_METHOD)[number];

export const STAFF_ROLE = ["admin", "doctor", "receptionist"] as const;
export type StaffRole = (typeof STAFF_ROLE)[number];

export const TOOTH_CONDITION = [
  "cavity",
  "filled",
  "extracted",
  "crown",
  "other",
] as const;
export type ToothCondition = (typeof TOOTH_CONDITION)[number];

// ── Clinic info (demo values — move to ClinicSettings DB doc later) ──
export const CLINIC = {
  name: "SmileCare Dental Clinic",
  shortName: "SmileCare",
  tagline: "DENTAL CLINIC",
  about: "Pain-free, modern, and affordable dental care for your whole family.",
  phoneDisplay: "01712-345678",
  phoneE164: "+8801712345678",
  whatsappNumber: "8801712345678",
  email: "hello@smilecare.example",
  address:
    "House 12, Road 3, Block B — next to the Central Jame Mosque, 2nd Floor, Dhaka",
  hours: [
    { label: "Saturday – Thursday", value: "5:00 PM – 9:00 PM", off: false },
    { label: "Friday", value: "Closed", off: true },
  ],
  rating: { score: "4.9", source: "Google Reviews" },
} as const;

export const DOCTOR = {
  name: "Dr. Mahmudul Hasan",
  degrees: "BDS (Dhaka Dental College), FCPS (Conservative Dentistry)",
  eyebrow: "BMDC Registered • 10+ Years of Experience",
  yearsExperience: "10+",
  patientsServed: "5,000+",
} as const;

export const WHATSAPP_URL = `https://wa.me/${CLINIC.whatsappNumber}`;
export const TEL_URL = `tel:${CLINIC.phoneE164}`;

// ── Currency ────────────────────────────────────────────────────────
export const CURRENCY = "৳";
export const formatTaka = (amount: number): string =>
  `${CURRENCY}${amount.toLocaleString("en-BD")}`;
