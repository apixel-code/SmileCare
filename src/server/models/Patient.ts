import mongoose, { Schema, type Model } from "mongoose";

export interface IPatient {
  name: string;
  phone: string; // normalized +8801XXXXXXXXX
  age?: number;
  gender?: string;
  bloodGroup?: string;
  allergies: string[];
  familyHeadPhone?: string; // groups a family under one login phone
  area?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, index: true },
    age: { type: Number },
    gender: { type: String },
    bloodGroup: { type: String },
    allergies: { type: [String], default: [] },
    familyHeadPhone: { type: String, index: true },
    area: { type: String },
    notes: { type: String },
  },
  { timestamps: true },
);

export const Patient: Model<IPatient> =
  (mongoose.models.Patient as Model<IPatient>) ||
  mongoose.model<IPatient>("Patient", PatientSchema);
