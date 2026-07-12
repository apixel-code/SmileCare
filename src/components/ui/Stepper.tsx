import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/** Horizontal progress stepper. `current` is 1-based. */
export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div>
      <ol className="flex items-center">
        {steps.map((label, i) => {
          const n = i + 1;
          const done = current > n;
          const active = current === n;
          const isLast = i === steps.length - 1;
          return (
            <li
              key={label}
              className={cn("flex items-center", !isLast && "flex-1")}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-9 w-9 flex-none items-center justify-center rounded-full font-heading text-[14px] font-bold transition-colors",
                    done || active
                      ? "bg-primary text-white"
                      : "bg-primary-light text-ink-muted",
                    active && "ring-4 ring-primary/15",
                  )}
                >
                  {done ? <CheckIcon size={17} /> : n}
                </span>
                <span
                  className={cn(
                    "hidden text-[14px] font-semibold md:block",
                    active
                      ? "text-ink"
                      : done
                        ? "text-ink-muted"
                        : "text-ink-muted/70",
                  )}
                >
                  {label}
                </span>
              </div>
              {!isLast && (
                <span
                  className={cn(
                    "mx-3 h-0.5 flex-1 rounded-full transition-colors",
                    done ? "bg-primary" : "bg-primary-light",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
      <div className="mt-3 text-center text-[13.5px] font-semibold text-ink-muted md:hidden">
        Step {current} of {steps.length} · {steps[current - 1]}
      </div>
    </div>
  );
}
