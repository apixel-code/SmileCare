import { z } from "zod";
import { SLOT_TIMES } from "@/lib/booking";
import { phoneSchema } from "@/lib/validators/auth";
import { TOOTH_CONDITION, PAYMENT_METHOD } from "@/lib/constants";

/** Shared admin validation — client forms AND /api/admin routes. */

export const advanceSchema = z.object({
  appointmentId: z.string().min(8),
});

export const walkinSchema = z.object({
  name: z.string().trim().min(2, "Enter the patient's name"),
  phone: phoneSchema,
  age: z
    .union([z.number(), z.string()])
    .optional()
    .transform((v) => (v === undefined || v === "" ? undefined : Number(v)))
    .refine(
      (v) => v === undefined || (Number.isFinite(v) && v > 0 && v < 120),
      "Enter a valid age",
    ),
  serviceSlug: z.string().min(2),
  timeSlot: z.enum(SLOT_TIMES),
  doctorKey: z.string().min(1).optional(),
  paymentTaken: z.boolean().optional(),
  paymentAmount: z
    .union([z.number(), z.string()])
    .optional()
    .transform((v) => (v === undefined || v === "" ? undefined : Number(v)))
    .refine(
      (v) => v === undefined || (Number.isFinite(v) && v > 0),
      "Enter a valid amount",
    ),
  paymentMethod: z.enum(PAYMENT_METHOD).optional(),
}).refine(
  // If payment is marked taken, an amount is required (mirrors the UI guard,
  // so non-UI callers can't assert "paid" while recording nothing).
  (v) => !v.paymentTaken || (v.paymentAmount !== undefined && v.paymentAmount > 0),
  { message: "Enter the amount received", path: ["paymentAmount"] },
);

export const toothSchema = z.object({
  patientId: z.string().min(8),
  toothNo: z.number().int().min(1).max(32),
  condition: z.enum(TOOTH_CONDITION).nullable(), // null = healthy
});

export const prescriptionSchema = z.object({
  patientId: z.string().min(8),
  diagnosis: z.string().trim().max(200).optional(),
  medicines: z
    .array(
      z.object({
        name: z.string().trim().min(2),
        dose: z.string().regex(/^\d\+\d\+\d$/, "Dose like 1+0+1"),
        durationDays: z.number().int().min(1).max(365),
        afterMeal: z.boolean(),
      }),
    )
    .min(1, "Add at least one medicine"),
  advice: z.array(z.string().trim().min(1)).max(10),
  nextVisitDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export type WalkinFormInput = z.infer<typeof walkinSchema>;
export type PrescriptionFormInput = z.infer<typeof prescriptionSchema>;

// ── P7: payments / settings / staff ────────────────────────────────
import { STAFF_ROLE } from "@/lib/constants";

export const collectSchema = z.object({
  paymentId: z.string().min(8),
  amount: z.number().positive("Enter an amount"),
  method: z.enum(PAYMENT_METHOD),
});

export const billSchema = z.object({
  patientId: z.string().min(8),
  label: z.string().trim().min(2, "What is this bill for?"),
  totalAmount: z.number().positive("Enter the total"),
  paidAmount: z.number().min(0),
  method: z.enum(PAYMENT_METHOD),
});

export const remindSchema = z.object({ paymentId: z.string().min(8) });

export const settingsSchema = z.object({
  clinicName: z.string().trim().min(2),
  address: z.string().trim().min(4),
  phones: z.array(z.string().trim().min(6)).min(1),
  email: z.string().trim().email().or(z.literal("")).optional(),
  schedule: z
    .array(
      z.object({
        day: z.number().int().min(0).max(6),
        open: z.string().regex(/^\d{2}:\d{2}$/),
        close: z.string().regex(/^\d{2}:\d{2}$/),
        isOff: z.boolean(),
      }),
    )
    .length(7),
  slotDurationMin: z.number().int().min(5).max(120),
  maxSerialsPerDay: z.number().int().min(1).max(200),
  onlineBookingEnabled: z.boolean(),
  smsTemplates: z.object({
    confirmation: z.string().trim().min(4),
    reminder: z.string().trim().min(4),
  }),
});

export const staffCreateSchema = z.object({
  name: z.string().trim().min(2),
  phone: phoneSchema,
  password: z.string().min(6, "At least 6 characters"),
  role: z.enum(STAFF_ROLE),
});

export const staffToggleSchema = z.object({
  staffId: z.string().min(8),
  isActive: z.boolean(),
});

export type SettingsFormInput = z.infer<typeof settingsSchema>;
