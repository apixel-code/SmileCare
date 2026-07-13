import type { Metadata } from "next";
import { getSession } from "@/server/auth/guard";
import { getSettings } from "@/server/repositories/settings.repository";
import { findAllStaff } from "@/server/repositories/staff.repository";
import { SettingsForm } from "@/components/features/admin/SettingsForm";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [session, settings, staff] = await Promise.all([
    getSession(),
    getSettings(),
    findAllStaff(),
  ]);

  return (
    <SettingsForm
      isAdmin={session?.role === "admin"}
      selfId={session?.sub ?? ""}
      staff={staff}
      initial={{
        clinicName: settings.clinicName,
        address: settings.address,
        phones: settings.phones,
        email: settings.email ?? "",
        schedule: settings.schedule.map((s) => ({
          day: s.day,
          open: s.open,
          close: s.close,
          isOff: s.isOff,
        })),
        slotDurationMin: settings.slotDurationMin,
        maxSerialsPerDay: settings.maxSerialsPerDay,
        onlineBookingEnabled: settings.onlineBookingEnabled,
        smsTemplates: {
          confirmation: settings.smsTemplates.confirmation,
          reminder: settings.smsTemplates.reminder,
        },
      }}
    />
  );
}
