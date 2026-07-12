import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/server/auth/guard";
import {
  getFamilyMembers,
  getMemberDashboard,
} from "@/server/services/portal.service";
import { CLINIC_TZ } from "@/lib/booking";
import { PortalTopBar } from "@/components/features/portal/PortalTopBar";
import { NextAppointmentCard } from "@/components/features/portal/NextAppointmentCard";
import { QuickActions } from "@/components/features/portal/QuickActions";
import { HistoryList } from "@/components/features/portal/HistoryList";
import { PaymentsList } from "@/components/features/portal/PaymentsList";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "My Portal" };

function greeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: CLINIC_TZ,
      hour: "numeric",
      hour12: false,
    }).format(new Date()),
  );
  if (hour < 12) return "Good morning ☀️";
  if (hour < 17) return "Good afternoon";
  return "Good evening 🌙";
}

export default async function PortalDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const session = await requireRole("patient");
  const { m } = await searchParams;

  const members = await getFamilyMembers(session.phone);
  const member = members.find((x) => x.id === m) ?? members[0];
  const data = await getMemberDashboard(member);

  return (
    <div className="min-h-screen bg-[#F7FBFC]">
      <PortalTopBar
        greeting={greeting()}
        members={members}
        selectedId={member.id}
      />

      <div className="mx-auto -mt-12 flex max-w-2xl flex-col gap-6 px-5 pb-12 md:px-8">
        {data.nextAppointment ? (
          <NextAppointmentCard appt={data.nextAppointment} />
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-[0_12px_34px_rgba(26,43,60,0.12)]">
            <p className="text-[14.5px] text-ink-muted">
              No upcoming appointment for {member.name}.
            </p>
            <Button href="/book" variant="cta">
              Book an Appointment
            </Button>
          </div>
        )}

        <QuickActions memberId={member.id} />

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-[17px] font-extrabold text-ink">
              Treatment History
            </h2>
            {data.history.length > 0 && (
              <Link
                href={`/portal/history?m=${member.id}`}
                className="font-heading text-[13px] font-bold text-primary hover:text-primary-dark"
              >
                View all →
              </Link>
            )}
          </div>
          <HistoryList items={data.history.slice(0, 3)} />
        </section>

        <section>
          <h2 className="mb-3 font-heading text-[17px] font-extrabold text-ink">
            Payment History
          </h2>
          <PaymentsList items={data.payments} />
        </section>
      </div>
    </div>
  );
}
