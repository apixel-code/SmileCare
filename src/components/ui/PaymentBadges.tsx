import { cn } from "@/lib/utils";

/** Accepted payment method badges — reused on pricing + admin payments. */
const METHODS = [
  { label: "bKash", className: "bg-[#E2136E]" },
  { label: "Nagad", className: "bg-[#F6921E]" },
  { label: "Card", className: "bg-ink" },
  { label: "Cash", className: "bg-ink-muted" },
] as const;

export function PaymentBadges({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-[13px] text-ink-muted">We accept:</span>
      {METHODS.map((m) => (
        <span
          key={m.label}
          className={cn(
            "rounded-md px-3 py-[5px] font-heading text-[12px] font-bold text-white",
            m.className,
          )}
        >
          {m.label}
        </span>
      ))}
    </div>
  );
}
