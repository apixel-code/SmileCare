import {
  findAllPayments,
  createBill,
  collectPayment,
  findPaymentById,
} from "@/server/repositories/payment.repository";
import { findPatientById } from "@/server/repositories/patient.repository";
import { getSettings } from "@/server/repositories/settings.repository";
import { sendSms } from "./sms.service";
import { ticketDateLabel } from "@/lib/booking";
import { displayPhone } from "@/lib/utils";
import type { PaymentMethod } from "@/lib/constants";

export interface AdminPaymentRow {
  id: string;
  dateLabel: string;
  name: string;
  phone: string;
  label: string;
  total: number;
  paid: number;
  due: number;
  method: string;
  status: string;
  transactions: Array<{ amount: number; method: string; atLabel: string }>;
}

export interface PaymentsScreenData {
  rows: AdminPaymentRow[];
  stats: { today: number; month: number; totalDue: number; pendingCount: number };
}

export async function getPaymentsScreen(): Promise<PaymentsScreenData> {
  const docs = await findAllPayments();
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const monthStr = now.toISOString().slice(0, 7);

  let today = 0;
  let month = 0;
  let totalDue = 0;
  let pendingCount = 0;

  const rows: AdminPaymentRow[] = docs.map((p) => {
    for (const t of p.transactions) {
      const at = new Date(t.at).toISOString();
      if (at.startsWith(todayStr)) today += t.amount;
      if (at.startsWith(monthStr)) month += t.amount;
    }
    if (p.status !== "paid") {
      totalDue += p.dueAmount;
      pendingCount += 1;
    }
    return {
      id: String(p._id),
      dateLabel: ticketDateLabel(new Date(p.createdAt).toISOString().slice(0, 10)),
      name: p.patientInfo?.name ?? "—",
      phone: p.patientInfo ? displayPhone(p.patientInfo.phone) : "",
      label: p.label,
      total: p.totalAmount,
      paid: p.paidAmount,
      due: p.dueAmount,
      method: p.method,
      status: p.status,
      transactions: p.transactions.map((t) => ({
        amount: t.amount,
        method: t.method,
        atLabel: ticketDateLabel(new Date(t.at).toISOString().slice(0, 10)),
      })),
    };
  });

  return { rows, stats: { today, month, totalDue, pendingCount } };
}

export async function recordCollection(
  paymentId: string,
  amount: number,
  method: PaymentMethod,
  byKey: string,
) {
  return collectPayment(paymentId, amount, method, byKey);
}

export async function createNewBill(input: {
  patientId: string;
  label: string;
  totalAmount: number;
  paidAmount: number;
  method: PaymentMethod;
  byKey: string;
}) {
  return createBill(input);
}

/** Due-reminder SMS from the editable template. */
export async function sendDueReminder(paymentId: string): Promise<boolean> {
  const payment = await findPaymentById(paymentId);
  if (!payment || payment.dueAmount <= 0) return false;
  const patient = await findPatientById(String(payment.patient));
  if (!patient) return false;
  const settings = await getSettings();
  const msg = settings.smsTemplates.reminder
    .replace("{patient_name}", patient.name)
    .replace("{serial_no}", payment.label)
    .replace("{time}", `due ৳${payment.dueAmount}`);
  await sendSms(patient.phone, msg);
  return true;
}
