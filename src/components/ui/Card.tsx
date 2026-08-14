import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CARD_HOVER } from "@/lib/motion";

/** Soft white card — 16px radius, soft shadow, subtle sky border. */
export function Card({
  children,
  className,
  hoverable = false,
}: {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-primary-light/60 bg-white shadow-soft",
        hoverable && cn(CARD_HOVER, "hover:border-primary/60"),
        className,
      )}
    >
      {children}
    </div>
  );
}
