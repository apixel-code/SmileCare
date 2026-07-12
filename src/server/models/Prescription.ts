import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface IMedicine {
  name: string;
  dose: string; // "1+0+1"
  durationDays: number;
  afterMeal: boolean;
}

export interface IPrescription {
  appointment?: Types.ObjectId;
  patient: Types.ObjectId;
  doctorKey: string; // Staff ref when staff directory lands
  doctorName: string;
  diagnosis?: string;
  medicines: IMedicine[];
  advice: string[];
  nextVisitDate?: string; // YYYY-MM-DD
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    name: { type: String, required: true },
    dose: { type: String, required: true },
    durationDays: { type: Number, required: true },
    afterMeal: { type: Boolean, default: true },
  },
  { _id: false },
);

const PrescriptionSchema = new Schema<IPrescription>(
  {
    appointment: { type: Schema.Types.ObjectId, ref: "Appointment" },
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorKey: { type: String, required: true },
    doctorName: { type: String, required: true },
    diagnosis: { type: String },
    medicines: { type: [MedicineSchema], default: [] },
    advice: { type: [String], default: [] },
    nextVisitDate: { type: String },
  },
  { timestamps: true },
);

PrescriptionSchema.index({ patient: 1, createdAt: -1 });

export const Prescription: Model<IPrescription> =
  (mongoose.models.Prescription as Model<IPrescription>) ||
  mongoose.model<IPrescription>("Prescription", PrescriptionSchema);
