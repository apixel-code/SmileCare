import type { Metadata } from "next";
import { requireRole } from "@/server/auth/guard";
import {
  getFamilyMembers,
  getMemberDashboard,
} from "@/server/services/portal.service";
import { PortalSubHeader } from "@/components/features/portal/PortalSubHeader";
import { HistoryList } from "@/components/features/portal/HistoryList";

export const metadata: Metadata = { title: "Treatment History" };

export default async function PortalHistoryPage({
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
      <PortalSubHeader title={`Treatment History — ${member.name}`} />
      <div className="mx-auto max-w-2xl px-5 py-6 md:px-8">
        <HistoryList items={data.history} />
      </div>
    </div>
  );
}
