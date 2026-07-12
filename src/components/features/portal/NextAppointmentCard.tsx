"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelAppointment } from "@/lib/api";
import type { PortalAppointment } from "@/types/portal";

/** "Next Appointment" card — date tile, serial, Reschedule / Cancel. */
export function NextAppointmentCard({ appt }: { appt: PortalAppointment }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // dateLabel like "Sat, 18 Jul" → tile shows 18 / Jul
  const dayNum = appt.dateLabel.match(/(\d+)/)?.[1] ?? "";
  const monName = appt.dateLabel.split(" ").pop() ?? "";

  async function cancel() {
    if (!window.confirm("Cancel this appointment?")) return;
    setBusy(true);
    setError("");
    const res = await cancelAppointment(appt.id);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  async function reschedule() {
    if (
      !window.confirm(
        "Rescheduling cancels this appointment so you can pick a new time. Continue?",
      )
    )
      return;
    setBusy(true);
    const res = await cancelAppointment(appt.id);
    setBusy(false);
    if (res.ok) router.push("/book");
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_34px_rgba(26,43,60,0.12)]">
      <div className="flex items-center justify-between border-b border-[#EDF4F7] px-5 py-4">
        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary">
          Next Appointment
        </span>
        <span className="rounded-full bg-[#F0FBF4] px-3 py-1 font-heading text-[11.5px] font-bold text-[#1F8A5B]">
          CONFIRMED
        </span>
      </div>
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="flex h-[58px] w-[58px] flex-none flex-col items-center justify-center rounded-[14px] bg-primary-light">
          <span className="font-heading text-[20px] font-extrabold leading-none text-primary">
            {dayNum}
          </span>
          <span className="text-[11px] font-semibold text-ink-muted">
            {monName}
          </span>
        </div>
        <div className="flex-1">
          <div className="font-heading text-[16px] font-bold text-ink">
            {appt.dateLabel}, {appt.timeSlot}
          </div>
          <div className="mt-0.5 text-[13.5px] text-ink-muted">
            {appt.serviceName} · {appt.doctorName}
          </div>
        </div>
        <div className="flex-none text-center">
          <div className="text-[11px] font-semibold tracking-[0.06em] text-ink-muted">
            SERIAL
          </div>
          <div className="font-heading text-[24px] font-extrabold text-cta">
            #{appt.serialNo}
          </div>
        </div>
      </div>
      {error && (
        <p className="px-5 pb-2 text-[13px] text-danger" role="alert">
          {error}
        </p>
      )}
      <div className="grid grid-cols-2 border-t border-[#EDF4F7]">
        <button
          type="button"
          disabled={busy}
          onClick={reschedule}
          className="min-h-[50px] border-r border-[#EDF4F7] font-heading text-[14px] font-bold text-primary transition-colors hover:bg-[#F0F9F9] disabled:opacity-60"
        >
          Reschedule
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={cancel}
          className="min-h-[50px] font-heading text-[14px] font-bold text-ink-muted transition-colors hover:bg-[#F7F8FA] disabled:opacity-60"
        >
          {busy ? "…" : "Cancel"}
        </button>
      </div>
    </div>
  );
}
