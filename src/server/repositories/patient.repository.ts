import { connectDB } from "@/server/db";
import { Patient } from "@/server/models/Patient";

export interface UpsertPatientInput {
  phone: string; // normalized
  name: string;
  age?: number;
  isFamily: boolean;
}

export interface PatientListItem {
  id: string;
  name: string;
  phone: string;
  age?: number;
  bloodGroup?: string;
  allergies: string[];
  createdAt: Date;
}

/** Admin: search patients by name/phone (paginated, lean). */
export async function searchPatients(
  q: string,
  page = 1,
  limit = 20,
): Promise<{ items: PatientListItem[]; total: number }> {
  await connectDB();
  const filter = q
    ? {
        $or: [
          { name: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
          { phone: { $regex: q.replace(/[^\d+]/g, ""), $options: "i" } },
        ],
      }
    : {};
  const [docs, total] = await Promise.all([
    Patient.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Patient.countDocuments(filter),
  ]);
  return {
    items: docs.map((d) => ({
      id: String(d._id),
      name: d.name,
      phone: d.phone,
      age: d.age ?? undefined,
      bloodGroup: d.bloodGroup ?? undefined,
      allergies: d.allergies ?? [],
      createdAt: d.createdAt,
    })),
    total,
  };
}

export async function findPatientById(
  id: string,
): Promise<PatientListItem | null> {
  await connectDB();
  const d = await Patient.findById(id).lean();
  if (!d) return null;
  return {
    id: String(d._id),
    name: d.name,
    phone: d.phone,
    age: d.age ?? undefined,
    bloodGroup: d.bloodGroup ?? undefined,
    allergies: d.allergies ?? [],
    createdAt: d.createdAt,
  };
}

/** All family members registered under one phone (oldest first). */
export async function findPatientsByPhone(
  phone: string,
): Promise<Array<{ id: string; name: string; age?: number }>> {
  await connectDB();
  const docs = await Patient.find({ phone }).sort({ createdAt: 1 }).lean();
  return docs.map((d) => ({
    id: String(d._id),
    name: d.name,
    age: d.age ?? undefined,
  }));
}

/**
 * OTP login: reuse the first record under this phone (the family head);
 * only create a placeholder when the phone has never been seen.
 */
export async function findOrCreatePatientByPhone(
  phone: string,
): Promise<{ id: string; name: string }> {
  await connectDB();
  const existing = await Patient.findOne({ phone })
    .sort({ createdAt: 1 })
    .lean();
  if (existing) return { id: String(existing._id), name: existing.name };
  const created = await Patient.create({
    name: `Patient ${phone.slice(-4)}`,
    phone,
  });
  return { id: String(created._id), name: created.name };
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
