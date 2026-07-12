import { connectDB } from "@/server/db";
import { Counter } from "@/server/models/Counter";

/**
 * Atomically increment and return the next value for a key.
 * Race-safe: findOneAndUpdate($inc) is a single atomic operation — never
 * counts documents. Used for per-doctor-per-day serial numbers.
 */
export async function nextSeq(key: string): Promise<number> {
  await connectDB();
  const doc = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean();
  return doc!.seq;
}
