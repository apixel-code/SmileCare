import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Centered page container — max 1240px with responsive gutters. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-container px-5 md:px-8", className)}>
      {children}
    </div>
  );
}
