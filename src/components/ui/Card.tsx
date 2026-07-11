import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
        "rounded-2xl border border-primary-light bg-white shadow-soft",
        hoverable &&
          "transition-shadow transition-colors hover:border-primary hover:shadow-soft-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
