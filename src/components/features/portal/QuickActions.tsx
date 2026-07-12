import Link from "next/link";
import type { ReactNode } from "react";

/** 2×2 (mobile) / 4-up (desktop) quick action tiles. */
export function QuickActions({ memberId }: { memberId: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Tile
        href="/book"
        label="Book New Appointment"
        iconBg="bg-[#FFF3EF]"
        icon={
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#FF7A59" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        }
      />
      <Tile
        href={`/portal/prescriptions?m=${memberId}`}
        label="My Prescriptions"
        iconBg="bg-primary-light"
        icon={
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
            <path d="M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="#0E7C7B" strokeWidth="1.8" />
            <path d="M9 8h6M9 12h6M9 16h4" stroke="#0E7C7B" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        }
      />
      <Tile
        href={`/portal/history?m=${memberId}`}
        label="Treatment History"
        iconBg="bg-primary-light"
        icon={
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#0E7C7B" strokeWidth="1.8" />
            <path d="M12 7v5l3.5 2" stroke="#0E7C7B" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        }
      />
      <Tile
        href={`/portal/prescriptions?m=${memberId}`}
        label="Download Reports"
        iconBg="bg-primary-light"
        icon={
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v10m0 0 4-4m-4 4-4-4" stroke="#0E7C7B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 19h14" stroke="#0E7C7B" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        }
      />
    </div>
  );
}

function Tile({
  href,
  label,
  icon,
  iconBg,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  iconBg: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-[96px] flex-col justify-center gap-2 rounded-2xl border border-[#EDF4F7] bg-white px-[18px] py-4 text-ink shadow-[0_4px_14px_rgba(26,43,60,0.05)] transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:border-primary hover:shadow-soft-md motion-reduce:transition-none"
    >
      <span className={`flex h-10 w-10 items-center justify-center rounded-[11px] ${iconBg}`}>
        {icon}
      </span>
      <span className="font-heading text-[14px] font-bold">{label}</span>
    </Link>
  );
}
