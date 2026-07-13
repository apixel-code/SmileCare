"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitWalkin } from "@/lib/api";
import { walkinSchema } from "@/lib/validators/admin";
import { BOOKING_SERVICE_OPTIONS, SLOT_TIMES } from "@/lib/booking";
import { PAYMENT_METHOD } from "@/lib/constants";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { DoctorOption } from "@/server/repositories/staff.repository";

const EMPTY = {
  name: "",
  phone: "",
  age: "",
  serviceSlug: BOOKING_SERVICE_OPTIONS[4].slug, // General Checkup
  timeSlot: SLOT_TIMES[0] as string,
  doctorKey: "",
  paymentTaken: false,
  paymentAmount: "",
  paymentMethod: "cash",
};

const fieldCls =
  "w-full min-h-[50px] rounded-xl border-2 border-[#E1EBF0] px-3.5 text-[15px] text-ink outline-none transition-colors focus:border-primary bg-white";
const labelCls = "font-heading text-[12.5px] font-bold text-ink";

/** Global "+ Add Walk-in Patient" modal — appends to today's queue. */
export function WalkinModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState(EMPTY);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((j) => {
        if (live && j?.ok) {
          setDoctors(j.data);
          setValues((v) => ({ ...v, doctorKey: j.data[0]?.key ?? "" }));
        }
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  async function submit() {
    setError("");
    if (values.paymentTaken && !(Number(values.paymentAmount) > 0)) {
      setError("Enter the amount received (or turn payment off).");
      return;
    }
    const parsed = walkinSchema.safeParse({
      ...values,
      doctorKey: values.doctorKey || undefined,
      paymentAmount: values.paymentTaken ? values.paymentAmount : undefined,
      paymentMethod: values.paymentTaken ? values.paymentMethod : undefined,
    });
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setError(fe.name?.[0] ?? fe.phone?.[0] ?? fe.age?.[0] ?? "Check the form");
      return;
    }
    setBusy(true);
    const res = await submitWalkin(parsed.data);
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

        {doctors.length > 1 && (
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Doctor</span>
            <select
              className={fieldCls}
              value={values.doctorKey}
              onChange={(e) =>
                setValues((v) => ({ ...v, doctorKey: e.target.value }))
              }
            >
              {doctors.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="flex flex-col gap-2.5 rounded-xl border border-[#E1EBF0] bg-[#F7FBFC] px-3.5 py-3">
          <div className="flex items-center justify-between gap-3">
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

          {values.paymentTaken && (
            <div className="flex flex-col gap-2.5 border-t border-[#E1EBF0] pt-2.5">
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Amount received (৳)</span>
                <input
                  className={fieldCls}
                  type="number"
                  inputMode="numeric"
                  value={values.paymentAmount}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, paymentAmount: e.target.value }))
                  }
                  placeholder="e.g. 500"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHOD.map((mth) => (
                  <button
                    key={mth}
                    type="button"
                    onClick={() =>
                      setValues((v) => ({ ...v, paymentMethod: mth }))
                    }
                    className={cn(
                      "min-h-[42px] rounded-[10px] border-2 px-3.5 font-heading text-[12.5px] font-bold uppercase transition-colors",
                      values.paymentMethod === mth
                        ? "border-primary bg-primary text-white"
                        : "border-[#E1EBF0] bg-white text-ink-muted hover:border-primary/40",
                    )}
                  >
                    {mth}
                  </button>
                ))}
              </div>
            </div>
          )}
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
