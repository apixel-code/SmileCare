import { z } from "zod";
import { SLOT_TIMES } from "@/lib/booking";
import { phoneSchema } from "@/lib/validators/auth";
import { TOOTH_CONDITION } from "@/lib/constants";

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
  paymentTaken: z.boolean().optional(),
});

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
