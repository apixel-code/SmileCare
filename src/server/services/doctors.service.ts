import { unstable_cache } from "next/cache";
import {
  findActiveDoctors,
  type DoctorOption,
} from "@/server/repositories/staff.repository";
import { DEFAULT_DOCTOR } from "@/lib/booking";

export const DOCTORS_TAG = "doctors";

/**
 * Active doctors, cached (revalidated on staff changes via DOCTORS_TAG).
 * Falls back to the built-in default doctor when no Staff doctor exists,
 * so a fresh install keeps working unchanged.
 */
export const getDoctors = unstable_cache(
  async (): Promise<DoctorOption[]> => {
    const doctors = await findActiveDoctors();
    return doctors.length > 0
      ? doctors
      : [{ key: DEFAULT_DOCTOR.key, name: DEFAULT_DOCTOR.name }];
  },
  ["active-doctors"],
  { tags: [DOCTORS_TAG] },
);

/** Resolve + validate a doctorKey coming from a client; default to first. */
export async function resolveDoctor(
  doctorKey?: string | null,
): Promise<DoctorOption> {
  const doctors = await getDoctors();
  return doctors.find((d) => d.key === doctorKey) ?? doctors[0];
}
