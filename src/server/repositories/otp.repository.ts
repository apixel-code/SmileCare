import { connectDB } from "@/server/db";
import { OtpCode, type IOtpCode } from "@/server/models/OtpCode";

/** Replace any existing OTP for this phone with a fresh one. */
export async function upsertOtp(
  phone: string,
  codeHash: string,
  ttlMs: number,
): Promise<void> {
  await connectDB();
  await OtpCode.findOneAndUpdate(
    { phone },
    {
      $set: {
        codeHash,
        expiresAt: new Date(Date.now() + ttlMs),
        attempts: 0,
      },
    },
    { upsert: true, setDefaultsOnInsert: true },
  );
}

export async function findActiveOtp(
  phone: string,
): Promise<(IOtpCode & { _id: unknown }) | null> {
  await connectDB();
  return OtpCode.findOne({ phone, expiresAt: { $gt: new Date() } }).lean();
}

/** Atomically count a failed try; returns the new attempt count. */
export async function bumpOtpAttempts(phone: string): Promise<number> {
  await connectDB();
  const doc = await OtpCode.findOneAndUpdate(
    { phone },
    { $inc: { attempts: 1 } },
    { new: true },
  ).lean();
  return doc?.attempts ?? 0;
}

/** One-time use: delete after successful verification. */
export async function consumeOtp(phone: string): Promise<void> {
  await connectDB();
  await OtpCode.deleteMany({ phone });
}
