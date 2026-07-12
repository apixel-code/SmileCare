import { z } from "zod";

/** BD mobile: optional +88, then 01[3-9] + 8 digits. Spaces/dashes stripped. */
const BD_MOBILE = /^(?:\+?88)?01[3-9]\d{8}$/;

/**
 * Single source of validation for the contact message form.
 * Shared by the client form AND the /api/contact route (never validate twice
 * differently).
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => BD_MOBILE.test(v.replace(/[\s-]/g, "")),
      "Enter a valid Bangladeshi mobile number",
    ),
  message: z
    .string()
    .trim()
    .min(5, "Please write a short message")
    .max(1000, "Message is too long"),
});

export type ContactInput = z.infer<typeof contactSchema>;
