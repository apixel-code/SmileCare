import { connectDB } from "@/server/db";
import { Payment, type IPayment } from "@/server/models/Payment";

export type PaymentDoc = IPayment & { _id: unknown };

export async function findPaymentsByPatient(
  patientId: string,
  limit = 20,
): Promise<PaymentDoc[]> {
  await connectDB();
  return Payment.find({ patient: patientId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}
