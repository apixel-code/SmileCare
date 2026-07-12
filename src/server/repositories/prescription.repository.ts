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
