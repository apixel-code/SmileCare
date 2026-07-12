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

export interface StaffListItem {
  id: string;
  name: string;
  phone: string;
  role: IStaff["role"];
  isActive: boolean;
}

export async function findAllStaff(): Promise<StaffListItem[]> {
  await connectDB();
  const docs = await Staff.find().sort({ createdAt: 1 }).lean();
  return docs.map((d) => ({
    id: String(d._id),
    name: d.name,
    phone: d.phone,
    role: d.role,
    isActive: d.isActive,
  }));
}

export async function setStaffActive(id: string, isActive: boolean): Promise<void> {
  await connectDB();
  await Staff.updateOne({ _id: id }, { $set: { isActive } });
}

export async function staffExists(phone: string): Promise<boolean> {
  await connectDB();
  return (await Staff.exists({ phone })) !== null;
}
