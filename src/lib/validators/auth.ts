import { z } from "zod";

const BD_MOBILE = /^(?:\+?88)?01[3-9]\d{8}$/;

export const phoneSchema = z
  .string()
  .trim()
  .refine(
    (v) => BD_MOBILE.test(v.replace(/[\s-]/g, "")),
    "Enter a valid Bangladeshi mobile number",
  );

/** Shared auth validation — client forms AND /api/auth routes. */
export const otpRequestSchema = z.object({
  phone: phoneSchema,
});

export const otpVerifySchema = z.object({
  phone: phoneSchema,
  code: z.string().trim().regex(/^\d{4}$/, "Enter the 4-digit code"),
});

export const staffLoginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type OtpRequestInput = z.infer<typeof otpRequestSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
export type StaffLoginInput = z.infer<typeof staffLoginSchema>;
