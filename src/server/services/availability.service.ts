import { slotCounts } from "@/server/repositories/appointment.repository";
import { SLOT_TIMES, SLOT_CAPACITY, isBookableDate } from "@/lib/booking";
import { resolveDoctor } from "./doctors.service";

export interface SlotAvailability {
  time: string;
  available: boolean;
  left: number;
}

export interface DayAvailability {
  date: string;
  bookable: boolean;
  slots: SlotAvailability[];
  availableCount: number;
}

/** Slot availability for a day + doctor (server-authoritative). */
export async function getAvailability(
  date: string,
  doctorKey?: string,
): Promise<DayAvailability> {
  if (!isBookableDate(date)) {
    return {
      date,
      bookable: false,
      slots: SLOT_TIMES.map((t) => ({ time: t, available: false, left: 0 })),
      availableCount: 0,
    };
  }

  const doctor = await resolveDoctor(doctorKey);
  const counts = await slotCounts(doctor.key, date);
  const slots: SlotAvailability[] = SLOT_TIMES.map((t) => {
    const left = Math.max(0, SLOT_CAPACITY - (counts[t] ?? 0));
    return { time: t, available: left > 0, left };
  });

  return {
    date,
    bookable: true,
    slots,
    availableCount: slots.filter((s) => s.available).length,
  };
}
