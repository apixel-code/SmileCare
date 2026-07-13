"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DentalChart } from "./DentalChart";
import { RxWriter } from "./RxWriter";
import { StatusPill } from "@/components/ui/StatusPill";
import { useToast } from "@/components/ui/Toast";
import { createBillApi } from "@/lib/api";
import { formatTaka, PAYMENT_METHOD } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { can } from "@/lib/permissions";
import type { AdminPatientProfile } from "@/server/services/admin.service";

type Tab = "History" | "Dental Chart" | "Prescriptions" | "Payments";

export function PatientTabs({
  profile,
  role,
}: {
  profile: AdminPatientProfile;
  role: string;
}) {
  // Tabs follow the permission matrix — see lib/permissions.ts.
  const TABS: Tab[] = [
    "History",
    ...(can(role, "chart.edit") ? (["Dental Chart"] as const) : []),
    ...(can(role, "prescription.write") ? (["Prescriptions"] as const) : []),
    ...(can(role, "payments.manage") ? (["Payments"] as const) : []),
  ];
  const [tab, setTab] = useState<Tab>("History");

  return (
    <div className="flex flex-col gap-4">
      {/* Tab bar */}
      <div className="flex gap-2 overflow-x-auto rounded-[14px] border border-[#E1EBF0] bg-white p-1.5 shadow-[0_2px_8px_rgba(26,43,60,0.04)]">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "min-h-[46px] flex-1 whitespace-nowrap rounded-[10px] px-4 font-heading text-[14px] font-bold transition-colors",
              tab === t ? "bg-primary text-white" : "text-ink-muted hover:bg-primary-light/50",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "History" && (
        <div className="flex flex-col gap-3">
          {profile.visits.length === 0 && (
            <div className="rounded-2xl border border-[#E1EBF0] bg-white p-8 text-center text-[14px] text-ink-muted shadow-soft">
              No visits recorded yet.
            </div>
          )}
          {profile.visits.map((v) => (
            <div
              key={v.id}
              className="grid grid-cols-1 gap-3 rounded-2xl border border-[#E1EBF0] bg-white px-6 py-5 shadow-[0_2px_10px_rgba(26,43,60,0.04)] sm:grid-cols-[130px_minmax(0,1fr)_130px] sm:items-start"
            >
              <div>
                <div className="font-heading text-[15px] font-extrabold text-primary">
                  {v.dateLabel}
                </div>
                <div className="mt-0.5 text-[12px] text-ink-muted">
                  {v.doctorName}
                </div>
              </div>
              <div>
                <div className="mb-1 font-heading text-[15.5px] font-bold text-ink">
                  {v.service}
                </div>
                <div className="text-[13.5px] leading-[1.65] text-ink-muted">
                  {v.note || `Serial #${v.serialNo}`}
                </div>
              </div>
              <div className="sm:text-right">
                <StatusPill status={v.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Dental Chart" && (
        <DentalChart patientId={profile.patient.id} initial={profile.chart} />
      )}

      {tab === "Prescriptions" && (
        <div className="flex flex-col gap-4">
          <RxWriter patientId={profile.patient.id} />
          {profile.prescriptions.length > 0 && (
            <div className="rounded-2xl border border-[#E1EBF0] bg-white p-6 shadow-soft">
              <div className="mb-3 font-heading text-[15px] font-extrabold text-ink">
                Previous Prescriptions
              </div>
              <div className="flex flex-col gap-2">
                {profile.prescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#EDF4F7] px-4 py-3 text-[13.5px]"
                  >
                    <span className="font-semibold text-ink">
                      {rx.diagnosis ?? "Prescription"}
                    </span>
                    <span className="text-ink-muted">
                      {rx.dateLabel} · {rx.medicineCount} medicines
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "Payments" && (
        <div className="max-w-[640px] rounded-2xl border border-[#E1EBF0] bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="font-heading text-[16px] font-extrabold text-ink">
              Payment Summary
            </div>
            <NewBillButton patientId={profile.patient.id} patientName={profile.patient.name} />
          </div>
          {profile.payments.length === 0 ? (
            <div className="py-4 text-center text-[14px] text-ink-muted">
              No bills yet — create one with “+ New Bill”. Collections happen on
              the Payments screen.
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {profile.payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border-b border-[#EDF4F7] px-1 py-3 text-[15px]"
                >
                  <span className="text-ink-muted">
                    {p.label}{" "}
                    <span className="text-[12px]">({p.method})</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <StatusPill status={p.status} />
                    <span className="font-heading font-bold text-ink">
                      {formatTaka(p.paid)} / {formatTaka(p.total)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
          {profile.totalDue > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-[#F5C6C6] bg-[#FDF1F1] px-4 py-4">
              <span className="font-heading text-[15px] font-extrabold text-[#C0392B]">
                AMOUNT DUE
              </span>
              <span className="font-heading text-[24px] font-extrabold text-[#C0392B]">
                {formatTaka(profile.totalDue)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** "+ New Bill" — creates a Payment for this patient. */
function NewBillButton({
  patientId,
  patientName,
}: {
  patientId: string;
  patientName: string;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({ label: "", total: "", paid: "0", method: "cash" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const router = useRouter();

  async function submit() {
    setError("");
    const total = Number(values.total);
    const paid = Number(values.paid);
    if (values.label.trim().length < 2 || !Number.isFinite(total) || total <= 0) {
      setError("Enter what the bill is for and a valid total.");
      return;
    }
    if (!Number.isFinite(paid) || paid < 0 || paid > total) {
      setError("Paid must be between 0 and the total.");
      return;
    }
    setBusy(true);
    const res = await createBillApi({
      patientId,
      label: values.label.trim(),
      totalAmount: total,
      paidAmount: paid,
      method: values.method,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    toast(`Bill created for ${patientName}`);
    setOpen(false);
    setValues({ label: "", total: "", paid: "0", method: "cash" });
    router.refresh();
  }

  const fieldCls =
    "w-full min-h-[48px] rounded-xl border-2 border-[#E1EBF0] bg-white px-3.5 text-[14.5px] text-ink outline-none transition-colors focus:border-primary";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="min-h-[44px] rounded-xl border-2 border-primary px-4 font-heading text-[13px] font-bold text-primary transition-colors hover:bg-primary-light/60"
      >
        + New Bill
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex w-[420px] max-w-full animate-scale-in flex-col gap-3.5 rounded-[20px] bg-white p-6 shadow-[0_24px_60px_rgba(26,43,60,0.35)]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="New bill"
          >
            <div className="font-heading text-[18px] font-extrabold text-ink">
              New Bill — {patientName}
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="font-heading text-[12.5px] font-bold text-ink">For</span>
              <input
                className={fieldCls}
                placeholder="e.g. Root Canal — 1st visit"
                value={values.label}
                onChange={(e) => setValues((v) => ({ ...v, label: e.target.value }))}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="font-heading text-[12.5px] font-bold text-ink">Total (৳)</span>
                <input
                  className={fieldCls}
                  type="number"
                  value={values.total}
                  onChange={(e) => setValues((v) => ({ ...v, total: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-heading text-[12.5px] font-bold text-ink">Paid now (৳)</span>
                <input
                  className={fieldCls}
                  type="number"
                  value={values.paid}
                  onChange={(e) => setValues((v) => ({ ...v, paid: e.target.value }))}
                />
              </label>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-heading text-[12.5px] font-bold text-ink">Method</span>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHOD.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setValues((v) => ({ ...v, method: m }))}
                    className={cn(
                      "min-h-[44px] rounded-[11px] border-2 px-4 font-heading text-[12.5px] font-bold uppercase transition-colors",
                      values.method === m
                        ? "border-primary bg-primary text-white"
                        : "border-[#E1EBF0] bg-white text-ink-muted hover:border-primary/40",
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="text-[13.5px] text-danger">{error}</p>}
            <button
              type="button"
              disabled={busy}
              onClick={submit}
              className="min-h-[52px] rounded-xl bg-primary font-heading text-[15px] font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              {busy ? "Creating…" : "Create Bill ✓"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
