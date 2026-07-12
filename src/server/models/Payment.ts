import mongoose, { Schema, type Model, type Types } from "mongoose";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "@/lib/constants";

export interface ITransaction {
  amount: number;
  method: (typeof PAYMENT_METHOD)[number];
  note?: string;
  at: Date;
  byKey?: string; // Staff ref when staff directory lands
}

export interface IPayment {
  patient: Types.ObjectId;
  appointment?: Types.ObjectId;
  serviceSlug?: string;
  label: string; // e.g. "Root Canal — 1st visit"
  totalAmount: number;
  paidAmount: number;
  dueAmount: number; // computed in service layer, never in components
  method: (typeof PAYMENT_METHOD)[number];
  status: (typeof PAYMENT_STATUS)[number];
  transactions: ITransaction[];
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    amount: { type: Number, required: true },
    method: { type: String, enum: PAYMENT_METHOD, required: true },
    note: { type: String },
    at: { type: Date, default: Date.now },
    byKey: { type: String },
  },
  { _id: false },
);

const PaymentSchema = new Schema<IPayment>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    appointment: { type: Schema.Types.ObjectId, ref: "Appointment" },
    serviceSlug: { type: String },
    label: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    method: { type: String, enum: PAYMENT_METHOD, required: true },
    status: { type: String, enum: PAYMENT_STATUS, default: "due" },
    transactions: { type: [TransactionSchema], default: [] },
  },
  { timestamps: true },
);

PaymentSchema.index({ status: 1 });
PaymentSchema.index({ patient: 1 });
PaymentSchema.index({ createdAt: -1 });

export const Payment: Model<IPayment> =
  (mongoose.models.Payment as Model<IPayment>) ||
  mongoose.model<IPayment>("Payment", PaymentSchema);
