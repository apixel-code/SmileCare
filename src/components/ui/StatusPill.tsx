import { cn } from "@/lib/utils";

/**
 * Status pill — appointment + payment states (design-system.md).
 * One source for status colors; used by portal and admin.
 */
const STYLES: Record<string, { label: string; className: string }> = {
  waiting: { label: "Waiting", className: "bg-[#FFF7E8] text-warning" },
  in_chamber: { label: "In Chamber", className: "bg-primary-light text-primary" },
  completed: { label: "Completed", className: "bg-[#F0FBF4] text-success" },
  no_show: { label: "No Show", className: "bg-[#F4F6F8] text-ink-muted" },
  cancelled: { label: "Cancelled", className: "bg-[#FDF0EF] text-danger" },
  paid: { label: "Paid", className: "bg-[#F0FBF4] text-success" },
  partial: { label: "Partial", className: "bg-[#FFF7E8] text-warning" },
  due: { label: "Due", className: "bg-[#FDF0EF] text-danger" },
};

export function StatusPill({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const s = STYLES[status] ?? {
    label: status,
    className: "bg-[#F4F6F8] text-ink-muted",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 font-heading text-[11.5px] font-bold",
        s.className,
        className,
      )}
    >
      {s.label}
    </span>
  );
}
