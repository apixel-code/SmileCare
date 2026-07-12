import mongoose, { Schema, type Model, type Types } from "mongoose";
import { APPOINTMENT_STATUS, APPOINTMENT_SOURCE } from "@/lib/constants";

export interface IAppointment {
  serialNo: number; // per doctor per day
  patient: Types.ObjectId;
  patientName: string; // denormalized for quick queue display
  doctorKey: string; // Staff ref lands in P4; string key for now
  serviceSlug: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "5:30 PM"
  status: (typeof APPOINTMENT_STATUS)[number];
  source: (typeof APPOINTMENT_SOURCE)[number];
  problemNote?: string;
  bookedByPhone: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    serialNo: { type: Number, required: true },
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    patientName: { type: String, required: true },
    doctorKey: { type: String, required: true },
    serviceSlug: { type: String, required: true },
    serviceName: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: { type: String, enum: APPOINTMENT_STATUS, default: "waiting" },
    source: { type: String, enum: APPOINTMENT_SOURCE, default: "online" },
    problemNote: { type: String },
    bookedByPhone: { type: String, required: true },
  },
  { timestamps: true },
);

// Unique serial per doctor per day; fast queue + capacity lookups.
AppointmentSchema.index(
  { doctorKey: 1, date: 1, serialNo: 1 },
  { unique: true },
);
AppointmentSchema.index({ doctorKey: 1, date: 1, timeSlot: 1 });
AppointmentSchema.index({ date: 1, status: 1 });
AppointmentSchema.index({ patient: 1, date: -1 });

export const Appointment: Model<IAppointment> =
  (mongoose.models.Appointment as Model<IAppointment>) ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);
