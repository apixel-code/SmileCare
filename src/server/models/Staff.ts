import mongoose, { Schema, type Model } from "mongoose";
import { STAFF_ROLE } from "@/lib/constants";

export interface IStaff {
  name: string;
  phone: string; // normalized, unique
  passwordHash: string;
  role: (typeof STAFF_ROLE)[number];
  degrees?: string;
  photoPublicId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: STAFF_ROLE, required: true },
    degrees: { type: String },
    photoPublicId: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Staff: Model<IStaff> =
  (mongoose.models.Staff as Model<IStaff>) ||
  mongoose.model<IStaff>("Staff", StaffSchema);
