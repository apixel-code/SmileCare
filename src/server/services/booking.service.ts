import { nextSeq } from "@/server/repositories/counter.repository";
import { upsertPatient } from "@/server/repositories/patient.repository";
import {
  createAppointment,
  slotCounts,
} from "@/server/repositories/appointment.repository";
import {
  DEFAULT_DOCTOR,
  SLOT_TIMES,
  SLOT_CAPACITY,
  isBookableDate,
  serviceNameFromSlug,
  ticketDateLabel,
} from "@/lib/booking";
import { CLINIC } from "@/lib/constants";
import { normalizePhone, type BookingInput } from "@/lib/validators/booking";
import { getSettings } from "@/server/repositories/settings.repository";
import { sendSms } from "./sms.service";

export interface BookingTicket {
  serialNo: number;
  date: string;
  dateLabel: string;
  timeSlot: string;
  serviceName: string;
  patientName: string;
  doctorName: string;
  address: string;
}

export type BookingResult =
  | { ok: true; ticket: BookingTicket }
  | { ok: false; error: string; code?: string };

/**
 * Create a booking: validate date/slot → check capacity → upsert patient →
 * generate an atomic per-doctor-per-day serial → persist the appointment.
 *
 * NOTE: capacity is a check-then-write (fine for clinic-scale concurrency).
 * A fully race-proof guarantee would wrap this in a transaction — deferred.
 */
export async function createBooking(
  input: BookingInput,
): Promise<BookingResult> {
  const settings = await getSettings();
  if (!settings.onlineBookingEnabled) {
    return {
      ok: false,
      error: "Online booking is temporarily off. Please call us to book.",
    };
  }
  if (!isBookableDate(input.date)) {
    return { ok: false, error: "That date isn't available. Please pick another." };
  }
  if (!SLOT_TIMES.includes(input.timeSlot)) {
    return { ok: false, error: "Please pick a valid time slot." };
  }

  const counts = await slotCounts(DEFAULT_DOCTOR.key, input.date);
  if ((counts[input.timeSlot] ?? 0) >= SLOT_CAPACITY) {
    return {
      ok: false,
      code: "SLOT_FULL",
      error: "Sorry, that time just filled up. Please pick another slot.",
    };
  }

  const phone = normalizePhone(input.phone);
  const patient = await upsertPatient({
    phone,
    name: input.name,
    age: input.age,
    isFamily: input.who === "family",
  });

  const serialNo = await nextSeq(`${DEFAULT_DOCTOR.key}:${input.date}`);
  if (serialNo > settings.maxSerialsPerDay) {
    return {
      ok: false,
      code: "DAY_FULL",
      error: "This day is fully booked. Please pick another date.",
    };
  }
  const serviceName = serviceNameFromSlug(input.serviceSlug);

  await createAppointment({
    serialNo,
    patientId: patient.id,
    patientName: patient.name,
    doctorKey: DEFAULT_DOCTOR.key,
    serviceSlug: input.serviceSlug,
    serviceName,
    date: input.date,
    timeSlot: input.timeSlot,
    source: "online",
    problemNote: input.note,
    bookedByPhone: phone,
  });

  // Confirmation SMS from the editable template (stubbed gateway in dev).
  const sms = settings.smsTemplates.confirmation
    .replace("{patient_name}", patient.name)
    .replace("{serial_no}", `#${serialNo}`)
    .replace("{time}", `${ticketDateLabel(input.date)} ${input.timeSlot}`);
  await sendSms(phone, sms);

  return {
    ok: true,
    ticket: {
      serialNo,
      date: input.date,
      dateLabel: ticketDateLabel(input.date),
      timeSlot: input.timeSlot,
      serviceName,
      patientName: patient.name,
      doctorName: DEFAULT_DOCTOR.name,
      address: CLINIC.address,
    },
  };
}
