"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitWalkin } from "@/lib/api";
import { walkinSchema } from "@/lib/validators/admin";
import { BOOKING_SERVICE_OPTIONS, SLOT_TIMES } from "@/lib/booking";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const EMPTY = {
  name: "",
  phone: "",
  age: "",
  serviceSlug: BOOKING_SERVICE_OPTIONS[4].slug, // General Checkup
  timeSlot: SLOT_TIMES[0] as string,
  paymentTaken: false,
};

const fieldCls =
  "w-full min-h-[50px] rounded-xl border-2 border-[#E1EBF0] px-3.5 text-[15px] text-ink outline-none transition-colors focus:border-primary bg-white";
const labelCls = "font-heading text-[12.5px] font-bold text-ink";

/** Global "+ Add Walk-in Patient" modal — appends to today's queue. */
export function WalkinModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError("");
    const parsed = walkinSchema.safeParse(values);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setError(fe.name?.[0] ?? fe.phone?.[0] ?? fe.age?.[0] ?? "Check the form");
      return;
    }
    setBusy(true);
    const res = await submitWalkin(values);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    toast(`Added to today's queue — Serial #${res.serialNo}`);
    onClose();
    router.refresh();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 p-6"
      onClick={onClose}
    >
      <div
        className="flex w-[460px] max-w-full animate-scale-in flex-col gap-3.5 rounded-[20px] bg-white p-[26px] shadow-[0_24px_60px_rgba(26,43,60,0.35)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Add walk-in patient"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-heading text-[18px] font-extrabold text-ink">
              Add Walk-in Patient
            </div>
            <div className="mt-0.5 text-[13px] text-ink-muted">
              Joins today&rsquo;s queue with the next serial.
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] border border-[#E1EBF0] text-[15px] text-ink-muted"
          >
            ✕
          </button>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Full name</span>
          <input
            className={fieldCls}
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            placeholder="e.g. Rahim Uddin"
          />
        </label>

        <div className="grid grid-cols-[1.5fr_0.5fr] gap-3">
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Mobile number</span>
            <input
              className={fieldCls}
              type="tel"
              value={values.phone}
              onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
              placeholder="01XXXXXXXXX"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Age</span>
            <input
              className={fieldCls}
              type="number"
              value={values.age}
              onChange={(e) => setValues((v) => ({ ...v, age: e.target.value }))}
              placeholder="—"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Service</span>
            <select
              className={fieldCls}
              value={values.serviceSlug}
              onChange={(e) =>
                setValues((v) => ({ ...v, serviceSlug: e.target.value }))
              }
            >
              {BOOKING_SERVICE_OPTIONS.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Time slot</span>
            <select
              className={fieldCls}
              value={values.timeSlot}
              onChange={(e) =>
                setValues((v) => ({ ...v, timeSlot: e.target.value }))
              }
            >
              {SLOT_TIMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E1EBF0] bg-[#F7FBFC] px-3.5 py-3">
          <span className="font-heading text-[13.5px] font-bold text-ink">
            Payment taken?
          </span>
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] font-semibold text-ink-muted">
              {values.paymentTaken ? "Yes" : "No"}
            </span>
            <button
              type="button"
              aria-label="Toggle payment taken"
              onClick={() =>
                setValues((v) => ({ ...v, paymentTaken: !v.paymentTaken }))
              }
              className={cn(
                "relative h-8 w-[54px] flex-none rounded-full transition-colors",
                values.paymentTaken ? "bg-success" : "bg-[#CBD5E1]",
              )}
            >
              <span
                className={cn(
                  "absolute top-[3px] h-[26px] w-[26px] rounded-full bg-white shadow transition-all",
                  values.paymentTaken ? "left-[25px]" : "left-[3px]",
                )}
              />
            </button>
          </div>
        </div>

        {error && (
          <p className="text-[13.5px] text-danger" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={busy}
          onClick={submit}
          className="min-h-[54px] rounded-xl bg-cta font-heading text-[15.5px] font-bold text-white shadow-[0_4px_14px_rgba(255,122,89,0.35)] transition-colors hover:bg-cta-dark disabled:opacity-60"
        >
          {busy ? "Adding…" : "Add to Today's Queue"}
        </button>
      </div>
    </div>
  );
}
