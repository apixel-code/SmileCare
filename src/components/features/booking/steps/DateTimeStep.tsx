import { cn } from "@/lib/utils";
import { StepHeading } from "./StepHeading";
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
}: {
  dates: BookingDate[];
  selectedDate: string | null;
  onPickDate: (key: string) => void;
  slots: SlotAvailability[];
  slotsLoading: boolean;
  selectedSlot: string | null;
  onPickSlot: (time: string) => void;
  scarcityText: string;
}) {
  return (
    <div>
      <StepHeading
        title="When would you like to come?"
        sub="Chamber hours: 5:00 PM – 9:00 PM, Saturday to Thursday."
      />

      {/* Date pills */}
      <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-2">
        {dates.map((d) => {
          const sel = selectedDate === d.key;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => onPickDate(d.key)}
              className={cn(
                "flex min-h-[78px] min-w-[78px] flex-none flex-col items-center justify-center gap-0.5 rounded-2xl border-2 px-3 py-2.5 transition-colors",
                sel
                  ? "border-primary bg-primary"
                  : "border-primary-light bg-white hover:border-primary/40",
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
        <div className="mt-4 flex animate-fade-in items-center gap-2.5 rounded-xl border border-cta/35 bg-[#FFF3EF] px-4 py-3 motion-reduce:animate-none">
          <span className="inline-block h-2 w-2 flex-none rounded-full bg-cta" />
          <span className="text-[13.5px] font-medium text-ink">
            {scarcityText}
          </span>
        </div>
      )}

      {/* Slots */}
      <div className="mt-6">
        <div className="mb-3 font-heading text-[15px] font-bold text-ink">
          Available times
        </div>
        {!selectedDate ? (
          <p className="text-[14px] text-ink-muted">Pick a date first.</p>
        ) : slotsLoading ? (
          <p className="text-[14px] text-ink-muted">Loading times…</p>
        ) : (
          <div className="grid animate-fade-in grid-cols-3 gap-2.5 motion-reduce:animate-none sm:grid-cols-4">
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
                        ? "border-primary-light bg-white text-ink hover:border-primary/40"
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
    </div>
  );
}
