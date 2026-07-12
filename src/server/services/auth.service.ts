import { createHash, randomInt } from "crypto";
import {
  upsertOtp,
  findActiveOtp,
  bumpOtpAttempts,
  consumeOtp,
} from "@/server/repositories/otp.repository";
import { findStaffByPhone } from "@/server/repositories/staff.repository";
import { findOrCreatePatientByPhone } from "@/server/repositories/patient.repository";
import { verifyPassword } from "@/server/auth/password";
import { signSession, type Session } from "@/server/auth/session";
import { sendSms } from "./sms.service";
import { normalizePhone } from "@/lib/validators/booking";
import { CLINIC } from "@/lib/constants";

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 1/minute per phone
const OTP_MAX_ATTEMPTS = 5;

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export type AuthResult =
  | { ok: true; token: string; session: Session }
  | { ok: false; error: string };

/** Step 1 — generate + store (hashed) + SMS a 4-digit code. */
export async function requestOtp(
  rawPhone: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const phone = normalizePhone(rawPhone);

  const existing = await findActiveOtp(phone);
  if (
    existing &&
    Date.now() - new Date(existing.updatedAt).getTime() < OTP_RESEND_COOLDOWN_MS
  ) {
    return {
      ok: false,
      error: "A code was just sent. Please wait a minute before retrying.",
    };
  }

  const code = String(randomInt(1000, 10000)); // 4 digits, crypto-secure
  await upsertOtp(phone, sha256(code), OTP_TTL_MS);
  await sendSms(
    phone,
    `Your ${CLINIC.shortName} login code is ${code}. Valid for 5 minutes.`,
  );
  return { ok: true };
}

/** Step 2 — verify the code, upsert the patient, issue a session. */
export async function verifyOtp(
  rawPhone: string,
  code: string,
): Promise<AuthResult> {
  const phone = normalizePhone(rawPhone);

  const otp = await findActiveOtp(phone);
  if (!otp) {
    return { ok: false, error: "Code expired or not found. Request a new one." };
  }
  if (otp.attempts >= OTP_MAX_ATTEMPTS) {
    await consumeOtp(phone);
    return { ok: false, error: "Too many tries. Request a new code." };
  }
  if (otp.codeHash !== sha256(code)) {
    const attempts = await bumpOtpAttempts(phone);
    const left = Math.max(0, OTP_MAX_ATTEMPTS - attempts);
    return { ok: false, error: `Wrong code. ${left} tries left.` };
  }

  await consumeOtp(phone);

  // One phone = whole family's records; reuse the head record if it exists.
  const patient = await findOrCreatePatientByPhone(phone);

  const session: Session = {
    sub: patient.id,
    role: "patient",
    phone,
    name: patient.name,
  };
  return { ok: true, token: await signSession(session), session };
}

/** Staff login — phone + password, role comes from the Staff record. */
export async function staffLogin(
  rawPhone: string,
  password: string,
): Promise<AuthResult> {
  const phone = normalizePhone(rawPhone);
  const staff = await findStaffByPhone(phone);
  // Same message for unknown phone / wrong password (no enumeration).
  const fail = { ok: false as const, error: "Wrong phone number or password." };
  if (!staff) return fail;
  if (!(await verifyPassword(password, staff.passwordHash))) return fail;

  const session: Session = {
    sub: String(staff._id),
    role: staff.role,
    phone,
    name: staff.name,
  };
  return { ok: true, token: await signSession(session), session };
}
