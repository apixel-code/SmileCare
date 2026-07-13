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

/**
 * Record a collection against an existing bill — atomic & race-safe.
 * The `dueAmount >= amount` filter + single pipeline update means two
 * concurrent collections can never over-collect (the second one fails to
 * match once the due drops below its amount).
 */
export async function collectPayment(
  paymentId: string,
  amount: number,
  method: IPayment["method"],
  byKey: string,
): Promise<{ ok: boolean; newDue?: number }> {
  await connectDB();
  if (amount <= 0) return { ok: false };
  const updated = await Payment.findOneAndUpdate(
    { _id: paymentId, dueAmount: { $gte: amount } },
    [
      {
        $set: {
          paidAmount: { $add: ["$paidAmount", amount] },
          method,
          transactions: {
            $concatArrays: [
              "$transactions",
              [{ amount, method, at: "$$NOW", byKey }],
            ],
          },
        },
      },
      { $set: { dueAmount: { $max: [0, { $subtract: ["$totalAmount", "$paidAmount"] }] } } },
      { $set: { status: { $cond: [{ $eq: ["$dueAmount", 0] }, "paid", "partial"] } } },
    ],
    { new: true },
  ).lean();
  if (!updated) return { ok: false };
  return { ok: true, newDue: updated.dueAmount };
}

export async function findPaymentById(id: string): Promise<PaymentDoc | null> {
  await connectDB();
  return Payment.findById(id).lean();
}
