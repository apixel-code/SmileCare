import { connectDB } from "@/server/db";
import { DentalChartEntry } from "@/server/models/DentalChartEntry";
import type { ToothCondition } from "@/lib/constants";

export async function getChart(
  patientId: string,
): Promise<Record<number, ToothCondition>> {
  await connectDB();
  const rows = await DentalChartEntry.find({ patient: patientId }).lean();
  const out: Record<number, ToothCondition> = {};
  for (const r of rows) out[r.toothNo] = r.condition;
  return out;
}

/** Set a tooth's condition; `null` clears it back to healthy. */
export async function upsertTooth(
  patientId: string,
  toothNo: number,
  condition: ToothCondition | null,
  updatedByKey: string,
): Promise<void> {
  await connectDB();
  if (condition === null) {
    await DentalChartEntry.deleteOne({ patient: patientId, toothNo });
    return;
  }
  await DentalChartEntry.findOneAndUpdate(
    { patient: patientId, toothNo },
    { $set: { condition, updatedByKey } },
    { upsert: true, setDefaultsOnInsert: true },
  );
}
