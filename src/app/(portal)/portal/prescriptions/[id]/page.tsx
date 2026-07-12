import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireRole } from "@/server/auth/guard";
import { getMyPrescription } from "@/server/services/portal.service";
import { PortalSubHeader } from "@/components/features/portal/PortalSubHeader";
import { PrescriptionSheet } from "@/components/features/portal/PrescriptionSheet";
import { PrintButton } from "@/components/features/portal/PrintButton";

export const metadata: Metadata = { title: "Prescription" };

export default async function PrescriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole("patient");
  const { id } = await params;
  const rx = await getMyPrescription(id, session.phone);
  if (!rx) notFound();

  return (
    <div className="min-h-screen bg-[#EDF2F5]">
      <div className="print:hidden">
        <PortalSubHeader
          title="Prescription"
          backHref="/portal/prescriptions"
          action={<PrintButton />}
        />
      </div>
      <div className="mx-auto max-w-2xl px-5 py-6 md:px-8 print:max-w-none print:p-0">
        <PrescriptionSheet rx={rx} />
        <p className="mt-3.5 text-center text-[12.5px] leading-[1.6] text-ink-muted print:hidden">
          This is a digital copy. The original signed prescription is kept at
          the clinic.
        </p>
      </div>
    </div>
  );
}
