import { findPatientsByPhone } from "@/server/repositories/patient.repository";
import {
  findUpcomingByPatient,
  findHistoryByPatient,
  cancelOwnAppointment,
  type AppointmentDoc,
} from "@/server/repositories/appointment.repository";
import { findPaymentsByPatient } from "@/server/repositories/payment.repository";
import {
  findPrescriptionsByPatient,
  findPrescriptionById,
} from "@/server/repositories/prescription.repository";
import { ticketDateLabel, DEFAULT_DOCTOR, clinicDateKey } from "@/lib/booking";
import type {
  FamilyMember,
  MemberDashboard,
  PortalAppointment,
} from "@/types/portal";

/** Today's date key in clinic time. */
export function todayKey(): string {
  return clinicDateKey();
}

function toPortalAppointment(doc: AppointmentDoc): PortalAppointment {
  return {
    id: String(doc._id),
    serialNo: doc.serialNo,
    date: doc.date,
    dateLabel: ticketDateLabel(doc.date),
    timeSlot: doc.timeSlot,
    serviceName: doc.serviceName,
    doctorName: doc.doctorName || DEFAULT_DOCTOR.name,
    status: doc.status,
  };
}

export async function getFamilyMembers(phone: string): Promise<FamilyMember[]> {
  return findPatientsByPhone(phone);
}

/** Everything the dashboard needs for one family member. */
export async function getMemberDashboard(
  member: FamilyMember,
): Promise<MemberDashboard> {
  const from = todayKey();
  const [upcoming, history, payments, prescriptions] = await Promise.all([
    findUpcomingByPatient(member.id, from),
    findHistoryByPatient(member.id, from),
    findPaymentsByPatient(member.id),
    findPrescriptionsByPatient(member.id),
  ]);

  return {
    member,
    nextAppointment: upcoming[0] ? toPortalAppointment(upcoming[0]) : null,
    history: history.map(toPortalAppointment),
    payments: payments.map((p) => ({
      id: String(p._id),
      label: p.label,
      dateLabel: ticketDateLabel(
        new Date(p.createdAt).toISOString().slice(0, 10),
      ),
      amount: p.status === "due" || p.status === "partial" ? p.dueAmount : p.paidAmount,
      method: p.method,
      isDue: p.status !== "paid",
    })),
    prescriptions: prescriptions.map((rx) => ({
      id: String(rx._id),
      dateLabel: ticketDateLabel(
        new Date(rx.createdAt).toISOString().slice(0, 10),
      ),
      diagnosis: rx.diagnosis,
      doctorName: rx.doctorName,
      medicineCount: rx.medicines.length,
    })),
  };
}

/** Cancel one of my (phone's) future appointments. */
export async function cancelMyAppointment(
  appointmentId: string,
  phone: string,
): Promise<boolean> {
  return cancelOwnAppointment(appointmentId, phone, todayKey());
}

/** Full prescription, only if it belongs to one of this phone's members. */
export async function getMyPrescription(id: string, phone: string) {
  const [rx, members] = await Promise.all([
    findPrescriptionById(id),
    findPatientsByPhone(phone),
  ]);
  if (!rx) return null;
  const owner = members.find((m) => m.id === String(rx.patient));
  if (!owner) return null;
  return {
    id: String(rx._id),
    patientName: owner.name,
    patientAge: owner.age,
    dateLabel: ticketDateLabel(
      new Date(rx.createdAt).toISOString().slice(0, 10),
    ),
    diagnosis: rx.diagnosis,
    doctorName: rx.doctorName,
    medicines: rx.medicines,
    advice: rx.advice,
    nextVisitDate: rx.nextVisitDate ? ticketDateLabel(rx.nextVisitDate) : undefined,
  };
}

export type MyPrescription = NonNullable<
  Awaited<ReturnType<typeof getMyPrescription>>
>;
