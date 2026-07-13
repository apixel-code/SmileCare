"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { advanceQueue } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { StatusPill } from "@/components/ui/StatusPill";
import { cn } from "@/lib/utils";
import type { QueueRow } from "@/server/services/admin.service";

const ACTION: Record<string, { label: string; cls: string } | undefined> = {
  waiting: { label: "Call In", cls: "bg-primary hover:bg-primary-dark" },
  in_chamber: { label: "Mark Complete", cls: "bg-cta hover:bg-cta-dark" },
};

/** Today's queue — one advancing action per row, in-chamber highlighted. */
export function QueueTable({ rows: serverRows }: { rows: QueueRow[] }) {
  const router = useRouter();
  const toast = useToast();
  const [busyId, setBusyId] = useState<string | null>(null);
  // Optimistic status overrides — the UI flips instantly, the server syncs after.
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  // Fresh server data wins: drop local overrides whenever props update.
  useEffect(() => setOverrides({}), [serverRows]);

  const rows = serverRows.map((r) => ({
    ...r,
    status: overrides[r.id] ?? r.status,
  }));

  async function advance(row: QueueRow) {
    const next = row.status === "waiting" ? "in_chamber" : "completed";

    // Optimistic flip (and only one patient in the chamber at a time).
    setOverrides((prev) => {
      const map = { ...prev, [row.id]: next };
      if (next === "in_chamber") {
        for (const r of serverRows) {
          if (r.id !== row.id && (map[r.id] ?? r.status) === "in_chamber") {
            map[r.id] = "waiting";
          }
        }
      }
      return map;
    });
    toast(
      next === "in_chamber"
        ? `#${row.serialNo} ${row.name} called in`
        : `#${row.serialNo} ${row.name} completed`,
    );

    setBusyId(row.id);
    const res = await advanceQueue(row.id);
    setBusyId(null);
    if (!res.ok) {
      // Roll back — the server refused.
      setOverrides((prev) => {
        const map = { ...prev };
        delete map[row.id];
        return map;
      });
      toast(res.error);
      return;
    }
    router.refresh();
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E1EBF0] bg-white p-10 text-center text-[14.5px] text-ink-muted shadow-soft">
        No appointments in today&rsquo;s queue yet. Online bookings and
        walk-ins will appear here.
      </div>
    );
  }

  return (
    <>
      {/* Mobile: card list (no horizontal scroll) */}
      <div className="flex flex-col gap-2.5 md:hidden">
        {rows.map((row) => {
          const inChamber = row.status === "in_chamber";
          const action = ACTION[row.status];
          return (
            <div
              key={row.id}
              className={cn(
                "rounded-2xl border bg-white p-4 shadow-soft",
                inChamber ? "border-primary/40 bg-[#F0F9F9]" : "border-[#E1EBF0]",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "font-heading text-[26px] font-extrabold leading-none",
                    inChamber ? "text-primary" : "text-ink",
                  )}
                >
                  #{String(row.serialNo).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span
                      className="flex-none text-[15px]"
                      title={row.source === "online" ? "Booked online" : "Walk-in"}
                    >
                      {row.source === "online" ? "🌐" : "🚶"}
                    </span>
                    <Link
                      href={`/admin/patients/${row.patientId}`}
                      className="truncate text-[15px] font-bold text-ink hover:text-primary"
                    >
                      {row.name}
                    </Link>
                  </span>
                  <span className="mt-0.5 block text-[12.5px] text-ink-muted">
                    {row.phone}
                  </span>
                </span>
                <StatusPill status={row.status} />
              </div>
              <div className="mt-2.5 flex items-center gap-2 text-[13px] text-ink-muted">
                <span className="font-semibold text-ink">{row.service}</span>
                <span>·</span>
                <span className="font-heading font-bold">{row.time}</span>
              </div>
              {action && (
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => advance(row)}
                  className={cn(
                    "mt-3 min-h-[48px] w-full rounded-[11px] px-4 font-heading text-[14px] font-bold text-white transition-colors disabled:opacity-60",
                    action.cls,
                  )}
                >
                  {busyId === row.id ? "…" : action.label}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop: full table */}
      <div className="hidden overflow-x-auto rounded-[24px] border border-[#E1EBF0] bg-white shadow-[0_16px_44px_rgba(26,43,60,0.08)] md:block">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#E1EBF0] bg-primary-light/70">
            <Th className="pl-[18px]">SERIAL</Th>
            <Th>PATIENT</Th>
            <Th>SERVICE</Th>
            <Th>TIME</Th>
            <Th>STATUS</Th>
            <Th className="pr-[18px]">ACTION</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const inChamber = row.status === "in_chamber";
            const action = ACTION[row.status];
            return (
              <tr
                key={row.id}
                className={cn(
                  "border-b border-[#EDF4F7] border-l-4 last:border-b-0",
                  inChamber
                    ? "border-l-primary bg-[#F0F9F9]"
                    : "border-l-transparent bg-white",
                )}
              >
                <td
                  className={cn(
                    "px-[18px] py-3.5 font-heading text-[22px] font-extrabold",
                    inChamber ? "text-primary" : "text-ink",
                  )}
                >
                  #{String(row.serialNo).padStart(2, "0")}
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex-none text-[15px]"
                      title={row.source === "online" ? "Booked online" : "Walk-in"}
                    >
                      {row.source === "online" ? "🌐" : "🚶"}
                    </span>
                    <span className="min-w-0">
                      <Link
                        href={`/admin/patients/${row.patientId}`}
                        className="block truncate text-[14.5px] font-semibold text-ink hover:text-primary"
                      >
                        {row.name}
                      </Link>
                      <span className="block text-[12.5px] text-ink-muted">
                        {row.phone}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-[13.5px] text-ink">
                  {row.service}
                </td>
                <td className="px-3 py-3.5 font-heading text-[13.5px] font-bold text-ink-muted">
                  {row.time}
                </td>
                <td className="px-3 py-3.5">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-[18px] py-3.5">
                  {action ? (
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => advance(row)}
                      className={cn(
                        "w-full min-w-[140px] rounded-[11px] px-4 py-3 font-heading text-[13.5px] font-bold text-white transition-colors disabled:opacity-60",
                        action.cls,
                      )}
                    >
                      {busyId === row.id ? "…" : action.label}
                    </button>
                  ) : (
                    <span className="text-[12.5px] text-[#94A3B8]">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "px-3 py-3 font-heading text-[12px] font-bold tracking-[0.05em] text-ink-muted",
        className,
      )}
    >
      {children}
    </th>
  );
}
