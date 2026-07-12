import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/server/auth/guard";
import {
  getFamilyMembers,
  getMemberDashboard,
} from "@/server/services/portal.service";
import { PortalSubHeader } from "@/components/features/portal/PortalSubHeader";

export const metadata: Metadata = { title: "My Prescriptions" };

export default async function PrescriptionsPage({
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
      <PortalSubHeader title={`Prescriptions — ${member.name}`} />
      <div className="mx-auto max-w-2xl px-5 py-6 md:px-8">
        {data.prescriptions.length === 0 ? (
          <div className="rounded-2xl border border-[#EDF4F7] bg-white p-6 text-center text-[14px] text-ink-muted shadow-[0_4px_14px_rgba(26,43,60,0.05)]">
            No prescriptions yet. After your visit, the doctor&rsquo;s
            prescription will appear here.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {data.prescriptions.map((rx) => (
              <Link
                key={rx.id}
                href={`/portal/prescriptions/${rx.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#EDF4F7] bg-white px-[18px] py-4 shadow-[0_4px_14px_rgba(26,43,60,0.05)] transition-colors hover:border-primary"
              >
                <span>
                  <span className="block font-heading text-[15px] font-bold text-ink">
                    {rx.diagnosis ?? "Prescription"}
                  </span>
                  <span className="mt-0.5 block text-[12.5px] text-ink-muted">
                    {rx.dateLabel} · {rx.doctorName} · {rx.medicineCount}{" "}
                    medicines
                  </span>
                </span>
                <span className="font-heading text-[13px] font-bold text-primary">
                  View →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
