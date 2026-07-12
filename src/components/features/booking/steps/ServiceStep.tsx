import { BOOKING_SERVICE_OPTIONS } from "@/lib/booking";
import { cn } from "@/lib/utils";
import { StepHeading } from "./StepHeading";

/** Step 1 — pick a service. */
export function ServiceStep({
  selected,
  onPick,
}: {
  selected: string | null;
  onPick: (slug: string) => void;
}) {
  return (
    <div>
      <StepHeading
        title="What do you need help with?"
        sub="Choose one option — don't worry, you can't choose wrong."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {BOOKING_SERVICE_OPTIONS.map((svc) => {
          const sel = selected === svc.slug;
          return (
            <button
              key={svc.slug}
              type="button"
              onClick={() => onPick(svc.slug)}
              className={cn(
                "flex min-h-[68px] items-center gap-3.5 rounded-2xl border-2 px-4 py-3.5 text-left transition-all",
                sel
                  ? "border-primary bg-primary-light/60 shadow-soft"
                  : "border-primary-light bg-white hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft",
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-11 flex-none items-center justify-center rounded-xl font-heading text-[16px] font-extrabold transition-colors",
                  sel ? "bg-primary text-white" : "bg-primary-light text-primary",
                )}
              >
                {svc.glyph}
              </span>
              <span className="flex-1">
                <span className="block font-heading text-[16px] font-bold text-ink">
                  {svc.name}
                </span>
                <span className="mt-0.5 block text-[13px] text-ink-muted">
                  {svc.sub}
                </span>
              </span>
              <span
                className={cn(
                  "flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 transition-colors",
                  sel ? "border-primary bg-primary" : "border-[#CBD5E1] bg-white",
                )}
              >
                {sel && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
