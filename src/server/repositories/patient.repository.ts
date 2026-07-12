import { connectDB } from "@/server/db";
import { Patient } from "@/server/models/Patient";

export interface UpsertPatientInput {
  phone: string; // normalized
  name: string;
  age?: number;
  isFamily: boolean;
}

/**
 * Find-or-create a patient. Matching on (phone + name) means each family
 * member under one phone gets their own record; a returning patient reuses it.
 */
export async function upsertPatient(
  input: UpsertPatientInput,
): Promise<{ id: string; name: string }> {
  await connectDB();
  const patient = await Patient.findOneAndUpdate(
    { phone: input.phone, name: input.name },
    {
      $set: {
        name: input.name,
        phone: input.phone,
        ...(input.age !== undefined ? { age: input.age } : {}),
        ...(input.isFamily ? { familyHeadPhone: input.phone } : {}),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean();
  return { id: String(patient!._id), name: patient!.name };
}
