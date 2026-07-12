import { connectDB } from "@/server/db";
import { Appointment, type IAppointment } from "@/server/models/Appointment";

export interface CreateAppointmentInput {
  serialNo: number;
  patientId: string;
  patientName: string;
  doctorKey: string;
  serviceSlug: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  source?: IAppointment["source"];
  problemNote?: string;
  bookedByPhone: string;
}

export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<{ id: string; serialNo: number }> {
  await connectDB();
  const doc = await Appointment.create({
    serialNo: input.serialNo,
    patient: input.patientId, // mongoose casts the hex string to ObjectId
    patientName: input.patientName,
    doctorKey: input.doctorKey,
    serviceSlug: input.serviceSlug,
    serviceName: input.serviceName,
    date: input.date,
    timeSlot: input.timeSlot,
    source: input.source ?? "online",
    problemNote: input.problemNote,
    bookedByPhone: input.bookedByPhone,
  });
  return { id: String(doc._id), serialNo: doc.serialNo };
}

/** Count of active (non-cancelled) appointments per time slot for a doctor+day. */
export async function slotCounts(
  doctorKey: string,
  date: string,
): Promise<Record<string, number>> {
  await connectDB();
  const rows = await Appointment.aggregate<{ _id: string; count: number }>([
    { $match: { doctorKey, date, status: { $ne: "cancelled" } } },
    { $group: { _id: "$timeSlot", count: { $sum: 1 } } },
  ]);
  const out: Record<string, number> = {};
  for (const r of rows) out[r._id] = r.count;
  return out;
}
