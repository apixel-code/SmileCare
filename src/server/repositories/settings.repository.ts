import { unstable_cache, revalidateTag } from "next/cache";
import { connectDB } from "@/server/db";
import {
  ClinicSettings,
  type IClinicSettings,
} from "@/server/models/ClinicSettings";
import { CLINIC } from "@/lib/constants";

/** Cache tag — public pages read cached settings; admin save busts it. */
export const SETTINGS_TAG = "clinic-settings";

export type SettingsDoc = IClinicSettings & { _id: unknown };

const DEFAULTS = {
  clinicName: CLINIC.name,
  address: CLINIC.address,
  phones: [CLINIC.phoneDisplay],
  email: CLINIC.email,
  // Sat–Thu 5–9 PM, Friday off (day 5)
  schedule: [0, 1, 2, 3, 4, 5, 6].map((day) => ({
    day,
    open: "17:00",
    close: "21:00",
    isOff: day === 5,
  })),
  slotDurationMin: 30,
  maxSerialsPerDay: 24,
  onlineBookingEnabled: true,
  smsTemplates: {
    confirmation:
      "Dear {patient_name}, your SmileCare appointment is confirmed. Serial {serial_no} at {time}. See you!",
    reminder:
      "Reminder: {patient_name}, your SmileCare appointment (serial {serial_no}) is at {time} today.",
  },
};

/** Single settings document — created with defaults on first read. */
export async function getSettings(): Promise<SettingsDoc> {
  await connectDB();
  const existing = await ClinicSettings.findOne().lean();
  if (existing) return existing;
  const created = await ClinicSettings.create(DEFAULTS);
  return created.toObject();
}

export async function updateSettings(
  patch: Partial<Omit<IClinicSettings, "createdAt" | "updatedAt">>,
): Promise<void> {
  await connectDB();
  await ClinicSettings.findOneAndUpdate({}, { $set: patch }, { upsert: true });
  // Public pages re-fetch the new clinic profile on next request.
  revalidateTag(SETTINGS_TAG);
}

export interface PublicClinicInfo {
  name: string;
  address: string;
  phoneDisplay: string;
  email: string;
}

/**
 * Cached public clinic profile — drives the marketing site's name/address/phone.
 * Revalidated instantly whenever settings are saved (SETTINGS_TAG).
 */
export const getPublicClinicInfo = unstable_cache(
  async (): Promise<PublicClinicInfo> => {
    const s = await getSettings();
    return {
      name: s.clinicName,
      address: s.address,
      phoneDisplay: s.phones[0] ?? CLINIC.phoneDisplay,
      email: s.email ?? CLINIC.email,
    };
  },
  ["public-clinic-info"],
  { tags: [SETTINGS_TAG] },
);
