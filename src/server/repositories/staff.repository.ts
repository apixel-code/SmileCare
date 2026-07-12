import { connectDB } from "@/server/db";
import { Staff, type IStaff } from "@/server/models/Staff";

export async function findStaffByPhone(
  phone: string,
): Promise<(IStaff & { _id: unknown }) | null> {
  await connectDB();
  return Staff.findOne({ phone, isActive: true }).lean();
}

export async function createStaff(input: {
  name: string;
  phone: string;
  passwordHash: string;
  role: IStaff["role"];
}): Promise<{ id: string }> {
  await connectDB();
  const doc = await Staff.create(input);
  return { id: String(doc._id) };
}
