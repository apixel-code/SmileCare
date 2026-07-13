import mongoose, { Schema, type Model } from "mongoose";

export interface IScheduleDay {
  day: number; // 0=Sun … 6=Sat
  open: string; // "17:00"
  close: string; // "21:00"
  isOff: boolean;
}

/** Fixed key for the one-and-only settings document (enforces a singleton). */
export const SETTINGS_SINGLETON = "clinic";

export interface IClinicSettings {
  singleton: string; // always SETTINGS_SINGLETON — unique, so only one doc exists
  clinicName: string;
  logoPublicId?: string;
  address: string;
  landmark?: string;
  phones: string[];
  email?: string;
  schedule: IScheduleDay[];
  slotDurationMin: number;
  maxSerialsPerDay: number;
  onlineBookingEnabled: boolean;
  smsTemplates: { confirmation: string; reminder: string };
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleDaySchema = new Schema<IScheduleDay>(
  {
    day: { type: Number, required: true, min: 0, max: 6 },
    open: { type: String, required: true },
    close: { type: String, required: true },
    isOff: { type: Boolean, default: false },
  },
  { _id: false },
);

const ClinicSettingsSchema = new Schema<IClinicSettings>(
  {
    singleton: {
      type: String,
      default: SETTINGS_SINGLETON,
      unique: true, // guarantees a single settings document
      immutable: true,
    },
    clinicName: { type: String, required: true },
    logoPublicId: { type: String },
    address: { type: String, required: true },
    landmark: { type: String },
    phones: { type: [String], default: [] },
    email: { type: String },
    schedule: { type: [ScheduleDaySchema], default: [] },
    slotDurationMin: { type: Number, default: 30 },
    maxSerialsPerDay: { type: Number, default: 24 },
    onlineBookingEnabled: { type: Boolean, default: true },
    smsTemplates: {
      confirmation: { type: String, default: "" },
      reminder: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

export const ClinicSettings: Model<IClinicSettings> =
  (mongoose.models.ClinicSettings as Model<IClinicSettings>) ||
  mongoose.model<IClinicSettings>("ClinicSettings", ClinicSettingsSchema);
