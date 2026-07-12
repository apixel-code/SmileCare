import Link from "next/link";
import type { ReactNode } from "react";

/** Inner portal page header — back to dashboard + title + optional action. */
export function PortalSubHeader({
  title,
  backHref = "/portal",
  action,
}: {
  title: string;
  backHref?: string;
  action?: ReactNode;
}) {
  return (
    <div className="sticky top-0 z-20 border-b border-primary-light bg-white px-5 py-3 md:px-8">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
        <Link
          href={backHref}
          aria-label="Back"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E1EBF0] bg-white text-[18px] text-ink transition-colors hover:border-primary"
        >
          ←
        </Link>
        <div className="font-heading text-[16px] font-extrabold text-ink">
          {title}
        </div>
        {action ?? <div className="w-11" />}
      </div>
    </div>
  );
}
