import { cn } from "@/lib/utils";
import type { BookingDate } from "@/lib/booking";
import type { SlotAvailability } from "@/server/services/availability.service";

/** Step 2 — pick a date pill and an available time slot. */
export function DateTimeStep({
  dates,
  selectedDate,
  onPickDate,
  slots,
  slotsLoading,
  selectedSlot,
  onPickSlot,
  scarcityText,
  canNext,
  onNext,
}: {
  dates: BookingDate[];
  selectedDate: string | null;
  onPickDate: (key: string) => void;
  slots: SlotAvailability[];
  slotsLoading: boolean;
  selectedSlot: string | null;
  onPickSlot: (time: string) => void;
  scarcityText: string;
  canNext: boolean;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-[18px] pb-8 pt-6">
      <div className="px-5">
        <h1 className="mb-1 font-heading text-[24px] font-extrabold leading-[1.3] text-ink">
          When would you like to come?
        </h1>
        <p className="text-[14.5px] leading-[1.6] text-ink-muted">
          Chamber hours: 5:00 PM – 9:00 PM
        </p>
      </div>

      {/* Date pills */}
      <div className="flex gap-2.5 overflow-x-auto px-5 pb-2 pt-1">
        {dates.map((d) => {
          const sel = selectedDate === d.key;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => onPickDate(d.key)}
              className={cn(
                "flex min-h-[76px] min-w-[76px] flex-none flex-col items-center justify-center gap-0.5 rounded-2xl border-2 px-3 py-2.5 transition-colors",
                sel ? "border-primary bg-primary" : "border-[#E1EBF0] bg-white",
              )}
            >
              <span
                className={cn(
                  "text-[12px] font-semibold",
                  sel ? "text-white/80" : "text-ink-muted",
                )}
              >
                {d.dayLabel}
              </span>
              <span
                className={cn(
                  "font-heading text-[18px] font-extrabold",
                  sel ? "text-white" : "text-ink",
                )}
              >
                {d.dateLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scarcity */}
      {selectedDate && !slotsLoading && (
        <div className="mx-5 flex items-center gap-2.5 rounded-xl border border-cta/35 bg-[#FFF3EF] px-4 py-3">
          <span className="inline-block h-2 w-2 flex-none rounded-full bg-cta" />
          <span className="text-[13.5px] font-medium text-ink">
            {scarcityText}
          </span>
        </div>
      )}

      {/* Slots */}
      <div className="px-5">
        <div className="mb-3 font-heading text-[15px] font-bold text-ink">
          Available times
        </div>
        {!selectedDate ? (
          <p className="text-[14px] text-ink-muted">Pick a date first.</p>
        ) : slotsLoading ? (
          <p className="text-[14px] text-ink-muted">Loading times…</p>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            {slots.map((s) => {
              const sel = selectedSlot === s.time;
              return (
                <button
                  key={s.time}
                  type="button"
                  disabled={!s.available}
                  onClick={() => onPickSlot(s.time)}
                  className={cn(
                    "min-h-[50px] rounded-xl border-2 font-heading text-[14.5px] font-bold transition-colors",
                    sel
                      ? "border-primary bg-primary text-white"
                      : s.available
                        ? "border-[#E1EBF0] bg-white text-ink hover:border-primary/40"
                        : "cursor-not-allowed border-[#EDF2F5] bg-[#F4F6F8] text-[#B6C2CD] line-through",
                  )}
                >
                  {s.time}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-auto px-5">
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className={cn(
            "min-h-[56px] w-full rounded-xl font-heading text-[17px] font-bold text-white shadow-[0_6px_20px_rgba(255,122,89,0.35)] transition-colors",
            canNext ? "bg-cta hover:bg-cta-dark" : "cursor-not-allowed bg-[#F0B4A2]",
          )}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
