import type { Metadata } from "next";
import { requireRole } from "@/server/auth/guard";
import { SimpleTopBar } from "@/components/layout/SimpleTopBar";
import { LogoutButton } from "@/components/features/auth/LogoutButton";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Clinic Admin" };

/** Placeholder — the full PMS (P6: queue, patients, calendar...) replaces this. */
export default async function AdminHomePage() {
  const session = await requireRole("admin", "doctor", "receptionist");

  return (
    <div className="min-h-screen bg-primary-light/40">
      <SimpleTopBar
        label="Clinic Admin"
        right={<LogoutButton redirectTo="/admin/login" />}
      />
      <div className="mx-auto max-w-container px-5 py-10 md:px-8">
        <h1 className="mb-2 text-[26px] font-extrabold text-ink md:text-[30px]">
          Hello, {session.name}
        </h1>
        <p className="mb-8 text-[15px] text-ink-muted">
          Role: <span className="font-semibold capitalize text-ink">{session.role}</span>
        </p>
        <Card className="p-8 text-center">
          <p className="font-heading text-[18px] font-bold text-ink">
            Today&rsquo;s Queue is coming soon
          </p>
          <p className="mx-auto mt-2 max-w-[420px] text-[14.5px] leading-[1.7] text-ink-muted">
            Queue, patients, dental chart, calendar, payments and reports will
            appear here.
          </p>
        </Card>
      </div>
    </div>
  );
}
