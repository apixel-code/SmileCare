import { StatusPill } from "@/components/ui/StatusPill";
import type { PortalAppointment } from "@/types/portal";

/** Treatment history cards. */
export function HistoryList({ items }: { items: PortalAppointment[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[#EDF4F7] bg-white p-6 text-center text-[14px] text-ink-muted shadow-[0_4px_14px_rgba(26,43,60,0.05)]">
        No visits yet — your treatment history will appear here.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((h) => (
        <div
          key={h.id}
          className="flex flex-col gap-2 rounded-2xl border border-[#EDF4F7] bg-white px-[18px] py-4 shadow-[0_4px_14px_rgba(26,43,60,0.05)]"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12.5px] font-semibold text-ink-muted">
              {h.dateLabel} · {h.timeSlot}
            </span>
            <StatusPill status={h.status} />
          </div>
          <div className="font-heading text-[15.5px] font-bold text-ink">
            {h.serviceName}
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] text-ink-muted">{h.doctorName}</span>
            <span className="font-heading text-[13px] font-bold text-primary">
              Serial #{h.serialNo}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
