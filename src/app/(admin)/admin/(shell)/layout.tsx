import { requireRole } from "@/server/auth/guard";
import { AdminShell } from "@/components/features/admin/AdminShell";
import { CLINIC_TZ } from "@/lib/booking";

/** Staff-only shell for all admin screens (login page lives outside). */
export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("admin", "doctor", "receptionist");

  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    timeZone: CLINIC_TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <AdminShell
      userName={session.name}
      userRole={session.role}
      dateLabel={dateLabel}
    >
      {children}
    </AdminShell>
  );
}
