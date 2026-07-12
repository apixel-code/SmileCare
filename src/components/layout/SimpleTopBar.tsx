import type { ReactNode } from "react";
import { Logo } from "./Logo";

/** Minimal top bar for portal/admin shells — logo left, actions right. */
export function SimpleTopBar({
  label,
  right,
}: {
  label: string;
  right?: ReactNode;
}) {
  return (
    <div className="border-b border-primary-light bg-white">
      <div className="mx-auto flex h-[68px] max-w-container items-center justify-between gap-4 px-5 md:px-8">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="hidden rounded-full bg-primary-light px-3 py-1 font-heading text-[12px] font-bold uppercase tracking-[0.08em] text-primary sm:block">
            {label}
          </span>
        </div>
        {right}
      </div>
    </div>
  );
}
