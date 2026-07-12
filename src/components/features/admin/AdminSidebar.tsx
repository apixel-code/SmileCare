"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CLINIC } from "@/lib/constants";

const NAV = [
  { href: "/admin", label: "Today's Queue", icon: "🕐", exact: true },
  { href: "/admin/patients", label: "Patients", icon: "👤" },
  { href: "/admin/calendar", label: "Appointment Calendar", icon: "🗓" },
  { href: null, label: "Payments", icon: "৳" },
  { href: null, label: "Reports", icon: "📊" },
  { href: null, label: "Settings", icon: "⚙" },
] as const;

/** Dark sidebar — Clinic Manager navigation (P7 items marked Soon). */
export function AdminSidebar({
  userName,
  userRole,
}: {
  userName: string;
  userRole: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[230px] flex-none flex-col bg-ink lg:flex">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-[22px]">
        <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-primary font-heading text-[18px] font-extrabold text-white">
          {CLINIC.shortName.charAt(0)}
        </div>
        <div>
          <div className="font-heading text-[15px] font-bold text-white">
            {CLINIC.shortName}
          </div>
          <div className="text-[10.5px] tracking-[0.06em] text-white/50">
            CLINIC MANAGER
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {NAV.map((item) => {
          if (!item.href) {
            return (
              <span
                key={item.label}
                className="flex min-h-[48px] cursor-not-allowed items-center gap-3 rounded-[11px] px-3.5 font-heading text-[14px] font-bold text-white/30"
                title="Coming soon"
              >
                <span className="w-[22px] text-center text-[16px]">{item.icon}</span>
                {item.label}
                <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/50">
                  Soon
                </span>
              </span>
            );
          }
          const active =
            "exact" in item && item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex min-h-[48px] items-center gap-3 rounded-[11px] px-3.5 font-heading text-[14px] font-bold transition-colors",
                active ? "bg-primary text-white" : "text-white/65 hover:bg-white/5 hover:text-white",
              )}
            >
              <span className="w-[22px] text-center text-[16px]">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-2.5 border-t border-white/10 px-5 py-4">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-primary-light font-heading text-[14px] font-extrabold text-primary">
          {userName.charAt(0)}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-white">{userName}</div>
          <div className="text-[11px] capitalize text-white/50">{userRole}</div>
        </div>
      </div>
    </aside>
  );
}
