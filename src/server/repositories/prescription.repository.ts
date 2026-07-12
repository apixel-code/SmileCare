import { connectDB } from "@/server/db";
import {
  Prescription,
  type IPrescription,
} from "@/server/models/Prescription";

export type PrescriptionDoc = IPrescription & { _id: unknown };

export async function findPrescriptionsByPatient(
  patientId: string,
  limit = 20,
): Promise<PrescriptionDoc[]> {
  await connectDB();
  return Prescription.find({ patient: patientId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function findPrescriptionById(
  id: string,
): Promise<PrescriptionDoc | null> {
  await connectDB();
  return Prescription.findById(id).lean();
}

export interface CreatePrescriptionInput {
  patientId: string;
  doctorKey: string;
  doctorName: string;
  diagnosis?: string;
  medicines: Array<{
    name: string;
    dose: string;
    durationDays: number;
    afterMeal: boolean;
  }>;
  advice: string[];
  nextVisitDate?: string;
}

export async function createPrescription(
  input: CreatePrescriptionInput,
): Promise<{ id: string }> {
  await connectDB();
  const doc = await Prescription.create({
    patient: input.patientId,
    doctorKey: input.doctorKey,
    doctorName: input.doctorName,
    diagnosis: input.diagnosis,
    medicines: input.medicines,
    advice: input.advice,
    nextVisitDate: input.nextVisitDate,
  });
  return { id: String(doc._id) };
}
