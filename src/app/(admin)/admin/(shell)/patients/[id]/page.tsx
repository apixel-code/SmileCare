import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminPatientProfile } from "@/server/services/admin.service";
import { getSession } from "@/server/auth/guard";
import { PatientTabs } from "@/components/features/admin/PatientTabs";
import { DeletePatientButton } from "@/components/features/admin/DeletePatientButton";
import { displayPhone } from "@/lib/utils";
import { can } from "@/lib/permissions";

export const metadata: Metadata = { title: "Patient Profile" };
export const dynamic = "force-dynamic";

export default async function AdminPatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [profile, session] = await Promise.all([
    getAdminPatientProfile(id).catch(() => null),
    getSession(),
  ]);
  if (!profile) notFound();
  const p = profile.patient;
  const role = session?.role ?? "";

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-[#E1EBF0] bg-white px-6 py-[22px] shadow-soft">
        <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-primary-light font-heading text-[24px] font-extrabold text-primary">
          {p.name.charAt(0)}
        </div>
        <div className="min-w-[200px] flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-heading text-[22px] font-extrabold text-ink">
              {p.name}
            </span>
            {p.allergies.length > 0 && (
              <span className="rounded-full border border-[#F5C6C6] bg-[#FDE8E8] px-3.5 py-1 font-heading text-[12px] font-extrabold tracking-[0.04em] text-[#C0392B]">
                ⚠ ALLERGY: {p.allergies.join(", ")}
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13.5px] text-ink-muted">
            <span>
              Age: <strong className="text-ink">{p.age ?? "—"}</strong>
            </span>
            <span>
              Phone:{" "}
              <strong className="text-ink">{displayPhone(p.phone)}</strong>
            </span>
            <span>
              Blood: <strong className="text-ink">{p.bloodGroup ?? "—"}</strong>
            </span>
            <span>
              Patient ID:{" "}
              <strong className="text-ink">
                SC-{p.id.slice(-4).toUpperCase()}
              </strong>
            </span>
          </div>
        </div>
        {can(role, "patient.delete") && (
          <DeletePatientButton patientId={p.id} patientName={p.name} />
        )}
      </div>

      <PatientTabs profile={profile} role={role} />
    </div>
  );
}
