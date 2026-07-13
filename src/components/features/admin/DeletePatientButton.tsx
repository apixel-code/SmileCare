"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deletePatientApi } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

/** Admin-only: permanently delete a patient and all their records. */
export function DeletePatientButton({
  patientId,
  patientName,
}: {
  patientId: string;
  patientName: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (
      !window.confirm(
        `Delete ${patientName} permanently? This removes all their appointments, prescriptions, chart and payments. This cannot be undone.`,
      )
    )
      return;
    setBusy(true);
    const res = await deletePatientApi(patientId);
    setBusy(false);
    if (!res.ok) {
      toast(res.error);
      return;
    }
    toast(`${patientName} deleted`);
    router.push("/admin/patients");
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={remove}
      className="min-h-[44px] rounded-xl border-2 border-danger/40 px-4 font-heading text-[13px] font-bold text-danger transition-colors hover:bg-danger/10 disabled:opacity-60"
    >
      {busy ? "Deleting…" : "Delete Patient"}
    </button>
  );
}
