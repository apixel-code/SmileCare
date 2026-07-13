import { unstable_cache, revalidateTag } from "next/cache";
import { connectDB } from "@/server/db";
import {
  ClinicSettings,
  SETTINGS_SINGLETON,
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

/**
 * The one settings document — atomically found-or-created on first read.
 * Keying the upsert on the unique `singleton` field means concurrent cold
 * reads can never create duplicate settings docs (the loser hits the unique
 * index and we simply re-read).
 */
export async function getSettings(): Promise<SettingsDoc> {
  await connectDB();
  try {
    const doc = await ClinicSettings.findOneAndUpdate(
      { singleton: SETTINGS_SINGLETON },
      { $setOnInsert: DEFAULTS },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();
    return doc as SettingsDoc;
  } catch {
    // Lost the insert race on the unique index — the winner's doc now exists.
    const existing = await ClinicSettings.findOne({
      singleton: SETTINGS_SINGLETON,
    }).lean();
    if (existing) return existing as SettingsDoc;
    throw new Error("Clinic settings unavailable");
  }
}

export async function updateSettings(
  patch: Partial<Omit<IClinicSettings, "createdAt" | "updatedAt">>,
): Promise<void> {
  await connectDB();
  await ClinicSettings.findOneAndUpdate(
    { singleton: SETTINGS_SINGLETON },
    { $set: patch },
    { upsert: true, setDefaultsOnInsert: true },
  );
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
