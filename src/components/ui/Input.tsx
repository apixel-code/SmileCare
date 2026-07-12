import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Shared field surface — reused by Input and Textarea (DRY). */
export const fieldBase =
  "w-full rounded-xl border bg-white px-4 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60";

export function Input({
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      className={cn(
        fieldBase,
        "h-12",
        error ? "border-danger" : "border-primary-light",
        className,
      )}
      {...props}
    />
  );
}
