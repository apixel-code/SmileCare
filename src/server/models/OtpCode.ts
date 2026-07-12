import mongoose, { Schema, type Model } from "mongoose";

export interface IOtpCode {
  phone: string; // normalized +8801XXXXXXXXX
  codeHash: string; // sha256 of the 4-digit code — never store plaintext
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const OtpCodeSchema = new Schema<IOtpCode>(
  {
    phone: { type: String, required: true, index: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// TTL: MongoDB removes the doc once expiresAt passes.
OtpCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpCode: Model<IOtpCode> =
  (mongoose.models.OtpCode as Model<IOtpCode>) ||
  mongoose.model<IOtpCode>("OtpCode", OtpCodeSchema);
