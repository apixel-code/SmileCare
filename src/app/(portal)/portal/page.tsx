import type { Metadata } from "next";
import { requireRole } from "@/server/auth/guard";
import { SimpleTopBar } from "@/components/layout/SimpleTopBar";
import { LogoutButton } from "@/components/features/auth/LogoutButton";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "My Portal" };

/** Placeholder dashboard — the full portal (P5) replaces this. */
export default async function PortalHomePage() {
  const session = await requireRole("patient");

  return (
    <div className="min-h-screen bg-primary-light/40">
      <SimpleTopBar
        label="Patient Portal"
        right={<LogoutButton redirectTo="/portal/login" />}
      />
      <div className="mx-auto max-w-container px-5 py-10 md:px-8">
        <h1 className="mb-2 text-[26px] font-extrabold text-ink md:text-[30px]">
          Welcome back 👋
        </h1>
        <p className="mb-8 text-[15px] text-ink-muted">
          Logged in as <span className="font-semibold text-ink">{session.phone}</span>
        </p>
        <Card className="p-8 text-center">
          <p className="font-heading text-[18px] font-bold text-ink">
            Your dashboard is coming soon
          </p>
          <p className="mx-auto mt-2 max-w-[420px] text-[14.5px] leading-[1.7] text-ink-muted">
            Appointments, prescriptions, treatment history and payments will
            appear here.
          </p>
        </Card>
      </div>
    </div>
  );
}
