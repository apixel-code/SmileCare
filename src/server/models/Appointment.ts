import mongoose, { Schema, type Model, type Types } from "mongoose";
import { APPOINTMENT_STATUS, APPOINTMENT_SOURCE } from "@/lib/constants";

export interface IAppointment {
  serialNo: number; // clinic-wide, per day (one queue line for all doctors)
  patient: Types.ObjectId;
  patientName: string; // denormalized for quick queue display
  doctorKey: string; // staff id (or the default-doctor key)
  doctorName: string; // denormalized for queue/portal display
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
    doctorName: { type: String, default: "" },
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

// One clinic-wide serial line per day → serial is unique per date.
AppointmentSchema.index({ date: 1, serialNo: 1 }, { unique: true });
// Per-doctor slot capacity + calendar filtering still key on the doctor.
AppointmentSchema.index({ doctorKey: 1, date: 1, timeSlot: 1 });
AppointmentSchema.index({ date: 1, status: 1 });
AppointmentSchema.index({ patient: 1, date: -1 });

export const Appointment: Model<IAppointment> =
  (mongoose.models.Appointment as Model<IAppointment>) ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);
