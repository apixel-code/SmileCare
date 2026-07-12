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

export interface PaymentWithPatient extends IPayment {
  _id: unknown;
  patientInfo?: { name: string; phone: string };
}

/** Admin list — newest first with patient name/phone joined. */
export async function findAllPayments(limit = 100): Promise<PaymentWithPatient[]> {
  await connectDB();
  return Payment.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate<{ patientInfo: unknown }>({
      path: "patient",
      select: "name phone",
    })
    .lean()
    .then((rows) =>
      rows.map((r) => {
        const pat = r.patient as unknown as
          | { name?: string; phone?: string }
          | undefined;
        return {
          ...r,
          patientInfo: pat?.name
            ? { name: pat.name, phone: pat.phone ?? "" }
            : undefined,
        } as PaymentWithPatient;
      }),
    );
}

export interface CreateBillInput {
  patientId: string;
  label: string;
  totalAmount: number;
  paidAmount: number;
  method: IPayment["method"];
  byKey: string;
}

/** Create a bill; status/due computed here (service layer rule). */
export async function createBill(input: CreateBillInput): Promise<{ id: string }> {
  await connectDB();
  const due = Math.max(0, input.totalAmount - input.paidAmount);
  const doc = await Payment.create({
    patient: input.patientId,
    label: input.label,
    totalAmount: input.totalAmount,
    paidAmount: input.paidAmount,
    dueAmount: due,
    method: input.method,
    status: due === 0 ? "paid" : input.paidAmount > 0 ? "partial" : "due",
    transactions:
      input.paidAmount > 0
        ? [{ amount: input.paidAmount, method: input.method, at: new Date(), byKey: input.byKey }]
        : [],
  });
  return { id: String(doc._id) };
}

/** Record a collection against an existing bill. */
export async function collectPayment(
  paymentId: string,
  amount: number,
  method: IPayment["method"],
  byKey: string,
): Promise<{ ok: boolean; newDue?: number }> {
  await connectDB();
  const doc = await Payment.findById(paymentId);
  if (!doc || amount <= 0 || amount > doc.dueAmount) return { ok: false };
  doc.paidAmount += amount;
  doc.dueAmount = Math.max(0, doc.totalAmount - doc.paidAmount);
  doc.status = doc.dueAmount === 0 ? "paid" : "partial";
  doc.method = method;
  doc.transactions.push({ amount, method, at: new Date(), byKey });
  await doc.save();
  return { ok: true, newDue: doc.dueAmount };
}

export async function findPaymentById(id: string): Promise<PaymentDoc | null> {
  await connectDB();
  return Payment.findById(id).lean();
}
