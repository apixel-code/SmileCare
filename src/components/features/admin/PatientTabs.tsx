"use client";

import { useState } from "react";
import { DentalChart } from "./DentalChart";
import { RxWriter } from "./RxWriter";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatTaka } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { AdminPatientProfile } from "@/server/services/admin.service";

const TABS = ["History", "Dental Chart", "Prescriptions", "Payments"] as const;

export function PatientTabs({ profile }: { profile: AdminPatientProfile }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("History");

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
          <div className="mb-4 font-heading text-[16px] font-extrabold text-ink">
            Payment Summary
          </div>
          {profile.payments.length === 0 ? (
            <div className="py-4 text-center text-[14px] text-ink-muted">
              No payments recorded yet. (Recording payments lands in the
              Payments module.)
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
