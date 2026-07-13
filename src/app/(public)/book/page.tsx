import type { Metadata } from "next";
import { BookingWizard } from "@/components/features/booking/BookingWizard";
import { getDoctors } from "@/server/services/doctors.service";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book your dental appointment online in 2 minutes. Pick a service, choose a time, and get your serial number — no advance payment needed.",
};

export default async function BookPage() {
  const doctors = await getDoctors();
  return <BookingWizard doctors={doctors} />;
}
