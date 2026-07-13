import { z } from "zod";
import { SLOT_TIMES, BOOKING_SERVICE_OPTIONS } from "@/lib/booking";

const BD_MOBILE = /^(?:\+?88)?01[3-9]\d{8}$/;
const SLUGS = BOOKING_SERVICE_OPTIONS.map((s) => s.slug) as [
  string,
  ...string[],
];

/** Shared booking validation — client wizard AND POST /api/book. */
export const bookingSchema = z.object({
  serviceSlug: z.enum(SLUGS),
  doctorKey: z.string().min(1).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
  timeSlot: z.enum(SLOT_TIMES),
  who: z.enum(["self", "family"]),
  name: z.string().trim().min(2, "Please enter the patient's name"),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => BD_MOBILE.test(v.replace(/[\s-]/g, "")),
      "Enter a valid Bangladeshi mobile number",
    ),
  age: z
    .union([z.number(), z.string()])
    .optional()
    .transform((v) =>
      v === undefined || v === "" ? undefined : Number(v),
    )
    .refine(
      (v) => v === undefined || (Number.isFinite(v) && v > 0 && v < 120),
      "Enter a valid age",
    ),
  note: z.string().trim().max(500).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

/** Normalise a BD phone to +8801XXXXXXXXX for storage/lookup. */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/[\s-]/g, "");
  if (digits.startsWith("+88")) return digits;
  if (digits.startsWith("88")) return `+${digits}`;
  return `+88${digits}`;
}
