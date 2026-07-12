import {
  findQueueByDate,
  findInRange,
  findAllByPatient,
  advanceAppointment,
  createAppointment,
  slotCounts,
  type AppointmentDoc,
} from "@/server/repositories/appointment.repository";
import {
  upsertPatient,
  findPatientById,
  searchPatients,
  type PatientListItem,
} from "@/server/repositories/patient.repository";
import { findPaymentsByPatient } from "@/server/repositories/payment.repository";
import { getChart } from "@/server/repositories/dentalchart.repository";
import {
  findPrescriptionsByPatient,
} from "@/server/repositories/prescription.repository";
import { nextSeq } from "@/server/repositories/counter.repository";
import {
  DEFAULT_DOCTOR,
  SLOT_TIMES,
  SLOT_CAPACITY,
  serviceNameFromSlug,
  ticketDateLabel,
} from "@/lib/booking";
import { todayKey } from "./portal.service";
import { normalizePhone } from "@/lib/validators/booking";
import { displayPhone } from "@/lib/utils";

export { todayKey };

// ── Queue ───────────────────────────────────────────────────────────
export interface QueueRow {
  id: string;
  serialNo: number;
  patientId: string;
  name: string;
  phone: string;
  service: string;
  time: string;
  status: string;
  source: string;
}

export interface QueueData {
  date: string;
  dateLabel: string;
  rows: QueueRow[];
  stats: { total: number; completed: number; waiting: number; noShow: number };
}

function toRow(a: AppointmentDoc): QueueRow {
  return {
    id: String(a._id),
    serialNo: a.serialNo,
    patientId: String(a.patient),
    name: a.patientName,
    phone: displayPhone(a.bookedByPhone),
    service: a.serviceName,
    time: a.timeSlot,
    status: a.status,
    source: a.source,
  };
}

export async function getTodayQueue(): Promise<QueueData> {
  const date = todayKey();
  const docs = await findQueueByDate(DEFAULT_DOCTOR.key, date);
  const rows = docs.filter((d) => d.status !== "cancelled").map(toRow);
  return {
    date,
    dateLabel: ticketDateLabel(date),
    rows,
    stats: {
      total: rows.length,
      completed: rows.filter((r) => r.status === "completed").length,
      waiting: rows.filter((r) => r.status === "waiting" || r.status === "in_chamber").length,
      noShow: rows.filter((r) => r.status === "no_show").length,
    },
  };
}

export async function advanceQueueItem(appointmentId: string) {
  return advanceAppointment(appointmentId);
}

// ── Walk-in ─────────────────────────────────────────────────────────
export interface WalkinInput {
  name: string;
  phone: string;
  age?: number;
  serviceSlug: string;
  timeSlot: string;
  paymentTaken?: boolean; // TODO(P7): record against a Payment with amount
}

export async function addWalkin(
  input: WalkinInput,
): Promise<{ ok: true; serialNo: number } | { ok: false; error: string }> {
  const date = todayKey();
  if (!SLOT_TIMES.includes(input.timeSlot as (typeof SLOT_TIMES)[number])) {
    return { ok: false, error: "Pick a valid time slot." };
  }
  const counts = await slotCounts(DEFAULT_DOCTOR.key, date);
  if ((counts[input.timeSlot] ?? 0) >= SLOT_CAPACITY) {
    return { ok: false, error: "That slot is full — pick another." };
  }

  const phone = normalizePhone(input.phone);
  const patient = await upsertPatient({
    phone,
    name: input.name,
    age: input.age,
    isFamily: false,
  });
  const serialNo = await nextSeq(`${DEFAULT_DOCTOR.key}:${date}`);
  await createAppointment({
    serialNo,
    patientId: patient.id,
    patientName: patient.name,
    doctorKey: DEFAULT_DOCTOR.key,
    serviceSlug: input.serviceSlug,
    serviceName: serviceNameFromSlug(input.serviceSlug),
    date,
    timeSlot: input.timeSlot,
    source: "walk_in",
    bookedByPhone: phone,
  });
  return { ok: true, serialNo };
}

// ── Patients ────────────────────────────────────────────────────────
export async function adminSearchPatients(q: string, page = 1) {
  return searchPatients(q, page);
}

export async function getAdminPatientProfile(patientId: string) {
  const patient = await findPatientById(patientId);
  if (!patient) return null;

  const [visits, payments, chart, prescriptions] = await Promise.all([
    findAllByPatient(patientId),
    findPaymentsByPatient(patientId),
    getChart(patientId),
    findPrescriptionsByPatient(patientId),
  ]);

  const totalDue = payments
    .filter((p) => p.status !== "paid")
    .reduce((sum, p) => sum + p.dueAmount, 0);

  return {
    patient,
    visits: visits.map((v) => ({
      id: String(v._id),
      dateLabel: ticketDateLabel(v.date),
      service: v.serviceName,
      note: v.problemNote ?? "",
      status: v.status,
      serialNo: v.serialNo,
      doctorName: DEFAULT_DOCTOR.name,
    })),
    payments: payments.map((p) => ({
      id: String(p._id),
      label: p.label,
      total: p.totalAmount,
      paid: p.paidAmount,
      due: p.dueAmount,
      status: p.status,
      method: p.method,
    })),
    totalDue,
    chart,
    prescriptions: prescriptions.map((rx) => ({
      id: String(rx._id),
      dateLabel: ticketDateLabel(new Date(rx.createdAt).toISOString().slice(0, 10)),
      diagnosis: rx.diagnosis,
      medicineCount: rx.medicines.length,
    })),
  };
}

export type AdminPatientProfile = NonNullable<
  Awaited<ReturnType<typeof getAdminPatientProfile>>
>;
export type AdminPatient = PatientListItem;

// ── Calendar ────────────────────────────────────────────────────────
export interface CalendarCell {
  name: string;
  service: string;
  status: string;
}

export async function getWeekCalendar(fromDate: string, toDate: string) {
  const docs = await findInRange(DEFAULT_DOCTOR.key, fromDate, toDate);
  // date -> timeSlot -> appointments
  const map: Record<string, Record<string, CalendarCell[]>> = {};
  for (const a of docs) {
    map[a.date] ??= {};
    map[a.date][a.timeSlot] ??= [];
    map[a.date][a.timeSlot].push({
      name: a.patientName,
      service: a.serviceName,
      status: a.status,
    });
  }
  return map;
}
