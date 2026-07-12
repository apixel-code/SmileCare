import type { ReactNode } from "react";

/** Label + control + error message wrapper for form fields. */
export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[14px] font-semibold text-ink">
        {label}
      </label>
      {children}
      {error && <span className="text-[13px] text-danger">{error}</span>}
    </div>
  );
}
