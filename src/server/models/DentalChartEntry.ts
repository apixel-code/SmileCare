import mongoose, { Schema, type Model, type Types } from "mongoose";
import { TOOTH_CONDITION } from "@/lib/constants";

export interface IDentalChartEntry {
  patient: Types.ObjectId;
  toothNo: number; // 1–32 (universal numbering)
  condition: (typeof TOOTH_CONDITION)[number];
  note?: string;
  updatedByKey?: string; // staff id
  createdAt: Date;
  updatedAt: Date;
}

const DentalChartEntrySchema = new Schema<IDentalChartEntry>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    toothNo: { type: Number, required: true, min: 1, max: 32 },
    condition: { type: String, enum: TOOTH_CONDITION, required: true },
    note: { type: String },
    updatedByKey: { type: String },
  },
  { timestamps: true },
);

// One entry per tooth per patient — upsert on change.
DentalChartEntrySchema.index({ patient: 1, toothNo: 1 }, { unique: true });

export const DentalChartEntry: Model<IDentalChartEntry> =
  (mongoose.models.DentalChartEntry as Model<IDentalChartEntry>) ||
  mongoose.model<IDentalChartEntry>("DentalChartEntry", DentalChartEntrySchema);
