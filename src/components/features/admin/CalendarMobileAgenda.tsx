"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Cell {
  name: string;
  service: string;
  status: string;
  patientId: string;
}
interface DayCol {
  key: string;
  day: string;
  num: string;
  isToday: boolean;
}

const DOT: Record<string, string> = {
  waiting: "bg-primary",
  in_chamber: "bg-primary",
  completed: "bg-[#94A3B8]",
  no_show: "bg-cta",
};

/**
 * Mobile calendar — a day selector + vertical agenda for the picked day.
 * Replaces the wide week grid (which needs horizontal scroll) below md.
 */
export function CalendarMobileAgenda({
  days,
  map,
  times,
}: {
  days: DayCol[];
  map: Record<string, Record<string, Cell[]>>;
  times: readonly string[];
}) {
  const dayCount = (key: string) =>
    Object.values(map[key] ?? {}).reduce((n, c) => n + c.length, 0);

  const [sel, setSel] = useState(
    days.find((d) => d.isToday)?.key ?? days[0]?.key,
  );
  const dayMap = map[sel] ?? {};
  const slots = times.filter((t) => (dayMap[t]?.length ?? 0) > 0);
  const total = dayCount(sel);

  return (
    <div className="md:hidden">
      {/* Day selector — a fixed 6-up row, never scrolls */}
      <div className="grid grid-cols-6 gap-1.5">
        {days.map((d) => {
          const active = d.key === sel;
          const count = dayCount(d.key);
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setSel(d.key)}
              className={cn(
                "flex flex-col items-center rounded-xl border-2 px-0.5 py-1.5 transition-colors",
                active
                  ? "border-primary bg-primary text-white"
                  : "border-[#E1EBF0] bg-white text-ink hover:border-primary/40",
              )}
            >
              <span
                className={cn(
                  "text-[11px] font-semibold",
                  active ? "text-white/80" : "text-ink-muted",
                )}
              >
                {d.day}
              </span>
              <span className="font-heading text-[15px] font-extrabold leading-tight">
                {d.num.split(" ")[0]}
              </span>
              <span
                className={cn(
                  "mt-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-extrabold",
                  count === 0
                    ? active
                      ? "bg-white/20 text-white/70"
                      : "bg-[#EEF2F5] text-[#94A3B8]"
                    : active
                      ? "bg-white/25 text-white"
                      : "bg-primary-light text-primary",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected day agenda */}
      <div className="mt-4 flex flex-col gap-3">
        {total === 0 ? (
          <div className="rounded-2xl border border-[#E1EBF0] bg-white px-4 py-12 text-center text-[14px] text-ink-muted shadow-soft">
            No appointments on this day.
          </div>
        ) : (
          slots.map((t) => (
            <div key={t} className="flex gap-3">
              <div className="w-[62px] flex-none pt-2 text-right font-heading text-[12px] font-bold text-[#94A3B8]">
                {t}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                {dayMap[t].map((c, i) => (
                  <Link
                    key={i}
                    href={`/admin/patients/${c.patientId}`}
                    className="flex items-center gap-2.5 rounded-xl border border-[#E1EBF0] bg-white p-3 shadow-soft transition-transform active:scale-[0.99]"
                  >
                    <span
                      className={cn(
                        "h-9 w-1 flex-none rounded-full",
                        DOT[c.status] ?? DOT.completed,
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-heading text-[14px] font-bold text-ink">
                        {c.name}
                      </span>
                      <span className="block truncate text-[12.5px] text-ink-muted">
                        {c.service}
                      </span>
                    </span>
                    <span className="flex-none font-heading text-[16px] text-primary">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
