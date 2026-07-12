"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { WalkinModal } from "./WalkinModal";
import { ToastProvider } from "@/components/ui/Toast";
import { logout } from "@/lib/api";
import { cn } from "@/lib/utils";

const TITLES: Array<[RegExp, string]> = [
  [/^\/admin\/patients\/.+/, "Patient Profile"],
  [/^\/admin\/patients/, "Patients"],
  [/^\/admin\/calendar/, "Appointment Calendar"],
  [/^\/admin\/payments/, "Payments"],
  [/^\/admin\/reports/, "Monthly Report"],
  [/^\/admin\/settings/, "Settings"],
  [/^\/admin/, "Today's Queue"],
];

const MOBILE_NAV = [
  { href: "/admin", label: "Queue" },
  { href: "/admin/patients", label: "Patients" },
  { href: "/admin/calendar", label: "Calendar" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({
  userName,
  userRole,
  dateLabel,
  children,
}: {
  userName: string;
  userRole: string;
  dateLabel: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [walkinOpen, setWalkinOpen] = useState(false);
  const title = TITLES.find(([re]) => re.test(pathname))?.[1] ?? "Clinic Admin";

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#EDF2F5]">
        <AdminSidebar userName={userName} userRole={userRole} />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <div className="sticky top-0 z-40 flex h-[72px] items-center justify-between gap-4 border-b border-[#E1EBF0] bg-white px-5 md:px-7">
            <div className="min-w-0">
              <div className="truncate font-heading text-[19px] font-extrabold text-ink">
                {title}
              </div>
              <div className="text-[12.5px] text-ink-muted">{dateLabel}</div>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setWalkinOpen(true)}
                className="flex min-h-[50px] items-center gap-2 rounded-xl bg-cta px-4 font-heading text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(255,122,89,0.35)] transition-colors hover:bg-cta-dark md:px-6"
              >
                <span className="text-[20px] leading-none">+</span>
                <span className="hidden sm:inline">Add Walk-in Patient</span>
                <span className="sm:hidden">Walk-in</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  router.push("/admin/login");
                  router.refresh();
                }}
                className="hidden min-h-[50px] items-center rounded-xl border border-[#E1EBF0] px-4 font-heading text-[13.5px] font-bold text-ink-muted transition-colors hover:border-primary hover:text-primary md:flex"
              >
                Log out
              </button>
            </div>
          </div>

          {/* Mobile nav (sidebar hidden below lg) */}
          <div className="flex gap-2 overflow-x-auto border-b border-[#E1EBF0] bg-white px-5 py-2.5 lg:hidden">
            {MOBILE_NAV.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex-none rounded-full px-4 py-2 font-heading text-[13px] font-bold transition-colors",
                    active
                      ? "bg-primary text-white"
                      : "bg-[#EDF2F5] text-ink-muted",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <main className="flex-1 px-5 py-6 md:px-7">{children}</main>
        </div>
      </div>

      {walkinOpen && <WalkinModal onClose={() => setWalkinOpen(false)} />}
    </ToastProvider>
  );
}
