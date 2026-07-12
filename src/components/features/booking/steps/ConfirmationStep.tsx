import { WhatsAppIcon } from "@/components/ui/icons";
import { WHATSAPP_URL } from "@/lib/constants";
import { googleCalendarUrl } from "@/lib/booking";
import type { BookingTicket } from "@/server/services/booking.service";

/** Step 4 — success ticket with serial, actions and reminder. */
export function ConfirmationStep({
  ticket,
  onRestart,
}: {
  ticket: BookingTicket;
  onRestart: () => void;
}) {
  const calUrl = googleCalendarUrl({
    title: `Dental appointment — ${ticket.serviceName}`,
    dateKey: ticket.date,
    slot: ticket.timeSlot,
    details: `Serial #${ticket.serialNo} with ${ticket.doctorName}. Patient: ${ticket.patientName}.`,
    location: ticket.address,
  });
  const waText = encodeURIComponent(
    `My SmileCare appointment — Serial #${ticket.serialNo}, ${ticket.dateLabel} at ${ticket.timeSlot} (${ticket.serviceName}).`,
  );

  return (
    <div className="mx-auto flex max-w-[460px] flex-col items-center gap-5 text-center">
      <div className="flex h-20 w-20 animate-ticket-pop items-center justify-center rounded-full bg-[#1F8A5B] shadow-[0_12px_32px_rgba(31,138,91,0.35)]">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12.5 10 17.5 19 7"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="48"
            className="animate-check-draw"
          />
        </svg>
      </div>

      <div>
        <h2 className="mb-1.5 font-heading text-[24px] font-extrabold text-ink md:text-[28px]">
          Your Appointment Is Confirmed!
        </h2>
        <p className="text-[14.5px] text-ink-muted">
          Details sent to your phone via SMS 📱
        </p>
      </div>

      {/* Ticket */}
      <div className="w-full animate-ticket-pop overflow-hidden rounded-2xl border border-primary-light shadow-soft">
        <div className="flex items-center justify-between bg-primary px-[22px] py-[18px] text-left">
          <div>
            <div className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white/70">
              Your Serial No.
            </div>
            <div className="font-heading text-[44px] font-extrabold leading-[1.1] text-white">
              #{ticket.serialNo}
            </div>
          </div>
          <div className="text-right">
            <div className="font-heading text-[16px] font-bold text-white">
              {ticket.dateLabel}
            </div>
            <div className="font-heading text-[16px] font-bold text-[#7FD1CF]">
              {ticket.timeSlot}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t-2 border-dashed border-primary-light bg-white px-[22px] py-[18px] text-left">
          <TicketRow label="Service" value={ticket.serviceName} />
          <TicketRow label="Doctor" value={ticket.doctorName} />
          <TicketRow label="Patient" value={ticket.patientName} />
          <TicketRow label="Address" value={ticket.address} />
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        <a
          href={calUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 border-primary-light bg-white font-heading text-[13.5px] font-bold text-ink transition-colors hover:border-primary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="5" width="16" height="15" rx="3" stroke="#0E7C7B" strokeWidth="1.8" />
            <path d="M4 9.5h16M9 3v4M15 3v4" stroke="#0E7C7B" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Add to Calendar
        </a>
        <a
          href={`${WHATSAPP_URL}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 border-whatsapp bg-white font-heading text-[13.5px] font-bold text-ink transition-colors hover:bg-[#F0FBF4]"
        >
          <WhatsAppIcon size={18} color="#25D366" />
          Save to WhatsApp
        </a>
      </div>

      <div className="w-full rounded-xl bg-primary-light px-[18px] py-3.5 text-[13.5px] leading-[1.6] text-ink">
        🔔 You&rsquo;ll receive a reminder SMS 1 hour before your appointment.
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="min-h-[44px] text-[13.5px] text-ink-muted underline hover:text-primary"
      >
        Book another appointment
      </button>
    </div>
  );
}

function TicketRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-[14px]">
      <span className="flex-none text-ink-muted">{label}</span>
      <span className="text-right font-semibold text-ink">{value}</span>
    </div>
  );
}
