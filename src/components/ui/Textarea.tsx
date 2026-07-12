import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { fieldBase } from "@/components/ui/Input";

export function Textarea({
  error,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return (
    <textarea
      className={cn(
        fieldBase,
        "min-h-[130px] resize-y py-3 leading-[1.6]",
        error ? "border-danger" : "border-primary-light",
        className,
      )}
      {...props}
    />
  );
}
