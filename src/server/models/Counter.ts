import mongoose, { Schema, type Model } from "mongoose";

/** Atomic sequence store — used for race-safe per-doctor-per-day serials. */
export interface ICounter {
  key: string; // e.g. "dr-mahmudul-hasan:2026-07-12"
  seq: number;
}

const CounterSchema = new Schema<ICounter>(
  {
    key: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Counter: Model<ICounter> =
  (mongoose.models.Counter as Model<ICounter>) ||
  mongoose.model<ICounter>("Counter", CounterSchema);
